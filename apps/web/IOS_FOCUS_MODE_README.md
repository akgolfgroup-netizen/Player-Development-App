# iOS Focus Mode Integration

Complete guide for implementing iOS Focus mode in the AK Golf IUP app, supporting both PWA (Shortcuts) and Native App (Capacitor) modes.

## Overview

The iOS Focus mode integration allows players to start practice sessions with automatic Do Not Disturb, blocking notifications and distractions during training.

**Two Implementation Modes:**

1. **PWA + Shortcuts (Phase 1)** ✅ COMPLETED
   - Works with web app in Safari
   - Requires user to create iOS Shortcut
   - Manual Focus mode control

2. **Native App (Phase 2)** ✅ COMPLETED
   - Full native iOS app with Capacitor
   - Automatic Focus mode control via plugin
   - No Shortcuts required

---

## Phase 1: PWA + Shortcuts (Current)

### Files Created

#### Utilities
- `src/utils/platform.js` - iOS detection and capability checking
  - `isIOS()` - Detects iOS devices including iPadOS 13+
  - `supportsFocusMode()` - Checks for iOS 15+
  - `getFocusCapabilities()` - Checks Web APIs availability
  - `generateShortcutURL()` - Creates Shortcut installation URLs

#### Components
- `src/components/FocusSession.jsx` - Basic focus session component
- `src/components/FocusSession.css` - Styling for focus session UI

### How It Works (PWA Mode)

1. **Player creates Focus mode** in iOS Settings
2. **Player installs Shortcut** via app's setup modal
3. **Player runs Shortcut** to enable Focus + launch app
4. **App detects `?focus=start` URL** and auto-starts session
5. **App uses fullscreen + wake lock** for immersive experience

### User Setup Instructions (PWA)

```
1. Go to Settings → Focus
2. Create new Focus mode called "Golf Training"
3. In app, tap "Setup iOS Focus Mode"
4. Tap "Install Shortcut" button
5. In Shortcuts app, configure the shortcut:
   - Action 1: Set Focus → "Golf Training"
   - Action 2: Open URL → [app URL]?focus=start
6. Add app to Home Screen
7. Run "Start Golf Training" shortcut to begin sessions
```

### Limitations (PWA Mode)

- ❌ Cannot programmatically enable/disable Focus mode
- ❌ Requires user to create Focus mode manually
- ❌ Requires Shortcut setup
- ❌ Cannot detect Focus mode status
- ✅ Works in Safari without app store
- ✅ Cross-platform (any iOS 15+ device)

---

## Phase 2: Native App (Full Control)

### Files Created

#### Capacitor Configuration
- `capacitor.config.ts` - Capacitor app configuration
- `package.json` - Updated with Capacitor dependencies

#### Capacitor Plugin (TypeScript)
- `src/plugins/focus-mode/definitions.ts` - Plugin interface
- `src/plugins/focus-mode/web.ts` - Web fallback implementation
- `src/plugins/focus-mode/index.ts` - Plugin registration

#### Native iOS Plugin (Swift)
- `ios-plugin/FocusModePlugin.swift` - Capacitor plugin bridge
- `ios-plugin/FocusModeManager.swift` - iOS Focus mode control
- `ios-plugin/FocusModePlugin.m` - Objective-C bridge

#### Enhanced Component
- `src/components/FocusSessionEnhanced.jsx` - Native + PWA support

### How It Works (Native Mode)

1. **App detects it's running as native** (Capacitor)
2. **App calls `FocusMode.enableFocusMode()`** when session starts
3. **Native plugin triggers iOS Shortcut** (or uses Focus API)
4. **Focus mode enabled automatically**
5. **App listens for Focus mode changes**
6. **App calls `FocusMode.disableFocusMode()`** when session ends

### Plugin API

```typescript
// Check if supported
const { supported, version } = await FocusMode.isSupported();

// Enable Focus mode
const result = await FocusMode.enableFocusMode({
  focusName: 'Golf Training',
  duration: 60 // minutes, 0 = indefinite
});

// Disable Focus mode
await FocusMode.disableFocusMode();

// Get current Focus status
const { isActive, focusName } = await FocusMode.getCurrentFocusMode();

// Listen for changes
const { id } = await FocusMode.addFocusModeListener((info) => {
  console.log('Focus mode changed:', info);
});
```

