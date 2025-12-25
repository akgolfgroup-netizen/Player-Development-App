# ADR 003: Multi-Tenant Architecture via Tenant ID Column

## Status

Accepted

## Context

The platform serves multiple golf academies (tenants). We need to isolate data between organizations. Options considered:

1. **Separate databases** - One database per tenant
2. **Separate schemas** - One schema per tenant in same database
3. **Shared tables with tenant_id** - Single schema, filter by tenant

## Decision

Use **shared tables with tenant_id column** for multi-tenancy.

## Rationale

1. **Simplicity**: Single database, single schema
2. **Cost**: One database instance to manage
3. **Migrations**: Apply once, affects all tenants
4. **Cross-tenant queries**: Possible for analytics (with proper auth)
5. **Scaling**: Can shard by tenant_id later if needed

## Implementation

### Schema Pattern

```prisma
model Player {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  email     String
  // ... other fields

  @@index([tenantId])
  @@map("players")
}
```

### Query Pattern

```typescript
// Middleware extracts tenantId from JWT
const tenantId = request.user.tenantId;

// All queries include tenant filter
const players = await prisma.player.findMany({
  where: { tenantId },
});
```

### Security

- JWT contains tenant_id claim
- Middleware validates tenant access
- No query can omit tenant filter

## Consequences

### Positive

- Simple to implement and maintain
- Easy to add new tenants
- Single deployment serves all tenants
- Unified backup and restore

### Negative

- Noisy neighbor risk (one tenant affects others)
- Must ensure tenant filter on every query
- Complex cross-tenant analytics queries
- Row-level security requires careful implementation

## Mitigations

- **Noisy neighbor**: Rate limiting per tenant
- **Query safety**: Prisma middleware to inject tenant filter
- **Testing**: Integration tests verify tenant isolation

## References

- [Multi-Tenant SaaS Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)
