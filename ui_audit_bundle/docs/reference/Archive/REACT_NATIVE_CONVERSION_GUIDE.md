# REACT NATIVE CONVERSION GUIDE
**Konvertering: ak_golf_booking_system.jsx → React Native**

---

## 🎯 HOVEDENDRINGER

### 1. Import-endringer

**FØR (Web)**:
```jsx
import { Calendar, Plus, Users, Trophy } from 'lucide-react';
```

**ETTER (React Native)**:
```jsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
```

**Ikon-mapping**:
```jsx
const ICON_MAP = {
  Calendar: 'calendar',
  Plus: 'add',
  Users: 'people',
  Trophy: 'trophy',
  Clock: 'time',
  MapPin: 'location',
  ChevronLeft: 'chevron-back',
  ChevronRight: 'chevron-forward',
  Filter: 'filter',
  Search: 'search',
  Bell: 'notifications',
  Settings: 'settings',
  Check: 'checkmark',
  X: 'close'
};
```

### 2. Komponent-endringer

| Web (HTML) | React Native | Notater |
|------------|--------------|---------|
| `<div>` | `<View>` | Grunnleggende container |
| `<span>` | `<Text>` | All tekst MÅ være i <Text> |
| `<button>` | `<Pressable>` eller `<TouchableOpacity>` | Bruk Pressable for moderne API |
| `<input>` | `<TextInput>` | Fra 'react-native' |
| `onClick` | `onPress` | Event-håndtering |
| `className` | `style` | Bruk StyleSheet.create() |

### 3. Styling-endringer

**FØR (Web - className)**:
```jsx
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">
```

**ETTER (React Native - style)**:
```jsx
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
  }
});
```

### 4. Scroll-håndtering

**FØR (Web)**:
```jsx
<div className="overflow-auto">
```

**ETTER (React Native)**:
```jsx
<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
>
```

### 5. Modal-håndtering

**FØR (Web)**:
```jsx
{showModal && (
  <div className="fixed inset-0 bg-black/50">
)}
```

**ETTER (React Native)**:
```jsx
<Modal
  visible={showModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* content */}
    </View>
  </View>
</Modal>
```

---

## 📝 KONVERTERINGSSTEG

### Steg 1: Opprett ny fil

```bash
cd Screens/
touch Kalender.jsx
```

### Steg 2: Basis-imports

```jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
```

### Steg 3: Konverter EVENT_TYPES_CONFIG

```jsx
const EVENT_TYPES_CONFIG = {
  tournament_result: {
    label: 'Resultat-turnering',
    iconName: 'trophy', // Ionicons name
    iconFamily: 'Ionicons',
    color: '#DC2626',
    bgColor: '#FEE2E2'
  },
  // ... resten
};
```

### Steg 4: Konverter EventCard-komponent

**FØR (Web)**:
```jsx
<div
  className="p-3 rounded-lg cursor-pointer"
  style={{ backgroundColor: config.bgColor }}
  onClick={() => setSelectedEvent(event)}
>
  <Icon size={14} style={{ color: config.color }} />
  <p className="font-medium">{event.title}</p>
</div>
```

**ETTER (React Native)**:
```jsx
<Pressable
  style={[styles.eventCard, { backgroundColor: config.bgColor }]}
  onPress={() => setSelectedEvent(event)}
>
  <Ionicons name={config.iconName} size={14} color={config.color} />
  <Text style={styles.eventTitle}>{event.title}</Text>
</Pressable>

const styles = StyleSheet.create({
  eventCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  }
});
```

### Steg 5: Konverter MonthView

```jsx
const MonthView = () => {
  const days = getDaysInMonth(currentDate);
  const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  return (
    <View style={styles.monthView}>
      {/* Header */}
      <View style={styles.weekDaysHeader}>
        {weekDays.map((day, i) => (
          <Text key={i} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.daysGrid}>
          {days.map((day, i) => {
            const dayEvents = getEventsForDate(day.date);
            return (
              <Pressable
                key={i}
                style={[
                  styles.dayCell,
                  !day.isCurrentMonth && styles.dayCell_inactive,
                  isToday(day.date) && styles.dayCell_today
                ]}
                onPress={() => { setCurrentDate(day.date); setViewMode('day'); }}
              >
                <Text style={[
                  styles.dayNumber,
                  !day.isCurrentMonth && styles.dayNumber_inactive,
                  isToday(day.date) && styles.dayNumber_today
                ]}>
                  {day.date.getDate()}
                </Text>

                {/* Events */}
                <View style={styles.dayEvents}>
                  {dayEvents.slice(0, 2).map(event => (
                    <EventDot key={event.id} event={event} />
                  ))}
                  {dayEvents.length > 2 && (
                    <Text style={styles.moreEvents}>+{dayEvents.length - 2}</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  monthView: {
    flex: 1,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },
  dayCell_inactive: {
    backgroundColor: '#F9FAFB',
  },
  dayCell_today: {
    backgroundColor: '#ECFDF5',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  dayNumber_inactive: {
    color: '#D1D5DB',
  },
  dayNumber_today: {
    color: '#059669',
    fontWeight: '700',
  },
  dayEvents: {
    marginTop: 4,
  },
  moreEvents: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  }
});
```

### Steg 6: Konverter DayView

