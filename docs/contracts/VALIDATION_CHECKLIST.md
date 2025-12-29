# UI Contract Validation Checklist

Use this checklist to verify that a UI contract is complete, consistent, and ready for implementation.

---

## Contract: ______________________

**Version**: _________
**Reviewer**: _________
**Date**: _________

---

## 1. Screen Identity ✓

- [ ] **Screen name** is unique and descriptive
- [ ] **Version** follows semantic versioning (e.g., 1.0.0)
- [ ] **Primary goal** is clear and singular
- [ ] **Goal is user-centric** (not technical)

**Example**:
```typescript
✅ primaryGoal: "Collect player data to generate training plan"
❌ primaryGoal: "Submit intake form to database"
```

---

## 2. Roles & Permissions ✓

- [ ] All **user roles** are listed
- [ ] **Capabilities** are defined for each role
- [ ] **No ambiguous permissions** (each action has clear owner)
- [ ] **Role hierarchy** is clear (if applicable)

**Validation**:
- Can every user action be traced to a role capability?
- Are there capabilities that have no corresponding UI action?

---

## 3. Required Context ✓

- [ ] All **required data** is specified
- [ ] **Data sources** are documented (auth_session, route_param, etc.)
- [ ] **Validation rules** are explicit
- [ ] Screen cannot render without this data

**Common Issues**:
- ❌ Missing validation: "playerId must be valid UUID"
- ❌ Unclear source: Where does tenantId come from?

---

## 4. State Machine ✓

### Completeness

- [ ] **Initial state** is defined
- [ ] **All possible states** are listed
- [ ] Each state has:
  - [ ] Description
  - [ ] Allowed actions
  - [ ] Can navigate away (true/false)
  - [ ] Display data (if applicable)

### Common States Present

- [ ] **Idle/Loading** (initial data fetch)
- [ ] **Primary action state** (e.g., editing, viewing)
- [ ] **Saving/Submitting** (API call in progress)
- [ ] **Success state** (action completed)
- [ ] **Error states**:
  - [ ] error_validation (user can fix)
  - [ ] error_domain (business rule violated)
  - [ ] error_system (infrastructure failure)

### State Validation

- [ ] **No orphan states** (every state is reachable)
- [ ] **No dead ends** (every state has exit path, except terminal states)
- [ ] **Timeouts defined** for async states (saving, loading)
- [ ] **On-timeout behavior** specified

**Example**:
```typescript
✅ saving: {
  timeout: 10000,
  onTimeout: "transition to error_system with retry"
}

❌ saving: {
  // Missing timeout - what if API hangs?
}
```

---

## 5. State Transitions ✓

- [ ] **All transitions** are documented
- [ ] Each transition has:
  - [ ] Trigger (what causes it)
  - [ ] Validation (preconditions)
  - [ ] Payload (data passed, if any)
  - [ ] Side effects (what happens)

### Transition Matrix Completeness

For each state, verify:
- [ ] **Entry transitions** (how to get to this state)
- [ ] **Exit transitions** (how to leave this state)
- [ ] **Self-transitions** (if state can refresh/reload)

### Common Patterns Verified

- [ ] **Happy path** (idle → action → success) exists
- [ ] **Error paths** (action → error_*) exist for all API calls
- [ ] **Abort path** (any state → aborted) exists
- [ ] **Retry path** (error → retry) exists for recoverable errors

**Validation Matrix**:

| From State | To State | Trigger | ✓ |
|------------|----------|---------|---|
| idle | editing | user starts form | [ ] |
| editing | saving | user clicks Save | [ ] |
| saving | saved | API returns 200 | [ ] |
| saving | error_validation | API returns 400 | [ ] |
| saving | error_system | API returns 500 | [ ] |

---

## 6. API Bindings ✓

### For Each API Endpoint

- [ ] **Method** (GET, POST, PUT, DELETE)
- [ ] **Endpoint** (exact path with params)
- [ ] **Authentication** requirement
- [ ] **Request structure** (params, query, body)
- [ ] **All HTTP status codes** mapped to states

### HTTP Status Code Coverage

For each API call, verify these are handled:

- [ ] **200/201** → success state
- [ ] **400** → error_validation (bad request)
- [ ] **401** → redirect to login
- [ ] **403** → error_domain (forbidden)
- [ ] **404** → error_domain (not found)
- [ ] **500** → error_system (server error)
- [ ] **Network error** → error_system
- [ ] **Timeout** → error_system

### Response Handling

- [ ] **Success response** structure documented
- [ ] **Error response** structure documented
- [ ] **Side effects** listed for each response
- [ ] **State transitions** specified

