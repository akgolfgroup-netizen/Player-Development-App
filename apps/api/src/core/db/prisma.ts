import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import { config } from '../../config';

/**
 * Create Prisma Client singleton
 */
let prisma: PrismaClient;

/**
 * Get Prisma Client instance
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: config.server.isDevelopment
        ? ([
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'event' },
            { level: 'warn', emit: 'event' },
          ] as any)
        : ([{ level: 'error', emit: 'event' }] as any),
    });

    // Log queries in development
    if (config.server.isDevelopment) {
      (prisma as any).$on('query', (e: any) => {
        logger.debug({
          query: e.query,
          params: e.params,
          duration: e.duration,
        }, 'Prisma query');
      });
    }

    // Log errors
    (prisma as any).$on('error', (e: any) => {
      logger.error({ err: e }, 'Prisma error');
    });

    // Log warnings
    (prisma as any).$on('warn', (e: any) => {
      logger.warn({ message: e.message }, 'Prisma warning');
    });

    // Handle graceful shutdown (only in production, not in tests)
    if (process.env.NODE_ENV !== 'test') {
      let isDisconnecting = false;
      process.on('beforeExit', async () => {
        if (!isDisconnecting) {
          isDisconnecting = true;
          await prisma.$disconnect();
          logger.info('Prisma client disconnected');
        }
      });
    }
  }

  return prisma;
}

/**
 * Create a Prisma client with tenant context
 * All queries will be automatically filtered by tenantId
 */
export function createTenantPrismaClient(tenantId: string) {
  const prisma = getPrismaClient();

  return prisma.$extends({
    query: {
      // Apply tenant filter to all models that have tenantId field
      $allModels: {
        async findMany({ args, query, model }: any) {
          // Check if model has tenantId field
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findFirst({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findUnique({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async count({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async aggregate({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async create({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.data = { ...args.data, tenantId };
          }
          return query(args);
        },
        async createMany({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item: any) => ({ ...item, tenantId }));
            } else {
              args.data = { ...args.data, tenantId };
            }
          }
          return query(args);
        },
        async update({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async updateMany({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async delete({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async deleteMany({ args, query, model }: any) {
          if (hasTenantIdField(model)) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
      },
    },
  });
}

/**
 * Check if model has tenantId field
 * Models without tenantId: Tenant, User, RefreshToken (these are global or user-specific)
 */
function hasTenantIdField(modelName: string): boolean {
  const modelsWithoutTenantId = ['Tenant', 'User', 'RefreshToken'];
  return !modelsWithoutTenantId.includes(modelName);
}

/**
 * Connect to database
 */
export async function connectDatabase(): Promise<void> {
  const prisma = getPrismaClient();
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to database');
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  const prisma = getPrismaClient();
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to disconnect from database');
    throw error;
  }
}

// Export default instance
export default getPrismaClient();
