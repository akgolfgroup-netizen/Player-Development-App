/**
 * Email Service Unit Tests
 * Tests email sending, graceful fallback, and template rendering
 */

import { EmailService } from '../../../src/domain/notifications/email.service';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const mockLogger = require('../../../src/utils/logger').logger;

describe('EmailService', () => {
  let emailService: EmailService;
  let mockTransporter: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransporter = {
      sendMail: jest.fn(),
      verify: jest.fn(),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    emailService = new EmailService();
  });

  describe('constructor', () => {
    it('should create transporter when SMTP is configured', () => {
      process.env.SMTP_HOST = 'smtp.gmail.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'test@example.com';
      process.env.SMTP_PASS = 'password';

      new EmailService();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'password',
        },
      });
    });

    it('should warn when SMTP is not configured', () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;

      new EmailService();

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('SMTP not configured')
      );
    });
  });

  describe('send', () => {
    beforeEach(() => {
      process.env.SMTP_HOST = 'smtp.gmail.com';
      process.env.SMTP_USER = 'test@example.com';
      process.env.SMTP_FROM_EMAIL = 'noreply@akgolf.com';
      process.env.SMTP_FROM_NAME = 'AK Golf IUP';
    });

    it('should send email successfully', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"AK Golf IUP" <noreply@akgolf.com>',
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          subject: 'Test Email',
        }),
        expect.stringContaining('Email sent successfully')
      );
    });

    it('should send email with text fallback', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
        text: 'Test',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"AK Golf IUP" <noreply@akgolf.com>',
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
        text: 'Test',
      });
    });

    it('should send email to multiple recipients', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"AK Golf IUP" <noreply@akgolf.com>',
        to: 'user1@example.com,user2@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });
    });

    it('should handle CC recipients', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        cc: ['cc1@example.com', 'cc2@example.com'],
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: 'cc1@example.com,cc2@example.com',
        })
      );
    });

    it('should handle BCC recipients', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        bcc: ['bcc1@example.com'],
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          bcc: 'bcc1@example.com',
        })
      );
    });

    it('should gracefully fallback to console.log when SMTP fails', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
        }),
        expect.stringContaining('Failed to send email')
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('EMAIL (fallback):')
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('To: user@example.com')
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Subject: Test Email')
      );

      consoleLogSpy.mockRestore();
    });

    it('should fallback to console.log when transporter is not configured', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Create service without SMTP configuration
      delete process.env.SMTP_HOST;
      const unconfiguredService = new EmailService();

      await unconfiguredService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('EMAIL (fallback):')
      );

      consoleLogSpy.mockRestore();
    });

    // Attachments not supported in current EmailOptions interface
  });

  describe('verify', () => {
    it('should verify SMTP connection successfully', async () => {
      process.env.SMTP_HOST = 'smtp.gmail.com';
      process.env.SMTP_USER = 'test@example.com';

      mockTransporter.verify.mockResolvedValue(true);

      const result = await emailService.verify();

      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('SMTP connection verified')
      );
    });

    it('should return false when SMTP connection fails', async () => {
      process.env.SMTP_HOST = 'smtp.gmail.com';
      process.env.SMTP_USER = 'test@example.com';

      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.verify();

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
        }),
        expect.stringContaining('SMTP verification failed')
      );
    });

    it('should return false when transporter is not configured', async () => {
      delete process.env.SMTP_HOST;
      const unconfiguredService = new EmailService();

      const result = await unconfiguredService.verify();

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('SMTP not configured')
      );
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      process.env.SMTP_HOST = 'smtp.gmail.com';
      process.env.SMTP_USER = 'test@example.com';
    });

    it('should handle network errors gracefully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      mockTransporter.sendMail.mockRejectedValue(new Error('Network unreachable'));

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test',
        html: '<h1>Test</h1>',
      });

      expect(mockLogger.error).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle authentication errors gracefully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      mockTransporter.sendMail.mockRejectedValue(new Error('Authentication failed'));

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test',
        html: '<h1>Test</h1>',
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Authentication failed',
          }),
        }),
        expect.any(String)
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle timeout errors gracefully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      mockTransporter.sendMail.mockRejectedValue(new Error('Connection timeout'));

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test',
        html: '<h1>Test</h1>',
      });

      expect(mockLogger.error).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });

  describe('template rendering', () => {
    it('should handle HTML templates', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const htmlTemplate = `
        <div style="font-family: Arial;">
          <h1>Welcome</h1>
          <p>Thank you for joining!</p>
        </div>
      `;

      await emailService.send({
        to: 'user@example.com',
        subject: 'Welcome',
        html: htmlTemplate,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('Welcome'),
        })
      );
    });

    it('should handle plain text emails with HTML', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        subject: 'Welcome',
        html: '<p>Welcome! Thank you for joining!</p>',
        text: 'Welcome! Thank you for joining!',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Welcome! Thank you for joining!',
        })
      );
    });
  });
});
