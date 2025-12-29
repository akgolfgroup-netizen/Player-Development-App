# UI Contracts

## What is a UI Contract?

A **UI Contract** is a formal specification that defines the **behavior** of a user interface screen, independent of its visual design. It acts as a binding agreement between frontend and backend implementations.

**Philosophy**: Behavior first, visuals later. If implementation and contract disagree, **the contract wins**.

---

## Why UI Contracts?

### Problems They Solve

1. **Ambiguous Requirements**
   - ❌ "Add a save button" - What happens when clicked? What if it fails? When is it enabled?
   - ✅ Contract specifies: states, transitions, API calls, success/error handling

2. **Frontend/Backend Misalignment**
   - ❌ Frontend expects 200, backend returns 201 → confusion
   - ✅ Contract defines: "201 → plan_generated state, navigate after 3s"

3. **Untestable Behavior**
   - ❌ Tests tied to UI implementation (brittle)
   - ✅ Tests derived from contract (stable, implementation-agnostic)

4. **Legal Risk**
   - ❌ Copying Apple's visual design → lawsuit
   - ✅ Contract allows Apple-like behavior, requires distinct visuals

5. **State Management Chaos**
   - ❌ Implicit state transitions, hard to debug
   - ✅ Explicit state machine, deterministic behavior

### Benefits

- ✅ **Deterministic**: Same input → same output, always
- ✅ **Testable**: Contract → tests → implementation
- ✅ **Maintainable**: Behavior documented in one place
- ✅ **Cross-platform**: Web-native patterns, not iOS/macOS
- ✅ **Legally safe**: Distinct from Apple designs

---

## Contract Structure

Every contract contains:

### 1. Screen Identity
```typescript
screen: "PlayerIntakeForm"
version: "1.0.0"
primaryGoal: "Collect player data to generate training plan"
```

### 2. Roles & Permissions
```typescript
allowedRoles: ["player", "coach"]
roleCapabilities: {
  player: ["fill_own_form", "save_progress"],
  coach: ["fill_player_form", "view_all_intakes"]
}
```

### 3. Required Context
```typescript
requiredContext: {
  playerId: { type: "UUID", source: "auth_session" },
  tenantId: { type: "UUID", source: "auth_session" }
}
```

### 4. State Machine
```typescript
states: {
  idle: { description: "...", allowedActions: [...] },
  saving: { description: "...", apiCall: "POST /intake" },
  saved: { description: "...", displayData: {...} },
  error_validation: { ... },
  error_system: { ... }
}
```

### 5. State Transitions
```typescript
transitions: {
  "editing → saving": {
    trigger: "user clicks Save",
    validation: "at least one section filled"
  },
  "saving → saved": {
    trigger: "API returns 200",
    payload: "{ id, completionPercentage }"
  }
}
```

### 6. API Bindings
```typescript
apiBindings: {
  saveProgress: {
    method: "POST",
    endpoint: "/api/v1/intake",
    responses: {
      200: { state: "saved", sideEffects: [...] },
      400: { state: "error_validation", ... },
      500: { state: "error_system", ... }
    }
  }
}
```

### 7. Navigation Rules
```typescript
navigation: {
  entry: { from: ["Dashboard", "PlayerProfile"] },
  exit: {
    onSuccess: "PlanPreviewScreen",
    onAbort: "previous_screen"
  },
  confirmationRequired: {
    when: "hasUnsavedChanges",
    message: "Save before leaving?"
  }
}
```

### 8. Error Taxonomy
```typescript
errorTaxonomy: {
  validation: { /* user can fix */ },
  domain: { /* business rule violated */ },
  system: { /* infrastructure failure */ }
}
```

### 9. Accessibility Requirements
```typescript
accessibility: {
  keyboardNavigation: { required: true },
  screenReader: { announcements: [...] },
  focusManagement: { onError: "focus first invalid field" }
}
```

---

## Available Contracts