```jsx
const DayView = () => {
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const dayEvents = getEventsForDate(currentDate);

  return (
    <ScrollView style={styles.dayView}>
      <View style={styles.timelineContainer}>
        {hours.map(hour => (
          <View key={hour} style={styles.hourRow}>
            <Text style={styles.hourLabel}>
              {hour.toString().padStart(2, '0')}:00
            </Text>
            <View style={styles.hourLine} />
          </View>
        ))}

        {/* Events overlay */}
        {dayEvents.map(event => {
          const startHour = event.start.getHours() + event.start.getMinutes() / 60;
          const endHour = event.end.getHours() + event.end.getMinutes() / 60;
          const top = (startHour - 6) * 80; // 80px per hour
          const height = (endHour - startHour) * 80;
          const config = EVENT_TYPES_CONFIG[event.type];

          return (
            <Pressable
              key={event.id}
              style={[
                styles.eventBlock,
                {
                  top,
                  height: Math.max(height, 60),
                  backgroundColor: config.bgColor,
                  borderLeftColor: config.color,
                }
              ]}
              onPress={() => { setSelectedEvent(event); setShowEventModal(true); }}
            >
              <Ionicons name={config.iconName} size={16} color={config.color} />
              <Text style={[styles.eventBlockTitle, { color: config.color }]}>
                {event.title}
              </Text>
              <Text style={styles.eventBlockTime}>
                {formatTime(event.start)} - {formatTime(event.end)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dayView: {
    flex: 1,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 60,
  },
  hourRow: {
    flexDirection: 'row',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  hourLabel: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 50,
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
  },
  hourLine: {
    flex: 1,
  },
  eventBlock: {
    position: 'absolute',
    left: 60,
    right: 8,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventBlockTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  eventBlockTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  }
});
```

### Steg 7: Konverter Modal

```jsx
const EventModal = () => {
  if (!selectedEvent) return null;
  const config = EVENT_TYPES_CONFIG[selectedEvent.type];

  return (
    <Modal
      visible={showEventModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEventModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setShowEventModal(false)}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: config.bgColor }]}>
            <View style={styles.modalHeaderContent}>
              <Ionicons name={config.iconName} size={24} color={config.color} />
              <Text style={[styles.modalTitle, { color: config.color }]}>
                {selectedEvent.title}
              </Text>
            </View>
            <Pressable onPress={() => setShowEventModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody}>
            {/* Time */}
            <View style={styles.modalRow}>
              <Ionicons name="time" size={18} color="#6B7280" />
              <View style={styles.modalRowContent}>
                <Text style={styles.modalRowText}>
                  {selectedEvent.start.toLocaleDateString('nb-NO')}
                </Text>
                <Text style={styles.modalRowSubtext}>
                  {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                </Text>
              </View>
            </View>

            {/* Location */}
            {selectedEvent.location && (
              <View style={styles.modalRow}>
                <Ionicons name="location" size={18} color="#6B7280" />
                <Text style={styles.modalRowText}>{selectedEvent.location}</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <Pressable style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Rediger</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.modalButtonPrimary]}>
              <Text style={styles.modalButtonTextPrimary}>Bekreft</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalRowContent: {
    flex: 1,
  },
  modalRowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  modalRowSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#059669',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  }
});
```

---

## 🔧 NØDVENDIGE PACKAGES

```bash
# Installer nødvendige pakker
npm install @expo/vector-icons
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install @supabase/supabase-js
```

---

## ✅ KOMPLETT MINIMAL KALENDER (Klar til bruk)

**Fil**: `Screens/Kalender.jsx`

```jsx
// Se full implementasjon i Screens/Kalender.jsx (eksisterende fil)
// Denne filen er allerede tilpasset React Native
```

**Bruk i app**:
```jsx
import Kalender from './components/Kalender';

<Tab.Navigator>
  <Tab.Screen name="Kalender" component={Kalender} />
</Tab.Navigator>
```

---

## 📊 NØKKEL FORSKJELLER: WEB vs NATIVE

| Aspekt | Web (ak_golf_booking_system.jsx) | React Native (Kalender.jsx) |
|--------|----------------------------------|------------------------------|
| **Størrelse** | 1488 linjer | 800-1000 linjer (optimalisert) |
| **Ikoner** | lucide-react | @expo/vector-icons |
| **Styling** | Tailwind className | StyleSheet.create() |
| **Scroll** | div overflow-auto | ScrollView |
| **Touch** | onClick | onPress |
| **Layout** | CSS Grid/Flexbox | Flexbox only |
| **Modal** | Custom overlay | React Native Modal |
| **Navigation** | Browser-based | React Navigation |

---

## 🎯 TESTING SJEKKLISTE

- [ ] Month view viser korrekte dager
- [ ] Day view viser hendelser på riktig tidspunkt
- [ ] Modal åpnes når du trykker på hendelse
- [ ] Navigasjon mellom måneder fungerer
- [ ] "I dag"-knapp går til dagens dato
- [ ] Filtrering etter hendelsestype fungerer
- [ ] Scroll fungerer smooth på iOS og Android
- [ ] Farger matcher design system

---

**KONVERTERING FERDIG! 🎉**

*Guide opprettet: 14. desember 2025*
*Bruk eksisterende Kalender.jsx som er allerede tilpasset React Native!*
