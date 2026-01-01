# AK Golf Academy - Messaging & Notifications API

## Oversikt

Denne dokumentasjonen beskriver API-endepunktene for kommunikasjonsplattformen i AK Golf Academy.

---

## Meldinger (Messaging)

### Samtaler (Conversations)

#### GET /api/v1/messages/conversations
Henter alle samtaler for innlogget bruker.

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "name": "Anders Kristiansen (Trener)",
      "groupType": "direct" | "team" | "coach_player",
      "avatarUrl": "https://...",
      "avatarInitials": "AK",
      "avatarColor": "#C9A227",
      "lastMessage": {
        "content": "Husk å fokusere på putting i dag!",
        "senderName": "Anders",
        "sentAt": "2025-12-21T09:30:00Z",
        "isRead": false
      },
      "unreadCount": 2,
      "members": [
        {
          "id": "uuid",
          "name": "Anders Kristiansen",
          "type": "coach" | "player" | "parent"
        }
      ]
    }
  ],
  "total": 10
}
```

#### POST /api/v1/messages/conversations
Oppretter en ny samtale.

**Request:**
```json
{
  "recipientId": "uuid",
  "message": "Hei! Jeg har et spørsmål om trening."
}
```

**Response:**
```json
{
  "conversationId": "uuid",
  "message": {
    "id": "uuid",
    "content": "Hei! Jeg har et spørsmål om trening.",
    "sentAt": "2025-12-21T10:00:00Z"
  }
}
```

---

### Meldinger i samtale

#### GET /api/v1/messages/conversations/:conversationId
Henter alle meldinger i en samtale.

**Query Parameters:**
- `limit` (optional): Antall meldinger (default: 50)
- `before` (optional): Hent meldinger før denne ID-en (for paginering)

**Response:**
```json
{
  "conversation": {
    "id": "uuid",
    "name": "Anders Kristiansen (Trener)",
    "groupType": "coach_player",
    "avatarColor": "#C9A227",
    "avatarInitials": "AK",
    "members": [...]
  },
  "messages": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "senderName": "Anders Kristiansen",
      "senderType": "coach",
      "content": "Hei! Hvordan går det med puttingen?",
      "sentAt": "2025-12-21T09:30:00Z",
      "isRead": true,
      "replyTo": null
    },
    {
      "id": "uuid",
      "senderId": "uuid",
      "senderName": "Ole Spiller",
      "senderType": "player",
      "content": "Det går bra! Har trent mye denne uken.",
      "sentAt": "2025-12-21T09:32:00Z",
      "isRead": true,
      "replyTo": {
        "id": "uuid",
        "content": "Hei! Hvordan går det med puttingen?",
        "senderName": "Anders Kristiansen"
      }
    }
  ],
  "hasMore": false
}
```

#### POST /api/v1/messages/conversations/:conversationId
Sender en ny melding i samtalen.

**Request:**
```json
{
  "content": "Takk for oppdateringen!",
  "replyToId": "uuid" // optional
}
```

**Response:**
```json
{
  "message": {
    "id": "uuid",
    "senderId": "uuid",
    "senderName": "Anders Kristiansen",
    "content": "Takk for oppdateringen!",
    "sentAt": "2025-12-21T10:00:00Z",
    "isRead": false,
    "replyTo": null
  }
}
```

---

### Lese/uleste meldinger

#### PUT /api/v1/messages/conversations/:conversationId/read
Markerer alle meldinger i samtalen som lest.

**Response:**
```json
{
  "success": true,
  "updatedCount": 5
}
```

---

### Kontakter

#### GET /api/v1/messages/contacts
Henter tilgjengelige kontakter for å starte ny samtale.

**Response:**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "name": "Anders Kristiansen",
      "role": "coach",
      "avatarInitials": "AK",
      "avatarColor": "#C9A227"
    },
    {
      "id": "uuid",
      "name": "Erik Hansen",
      "role": "player",
      "avatarInitials": "EH",
      "avatarColor": "#10456A"
    }
  ]
}
```

---

## Varsler (Notifications)

### Hent varsler

#### GET /api/v1/notifications
Henter alle varsler for innlogget bruker.

