import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { PrismaClient, Tenant } from '@prisma/client';
import { AccessTokenPayload } from '../utils/jwt';
import { Server, IncomingMessage, ServerResponse } from 'http';

// Type alias for FastifyInstance that accepts any logger type
// This fixes type compatibility when using custom pino logger
export type AnyFastifyInstance = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

declare module 'fastify' {
  interface FastifyRequest {
    user?: AccessTokenPayload;
    tenant?: Tenant;
    db?: PrismaClient;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Helper type for authenticated requests where user is guaranteed
export interface AuthenticatedRequest extends FastifyRequest {
  user: AccessTokenPayload;
}

// Helper type for requests with tenant context
export interface TenantRequest extends AuthenticatedRequest {
  tenant: Tenant;
  db: PrismaClient;
}
