# Payment System Deployment Runbook

## Overview

This runbook provides step-by-step instructions for deploying the IUP Golf Academy payment system integration, including frontend routes, email notifications, and Stripe webhooks.

**Estimated Deployment Time:** 30-45 minutes
**Required Access:** Admin, Database, Railway/Hosting Platform, Stripe Dashboard
**Risk Level:** Medium (affects payments and subscriptions)

## Pre-Deployment Checklist

### 1. Environment Preparation

**Staging Environment:**
- [ ] Staging environment is operational
- [ ] Database migrations tested in staging
- [ ] Stripe test mode configured
- [ ] SMTP/email service configured (MailHog or real SMTP)
- [ ] All environment variables set

**Production Environment:**
- [ ] Production database backup completed
- [ ] Stripe live mode API keys ready
- [ ] Production email service configured (SendGrid/SES)
- [ ] Domain verified for email sending
- [ ] Webhook endpoint URL prepared

### 2. Database Backup

```bash
# PostgreSQL backup
pg_dump -h <host> -U <user> -d <database> -F c -f backup_pre_payment_deploy_$(date +%Y%m%d).dump

# Verify backup
pg_restore --list backup_pre_payment_deploy_$(date +%Y%m%d).dump | head -20
```

**Store backup securely:**
```bash
# Upload to S3 or backup service
aws s3 cp backup_pre_payment_deploy_$(date +%Y%m%d).dump s3://iup-backups/database/
```

### 3. Code Review

**Changes to Deploy:**
- [ ] Frontend routes added (`/billing`, `/innstillinger/subscription`, `/admin/payments`, `/admin/analytics/subscriptions`)
- [ ] Email service extended with 6 payment notification methods
- [ ] 6 email templates created
- [ ] Stripe webhooks integrated with email service
- [ ] Environment variables documented
- [ ] All tests passing

**Git Status:**
```bash
git status
git log --oneline -10
# Ensure on correct branch (main/production)
```

### 4. Stripe Configuration

**Test Mode (Staging):**
- [ ] Test API keys configured
- [ ] Test webhook endpoint configured
- [ ] Test products/prices created

**Live Mode (Production):**
- [ ] Live API keys ready
- [ ] Live webhook endpoint URL ready
- [ ] Production products/prices verified
- [ ] Pricing matches documentation

---

## Deployment Steps

### Phase 1: Staging Deployment

#### Step 1: Deploy to Staging

```bash
# Pull latest code
git checkout staging
git pull origin staging

# Build application
cd apps/api
npm install
npm run build

cd ../web
npm install
npm run build

# Deploy (Railway or manual)
railway up --environment staging
# OR
docker-compose -f docker-compose.staging.yml up -d
```

#### Step 2: Run Database Migrations

```bash
# Migrations run automatically via Dockerfile CMD:
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# Verify migrations completed
npx prisma migrate status

# Expected output:
# All migrations have been applied
```

#### Step 3: Verify Environment Variables

```bash
# Check critical variables are set
railway variables --environment staging
# OR
cat .env.staging | grep -E "(STRIPE|EMAIL|SMTP|FRONTEND_URL)"

# Verify:
# - STRIPE_SECRET_KEY starts with sk_test_
# - STRIPE_WEBHOOK_SECRET starts with whsec_
# - EMAIL_ENABLED=true
# - SMTP_* or SENDGRID_* variables set
# - FRONTEND_URL correct
```

#### Step 4: Setup Stripe Webhooks (Staging)

**In Stripe Dashboard (Test Mode):**
1. Navigate to Developers > Webhooks
2. Click "Add endpoint"
3. URL: `https://api-staging.iup-golf.com/api/v1/webhooks/stripe`
4. Select events:
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
5. Save webhook secret to environment:
   ```bash
   railway variables set STRIPE_WEBHOOK_SECRET=whsec_... --environment staging
   ```

#### Step 5: Create Stripe Products (Staging)

```bash
# Run product creation script
node scripts/stripe-create-products.js --environment staging

# Verify products created
stripe products list --test
```

#### Step 6: Smoke Testing (Staging)

**Backend Health Check:**
```bash
curl https://api-staging.iup-golf.com/health

# Expected: {"status": "ok", "timestamp": "..."}
```

**Test Frontend Routes:**
```bash
# User routes
curl -H "Authorization: Bearer ${TEST_TOKEN}" \
  https://api-staging.iup-golf.com/api/v1/billing/dashboard

# Admin routes
curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  https://api-staging.iup-golf.com/api/v1/admin/payment-stats
```

