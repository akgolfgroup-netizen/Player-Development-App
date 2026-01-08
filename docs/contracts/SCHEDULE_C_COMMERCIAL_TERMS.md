# Schedule C: Commercial Terms

**IUP Golf Platform**
**Version:** 1.0
**Effective Date:** [TBD]
**Document Status:** Draft for Review

---

## 1. LICENSING MODEL

### 1.1 License Grant

Subject to payment of applicable fees, Customer is granted a non-exclusive, non-transferable license to access and use the IUP Golf Platform for the duration of the subscription term.

### 1.2 License Scope

| Included | Not Included |
|----------|--------------|
| Web application access | Source code access |
| Mobile application access | White-label rights |
| API access (rate-limited) | Resale rights |
| Standard support | Custom development |
| Platform updates | On-premise deployment |

### 1.3 Subscription Term

| Term Type | Duration | Billing |
|-----------|----------|---------|
| Monthly | 1 month | Advance |
| Annual | 12 months | Advance (or quarterly) |
| Multi-year | 24-36 months | Negotiable |

---

## 2. SUBSCRIPTION TIERS

### 2.1 Tier Overview

| Tier | Target Customer | Active Players | Features |
|------|-----------------|----------------|----------|
| **Starter** | Individual coaches | 1-10 | Core features |
| **Club** | Golf clubs | 11-50 | Full features |
| **Academy** | Training academies | 51-200 | Full + analytics |
| **Federation** | NGF / Regional | 200+ | Enterprise features |

### 2.2 Feature Matrix

| Feature | Starter | Club | Academy | Federation |
|---------|---------|------|---------|------------|
| Player dashboard | Yes | Yes | Yes | Yes |
| Training tracking | Yes | Yes | Yes | Yes |
| Test protocols (20+) | Yes | Yes | Yes | Yes |
| A-K category system | Yes | Yes | Yes | Yes |
| Gamification (85 badges) | Yes | Yes | Yes | Yes |
| Coach dashboard | Yes | Yes | Yes | Yes |
| Training plan editor | Yes | Yes | Yes | Yes |
| Video upload | 10 GB | 50 GB | 200 GB | Unlimited |
| Video analysis tools | Basic | Full | Full | Full |
| Voice-over | No | Yes | Yes | Yes |
| Side-by-side comparison | No | Yes | Yes | Yes |
| Multi-coach support | No | Yes | Yes | Yes |
| Admin portal | No | Basic | Full | Full |
| Custom branding | No | No | Logo only | Full |
| API access | No | Limited | Full | Full |
| Analytics dashboard | No | No | Yes | Yes |
| Aggregated reporting | No | No | No | Yes |
| Dedicated support | No | No | Yes | Yes |
| SLA guarantee | 99% | 99% | 99.5% | 99.9% |

### 2.3 Active Player Definition

An "Active Player" is defined as a registered player account that has:
- Logged in within the last 30 days, OR
- Had training data recorded within the last 30 days

Inactive accounts do not count toward subscription limits.

---

## 3. PRICING

### 3.1 Standard Pricing (NOK)

| Tier | Monthly | Annual (per month) | Savings |
|------|---------|-------------------|---------|
| Starter (up to 10) | 990 | 790 | 20% |
| Club (11-50) | 2,990 | 2,390 | 20% |
| Academy (51-200) | 7,990 | 6,390 | 20% |
| Federation (200+) | Custom | Custom | Negotiable |

*All prices exclude VAT (25%)*

### 3.2 Per-Player Pricing Option

For larger deployments, per-active-player pricing may apply:

| Volume | Per Player/Month | Per Player/Year |
|--------|------------------|-----------------|
| 1-50 | 99 NOK | 990 NOK |
| 51-200 | 79 NOK | 790 NOK |
| 201-500 | 59 NOK | 590 NOK |
| 500+ | 39 NOK | 390 NOK |

### 3.3 Federation / NGF Special Terms

For the Norwegian Golf Federation and similar national bodies:

| Term | Offer |
|------|-------|
| Pilot program | 3 months free (up to 3 clubs) |
| National rollout | Volume discount 40-50% |
| Multi-year commitment | Additional 10% discount |
| Co-marketing | Negotiable value |
| Data insights (anonymized) | Included |

### 3.4 Add-Ons

| Add-On | Price | Description |
|--------|-------|-------------|
| Additional storage (100 GB) | 500 NOK/month | Video storage |
| API rate limit increase | 1,000 NOK/month | Higher API quotas |
| White-label mobile app | 50,000 NOK one-time | Custom branding |
| Custom integration | Quoted | Trackman, GolfBox, etc. |
| Training & onboarding | 10,000 NOK | 4-hour session |

---

## 4. PAYMENT TERMS

### 4.1 Invoicing

| Term | Invoice Schedule |
|------|------------------|
| Monthly | 1st of each month, advance |
| Annual | Upon contract signing, advance |
| Quarterly | Upon period start, advance |

### 4.2 Payment Methods

- Bank transfer (preferred)
- Credit card (Visa, Mastercard)
- Direct debit (AvtaleGiro)

