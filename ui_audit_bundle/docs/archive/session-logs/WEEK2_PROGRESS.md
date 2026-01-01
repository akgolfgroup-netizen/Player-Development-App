# Week 2 Frontend Progress
**Dato:** 2025-12-18
**Status:** IN PROGRESS (Day 1)

---

## ✅ Completed (2/6 tasks)

### 1. PaywallModal Component ✅
**Fil:** `/apps/web/src/components/ui/PaywallModal.jsx` (330 lines)

**Features:**
- Reusable modal with backdrop blur
- Lock icon header with gradient background
- Dynamic headline, body, benefits list
- Tier info display (current → required)
- Two-button layout (close / upgrade)
- Hover animations on buttons
- Analytics tracking on upgrade click
- Follows design-tokens pattern

**Props:**
```jsx
<PaywallModal
  isOpen={boolean}
  onClose={() => {}}
  onUpgrade={() => {}}
  copy={{ headline, body, cta, benefits }}
  feature="training_roi_predictor"
  currentTier="player_base"
  requiredTiers={["player_elite"]}
/>
```

---

### 2. Paywall Copy (Frontend) ✅
**Fil:** `/apps/web/src/utils/paywall-copy.js` (200 lines)

**Features:**
- 10 feature paywalls with Norwegian copy
- Static copy for all premium features
- Dynamic copy generator (injects player data)
- Helper function `getPaywallCopy(feature, data)`

**Usage:**
```javascript
import { getPaywallCopy } from '../utils/paywall-copy';

const copy = getPaywallCopy('trainingRoiPredictor', {
  topGapArea: 'putting',
  topGapPercentage: 62
});
// Returns: "Putting står for 62% av ditt totale SG-gap..."
```

---

## 🔨 In Progress (1/6 tasks)

### 3. Training ROI Page
**Target Fil:** `/apps/web/src/features/training/TrainingROI.jsx`

**Planned Components:**
- Main page layout
- useTrainingROI custom hook
- Primary focus display (large card)
- Ranked areas list (horizontal bars)
- Timeframe selector (aggressive/moderate/conservative)
- Weekly hours input slider
- PaywallModal integration
- Loading/error states

**Estimated:** 16-20 hours (complex visualization)

---

## 📝 Pending (3/6 tasks)

### 4. ROI Charts
- Horizontal bars for ROI scores (0-1)
- Priority badges (HIGH/MEDIUM/LOW)
- Effort estimates (hours/months)
- Color-coded by priority

### 5. Route Configuration
- Add `/training/roi` route to App.jsx
- Protect with ProtectedRoute
- Add to navigation menu (optional)

### 6. End-to-End Testing
- Test paywall flow (BASE → upgrade prompt)
- Test ROI display (ELITE → data display)
- Test timeframe changes
- Test weekly hours input
- Mobile responsive testing

---

## 📊 Progress Summary

**Time Invested:** ~2 hours (Day 1)
**Components Created:** 2/6
**Lines of Code:** 530 lines
**Status:** On track for 20-26h estimate

**Next Steps:**
1. Create useTrainingROI hook
2. Build Training ROI page layout
3. Create ROI visualization components
4. Integrate PaywallModal
5. Add route configuration
6. Test with backend

---

**Created:** 2025-12-18 (Day 1)
**Updated:** Real-time
