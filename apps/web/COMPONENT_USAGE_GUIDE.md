# Frontend Quick Wins - Component Usage Guide

Quick reference guide for all newly created components.

---

## 1. PASSWORD RECOVERY FLOW

### ForgotPassword Component

**Purpose:** Allow users to request a password reset email

**Basic Usage:**
```jsx
import ForgotPassword from './features/auth/ForgotPassword';

function App() {
  return <ForgotPassword />;
}
```

**Features:**
- Email validation
- Loading states
- Success/error feedback
- Support contact link
- Mobile responsive

**User Flow:**
1. User enters email
2. Clicks "Send reset link"
3. Receives confirmation
4. Can try again or go back to login

---

### VerifyResetToken Component

**Purpose:** Validate password reset tokens from email links

**Basic Usage:**
```jsx
import VerifyResetToken from './features/auth/VerifyResetToken';

// Route: /verify-reset?token=xxx&email=user@example.com
<Route path="/verify-reset" element={<VerifyResetToken />} />
```

**States:**
- **Verifying:** Shows loading spinner
- **Valid:** Auto-redirects to reset password page
- **Expired:** Shows warning + "request new link" button
- **Invalid:** Shows error + options

**URL Parameters:**
- `token` - Reset token from email
- `email` - User's email address

---

### ResetPassword Component

**Purpose:** Allow users to set a new password

**Basic Usage:**
```jsx
import ResetPassword from './features/auth/ResetPassword';

// Route: /reset-password?token=xxx&email=user@example.com
<Route path="/reset-password" element={<ResetPassword />} />
```

**Password Requirements:**
- ✅ Minimum 8 characters
- ✅ One uppercase letter
- ✅ One lowercase letter
- ✅ One number
- ✅ One special character

**Features:**
- Real-time validation feedback
- Password strength meter
- Show/hide password toggle
- Confirmation password matching
- Success state with auto-redirect

---

## 2. TWO-FACTOR AUTHENTICATION

### TwoFactorSetup Component

**Purpose:** Guide users through 2FA setup process

**Basic Usage:**
```jsx
import TwoFactorSetup from './features/profile/TwoFactorSetup';

function SecuritySettings() {
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleComplete = (data) => {
    console.log('2FA enabled', data);
    // data.enabled = true
    // data.backupCodes = ['1A2B3C4D', ...]
    setShow2FASetup(false);
  };

  return (
    <div>
      <button onClick={() => setShow2FASetup(true)}>
        Enable 2FA
      </button>

      {show2FASetup && (
        <TwoFactorSetup
          onComplete={handleComplete}
          onCancel={() => setShow2FASetup(false)}
        />
      )}
    </div>
  );
}
```

**Props:**
- `onComplete(data)` - Called when setup is complete
- `onCancel()` - Called when user cancels

**Setup Steps:**
1. Introduction and explanation
2. QR code display + manual key
3. Code verification
4. Backup codes display

---

### TwoFactorDisable Component

**Purpose:** Allow users to disable 2FA with password confirmation

**Basic Usage:**
```jsx
import TwoFactorDisable from './features/profile/TwoFactorDisable';

function SecuritySettings() {
  const [showDisable2FA, setShowDisable2FA] = useState(false);

  const handleConfirm = (data) => {
    console.log('2FA disabled', data);
    // data.enabled = false
    setShowDisable2FA(false);
  };

  return (
    <div>
      <button onClick={() => setShowDisable2FA(true)}>
        Disable 2FA
      </button>

      {showDisable2FA && (
        <TwoFactorDisable
          onConfirm={handleConfirm}
          onCancel={() => setShowDisable2FA(false)}
        />
      )}
    </div>
  );
}
```

**Props:**
- `onConfirm(data)` - Called when 2FA is disabled
- `onCancel()` - Called when user cancels

**Security Features:**
- Warning screen
- Password confirmation required
- Error tracking (prevents repeated attempts)

---

## 3. MOBILE COACH FEATURES

### MobileCoachDashboard Component

**Purpose:** Coach overview for mobile devices

**Basic Usage:**
```jsx
import MobileCoachDashboard from './mobile/MobileCoachDashboard';

function CoachMobileApp() {
  return <MobileCoachDashboard />;
}
```

**Features:**
- 4 stat cards (athletes, active, sessions, tests)
- Recent activity feed
- Today's schedule
- Loading skeletons
- Error handling

**Displayed Data:**
- Total athletes
- Active today count
- Upcoming sessions
- Recent tests
- Latest athlete activity
- Scheduled sessions with times

---

### MobileCoachAthleteDetail Component

**Purpose:** Detailed athlete view for coaches

