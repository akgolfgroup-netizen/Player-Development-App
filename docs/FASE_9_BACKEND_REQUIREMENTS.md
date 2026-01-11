# FASE 9: Meldingssystem - Backend Requirements

## Status
✅ **Frontend UI Complete**
⏳ **Backend Implementation Required**

---

## Completed (Frontend)

### 9.1 Meldingsdesign ✅
- All colors use Design System v3.0 variables
- Consistent styling across MessageCenter and ConversationView

### 9.2 Meldingsfiltere ✅
**File:** `apps/web/src/features/messaging/MessageCenter.tsx`

Implemented filters:
- **Alle** - All conversations
- **Trenere** - Coach conversations (coach_player type)
- **Grupper** - Team/group conversations (team type)
- **Samlinger** - Gathering/camp conversations (requires backend metadata)
- **Turneringer** - Tournament conversations (requires backend metadata)
- **Personer** - Direct person-to-person (direct type)

### 9.3 Lesebekreftelser UI ✅
**File:** `apps/web/src/features/messaging/ConversationView.tsx`

- Check icon (single checkmark) = Message sent
- CheckCheck icon (double checkmark) = Message read
- Tooltip shows who read the message
- Green color for read receipts
- `readBy` array in Message interface for multi-user read tracking

### 9.4 Enhetlig Samtalevisning ✅
**File:** `apps/web/src/features/messaging/ConversationView.tsx`

- Unified conversation view for all message types
- Thread-based display
- Reply functionality
- Participant list display
- Message input with attachment support

---

## Required Backend Implementation

### Database Migrations

```sql
-- Message threads table
CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'direct', 'team', 'coach_player', 'gathering', 'tournament'
  subject VARCHAR(255),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thread participants
CREATE TABLE message_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'system'
  metadata JSONB, -- For images, attachments, etc.
  reply_to_id UUID REFERENCES messages(id),
  read_receipt_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Read receipts
CREATE TABLE message_read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Message reminders (for auto-reminders)
CREATE TABLE message_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id),
  reminded_at TIMESTAMPTZ DEFAULT NOW(),
  next_reminder_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_message_participants_user_id ON message_participants(user_id);
CREATE INDEX idx_message_participants_thread_id ON message_participants(thread_id);
CREATE INDEX idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX idx_message_reminders_next_reminder_at ON message_reminders(next_reminder_at);
```

### API Endpoints

#### Conversations
```typescript
GET /api/v1/messages/conversations
Query params: ?filter=trenere|grupper|samlinger|turneringer|personer|all
Response: {
  conversations: Array<{
    id: string;
    name: string;
    groupType: 'direct' | 'team' | 'coach_player' | 'gathering' | 'tournament';
    avatarUrl?: string;
    avatarInitials: string;
    avatarColor: string;
    lastMessage?: {
      content: string;
      senderName: string;
      sentAt: string;
      isRead: boolean;
    };
    unreadCount: number;
    members: Array<{ id: string; name: string; type: string }>;
  }>
}

GET /api/v1/messages/conversations/:conversationId
Response: {
  conversation: { /* conversation details */ }
}

GET /api/v1/messages/conversations/:conversationId/messages
Response: {
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'player' | 'coach' | 'parent' | 'system';
    content: string;
    messageType: 'text' | 'image' | 'system';
    metadata?: { imageUrl?: string };
    replyTo?: { id: string; content: string; senderName: string };
    isRead: boolean;
    readBy?: Array<{ userId: string; userName: string; readAt: string }>;
    createdAt: string;
    isOwn: boolean;
  }>
}

POST /api/v1/messages/conversations/:conversationId/messages
Body: {
  content: string;
  replyToId?: string;
  messageType?: 'text' | 'image';
  metadata?: object;
}
Response: { message: { /* created message */ } }

PUT /api/v1/messages/conversations/:conversationId/read
Marks all messages in conversation as read
Response: { success: boolean }
```

#### Read Receipts
```typescript
POST /api/v1/messages/:messageId/read-receipt
Creates a read receipt for the current user
Response: { success: boolean }

GET /api/v1/messages/:messageId/receipts
Response: {
  receipts: Array<{
    userId: string;
    userName: string;
    readAt: string;
  }>
}
```

#### Contacts
```typescript
GET /api/v1/messages/contacts
Response: {
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    role?: string;
    category?: string;
    avatarInitials: string;
    avatarColor: string;
    type: 'coach' | 'player' | 'parent';
    isOnline?: boolean;
    lastSeen?: string;
  }>
}
```

### Background Job: Message Reminder

**File:** `apps/api/src/jobs/MessageReminderJob.ts`

