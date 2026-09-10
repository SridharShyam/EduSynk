# EduSynk — Comprehensive Application Usage Guide

Welcome to **EduSynk**, the peer-to-peer student skill exchange platform where students teach what they already know and learn new skills from fellow peers in a structured, reciprocal, and ethical ecosystem.

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
- **Python**: v3.10 or higher (`python --version`)
- **Node.js**: v18.0.0 or higher (`node -v`)
- **MongoDB**: Community Server running locally on `mongodb://127.0.0.1:27017`

### Step 1: Install Python Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### Step 2: Launch Python FastAPI Backend Server
Start the backend server (runs on `http://localhost:5000`):
```bash
python backend/run.py
```

### Step 3: Launch Vite Frontend Dev Server
In a second terminal window, launch the frontend dev server (runs on `http://localhost:3000`):
```bash
npm run dev
```

---

## 3. Persona Switching & Live Simulation

EduSynk includes a top-bar **Persona Switcher** dropdown in the header navbar so you can test both sides of a skill exchange in real time.

### Default Student Personas:
1. **Alex Chen** (CS Senior): Teaches *Python Programming* & *Data Structures*; wants *UI/UX Design*.
2. **Maya Lin** (Design Junior): Teaches *UI/UX Design* & *Digital Illustration*; wants *Python Programming*.
3. **Marcus Vance** (Linguistics): Teaches *Public Speaking*; wants *Python Programming*.
4. **Elena Rostova** (AI Scholar): Teaches *Machine Learning & AI*; wants *Digital Illustration*.
5. **Sam Rivera** (Film Student): Teaches *Video Editing*; wants *UI/UX Design*.
6. **System Admin Mode**: Moderator console for safety reports and skill catalog moderation.

> **How to Test Reciprocal Exchange Flow**:
> 1. Select **Alex Chen** in the Persona Switcher.
> 2. Go to **Find Students** $\rightarrow$ Request Exchange with **Maya Lin**.
> 3. Open Persona Switcher $\rightarrow$ Switch persona to **Maya Lin**.
> 4. Go to **Exchanges** $\rightarrow$ Click **Accept Request**.
> 5. Enter the **Active Workspace**, log a study session, and send a message.

---

## 4. Detailed Feature Guide & User Flows

### A. Dashboard: Action Center
- Answers **"What should I do next?"** rather than showing passive graphs.
- **Action Needed Box**: Highlights pending exchange requests waiting for your decision, incomplete milestone goals due soon, and active workspaces.
- **Top Synergy Recommendation**: Displays your #1 mutual skill fit match.

### B. Discover Skills Catalog
- Browse categorized skill topics (Programming, AI, Design, Languages, Music, Business, STEM).
- Search by keyword or tag (e.g. `#Python`, `#Figma`).

### C. Find Compatible Student Peers
- View student directory with real-time **2-Way Synergy Compatibility Badges** (85%–100%).
- Filter by teach/learn skills, availability, format, and 100% 2-way mutual swap toggle.
- **Explainable Synergy Rationale**: Click the synergy badge to open the rationale drawer showing exactly why two students match (+45 pts 2-Way Swap, +25 pts Schedule, +15 pts Format, +15 pts Trust).
- **Request Exchange**: Send exchange proposals specifying offered skill, requested skill, format, and reciprocal terms.

### D. Smart Mutual Synergy Engine
- Navigate to **Synergy Engine** to select any Student A and Student B from dropdowns and inspect live compatibility gauge calculations.

### E. Exchanges & Active Learning Workspace
- View all exchanges categorized by state: `pending`, `active`, `completed`, `declined`, `cancelled`.
- **Active Exchange Workspace Room**:
  - **Milestone Checklist**: Shared task list where students check off joint learning goals.
  - **Session Coordinator**: Log completed study sessions (Date, Topic, Duration, Notes).
  - **Peer Notes**: Context notes interface.

---

## 5. Inspecting MongoDB via MongoDB Compass

All application state is saved directly in the `WEBCRAFT` database on MongoDB.

1. Open **MongoDB Compass**.
2. Connect to URI: `mongodb://127.0.0.1:27017`.
3. Open the **`WEBCRAFT`** database.
4. Inspect the collections:
   - **`users`**: User credentials, hashed passwords, teach/learn matrices, reputation scores.
   - **`skills`**: Skill topics catalog.
   - **`exchanges`**: Exchange lifecycle documents, milestones, session logs, feedback.
   - **`sessions`**: Logged study session records.
   - **`reviews`**: Peer reviews and ratings.

---

## 6. API Endpoints Architecture

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & DB health check status |
| `POST` | `/auth/register` | Register new student account |
| `POST` | `/auth/login` | Authenticate & return JWT token |
| `GET` | `/users` | List all student profiles |
| `POST` | `/synergy/calculate` | Calculate 2-way synergy score relative to user |
| `GET` | `/skills` | Fetch skill catalog |
| `GET` | `/search` | 300ms debounced search engine |
| `GET` | `/exchanges` | Get user's exchanges |
| `POST` | `/exchanges` | Send exchange proposal |
| `PUT` | `/exchanges/{id}/status` | Transition exchange state |
| `POST` | `/sessions` | Log completed study session |
| `POST` | `/reviews` | Submit verified peer review |
| `POST` | `/ai/chat` | Dual-Engine AI Assistant chatbot |
