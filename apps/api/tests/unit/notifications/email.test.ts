/**
 * Email Service Unit Tests
 * Tests email sending, graceful fallback, and template rendering
 */

import { EmailService } from '../../../src/domain/notifications/email.service';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockTransporter: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransporter = {
      sendMail: jest.fn(),
      verify: jest.fn(),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Set up valid SMTP config
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'password';
    process.env.SMTP_FROM_EMAIL = 'noreply@akgolf.com';
    process.env.SMTP_FROM_NAME = 'AK Golf IUP';

    emailService = new EmailService();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM_EMAIL;
    delete process.env.SMTP_FROM_NAME;
  });

  describe('constructor', () => {
    it('should create transporter when SMTP is configured', () => {
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
      delete process.env.SMTP_PASS;

      new EmailService();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Email service not configured')
      );
    });
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'AK Golf IUP <noreply@akgolf.com>',
          to: 'user@example.com',
          subject: 'Test Email',
          html: '<h1>Test</h1>',
        })
      );
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

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'AK Golf IUP <noreply@akgolf.com>',
          to: 'user1@example.com, user2@example.com',
          subject: 'Test Email',
          html: '<h1>Test</h1>',
        })
      );
    });

    it('should fallback to console.log when transporter is not configured', async () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      const unconfiguredService = new EmailService();

      await unconfiguredService.send({
        to: 'user@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>',
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('EMAIL (Development Mode)')
      );
    });
  });

  describe('verify', () => {
    it('should verify SMTP connection successfully', async () => {
      mockTransporter.verify.mockResolvedValue(true);

      const result = await emailService.verify();

      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('should return false when SMTP connection fails', async () => {
      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.verify();

      expect(result).toBe(false);
    });

    it('should return false when transporter is not configured', async () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      const unconfiguredService = new EmailService();

      const result = await unconfiguredService.verify();

      expect(result).toBe(false);
    });
  });

  describe('isConfigured', () => {
    it('should return true when all SMTP env vars are set', () => {
      // Service was created with valid config in beforeEach
      // If transporter was created, it means isConfigured returned true
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });

    it('should return false when SMTP_HOST is missing', () => {
      delete process.env.SMTP_HOST;
      new EmailService();

      // Should warn about not being configured
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('not configured')
      );
    });
  });
});
