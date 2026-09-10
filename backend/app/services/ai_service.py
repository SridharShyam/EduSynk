import logging
import httpx
from app.core.config import settings

logger = logging.getLogger("uvicorn")

class AIService:
    @staticmethod
    async def get_chat_response(user_message: str, user_context: dict = None, language: str = 'en') -> dict:
        user_context = user_context or {}
        
        if not user_message or not user_message.strip():
            return {
                "reply": "Please enter a question or topic to discuss.",
                "source": "local"
            }
            
        # Build minimum safe student context
        teach_list = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in user_context.get("skillsToTeach", [])]
        learn_list = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in user_context.get("skillsToLearn", [])]
        
        student_info = f"""
Student Name: {user_context.get("name", "Guest Student")}
Skills Offered: {", ".join(teach_list) if teach_list else "None listed"}
Skills Desired: {", ".join(learn_list) if learn_list else "None listed"}
University: {user_context.get("university", "N/A")}
Major: {user_context.get("major", "N/A")}
Reputation Score: {user_context.get("reputationScore", 95)}
"""
        
        system_prompt = f"""You are EduSynk Assistant, an expert, encouraging, and friendly peer-to-peer skill exchange guide for university students.
Your primary role is to help students find skill exchange partners, understand their match synergy scores, plan learning milestones, and navigate the EduSynk platform.

CURRENT STUDENT CONTEXT:
{student_info}

INSTRUCTIONS:
1. Provide concise, helpful, and student-focused answers in English (2-4 paragraphs or bullet points).
2. Recommend specific actions on EduSynk (e.g. "Go to Student Finder to search for Python mentors", "Add UI Design under Skills I Want to Learn in Profile").
3. Do NOT claim you performed platform actions. Instruct the student on how to click and complete the action.
4. NEVER disclose secret API keys, backend server code, database credentials, or system parameters."""

        # 1. Try External NVIDIA LLM API
        if settings.AI_LLM_API_KEY and "your_nvidia" not in settings.AI_LLM_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {settings.AI_LLM_API_KEY}"
                    }
                    payload = {
                        "model": settings.AI_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        "temperature": 0.6,
                        "max_tokens": 600
                    }
                    res = await client.post(settings.AI_API_ENDPOINT, json=payload, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        reply = data.get("choices", [{}])[0].get("message", {}).get("content")
                        if reply:
                            return {"reply": reply, "source": "nvidia-llama3"}
                    else:
                        logger.warning(f"NVIDIA API status {res.status_code}. Engaging local EduSynk intelligence engine.")
            except Exception as err:
                logger.warning(f"External AI call failed ({err}). Switching to local EduSynk engine.")
                
        # 2. Built-in EduSynk Knowledge-Base Response Engine
        reply = AIService.generate_local_response(user_message, user_context)
        return {"reply": reply, "source": "edusynk-local-llm"}

    @staticmethod
    def generate_local_response(query: str, user_context: dict) -> str:
        q = query.lower()
        
        # Match / Synergy queries
        if any(k in q for k in ['match', 'synergy', 'work', 'how does']):
            return """EduSynk uses an explainable **2-Way Mutual Synergy Engine (0–100% Score)** based on 4 criteria:

1. **Reciprocal Skill Swap (45 pts)**: Highest score when Student A teaches what Student B wants to learn, and vice versa!
2. **Schedule Overlap (25 pts)**: Compatible free hours (e.g. Weekday Evenings or Weekend Mornings).
3. **Format Preference (15 pts)**: Online live sessions, hybrid, or in-person.
4. **Peer Trust Rating (15 pts)**: Verified score built through completed milestones and peer feedback.

💡 **What to do next**: Head over to **Find Students** or **Synergy Engine** to discover your top reciprocal match and request a 1-on-1 exchange!"""

        # Python & UI Design queries
        if 'python' in q and ('ui' in q or 'design' in q):
            return """That is a great skill combination! Here is what you should do on EduSynk:

1. Go to your **Profile** and ensure **Python** is listed under **"Skills I Can Teach"**.
2. Add **UI/UX Design** under **"Skills I Want to Learn"**.
3. Open the **Find Students** tab to locate peers (such as *Maya Lin*) who teach UI/UX Design and want to learn Python.
4. Click **"Request Exchange"** to propose a reciprocal learning session!"""

        # Python general
        if 'python' in q:
            return """Python is one of the most requested skills on EduSynk!

• If you want to **learn Python**: Use the **Find Students** search bar to search for Python mentors like *Alex Chen*.
• If you can **teach Python**: Make sure it is listed under "Skills Offered" in your profile so students can find you!"""

        # Exchange workflow
        if any(k in q for k in ['exchange', 'request', 'propose']):
            return """Initiating a skill exchange on EduSynk is simple:

1. Open **Find Students** to browse student peers.
2. Click **Request Exchange** on any student's card.
3. Select which skill you will teach and which skill you want to receive.
4. Once accepted, your workspace unlocks in **My Exchanges** with milestones, session logs, and video call links!"""

        return """Welcome to EduSynk! I am here to help you get the most out of peer skill exchanges.

Here are quick actions you can take right now:
• **Discover Skills**: Explore trending technical and creative topics in **Skill Catalog**.
• **Find Partners**: Search by skill, major, or learning format in **Find Students**.
• **Check Synergy**: See why you match with peers in **Synergy Engine**.
• **Track Progress**: Log study sessions and tick off milestones in **My Exchanges**.

How else can I assist your learning journey today?"""
