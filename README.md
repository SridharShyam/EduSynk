# 🎓 EduSynk — Peer-to-Peer Student Skill Exchange Platform

> **Empowering Students to Learn by Teaching.**  
> EduSynk is a zero-cost, reciprocal peer-to-peer knowledge network that connects students to exchange academic and technical skills directly with fellow campus learners.

---

## 📌 Problem Statement (PS)

In modern higher education and self-driven learning environments, students face significant barriers when attempting to master new skills or overcome complex subject challenges:

1. **High Cost of Premium Tutoring & Courses**: Paid online courses, private bootcamps, and professional tutoring are financially prohibitive for many university students.
2. **Passive Learning Bottlenecks**: Traditional video courses lack interactive feedback, real-time code reviews, or bilateral accountability.
3. **Unutilized Campus Talent**: Millions of students possess high proficiency in specific domains (e.g., Python, Graphic Design, Web Development, Calculus) but lack a platform to trade their expertise for skills they need to learn (e.g., UI/UX, Data Science, Public Speaking).
4. **Asymmetric Skill Matching**: Finding another student who specifically needs what you teach *and* offers what you want to learn is nearly impossible through manual networking or bulletin boards.

---

## 💡 The Solution

**EduSynk** solves these challenges by introducing a **Bilateral Reciprocal Skill Exchange Engine**. Instead of relying on monetary transactions, EduSynk operates on a **peer skill barter system**:

- **Give & Take Dynamic**: A student who excels at **Python Programming** but wants to learn **UI/UX Design** is automatically paired with a student who excels at **UI/UX Design** and wants to learn **Python**.
- **Interactive Collaborative Workspaces**: Integrated exchange boards feature real-time video call integrations, shared code/design document pads, session progress trackers, and structured milestone logs.
- **AI-Powered Mentor Support**: When both peers hit a blocker during a session, **EduSynk AI Assistant** steps in to provide instant code debugging, concept breakdowns, and project suggestions.

---

## 🚀 Novelty & Unique Features

EduSynk introduces several innovative features that distinguish it from conventional EdTech platforms:

### 1. ⚡ Synergy Match Engine™ (Bi-Directional Barter Algorithm)
Unlike traditional search engines that require manual filtering, EduSynk’s proprietary algorithm calculates a **Synergy Match Score** (0–100%) between any two students based on:
- Complementary **Skills Offered** vs. **Skills Requested**.
- Target proficiency levels (Beginner, Intermediate, Advanced).
- Learning goals, availability schedules, and preferred exchange pace.

### 2. 🤖 Dual-Engine AI Learning Companion
EduSynk integrates an adaptive AI assistant that supports both live peer interactions and self-study:
- **Instant Code & Concept Debugging**: Ask technical questions directly within the chat or exchange workspace.
- **Failover Resiliency**: Features a built-in offline knowledge-base fallback ensuring uninterrupted assistance even if external APIs experience downtime.

### 3. 🎯 Micro-Milestone Session Tracking
Skill exchanges are structured into actionable sessions:
- Peer partners set clear objectives for each meet-up (e.g., *"Session 1: Building a REST API with FastAPI"*).
- Dual sign-off mechanisms ensure both students complete their teaching and learning commitments fairly.

### 4. 🛡️ Trust & Peer Verification System
- **Verified Endorsements**: Peer-reviewed ratings and badges awarded after successful skill exchanges build an authentic skill transcript for every student.
- **Safety & Reporting Tools**: Built-in moderation options allow students to maintain a safe, inclusive campus learning environment.

---

## 🏗️ Technical Architecture & Stack

EduSynk is built with a modern, high-performance full-stack architecture:

```
                  ┌─────────────────────────────────────┐
                  │          React + Vite Frontend      │
                  │   (Vanilla CSS Design System)       │
                  └──────────────────┬──────────────────┘
                                     │ REST API
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       FastAPI Python Backend        │
                  │     (Async Engine + Pydantic v2)    │
                  └──────────┬──────────────────┬───────┘
                             │                  │
                             ▼                  ▼
              ┌──────────────────────┐  ┌──────────────────────┐
              │  MongoDB Database    │  │  EduSynk AI Engine   │
              │   (Async Motor Driver) │  │  (Hybrid AI + Fallback)│
              └──────────────────────┘  └──────────────────────┘
```

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Modern glassmorphic dark/light design system).
- **Backend**: Python 3.13, FastAPI, Motor (Async MongoDB), PyJWT authentication, Passlib/Bcrypt.
- **Database**: MongoDB (`WEBCRAFT` database instance).

---

## 💻 Quick Start & Local Setup

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** running locally on port `27017`

### 1. Clone the Repository
```bash
git clone https://github.com/SridharShyam/EduSynk.git
cd EduSynk
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*The FastAPI backend will start live at `http://localhost:5000` (API documentation at `http://localhost:5000/docs`).*

### 3. Frontend Setup
In a new terminal window:
```bash
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser to access EduSynk.*

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
