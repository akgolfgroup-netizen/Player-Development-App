# Email Notifications Guide

## Overview

IUP Golf Academy uses automated email notifications to keep users informed about payments, subscriptions, and account activities. This guide covers email types, configuration, customization, and troubleshooting.

## Email Types

### Payment Notifications

#### 1. Payment Successful
**Trigger:** Invoice successfully paid
**Template:** `payment-successful.html`
**Sent to:** Customer

**Content:**
- Payment confirmation
- Amount charged
- Plan details
- Invoice download link
- Billing portal link

**When Sent:**
- Subscription renewal payment succeeds
- Initial subscription payment succeeds
- One-time payment completes

#### 2. Payment Failed
**Trigger:** Invoice payment fails
**Template:** `payment-failed.html`
**Sent to:** Customer

**Content:**
- Payment failure notification
- Failure reason
- Amount attempted
- Next retry date
- Update payment method link
- Support contact information

**When Sent:**
- Card declined
- Insufficient funds
- Expired card
- Authentication required

### Subscription Notifications

#### 3. Trial Ending
**Trigger:** Scheduled reminder (3 days before trial ends)
**Template:** `trial-ending.html`
**Sent to:** Trial users

**Content:**
- Trial end date
- Days remaining
- Add payment method prompt
- What happens after trial
- Plan pricing reminder

**When Sent:**
- 3 days before trial expiration
- Can be customized for 7-day reminder

#### 4. Subscription Canceled
**Trigger:** Subscription cancellation
**Template:** `subscription-canceled.html`
**Sent to:** Customer

**Content:**
- Cancellation confirmation
- Access end date
- Data retention policy
- Reactivation option
- Feedback request link

**When Sent:**
- User cancels subscription
- Admin cancels subscription
- Payment failure after grace period

#### 5. Subscription Renewed
**Trigger:** Successful subscription renewal
**Template:** `subscription-renewed.html`
**Sent to:** Customer

**Content:**
- Renewal confirmation
- Amount charged
- Next billing date
- Invoice download
- Subscription benefits reminder

**When Sent:**
- Monthly/yearly subscription renewal
- After trial period ends (if payment method on file)

#### 6. Plan Changed
**Trigger:** Subscription plan upgrade/downgrade
**Template:** `plan-changed.html`
**Sent to:** Customer

**Content:**
- Old plan and new plan details
- Effective date
- Prorated charge (if applicable)
- New billing amount
- Feature changes summary

**When Sent:**
- User upgrades plan
- User downgrades plan
- Admin changes user plan

## Email Configuration

### Environment Variables

#### Development (MailHog)
```bash
# .env.local
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_FROM=IUP Golf Academy <noreply@iup-golf.com>
```

#### Staging (Real SMTP)
```bash
# .env.staging
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=postmaster@sandbox.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=IUP Golf Academy <noreply@staging.iup-golf.com>
```

#### Production (SendGrid)
```bash
# .env.production
EMAIL_ENABLED=true
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-api-key
SENDGRID_FROM_EMAIL=noreply@iup-golf.com
SENDGRID_FROM_NAME=IUP Golf Academy
SUPPORT_EMAIL=support@iup-golf.com
FRONTEND_URL=https://app.iup-golf.com
```

#### Production (AWS SES)
```bash
# .env.production
EMAIL_ENABLED=true
EMAIL_PROVIDER=ses
AWS_SES_REGION=eu-north-1
AWS_SES_ACCESS_KEY_ID=your-access-key
AWS_SES_SECRET_ACCESS_KEY=your-secret-key
AWS_SES_FROM_EMAIL=noreply@iup-golf.com
```

### Email Providers

#### SMTP (Development/Staging)
**Pros:**
- Simple setup
- Works with any SMTP server
- Good for development with MailHog

**Cons:**
- Manual server management
- Limited deliverability features
- No built-in analytics

**Setup:**
1. Install MailHog (local development):
   ```bash
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```
2. Configure SMTP settings in `.env`
3. View emails at http://localhost:8025

#### SendGrid (Recommended for Production)
**Pros:**
- Excellent deliverability
- Built-in analytics
- 100 free emails/day
- Easy API integration

**Cons:**
- Requires account setup
- API key management

**Setup:**
1. Create SendGrid account
2. Generate API key
3. Configure environment variables
4. Verify domain (for production)

**Domain Verification:**
```bash
# Add DNS records provided by SendGrid
# SPF: v=spf1 include:sendgrid.net ~all
# DKIM: k=rsa; p=...
```