### 1. [Intake Form Contract](./ui/intake-form.contract.ts)
- **Screen**: PlayerIntakeForm
- **Purpose**: Collect 8-section player intake form
- **Complexity**: High (progressive submission, 5 required + 3 optional sections)
- **API Endpoints**:
  - POST /api/v1/intake (save progress)
  - POST /api/v1/intake/:id/generate-plan (create training plan)
  - GET /api/v1/intake/player/:playerId (load existing)

**Key States**: idle → editing → saving → saved → generating_plan → plan_generated

**Special Features**:
- Progressive submission (save incomplete forms)
- Auto-save every 3 seconds
- Completion percentage tracking
- LocalStorage backup for network failures

### 2. [Plan Generation Contract](./ui/plan-generation.contract.ts)
- **Screen**: PlanPreviewScreen
- **Purpose**: View, understand, and accept 12-month training plan
- **Complexity**: High (52 weeks, 365 days, multiple view modes)
- **API Endpoints**:
  - GET /api/v1/training-plan/:planId/full (load plan)
  - PUT /api/v1/training-plan/:planId/accept (activate plan)
  - POST /api/v1/training-plan/:planId/modification-request (request changes)
  - PUT /api/v1/training-plan/:planId/reject (archive plan)

**Key States**: loading → viewing → accepting → accepted

**View Modes**: overview | calendar | weekly | periodization | tournaments

**Special Features**:
- 5 different visualization modes
- Session detail modals
- Modification request flow
- Plan acceptance workflow

---

## How to Use Contracts

### Development Workflow

#### ❌ OLD WAY (Don't Do This)
```
1. Design pretty UI mockups
2. Build React components
3. Connect to API (figure out what data you need)
4. Fix bugs when frontend/backend disagree
5. Add tests (if time permits)
```

#### ✅ NEW WAY (Contract-First)
```
1. Read the UI Contract
2. Derive acceptance tests from contract
3. Implement state machine (XState, Zustand, or similar)
4. Build UI that renders states from machine
5. Visual design is last step (replaceable)
```

### Step-by-Step Example: Implementing Intake Form

#### Step 1: Read Contract
```typescript
// contracts/ui/intake-form.contract.ts
const IntakeFormContract = {
  states: {
    editing: { allowedActions: ["fill_section", "save_progress"] },
    saving: { apiCall: "POST /api/v1/intake" },
    saved: { displayData: { completionPercentage: "number" } }
  },

  transitions: {
    "editing → saving": { trigger: "user clicks Save" },
    "saving → saved": { trigger: "API returns 200" }
  }
}
```

#### Step 2: Write Tests (Derived from Contract)
```typescript
// tests/intake-form.contract.test.ts
describe("IntakeForm Contract", () => {
  test("editing → saving → saved (200)", async () => {
    const machine = createIntakeFormMachine();

    // Start in editing state
    expect(machine.state.value).toBe("editing");

    // Trigger save
    machine.send("SAVE_PROGRESS", { data: { background: {...} } });
    expect(machine.state.value).toBe("saving");

    // Mock API success
    machine.send("API_SUCCESS", { completionPercentage: 60 });
    expect(machine.state.value).toBe("saved");
    expect(machine.context.completionPercentage).toBe(60);
  });

  test("saving → error_validation (400)", async () => {
    const machine = createIntakeFormMachine();

    machine.send("SAVE_PROGRESS");
    machine.send("API_ERROR", { status: 400, fieldErrors: {...} });

    expect(machine.state.value).toBe("error_validation");
    expect(machine.context.fieldErrors).toBeDefined();
  });
});
```

