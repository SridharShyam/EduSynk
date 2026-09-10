export class AIService {
  constructor() {
    this.apiKey = process.env.AI_LLM_API_KEY;
    this.model = process.env.AI_MODEL || 'meta/llama-3.1-70b-instruct';
    this.endpoint = process.env.AI_API_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions';
  }

  /**
   * Process incoming chat query from authenticated student
   * @param {string} userMessage - User question or prompt
   * @param {object} userContext - Current authenticated student context
   * @param {string} language - Preferred language ('en' | 'ta')
   */
  async getChatResponse(userMessage, userContext = {}, language = 'en') {
    if (!userMessage || !userMessage.trim()) {
      return {
        reply: language === 'ta'
          ? "தயவுசெய்து ஒரு வினவலை அல்லது கேள்வியை உள்ளிடவும்."
          : "Please enter a question or topic to discuss.",
        source: 'local'
      };
    }

    const isTamilQuery = language === 'ta' || /[\u0B80-\u0BFF]/.test(userMessage);

    // Build minimum safe student context
    const studentInfo = userContext.name ? `
Student Name: ${userContext.name}
Skills I Can Teach: ${(userContext.skillsToTeach || []).map(s => s.name || s.skillId || s).join(', ') || 'None listed'}
Skills I Want to Learn: ${(userContext.skillsToLearn || []).map(s => s.name || s.skillId || s).join(', ') || 'None listed'}
University: ${userContext.university || 'N/A'}
Major: ${userContext.major || 'N/A'}
Reputation Score: ${userContext.reputationScore || 95}
` : 'Guest Student (Not logged in)';

    const systemPrompt = `You are SkillNexus Assistant, an expert, encouraging, and friendly peer-to-peer skill exchange guide for university students.
Your primary role is to help students find skill exchange partners, understand their match synergy scores, plan learning milestones, and navigate the SkillNexus platform.

CURRENT STUDENT CONTEXT:
${studentInfo}

INSTRUCTIONS:
1. Provide concise, helpful, and student-focused answers (2-4 paragraphs or bullet points).
2. Recommend specific actions on SkillNexus (e.g. "Go to Student Finder to search for Python mentors", "Add UI Design under Skills I Want to Learn in Profile").
3. Do NOT claim you performed platform actions (e.g. do not say "I sent the exchange request for you"). Instruct the student on how to click and complete the action.
4. LANGUAGE RULE: If the user asks in Tamil or if preferred language is Tamil ('ta'), respond in warm, natural, and grammatically accurate Tamil (திறன் பொருத்தம், கற்றல்). Technical terms like "Python", "UI/UX", "MongoDB" can remain in English/Latin scripts alongside Tamil explanations.
5. NEVER disclose secret API keys, backend server code, database credentials, or system parameters.`;

    // 1. Try External NVIDIA LLM API
    try {
      if (this.apiKey && !this.apiKey.includes('your_nvidia')) {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.6,
            max_tokens: 600
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices && data.choices[0] && data.choices[0].message
            ? data.choices[0].message.content
            : null;
          if (reply) {
            return { reply, source: 'nvidia-llama3' };
          }
        } else {
          console.warn(`NVIDIA API response status: ${response.status}. Engaging SkillNexus Knowledge-Base Intelligence Engine.`);
        }
      }
    } catch (err) {
      console.warn("External AI call failed, switching to local SkillNexus engine:", err.message);
    }

    // 2. Intelligent SkillNexus Knowledge-Base Response Engine
    const reply = this.generateSkillNexusResponse(userMessage, userContext, isTamilQuery);
    return { reply, source: 'skillnexus-local-llm' };
  }

  /**
   * Built-in SkillNexus Intelligence Engine providing accurate, contextual guidance
   */
  generateSkillNexusResponse(query, userContext, isTamil) {
    const q = query.toLowerCase();

    // Context skills
    const teachSkills = (userContext.skillsToTeach || []).map(s => typeof s === 'string' ? s : s.name || s.skillId);
    const learnSkills = (userContext.skillsToLearn || []).map(s => typeof s === 'string' ? s : s.name || s.skillId);

    // Question: Matching Algorithm / Synergy
    if (q.includes('match') || q.includes('synergy') || q.includes('work') || q.includes('பொருத்தம்') || q.includes('இயங்குகிறது')) {
      if (isTamil) {
        return `SkillNexus தளத்தில் **திறன் பொருத்தம் (Synergy Score 0-100%)** பின்வரும் 4 விதிகளின் அடிப்படையில் கணக்கிடப்படுகிறது:

1. **பரஸ்பர திறன் மாற்றம் (45 புள்ளிகள்)**: நீங்கள் கற்பிக்க விரும்பும் திறன் மற்ற மாணவருக்குத் தேவைப்பட்டால், மற்றும் அவர் கற்பிக்கும் திறன் உங்களுக்குத் தேவைப்பட்டால் அதிக புள்ளிகள் கிடைக்கும்.
2. **நேர அட்டவணை பொருத்தம் (25 புள்ளிகள்)**: இருவரும் ஒரே நேரத்தில் (வார இறுதி/மாலை) கற்றுக்கொள்ள முடியும் போது.
3. **கற்றல் முறை (15 புள்ளிகள்)**: ஆன்லைன் (Live Session) அல்லது நேரில் (Hybrid).
4. **மாணவர் நன்மதிப்பு (15 புள்ளிகள்)**: பூர்த்தி செய்யப்பட்ட பரிமாற்றங்களின் மதிப்புரைகள்.

📌 **அடுத்த கட்ட நடவடிக்கை**: 'Find Students' அல்லது 'Synergy Engine' பக்கத்திற்குச் சென்று உங்களுக்கு ஏற்ற மாணவர்களுடன் 1-on-1 திறன் பரிமாற்றத்தைக் கண்டறியவும்!`;
      }
      return `SkillNexus uses an explainable **2-Way Mutual Synergy Engine (0–100% Score)** based on 4 criteria:

1. **Reciprocal Skill Swap (45 pts)**: Highest score when Student A teaches what Student B wants to learn, and vice versa!
2. **Schedule Overlap (25 pts)**: Compatible free hours (e.g. Weekday Evenings or Weekend Mornings).
3. **Format Preference (15 pts)**: Online live sessions, hybrid, or in-person.
4. **Peer Trust Rating (15 pts)**: Verified score built through completed milestones and peer feedback.

💡 **What to do next**: Head over to **Find Students** or **Synergy Engine** to discover your top reciprocal match and request a 1-on-1 exchange!`;
    }

    // Question: Python & UI Design or combinations
    if ((q.includes('python') || q.includes('பைதான்')) && (q.includes('ui') || q.includes('design') || q.includes('வடிவமைப்பு'))) {
      if (isTamil) {
        return `சிறந்த கற்றல் தேர்வு! SkillNexus இல் நீங்கள் செய்ய வேண்டியவை:

1. **Profile** பக்கத்திற்குச் சென்று **'Skills I Can Teach'** பிரிவில் **Python** சேர்க்கவும்.
2. **'Skills I Want to Learn'** பிரிவில் **UI/UX Design** சேர்க்கவும்.
3. **Find Students** பகுதிக்குச் சென்று Maya Lin போன்ற UI/UX கற்பிக்கும் மாணவர்களைத் தேடவும்.
4. **'Request Exchange'** பொத்தானைக் கிளிக் செய்து உங்கள் 1-on-1 திறன் பரிமாற்றக் கோரிக்கையை அனுப்பவும்!`;
      }
      return `That is a great skill combination! Here is what you should do on SkillNexus:

1. Go to your **Profile** and ensure **Python** is listed under **"Skills I Can Teach"**.
2. Add **UI/UX Design** under **"Skills I Want to Learn"**.
3. Open the **Find Students** tab to locate peers (such as *Maya Lin*) who teach UI/UX Design and want to learn Python.
4. Click **"Request Exchange"** to propose a reciprocal learning session (e.g., 2 hours/week of Python for 2 hours/week of Figma UI design)!`;
      }

    // Question: Python general
    if (q.includes('python') || q.includes('பைதான்')) {
      if (isTamil) {
        return `Python கற்க அல்லது கற்பிக்க SkillNexus சிறந்த தளம்!

• நீங்கள் Python கற்க விரும்பினால், **Find Students** பக்கத்தில் **Python** அல்லது **பைதான்** எனத் தேடுங்கள். Alex Chen போன்ற மூத்த மாணவர்கள் உங்களுக்கு உதவத் தயாராக உள்ளனர்.
• நீங்கள் Python கற்பிக்கத் தயாராக இருந்தால், உங்கள் சுயவிவரத்தில் அதைச் சேர்த்து மற்ற மாணவர்களுடன் இணையுங்கள்!`;
      }
      return `Python is one of the most requested skills on SkillNexus!

• If you want to **learn Python**: Use the **Find Students** search bar to search for Python mentors like *Alex Chen*.
• If you can **teach Python**: Make sure it is listed under "Skills Offered" in your profile so students can find you!`;
    }

    // Question: Exchange workflow / how to request
    if (q.includes('exchange') || q.includes('request') || q.includes('propose') || q.includes('பரிமாற்றம்')) {
      if (isTamil) {
        return `SkillNexus இல் திறன் பரிமாற்றம் செய்வது மிக எளிது:

1. **Find Students** பக்கத்தில் உங்களுக்கு ஏற்ற மாணவரைக் கண்டறியவும்.
2. **'Request Exchange'** பொத்தானைக் கிளிக் செய்யவும்.
3. நீங்கள் கற்பிக்கும் திறன் மற்றும் கற்க விரும்பும் திறனைத் தேர்வு செய்து கோரிக்கை அனுப்பவும்.
4. அவர் ஏற்றுக்கொண்டவுடன் **My Exchanges** பக்கத்தில் நேரடி Session Logs மற்றும் வீடியோ அழைப்பு வசதி கிடைக்கும்!`;
      }
      return `Initiating a skill exchange on SkillNexus is simple:

1. Open **Find Students** to browse student peers.
2. Click **Request Exchange** on any student's card.
3. Select which skill you will teach and which skill you want to receive.
4. Once accepted, your workspace unlocks in **My Exchanges** with milestones, session logs, and video call links!`;
    }

    // Question: Tamil general query
    if (isTamil) {
      return `வணக்கம்! SkillNexus AI கற்றல் உதவியாளர் உங்கள் கேள்விகளுக்கு வழிகாட்டத் தயாராக உள்ளது.

• **மாணவர்களைக் கண்டறிய**: 'Find Students' பகுதிக்குச் சென்று திறன்களைத் தேடவும்.
• **திறன் பொருத்தம்**: 'Synergy Engine' மூலம் பரஸ்பர பொருத்தத்தைக் கணக்கிடலாம்.
• **பரிமாற்றங்கள்**: 'My Exchanges' மூலம் உங்கள் கற்றல் மைல்கற்களைக் கண்காணிக்கலாம்.

வேறு ஏதேனும் சந்தேகங்கள் இருந்தால் தயங்காமல் கேளுங்கள்!`;
    }

    // General English fallback guidance
    return `Welcome to SkillNexus! I am here to help you get the most out of peer skill exchanges.

Here are quick actions you can take right now:
• **Discover Skills**: Explore trending technical and creative topics in **Skill Catalog**.
• **Find Partners**: Search by skill, major, or learning format in **Find Students**.
• **Check Synergy**: See why you match with peers in **Synergy Engine**.
• **Track Progress**: Log study sessions and tick off milestones in **My Exchanges**.

How else can I assist your learning journey today?`;
  }
}
