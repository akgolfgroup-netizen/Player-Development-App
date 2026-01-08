# Payments API Documentation

## Overview

The Payments API provides endpoints for managing subscriptions, payment methods, billing, and admin analytics for IUP Golf Academy.

**Base URL:** `/api/v1`

**Authentication:** All endpoints require valid JWT access token in Authorization header (except webhooks)

## Table of Contents

- [User Endpoints](#user-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Webhook Endpoints](#webhook-endpoints)
- [Error Codes](#error-codes)
- [Testing](#testing)

---

## User Endpoints

### Billing Portal

#### Get Billing Dashboard Data
```http
GET /billing/dashboard
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1A2B3C",
      "status": "active",
      "planType": "player_premium",
      "currentPeriodEnd": "2024-02-01T00:00:00Z",
      "cancelAtPeriodEnd": false,
      "amount": 14900,
      "currency": "nok"
    },
    "paymentMethod": {
      "id": "pm_1A2B3C",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2025
    },
    "upcomingInvoice": {
      "amount": 14900,
      "date": "2024-02-01T00:00:00Z"
    }
  }
}
```

#### List Invoices
```http
GET /billing/invoices?limit=10
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `limit` (optional): Number of invoices to return (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "in_1A2B3C",
        "amount": 14900,
        "currency": "nok",
        "status": "paid",
        "created": "2024-01-01T00:00:00Z",
        "invoicePdf": "https://stripe.com/invoice.pdf",
        "hostedInvoiceUrl": "https://stripe.com/invoice"
      }
    ],
    "hasMore": false
  }
}
```

### Subscription Management

#### Get Current Subscription
```http
GET /subscriptions/current
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1A2B3C",
      "status": "active",
      "planType": "player_premium",
      "interval": "month",
      "currentPeriodStart": "2024-01-01T00:00:00Z",
      "currentPeriodEnd": "2024-02-01T00:00:00Z",
      "cancelAtPeriodEnd": false,
      "canceledAt": null,
      "trialEnd": null
    }
  }
}
```

#### Update Subscription Plan
```http
PUT /subscriptions/plan
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "newPlanType": "player_elite",
  "interval": "month"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1A2B3C",
      "status": "active",
      "planType": "player_elite",
      "proratedAmount": 15000
    }
  }
}
```

#### Cancel Subscription
```http
POST /subscriptions/cancel
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "cancelAtPeriodEnd": true,
  "reason": "Too expensive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1A2B3C",
      "status": "active",
      "cancelAtPeriodEnd": true,
      "currentPeriodEnd": "2024-02-01T00:00:00Z"
    }
  }
}
```

#### Reactivate Subscription
```http
POST /subscriptions/reactivate
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1A2B3C",
      "status": "active",
      "cancelAtPeriodEnd": false
    }
  }
}
```

### Payment Methods

#### List Payment Methods
```http
GET /payment-methods
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "pm_1A2B3C",
        "type": "card",
        "card": {
          "brand": "visa",
          "last4": "4242",
          "expMonth": 12,
          "expYear": 2025
        },
        "isDefault": true
      }
    ]
  }
}
```

#### Set Default Payment Method
```http
POST /payment-methods/default
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "paymentMethodId": "pm_1A2B3C"
}
```

#### Remove Payment Method
```http
DELETE /payment-methods/{payment_method_id}
Authorization: Bearer {access_token}
```

---

## Admin Endpoints

All admin endpoints require `admin` role.

### Payment Statistics

#### Get Payment Dashboard Stats
```http
GET /admin/payment-stats
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mrr": 1250000,
    "arr": 15000000,
    "activeSubscriptions": 84,
    "totalCustomers": 120,
    "successRate": 97.5,
    "failedPayments30d": 3,
    "averageTransaction": 24900,
    "revenueByPlan": {
      "player_premium": 450000,
      "player_elite": 600000,
      "coach_pro": 200000
    }
  }
}
```

### Recent Transactions

#### List Recent Transactions
```http
GET /admin/recent-transactions?limit=50
Authorization: Bearer {admin_access_token}
```

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pi_1A2B3C",
      "amount": 14900,
      "currency": "nok",
      "status": "succeeded",
      "customerEmail": "user@example.com",
      "description": "Player Premium - Monthly",
      "created": "2024-01-15T10:30:00Z",
      "invoiceUrl": "https://stripe.com/invoice.pdf"
    }
  ]
}
```

### Webhook Events

#### List Webhook Events
```http
GET /admin/webhook-events?limit=20
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_1A2B3C",
      "type": "invoice.paid",
      "status": "processed",
      "created": "2024-01-15T10:30:00Z",
      "attempts": 1,
      "lastError": null,
      "processedAt": "2024-01-15T10:30:05Z"
    }
  ]
}
```

### Failed Payments

#### List Failed Payments
```http
GET /admin/failed-payments?limit=10
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pi_1A2B3C",
      "customerEmail": "user@example.com",
      "amount": 14900,
      "currency": "nok",
      "failureReason": "card_declined",
      "created": "2024-01-15T10:30:00Z",
      "nextRetry": "2024-01-18T10:30:00Z"
    }
  ]
}
```

### Subscription Analytics

#### Get Subscription Analytics
```http
GET /admin/subscription-analytics?range=30d
Authorization: Bearer {admin_access_token}
```

**Query Parameters:**
- `range`: Time range (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "planDistribution": [
      {
        "planType": "player_premium",
        "count": 45,
        "percentage": 53.6,
        "mrr": 670500
      }
    ],
    "trends": [
      {
        "date": "2024-01-01",
        "mrr": 1200000,
        "subscriberCount": 80,
        "churnRate": 2.5
      }
    ],
    "retention": {
      "month1": 95.0,
      "month3": 85.0,
      "month6": 78.0,
      "month12": 70.0
    },
    "conversions": {
      "trialToActive": 65.0,
      "upgrades": 12,
      "downgrades": 3
    }
  }
}
```