**Test Email Sending:**
```bash
# Trigger test webhook
stripe trigger invoice.payment_succeeded --test

# Check MailHog or email service for received email
# Expected: Payment successful email sent
```

**Test Webhook Processing:**
```bash
# Check webhook event log in admin dashboard
# Navigate to https://staging.iup-golf.com/admin/payments
# Go to Webhooks tab
# Verify events are being logged
```

#### Step 7: End-to-End Test (Staging)

**Complete Subscription Flow:**
1. Create test user account
2. Navigate to `/billing`
3. Verify billing portal loads
4. Add test payment method (4242 4242 4242 4242)
5. Subscribe to test plan
6. Verify:
   - Subscription created in Stripe
   - Webhook received and processed
   - Payment successful email sent
   - Subscription visible in billing portal

**Test Payment Failure:**
1. Update payment method to declining card (4000 0000 0000 0002)
2. Trigger renewal manually in Stripe Dashboard
3. Verify:
   - Payment fails
   - Webhook received
   - Payment failed email sent
   - Failed payment shows in admin dashboard

**Staging Sign-off:**
- [ ] All routes accessible
- [ ] Webhooks processing correctly
- [ ] Emails sending successfully
- [ ] Admin dashboard functioning
- [ ] No errors in logs

---

### Phase 2: Production Deployment

**⚠️ CRITICAL: Only proceed if staging validation passed**

#### Step 1: Final Pre-Production Checks

```bash
# Verify production backup
aws s3 ls s3://iup-backups/database/ | grep $(date +%Y%m%d)

# Review deployment plan with team
# - Database migration impact: NONE (all schema already exists)
# - Downtime required: NONE (rolling deployment)
# - Rollback plan: Documented below
```

#### Step 2: Configure Production Environment Variables

```bash
# Production secrets via Railway CLI
railway variables set STRIPE_SECRET_KEY=sk_live_... --environment production
railway variables set STRIPE_WEBHOOK_SECRET=whsec_... --environment production
railway variables set SENDGRID_API_KEY=SG.xxx... --environment production
railway variables set EMAIL_ENABLED=true --environment production
railway variables set EMAIL_PROVIDER=sendgrid --environment production
railway variables set FRONTEND_URL=https://app.iup-golf.com --environment production

# Verify all variables set
railway variables --environment production | grep -E "(STRIPE|EMAIL|FRONTEND)"
```

#### Step 3: Setup Stripe Webhooks (Production)

**⚠️ Use LIVE mode in Stripe Dashboard**

1. Navigate to Developers > Webhooks
2. Click "Add endpoint"
3. URL: `https://api.iup-golf.com/api/v1/webhooks/stripe`
4. Select same events as staging
5. Save webhook secret:
   ```bash
   railway variables set STRIPE_WEBHOOK_SECRET=whsec_live_... --environment production
   ```

#### Step 4: Verify Stripe Products (Production)

```bash
# List products in live mode
stripe products list --live

# Verify prices match expected values
stripe prices list --live --product=prod_XXXXX

# Expected:
# - Player Premium Monthly: 149.00 NOK
# - Player Premium Yearly: 1499.00 NOK
# - Player Elite Monthly: 299.00 NOK
# - Player Elite Yearly: 2999.00 NOK
# - Coach Base Monthly: 199.00 NOK
# ... etc
```

#### Step 5: Deploy to Production

**Option A: Railway (Recommended)**
```bash
# Deploy via git push (if CI/CD configured)
git checkout main
git pull origin main
git push origin main

# Railway automatically deploys on push to main
# Monitor deployment:
railway logs --environment production --follow
```

**Option B: Manual Deploy**
```bash
# SSH to production server
ssh user@api.iup-golf.com

# Pull latest code
cd /var/www/iup-api
git pull origin main

# Install dependencies and build
npm install --production
npm run build

# Run migrations (automatically via Docker CMD)
# Restart service
pm2 restart iup-api
# OR
systemctl restart iup-api
```

#### Step 6: Post-Deployment Verification

**Health Check:**
```bash
curl https://api.iup-golf.com/health
# Expected: {"status": "ok"}
```

**Database Migration Status:**
```bash
npx prisma migrate status
# Expected: All migrations applied
```

**Application Logs:**
```bash
railway logs --environment production --tail 100

# Look for:
# ✓ Server started on port 3000
# ✓ Database connected
# ✓ Stripe configured
# ✓ Email service initialized
```

