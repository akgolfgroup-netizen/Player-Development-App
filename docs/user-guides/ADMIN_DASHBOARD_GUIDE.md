# Admin Dashboard Guide

## Overview

The Admin Dashboard provides comprehensive payment and subscription analytics for IUP Golf Academy administrators. This guide covers how to navigate, interpret, and use the dashboard effectively.

## Accessing the Dashboard

### Prerequisites
- Admin role required
- Must be logged in to the platform
- Navigate to `/admin/payments` or use the admin navigation menu

### Dashboard Sections

The dashboard is organized into four main tabs:

## 1. Overview Tab

### Key Metrics

**Monthly Recurring Revenue (MRR)**
- Current month's recurring subscription revenue
- Updated in real-time
- Displayed in NOK (Norwegian Kroner)

**Annual Recurring Revenue (ARR)**
- Projected annual revenue (MRR × 12)
- Key metric for business health

**Active Subscriptions**
- Total number of currently active paid subscriptions
- Excludes trialing, canceled, and expired subscriptions

**Success Rate**
- Percentage of successful payments vs total payment attempts
- Target: >95% for healthy payment processing

### Quick Stats
- Total Customers: All users with Stripe customer IDs
- Failed Payments (30d): Count of failed payments in last 30 days
- Average Transaction: Mean payment amount across all successful transactions

### Revenue Chart
- Visual representation of revenue over the selected time period
- Interactive: hover to see exact values for each data point
- Time ranges: 7 days, 30 days, 90 days, 1 year

## 2. Transactions Tab

### Transaction Table

Displays recent payment transactions with:
- **Date/Time**: When the transaction occurred
- **Customer**: User email or name
- **Amount**: Payment amount in NOK
- **Status**: Success, Failed, Pending, Refunded
- **Description**: Plan type or payment description
- **Actions**: View details, download invoice

### Filtering & Search
- Filter by status (All, Successful, Failed)
- Filter by date range
- Search by customer email or transaction ID
- Sort by any column

### Transaction Details
Click on any transaction to view:
- Full customer information
- Payment method details
- Invoice PDF (if available)
- Refund history
- Subscription association

## 3. Webhook Events Tab

### Event Log

Real-time log of all Stripe webhook events:
- **Event Type**: e.g., `invoice.paid`, `customer.subscription.created`
- **Status**: Processed, Failed, Pending
- **Timestamp**: When the event was received
- **Retry Count**: Number of processing attempts
- **Error Message**: If processing failed

### Common Event Types
- `invoice.paid`: Successful payment processed
- `invoice.payment_failed`: Payment attempt failed
- `customer.subscription.created`: New subscription started
- `customer.subscription.updated`: Subscription modified
- `customer.subscription.deleted`: Subscription canceled
- `payment_intent.succeeded`: One-time payment succeeded

### Troubleshooting Webhook Issues

**Event Shows "Failed"**
1. Check error message for details
2. Verify webhook secret is correct in `.env`
3. Check Stripe dashboard for webhook endpoint status
4. Review application logs for detailed error traces

**Missing Events**
1. Verify webhook endpoint is configured in Stripe
2. Check that URL is publicly accessible (not localhost)
3. Review Stripe webhook logs in Stripe Dashboard
4. Ensure webhook secret matches between Stripe and application

### Manual Retry
Failed events can be manually retried:
1. Click on the failed event
2. Click "Retry Processing"
3. Monitor status for success

## 4. Failed Payments Tab

### Failed Payment Tracking

Critical view for monitoring and resolving payment issues:
- **Customer Information**: Who experienced the failure
- **Amount**: How much was attempted
- **Reason**: Why the payment failed
- **Date**: When the failure occurred
- **Retry Schedule**: Next automatic retry attempt
- **Actions**: Contact customer, update payment method

### Common Failure Reasons

**Insufficient Funds**
- Customer's card has insufficient balance
- Action: Email customer to update payment method

