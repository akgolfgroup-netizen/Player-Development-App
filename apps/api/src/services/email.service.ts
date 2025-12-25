import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';

/**
 * Email Service
 *
 * Handles email template rendering and sending using Handlebars templates
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
  }>;
}

export enum EmailTemplate {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  PASSWORD_CHANGED = 'password-changed',
  TWO_FACTOR_SETUP = '2fa-setup',
  TRAINING_REMINDER = 'training-reminder',
  TEST_RESULTS = 'test-results',
  ACHIEVEMENT_UNLOCKED = 'achievement-unlocked',
  WEEKLY_SUMMARY = 'weekly-summary',
}

export class EmailService {
  private transporter: Transporter;
  private templatesDir: string;
  private baseTemplate: HandlebarsTemplateDelegate;

  constructor() {
    this.templatesDir = join(__dirname, '../templates/emails');

    // Load base template
    const baseHtml = readFileSync(join(this.templatesDir, 'base.html'), 'utf-8');
    this.baseTemplate = Handlebars.compile(baseHtml);

    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });

    // Register Handlebars helpers
    this.registerHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    // Format date helper
    Handlebars.registerHelper('formatDate', (date: Date | string, format: string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (format === 'short') {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (format === 'long') {
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      return d.toISOString();
    });

    // Format time helper
    Handlebars.registerHelper('formatTime', (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });

    // Conditional helper
    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      // @ts-ignore
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
  }

  /**
   * Send email using template
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, template, data, attachments } = options;

    // Load template content
    const templatePath = join(this.templatesDir, `${template}.html`);
    const templateContent = readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);

    // Render template with data
    const content = compiledTemplate(data);

    // Prepare base template data
    const baseData = {
      subject,
      content,
      recipientEmail: Array.isArray(to) ? to[0] : to,
      year: new Date().getFullYear(),
      unsubscribeUrl: data.unsubscribeUrl || `${config.frontend.url}/settings/notifications`,
      settingsUrl: data.settingsUrl || `${config.frontend.url}/settings`,
      supportUrl: data.supportUrl || `${config.frontend.url}/support`,
      ...data,
    };

    // Render final HTML with base template
    const html = this.baseTemplate(baseData);

    // Generate plain text version (strip HTML)
    const text = this.htmlToText(html);

    // Send email
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'IUP Golf Academy <noreply@iup-golf.com>',
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      attachments,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    data: {
      firstName: string;
      email: string;
      role: string;
      organizationName: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to IUP Golf Academy! 🎉',
      template: EmailTemplate.WELCOME,
      data: {
        ...data,
        loginUrl: `${config.frontend.url}/login`,
        docsUrl: `${config.frontend.url}/docs`,
        videoTutorialUrl: `${config.frontend.url}/tutorials/getting-started`,
        faqUrl: `${config.frontend.url}/faq`,
      },
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    data: {
      firstName: string;
      email: string;
      resetToken: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      template: EmailTemplate.PASSWORD_RESET,
      data: {
        ...data,
        resetUrl: `${config.frontend.url}/reset-password?token=${data.resetToken}`,
      },
    });
  }

  /**
   * Send password changed confirmation email
   */
  async sendPasswordChangedEmail(
    to: string,
    data: {
      firstName: string;
      email: string;
      changedAt: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Password Changed Successfully',
      template: EmailTemplate.PASSWORD_CHANGED,
      data: {
        ...data,
        loginUrl: `${config.frontend.url}/login`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@iup-golf.com',
      },
    });
  }

  /**
   * Send 2FA setup email
   */
  async send2FASetupEmail(
    to: string,
    data: {
      firstName: string;
      backupCodes: string[];
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Two-Factor Authentication Enabled',
      template: EmailTemplate.TWO_FACTOR_SETUP,
      data: {
        ...data,
        settingsUrl: `${config.frontend.url}/settings/security`,
      },
    });
  }

  /**
   * Send training session reminder
   */
  async sendTrainingReminder(
    to: string,
    data: {
      firstName: string;
      sessionTitle: string;
      sessionDate: string;
      sessionTime: string;
      location: string;
      sessionDescription: string;
      coach?: string;
      focusAreas: string[];
      equipment?: string[];
      sessionId: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Training Reminder: ${data.sessionTitle}`,
      template: EmailTemplate.TRAINING_REMINDER,
      data: {
        ...data,
        sessionUrl: `${config.frontend.url}/sessions/${data.sessionId}`,
        cancelUrl: `${config.frontend.url}/sessions/${data.sessionId}/cancel`,
      },
    });
  }

  /**
   * Send test results email
   */
  async sendTestResults(
    to: string,
    data: {
      firstName: string;
      testName: string;
      testDate: string;
      score: number;
      performanceLevel: string;
      percentile: number;
      improvement: string;
      improvementColor: string;
      categoryProgress: number;
      metrics: Array<{ name: string; value: string; percentage: number }>;
      coachFeedback: string;
      coachName: string;
      recommendations: string[];
      testId: string;
      nextTest?: { name: string; date: string };
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Test Results: ${data.testName}`,
      template: EmailTemplate.TEST_RESULTS,
      data: {
        ...data,
        resultsUrl: `${config.frontend.url}/tests/${data.testId}/results`,
      },
    });
  }

  /**
   * Send achievement unlocked email
   */
  async sendAchievementUnlocked(
    to: string,
    data: {
      firstName: string;
      achievementName: string;
      achievementTagline: string;
      achievementDescription: string;
      badgeEmoji: string;
      totalAchievements: number;
      category: string;
      categoryProgress: number;
      rank: string;
      whatItMeans: string;
      suggestions: string[];
      achievementId: string;
      nextMilestone?: {
        name: string;
        emoji: string;
        requirement: string;
        progress: number;
      };
      relatedAchievements?: Array<{ name: string; emoji: string }>;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Achievement Unlocked: ${data.achievementName}! 🏆`,
      template: EmailTemplate.ACHIEVEMENT_UNLOCKED,
      data: {
        ...data,
        achievementsUrl: `${config.frontend.url}/achievements`,
        shareUrl: `${config.frontend.url}/achievements/${data.achievementId}/share`,
      },
    });
  }

  /**
   * Send weekly summary email
   */
  async sendWeeklySummary(
    to: string,
    data: {
      firstName: string;
      weekStart: string;
      weekEnd: string;
      hoursTrained: number;
      sessionsCompleted: number;
      testsCompleted: number;
      improvements: Array<{ skill: string; progress: number; improvement: number }>;
      sessions: Array<{
        title: string;
        date: string;
        duration: number;
        focusArea: string;
        notes?: string;
      }>;
      goals: Array<{
        name: string;
        progress: number;
        target: string;
        deadline: string;
      }>;
      coachNotes: string;
      coachName: string;
      upcomingSessions: Array<{ title: string; date: string; time: string }>;
      achievements?: Array<{ name: string; emoji: string }>;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Your Weekly Training Summary (${data.weekStart} - ${data.weekEnd})`,
      template: EmailTemplate.WEEKLY_SUMMARY,
      data: {
        ...data,
        dashboardUrl: `${config.frontend.url}/dashboard`,
      },
    });
  }

  /**
   * Convert HTML to plain text (simple version)
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Preview email template (for development)
   */
  async previewEmail(template: EmailTemplate, data: Record<string, any>): Promise<string> {
    // Load template content
    const templatePath = join(this.templatesDir, `${template}.html`);
    const templateContent = readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);

    // Render template with data
    const content = compiledTemplate(data);

    // Prepare base template data
    const baseData = {
      subject: data.subject || 'Email Preview',
      content,
      recipientEmail: data.email || 'preview@example.com',
      year: new Date().getFullYear(),
      unsubscribeUrl: '#',
      settingsUrl: '#',
      supportUrl: '#',
      ...data,
    };

    // Render final HTML
    return this.baseTemplate(baseData);
  }
}

// Export singleton instance
export const emailService = new EmailService();
