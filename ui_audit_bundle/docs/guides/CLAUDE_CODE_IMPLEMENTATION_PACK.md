# Claude Code Implementation Pack — AK Golf IUP (Web + Mobile Player Flow)

This file is an **implementation directive** for Claude Code. Apply all changes exactly, minimizing churn and maximizing reuse via **design tokens**.

Source context: existing design system v2.1 and routes/components described in `DESIGN_PACKAGE_FOR_CHATGPT.md`.

---

## 0) Non-negotiables

- Keep **brand colors**, spacing, radius, shadows, and Lucide icons as-is.
- Keep **Inter** font.
- Do **not** introduce Apple-specific component look/feel.
- Prefer **tokens** over hard-coded values everywhere.
- Ensure all screens implement explicit UI states: `idle | loading | success | error | empty`.
- Ensure error taxonomy mapping is consistent:
  - `validation_error`, `authentication_error`, `authorization_error`, `domain_violation`, `system_failure`.

---

## 1) Global Change Set (apply first)

### 1.1 Typography token update (v2.2) — remove Apple-HIG scale signature

**Action:** Update `design-tokens.js` (and any CSS/tailwind mirrors) to the new scale and naming.

#### Replace typography names
- Remove Apple-signaling names: `Large Title`, `Headline`, `Footnote`, etc.
- Use neutral names: `display`, `title1`, `title2`, `title3`, `body`, `callout`, `label`, `caption`.

#### New scale (exact)
```js
// design-tokens.js — typography v2.2
export const tokens = {
  // ... existing tokens.colors, tokens.spacing, tokens.radius, tokens.shadows ...
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    display: { fontSize: "32px", lineHeight: "40px", fontWeight: 700 },
    title1:  { fontSize: "26px", lineHeight: "32px", fontWeight: 700 },
    title2:  { fontSize: "21px", lineHeight: "28px", fontWeight: 600 },
    title3:  { fontSize: "19px", lineHeight: "26px", fontWeight: 600 },
    body:    { fontSize: "17px", lineHeight: "24px", fontWeight: 400 },
    callout: { fontSize: "15px", lineHeight: "22px", fontWeight: 400 },
    label:   { fontSize: "14px", lineHeight: "20px", fontWeight: 500 },
    caption: { fontSize: "12px", lineHeight: "16px", fontWeight: 400 },
  },
};
```

**Migration rule:** If existing components reference removed keys, map them:
- `Large Title` → `display`
- `Title 1` → `title1`
- `Title 2` → `title2`
- `Title 3` → `title3`
- `Body` → `body`
- `Callout` → `callout`
- `Subhead` → `label`
- `Footnote`/`Caption` → `caption`

### 1.2 Global hierarchy rule (3 levels)

**Action:** Introduce utility helpers (or conventions) so every screen uses only:
1) Primary: `title1/title2` + `charcoal`
2) Secondary: `body/callout` + `charcoal/steel`
3) Tertiary: `label/caption` + `steel`

**Implementation hint:** add `typographyStyles(key)` helper:
```js
export function typographyStyle(key) {
  const t = tokens.typography[key];
  return { fontFamily: tokens.typography.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight };
}
```

### 1.3 UI state primitives (global)

**Action:** Create shared components under `components/ui/`:
- `LoadingState.jsx`
- `EmptyState.jsx`
- `ErrorState.jsx` (accepts `errorType`, `message`, `onRetry?`)
- `SuccessState.jsx` (optional)

All must use tokens and be accessible (focus order, keyboard).

---

## 2) Mobile Player Flow (new UI) — screens + navigation

You already have desktop routes with sidebar. Mobile must be **separate layout**:
- bottom navigation
- one-column screens
- sticky primary action where needed
- no sidebars/drawers

### 2.1 New mobile routes (React Router)
Add a mobile route group (prefix `/m` recommended):

- `/m/home` → `MobileHome.jsx`
- `/m/plan` → `MobilePlan.jsx`
- `/m/log` → `MobileQuickLog.jsx`
- `/m/calendar` → `MobileCalendar.jsx`
- `/m/calibration` → `MobileCalibration.jsx`
- (optional details)
  - `/m/plan/week/:id`
  - `/m/calendar/event/:id`

### 2.2 Mobile layout shell
Create `components/layout/MobileShell.jsx`:
- Renders `<Outlet />` with bottom nav fixed.
- Bottom nav items: Home, Plan, Logg, Kalender.
- Use tokens: background `foam`, surface `ivory`, icons from lucide-react.

### 2.3 Mobile screen contracts (must implement)

All screens implement:
- `idle | loading | success | error | empty`
- Explicit retry where `system_failure`
- 401 → redirect to `/login`

#### MobileHome
Data:
- `GET /me`
- `GET /dashboard/player`

UI:
- One primary card: “Dagens fokus”
- Next event summary
- Week progress

