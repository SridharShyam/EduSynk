# SkillNexus (WEBCRAFT) — Comprehensive Application Usage Guide

Welcome to **SkillNexus**, the peer-to-peer student skill exchange platform where students teach what they already know and learn new skills from fellow peers in a structured, reciprocal, and ethical ecosystem.

---

## Table of Contents
1. [Platform Core Philosophy](#1-platform-core-philosophy)
2. [Prerequisites & System Startup](#2-prerequisites--system-startup)
3. [Persona Switching & Live Simulation](#3-persona-switching--live-simulation)
4. [Detailed Feature Guide & User Flows](#4-detailed-feature-guide--user-flows)
   - [Dashboard: Action Center](#a-dashboard-action-center)
   - [Discover Skills Catalog](#b-discover-skills-catalog)
   - [Find Compatible Student Peers](#c-find-compatible-student-peers)
   - [Smart Mutual Synergy Engine](#d-smart-mutual-synergy-engine)
   - [Exchanges & Active Learning Workspace](#e-exchanges--active-learning-workspace)
   - [Student Credibility Profile](#f-student-credibility-profile)
   - [Admin Moderation Console](#g-admin-moderation-console)
5. [Inspecting MongoDB via MongoDB Compass](#5-inspecting-mongodb-via-mongodb-compass)
6. [API Endpoints Architecture](#6-api-endpoints-architecture)

---

## 1. Platform Core Philosophy

Unlike generic course platforms or commercial tutoring marketplaces:
- **No Cash Transactions**: All knowledge is exchanged 1-on-1 through reciprocal learning.
- **Smart 2-Way Synergy Matching**: Algorithmic scoring identifies true mutual skill swaps (e.g. Student A teaches Python & wants UI/UX; Student B teaches UI/UX & wants Python = **100% Mutual Fit**).
- **Ethical Peer Trust**: Credibility badges and reputation ratings are earned exclusively through completed reciprocal exchanges and peer milestone reviews. Self-ratings and pay-to-win mechanisms are strictly blocked.

---

## 2. Prerequisites & System Startup

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **MongoDB**: Community Server running locally on `mongodb://localhost:27017`

### Step 1: Install Dependencies
Open a terminal in the project directory:
```bash
npm install
```

### Step 2: Seed MongoDB Database
Populate the `WEBCRAFT` database on MongoDB with default student personas, skills, active exchanges, and chat messages:
```bash
npm run seed
```

### Step 3: Launch Express Backend Server
Start the backend server (runs on `http://localhost:5000`):
```bash
npm run server
```

### Step 4: Launch Vite Frontend Dev Server
In a second terminal window, launch the frontend dev server (runs on `http://localhost:3000`):
```bash
npm run dev
```

---

## 3. Persona Switching & Live Simulation

SkillNexus includes a top-bar **Persona Switcher** dropdown in the header navbar so you can test both sides of a skill exchange in real time.

### Default Student Personas:
1. **Alex Chen** (CS Senior): Teaches *Python Programming* & *Data Structures*; wants *UI/UX Design* & *Conversational Spanish*.
2. **Maya Lin** (Design Junior): Teaches *UI/UX Design* & *Digital Illustration*; wants *Python Programming* & *Public Speaking*.
3. **Marcus Vance** (Linguistics): Teaches *Conversational Spanish* & *Public Speaking*; wants *Python Programming* & *Financial Modeling*.
4. **Elena Rostova** (AI Scholar): Teaches *Machine Learning & AI*; wants *Digital Illustration* & *Public Speaking*.
5. **Sam Rivera** (Film Student): Teaches *Video Editing* & *Guitar*; wants *UI/UX Design* & *Machine Learning*.
6. **System Admin Mode**: Moderator console for safety reports and skill catalog request approvals.

> **How to Test Reciprocal Exchange Flow**:
> 1. Select **Alex Chen** in the Persona Switcher.
> 2. Go to **Find Students** → Request Exchange with **Maya Lin**.
> 3. Open Persona Switcher → Switch persona to **Maya Lin**.
> 4. Go to **Exchanges** → Click **Accept Request**.
> 5. Enter the **Active Workspace**, check a milestone task, and send a message.

---

## 4. Detailed Feature Guide & User Flows

### A. Dashboard: Action Center
- Answers **"What should I do next?"** rather than showing passive graphs.
- **Action Needed Box**: Highlights pending exchange requests waiting for your decision, incomplete milestone goals due soon, and active workspaces.
- **Top Synergy Recommendation**: Displays your #1 mutual skill fit match.

### B. Discover Skills Catalog
- Browse categorized skill topics (Programming, AI, Design, Languages, Music, Business, STEM).
- Search by keyword or tag (e.g. `#Python`, `#Figma`, `#Spanish`).
- **Propose New Skill Topic**: Submit missing skills to community review.
- **Upvote Requested Topics**: Vote on topics proposed by other students.

### C. Find Compatible Student Peers
- View student directory with real-time **2-Way Synergy Compatibility Badges** (85%–100%).
- Filter by teach/learn skills, availability, format, and 100% 2-way mutual swap toggle.
- **Explainable Synergy Rationale**: Click the synergy badge to open the rationale drawer showing exactly why two students match (+45 pts 2-Way Swap, +25 pts Schedule, +15 pts Format, +15 pts Trust).
- **Request Exchange**: Send exchange proposals specifying offered skill, requested skill, format, hours/week, and reciprocal terms.

### D. Smart Mutual Synergy Engine
- Navigate to **Synergy Engine** to select any Student A and Student B from dropdowns and inspect live compatibility gauge calculations.

### E. Exchanges & Active Learning Workspace
- View all exchanges categorized by state: `Pending`, `Active`, `Paused`, `Completed`, `Declined`, `Cancelled`.
- **Active Exchange Workspace Room**:
  - **Milestone Checklist**: Shared task list where students check off joint learning goals.
  - **Session Coordinator**: Log completed study sessions (Date, Topic, Notes, and Jitsi Video Meeting link generator).
  - **Peer Chat & Notes**: Real-time context messaging interface.
  - **Safety Report Trigger**: Report unresponsiveness or safety concerns directly to platform moderators.

### F. Student Credibility Profile
- Edit bio, university, major, availability schedule, and preferred format.
- View verified credibility badges (*Master Peer Tutor*, *Verified Peer Scholar*, *Community Mentor*).
- Read verified peer review testimonials submitted after completed exchanges.

### G. Admin Moderation Console
- Accessible when switching active persona to **System Admin Mode**.
- Review open incident reports, issue warnings, or dismiss reports.
- Approve or reject community-requested skill topics.

---

## 5. Inspecting MongoDB via MongoDB Compass

All application state is saved directly in the `WEBCRAFT` database on MongoDB.

1. Open **MongoDB Compass**.
2. Connect to URI: `mongodb://localhost:27017`.
3. Open the **`WEBCRAFT`** database.
4. Inspect the collections:
   - **`users`**: User credentials, hashed passwords, teach/learn matrices, reputation scores.
   - **`skills`**: Skill topics catalog.
   - **`exchanges`**: Exchange lifecycle documents, milestones, session logs, feedback.
   - **`messages`**: Chat messages.
   - **`skillrequests`**: Community skill requests.
   - **`safetyreports`**: Moderation incident reports.

---

## 6. API Endpoints Architecture

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & DB health check status |
| `POST` | `/auth/register` | Register new student account |
| `POST` | `/auth/login` | Authenticate & return JWT token |
| `GET` | `/users` | List all student profiles |
| `GET` | `/users/:id/synergy` | Calculate 2-way synergy score relative to user |
| `PUT` | `/users/profile` | Update student profile |
| `GET` | `/skills` | Fetch skill catalog |
| `POST` | `/skills/request` | Submit new skill topic request |
| `POST` | `/skills/request/:id/upvote` | Upvote a requested topic |
| `GET` | `/exchanges` | Get user's exchanges |
| `POST` | `/exchanges` | Send exchange proposal |
| `PATCH` | `/exchanges/:id/status` | Transition exchange state |
| `POST` | `/exchanges/:id/milestones` | Add milestone goal task |
| `PATCH` | `/exchanges/:id/milestones/:mId` | Toggle milestone task completion |
| `POST` | `/exchanges/:id/sessions` | Log completed session |
| `POST` | `/exchanges/:id/feedback` | Submit verified peer review |
| `GET` | `/messages/exchange/:id` | Get chat messages for exchange |
| `POST` | `/messages` | Send chat message |
| `POST` | `/reports` | Submit safety report |
| `GET` | `/reports` | List open safety reports (Admin guard) |
