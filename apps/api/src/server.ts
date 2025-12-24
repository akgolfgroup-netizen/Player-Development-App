import { startServer } from './app';
import { logger } from './utils/logger';
import { startDataGolfSyncJob } from './jobs/datagolf-sync.job';

/**
 * Server entry point
 */
async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting IUP Golf Academy API...');

    const app = await startServer();

    // Log startup banner
    const address = app.server.address();
    const port = typeof address === 'string' ? 3000 : address?.port || 3000;

    // Start cron jobs
    startDataGolfSyncJob();

    logger.info(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        IUP Golf Academy API - Ready! 🏌️              ║
║                                                       ║
║  📚 Documentation: http://localhost:${port}/docs      ║
║  ❤️  Health Check: http://localhost:${port}/health   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    logger.error({ err: error }, '❌ Fatal error during startup');
    process.exit(1);
  }
}

// Start the server
main();