**Example**:
```typescript
✅ responses: {
  200: {
    state: "saved",
    body: { success: true, data: { id, completionPercentage } },
    sideEffects: [
      "Update UI with completion %",
      "Enable 'Generate Plan' if 100%"
    ]
  },
  400: {
    state: "error_validation",
    body: { success: false, error: { code, message, fieldErrors } },
    sideEffects: ["Highlight invalid fields", "Preserve user input"]
  }
}

❌ responses: {
  200: { state: "saved" }
  // Missing: body structure, side effects, error cases
}
```

### Preconditions

- [ ] **Preconditions** are explicit (e.g., "plan must be draft status")
- [ ] **On precondition fail** behavior is specified

---

## 7. Navigation Rules ✓

### Entry

- [ ] **Entry points** are listed (which screens can navigate here)
- [ ] **Entry data** requirements are specified
- [ ] **Entry action** is defined (e.g., load existing data)

### Exit

- [ ] **Exit destinations** are mapped to outcomes
  - [ ] On success
  - [ ] On abort
  - [ ] On error (if applicable)
- [ ] **Confirmation dialogs** are specified (when needed)
- [ ] **Browser back button** behavior is defined

### Unsaved Changes

- [ ] **Detection** of unsaved changes is specified
- [ ] **Warning message** is defined
- [ ] **Save/Discard/Cancel** options are provided

**Example**:
```typescript
✅ confirmationRequired: {
  when: "state === 'editing' AND hasUnsavedChanges === true",
  message: "You have unsaved changes. Save before leaving?",
  options: [
    { label: "Save & Exit", action: "save → navigate" },
    { label: "Discard", action: "clear → navigate" },
    { label: "Cancel", action: "stay" }
  ]
}
```

---

## 8. Error Taxonomy ✓

### Three Error Classes Defined

- [ ] **Validation Errors**
  - [ ] User can fix immediately
  - [ ] Inline presentation
  - [ ] Examples provided
  - [ ] Recovery path specified

- [ ] **Domain Errors**
  - [ ] Business rule violations
  - [ ] Alert/modal presentation
  - [ ] Examples provided
  - [ ] Suggested actions provided

- [ ] **System Errors**
  - [ ] Infrastructure failures
  - [ ] Full error state presentation
  - [ ] Examples provided
  - [ ] Retry strategy specified
  - [ ] Data preservation confirmed

### Error Message Quality

- [ ] **Error messages** are user-friendly (not technical)
- [ ] **Suggested actions** are actionable
- [ ] **No generic messages** ("Something went wrong")

**Example**:
```typescript
✅ "Player not found. Please check the player ID or contact support."
❌ "404 error"

✅ "Server unavailable. Your changes have been saved locally. Try again in a moment."
❌ "Network error"
```

---

## 9. Accessibility Requirements ✓

### Keyboard Navigation

- [ ] **All actions** accessible via keyboard
- [ ] **Keyboard shortcuts** documented
- [ ] **Tab order** is logical
- [ ] **Focus traps** are intentional (modals only)

### Screen Reader

- [ ] **State changes** are announced
- [ ] **Errors** are announced immediately
- [ ] **Success feedback** is announced
- [ ] **All labels** are present (visible or aria-label)

### Visual

- [ ] **Color contrast** requirements specified (4.5:1 minimum)
- [ ] **Errors** don't rely on color alone
- [ ] **Focus indicators** are visible
- [ ] **Charts/visualizations** have text alternatives

### WCAG 2.1 AA Compliance

- [ ] **Perceivable**: All information available to screen readers
- [ ] **Operable**: All functionality via keyboard
- [ ] **Understandable**: Clear error messages and labels
- [ ] **Robust**: Valid HTML, ARIA attributes

---

## 10. Performance Requirements ✓

- [ ] **Auto-save** strategy defined (if applicable)
  - [ ] Debounce delay specified
  - [ ] "Only if changed" logic

- [ ] **Field validation** timing specified
  - [ ] On blur vs on keystroke
  - [ ] Debounce for async validations

- [ ] **API response time** targets
  - [ ] Expected time (e.g., < 2 seconds)
  - [ ] Warning threshold (e.g., > 5 seconds)

- [ ] **Loading states** for slow operations
- [ ] **Caching strategy** (if applicable)

---

## 11. Data Persistence ✓

- [ ] **Server-side** persistence strategy
  - [ ] Progressive (can save partial) vs atomic (all or nothing)
  - [ ] Versioning (if applicable)
  - [ ] Retention policy

- [ ] **Client-side** backup (localStorage)
  - [ ] When to save locally
  - [ ] When to clear local data
  - [ ] When to restore from local