**Basic Usage:**
```jsx
import MobileCoachAthleteDetail from './mobile/MobileCoachAthleteDetail';

function AthleteDetailPage() {
  const athleteId = useParams().id;

  return (
    <MobileCoachAthleteDetail
      athleteId={athleteId}
      onBack={() => navigate('/coach/athletes')}
    />
  );
}
```

**Props:**
- `athleteId` - ID of athlete to display
- `onBack()` - Navigation callback

**Features:**
- 3 tabs: Overview, Sessions, Tests
- Quick action buttons
- 4 quick stats
- Session history
- Test results with trends

---

### MobileCoachSessionsView Component

**Purpose:** Session management for coaches

**Basic Usage:**
```jsx
import MobileCoachSessionsView from './mobile/MobileCoachSessionsView';

function SessionsPage() {
  return <MobileCoachSessionsView />;
}
```

**Features:**
- Search by athlete or type
- 4 filters: All, Today, Upcoming, Past
- Rich session cards
- Color-coded session types
- Date/time display
- Quick actions

---

### MobileCoachTestResults Component

**Purpose:** Test results overview for coaches

**Basic Usage:**
```jsx
import MobileCoachTestResults from './mobile/MobileCoachTestResults';

function TestResultsPage() {
  return <MobileCoachTestResults />;
}
```

**Features:**
- Category filters
- Summary stats
- Trend indicators
- Score comparisons
- Coach notes

---

## 4. LOADING STATES

### ListSkeleton Components

**Purpose:** Provide loading states that match actual content

**9 Variants Available:**

#### AthleteListSkeleton
```jsx
import { AthleteListSkeleton } from './components/ui/ListSkeleton';

{loading ? <AthleteListSkeleton items={5} /> : <AthleteList data={athletes} />}
```

#### SessionListSkeleton
```jsx
import { SessionListSkeleton } from './components/ui/ListSkeleton';

{loading ? <SessionListSkeleton items={4} /> : <SessionList data={sessions} />}
```

#### StatsGridSkeleton
```jsx
import { StatsGridSkeleton } from './components/ui/ListSkeleton';

{loading ? (
  <StatsGridSkeleton columns={3} rows={2} />
) : (
  <StatsGrid data={stats} />
)}
```

#### MessageListSkeleton
```jsx
import { MessageListSkeleton } from './components/ui/ListSkeleton';

{loading ? <MessageListSkeleton items={6} /> : <MessageList data={messages} />}
```

#### CalendarSkeleton
```jsx
import { CalendarSkeleton } from './components/ui/ListSkeleton';

{loading ? <CalendarSkeleton /> : <Calendar data={events} />}
```

**All Skeletons Feature:**
- Pulse animation
- Proper ARIA attributes
- Configurable item counts
- Design system integration

---

## 5. ERROR BOUNDARIES

### FeatureErrorBoundary Component

**Purpose:** Gracefully handle errors without crashing the app

**Basic Usage:**
```jsx
import FeatureErrorBoundary from './components/ui/FeatureErrorBoundary';

function App() {
  return (
    <FeatureErrorBoundary featureName="Athlete Dashboard">
      <AthleteList />
    </FeatureErrorBoundary>
  );
}
```

**Props:**
- `featureName` - Name shown in error message
- `fallback` - Custom error UI component
- `showHomeButton` - Show "Go to home" button
- `minimal` - Use compact error UI
- `onError(error, errorInfo)` - Error callback
- `onReset()` - Reset callback

**Advanced Usage:**

#### Custom Fallback
```jsx
<FeatureErrorBoundary
  featureName="Dashboard"
  fallback={({ error, onReset }) => (
    <div>
      <h2>Custom Error UI</h2>
      <p>{error.message}</p>
      <button onClick={onReset}>Try Again</button>
    </div>
  )}
>
  <Dashboard />
</FeatureErrorBoundary>
```

#### Minimal Mode
```jsx
<FeatureErrorBoundary featureName="Widget" minimal>
  <SmallWidget />
</FeatureErrorBoundary>
```

#### With Callbacks
```jsx
<FeatureErrorBoundary
  featureName="Critical Feature"
  onError={(error, errorInfo) => {
    // Send to error tracking
    console.error('Error in critical feature', error);
  }}
  onReset={() => {
    // Reset state
    console.log('User attempted recovery');
  }}
  showHomeButton
>
  <CriticalFeature />
</FeatureErrorBoundary>
```

#### HOC Pattern
```jsx
import { withErrorBoundary } from './components/ui/FeatureErrorBoundary';

const SafeAthleteList = withErrorBoundary(AthleteList, {
  featureName: 'Athlete List',
  showHomeButton: true,
});

function App() {
  return <SafeAthleteList />;
}
```

---

## 6. ACCESSIBILITY UTILITIES

### Common Use Cases

#### Focus Trapping (Modals)
```jsx
import { trapFocus } from './utils/accessibility';

function Modal({ isOpen }) {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      return cleanup;
    }
  }, [isOpen]);

  return <div ref={modalRef}>Modal content</div>;
}
```