```typescript
/**
 * Message Reminder Job
 *
 * Runs every 15 minutes
 * Sends reminders for unread messages:
 * - First reminder: 60 minutes after message sent
 * - Subsequent reminders: Every 60 minutes
 * - Stop when message is read or replied to
 */

import { CronJob } from 'cron';

export class MessageReminderJob {
  private job: CronJob;

  constructor() {
    // Run every 15 minutes: */15 * * * *
    this.job = new CronJob('*/15 * * * *', async () => {
      await this.processReminders();
    });
  }

  async processReminders() {
    const now = new Date();

    // Find messages that need reminders
    const messagesNeedingReminders = await db.query(`
      SELECT
        m.id as message_id,
        m.sender_id,
        m.content,
        m.created_at,
        mp.user_id as recipient_id,
        COALESCE(mr.reminded_count, 0) as reminded_count
      FROM messages m
      JOIN message_participants mp ON mp.thread_id = m.thread_id
      LEFT JOIN message_read_receipts mrr ON mrr.message_id = m.id AND mrr.user_id = mp.user_id
      LEFT JOIN (
        SELECT message_id, recipient_id, COUNT(*) as reminded_count
        FROM message_reminders
        GROUP BY message_id, recipient_id
      ) mr ON mr.message_id = m.id AND mr.recipient_id = mp.user_id
      WHERE
        m.sender_id != mp.user_id  -- Don't remind sender
        AND mrr.id IS NULL  -- Message not read
        AND (
          (mr.reminded_count = 0 AND m.created_at < $1)  -- First reminder after 60 min
          OR (mr.reminded_count > 0 AND EXISTS (
            SELECT 1 FROM message_reminders
            WHERE message_id = m.id
              AND recipient_id = mp.user_id
              AND reminded_at < $2  -- Last reminder was 60+ min ago
            ORDER BY reminded_at DESC
            LIMIT 1
          ))
        )
    `, [
      new Date(now.getTime() - 60 * 60 * 1000),  -- 60 minutes ago
      new Date(now.getTime() - 60 * 60 * 1000),  -- 60 minutes ago
    ]);

    // Send in-app notifications
    for (const reminder of messagesNeedingReminders) {
      await this.sendReminder(reminder);
    }
  }

  async sendReminder(reminder: any) {
    // Create in-app notification
    await notificationService.create({
      userId: reminder.recipient_id,
      type: 'message_reminder',
      title: 'Ulest melding',
      message: `Du har en ulest melding`,
      metadata: {
        messageId: reminder.message_id,
        threadId: reminder.thread_id,
      },
    });

    // Log reminder
    await db.query(`
      INSERT INTO message_reminders (message_id, recipient_id, reminded_at)
      VALUES ($1, $2, $3)
    `, [reminder.message_id, reminder.recipient_id, new Date()]);
  }

  start() {
    this.job.start();
    console.log('[MessageReminderJob] Started');
  }

  stop() {
    this.job.stop();
    console.log('[MessageReminderJob] Stopped');
  }
}
```

### Integration with Notifications System

The message reminder job requires an existing notifications system. If not present, create:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'message_reminder', 'message', 'session_reminder', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

## Implementation Checklist

### Database
- [ ] Run migration to create message_threads table
- [ ] Run migration to create message_participants table
- [ ] Run migration to create messages table
- [ ] Run migration to create message_read_receipts table
- [ ] Run migration to create message_reminders table
- [ ] Run migration to create notifications table (if needed)
- [ ] Add all required indexes

### API Endpoints
- [ ] Implement GET /api/v1/messages/conversations
- [ ] Implement GET /api/v1/messages/conversations/:id
- [ ] Implement GET /api/v1/messages/conversations/:id/messages
- [ ] Implement POST /api/v1/messages/conversations/:id/messages
- [ ] Implement PUT /api/v1/messages/conversations/:id/read
- [ ] Implement POST /api/v1/messages/:id/read-receipt
- [ ] Implement GET /api/v1/messages/:id/receipts
- [ ] Implement GET /api/v1/messages/contacts

### Background Jobs
- [ ] Create MessageReminderJob class
- [ ] Register job with cron scheduler
- [ ] Test reminder timing (60 minutes initial, hourly repeats)
- [ ] Verify reminders stop when message is read

### Frontend Integration
- [ ] Update MessageCenter to use real API endpoints
- [ ] Update ConversationView to use real API endpoints
- [ ] Add real-time WebSocket support for instant message delivery (optional)
- [ ] Add notification center UI component
- [ ] Connect notification system to message reminders

### Testing
- [ ] Test all filter types (trenere, grupper, samlinger, turneringer, personer)
- [ ] Test read receipt creation and display
- [ ] Test message sending and receiving
- [ ] Test reminder job with different timing scenarios
- [ ] Test multi-user read tracking
- [ ] Load test with multiple concurrent conversations

---

## Notes

### Filter Implementation
The `samlinger` and `turneringer` filters currently use simple name matching. For production:
- Add `conversation_context_type` field to `message_threads` table
- Link threads to `gatherings` and `tournaments` tables via foreign keys
- Update filter logic to use proper relationships

### Real-time Updates
Consider implementing WebSocket/Server-Sent Events for:
- Instant message delivery
- Real-time read receipt updates
- Online status updates
- Typing indicators

### Performance Considerations
- Message pagination (load 50 messages at a time)
- Conversation list pagination
- Cache frequently accessed conversations
- Optimize read receipt queries for large group chats

### Privacy & Security
- Verify user permissions before allowing access to conversations
- Implement rate limiting on message sending
- Sanitize message content to prevent XSS
- Encrypt sensitive message content (optional)
