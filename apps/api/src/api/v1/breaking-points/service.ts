import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../../middleware/errors';
import {
  CreateBreakingPointInput,
  UpdateBreakingPointInput,
  UpdateProgressInput,
  ListBreakingPointsQuery,
} from './schema';

/**
 * Breaking point with player relations
 */
type BreakingPointWithPlayer = Prisma.BreakingPointGetPayload<{
  include: {
    player: { select: { id: true; firstName: true; lastName: true; category: true } };
  };
}>;

/**
 * Success history entry
 */
interface SuccessHistoryEntry {
  date: string;
  measurement: string;
  notes?: string;
}

export interface BreakingPointListResponse {
  breakingPoints: BreakingPointWithPlayer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BreakingPointService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new breaking point
   */
  async createBreakingPoint(tenantId: string, input: CreateBreakingPointInput): Promise<BreakingPointWithPlayer> {
    // Verify player exists
    const player = await this.prisma.player.findFirst({
      where: { id: input.playerId, tenantId },
    });

    if (!player) {
      throw new BadRequestError('Player not found');
    }

    // Verify exercises exist if assigned
    if (input.assignedExerciseIds.length > 0) {
      const exercises = await this.prisma.exercise.findMany({
        where: {
          id: { in: input.assignedExerciseIds },
          tenantId,
        },
      });

      if (exercises.length !== input.assignedExerciseIds.length) {
        throw new BadRequestError('One or more assigned exercises not found');
      }
    }

    const breakingPoint = await this.prisma.breakingPoint.create({
      data: {
        playerId: input.playerId,
        processCategory: input.processCategory,
        specificArea: input.specificArea,
        description: input.description,
        identifiedDate: new Date(input.identifiedDate),
        severity: input.severity,
        baselineMeasurement: input.baselineMeasurement,
        targetMeasurement: input.targetMeasurement,
        currentMeasurement: input.currentMeasurement,
        progressPercent: input.progressPercent,
        assignedExerciseIds: input.assignedExerciseIds,
        hoursPerWeek: input.hoursPerWeek,
        status: input.status,
        successHistory: input.successHistory as Prisma.InputJsonValue,
        resolvedDate: input.resolvedDate ? new Date(input.resolvedDate) : null,
        notes: input.notes,
      },
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
    });

    return breakingPoint;
  }

  /**
   * Get breaking point by ID
   */
  async getBreakingPointById(tenantId: string, breakingPointId: string): Promise<BreakingPointWithPlayer> {
    const breakingPoint = await this.prisma.breakingPoint.findFirst({
      where: {
        id: breakingPointId,
        player: { tenantId },
      },
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
    });

    if (!breakingPoint) {
      throw new NotFoundError('Breaking point not found');
    }

    // Get assigned exercises details
    if (breakingPoint.assignedExerciseIds.length > 0) {
      const exercises = await this.prisma.exercise.findMany({
        where: {
          id: { in: breakingPoint.assignedExerciseIds },
          tenantId,
        },
        select: {
          id: true,
          name: true,
          exerciseType: true,
          difficulty: true,
        },
      });

      // Return with exercises as extended property (type assertion for additional data)
      return {
        ...breakingPoint,
        assignedExercises: exercises,
      } as BreakingPointWithPlayer & { assignedExercises: typeof exercises };
    }

    return breakingPoint;
  }

  /**
   * List breaking points with filters and pagination
   */
  async listBreakingPoints(tenantId: string, query: ListBreakingPointsQuery): Promise<BreakingPointListResponse> {
    const {
      page = 1,
      limit = 50,
      playerId,
      processCategory,
      severity,
      status,
      search,
      sortBy,
      sortOrder,
    } = query;

    // Build where clause
    const where: Prisma.BreakingPointWhereInput = {
      player: { tenantId },
    };

    if (playerId) {
      where.playerId = playerId;
    }

    if (processCategory) {
      where.processCategory = processCategory;
    }

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { specificArea: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await this.prisma.breakingPoint.count({ where });

    // Get breaking points
    const breakingPoints = await this.prisma.breakingPoint.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
    });