#### Focus Management
```jsx
import { FocusManager } from './utils/accessibility';

function Dialog({ onClose }) {
  const focusManager = new FocusManager();

  useEffect(() => {
    focusManager.save();
    return () => focusManager.restore();
  }, []);

  return <div>Dialog content</div>;
}
```

#### Screen Reader Announcements
```jsx
import { announce } from './utils/accessibility';

function SaveButton() {
  const handleSave = async () => {
    await saveData();
    announce('Data saved successfully', 'polite');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

#### Keyboard List Navigation
```jsx
import { handleListKeyNavigation } from './utils/accessibility';

function List({ items }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e) => {
    const newIndex = handleListKeyNavigation(
      e,
      items,
      focusedIndex,
      (item) => console.log('Selected:', item)
    );
    if (newIndex !== null) setFocusedIndex(newIndex);
  };

  return (
    <ul onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <li key={i} tabIndex={i === focusedIndex ? 0 : -1}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

#### Color Contrast Checking
```jsx
import { meetsContrastRequirements } from './utils/accessibility';

function Button({ color, backgroundColor, children }) {
  const hasGoodContrast = meetsContrastRequirements(color, backgroundColor);

  if (!hasGoodContrast) {
    console.warn('Button has poor color contrast');
  }

  return <button style={{ color, backgroundColor }}>{children}</button>;
}
```

---

## 7. ACCESSIBILITY CSS

### Import in Your App

```jsx
// In your main App.jsx or index.js
import './styles/accessibility.css';
```

### Using CSS Classes

#### Screen Reader Only Text
```jsx
<span className="sr-only">Visible only to screen readers</span>
```

#### Skip to Main Content
```jsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Your content */}
</main>
```

#### Focus Visible
```jsx
<button className="focus-visible">
  Will show enhanced focus on keyboard navigation
</button>
```

---

## BEST PRACTICES

### Loading States
1. Always show skeleton that matches content shape
2. Use appropriate skeleton variant for content type
3. Show loading immediately (no delay)
4. Maintain layout stability (no layout shift)

### Error Handling
1. Wrap features in error boundaries
2. Provide actionable error messages
3. Offer retry mechanisms
4. Log errors to monitoring service

### Accessibility
1. Test with keyboard only
2. Test with screen reader
3. Ensure 4.5:1 contrast ratio minimum
4. Use semantic HTML
5. Provide text alternatives for icons
6. Support reduced motion preferences

### Mobile
1. Touch targets minimum 44x44px
2. Test on actual devices
3. Support both portrait and landscape
4. Optimize images for mobile
5. Use responsive text sizes

---

## TROUBLESHOOTING

### Component Not Rendering
- Check all required props are provided
- Verify import path is correct
- Check for console errors
- Ensure parent component is not hiding it

### API Integration Issues
- Look for `// TODO: Replace with actual API call` comments
- Update with real endpoint URLs
- Handle API errors appropriately
- Add loading states

### Styling Issues
- Verify design-tokens.js is imported
- Check CSS specificity conflicts
- Use browser dev tools to inspect
- Test in different browsers

### Accessibility Issues
- Run Lighthouse accessibility audit
- Test with screen reader
- Use keyboard only navigation
- Check color contrast ratios

---

## QUICK REFERENCE

### Import Cheat Sheet
```jsx
// Auth
import ForgotPassword from './features/auth/ForgotPassword';
import VerifyResetToken from './features/auth/VerifyResetToken';
import ResetPassword from './features/auth/ResetPassword';

// 2FA
import TwoFactorSetup from './features/profile/TwoFactorSetup';
import TwoFactorDisable from './features/profile/TwoFactorDisable';

// Mobile Coach
import MobileCoachDashboard from './mobile/MobileCoachDashboard';
import MobileCoachAthleteDetail from './mobile/MobileCoachAthleteDetail';
import MobileCoachSessionsView from './mobile/MobileCoachSessionsView';
import MobileCoachTestResults from './mobile/MobileCoachTestResults';

// Loading
import {
  AthleteListSkeleton,
  SessionListSkeleton,
  StatsGridSkeleton,
  MessageListSkeleton,
  CalendarSkeleton,
  TournamentListSkeleton,
  FormSkeleton
} from './components/ui/ListSkeleton';

// Error Handling
import FeatureErrorBoundary, {
  useErrorHandler,
  withErrorBoundary
} from './components/ui/FeatureErrorBoundary';

// Accessibility
import {
  trapFocus,
  FocusManager,
  announce,
  handleListKeyNavigation,
  meetsContrastRequirements
} from './utils/accessibility';

// Styles
import './styles/accessibility.css';
```

---

**For more details, see FRONTEND_QUICK_WINS_REPORT.md**
