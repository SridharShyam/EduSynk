# EduSynk — AI Assistant Cross-Validation Audit Report

**Audit Date**: September 10, 2026  
**Application Layer**: AI Assistant & Context Engine  
**System Target**: EduSynk Peer-to-Peer Student Skill Exchange Platform  
**Audit Scope**: Architecture, Security, Prompt Context Boundaries, Fallback Intelligence, and Hallucination Protection.

---

## 1. Executive Summary

The **AI Assistant Subsystem** in EduSynk operates as an intelligent learning guide designed to help university students navigate 1-on-1 peer skill exchanges, explain mutual synergy match scores, and create learning roadmaps. 

The cross-validation audit confirms that the AI subsystem implements a **resilient Dual-Engine Architecture**. If the external LLM provider endpoint is unreachable or returns an API error (e.g. NVIDIA API model `meta/llama-3.1-70b-instruct` returning `410 Gone`), the backend seamlessly fails over to the built-in **EduSynk Knowledge-Base Intelligence Engine** (`edusynk-local-llm`). 

The subsystem complies with key security directives: no API keys are exposed to the client bundle, minimum safe student context is injected into prompts, and the assistant never makes false claims of performing server state mutations.

---

## 2. Architecture & Data Flow Cross-Layer Trace

```text
Student (Chatbot UI)
       │
       ▼ [POST /api/v1/ai/chat] { message, userContext }
FastAPI Router (app/api/v1/endpoints/ai.py)
       │
       ▼ Request Body Validation
Service Layer (app/services/ai_service.py)
       │
  ┌────┴────────────────────────────────────────┐
  │ 1. External NVIDIA Llama 3.1 LLM Endpoint   │
  │    (https://integrate.api.nvidia.com/v1)    │
  └────┬────────────────────────────────────────┘
       │
       ├──────► [SUCCESS] ────► Return { reply, source: 'nvidia-llama3' }
       │
       └──────► [FAIL / 410 / NO KEY]
               │
               ▼
  ┌─────────────────────────────────────────────┐
  │ 2. Built-in EduSynk Intelligence Engine     │
  │    (Rules-based Knowledge-Base)            │
  └────────────┬────────────────────────────────┘
               │
               ▼
    Return { reply, source: 'edusynk-local-llm' }
               │
               ▼
Client Frontend State (AIChatWidget.jsx) ──► UI Chat Window
```

---

## 3. Deep-Dive Audit Findings

### 3.1 AI API Key Security & Secret Leakage Audit
- **Location**: [`backend/app/core/config.py`](file:///c:/Users/shyam/Documents/WEBCRAFT/backend/app/core/config.py) & [`.env`](file:///c:/Users/shyam/Documents/WEBCRAFT/.env)
- **Status**: **PASS (CONFIRMED)**
- **Audit Details**:
  - `AI_LLM_API_KEY` is loaded exclusively inside Python backend process memory via `dotenv`.
  - Frontend bundle inspect (`dist/assets/index-*.js`) verified zero occurrences of `nvapi-` secrets or raw API tokens.
  - HTTP network inspect verified client calls only connect to local `/api/v1/ai/chat` endpoint using standard app JSON headers.

### 3.2 Context Construction & Student Privacy Boundary
- **Location**: [`backend/app/services/ai_service.py`](file:///c:/Users/shyam/Documents/WEBCRAFT/backend/app/services/ai_service.py)
- **Status**: **PASS (CONFIRMED)**
- **Audit Details**:
  - **Injected Context**: Only minimal, non-sensitive student metadata is passed into system prompts:
    - Student Name
    - University & Major
    - Skills Offered (`skillsToTeach`)
    - Skills Desired (`skillsToLearn`)
    - Peer Reputation Score
  - **Sanitization Guard**: Passwords, bcrypt hashes, JWT tokens, private chat messages, and database IDs are explicitly excluded from prompt payload construction.

### 3.3 External LLM Fallback & Graceful Degradation
- **Location**: [`backend/app/services/ai_service.py`](file:///c:/Users/shyam/Documents/WEBCRAFT/backend/app/services/ai_service.py)
- **Status**: **PASS (CONFIRMED)**
- **Audit Details**:
  - Tested external NVIDIA API model deprecation (`meta/llama-3.1-70b-instruct` returning HTTP 410).
  - Python backend caught HTTP error without crashing the Uvicorn worker process, logged warning, and returned status 200 with structured JSON response `{ reply, source: 'edusynk-local-llm' }`.
  - Chatbot UI rendered instant answer without user-facing breakdown or spinning loaders.

---

## 4. Verification Matrix

- [x] External AI call failure does not crash FastAPI backend.
- [x] API key absent from browser DOM, network payloads, and bundle.
- [x] Context payload excludes sensitive student credentials.
- [x] Assistant provides accurate explanation of 4-part Synergy Matching formula.
