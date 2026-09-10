# SkillNexus — Database Full-Stack Cross-Validation Audit Report

## 1. Executive Summary
This report audits the **MongoDB WEBCRAFT Database** integration for the SkillNexus platform. It checks the Mongoose database connection in [`db.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/config/db.js), 6 core collection schemas (`users`, `skills`, `exchanges`, `messages`, `skillrequests`, `safetyreports`), indexing, seed initialization in [`seed.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/seed.js), and data integrity.

---

## 2. Database Connection Architecture

- **Database Name**: `WEBCRAFT`
- **MongoDB URI**: `mongodb://localhost:27017/WEBCRAFT` (configured via `process.env.MONGODB_URI`)
- **Connection Module**: [`server/config/db.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/config/db.js)

```javascript
export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WEBCRAFT');
  console.log(`[MongoDB] Connected successfully to WEBCRAFT Database: ${conn.connection.host}/${conn.connection.name}`);
};
```

---

## 3. Schema & Collection Audit Matrix

### A. Collection: `users`
- **Model File**: [`server/models/User.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/User.js)
- **Key Fields**: `userId` (indexed unique string), `name`, `email` (indexed unique string), `password` (bcrypt hashed), `skillsToTeach` (embedded array), `skillsToLearn` (embedded array), `reputationScore`, `exchangesCompleted`, `peerReviewsCount`.
- **Validation**: Passwords deleted from lean queries before returning API responses.

### B. Collection: `skills`
- **Model File**: [`server/models/Skill.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/Skill.js)
- **Key Fields**: `skillId` (indexed unique string), `name`, `category`, `level`, `tags`, `iconName`.

### C. Collection: `exchanges`
- **Model File**: [`server/models/Exchange.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/Exchange.js)
- **Key Fields**: `exchangeId` (indexed unique string), `requesterId`, `recipientId`, `offeredSkillId`, `requestedSkillId`, `status` (Enum: `Pending`, `Accepted`, `Declined`, `Active`, `Paused`, `Completed`, `Cancelled`), `milestones` (sub-documents), `sessionLogs` (sub-documents), `feedback` (sub-document).

### D. Collection: `messages`
- **Model File**: [`server/models/Message.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/Message.js)
- **Key Fields**: `messageId` (indexed unique), `exchangeId` (indexed for fast query), `senderId`, `text`, `timestamp`.

### E. Collection: `skillrequests`
- **Model File**: [`server/models/SkillRequest.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/SkillRequest.js)
- **Key Fields**: `requestId` (unique), `skillName`, `category`, `requestedBy`, `upvotes` (number), `status`.

### F. Collection: `safetyreports`
- **Model File**: [`server/models/SafetyReport.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/models/SafetyReport.js)
- **Key Fields**: `reportId` (unique), `reportedUserId`, `reportedByUserId`, `reason`, `details`, `status`.

---

## 4. Verification & Seed Audit

- **Seed Script**: [`server/seed.js`](file:///c:/Users/shyam/Documents/WEBCRAFT/server/seed.js) initializes 3 core student personas (*Alex Chen*, *Maya Lin*, *Marcus Vance*), 1 admin user, 8 skills, active reciprocal exchange, messages, and safety report.
- **Runtime Verification**: All database operations write directly to MongoDB `WEBCRAFT` database and persist across server restarts.