    return {
      breakingPoints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update breaking point
   */
  async updateBreakingPoint(
    tenantId: string,
    breakingPointId: string,
    input: UpdateBreakingPointInput
  ): Promise<BreakingPointWithPlayer> {
    // Check if breaking point exists
    const existing = await this.prisma.breakingPoint.findFirst({
      where: {
        id: breakingPointId,
        player: { tenantId },
      },
    });

    if (!existing) {
      throw new NotFoundError('Breaking point not found');
    }

    // Verify exercises if updating assigned exercises
    if (input.assignedExerciseIds && input.assignedExerciseIds.length > 0) {
      const exercises = await this.prisma.exercise.findMany({
        where: {
          id: { in: input.assignedExerciseIds },
          tenantId,
        },
      });

      if (exercises.length !== input.assignedExerciseIds.length) {
        throw new BadRequestError('One or more assigned exercises not found');
      }
    }

    // Build update data
    const updateData: Prisma.BreakingPointUpdateInput = {};

    if (input.processCategory !== undefined) updateData.processCategory = input.processCategory;
    if (input.specificArea !== undefined) updateData.specificArea = input.specificArea;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.identifiedDate !== undefined) updateData.identifiedDate = new Date(input.identifiedDate);
    if (input.severity !== undefined) updateData.severity = input.severity;
    if (input.baselineMeasurement !== undefined) updateData.baselineMeasurement = input.baselineMeasurement;
    if (input.targetMeasurement !== undefined) updateData.targetMeasurement = input.targetMeasurement;
    if (input.currentMeasurement !== undefined) updateData.currentMeasurement = input.currentMeasurement;
    if (input.progressPercent !== undefined) updateData.progressPercent = input.progressPercent;
    if (input.assignedExerciseIds !== undefined) updateData.assignedExerciseIds = input.assignedExerciseIds;
    if (input.hoursPerWeek !== undefined) updateData.hoursPerWeek = input.hoursPerWeek;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.successHistory !== undefined) updateData.successHistory = input.successHistory;
    if (input.resolvedDate !== undefined) {
      updateData.resolvedDate = input.resolvedDate ? new Date(input.resolvedDate) : null;
    }
    if (input.notes !== undefined) updateData.notes = input.notes;

    // Auto-set resolvedDate when status changes to completed
    if (input.status === 'completed' && !existing.resolvedDate) {
      updateData.resolvedDate = new Date();
    }

    const breakingPoint = await this.prisma.breakingPoint.update({
      where: { id: breakingPointId },
      data: updateData,
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
    });

    return breakingPoint;
  }

  /**
   * Update progress (quick update)
   */
  async updateProgress(
    tenantId: string,
    breakingPointId: string,
    input: UpdateProgressInput
  ): Promise<BreakingPointWithPlayer> {
    const existing = await this.prisma.breakingPoint.findFirst({
      where: {
        id: breakingPointId,
        player: { tenantId },
      },
    });

    if (!existing) {
      throw new NotFoundError('Breaking point not found');
    }

    // Add to success history
    const successHistory = (existing.successHistory as SuccessHistoryEntry[] | null) ?? [];
    const newEntry: SuccessHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      measurement: input.currentMeasurement || '',
      notes: input.notes,
    };
    successHistory.push(newEntry);

    const updateData: Prisma.BreakingPointUpdateInput = {
      currentMeasurement: input.currentMeasurement,
      progressPercent: input.progressPercent,
      successHistory: successHistory as unknown as Prisma.InputJsonValue,
    };

    if (input.status) {
      updateData.status = input.status;

      // Auto-set resolvedDate when status changes to completed
      if (input.status === 'completed' && !existing.resolvedDate) {
        updateData.resolvedDate = new Date();
      }
    }

    if (input.notes) {
      updateData.notes = input.notes;
    }

    const breakingPoint = await this.prisma.breakingPoint.update({
      where: { id: breakingPointId },
      data: updateData,
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            category: true,
          },
        },
      },
    });

    return breakingPoint;
  }

  /**
   * Delete breaking point
   */
  async deleteBreakingPoint(tenantId: string, breakingPointId: string): Promise<void> {
    const breakingPoint = await this.prisma.breakingPoint.findFirst({
      where: {
        id: breakingPointId,
        player: { tenantId },
      },
    });

    if (!breakingPoint) {
      throw new NotFoundError('Breaking point not found');
    }

    await this.prisma.breakingPoint.delete({
      where: { id: breakingPointId },
    });
  }
}