#### AWS SES
**Pros:**
- Cost-effective at scale
- AWS ecosystem integration
- High deliverability

**Cons:**
- More complex setup
- Requires AWS account
- Sandbox mode initially

**Setup:**
1. Create AWS account
2. Request SES production access
3. Verify email/domain
4. Create IAM user with SES permissions
5. Configure credentials

## Template Customization

### Template Structure

All templates use Handlebars syntax:

**Base Template:** `apps/api/src/templates/emails/base.html`
- Defines overall layout
- Includes header, footer, styles
- Content injected via `{{content}}` variable

**Content Templates:** `apps/api/src/templates/emails/{type}.html`
- Specific email content
- Uses Handlebars variables
- Compiled into base template

### Available Variables

#### Common Variables (All Templates)
```handlebars
{{userName}}           // User's full name
{{recipientEmail}}     // Recipient email address
{{year}}               // Current year
{{unsubscribeUrl}}     // Unsubscribe link
{{settingsUrl}}        // Email preferences link
{{supportUrl}}         // Support page link
{{supportEmail}}       // Support email address
```

#### Payment-Specific Variables
```handlebars
{{amount}}             // Amount in cents
{{formattedAmount}}    // Formatted currency amount
{{currency}}           // Currency code (NOK, USD, etc.)
{{invoiceUrl}}         // Link to invoice PDF
{{planType}}           // Subscription plan name
{{billingUrl}}         // Billing portal URL
```

#### Subscription-Specific Variables
```handlebars
{{trialEndDate}}       // Trial expiration date
{{formattedEndDate}}   // Formatted date
{{daysRemaining}}      // Days until trial ends
{{nextBillingDate}}    // Next billing date
{{oldPlan}}            // Previous plan name
{{newPlan}}            // New plan name
{{proratedAmount}}     // Prorated charge
```

### Customizing Templates

#### Modify Existing Template
1. Edit template in `apps/api/src/templates/emails/`
2. Use Handlebars syntax for variables
3. Test with email preview endpoint
4. Deploy changes

**Example: Adding Custom Footer**
```html
<!-- In payment-successful.html -->
<hr class="divider">

<div class="card">
  <h2>Need Help?</h2>
  <p>Contact our support team:</p>
  <ul>
    <li>Email: <a href="mailto:{{supportEmail}}">{{supportEmail}}</a></li>
    <li>Phone: +47 123 45 678</li>
    <li>Hours: Mon-Fri 9:00-17:00 CET</li>
  </ul>
</div>
```

#### Add Custom Styles
Styles defined in `base.html`:

```css
/* Add to <style> section in base.html */
.custom-box {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
  padding: 16px 20px;
  margin: 20px 0;
  border-radius: 4px;
}
```

Use in template:
```html
<div class="custom-box">
  <p>Important information here!</p>
</div>
```

#### Create New Template

1. Create new template file:
   ```bash
   touch apps/api/src/templates/emails/custom-notification.html
   ```

2. Add to EmailTemplate enum:
   ```typescript
   // apps/api/src/services/email.service.ts
   export enum EmailTemplate {
     // ... existing templates
     CUSTOM_NOTIFICATION = 'custom-notification',
   }
   ```

3. Add send method:
   ```typescript
   async sendCustomNotification(
     to: string,
     data: { userName: string; customData: string }
   ): Promise<boolean> {
     return this.sendEmail({
       to,
       subject: 'Custom Notification',
       template: EmailTemplate.CUSTOM_NOTIFICATION,
       data,
     });
   }
   ```

## Testing Emails

### Local Development with MailHog

**Start MailHog:**
```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

**Configure Environment:**
```bash
SMTP_HOST=localhost
SMTP_PORT=1025
```

**View Emails:**
- Open http://localhost:8025
- All sent emails appear in web interface
- Test email rendering
- Check links work correctly

### Trigger Test Emails

**Via Stripe CLI:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe

# Trigger payment successful event
stripe trigger invoice.payment_succeeded

# Trigger payment failed event
stripe trigger invoice.payment_failed

# Trigger subscription canceled
stripe trigger customer.subscription.deleted
```

**Via API Endpoint (Development Only):**
```bash
# Add test endpoint in development
POST /api/v1/dev/test-email
{
  "type": "payment_successful",
  "email": "test@example.com"
}
```

### Email Preview

Create preview endpoint for development:

