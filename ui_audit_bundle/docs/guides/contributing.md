# Contributing Guide

> Guidelines for contributing to IUP Golf Platform

## Getting Started

1. Read the [Development Guide](./development.md)
2. Set up your local environment
3. Find an issue to work on or create one

## Workflow

### 1. Create a Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

### 2. Make Changes

- Write code following our style guide
- Add tests for new functionality
- Update documentation if needed

### 3. Commit

```bash
git add .
git commit -m "feat: add user profile endpoint"
```

Commit message format:
```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request with:
- Clear title
- Description of changes
- Link to related issue
- Screenshots if UI changes

## Code Style

### TypeScript

```typescript
// Use explicit types
function calculateScore(results: TestResult[]): number {
  return results.reduce((sum, r) => sum + r.score, 0);
}

// Use interfaces for objects
interface Player {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Use async/await over promises
async function getPlayer(id: string): Promise<Player> {
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) throw new NotFoundError('Player not found');
  return player;
}
```

### React

```typescript
// Use functional components
export function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="rounded-lg p-4 shadow">
      <h3>{player.firstName} {player.lastName}</h3>
    </div>
  );
}

// Use hooks
function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers().then(setPlayers).finally(() => setLoading(false));
  }, []);

  return { players, loading };
}
```

## Testing

- Write tests for new features
- Update tests when changing behavior
- Run full test suite before submitting PR

```bash
pnpm test
```

## Documentation

- Update docs for API changes
- Add JSDoc comments for public functions
- Update README if adding features

## Review Process

1. Automated checks run (lint, test, build)
2. Code review by maintainer
3. Address feedback
4. Merge when approved

## Questions?

- Open a GitHub issue
- Check existing documentation
- Ask in pull request comments

---

Thank you for contributing!