### 4.3 Payment Due

- Invoices due within 14 days of issue
- Late payment interest: 10.5% annually (Norwegian standard)
- Suspension of service after 30 days overdue

### 4.4 Currency

All prices in Norwegian Kroner (NOK). International customers may request EUR or USD pricing.

---

## 5. SERVICE LEVEL AGREEMENT (SLA)

### 5.1 Uptime Commitment

| Tier | Monthly Uptime Target | Measurement |
|------|----------------------|-------------|
| Starter | 99.0% | Calendar month |
| Club | 99.0% | Calendar month |
| Academy | 99.5% | Calendar month |
| Federation | 99.9% | Calendar month |

### 5.2 Uptime Calculation

```
Uptime % = ((Total Minutes - Downtime Minutes) / Total Minutes) × 100
```

**Exclusions from downtime:**
- Scheduled maintenance (notified 48 hours in advance)
- Force majeure events
- Customer-caused issues
- Third-party service failures beyond our control

### 5.3 Service Credits

If monthly uptime falls below target:

| Uptime Achieved | Service Credit |
|-----------------|----------------|
| 99.0% - 99.5% | 10% of monthly fee |
| 98.0% - 99.0% | 25% of monthly fee |
| 95.0% - 98.0% | 50% of monthly fee |
| Below 95.0% | 100% of monthly fee |

**Credit process:**
1. Customer submits credit request within 30 days
2. Service Provider verifies downtime
3. Credit applied to next invoice

### 5.4 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (p95) | < 200ms | Weekly average |
| Page load time | < 3 seconds | 95th percentile |
| Error rate | < 0.1% | Monthly average |
| Video upload success | > 95% | Monthly average |

---

## 6. SUPPORT

### 6.1 Support Levels

| Tier | Support Level | Channels |
|------|---------------|----------|
| Starter | Standard | Email, knowledge base |
| Club | Standard | Email, knowledge base |
| Academy | Priority | Email, chat, phone |
| Federation | Dedicated | Named contact, phone, video |

### 6.2 Response Times

| Priority | Starter/Club | Academy | Federation |
|----------|--------------|---------|------------|
| Critical (service down) | 8 hours | 4 hours | 1 hour |
| High (major feature broken) | 24 hours | 8 hours | 4 hours |
| Medium (minor issue) | 48 hours | 24 hours | 8 hours |
| Low (questions, requests) | 72 hours | 48 hours | 24 hours |

### 6.3 Support Hours

| Level | Hours |
|-------|-------|
| Standard | Mon-Fri 09:00-17:00 CET |
| Priority | Mon-Fri 08:00-20:00 CET |
| Dedicated | Mon-Sun 08:00-22:00 CET |

### 6.4 Escalation Path

1. **Tier 1**: Support team (initial response)
2. **Tier 2**: Technical specialist
3. **Tier 3**: Engineering team
4. **Executive**: Account manager / management

---

## 7. ONBOARDING AND TRAINING

### 7.1 Standard Onboarding (Included)

| Phase | Activities | Duration |
|-------|------------|----------|
| Setup | Account creation, user provisioning | 1 day |
| Configuration | Tenant setup, feature activation | 1-2 days |
| Training | Self-service video tutorials, documentation | Ongoing |
| Go-live | Launch support | 1 day |

### 7.2 Premium Onboarding (Add-On)

| Service | Description | Price |
|---------|-------------|-------|
| Kickoff workshop | 2-hour remote session | 5,000 NOK |
| Admin training | 2-hour session for admins | 3,000 NOK |
| Coach training | 2-hour session for coaches | 3,000 NOK |
| On-site training | Full-day on-site | 15,000 NOK + travel |
| Data migration | Import from existing systems | Quoted |

### 7.3 Ongoing Training

- Video tutorial library (included)
- Monthly webinars (included for Academy+)
- Release notes and documentation (included)
- Annual refresher training (Federation)

---

## 8. CONTRACT TERMS

### 8.1 Minimum Commitment

| Tier | Minimum Term |
|------|--------------|
| Starter | 1 month |
| Club | 12 months |
| Academy | 12 months |
| Federation | 24 months |

### 8.2 Renewal

- Auto-renewal unless cancelled 30 days before term end
- Price increases capped at 5% annually
- 60-day notice for significant changes

### 8.3 Termination

**By Customer:**
- With cause (material breach): Immediate, with 30-day cure period
- Without cause: End of current term
- Early termination (without cause): Remaining term fees due

**By Provider:**
- Non-payment after 30 days: Immediate
- Material breach: 30-day cure period
- Illegal activity: Immediate

### 8.4 Effect of Termination

Upon termination:
1. Data export available for 30 days
2. Account access suspended
3. Data deletion per Schedule B
4. No refund for unused portion (unless terminated for cause)

---

## 9. INTELLECTUAL PROPERTY

### 9.1 Platform IP

The Platform, including all software, designs, and documentation, remains the exclusive property of the Service Provider.

### 9.2 Customer Data

Customer retains all rights to data entered into the Platform. The Provider has no ownership claim to customer data.

### 9.3 Feedback