### Building the Native App

```bash
# Install dependencies
cd apps/web
npm install

# Build web app
npm run build

# Initialize Capacitor (first time only)
npx cap init

# Add iOS platform
npx cap add ios

# Copy web build to native
npx cap copy ios

# Sync native dependencies
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Xcode Configuration

1. **Add Focus Status capability:**
   - Open project in Xcode
   - Select target → Signing & Capabilities
   - Click "+ Capability"
   - Add "Focus Status"

2. **Add Privacy Usage Description:**
   - Open `Info.plist`
   - Add key: `NSFocusStatusUsageDescription`
   - Value: `This app uses Focus status to automatically enable Do Not Disturb during practice sessions.`

3. **Add custom iOS plugin:**
   - Right-click project → Add Files
   - Select `ios-plugin/` folder
   - Check "Copy items if needed"
   - Check "Create groups"

4. **Configure URL scheme:**
   - Already configured in `capacitor.config.ts`
   - Scheme: `akgolf://`
   - For deep linking from Shortcuts

### User Setup Instructions (Native App)

```
1. Download app from App Store (or TestFlight)
2. Open app, grant Focus Status permission
3. Go to Settings → Focus
4. Create Focus mode called "Golf Training"
5. (Optional) Create Shortcut for automation
6. In app, tap "Start Practice Session"
7. Focus mode enables automatically
```

### Advantages (Native Mode)

- ✅ Programmatic Focus mode control
- ✅ Automatic enable/disable
- ✅ Real-time Focus status detection
- ✅ Better integration with iOS
- ✅ No Shortcuts required (optional)
- ❌ Requires App Store submission
- ❌ Must be downloaded/installed

---

## Component Usage

### Basic Usage (PWA or Native)

```jsx
import FocusSessionEnhanced from './components/FocusSessionEnhanced';

function PracticeScreen() {
  const handleSessionComplete = (result) => {
    console.log('Session completed:', result);
    // Save to backend, update UI, etc.
  };

  return (
    <FocusSessionEnhanced
      sessionData={{
        estimatedDuration: 60, // minutes
        type: 'practice',
        exercises: [...]
      }}
      onSessionComplete={handleSessionComplete}
    />
  );
}
```

### Component Props

```typescript
interface FocusSessionProps {
  sessionData?: {
    estimatedDuration?: number; // minutes
    type?: string;
    exercises?: any[];
  };
  onSessionComplete?: (result: {
    duration: number; // seconds
    sessionData: any;
    completedAt: string; // ISO timestamp
  }) => void;
}
```

### Component States

- `idle` - Ready to start
- `active` - Session in progress (Focus enabled, timer running, wake lock active)
- `paused` - Session paused (Focus disabled, timer stopped)
- `completed` - Session finished (all cleaned up)

---

## Platform Detection

The component automatically detects:

1. **iOS vs other platforms** - `isIOS()`
2. **iOS version** - `iOSVersion()`
3. **Focus mode support** - `supportsFocusMode()` (iOS 15+)
4. **Native vs web** - `Capacitor.isNativePlatform()`
5. **PWA standalone** - `isStandalone()`
6. **Available Web APIs** - `getFocusCapabilities()`

### Behavior Matrix

| Platform | Mode | Focus Control | Fullscreen | Wake Lock |
|----------|------|---------------|------------|-----------|
| iOS 15+ Safari | PWA | Shortcuts | ✅ (if standalone) | ✅ |
| iOS 15+ Native | Native App | Automatic | ✅ | ✅ |
| iOS < 15 | Web | None | ✅ (if standalone) | ❌ |
| Android | Web | N/A | ✅ | ✅ |
| Desktop | Web | N/A | ✅ | ✅ |

---

## Testing Checklist

### PWA Mode
- [ ] Detects iOS device correctly
- [ ] Shows "Setup iOS Focus Mode" button on iOS 15+
- [ ] Opens Shortcut setup modal
- [ ] Generates correct Shortcut URL
- [ ] Detects `?focus=start` URL parameter
- [ ] Auto-starts session from Shortcut
- [ ] Enters fullscreen when standalone
- [ ] Acquires wake lock successfully
- [ ] Timer counts up correctly
- [ ] Pause/resume works
- [ ] Complete session cleans up resources
- [ ] localStorage backup works