```typescript
// apps/api/src/api/v1/dev/email-preview.routes.ts
app.get('/dev/email-preview/:template', async (request, reply) => {
  const { template } = request.params;
  const html = await emailService.previewEmail(
    EmailTemplate[template.toUpperCase()],
    {
      userName: 'Test User',
      amount: 14900,
      currency: 'NOK',
      // ... mock data
    }
  );
  reply.type('text/html').send(html);
});
```

Access at: `http://localhost:3000/api/v1/dev/email-preview/payment_successful`

## Troubleshooting

### Emails Not Sending

**Check Configuration:**
```bash
# Verify environment variables are set
echo $EMAIL_ENABLED
echo $SMTP_HOST
echo $SMTP_PORT
```

**Check Logs:**
```bash
# Application logs
tail -f logs/app.log | grep email

# Look for errors like:
# "Failed to send email: Connection timeout"
# "Email service disabled, skipping email"
```

**Test SMTP Connection:**
```typescript
// Add health check endpoint
const transporter = nodemailer.createTransporter({ /* config */ });
await transporter.verify();
```

### Emails Go to Spam

**SPF Record:**
```
v=spf1 include:sendgrid.net ~all
```

**DKIM Setup:**
- Configure in SendGrid/SES dashboard
- Add DNS TXT record
- Verify configuration

**DMARC Policy:**
```
v=DMARC1; p=none; rua=mailto:dmarc@iup-golf.com
```

**Content Best Practices:**
- Avoid spam trigger words
- Include unsubscribe link
- Use verified sender domain
- Maintain good sender reputation

### Template Rendering Issues

**Handlebars Syntax Errors:**
```bash
# Check for:
- Missing closing braces {{var}
- Incorrect helper usage {{#if}}
- Undefined variables
```

**Missing Variables:**
```javascript
// Always provide default values
userName: user.profile?.fullName || user.email,
```

**HTML Rendering:**
- Test in multiple email clients
- Use inline styles (some clients strip `<style>`)
- Test responsive design

### Performance Issues

**Slow Email Sending:**
- Use BullMQ for async email sending
- Don't block webhook responses
- Implement retry logic

**Queue Implementation:**
```typescript
// apps/api/src/queues/email.queue.ts
import { Queue } from 'bullmq';

const emailQueue = new Queue('email', {
  connection: redis,
});

// Add to queue instead of sending directly
await emailQueue.add('payment-notification', {
  to: user.email,
  template: 'payment-successful',
  data: { /* ... */ },
});
```

## Monitoring & Analytics

### Email Delivery Tracking

**SendGrid Analytics:**
- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Spam reports

**Custom Logging:**
```typescript
await emailService.sendPaymentSuccessfulEmail(/* ... */);

// Log email sent
logger.info({
  event: 'email_sent',
  template: 'payment_successful',
  recipient: user.email,
  userId: user.id,
});
```

### Metrics to Track

**Delivery Metrics:**
- Emails sent per day
- Delivery success rate
- Bounce rate (<2% target)
- Spam complaint rate (<0.1% target)

**Engagement Metrics:**
- Open rate (20-30% good)
- Click-through rate on links
- Time to open
- Device/client breakdown

## Best Practices

### Content Guidelines

**Subject Lines:**
- Keep under 50 characters
- Clear and actionable
- Avoid spam trigger words
- Include brand name

**Email Body:**
- Mobile-first design
- Clear call-to-action
- Scannable content (bullets, headings)
- Personalization
- Unsubscribe link

### Testing Checklist

Before deploying template changes:
- [ ] Test in Gmail web
- [ ] Test in Outlook
- [ ] Test on mobile (iOS Mail, Gmail app)
- [ ] Verify all links work
- [ ] Check responsive design
- [ ] Test with long/short content
- [ ] Verify images load
- [ ] Check dark mode rendering

### Security

**Prevent Email Spoofing:**
- SPF, DKIM, DMARC configuration
- Use verified sender domains
- Never send from user-provided email

**Content Security:**
- Sanitize user data in emails
- Escape HTML entities
- Validate URLs before including
- Don't include sensitive data

## Support Resources

- **Nodemailer Docs:** https://nodemailer.com/
- **SendGrid Docs:** https://docs.sendgrid.com/
- **AWS SES Docs:** https://docs.aws.amazon.com/ses/
- **Handlebars Docs:** https://handlebarsjs.com/
- **Email Testing Tools:** https://www.mail-tester.com/

**Contact:**
- Technical Support: support@iup-golf.com
- Email Deliverability Issues: postmaster@iup-golf.com
