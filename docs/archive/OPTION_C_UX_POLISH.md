# Option C: UX Polish

**Status:** Documented - Ready for Implementation
**Estimated Effort:** 1-2 weeks

## Overview

Enhance user experience with loading skeletons, toast notifications, optimistic UI updates, and progressive web app features.

## Tasks

### 1. Loading Skeletons

**Current:** Generic spinning loader
**Target:** Content-aware skeleton screens

**Implementation:**

```javascript
// apps/web/src/components/ui/Skeleton.jsx
import { tokens } from '../../design-tokens';

export const Skeleton = ({ width = '100%', height = '20px', className = '' }) => (
  <div
    className={className}
    style={{
      width,
      height,
      backgroundColor: tokens.colors.mist,
      borderRadius: tokens.borderRadius.sm,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}
  />
);

export const CardSkeleton = () => (
  <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.ivory, borderRadius: tokens.borderRadius.md }}>
    <Skeleton width="60%" height="24px" style={{ marginBottom: tokens.spacing.sm }} />
    <Skeleton width="100%" height="16px" style={{ marginBottom: tokens.spacing.xs }} />
    <Skeleton width="80%" height="16px" />
  </div>
);

export const ListSkeleton = ({ items = 3 }) => (
  <div>
    {Array.from({ length: items }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
```

**Usage:**
```javascript
// In any component
if (state === 'loading') return <ListSkeleton items={5} />;
```

**Benefits:**
- Better perceived performance
- Reduces content shift
- Professional feel

### 2. Toast Notifications

**Target:** Non-intrusive feedback for actions

**Library:** `react-hot-toast` or `sonner`

**Installation:**
```bash
npm install react-hot-toast
```

**Implementation:**
```javascript
// apps/web/src/App.jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Router>...</Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: tokens.colors.charcoal,
            color: tokens.colors.ivory,
          },
          success: {
            iconTheme: {
              primary: tokens.colors.success,
              secondary: tokens.colors.ivory,
            },
          },
        }}
      />
    </>
  );
}
```

**Usage:**
```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Trening lagret!');

// Error
toast.error('Noe gikk galt');

// Loading
const toastId = toast.loading('Lagrer...');
// ... async operation
toast.success('Lagret!', { id: toastId });
```

**Replace:**
- SuccessState component → toast.success()
- Error alerts → toast.error()
- Loading indicators → toast.loading()

### 3. Optimistic UI Updates

**Target:** Instant feedback before server confirmation

**Pattern:**
```javascript
const handleSaveTraining = async (data) => {
  // Add to UI immediately
  const tempId = `temp_${Date.now()}`;
  setSessions([...sessions, { ...data, id: tempId, _optimistic: true }]);
  toast.loading('Lagrer...', { id: 'save' });

  try {
    const response = await apiClient.post('/training/sessions', data);

    // Replace temp with real
    setSessions(prev =>
      prev.map(s => s.id === tempId ? response.data : s)
    );
    toast.success('Lagret!', { id: 'save' });
  } catch (error) {
    // Rollback on error
    setSessions(prev => prev.filter(s => s.id !== tempId));
    toast.error('Kunne ikke lagre', { id: 'save' });
  }
};
```

**Benefits:**
- Feels instant
- Better user experience
- Reduced perceived latency

### 4. Pull-to-Refresh (Mobile)

**Target:** Native-like refresh gesture

**Library:** Custom implementation with touch events

**Implementation:**
```javascript
// apps/web/src/hooks/usePullToRefresh.js
import { useState, useEffect } from 'react';

export function usePullToRefresh(onRefresh) {
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (startY > 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 80) {
          setPulling(true);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pulling) {
        await onRefresh();
        setPulling(false);
      }
      setStartY(0);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, startY, onRefresh]);

  return { pulling };
}
```

### 5. Infinite Scroll

**Target:** Load more data as user scrolls

**Library:** `react-infinite-scroll-component`

**Implementation:**
```javascript
import InfiniteScroll from 'react-infinite-scroll-component';

<InfiniteScroll
  dataLength={items.length}
  next={fetchMoreData}
  hasMore={hasMore}
  loader={<LoadingState />}
  endMessage={<p>Alle elementer lastet</p>}
>
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</InfiniteScroll>
```

### 6. Image Optimization

**Target:** Lazy loading and responsive images

**Implementation:**
```javascript
// apps/web/src/components/ui/OptimizedImage.jsx
export const OptimizedImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
    style={{
      ...props.style,
      objectFit: 'cover',
    }}
  />
);
```

### 7. Offline Support (PWA)

**Target:** Service worker for offline functionality

**Implementation:**

a) **Manifest:**
```json
// apps/web/public/manifest.json
{
  "name": "AK Golf IUP",
  "short_name": "AK Golf",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1A3D2E",
  "background_color": "#F5F7F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

b) **Service Worker:**
```javascript
// apps/web/public/service-worker.js
const CACHE_NAME = 'ak-golf-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```

c) **Register:**
```javascript
// apps/web/src/index.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

### 8. Accessibility Improvements

**Target:** WCAG 2.1 AA compliance

**Improvements:**
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Add focus indicators
- Ensure color contrast ratios

**Tools:**
- Lighthouse accessibility audit
- axe DevTools
- WAVE browser extension

### 9. Animation Polish

**Target:** Smooth transitions and micro-interactions

**Library:** Framer Motion

**Installation:**
```bash
npm install framer-motion
```

**Usage:**
```javascript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card />
</motion.div>
```

**Micro-interactions:**
- Button press feedback
- Card hover effects
- Page transitions
- Modal animations

### 10. Performance Optimization

**Targets:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Lighthouse score > 90

**Optimizations:**
- Code splitting (React.lazy)
- Tree shaking
- Image compression
- Bundle size monitoring
- Critical CSS inlining

## Implementation Priority

### Phase 1: Quick Wins (1-2 days)
1. Toast notifications
2. Loading skeletons
3. Optimistic UI updates

### Phase 2: Enhanced Experience (3-4 days)
4. Pull-to-refresh
5. Image optimization
6. Animation polish

### Phase 3: Progressive Enhancement (3-5 days)
7. Infinite scroll
8. Offline support
9. Accessibility improvements
10. Performance optimization

## Success Metrics

**Before:**
- Lighthouse Performance: ~70
- First Load: 3-4s
- No offline support
- Generic loading states

**After:**
- Lighthouse Performance: >90
- First Load: <2s
- Offline-capable
- Contextual skeletons
- Instant feedback via toasts

## Dependencies

```bash
npm install react-hot-toast framer-motion react-infinite-scroll-component
```

## Testing

- Manual testing on mobile devices
- Lighthouse audits
- Accessibility testing with screen readers
- Performance profiling
- Offline mode testing

## Documentation

Update `IMPLEMENTATION_STATUS.md` with UX improvements and performance metrics.
