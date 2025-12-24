import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../../middleware/errors';
import { CreateCoachInput, UpdateCoachInput, ListCoachesQuery } from './schema';

export interface CoachListResponse {
  coaches: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CoachStatistics {
  coach: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  players: {
    total: number;
    active: number;
    byCategory: Record<string, number>;
  };
  sessions: {
    thisWeek: number;
    thisMonth: number;
    totalHours: number;
  };
}

export class CoachService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new coach
   */
  async createCoach(tenantId: string, input: CreateCoachInput): Promise<any> {
    // Check if email already exists for this tenant
    const existingCoach = await this.prisma.coach.findFirst({
      where: {
        tenantId,
        email: input.email,
      },
    });

    if (existingCoach) {
      throw new ConflictError('A coach with this email already exists');
    }

    // Create coach
    const coach = await this.prisma.coach.create({
      data: {
        tenantId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        specializations: input.specializations || [],
        certifications: input.certifications || [],
        workingHours: input.workingHours || {},
        maxPlayersPerSession: input.maxPlayersPerSession,
        hourlyRate: input.hourlyRate,
        role: input.role,
        color: input.color,
        status: input.status,
        profileImageUrl: input.profileImageUrl,
      },
    });

    return coach;
  }

  /**
   * Get coach by ID
   */
  async getCoachById(tenantId: string, coachId: string): Promise<any> {
    const coach = await this.prisma.coach.findFirst({
      where: {
        id: coachId,
        tenantId,
      },
      include: {
        _count: {
          select: {
            players: true,
            trainingSessions: true,
          },
        },
      },
    });

    if (!coach) {
      throw new NotFoundError('Coach not found');
    }

    return coach;
  }

  /**
   * List coaches with filters and pagination
   */
  async listCoaches(tenantId: string, query: ListCoachesQuery): Promise<CoachListResponse> {
    const { page = 1, limit = 20, search, status, specialization, sortBy, sortOrder } = query;

    // Build where clause
    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (specialization) {
      where.specializations = {
        array_contains: specialization,
      };
    }

    // Get total count
    const total = await this.prisma.coach.count({ where });

    // Get coaches
    const coaches = await this.prisma.coach.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    return {
      coaches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update coach
   */
  async updateCoach(tenantId: string, coachId: string, input: UpdateCoachInput): Promise<any> {
    // Check if coach exists
    const existingCoach = await this.prisma.coach.findFirst({
      where: { id: coachId, tenantId },
    });

    if (!existingCoach) {
      throw new NotFoundError('Coach not found');
    }

    // Check email uniqueness if updating email
    if (input.email && input.email !== existingCoach.email) {
      const emailExists = await this.prisma.coach.findFirst({
        where: {
          tenantId,
          email: input.email,
          id: { not: coachId },
        },
      });

      if (emailExists) {
        throw new ConflictError('A coach with this email already exists');
      }
    }

    // Build update data
    const updateData: any = {};

    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.specializations !== undefined) updateData.specializations = input.specializations;
    if (input.certifications !== undefined) updateData.certifications = input.certifications;
    if (input.workingHours !== undefined) updateData.workingHours = input.workingHours;
    if (input.maxPlayersPerSession !== undefined) updateData.maxPlayersPerSession = input.maxPlayersPerSession;
    if (input.hourlyRate !== undefined) updateData.hourlyRate = input.hourlyRate;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.profileImageUrl !== undefined) updateData.profileImageUrl = input.profileImageUrl;

    // Update coach
    const coach = await this.prisma.coach.update({
      where: { id: coachId },
      data: updateData,
    });

    return coach;
  }

  /**
   * Delete coach
   */
  async deleteCoach(tenantId: string, coachId: string): Promise<void> {
    const coach = await this.prisma.coach.findFirst({
      where: { id: coachId, tenantId },
    });

    if (!coach) {
      throw new NotFoundError('Coach not found');
    }

    await this.prisma.coach.delete({
      where: { id: coachId },
    });
  }

  /**
   * Get coach availability for a date range
   */
  async getAvailability(tenantId: string, coachId: string, startDate: string, endDate: string): Promise<any[]> {
    await this.getCoachById(tenantId, coachId);

    const availability = await this.prisma.availability.findMany({
      where: {
        coachId,
        isActive: true,
        validFrom: {
          lte: new Date(endDate),
        },
        OR: [
          {
            validUntil: null,
          },
          {
            validUntil: {
              gte: new Date(startDate),
            },
          },
        ],
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });

    return availability;
  }

  /**
   * Get coach statistics
   */
  async getStatistics(tenantId: string, coachId: string): Promise<CoachStatistics> {
    const coach = await this.getCoachById(tenantId, coachId);

    // Get players assigned to this coach
    const players = await this.prisma.player.findMany({
      where: {
        tenantId,
        coachId,
      },
    });

    const activePlayers = players.filter((p) => p.status === 'active').length;

    // Count players by category
    const byCategory: Record<string, number> = {};
    players.forEach((player) => {
      byCategory[player.category] = (byCategory[player.category] || 0) + 1;
    });

    // Get training sessions
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const sessionsThisWeek = await this.prisma.trainingSession.count({
      where: {
        coachId,
        sessionDate: {
          gte: weekStart,
        },
      },
    });

    const sessionsThisMonth = await this.prisma.trainingSession.count({
      where: {
        coachId,
        sessionDate: {
          gte: monthStart,
        },
      },
    });

    const allSessions = await this.prisma.trainingSession.findMany({
      where: {
        coachId,
      },
      select: {
        duration: true,
      },
    });

    const totalHours = Math.round(
      allSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60
    );

    return {
      coach: {
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
      },
      players: {
        total: players.length,
        active: activePlayers,
        byCategory,
      },
      sessions: {
        thisWeek: sessionsThisWeek,
        thisMonth: sessionsThisMonth,
        totalHours,
      },
    };
  }

  /**
   * Get the start of the current week (Monday)
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
}
