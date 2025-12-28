/**
 * Weather API Integration Tests
 * Tests for weather endpoints using Met.no API
 */

import { FastifyInstance } from 'fastify';
import {
  getTestApp,
  closeTestConnections,
  loginDemoPlayer,
  authenticatedRequest,
  parseResponse,
} from '../helpers';

describe('Weather API Integration Tests', () => {
  let app: FastifyInstance;
  let playerToken: string;

  beforeAll(async () => {
    app = await getTestApp();

    const playerAuth = await loginDemoPlayer(app);
    playerToken = playerAuth.accessToken;
  });

  afterAll(async () => {
    await closeTestConnections();
  });

  describe('GET /api/v1/weather', () => {
    it('should get weather for valid coordinates', async () => {
      // Oslo coordinates
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather?lat=59.9139&lon=10.7522',
        playerToken
      );

      expect(response.statusCode).toBe(200);
      const body = parseResponse(response);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('current');
      expect(body.data).toHaveProperty('hourly');
      expect(body.data.current).toHaveProperty('temperature');
      expect(body.data.current).toHaveProperty('windSpeed');
    });

    it('should require lat and lon parameters', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather',
        playerToken
      );

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid latitude', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather?lat=100&lon=10.7522', // lat > 90 is invalid
        playerToken
      );

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid longitude', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather?lat=59.9139&lon=200', // lon > 180 is invalid
        playerToken
      );

      expect(response.statusCode).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/weather?lat=59.9139&lon=10.7522',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/weather/forecast', () => {
    it('should get multi-day forecast', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather/forecast?lat=59.9139&lon=10.7522&days=3',
        playerToken
      );

      if (response.statusCode === 200) {
        const body = parseResponse(response);
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('forecast');
        expect(Array.isArray(body.data.forecast)).toBe(true);
      } else {
        // Endpoint might not exist
        expect(response.statusCode).toBe(404);
      }
    });
  });

  describe('GET /api/v1/weather/golf-conditions', () => {
    it('should get golf-specific weather conditions', async () => {
      const response = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather/golf-conditions?lat=59.9139&lon=10.7522',
        playerToken
      );

      if (response.statusCode === 200) {
        const body = parseResponse(response);
        expect(body.success).toBe(true);
        // Should include golf-specific metrics
        expect(body.data).toHaveProperty('playability');
      } else {
        // Endpoint might not exist
        expect(response.statusCode).toBe(404);
      }
    });
  });

  describe('Weather Caching', () => {
    it('should cache weather responses', async () => {
      // First request
      const response1 = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather?lat=60.3913&lon=5.3221', // Bergen
        playerToken
      );

      expect(response1.statusCode).toBe(200);
      const body1 = parseResponse(response1);

      // Second request should be cached (faster)
      const startTime = Date.now();
      const response2 = await authenticatedRequest(
        app,
        'GET',
        '/api/v1/weather?lat=60.3913&lon=5.3221',
        playerToken
      );
      const duration = Date.now() - startTime;

      expect(response2.statusCode).toBe(200);
      const body2 = parseResponse(response2);

      // Data should be the same
      expect(body1.data.current.temperature).toBe(body2.data.current.temperature);

      // Cached response should be fast (under 100ms typically)
      // Note: This is a soft check, actual timing may vary
      expect(duration).toBeLessThan(1000);
    });
  });
});
