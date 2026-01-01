# Schedule B: Data Processing Agreement

**IUP Golf Academy Platform**
**Version:** 1.0
**Effective Date:** [TBD]
**Document Status:** Draft for Review

---

## 1. INTRODUCTION AND SCOPE

### 1.1 Purpose

This Data Processing Agreement ("DPA") sets forth the terms and conditions under which the Service Provider ("Processor") will process Personal Data on behalf of the Customer ("Controller") in connection with the IUP Golf Academy Platform ("Platform").

### 1.2 Definitions

| Term | Definition |
|------|------------|
| **Personal Data** | Any information relating to an identified or identifiable natural person |
| **Processing** | Any operation performed on Personal Data |
| **Data Subject** | The individual to whom Personal Data relates |
| **Controller** | The entity determining the purposes and means of Processing |
| **Processor** | The entity Processing Personal Data on behalf of the Controller |
| **Sub-processor** | Third party engaged by the Processor to process data |

### 1.3 Roles

| Party | Role | Description |
|-------|------|-------------|
| Customer Organization | Controller | Determines purposes of athlete data collection |
| Service Provider | Processor | Processes data according to Controller instructions |
| Athletes/Players | Data Subjects | Individuals whose data is processed |

---

## 2. DATA PROCESSING PRINCIPLES

### 2.1 Lawfulness and Purpose

The Processor shall only process Personal Data:
- For the purposes specified in Schedule A (Service Description)
- In accordance with documented Controller instructions
- In compliance with applicable data protection laws (GDPR)

### 2.2 Data Minimization

The Platform collects only data necessary for:
- Player development tracking
- Training plan execution
- Performance measurement
- Communication between coaches and players

### 2.3 Purpose Limitation

Data collected for player development shall not be used for:
- Marketing without explicit consent
- Profiling for commercial purposes
- Sharing with third parties for unrelated purposes
- Creating aggregated performance rankings visible to others

---

## 3. CATEGORIES OF PERSONAL DATA

### 3.1 Player Data

| Category | Data Elements | Retention |
|----------|---------------|-----------|
| **Identity Data** | Name, date of birth, gender | Active account + 2 years |
| **Contact Data** | Email address | Active account + 2 years |
| **Account Data** | Username, hashed password, 2FA secrets | Active account |
| **Training Data** | Sessions, exercises, duration, notes | Active account + 5 years |
| **Test Results** | Physical tests, golf tests, scores | Active account + 5 years |
| **Achievement Data** | Badges earned, XP points, streaks | Active account + 2 years |
| **Media Data** | Videos, photos uploaded | Active account + 1 year |
| **Communication** | Messages with coach | Active account + 2 years |

### 3.2 Coach Data

| Category | Data Elements | Retention |
|----------|---------------|-----------|
| **Identity Data** | Name, professional credentials | Active account + 2 years |
| **Contact Data** | Email address, phone (optional) | Active account + 2 years |
| **Account Data** | Username, hashed password, 2FA secrets | Active account |
| **Activity Data** | Notes created, plans edited, logins | Active account + 1 year |

### 3.3 Special Categories

| Data Type | Collected? | Purpose | Legal Basis |
|-----------|------------|---------|-------------|
| Health data (physical tests) | Yes | Performance tracking | Explicit consent |
| Biometric data | No | - | - |
| Racial/ethnic origin | No | - | - |
| Political/religious views | No | - | - |

---

## 4. PROCESSING OF MINORS' DATA

### 4.1 Age Considerations

The Platform is designed for golf development programs that often include minors (under 18 years).

### 4.2 Consent Requirements

| Age Group | Consent Requirement |
|-----------|---------------------|
| 16-17 years | Player consent + parental notification |
| 13-15 years | Player consent + parental consent |
| Under 13 | Parental consent only |

*Note: Age thresholds follow Norwegian GDPR implementation.*

### 4.3 Parental Rights

Parents/guardians of minor players have the right to:
- Access their child's data
- Request correction of inaccurate data
- Request deletion of data (right to erasure)
- Object to specific processing activities
- Receive a copy of data (portability)

### 4.4 Consent Collection Process

1. **Registration**: Parent/guardian must approve account creation
2. **Consent Form**: Digital consent form with clear explanation
3. **Verification**: Email verification to parental email address
4. **Records**: Consent records maintained with timestamp

### 4.5 Child-Friendly Design

The Platform implements:
- Age-appropriate language in player interface
- No performance shaming or negative labeling
- Player ownership of interpretation of their data
- Coach observations clearly separated from system data

---

## 5. DATA SUBJECT RIGHTS

### 5.1 Rights Overview

