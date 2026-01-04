import path from 'node:path';
import type { PrismaConfig } from 'prisma';

/**
 * Prisma 7 Configuration
 * Connection URLs are now configured here instead of schema.prisma
 */
export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),

  // Database connection for migrations
  migrate: {
    async url() {
      return process.env.DATABASE_URL!;
    },
  },
} satisfies PrismaConfig;