---

## Webhook Endpoints

### Stripe Webhook Handler
```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: {signature}
```

**Supported Event Types:**
- `invoice.paid` - Payment successful
- `invoice.payment_failed` - Payment failed
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription canceled
- `payment_intent.succeeded` - One-time payment succeeded

**Webhook Processing:**
1. Signature verification
2. Event logging to database
3. Business logic execution
4. Email notifications (if applicable)
5. Status update

---

## Error Codes

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (Stripe API down)

### Error Response Format
```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "PAYMENT_METHOD_REQUIRED"
}
```

### Common Error Codes
- `STRIPE_NOT_CONFIGURED` - Stripe API key missing
- `PAYMENT_METHOD_REQUIRED` - No payment method on file
- `SUBSCRIPTION_NOT_FOUND` - User has no subscription
- `INVALID_PLAN_TYPE` - Plan type doesn't exist
- `PAYMENT_FAILED` - Payment processing failed
- `WEBHOOK_SIGNATURE_INVALID` - Webhook signature mismatch

---

## Testing

### Test Mode

Use Stripe test mode for development and testing:

**Test API Keys:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Test Cards

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Declined Card:**
```
Card Number: 4000 0000 0000 0002
```

**Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
```

**3D Secure Required:**
```
Card Number: 4000 0027 6000 3184
```

### Testing Webhooks

**Using Stripe CLI:**
```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe

# Trigger test events
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

**Manual Testing:**
1. Set up webhook endpoint in Stripe Dashboard
2. Use Stripe Dashboard to send test webhooks
3. Check webhook event log in admin dashboard
4. Verify email notifications sent

### Test Scenarios

**Complete Subscription Flow:**
1. Create account
2. Add payment method (test card)
3. Subscribe to plan
4. Verify webhook received
5. Check subscription status
6. Receive welcome email

**Payment Failure Flow:**
1. Subscribe with declining card
2. Verify payment failed webhook
3. Check failed payment in admin dashboard
4. Receive payment failed email
5. Update payment method
6. Verify retry successful

**Cancellation Flow:**
1. Cancel subscription
2. Verify status shows `cancel_at_period_end`
3. Wait for period end (or use Stripe CLI to trigger)
4. Verify subscription deleted webhook
5. Receive cancellation email
6. Confirm access ends at period end

---

## Rate Limiting

All endpoints are rate-limited:
- **User endpoints:** 100 requests per minute
- **Admin endpoints:** 200 requests per minute
- **Webhook endpoints:** 1000 requests per minute

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641072600
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `limit`: Items per page (max: 100)
- `starting_after`: Cursor for next page
- `ending_before`: Cursor for previous page

**Response:**
```json
{
  "data": [...],
  "hasMore": true,
  "nextCursor": "pm_abc123"
}
```

---

## Support

- **Stripe Documentation:** https://stripe.com/docs/api
- **Webhook Testing:** https://stripe.com/docs/webhooks/test
- **Dashboard:** https://dashboard.stripe.com
- **Support Email:** support@iup-golf.com