| Right | Description | Implementation |
|-------|-------------|----------------|
| **Access** | Obtain copy of personal data | Export function in profile |
| **Rectification** | Correct inaccurate data | Edit profile, contact support |
| **Erasure** | Request deletion ("right to be forgotten") | Account deletion request |
| **Restriction** | Limit processing of data | Contact support |
| **Portability** | Receive data in machine-readable format | JSON/CSV export |
| **Object** | Object to specific processing | Contact support |
| **Withdraw Consent** | Revoke previously given consent | Settings page |

### 5.2 Response Times

| Request Type | Response Time |
|--------------|---------------|
| Access request | 30 days |
| Rectification | 30 days |
| Erasure | 30 days |
| Portability export | 30 days |

### 5.3 Identity Verification

Before fulfilling data subject requests:
- Email verification required
- For minors: Parental verification required
- Audit log of all requests maintained

---

## 6. TECHNICAL AND ORGANIZATIONAL MEASURES

### 6.1 Access Control

| Measure | Implementation |
|---------|----------------|
| Authentication | JWT tokens (15 min access, 7 day refresh) |
| Two-Factor Auth | TOTP with backup codes (optional) |
| Password Policy | Minimum 8 characters, hashed with bcrypt/Argon2 |
| Session Management | Automatic timeout, secure token storage |
| Role-Based Access | Player, Coach, Admin roles with defined permissions |

### 6.2 Data Isolation

| Measure | Implementation |
|---------|----------------|
| Multi-tenancy | All queries scoped by tenant_id |
| Cross-tenant prevention | Database-level isolation |
| Coach-player boundary | Coaches see only assigned players |
| Admin limitation | No access to individual player data |

### 6.3 Encryption

| Data State | Encryption |
|------------|------------|
| In Transit | TLS 1.2+ (HTTPS enforced) |
| At Rest | Database encryption (cloud provider) |
| Passwords | Argon2/bcrypt hashing |
| Tokens | Cryptographically secure generation |
| Backups | Encrypted storage |

### 6.4 Security Measures

| Category | Measures Implemented |
|----------|----------------------|
| **Network** | HTTPS only, CORS restrictions, rate limiting |
| **Application** | Input validation (Zod), SQL injection prevention (Prisma ORM) |
| **Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **Monitoring** | Sentry error tracking, audit logging |
| **Testing** | 240+ test cases, 149 security tests |

### 6.5 Security Audit Results

**Overall Rating: A- (Excellent)**

| Category | Status |
|----------|--------|
| Dependency vulnerabilities | None found |
| JWT implementation | Excellent |
| Password security | Excellent |
| Rate limiting | Excellent |
| Input validation | Good |
| SQL injection prevention | Excellent |

---

## 7. SUB-PROCESSORS

### 7.1 Approved Sub-processors

| Sub-processor | Purpose | Location | Data Processed |
|---------------|---------|----------|----------------|
| Amazon Web Services | Cloud hosting, S3 storage | EU (Ireland) | All platform data |
| Redis Labs | Caching | EU | Session tokens, rate limits |
| Sentry | Error monitoring | EU | Error data (PII scrubbed) |
| Email Provider (TBD) | Transactional email | EU | Email addresses, names |

### 7.2 Sub-processor Requirements

All sub-processors must:
- Provide equivalent data protection guarantees
- Process data only as instructed
- Implement appropriate security measures
- Allow audits upon reasonable notice
- Notify of any security incidents

### 7.3 Changes to Sub-processors

The Controller will be notified 30 days in advance of:
- New sub-processor additions
- Changes to existing sub-processor purposes
- Sub-processor replacements

Controller may object within 14 days with reasonable grounds.

---

## 8. DATA TRANSFERS

### 8.1 Geographic Scope

| Data Type | Storage Location | Transfer Outside EU? |
|-----------|------------------|----------------------|
| Primary database | AWS EU (Ireland) | No |
| File storage (S3) | AWS EU (Ireland) | No |
| Backups | AWS EU (Ireland) | No |
| Monitoring data | Sentry EU | No |

### 8.2 Transfer Safeguards

If transfers outside EU/EEA become necessary:
- Standard Contractual Clauses (SCCs) required
- Transfer Impact Assessments conducted
- Additional technical measures implemented
- Controller notification and approval

---

## 9. DATA RETENTION AND DELETION

### 9.1 Retention Schedule

| Data Category | Retention Period | After Expiry |
|---------------|------------------|--------------|
| Active account data | Duration of account | See deletion |
| Training history | Account + 5 years | Anonymization |
| Test results | Account + 5 years | Anonymization |
| Media (videos) | Account + 1 year | Deletion |
| Messages | Account + 2 years | Deletion |
| Audit logs | 3 years | Deletion |
| Backups | 30 days rolling | Automatic deletion |

### 9.2 Account Deletion Process

Upon account deletion request:

1. **Immediate**: Deactivate account access
2. **30 days**: Delete personal identifiers
3. **30 days**: Delete media files from S3
4. **90 days**: Anonymize historical training data (if retained for statistics)
5. **90 days**: Confirm deletion to data subject

