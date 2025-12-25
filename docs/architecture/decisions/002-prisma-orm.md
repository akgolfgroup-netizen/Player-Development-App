# ADR 002: Use Prisma as ORM

## Status

Accepted

## Context

We need a database access layer for PostgreSQL. Options considered:

- **Raw SQL** - Maximum control, no abstraction
- **Knex.js** - Query builder
- **TypeORM** - Full ORM with decorators
- **Prisma** - Modern ORM with type generation

## Decision

Use **Prisma** as the ORM.

## Rationale

1. **Type safety**: Auto-generated TypeScript types from schema
2. **Migrations**: Built-in migration system
3. **Query API**: Intuitive, type-safe query builder
4. **Relations**: Easy handling of relationships
5. **SQL injection**: Parameterized queries by default

## Consequences

### Positive

- Compile-time type checking for queries
- No raw SQL for common operations
- Easy schema evolution with migrations
- Excellent developer experience

### Negative

- Some complex queries require raw SQL
- Build step for type generation
- Learning curve for Prisma-specific patterns

## Example

```typescript
// Type-safe query with auto-completion
const player = await prisma.player.findUnique({
  where: { id: playerId },
  include: {
    testResults: true,
    badges: true,
  },
});
```

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
