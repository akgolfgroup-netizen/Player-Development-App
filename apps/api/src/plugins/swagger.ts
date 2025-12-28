import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { config } from '../config';
import { AnyFastifyInstance } from '../types/fastify';

/**
 * Register Swagger/OpenAPI documentation
 */
export async function registerSwagger(app: AnyFastifyInstance): Promise<void> {
  // Add shared schemas that can be referenced by all routes
  app.addSchema({
    $id: 'Error',
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object', nullable: true },
        },
      },
    },
  });

  // Register Swagger plugin
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'IUP Golf Academy API',
        description: 'Enterprise-grade backend for Individual Development Plan (IUP) system for golf training academies',
        version: '1.0.0',
        contact: {
          name: 'AK Golf Academy',
          email: 'anders@akgolf.no',
        },
        license: {
          name: 'UNLICENSED',
        },
      },
      servers: [
        {
          url: config.server.isDevelopment
            ? `http://localhost:${config.server.port}`
            : 'https://api.iup-golf.com',
          description: config.server.isDevelopment ? 'Development server' : 'Production server',
        },
      ],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'tenants', description: 'Tenant management' },
        { name: 'players', description: 'Player management' },
        { name: 'coaches', description: 'Coach management' },
        { name: 'exercises', description: 'Exercise library' },
        { name: 'sessions', description: 'Training session templates' },
        { name: 'week-plans', description: 'Weekly training plans' },
        { name: 'tests', description: 'Testing and evaluation' },
        { name: 'benchmarks', description: 'Quarterly benchmarking' },
        { name: 'breaking-points', description: 'Performance improvement tracking' },
        { name: 'tournaments', description: 'Tournament management' },
        { name: 'events', description: 'Calendar and events' },
        { name: 'media', description: 'Media uploads and storage' },
        { name: 'notifications', description: 'Notifications' },
        { name: 'analytics', description: 'Analytics and reporting' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT access token for authentication',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string', example: 'NOT_FOUND' },
                  message: { type: 'string', example: 'Resource not found' },
                  details: { type: 'object', nullable: true },
                },
              },
            },
          },
          SuccessResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
          PaginationMeta: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 100 },
              limit: { type: 'integer', example: 50 },
              offset: { type: 'integer', example: 0 },
              hasMore: { type: 'boolean', example: true },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  // Register Swagger UI
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      filter: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  app.log.info('Swagger documentation registered at /docs');
}