**Test Critical Paths:**

1. **Frontend Routes:**
   ```bash
   # Navigate to each route in browser:
   https://app.iup-golf.com/billing
   https://app.iup-golf.com/innstillinger/subscription
   https://app.iup-golf.com/admin/payments
   https://app.iup-golf.com/admin/analytics/subscriptions
   ```

2. **API Endpoints:**
   ```bash
   # Get payment stats (admin only)
   curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
     https://api.iup-golf.com/api/v1/admin/payment-stats
   ```

3. **Webhook Processing:**
   ```bash
   # Trigger test webhook from Stripe Dashboard (Live Mode)
   # Use "Send test webhook" feature
   # Event: invoice.payment_succeeded

   # Verify in admin dashboard webhooks tab
   # Expected: Event logged and processed
   ```

4. **Email Sending:**
   ```bash
   # Create test subscription with real payment method
   # Verify payment successful email received
   # Check SendGrid dashboard for delivery confirmation
   ```

#### Step 7: Monitor Production

**Real-time Monitoring (first 30 minutes):**
```bash
# Application logs
railway logs --environment production --follow

# Watch for errors
grep -i error logs/production.log | tail -20

# Monitor webhook processing
# Navigate to admin dashboard /admin/payments > Webhooks
# Watch events being processed
```

**Key Metrics to Watch:**
- [ ] No 500 errors in logs
- [ ] Webhook success rate >99%
- [ ] Email delivery rate >95%
- [ ] Response times <500ms
- [ ] No database connection errors

---

### Phase 3: Post-Deployment Validation

#### Step 1: Functional Testing (Production)

**⚠️ Use real payment method (small amount)**

1. **Create Real Subscription:**
   - Use real card (personal or test card that charges real money)
   - Subscribe to lowest tier
   - Verify:
     - Stripe dashboard shows subscription
     - Webhook received
     - Email sent via SendGrid
     - Subscription visible in user's billing portal
     - Admin dashboard shows transaction

2. **Test Cancellation:**
   - Cancel the test subscription
   - Verify:
     - Subscription marked for cancellation
     - Webhook received
     - Cancellation email sent
     - Access continues until period end

3. **Refund Test Subscription:**
   ```bash
   # In Stripe Dashboard
   # Find the test payment
   # Issue full refund
   # Clean up test data
   ```

#### Step 2: Monitor Email Deliverability

**SendGrid Dashboard:**
- Check delivery rate
- Verify no bounces
- Check spam reports (should be 0)
- Review engagement (opens/clicks)

**Email Testing:**
- Send test email to personal address
- Verify not in spam
- Check all links work
- Verify images load
- Test on mobile device

#### Step 3: User Communication

**Notify Team:**
```
Subject: Payment System Deployed - Production Live

Team,

The payment system integration has been successfully deployed to production.

New Features:
- Billing portal at /billing
- Subscription management at /innstillinger/subscription
- Admin payment dashboard at /admin/payments
- Admin subscription analytics at /admin/analytics/subscriptions
- Automated email notifications for payment events

Testing completed:
✓ Webhooks processing correctly
✓ Emails sending successfully
✓ All routes accessible
✓ Admin dashboard functional

Monitoring:
- Application logs: railway logs --environment production
- Admin dashboard: https://app.iup-golf.com/admin/payments
- Stripe dashboard: https://dashboard.stripe.com

Support contact: support@iup-golf.com

[Deployment Lead Name]
```

---

## Rollback Procedures

### When to Rollback

Trigger rollback if ANY of these occur:
- Critical errors in application logs
- Webhook processing failures >10%
- Email delivery failures >20%
- Database connection errors
- Payment processing failures
- User-reported issues affecting payments

### Rollback Steps

#### Option 1: Railway Rollback (Fastest)
```bash
# Rollback to previous deployment
railway rollback --environment production

# Verify rollback successful
railway logs --environment production --tail 50
```

#### Option 2: Git Revert
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Railway auto-deploys reverted code
# Monitor deployment
railway logs --environment production --follow
```

#### Option 3: Database Rollback (If Needed)
```bash
# Restore from backup
pg_restore -h <host> -U <user> -d <database> --clean \
  backup_pre_payment_deploy_$(date +%Y%m%d).dump