**Card Declined**
- Card issuer declined the transaction
- Action: Request customer update payment method

**Expired Card**
- Payment method has expired
- Action: Automated email sent, follow up if needed

**Authentication Required**
- 3D Secure or SCA authentication needed
- Action: Customer must re-authenticate payment

**Network Error**
- Temporary connection issue
- Action: Usually auto-retries, monitor for success

### Resolution Workflows

**For Insufficient Funds / Declined Cards:**
1. System automatically sends payment failed email
2. Schedule automatic retry in 3 days
3. If retry fails, send final notice
4. Subscription enters grace period (7 days)
5. After grace period, subscription canceled

**Manual Intervention:**
1. Contact customer directly (use "Contact" button)
2. Provide billing portal link for payment method update
3. Note customer in dashboard notes
4. Monitor for successful retry

## Common Administrative Tasks

### 1. Generating Reports

**Monthly Revenue Report:**
1. Select "30 Days" time range
2. Navigate to Overview tab
3. Export data using "Export CSV" button
4. Review in spreadsheet software

**Subscription Analytics:**
- Navigate to `/admin/analytics/subscriptions`
- View plan distribution, retention rates, churn analysis
- Export for detailed analysis

### 2. Handling Customer Support Requests

**"I was charged twice"**
1. Go to Transactions tab
2. Search customer email
3. Review transaction history
4. Check for duplicate invoice IDs
5. Issue refund if confirmed duplicate

**"My payment failed"**
1. Go to Failed Payments tab
2. Search customer email
3. Review failure reason
4. Guide customer to billing portal
5. Monitor next retry attempt

**"I want to cancel"**
1. User should cancel via billing portal
2. If escalated, find subscription in Stripe Dashboard
3. Note cancellation reason
4. Monitor for cancellation confirmation webhook

### 3. Monitoring System Health

**Daily Checks:**
- Review success rate (target: >95%)
- Check failed payments count
- Monitor webhook processing status
- Review any error alerts

**Weekly Reviews:**
- Revenue trends week-over-week
- New subscriptions vs cancellations
- Churn rate analysis
- Payment method update rate

**Monthly Analysis:**
- MRR growth rate
- Customer lifetime value trends
- Plan distribution changes
- Refund rate

## Auto-Refresh Feature

The dashboard automatically refreshes every 30 seconds to show the latest data:
- Enabled by default
- Toggle with "Auto-refresh" switch in top right
- Manual refresh available with refresh button
- Last updated timestamp shown

## Keyboard Shortcuts

- `R` - Refresh data
- `1-4` - Switch between tabs (Overview, Transactions, Webhooks, Failed)
- `Esc` - Close modals or detail views
- `?` - Show keyboard shortcut help

## Troubleshooting

### Dashboard Not Loading
1. Check internet connection
2. Verify admin role permissions
3. Clear browser cache
4. Check browser console for errors
5. Contact technical support

### Data Appears Outdated
1. Check last updated timestamp
2. Click manual refresh button
3. Verify Stripe webhook endpoint is active
4. Check for webhook processing errors

### Export Not Working
1. Check browser popup blocker
2. Verify sufficient data in date range
3. Try different browser
4. Contact support if persists

## Best Practices

### Security
- Never share admin credentials
- Log out when leaving workstation
- Review audit logs regularly
- Use 2FA for admin accounts

### Data Privacy
- Only access customer data when necessary
- Follow GDPR/data protection guidelines
- Don't export customer data unnecessarily
- Secure any exported reports

### Customer Communication
- Use professional, clear language
- Provide specific actionable steps
- Include billing portal links
- Set expectations for resolution time

## Support

For technical issues or questions:
- Email: support@iup-golf.com
- Stripe Dashboard: https://dashboard.stripe.com
- Application Logs: Check server logs for detailed errors
- Documentation: See PAYMENTS_API.md for API details