**Query Parameters:**
- `limit` (optional): Antall varsler (default: 50)
- `unread` (optional): Kun uleste (true/false)

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "achievement" | "success" | "warning" | "error" | "training" | "test" | "tournament" | "message" | "info",
      "title": "Ny prestasjon!",
      "message": "Du har oppnådd \"7-dagers treningsstreak\"!",
      "link": "/achievements",
      "linkLabel": "Se alle prestasjoner",
      "priority": "low" | "normal" | "high",
      "isRead": false,
      "createdAt": "2025-12-21T08:00:00Z",
      "metadata": {
        "achievementCode": "streak_7",
        "testNumber": null,
        "tournamentName": null
      }
    }
  ],
  "total": 25,
  "unreadCount": 3
}
```

---

### Marker som lest

#### PUT /api/v1/notifications/:id/read
Markerer et varsel som lest.

**Response:**
```json
{
  "success": true
}
```

#### PUT /api/v1/notifications/read-all
Markerer alle varsler som lest.

**Response:**
```json
{
  "success": true,
  "updatedCount": 3
}
```

---

### Slett varsel

#### DELETE /api/v1/notifications/:id
Sletter et varsel.

**Response:**
```json
{
  "success": true
}
```

---

## Database-modeller (Prisma)

### ChatGroup
```prisma
model ChatGroup {
  id            String        @id @default(uuid())
  name          String?
  groupType     GroupType     @default(DIRECT)
  avatarUrl     String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  members       ChatGroupMember[]
  messages      ChatMessage[]
}

enum GroupType {
  DIRECT
  TEAM
  COACH_PLAYER
}
```

### ChatMessage
```prisma
model ChatMessage {
  id            String      @id @default(uuid())
  chatGroupId   String
  senderId      String
  content       String
  replyToId     String?
  isRead        Boolean     @default(false)
  createdAt     DateTime    @default(now())

  chatGroup     ChatGroup   @relation(fields: [chatGroupId], references: [id])
  sender        User        @relation(fields: [senderId], references: [id])
  replyTo       ChatMessage? @relation("MessageReplies", fields: [replyToId], references: [id])
  replies       ChatMessage[] @relation("MessageReplies")
}
```

### Notification
```prisma
model Notification {
  id            String          @id @default(uuid())
  userId        String
  type          NotificationType
  title         String
  message       String
  link          String?
  linkLabel     String?
  priority      Priority        @default(NORMAL)
  isRead        Boolean         @default(false)
  metadata      Json?
  createdAt     DateTime        @default(now())

  user          User            @relation(fields: [userId], references: [id])
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
  ACHIEVEMENT
  TRAINING
  TEST
  TOURNAMENT
  MESSAGE
}

enum Priority {
  LOW
  NORMAL
  HIGH
}
```

---

## WebSocket Events (Realtime)

For sanntidsoppdateringer, koble til WebSocket på `/ws/messages`.

### Events fra server:

```typescript
// Ny melding mottatt
{
  type: 'new_message',
  conversationId: 'uuid',
  message: { ... }
}

// Melding lest
{
  type: 'message_read',
  conversationId: 'uuid',
  messageId: 'uuid'
}

// Nytt varsel
{
  type: 'new_notification',
  notification: { ... }
}

// Bruker skriver
{
  type: 'typing',
  conversationId: 'uuid',
  userId: 'uuid',
  userName: 'Anders'
}
```

### Events fra klient:

```typescript
// Marker som skriver
{
  type: 'typing_start',
  conversationId: 'uuid'
}

// Stoppet å skrive
{
  type: 'typing_stop',
  conversationId: 'uuid'
}
```

---

## Feilhåndtering

Alle API-endepunkter returnerer standardiserte feil:

```json
{
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Samtalen ble ikke funnet",
    "status": 404
  }
}
```

### Vanlige feilkoder:
- `UNAUTHORIZED` (401): Ikke innlogget
- `FORBIDDEN` (403): Ikke tilgang til ressursen
- `NOT_FOUND` (404): Ressurs ikke funnet
- `VALIDATION_ERROR` (400): Ugyldig input
- `INTERNAL_ERROR` (500): Serverfeil

---

## Rate Limiting

- Meldinger: Max 60 meldinger per minutt
- Varsler: Max 100 forespørsler per minutt
- WebSocket: Max 10 nye tilkoblinger per minutt

---

## Implementasjonsstatus

| Endepunkt | Status | Prioritet |
|-----------|--------|-----------|
| GET /api/v1/messages/conversations | Planlagt | Høy |
| POST /api/v1/messages/conversations | Planlagt | Høy |
| GET /api/v1/messages/conversations/:id | Planlagt | Høy |
| POST /api/v1/messages/conversations/:id | Planlagt | Høy |
| PUT /api/v1/messages/conversations/:id/read | Planlagt | Medium |
| GET /api/v1/messages/contacts | Planlagt | Høy |
| GET /api/v1/notifications | Planlagt | Høy |
| PUT /api/v1/notifications/:id/read | Planlagt | Medium |
| PUT /api/v1/notifications/read-all | Planlagt | Medium |
| DELETE /api/v1/notifications/:id | Planlagt | Lav |
| WebSocket /ws/messages | Planlagt | Medium |