States:
- empty if no plan/events, show CTA.

#### MobileCalibration (Stepper)
API:
- `POST /calibration/start`
- `POST /calibration/submit` (min 5 samples)

Rules:
- Preserve samples locally on failure.
- 422 → validation_error, stay on step.
- 500/timeout → system_failure, retry enabled.

#### MobilePlan
API:
- `GET /plan/current`
- `GET /plan/month?month=YYYY-MM` (swipe)

States:
- 404 → empty plan CTA.

#### MobileQuickLog
API:
- `POST /training/sessions`

Rules:
- Local draft preserved if 5xx.
- Validation inline; if server returns 400, map to validation_error.

#### MobileCalendar
API:
- `GET /calendar/events?from&to`
- `GET /calendar/event/{id}`

Default:
- list view next 7 days
- toggle grid optional (local-only)

---

## 3) Backend/API changes (OpenAPI + Fastify routes)

### 3.1 OpenAPI patch — add/ensure endpoints
Ensure these paths exist in your OpenAPI spec (Swagger):

- `GET /me`
- `GET /dashboard/player`
- `POST /calibration/start`
- `POST /calibration/submit`
- `GET /plan/current`
- `GET /plan/month?month=YYYY-MM`
- `POST /training/sessions`
- `GET /calendar/events?from&to`
- `GET /calendar/event/{id}`

### 3.2 Error schema and mapping
Standardize error JSON across backend:
```json
{ "type": "validation_error|authentication_error|authorization_error|domain_violation|system_failure",
  "message": "Human-readable",
  "details": { "field?": "reason", "meta?": "..." }
}
```

HTTP mapping:
- 400 → validation_error
- 401 → authentication_error
- 403 → authorization_error
- 404 → domain_violation (not_found) OR specialized type if you already use it
- 409/422 → domain_violation
- 5xx/timeout → system_failure

### 3.3 Idempotency recommendation (Quick Log)
To prevent duplicate sessions on retry:
- Support optional `Idempotency-Key` header on `POST /training/sessions`.
- Store key per user for a TTL; if repeated, return same `session_id`.

---

## 4) Contract-derived Acceptance Tests (TC IDs)

Implement test scaffolds (Playwright or Cypress). Use IDs as stable names.

### Mobile Home
- TC-MH-01 happy path: renders focus + next event
- TC-MH-02 empty state: no events/plan
- TC-MH-03 500/timeout: error + retry

### Calibration
- TC-CAL-M-01 start session
- TC-CAL-M-02 submit success
- TC-CAL-M-03 422 invalid samples
- TC-CAL-M-04 500 submit retry preserves samples
- TC-CAL-M-05 abort discards local data

### Plan
- TC-PLAN-M-01 current plan success
- TC-PLAN-M-02 404 no plan → empty CTA
- TC-PLAN-M-03 month change loading→idle no stale flash
- TC-PLAN-M-04 500 → error + retry

### Quick Log
- TC-LOG-M-01 save success
- TC-LOG-M-02 validation 400/inline
- TC-LOG-M-03 500 retry preserves draft; idempotency prevents duplicates

### Calendar
- TC-CALN-M-01 range list
- TC-CALN-M-02 empty
- TC-CALN-M-03 event detail
- TC-CALN-M-04 404 detail not-found state
- TC-CALN-M-05 500 list error retry

---

## 5) “Smart token usage” checklist (enforce)

In every UI file:
- Use `tokens.colors.*` not hex literals.
- Use `tokens.spacing.*` not numeric padding/margins.
- Use `tokens.radius.*` not hard-coded border-radius.
- Use `tokens.shadows.*` for elevations.
- Use `typographyStyle(key)` for all text styles.
- Centralize repeated layouts into shared components:
  - Card
  - PageHeader
  - PrimaryButton
  - Section

---

## 6) Minimal code organization (recommended)

- `apps/web/src/mobile/` for mobile screens and shell
- `apps/web/src/components/ui/` for state components + primitives
- `apps/web/src/design-tokens.js` updated (typography v2.2)
- `apps/api/` (or your backend folder) for endpoint + OpenAPI updates

---

## 7) Completion criteria (definition of done)

- Typography tokens updated and all references migrated.
- Desktop UI unchanged except typography improvements and clearer hierarchy.
- Mobile route group `/m/*` works with bottom nav.
- All mobile screens implement explicit states and error mapping.
- OpenAPI spec contains required endpoints and error schema.
- Acceptance test skeletons exist for all TC IDs.

---

## 8) Implementation order (follow exactly)

1) Update tokens + typography helper
2) Add global UI state components
3) Add mobile shell + routes
4) Implement mobile screens with mocked data
5) Wire API calls
6) Standardize backend errors + OpenAPI
7) Add idempotency for quick log
8) Add acceptance tests