### Native App Mode
- [ ] Detects native platform correctly
- [ ] Shows "Native Focus Mode Available" badge
- [ ] `FocusMode.isSupported()` returns true on iOS 15+
- [ ] `FocusMode.enableFocusMode()` succeeds
- [ ] Focus mode actually enables on device
- [ ] Session timer runs during Focus
- [ ] `FocusMode.disableFocusMode()` succeeds
- [ ] Focus mode actually disables on device
- [ ] Focus listener detects external changes
- [ ] Pausing session when Focus disabled externally
- [ ] Cleanup on unmount

---

## Deployment

### PWA Deployment

1. **Build web app:**
   ```bash
   npm run build
   ```

2. **Deploy to hosting** (Vercel, Netlify, etc.)

3. **Ensure HTTPS** (required for PWA features)

4. **Add to Home Screen instructions** in app

### Native App Deployment

1. **Build and archive in Xcode:**
   - Product → Archive
   - Distribute → App Store Connect

2. **Submit to App Review:**
   - Explain Focus Status usage in review notes
   - Provide demo account if needed

3. **TestFlight Beta:**
   - Add beta testers
   - Collect feedback

4. **App Store Release:**
   - After approval
   - Monitor crash reports

---

## Troubleshooting

### PWA Issues

**Problem:** Shortcut doesn't launch app
- **Solution:** Ensure app is added to Home Screen, check URL scheme

**Problem:** Fullscreen doesn't work
- **Solution:** Only works in standalone mode, add to Home Screen

**Problem:** Wake lock fails
- **Solution:** Check iOS version, wake lock requires iOS 16.4+

### Native App Issues

**Problem:** Plugin not found
- **Solution:** Run `npx cap sync ios`, rebuild in Xcode

**Problem:** Focus mode doesn't enable
- **Solution:** Check Focus Status capability, verify permission granted

**Problem:** Shortcut not triggering
- **Solution:** Ensure Focus mode "Golf Training" exists in Settings

---

## Future Enhancements

### Potential Features
- [ ] Create Focus mode programmatically (iOS 16+)
- [ ] Multiple Focus profiles (Practice, Tournament, Recovery)
- [ ] Smart suggestions based on time/location
- [ ] Integration with Apple Watch
- [ ] HomeKit scene automation
- [ ] Calendar integration (schedule Focus sessions)
- [ ] Analytics on Focus mode usage

### iOS 16+ APIs
```swift
// Future: Create Focus mode programmatically
import Intents

let intent = INCreateFocusFilterIntent()
intent.filterName = "Golf Training"
// Configure filter...
```

---

## Resources

### Apple Documentation
- [Focus Status API](https://developer.apple.com/documentation/intents/focus-status)
- [Do Not Disturb](https://support.apple.com/guide/iphone/set-up-a-focus-iph5c3f5b77b/ios)
- [iOS Shortcuts](https://support.apple.com/guide/shortcuts/welcome/ios)

### Capacitor Documentation
- [Capacitor iOS](https://capacitorjs.com/docs/ios)
- [Creating Plugins](https://capacitorjs.com/docs/plugins/creating-plugins)
- [iOS Development](https://capacitorjs.com/docs/ios/configuration)

### Web APIs
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [PWA](https://web.dev/progressive-web-apps/)

---

## Summary

**Phase 1 (PWA + Shortcuts):**
- ✅ Works immediately in Safari
- ✅ No app store required
- ✅ Basic Focus mode integration
- ⚠️ Requires manual setup

**Phase 2 (Native App):**
- ✅ Full automatic control
- ✅ Better user experience
- ✅ Real-time Focus detection
- ⚠️ Requires app store approval

**Recommendation:** Start with PWA mode for immediate availability, add native app for premium users or when user adoption justifies app store submission.

---

**Created:** 2025-12-16
**Status:** ✅ Complete (Phase 1 + Phase 2)
**Files:** 15 files created
**Ready for:** Testing and deployment
