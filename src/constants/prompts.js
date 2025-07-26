export const DEFAULT_ANALYSIS_PROMPT = "Based on these Reddit comments, provide a comprehensive profile of the user. Identify their primary interests and the most recurring themes or subjects they engage with. What insights do these patterns provide about their perspectives, values, or areas of expertise? Describe the overall online persona they project and their characteristic communication style. Finally, analyze their typical engagement and interaction patterns within discussions (e.g., asking questions, offering advice, debating, sharing experiences)."

export const PROMPT_DEFINITIONS = {
  findDirt: `You are a seasoned private detective, tasked with compiling a confidential dossier on a subject based solely on their Reddit comments. Your objective is to uncover any patterns of behavior, strong or controversial opinions, inconsistencies, or potentially problematic interactions that could be considered "dirt" or red flags from an objective, investigative standpoint.

Present your findings in a formal, structured private detective report.

**Confidential Dossier: Reddit User Analysis**

**Subject:** [Infer Username from context, or state "Reddit User"]

**Case Objective:** Identify and document any concerning, controversial, or inconsistent aspects of the Subject's online persona as revealed through their Reddit comments.

**Methodology:** Comprehensive review of provided comment data, focusing on:
- Recurring themes and obsessions.
- Extreme or divisive opinions (political, social, ethical, etc.).
- Aggressive, hostile, or uncivil communication patterns.
- Inconsistencies or contradictions in stated beliefs or facts.
- Engagement with sensitive or controversial topics.
- Signs of negativity, cynicism, or a confrontational attitude.
- Any language that could be interpreted as discriminatory, hateful, or promoting misinformation.

**Findings:**

**1. Behavioral Patterns & Communication Style:**
   - Describe the Subject's typical tone (e.g., sarcastic, aggressive, overly positive, dismissive).
   - Note any tendencies towards personal attacks, excessive negativity, or argumentative behavior.
   - Are there signs of obsessive posting or engagement in specific topics?

**2. Controversial Stances & Strong Opinions:**
   - Detail any strong, divisive opinions expressed on politics, social issues, religion, or other sensitive topics. Provide specific examples or paraphrases.
   - Are there any views that could be considered extreme or outside mainstream consensus?

**3. Inconsistencies & Contradictions:**
   - Point out any instances where the Subject's statements or beliefs appear to contradict themselves over time or across different contexts.

**4. Engagement with Sensitive Topics:**
   - How does the Subject handle discussions on highly charged or controversial subjects? Do they escalate, de-escalate, or avoid?
   - Are there any comments that could be interpreted as insensitive, prejudiced, or promoting harmful stereotypes?

**5. Red Flags & Potential Concerns:**
   - Summarize any other patterns or specific comments that raise an eyebrow from an investigative perspective (e.g., signs of paranoia, conspiracy theories, unusual fixations, or hints of illegal/unethical activities if explicitly mentioned).

**Overall Assessment:**
Provide a concise summary of the Subject's "dirt" profile. What is the most significant takeaway from this investigation? What are the primary risks or negative perceptions associated with this online persona?

**Disclaimer:** This report is based solely on the provided text data and does not constitute a definitive judgment of the Subject's real-world character or actions. All findings are interpretations of online expressions.`,

  comprehensiveProfile: `Based on these Reddit comments, provide a comprehensive profile of the user. Identify their primary interests, hobbies, and potential professional fields based on the topics they frequently discuss. Infer potential demographic information (e.g., age range, gender, location) if the data provides sufficient clues, but state clearly if these are speculative. Describe their general worldview or philosophy based on recurring themes.`,

  topInterests: `What are the user's top 5 primary interests or areas of expertise, ranked by frequency and depth of engagement? For each, provide specific examples of comments or subreddits that demonstrate this interest/expertise.`,

  coreValues: `Analyze the user's comments to identify their core values, beliefs, or perspectives. Do they express strong opinions on social, political, ethical, or environmental issues? How do these values manifest in their discussions and interactions?`,

  onlinePersona: `Synthesize the findings into an overall online persona. How might a stranger perceive this user based solely on their Reddit comments? Is their persona consistent across different subreddits, or do they adapt their style and tone depending on the community?`,

  interactionPatterns: `Describe the user's typical engagement and interaction patterns within discussions. Do they primarily ask questions, offer advice, debate, share personal experiences, provide factual information, or express opinions? Are they more reactive or proactive in starting discussions? How do they respond to disagreement or criticism?`,

  controversialTopics: `How does the user engage with controversial or sensitive topics? Do they avoid them, engage respectfully, become confrontational, or try to mediate? Provide examples of their approach.`,

  religiousSleuth: `You are an expert analyst specializing in socio-religious profiling, tasked with conducting a deep dive into the subject's Reddit comments to uncover any and all indications of their religious or spiritual beliefs, affiliations, and their stance on religion-related issues.

Present your findings in a structured "Religious Dossier" report.

**Confidential Religious Dossier: Reddit User Analysis**

**Subject:** [Infer Username from context, or state "Reddit User"]

**Case Objective:** To thoroughly assess the Subject's religious and spiritual landscape, including explicit and implicit beliefs, potential denominational leanings, and engagement with religious topics.

**Methodology:** Comprehensive review of provided comment data, focusing on:
- Direct mentions of religious texts, figures, practices, or beliefs.
- Participation in religious or spiritual subreddits.
- Expression of values, ethics, or worldview that align with specific religious doctrines.
- Discussion of holidays, rituals, or cultural practices with religious roots.
- Tone and frequency of engagement with religious topics (e.g., devout, critical, questioning, academic, indifferent).

**Findings:**

**1. Overall Religious/Spiritual Stance:**
   - Does the user appear to be religious, spiritual, atheist, agnostic, or indifferent? Provide a general assessment.
   - Is there evidence of a specific faith or a more generalized spirituality?

**2. Potential Denominational Leanings/Affiliations:**
   - Based on language, specific beliefs expressed, or subreddits frequented, can you infer any specific denominational leanings (e.g., Catholic, Evangelical Protestant, Mainline Protestant, Orthodox, Jewish, Muslim, Buddhist, Hindu, etc.)? State clearly if this is speculative.
   - Are there any signs of a non-denominational Christian stance, or a syncretic approach to spirituality?

**3. Engagement with Specific Religious Issues:**
   - Analyze the user's comments on the following issues, noting their stance and any religious justifications or influences:
     - **Social Issues:** Abortion, LGBTQ+ rights, gender roles, social justice, poverty, charity.
     - **Ethical Issues:** Morality, sin, forgiveness, personal conduct, honesty.
     - **Scientific/Philosophical Issues:** Creationism vs. evolution, afterlife, purpose of life, suffering, free will.
     - **Interfaith/Intercultural Dialogue:** Views on other religions, religious pluralism, secularism.
   - Provide specific examples or paraphrases of comments that illustrate their views on these issues.

**4. Depth and Consistency of Belief:**
   - How deeply do religious or spiritual themes permeate their discussions? Are they central or peripheral?
   - Is their stance consistent across different contexts or over time (if applicable)?
   - Do they engage in theological discussions, or more practical applications of faith?

**5. Red Flags / Areas of Note (from a religious perspective):**
   - Are there any comments that could be interpreted as proselytizing, dogmatic, judgmental, or intolerant towards other beliefs?
   - Conversely, are there signs of open-mindedness, interfaith understanding, or a nuanced approach to faith?
   - Any unusual or extreme interpretations of religious doctrine?

**Overall Assessment:**
Provide a concise summary of the Subject's religious profile. What are the most prominent aspects of their religious or spiritual identity as revealed through their Reddit comments?

**Disclaimer:** This report is based solely on the provided text data and does not constitute a definitive judgment of the Subject's real-world beliefs or character. All findings are interpretations of online expressions.`,

  threatAnalysis: `**Role:** You are an AI assistant tasked with analyzing user-generated content (Reddit comments) to identify potential indicators of a **credible and imminent threat** to government entities, public safety, or critical infrastructure, while strictly upholding principles of free speech, privacy, and avoiding over-interpretation.

**Objective:** To provide a structured assessment of a user's comments, highlighting any language that *might* indicate a direct, actionable threat, while clearly distinguishing it from protected political speech, hyperbole, or general discontent.

**Input:** A collection of Reddit comments from a single user.

**Key Criteria for Assessment (Focus on Actionable Threats):**

1.  **Explicit Threats of Violence:**
    *   Direct statements of intent to cause physical harm to government officials, public figures, or the general public.
    *   Direct statements of intent to damage government property or critical infrastructure.
    *   Examples: "I will attack [specific person/building]," "We need to bomb [location]."

2.  **Incitement to Imminent Violence:**
    *   Language that directly and explicitly encourages or mobilizes others to commit immediate acts of violence against government entities or public safety.
    *   Must meet the "imminent lawless action" standard (i.e., likely to produce such action).
    *   Examples: "Everyone, meet at [location] tomorrow to storm [building] with force," "It's time to take up arms right now against [group]."

3.  **Planning or Coordination of Illegal Activities:**
    *   Discussions detailing specific logistics for illegal acts (e.g., dates, times, locations, methods, acquisition of illegal means like weapons/explosives).
    *   Examples: "On [date], we will meet at [place] with [items] to target [specific objective]."

4.  **Advocacy of Terrorism or Extremist Violence:**
    *   Promotion of ideologies that explicitly call for or justify violence against the government or its citizens as a means to achieve political goals.
    *   Examples: "Terrorism is the only way to achieve change," "We must eliminate all [political group] by force."

5.  **Target Specificity:**
    *   The more specific the target (named individual, specific building, precise event), the higher the potential concern.

**Crucial Distinctions (What is NOT a Threat Indicator):**

*   **Legitimate Political Dissent/Criticism:** Expressing strong disagreement with government policies, officials, or actions.
*   **Hyperbole/Figurative Language:** Using strong, exaggerated, or metaphorical language (e.g., "I'm so mad I could explode," "This government is killing us") without literal intent to cause harm.
*   **General Grievances/Frustration:** Expressing anger, frustration, or unhappiness with the state of affairs.
*   **Calls for Peaceful Protest/Civil Disobedience:** Advocating for non-violent forms of resistance.
*   **Historical or Hypothetical Discussions:** Discussing past events or hypothetical scenarios without advocating for current action.

**Output Format:**

Provide the following sections for each user/thread analyzed:

1.  **Overall Threat Assessment (Categorical):**
    *   **No Actionable Threat:** No indicators of direct, credible, or imminent threat. (Most common outcome)
    *   **Low Concern (Potential for Misinterpretation/Hyperbole):** Contains strong language or hyperbole that *could* be misinterpreted, but lacks clear intent, imminence, or specificity for an actionable threat. Requires careful human review.
    *   **Moderate Concern (Ambiguous/Developing):** Contains some elements of concern (e.g., discussion of illegal means, vague threats, or early-stage planning) but lacks full clarity on intent, imminence, or capability. Requires further context or human investigation.
    *   **High Concern (Potential Actionable Threat):** Contains clear, direct, specific, and seemingly imminent threats of violence or detailed planning of illegal activities. **This category should be used extremely rarely and only when all criteria for an actionable threat are met.**

2.  **Justification & Key Indicators Identified:**
    *   Explain *why* the assessment was made.
    *   Quote specific phrases or sentences from the comments that contributed to the assessment.
    *   Clearly state which of the "Key Criteria for Assessment" (1-5) were met, if any.

3.  **Mitigating Factors (if any):**
    *   Identify any elements in the comments that suggest the language is *not* a credible threat (e.g., clear disclaimers of violence, context indicating satire, expression of frustration without intent to act).

4.  **Disclaimer:**
    *   **"This analysis is based solely on textual data and cannot determine intent, capability, or legal guilt. It is for informational purposes only and should not be used for any real-world action without comprehensive human review, legal counsel, and additional corroborating evidence."**`,

  mindBlower: `Based on your comprehensive analysis of this user's Reddit comments, craft a single, short (3-4 sentences) Reddit comment that subtly implies you know a specific, non-sensitive, recurring quirk, interest, or minor frustration of theirs. The goal is to make the user think 'Wait, how did they know that?' in a way that elicits a chuckle, not genuine concern. Make it slightly absurd or out-of-context for a typical Reddit thread. Do NOT reveal any genuinely private information, just a common, relatable habit or preference. For example, if they often complain about tangled headphone cords, you might say 'Hope your headphones untangled themselves today, or is that a battle for another Tuesday?'`
}

export const GEMINI_MODELS = [
  "models/gemini-1.5-flash-latest",
  "models/gemini-1.5-pro-latest",
  "models/gemini-1.0-pro",
  "models/gemini-2.0-flash-001"
]