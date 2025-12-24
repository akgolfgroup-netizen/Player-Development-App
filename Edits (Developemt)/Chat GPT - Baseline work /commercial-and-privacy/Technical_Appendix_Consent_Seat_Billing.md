# Technical Appendix – Consent, Seat Counting & Billing

## Required Events
- consent_given
- structured_session_completed
- plan_confirmed
- training_log_submitted
- feedback_received

## Core Tables
- consent_log(user_id, version, timestamp)
- activity_events(user_id, org_id, event_type, timestamp)
- active_player_month(org_id, month, active_count)
- invoice_line_items(org_id, month, amount)

## Nightly Job (Pseudo)
1. Validate active consent
2. Count distinct active players per org
3. Persist snapshot
4. Generate invoice lines

## Compliance
- Append-only consent logs
- Guardian consent required for minors
- Immutable monthly billing snapshots