#### Step 3: Implement State Machine
```typescript
// state-machines/intake-form.machine.ts
import { createMachine } from 'xstate';

export const intakeFormMachine = createMachine({
  id: 'intakeForm',
  initial: 'idle',

  states: {
    idle: {
      on: { START_EDITING: 'editing' }
    },

    editing: {
      on: {
        SAVE_PROGRESS: 'saving',
        ABORT: 'aborted'
      }
    },

    saving: {
      invoke: {
        src: 'saveIntake', // API call
        onDone: {
          target: 'saved',
          actions: 'updateCompletionPercentage'
        },
        onError: [
          { target: 'error_validation', cond: 'is400Error' },
          { target: 'error_domain', cond: 'is404Error' },
          { target: 'error_system', cond: 'is500Error' }
        ]
      }
    },

    saved: {
      on: {
        CONTINUE_EDITING: 'editing',
        GENERATE_PLAN: 'generating_plan'
      }
    },

    // ... other states
  }
}, {
  services: {
    saveIntake: async (context) => {
      const response = await fetch('/api/v1/intake', {
        method: 'POST',
        body: JSON.stringify(context.formData)
      });

      if (!response.ok) throw response;
      return response.json();
    }
  },

  guards: {
    is400Error: (_, event) => event.data.status === 400,
    is404Error: (_, event) => event.data.status === 404,
    is500Error: (_, event) => event.data.status >= 500
  }
});
```

#### Step 4: Build React Components
```typescript
// components/IntakeForm.tsx
import { useMachine } from '@xstate/react';
import { intakeFormMachine } from '../state-machines/intake-form.machine';

export function IntakeForm() {
  const [state, send] = useMachine(intakeFormMachine);

  // Render based on state (not UI logic)
  if (state.matches('saving')) {
    return <LoadingSpinner />;
  }

  if (state.matches('saved')) {
    return (
      <div>
        <SuccessMessage />
        <CompletionIndicator percentage={state.context.completionPercentage} />
        {state.context.isComplete && (
          <Button onClick={() => send('GENERATE_PLAN')}>
            Generate Training Plan
          </Button>
        )}
      </div>
    );
  }

  if (state.matches('error_validation')) {
    return (
      <Form
        errors={state.context.fieldErrors}
        onSubmit={(data) => send('SAVE_PROGRESS', { data })}
      />
    );
  }

  // ... other states
}
```

#### Step 5: Design Visuals (Last!)
```css
/* NOW you can make it pretty */
/* But behavior is already locked and tested */
.intake-form {
  /* Your custom design here */
  /* NOT iOS-like tab bars, sheets, or SF Symbols */
}
```

---

## Contract Validation Checklist

Before implementing a screen, verify the contract has:

- [ ] **Screen Identity** (name, version, goal)
- [ ] **Roles & Permissions** (who can do what)
- [ ] **Required Context** (data needed before screen can load)
- [ ] **Complete State Machine** (all possible states)
- [ ] **State Transitions** (how to move between states)
- [ ] **API Bindings** (OpenAPI endpoint mappings)
  - [ ] All HTTP status codes mapped to states
  - [ ] Success/error side effects documented
  - [ ] Timeout handling specified
- [ ] **Navigation Rules** (entry, exit, confirmations)
- [ ] **Error Taxonomy** (validation, domain, system)
- [ ] **Accessibility Requirements** (keyboard, screen reader, focus)
- [ ] **Performance Requirements** (timeouts, debouncing, caching)

---

## Testing Strategy

### 1. Contract Tests (Unit)
Test the state machine transitions in isolation.

```typescript
test("State machine follows contract", () => {
  const machine = createMachine(contract);

  // Test all transitions
  machine.transition('editing', 'SAVE_PROGRESS'); // → saving
  machine.transition('saving', 'API_SUCCESS'); // → saved
  machine.transition('saving', 'API_ERROR_400'); // → error_validation
});
```

### 2. Integration Tests
Test API bindings match OpenAPI spec.

```typescript
test("POST /intake follows contract", async () => {
  const response = await POST('/api/v1/intake', validData);

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    success: true,
    data: {
      id: expect.any(String),
      completionPercentage: expect.any(Number),
      isComplete: expect.any(Boolean)
    }
  });
});
```

### 3. E2E Tests (Derived from Contract)
Test user flows as defined in state transitions.

