# Button Standardization Plan - Remaining Files

## Overview
77 files already have Button primitive imported. ~30 files still need updates.

---

## Batch 1: High Priority - Player Features (11 buttons)
Files that need Button import and have action buttons to convert:

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `annual-plan/PlanPreview.jsx` | 13 | Modal actions, export buttons |
| `profile/TwoFactorSetup.jsx` | 7 | Enable/disable 2FA buttons |
| `profile/TwoFactorDisable.jsx` | 4 | Disable confirmation |
| `profile/ak_golf_brukerprofil_onboarding.jsx` | 4 | Onboarding steps |

---

## Batch 2: Calendar & Tournaments (17 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `calendar/Kalender.jsx` | 7 | View toggles, add event |
| `calendar/BookTrenerContainer.jsx` | 6 | Booking actions |
| `tournaments/TurneringskalenderContainer.jsx` | 7 | Filter/register buttons |
| `tournaments/RegistrerTurneringsResultatContainer.jsx` | 4 | Submit result |

---

## Batch 3: Sessions Cleanup (14 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `sessions/SessionsListView.jsx` | 4 | List actions |
| `sessions/SessionDetailView.jsx` | 4 | Detail actions |
| `sessions/SessionReflectionForm.jsx` | 4 | Form submit |
| `sessions/SessionEvaluationWidget.jsx` | 3 | Quick actions |
| `sessions/BlockRatingModal.jsx` | 3 | Rating submit |

---

## Batch 4: Communication (14 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `messaging/ConversationView.tsx` | 6 | Send, attach |
| `messaging/NewConversation.tsx` | 4 | Create conversation |
| `kommunikasjon/VarslerContainer.jsx` | 4 | Notification actions |
| `notifications/NotificationCenter.tsx` | 3 | Mark read, dismiss |

---

## Batch 5: Content & Resources (17 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `video-library/VideoFilters.jsx` | 8 | Filter chips (keep custom) |
| `archive/Arkiv.jsx` | 5 | Archive actions |
| `knowledge/RessurserContainer.jsx` | 4 | Resource actions |
| `coaches/Trenerteam.jsx` | 4 | Coach list actions |
| `samlinger/SamlingerContainer.jsx` | 3 | Collection actions |
| `school/SkoleoppgaverContainer.jsx` | 4 | Assignment actions |

---

## Batch 6: Stats & Video Progress (14 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `stats/StatsPage.jsx` | 5 | Tab/filter buttons |
| `stats/StatsPage.tsx` | 5 | Tab/filter buttons |
| `video-progress/VideoProgressView.jsx` | 2 | Video controls |
| `video-progress/SwingTimeline.jsx` | 2 | Timeline controls |

---

## Batch 7: Coach Features (10 buttons)

| File | Buttons | Priority Actions |
|------|---------|------------------|
| `coach-exercises/CoachSessionTemplateEditor.tsx` | 10 | Template actions |
| `coach/ModificationRequestDashboard.jsx` | 4 | Request actions |
| `coach-videos/ReferenceVideoCard.jsx` | 5 | Video card actions |

---

## Notes

### Buttons to KEEP as custom (not convert):
- Filter/selection chips with active state styling
- Icon-only toggle buttons (favorites, close, etc.)
- Rating star buttons
- Tab navigation buttons
- View mode toggles (grid/list)

### Buttons to CONVERT to Button primitive:
- Form submit buttons
- Modal action buttons (Save, Cancel, Delete)
- Primary CTA buttons
- Navigation action buttons
- CRUD operation buttons

---

## Execution Order
1. **Batch 1**: Player features - direct user impact
2. **Batch 3**: Sessions - most used feature
3. **Batch 2**: Calendar/Tournaments - booking flow
4. **Batch 4**: Communication - messaging
5. **Batch 5**: Content - resources/archive
6. **Batch 6**: Stats - analytics
7. **Batch 7**: Coach - admin features
