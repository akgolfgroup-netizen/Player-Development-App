# Email Templates

**IUP Golf API - Email System Documentation**

This document provides comprehensive information about the email template system, including available templates, usage examples, and testing procedures.

---

## Table of Contents

1. [Overview](#overview)
2. [Available Templates](#available-templates)
3. [Email Service API](#email-service-api)
4. [Template Customization](#template-customization)
5. [Testing & Preview](#testing--preview)
6. [SMTP Configuration](#smtp-configuration)
7. [Best Practices](#best-practices)

---

## Overview

The IUP Golf API includes a comprehensive email template system built with:

- **Handlebars** templating engine for dynamic content
- **Nodemailer** for email delivery
- **Responsive HTML** templates that work across all email clients
- **Plain text fallbacks** for accessibility
- **Development preview** endpoints for testing

### Key Features

- ✅ **8 Professional Templates** covering auth, notifications, and summaries
- ✅ **Responsive Design** - Works on desktop, mobile, and webmail clients
- ✅ **Dynamic Content** - Personalized with Handlebars variables
- ✅ **Preview System** - Test emails without sending
- ✅ **Type-Safe API** - Full TypeScript support
- ✅ **SMTP Flexible** - Works with any SMTP provider

---

## Available Templates

### 1. Welcome Email (`welcome`)

**When to send:** After successful user registration

**Purpose:** Introduce new users to the platform and guide first steps

**Variables:**
```typescript
{
  firstName: string;
  email: string;
  role: string;              // "admin", "coach", or "player"
  organizationName: string;
}
```

**Usage:**
```typescript
import { emailService } from '../services/email.service';

await emailService.sendWelcomeEmail('user@example.com', {
  firstName: 'John',
  email: 'john@example.com',
  role: 'coach',
  organizationName: 'Demo Golf'
});
```

---

### 2. Password Reset (`password-reset`)

**When to send:** User requests password reset

**Purpose:** Provide secure password reset link

**Variables:**
```typescript
{
  firstName: string;
  email: string;
  resetToken: string;  // Secure reset token
}
```

**Usage:**
```typescript
await emailService.sendPasswordResetEmail('user@example.com', {
  firstName: 'John',
  email: 'john@example.com',
  resetToken: 'secure-token-123'
});
```

**Security Features:**
- Reset link expires in 1 hour
- Token is SHA-256 hashed in database
- Single-use only
- Clear security warnings

---

### 3. Password Changed (`password-changed`)

**When to send:** After successful password change

**Purpose:** Confirm password change and alert user of potential unauthorized access

**Variables:**
```typescript
{
  firstName: string;
  email: string;
  changedAt: string;  // Formatted timestamp
}
```

**Usage:**
```typescript
await emailService.sendPasswordChangedEmail('user@example.com', {
  firstName: 'John',
  email: 'john@example.com',
  changedAt: new Date().toLocaleString()
});
```

---

### 4. Two-Factor Authentication Setup (`2fa-setup`)

**When to send:** After 2FA is successfully enabled

**Purpose:** Provide backup codes and confirm 2FA activation

**Variables:**
```typescript
{
  firstName: string;
  backupCodes: string[];  // Array of backup codes
}
```

**Usage:**
```typescript
await emailService.send2FASetupEmail('user@example.com', {
  firstName: 'John',
  backupCodes: [
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    // ... more codes
  ]
});
```

---

### 5. Training Reminder (`training-reminder`)

**When to send:** 24 hours before scheduled training session

**Purpose:** Remind players of upcoming training with session details

**Variables:**
```typescript
{
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
  previousSession?: {
    score: number;
    improvement: number;
  };
}
```

**Usage:**
```typescript
await emailService.sendTrainingReminder('player@example.com', {
  firstName: 'Emma',
  sessionTitle: 'Putting Mastery',
  sessionDate: 'December 26, 2024',
  sessionTime: '2:00 PM',
  location: 'Practice Green #3',
  sessionDescription: 'Focus on distance control',
  coach: 'Coach Sarah',
  focusAreas: ['Distance control', 'Green reading'],
  equipment: ['Putter', 'Alignment aid'],
  sessionId: 'session-123'
});
```

---

### 6. Test Results (`test-results`)

**When to send:** After test is graded and results are available

**Purpose:** Share test performance with detailed metrics and coach feedback

**Variables:**
```typescript
{
  firstName: string;
  testName: string;
  testDate: string;
  score: number;
  performanceLevel: string;
  percentile: number;
  improvement: string;
  improvementColor: string;
  categoryProgress: number;
  metrics: Array<{
    name: string;
    value: string;
    percentage: number;
  }>;
  coachFeedback: string;
  coachName: string;
  recommendations: string[];
  testId: string;
  nextTest?: {
    name: string;
    date: string;
  };
}
```

**Usage:**
```typescript
await emailService.sendTestResults('player@example.com', {
  firstName: 'Emma',
  testName: 'Quarterly Assessment',
  testDate: 'December 25, 2024',
  score: 87,
  performanceLevel: 'Excellent',
  percentile: 92,
  improvement: '+12%',
  improvementColor: '#10b981',
  categoryProgress: 85,
  metrics: [
    { name: 'Putting', value: '90%', percentage: 90 },
    { name: 'Driving', value: '85%', percentage: 85 }
  ],
  coachFeedback: 'Outstanding progress!',
  coachName: 'Coach Mike',
  recommendations: ['Continue daily practice'],
  testId: 'test-123'
});
```

---

### 7. Achievement Unlocked (`achievement-unlocked`)

**When to send:** When player earns a new achievement/badge

**Purpose:** Celebrate milestones and motivate continued progress

**Variables:**
```typescript
{
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
  relatedAchievements?: Array<{
    name: string;
    emoji: string;
  }>;
}
```

**Usage:**
```typescript
await emailService.sendAchievementUnlocked('player@example.com', {
  firstName: 'Emma',
  achievementName: 'Consistency Champion',
  achievementTagline: 'Master of Reliable Performance',
  achievementDescription: 'Completed 10 consecutive sessions...',
  badgeEmoji: '🏆',
  totalAchievements: 24,
  category: 'B',
  categoryProgress: 78,
  rank: 'Advanced',
  whatItMeans: 'This demonstrates your dedication...',
  suggestions: ['Share on social media', 'Set new goals'],
  achievementId: 'ach-123'
});
```

---

### 8. Weekly Summary (`weekly-summary`)

**When to send:** Every Sunday evening

**Purpose:** Provide weekly training recap and upcoming schedule

**Variables:**
```typescript
{
  firstName: string;
  weekStart: string;
  weekEnd: string;
  hoursTrained: number;
  sessionsCompleted: number;
  testsCompleted: number;
  improvements: Array<{
    skill: string;
    progress: number;
    improvement: number;
  }>;
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
  upcomingSessions: Array<{
    title: string;
    date: string;
    time: string;
  }>;
  achievements?: Array<{
    name: string;
    emoji: string;
  }>;
}
```

**Usage:**
```typescript
await emailService.sendWeeklySummary('player@example.com', {
  firstName: 'Emma',
  weekStart: 'Dec 18',
  weekEnd: 'Dec 24',
  hoursTrained: 8.5,
  sessionsCompleted: 5,
  testsCompleted: 2,
  improvements: [
    { skill: 'Putting', progress: 85, improvement: 12 }
  ],
  sessions: [/* ... */],
  goals: [/* ... */],
  coachNotes: 'Great week!',
  coachName: 'Coach Sarah',
  upcomingSessions: [/* ... */]
});
```

---

## Email Service API

### Importing the Service

```typescript
import { emailService, EmailTemplate } from '../services/email.service';
```

### Custom Email Sending

For advanced use cases, you can send custom emails:

```typescript
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  template: EmailTemplate.WELCOME,
  data: {
    firstName: 'John',
    // ... other template variables
  },
  attachments: [
    {
      filename: 'report.pdf',
      path: '/path/to/report.pdf'
    }
  ]
});
```

### Preview Template (Development)

```typescript
const html = await emailService.previewEmail(
  EmailTemplate.WELCOME,
  {
    firstName: 'John',
    email: 'john@example.com',
    role: 'coach',
    organizationName: 'Demo Academy'
  }
);

console.log(html); // Rendered HTML
```

---

## Template Customization

### Base Template Structure

All templates use a base wrapper (`base.html`) that provides:

- Responsive layout
- Consistent header/footer
- Brand styling
- Mobile optimization

### Handlebars Helpers

Custom helpers available in templates:

```handlebars
{{!-- Format date --}}
{{formatDate createdAt "short"}}  → "Dec 25, 2024"
{{formatDate createdAt "long"}}   → "December 25, 2024"

{{!-- Format time --}}
{{formatTime sessionStart}}  → "2:00 PM"

{{!-- Conditional equals --}}
{{#ifEquals role "admin"}}
  Admin content
{{else}}
  Regular content
{{/ifEquals}}

{{!-- Iteration --}}
{{#each items}}
  {{this.name}}
{{/each}}
```

### Template File Locations

```
apps/api/src/templates/emails/
├── base.html                   # Base wrapper template
├── welcome.html                # Welcome email
├── password-reset.html         # Password reset
├── password-changed.html       # Password changed
├── 2fa-setup.html             # 2FA setup
├── training-reminder.html      # Training reminder
├── test-results.html          # Test results
├── achievement-unlocked.html  # Achievement
└── weekly-summary.html        # Weekly summary
```

---

## Testing & Preview

### Preview Endpoints (Development Only)

**List All Templates:**
```http
GET /api/v1/emails/templates
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "name": "welcome",
        "description": "Welcome email for new users",
        "previewUrl": "/api/v1/emails/preview/welcome"
      },
      // ... more templates
    ]
  }
}
```

**Preview Template:**
```http
GET /api/v1/emails/preview/{template}
Authorization: Bearer <admin-token>
```

Opens email preview in browser with sample data.

**Send Test Email:**
```http
POST /api/v1/emails/test
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "template": "welcome",
  "email": "your-test-email@example.com"
}
```

### Local SMTP Testing

Use [MailHog](https://github.com/mailhog/MailHog) for local email testing:

```bash
# Install MailHog
brew install mailhog

# Run MailHog
mailhog

# Access web UI
open http://localhost:8025
```

**.env Configuration:**
```bash
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
```

All emails sent will appear in MailHog web interface.

---

## SMTP Configuration

### Environment Variables

```bash
# SMTP Server
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true

# Authentication
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# From Address
SMTP_FROM=IUP Golf <noreply@iup-golf.com>
```

### Popular SMTP Providers

**Gmail:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not account password
```

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**AWS SES:**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

**Mailgun:**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-smtp-password
```

---

## Best Practices

### 1. Personalization

Always include the recipient's first name:

```typescript
await emailService.sendEmail({
  to: user.email,
  data: {
    firstName: user.firstName,  // Personalize
    // ...
  }
});
```

### 2. Clear Subject Lines

Use descriptive, action-oriented subjects:

✅ Good: "Training Reminder: Putting Session Tomorrow"
❌ Bad: "Reminder"

### 3. Mobile-First Design

Templates are responsive, but test key emails on:
- iPhone (Mail app)
- Android (Gmail app)
- Desktop (Outlook, Gmail web)

### 4. Plain Text Fallback

Always provide meaningful plain text:
- Service automatically generates from HTML
- Critical info should work without HTML

### 5. Unsubscribe Links

All emails include unsubscribe links (required by law):
- Automatically added by base template
- Links to user notification settings

### 6. Testing Checklist

Before sending to production:

- [ ] Preview in multiple email clients
- [ ] Test all dynamic variables
- [ ] Check links work correctly
- [ ] Verify mobile responsiveness
- [ ] Confirm unsubscribe link works
- [ ] Test with MailHog/test SMTP

### 7. Rate Limiting

Avoid sending too many emails:

```typescript
// Bad: Loop sending emails
for (const user of users) {
  await emailService.sendEmail(/* ... */);
}

// Good: Batch with delays
for (const batch of chunks(users, 100)) {
  await Promise.all(
    batch.map(user => emailService.sendEmail(/* ... */))
  );
  await delay(1000); // 1 second between batches
}
```

### 8. Error Handling

Always handle email send failures:

```typescript
try {
  await emailService.sendWelcomeEmail(email, data);
} catch (error) {
  app.log.error({ error, email }, 'Failed to send welcome email');
  // Don't throw - email failure shouldn't break user registration
}
```

---

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials:**
   ```bash
   # Test SMTP connection
   telnet smtp.gmail.com 587
   ```

2. **Verify environment variables:**
   ```bash
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

3. **Check logs:**
   ```bash
   # Fastify logs will show email errors
   tail -f logs/app.log | grep -i email
   ```

### Gmail "Less Secure Apps"

Gmail requires App Passwords for SMTP:

1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password (not account password)

### Email Goes to Spam

1. **Configure SPF record:**
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **Add DKIM signature** (via SMTP provider)

3. **Set up DMARC:**
   ```
   v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

---

## Future Enhancements

Potential improvements for the email system:

- [ ] Email queue with BullMQ for reliability
- [ ] Template versioning and A/B testing
- [ ] Email analytics (open rate, click tracking)
- [ ] Localization support (multiple languages)
- [ ] Rich calendar invites (.ics attachments)
- [ ] SMS fallback for critical notifications

---

**Last Updated:** December 25, 2024