```typescript
test("Happy path: edit → save → generate plan", async () => {
  await page.goto('/intake');

  // editing state
  await page.fill('[name="yearsPlaying"]', '10');
  await page.click('button:text("Save Progress")');

  // saving state (wait for API)
  await page.waitForSelector('.loading-spinner');

  // saved state
  await expect(page.locator('.completion-percentage')).toHaveText('60%');

  // Fill remaining sections...
  await page.click('button:text("Generate Plan")');

  // generating_plan state
  await page.waitForURL('/plan-preview/*');

  // plan_generated state
  await expect(page.locator('h1')).toContainText('Your Training Plan');
});
```

---

## FAQ

### Q: Do I still write UI components?
**A**: Yes! But components are "dumb" renderers of state machine states. Logic lives in the contract + state machine, not in components.

### Q: Can I use React/Vue/Svelte?
**A**: Yes. The contract is framework-agnostic. Use any framework, but implement the state machine as specified.

### Q: What if the contract is wrong?
**A**: Update the contract **first**, then implementation. Contract is source of truth.

### Q: Can I add states not in the contract?
**A**: No. If you need a new state, update the contract, get it reviewed, then implement.

### Q: How do I handle real-time updates (WebSockets)?
**A**: Add `subscriptions` section to contract specifying: event types, state transitions triggered, disconnect handling.

### Q: What about animations?
**A**: Animations are visual polish, not behavior. Contract specifies state transitions (instant), UI can add transitions between them.

---

## Visual Design Guidelines

**Remember**: Contracts specify behavior, NOT visuals.

### ❌ DON'T
- Copy iOS/macOS visual design
- Use Apple icons or SF Symbols
- Implement iOS-style navigation bars, tab bars, sheets
- Make UI look like Apple system apps

### ✅ DO
- Use web-native patterns (forms, buttons, links)
- Create a distinct visual identity
- Apply Apple HIG **principles** (clarity, feedback, predictability)
- Use platform-neutral design systems (Material, Ant, Chakra, or custom)

### Example: Intake Form Save Button

**Contract Says**:
- State: `editing` → `saving` → `saved`
- Trigger: User clicks save
- Feedback: Show loading, then success message

**❌ iOS-like (Don't)**:
```jsx
<Button style={{
  backgroundColor: '#007AFF', // iOS blue
  borderRadius: 10,
  fontSize: 17,
  fontWeight: '600'
}}>Save</Button>
```

**✅ Web-native (Do)**:
```jsx
<Button
  variant="primary"
  loading={state.matches('saving')}
  disabled={!hasChanges}
>
  {state.matches('saving') ? 'Saving...' : 'Save Progress'}
</Button>
```

---

## Updating Contracts

### Process
1. Identify needed change
2. Update contract document
3. Get peer review
4. Update tests to match new contract
5. Update implementation
6. Verify tests pass

### Version Control
Contracts use semantic versioning:
- **Major**: Breaking changes (states removed, API changed)
- **Minor**: New features (states added, optional fields)
- **Patch**: Clarifications (documentation, examples)

---

## Tools & Libraries

### Recommended
- **State Machines**: [XState](https://xstate.js.org/) (TypeScript-first)
- **React Hook**: `@xstate/react`
- **Testing**: Vitest, Jest, Playwright
- **Validation**: Zod (matches backend)

### Optional
- **Visualizer**: [XState Visualizer](https://stately.ai/viz) - See state machine as diagram
- **Inspector**: XState DevTools - Debug state transitions in browser

---

## Getting Help

1. **Read the Contract**: Start with `contracts/ui/<screen>.contract.ts`
2. **Check Tests**: See `tests/contracts/<screen>.contract.test.ts` for examples
3. **OpenAPI Spec**: Verify backend matches contract at `/docs` endpoint
4. **State Machine Diagram**: Use XState Visualizer to see contract as flowchart

---

## Summary

**UI Contracts enforce deterministic, testable, legally-safe behavior.**

✅ Write contract → tests → implementation → visuals (in that order)
✅ If frontend and backend disagree, contract wins
✅ Behavior is documented and tested
✅ Visual design is downstream and replaceable

**Start with the contracts in `contracts/ui/` and build from there.**
