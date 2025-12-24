import { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import { config } from '../config';

/**
 * Register Helmet for security headers
 */
export async function registerHelmet(app: FastifyInstance): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: config.server.isProduction ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", frontendUrl],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    } : {
      // More lenient CSP in development for Swagger UI and debugging
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", frontendUrl],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for Swagger UI
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: config.server.isProduction ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    } : false,
    frameguard: {
      action: 'deny',
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  });

  app.log.info('Security headers configured');
}
