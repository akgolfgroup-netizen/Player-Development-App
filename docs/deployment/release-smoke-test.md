# Release Smoke Test Checklist

Quick verification tests to run after each deployment.

---

## Pre-Test Setup

```bash
# Clear browser cache and localStorage
# Open DevTools → Console (filter errors)
# Open DevTools → Network tab
```

---

## 1. Authentication

| Test | Expected | Pass |
|------|----------|------|
| Visit `/login` | Login form renders | [ ] |
| Enter valid credentials | Redirects to dashboard | [ ] |
| Invalid credentials | Shows error message | [ ] |
| Logout | Redirects to login, clears session | [ ] |
| Protected route without auth | Redirects to login | [ ] |

---

## 2. Player Routes

| Route | Expected | Pass |
|-------|----------|------|
| `/dashboard` | Dashboard loads, stats visible, no console errors | [ ] |
| `/kalender` | Calendar renders, events load | [ ] |
| `/stats` | Stats page with charts, data populates | [ ] |
| `/goals` | Goals list loads, can view goal details | [ ] |
| `/videos` | Video library loads, thumbnails display | [ ] |
| `/videos/:id` | Single video plays, metadata shows | [ ] |
| `/videos/:id/analyze` | Analysis tools load, annotations work | [ ] |
| `/profile` | Profile page loads, can edit | [ ] |
| `/sessions` | Training sessions list loads | [ ] |
| `/achievements` | Achievements/badges display | [ ] |

---

## 3. Coach Routes

| Route | Expected | Pass |
|-------|----------|------|
| `/coach/dashboard` | Coach dashboard loads | [ ] |
| `/coach/athletes` | Athlete list loads | [ ] |
| `/coach/athletes/:id` | Athlete detail page works | [ ] |
| `/coach/videos` | Coach video library loads | [ ] |
| `/coach/videos/:id/analyze` | Analysis with coach tools | [ ] |
| `/coach/training-plans` | Training plans management | [ ] |

---

## 4. Video Features

| Test | Expected | Pass |
|------|----------|------|
| Upload video | Upload succeeds, video processes | [ ] |
| Play video | Playback works, controls responsive | [ ] |
| Add annotation | Annotation saves, displays on timeline | [ ] |
| Add comment | Comment saves, shows in thread | [ ] |
| Share video | Share modal works, notification sent | [ ] |
| Unshare video | Removes access, notification sent | [ ] |
| Video comparison | Side-by-side comparison works | [ ] |

---

## 5. Notifications

| Test | Expected | Pass |
|------|----------|------|
| Bell icon shows badge | Unread count visible | [ ] |
| Click bell | Notification dropdown opens | [ ] |
| Notifications load | List populates correctly | [ ] |
| Mark as read | Badge updates, item styling changes | [ ] |
| Click notification | Navigates to correct page | [ ] |
| Real-time updates | New notifications appear (45s poll) | [ ] |

---

## 6. Theme Switching

| Test | Expected | Pass |
|------|----------|------|
| Light mode | All surfaces light, text dark | [ ] |
| Dark mode | All surfaces dark, text light | [ ] |
| System mode | Follows OS preference | [ ] |
| Toggle persists | Reload maintains setting | [ ] |
| No flash on load | Correct theme applied immediately | [ ] |

---

## 7. API Health

```bash
# Health check
curl -s https://api.akgolf.no/health | jq
# Expected: {"status":"ok","timestamp":"..."}

# Ready check (includes DB/Redis)
curl -s https://api.akgolf.no/ready | jq
# Expected: {"status":"ok","database":"connected","redis":"connected"}
```

---

## 8. Staging-Specific Verification

Run these additional checks on staging environment.

### 8.1 Route Verification

| Route | Expected | Pass |
|-------|----------|------|
| `/dashboard` | Player dashboard loads with real data | [ ] |
| `/kalender` | Calendar with events, can navigate months | [ ] |
| `/stats` | Charts render, data from staging DB | [ ] |
| `/goals` | Goals list, can create/edit goals | [ ] |
| `/videos` | Video library, thumbnails from S3 | [ ] |
| `/videos/:id/analyze` | Analysis page, annotations save | [ ] |
| `/coach/videos` | Coach video library loads | [ ] |
| `/coach/videos/:id/analyze` | Coach analysis tools work | [ ] |

### 8.2 Video Sharing Flow

| Test | Expected | Pass |
|------|----------|------|
| Coach shares video to player | Share modal works, success toast | [ ] |
| Player receives notification | Notification appears (within 45s) | [ ] |
| Player can view shared video | Video accessible in library | [ ] |
| Coach unshares video | Unshare succeeds, notification sent | [ ] |
| Player no longer sees video | Video removed from library | [ ] |

### 8.3 Notifications End-to-End

| Test | Expected | Pass |
|------|----------|------|
| Generate notification trigger | Comment, share, or review action | [ ] |
| Bell badge updates | Count increases | [ ] |
| Notification in dropdown | New item visible at top | [ ] |
| Click navigates correctly | Goes to correct video/page | [ ] |
| Mark all read | Badge clears, items marked | [ ] |

### 8.4 Theme Verification

| Test | Expected | Pass |
|------|----------|------|
| Light theme | Background: white, cards: light surface | [ ] |
| Dark theme | Background: dark, cards: dark surface | [ ] |
| System theme | Matches OS dark/light setting | [ ] |
| Theme toggle | Click cycles through modes | [ ] |
| Persist after reload | Setting maintained | [ ] |
| No FOUC | No flash of wrong theme | [ ] |

### 8.5 Staging Environment Checks

```bash
# Verify staging API connection
curl -s https://api-staging.akgolf.no/health

# Check frontend is using staging API (browser console)
fetch('/api/v1/health').then(r => r.json()).then(console.log)

# Verify no localhost references in network tab
# All API calls should go to api-staging.akgolf.no
```

### 8.6 Console Error Check

After visiting each route:
- [ ] No JavaScript errors in console
- [ ] No 404 errors for assets
- [ ] No CORS errors
- [ ] No failed API requests

---

## 9. Performance Quick Check

| Metric | Target | Pass |
|--------|--------|------|
| Dashboard LCP | < 2.5s | [ ] |
| No layout shift | CLS < 0.1 | [ ] |
| Interactive | TTI < 3.5s | [ ] |
| JS bundle | < 500KB gzipped | [ ] |

---

## 10. Rollback Triggers

Immediately rollback if:

- [ ] Login completely broken
- [ ] Dashboard 500 errors
- [ ] API health check fails
- [ ] All videos fail to load
- [ ] Critical console errors on every page

---

## Post-Test

- [ ] Document any issues found
- [ ] Create tickets for non-critical bugs
- [ ] Notify team of deployment status
- [ ] Monitor error rates for 15-30 minutes

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-26 | Initial checklist with staging section |