### 9.3 Anonymization

Anonymized data may be retained for:
- Aggregate platform statistics
- Benchmark calibration
- Research (with explicit consent only)

Anonymization ensures no re-identification is possible.

---

## 10. DATA BREACH PROCEDURES

### 10.1 Detection and Assessment

The Processor maintains:
- Real-time security monitoring
- Anomaly detection systems
- Access logging and audit trails
- Incident response team

### 10.2 Notification Timeline

| Event | Timeline |
|-------|----------|
| Breach detection | Immediate internal assessment |
| Controller notification | Within 24 hours of confirmation |
| Supervisory authority (if required) | Controller within 72 hours |
| Data subjects (if required) | Without undue delay |

### 10.3 Breach Notification Content

Notification to Controller includes:
- Nature of the breach
- Categories and approximate number of data subjects
- Categories of personal data affected
- Likely consequences
- Measures taken or proposed
- Contact point for further information

### 10.4 Post-Incident

Following a breach:
- Root cause analysis
- Implementation of preventive measures
- Documentation for compliance records
- Lessons learned review

---

## 11. AUDIT RIGHTS

### 11.1 Controller Audit Rights

The Controller may:
- Request documentation of security measures
- Conduct on-site audits with 30 days notice
- Request third-party audit reports
- Review sub-processor compliance

### 11.2 Audit Scope

Audits may cover:
- Technical security measures
- Organizational measures
- Sub-processor management
- Data subject request handling
- Incident response procedures

### 11.3 Cooperation

The Processor shall:
- Provide reasonable access to facilities
- Make relevant personnel available
- Provide documentation as requested
- Implement agreed remediation actions

---

## 12. TERMINATION

### 12.1 Data Return

Upon termination of the service agreement:

| Timeline | Action |
|----------|--------|
| Upon request | Provide data export in standard format (JSON/CSV) |
| 30 days | Complete data export |
| 60 days | Begin data deletion process |
| 90 days | Complete deletion, provide certification |

### 12.2 Certification

Upon completion of deletion, the Processor will provide written certification that:
- All personal data has been deleted
- All copies have been destroyed
- Sub-processors have confirmed deletion

---

## 13. LIABILITY AND INDEMNIFICATION

### 13.1 Processor Obligations

The Processor shall:
- Process data only as instructed
- Ensure staff confidentiality
- Implement required security measures
- Assist with data subject requests
- Notify of breaches promptly
- Support Controller audits

### 13.2 Indemnification

Each party shall indemnify the other for:
- Breaches of this DPA
- Non-compliance with data protection laws
- Claims from data subjects due to party's negligence

---

## 14. GOVERNING LAW

### 14.1 Applicable Law

This DPA is governed by:
- Norwegian law
- EU General Data Protection Regulation (GDPR)
- Norwegian Personal Data Act (Personopplysningsloven)

### 14.2 Supervisory Authority

The relevant supervisory authority is:
**Datatilsynet** (Norwegian Data Protection Authority)
Postboks 458 Sentrum
0105 Oslo, Norway

---

## 15. AMENDMENTS

### 15.1 Changes to This DPA

This DPA may be amended:
- By mutual written agreement
- To reflect changes in applicable law
- To address regulatory guidance

### 15.2 Notice of Changes

Changes shall be communicated 30 days in advance, except where legally required sooner.

---

## APPENDIX A: CONSENT FORM TEMPLATE (MINORS)

### Parental Consent for Minor's Use of IUP Golf Academy

**Player Name:** ____________________
**Date of Birth:** ____________________
**Parent/Guardian Name:** ____________________

I, the undersigned parent/guardian, hereby:

- [ ] Consent to my child's use of the IUP Golf Academy Platform
- [ ] Consent to the collection and processing of my child's personal data as described in the Privacy Policy
- [ ] Understand that training data, test results, and achievements will be stored
- [ ] Understand that assigned coaches will have access to my child's training data
- [ ] Understand my right to access, correct, or delete my child's data

**Signature:** ____________________
**Date:** ____________________
**Email for verification:** ____________________

---

## APPENDIX B: DATA SUBJECT REQUEST FORM

### Request Type (select one):
- [ ] Access my data
- [ ] Correct my data
- [ ] Delete my data
- [ ] Export my data
- [ ] Object to processing
- [ ] Withdraw consent

**Name:** ____________________
**Email (registered):** ____________________
**Account ID (if known):** ____________________
**Details of request:** ____________________

**For minors:**
**Parent/Guardian Name:** ____________________
**Relationship:** ____________________

**Signature:** ____________________
**Date:** ____________________

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | Generated from codebase analysis | Initial draft |

---

*This Data Processing Agreement is a template based on implemented platform capabilities. Final version should be reviewed by legal counsel.*
