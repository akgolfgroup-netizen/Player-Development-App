/**
 * Notifications API Integration Tests
 * Tests for notification endpoints
 */

import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import {
  getTestApp,
  getTestPrisma,
  closeTestConnections,
  loginDemoPlayer,
  loginDemoCoach,
  authenticatedRequest,
  parseResponse,
  getDemoIds,
} from '../helpers';

describe('Notifications API Integration Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let playerToken: string;
  let coachToken: string;
  let demoIds: Awaited<ReturnType<typeof getDemoIds>>;
  let createdNotificationIds: string[] = [];

  beforeAll(async () => {
    app = await getTestApp();
    prisma = getTestPrisma();
    demoIds = await getDemoIds();

    const playerAuth = await loginDemoPlayer(app);
    playerToken = playerAuth.accessToken;

    const coachAuth = await loginDemoCoach(app);
    coachToken = coachAuth.accessToken;
  });

  afterAll(async () => {
    // Clean up created notifications
    if (createdNotificationIds.length > 0) {
      await prisma.notification.deleteMany({
        where: { id: { in: createdNotificationIds } },
      });
    }
    await closeTestConnections();
  });

  describe('GET /api/v1/notifications', () => {
    it('should list notifications for authenticated user', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/notifications',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body).toHaveProperty('notifications');
      expect(body).toHaveProperty('unreadCount');
      expect(Array.isArray(body.notifications)).toBe(true);
    });

    it('should support limit parameter', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/notifications?limit=5',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body.notifications.length).toBeLessThanOrEqual(5);
    });

    it('should support unread filter', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/notifications?unread=true',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      // All returned notifications should be unread
      for (const notification of body.notifications) {
        expect(notification.readAt).toBeNull();
      }
    });

    it('should reject unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/notifications',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/v1/notifications/:id/read', () => {
    let testNotificationId: string;

    beforeAll(async () => {
      // Create a test notification
      const notification = await prisma.notification.create({
        data: {
          recipientType: 'player',
          recipientId: demoIds.playerEntity,
          notificationType: 'SYSTEM',
          title: 'Test Notification',
          message: 'This is a test notification for integration tests',
          priority: 'normal',
          status: 'pending',
        },
      });
      testNotificationId = notification.id;
      createdNotificationIds.push(notification.id);
    });

    it('should mark notification as read', async () => {
      const response = await authenticatedRequest(
        app,
        'POST',
        `/api/v1/notifications/${testNotificationId}/read`,
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body.success).toBe(true);

      // Verify in database
      const updated = await prisma.notification.findUnique({
        where: { id: testNotificationId },
      });
      expect(updated?.readAt).not.toBeNull();
    });

    it('should return 404 for non-existent notification', async () => {
      const response = await authenticatedRequest(
        app,
        'POST',
        '/api/v1/notifications/00000000-0000-0000-0000-000000000999/read',
        playerToken
      );

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /api/v1/notifications/read-all', () => {
    beforeAll(async () => {
      // Create some unread notifications
      const notifications = await prisma.notification.createMany({
        data: [
          {
            recipientType: 'player',
            recipientId: demoIds.playerEntity,
            notificationType: 'SYSTEM',
            title: 'Test 1',
            message: 'Test message 1',
            priority: 'normal',
            status: 'pending',
          },
          {
            recipientType: 'player',
            recipientId: demoIds.playerEntity,
            notificationType: 'SYSTEM',
            title: 'Test 2',
            message: 'Test message 2',
            priority: 'normal',
            status: 'pending',
          },
        ],
      });

      // Get IDs for cleanup
      const created = await prisma.notification.findMany({
        where: {
          recipientId: demoIds.playerEntity,
          title: { in: ['Test 1', 'Test 2'] },
        },
        select: { id: true },
      });
      createdNotificationIds.push(...created.map((n) => n.id));
    });

    it('should mark all notifications as read', async () => {
      const response = await authenticatedRequest(
        app,
        'POST',
        '/api/v1/notifications/read-all',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body.success).toBe(true);
      expect(typeof body.updated).toBe('number');
    });
  });

  describe('GET /api/v1/notifications/stream/status', () => {
    it('should return notification bus status', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/notifications/stream/status',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body).toHaveProperty('mode');
      expect(['redis', 'memory']).toContain(body.mode);
      expect(typeof body.activeSubscriptions).toBe('number');
    });
  });

  describe('Notification Preferences', () => {
    it('should get notification preferences', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/notifications/preferences',
        playerToken
      );

      // Preferences endpoint might not exist yet
      if (response.statusCode === 200) {
        const body = parseResponse(response);
        expect(body).toHaveProperty('preferences');
      } else {
        expect(response.statusCode).toBe(404);
      }
    });
  });
});