**Example**:
```typescript
✅ localStorage: {
  enabled: true,
  key: "intake_backup_{playerId}",
  clearOn: ["successful save", "intentional abort"],
  restoreOn: ["page refresh", "session timeout"]
}
```

---

## 12. Consistency Checks ✓

### Cross-Reference Validation

- [ ] **Every state** has transitions in/out
- [ ] **Every transition** references valid states
- [ ] **Every API call** is in apiBindings section
- [ ] **Every error state** has recovery path
- [ ] **Every allowed action** triggers a transition

### Terminology Consistency

- [ ] **State names** use consistent pattern (e.g., error_*)
- [ ] **Field names** match backend API
- [ ] **Error codes** match backend error codes
- [ ] **HTTP status codes** are correct (200 vs 201)

### Contract vs OpenAPI Alignment

- [ ] **Endpoints** match OpenAPI spec exactly
- [ ] **Request schemas** match backend validation
- [ ] **Response schemas** match backend types
- [ ] **Error responses** match backend error format

---

## 13. Visual Design Constraints ✓

### Apple Design Compliance

- [ ] **Contract does NOT**:
  - [ ] Specify iOS/macOS visual patterns
  - [ ] Reference Apple icons or SF Symbols
  - [ ] Mandate iOS-style navigation/tabs
  - [ ] Require Apple system look-and-feel

- [ ] **Contract DOES**:
  - [ ] Specify behavioral principles (clarity, feedback)
  - [ ] Allow platform-neutral visuals
  - [ ] Require distinct visual identity

### Web-Native Patterns

- [ ] Uses **web-standard** interaction patterns
- [ ] No **mobile-first-only** patterns (swipe, etc.)
- [ ] **Responsive** considerations noted

---

## 14. Documentation Quality ✓

- [ ] **Descriptions** are clear and concise
- [ ] **Examples** are provided where helpful
- [ ] **Edge cases** are addressed
- [ ] **Rationale** is provided for complex decisions
- [ ] **TypeScript types** can be derived from contract

---

## 15. Implementation Readiness ✓

### Can a Developer Implement This?

- [ ] **State machine** can be directly coded
- [ ] **API calls** have exact endpoints and payloads
- [ ] **Error handling** is unambiguous
- [ ] **Navigation** is deterministic
- [ ] **No undefined behavior** ("TBD", "to be decided")

### Can QA Test This?

- [ ] **All user flows** can be tested
- [ ] **Success criteria** are measurable
- [ ] **Error scenarios** can be reproduced
- [ ] **Acceptance tests** can be derived

### Can It Be Maintained?

- [ ] **Single source of truth** for behavior
- [ ] **Versioned** for future changes
- [ ] **Searchable** (clear terminology)
- [ ] **Updateable** (not tied to specific UI framework)

---

## Final Validation

### Overall Assessment

- [ ] **Complete**: All sections filled
- [ ] **Consistent**: No contradictions
- [ ] **Deterministic**: Same input → same output
- [ ] **Testable**: Acceptance tests can be written
- [ ] **Implementable**: Developer can build from this
- [ ] **Legally safe**: Doesn't copy Apple designs

### Sign-Off

**Contract is READY for implementation**: ☐ YES ☐ NO

**If NO, what's missing?**:
_____________________________________________
_____________________________________________

**Reviewer Signature**: _________________
**Date**: _________________

---

## Common Issues Checklist

Use this to catch frequent problems:

- [ ] ❌ **Missing error states**: Only happy path defined
- [ ] ❌ **Unclear transitions**: "When user saves" - when exactly?
- [ ] ❌ **Unbounded operations**: No timeout on API calls
- [ ] ❌ **Lost data**: What happens on error? Is data preserved?
- [ ] ❌ **Navigation gaps**: How to get back after error?
- [ ] ❌ **Accessibility holes**: Keyboard-only users can't complete flow
- [ ] ❌ **Generic errors**: "Something went wrong" instead of specific guidance
- [ ] ❌ **iOS copycatting**: References to tab bars, sheets, SF Symbols
- [ ] ❌ **Implicit state**: Behavior not in state machine ("form becomes read-only")
- [ ] ❌ **Vague confirmations**: "Ask user if they're sure" - exact wording?

---

## Summary

A validated contract should answer:

✅ **What** can the user do? (states, actions)
✅ **When** can they do it? (transitions, preconditions)
✅ **How** does it work? (API calls, side effects)
✅ **What if it fails?** (error taxonomy, recovery)
✅ **Where do they go?** (navigation rules)
✅ **Is it accessible?** (keyboard, screen reader)
✅ **Is it legal?** (no Apple design copying)

If you can answer all these questions by reading the contract alone, it's ready.
