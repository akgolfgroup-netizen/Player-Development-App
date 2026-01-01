# ADR NNN: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date

YYYY-MM-DD

## Context

<!--
What is the issue that we're seeing that is motivating this decision?
What is the problem we're trying to solve?
What are the forces at play (technical, business, organizational)?
-->

[Describe the context and problem statement]

## Options Considered

### Option 1: [Name]

**Description:** [Brief description]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

### Option 2: [Name]

**Description:** [Brief description]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

## Decision

[State the decision clearly]

We will use **[chosen option]**.

## Rationale

<!-- Why was this option chosen over the alternatives? -->

1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

## Consequences

### Positive

- [Positive consequence 1]
- [Positive consequence 2]

### Negative

- [Negative consequence 1]
- [Negative consequence 2]

### Neutral

- [Neutral consequence 1]

## Implementation Notes

<!--
Optional: Any specific implementation details or migration steps.
Include code examples if helpful.
-->

```typescript
// Example code if relevant
```

## Related Decisions

- [ADR-XXX: Related decision](./XXX-related.md)

## References

- [Reference 1](URL)
- [Reference 2](URL)

---

## How to Use This Template

1. Copy this file as `NNN-descriptive-name.md`
2. Replace NNN with the next sequential number (e.g., 005, 006)
3. Use lowercase-with-hyphens for the filename
4. Fill in all sections (remove this "How to Use" section)
5. Get team review before marking as "Accepted"
6. Update the ADR index if one exists

### ADR Naming Convention

- `001-framework-choice.md` - Initial framework selection
- `002-database-orm.md` - Database ORM decision
- `003-feature-name.md` - Feature-specific decision

### Status Lifecycle

1. **Proposed** - Under discussion, not yet accepted
2. **Accepted** - Approved by the team, in effect
3. **Deprecated** - No longer recommended, but not replaced
4. **Superseded** - Replaced by another ADR (link to new one)