Customer feedback and suggestions may be incorporated into the Platform without compensation, but do not transfer IP rights to specific implementations.

### 9.4 Restrictions

Customer shall not:
- Reverse engineer the Platform
- Create derivative works
- Resell or sublicense access
- Remove proprietary notices
- Use for competitive analysis

---

## 10. CONFIDENTIALITY

### 10.1 Definition

Confidential Information includes:
- Pricing and commercial terms
- Technical documentation not publicly available
- Customer data
- Business strategies and plans

### 10.2 Obligations

Each party shall:
- Protect Confidential Information with reasonable care
- Use only for purposes of this agreement
- Disclose only to employees with need to know
- Not disclose to third parties without consent

### 10.3 Exclusions

Confidentiality does not apply to information that:
- Is publicly available
- Was known prior to disclosure
- Is independently developed
- Is required by law to be disclosed

### 10.4 Duration

Confidentiality obligations survive termination for 3 years.

---

## 11. LIABILITY

### 11.1 Limitation of Liability

Neither party's total liability shall exceed:
- The fees paid in the 12 months preceding the claim, OR
- 500,000 NOK, whichever is greater

### 11.2 Exclusions

Neither party is liable for:
- Indirect, incidental, or consequential damages
- Lost profits or revenue
- Data loss (beyond restoration from backups)
- Third-party claims

### 11.3 Exceptions

Limitations do not apply to:
- Breach of confidentiality
- Intellectual property infringement
- Gross negligence or willful misconduct
- Data protection breaches due to negligence

---

## 12. WARRANTIES

### 12.1 Provider Warranties

The Provider warrants that:
- The Platform will perform substantially as described
- Services will be provided professionally
- The Platform will not infringe third-party IP
- Security measures are implemented as described

### 12.2 Customer Warranties

The Customer warrants that:
- It has authority to enter this agreement
- It will use the Platform lawfully
- It will obtain necessary consents from data subjects
- It will not attempt to breach security

### 12.3 Disclaimer

EXCEPT AS EXPRESSLY STATED, THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

---

## 13. INSURANCE

### 13.1 Provider Insurance

The Provider maintains:
- Professional liability insurance: 5,000,000 NOK
- Cyber liability insurance: 5,000,000 NOK
- General liability insurance: 2,000,000 NOK

### 13.2 Certificates

Certificates of insurance available upon request.

---

## 14. GOVERNANCE

### 14.1 Governing Law

This agreement is governed by Norwegian law.

### 14.2 Dispute Resolution

1. **Negotiation**: Good faith discussion (30 days)
2. **Mediation**: If negotiation fails, mediation attempt
3. **Arbitration**: Oslo Chamber of Commerce rules
4. **Venue**: Oslo, Norway

### 14.3 Language

This agreement is executed in Norwegian. English translation for convenience; Norwegian prevails.

---

## 15. GENERAL PROVISIONS

### 15.1 Force Majeure

Neither party is liable for failure due to circumstances beyond reasonable control, including natural disasters, war, government action, or infrastructure failures.

### 15.2 Assignment

Customer may not assign this agreement without written consent. Provider may assign to affiliates or successors.

### 15.3 Notices

Written notices to designated contacts via email (with read receipt) or registered mail.

### 15.4 Entire Agreement

This agreement, including all Schedules, constitutes the entire agreement and supersedes prior negotiations.

### 15.5 Amendments

Amendments must be in writing and signed by both parties.

### 15.6 Severability

If any provision is unenforceable, remaining provisions remain in effect.

---

## APPENDIX A: PILOT PROGRAM TERMS

### NGF Pilot Program (Proposed)

| Element | Terms |
|---------|-------|
| Duration | 3 months |
| Participants | Up to 3 clubs, 100 players total |
| Cost | No charge |
| Features | Academy tier |
| Support | Priority support |
| Objective | Validate product-market fit |
| Success criteria | User engagement, feedback quality |
| Transition | Federation agreement upon success |

### Pilot Requirements

Customer agrees to:
- Designate pilot coordinator
- Provide weekly feedback
- Participate in evaluation interviews
- Share anonymized usage data

---

## APPENDIX B: ORDER FORM TEMPLATE

### IUP Golf - Order Form

**Customer Information:**
- Organization: ____________________
- Contact Name: ____________________
- Email: ____________________
- Address: ____________________

**Subscription Details:**
- Tier: [ ] Starter [ ] Club [ ] Academy [ ] Federation
- Active Players: ____________________
- Start Date: ____________________
- Term: [ ] Monthly [ ] Annual [ ] Multi-year

**Pricing:**
- Base subscription: ____________________ NOK
- Add-ons: ____________________ NOK
- Total (excl. VAT): ____________________ NOK
- VAT (25%): ____________________ NOK
- **Total (incl. VAT):** ____________________ NOK

**Signatures:**

Customer: ____________________
Date: ____________________

Service Provider: ____________________
Date: ____________________

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Generated from business analysis | Initial draft |

---

*Commercial terms are subject to negotiation. This document serves as a starting framework and should be reviewed by legal and commercial teams before execution.*