# Verify restore
psql -h <host> -U <user> -d <database> -c "SELECT COUNT(*) FROM _prisma_migrations"
```

### Post-Rollback Actions

1. **Verify System Stability:**
   ```bash
   curl https://api.iup-golf.com/health
   # Test critical user flows
   ```

2. **Disable New Features:**
   - Remove frontend routes (if causing issues)
   - Disable webhook processing temporarily
   - Pause email notifications

3. **Investigate Root Cause:**
   - Review error logs
   - Check Sentry/error tracking
   - Analyze webhook failures
   - Review email delivery logs

4. **Communication:**
   - Notify team of rollback
   - Update status page if applicable
   - Document issues encountered

---

## Troubleshooting

### Issue: Webhooks Not Processing

**Symptoms:**
- Events logged but status shows "failed"
- No emails being sent
- Admin dashboard shows webhook errors

**Debug Steps:**
```bash
# Check webhook secret matches
railway variables --environment production | grep STRIPE_WEBHOOK_SECRET

# Test webhook endpoint manually
curl -X POST https://api.iup-golf.com/api/v1/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{}'

# Review webhook logs
railway logs --environment production | grep webhook

# Check Stripe Dashboard webhook logs
# Look for signature verification failures
```

**Resolution:**
- Verify webhook secret matches Stripe
- Ensure webhook URL is publicly accessible
- Check firewall/security rules
- Verify Stripe API version compatibility

### Issue: Emails Not Sending

**Symptoms:**
- Webhooks process successfully
- No emails received by users
- SendGrid shows no activity

**Debug Steps:**
```bash
# Verify email configuration
railway variables --environment production | grep -E "(EMAIL|SENDGRID|SMTP)"

# Check application logs
railway logs --environment production | grep -i email

# Test email service
curl -X POST https://api.iup-golf.com/api/v1/dev/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "payment_successful"}'
```

**Resolution:**
- Verify SendGrid API key valid
- Check email quota not exceeded
- Verify sender domain verified
- Review SendGrid activity logs
- Check spam folder

### Issue: Frontend Routes 404

**Symptoms:**
- `/billing` returns 404
- Other new routes not accessible

**Debug Steps:**
```bash
# Verify frontend build
ls -la apps/web/build/

# Check route configuration
grep -r "path=\"/billing\"" apps/web/src/

# Verify React Router setup
# Ensure lazy imports loaded correctly
```

**Resolution:**
- Clear browser cache
- Rebuild frontend
- Verify App.jsx changes deployed
- Check nginx/server configuration

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check application health
curl https://api.iup-golf.com/health

# Review webhook processing rate
# Login to admin dashboard
# Navigate to /admin/payments > Webhooks
# Target: >99% success rate

# Check failed payments
# Navigate to /admin/payments > Failed Payments
# Follow up on persistent failures
```

### Weekly Review

**Metrics to Track:**
- MRR growth
- Subscription churn rate
- Payment success rate
- Email delivery rate
- Webhook processing time
- Failed payment recovery rate

**Actions:**
- Review Stripe Dashboard analytics
- Export transaction reports
- Analyze email engagement (SendGrid)
- Review customer support tickets related to payments

### Monthly Maintenance

- [ ] Review and rotate API keys (if needed)
- [ ] Update Stripe product prices (if changed)
- [ ] Clean up test data from staging
- [ ] Update documentation with learnings
- [ ] Review and optimize email templates
- [ ] Analyze payment failure trends

---

## Contact & Support

**Deployment Issues:**
- Deployment Lead: [Name]
- DevOps Team: devops@iup-golf.com

**Stripe Issues:**
- Stripe Support: https://support.stripe.com
- Account Dashboard: https://dashboard.stripe.com

**Email Deliverability:**
- SendGrid Support: https://support.sendgrid.com
- Email Admin: postmaster@iup-golf.com

**Emergency Rollback:**
- On-Call Engineer: [Phone]
- Escalation Email: oncall@iup-golf.com

---

## Appendix

### Environment Variables Reference

See `.env.example` for complete list.

**Critical Variables:**
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_ENABLED=true
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM_EMAIL=noreply@iup-golf.com

# Application
FRONTEND_URL=https://app.iup-golf.com
SUPPORT_EMAIL=support@iup-golf.com
```

### Migration Reference

No database migrations required for this deployment.
All schema changes already applied in previous deployments.

### Useful Commands

```bash
# Railway
railway logs --environment production --follow
railway variables --environment production
railway status

# Database
npx prisma migrate status
npx prisma db pull

# Stripe CLI
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
stripe trigger invoice.payment_succeeded
stripe products list --live
```
