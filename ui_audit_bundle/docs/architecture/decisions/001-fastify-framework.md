# ADR 001: Use Fastify as HTTP Framework

## Status

Accepted

## Context

We need a Node.js HTTP framework for the backend API. Options considered:

- **Express** - Most popular, large ecosystem
- **Fastify** - High performance, TypeScript-first
- **NestJS** - Full framework, opinionated
- **Koa** - Minimal, middleware-focused

## Decision

Use **Fastify** as the HTTP framework.

## Rationale

1. **Performance**: Fastify is one of the fastest Node.js frameworks
2. **TypeScript**: First-class TypeScript support with type providers
3. **Schema validation**: Built-in JSON Schema validation
4. **Plugin system**: Clean plugin architecture for modularity
5. **OpenAPI**: Easy Swagger/OpenAPI generation
6. **Logging**: Pino logger built-in (structured JSON logs)

## Consequences

### Positive

- High request throughput
- Automatic request/response validation
- Easy API documentation generation
- Good developer experience with TypeScript

### Negative

- Smaller ecosystem than Express
- Some Express middleware needs adaptation
- Team needs to learn Fastify patterns

## References

- [Fastify Documentation](https://www.fastify.io/)
- [Fastify Benchmarks](https://www.fastify.io/benchmarks/)
