import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Multi-model fallback list in order of priority
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

async function generateWithFallback(prompt) {
  let lastError = null;
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn(`Model ${model} failed, attempting next fallback...`, error.message);
      lastError = error;
    }
  }
  throw lastError || new Error("All AI models currently unavailable. Please retry in a few moments.");
}

export async function runGemini(params) {
  const code = typeof params === 'string' ? params : params.code;
  const language = typeof params === 'object' ? params.language || 'C++' : 'C++';
  const problemTitle = typeof params === 'object' ? params.problemTitle || 'Algorithmic Problem' : '';
  const problemDescription = typeof params === 'object' ? params.problemDescription || '' : '';

  const prompt = `You are JudgeX's expert Competitive Programming & Code Review AI Mentor.
Your task is to provide an insightful, motivating, and beautifully formatted code review for an algorithmic coding problem.

${problemTitle ? `### Problem: ${problemTitle}` : ''}
${problemDescription ? `### Problem Description:\n${problemDescription}\n` : ''}
### Language: ${language}
### Submitted Code:
\`\`\`${language}
${code}
\`\`\`

---

Please provide a structured, professional code review in Markdown format covering the following sections:

### 1. 🔍 Approach & Correctness
- Analyze the user's algorithmic approach (e.g. Brute Force, Two Pointers, Dynamic Programming, Greedy, Graph traversal, etc.).
- State whether the logic correctly solves the problem or if there are logical flaws.

### 2. ⏱️ Time & Space Complexity
- **Time Complexity**: Explain the current time complexity in Big-O notation ($O(...)$).
- **Space/Memory Complexity**: Explain the current auxiliary memory usage in Big-O notation ($O(...)$).
- **Optimal Achievable**: State if this is the most optimal complexity or if it can be improved.

### 3. ⚠️ Edge Cases to Consider
- Highlight 2-3 critical edge cases (e.g., empty inputs, single element, negative numbers, extreme constraints, integer overflow).

### 4. 💡 Optimization & Clean Code Tips
- Offer actionable suggestions for cleaner syntax, language-specific best practices, or memory optimizations.

### 5. ✨ Recommended / Optimized Code
Provide the cleanest, most optimal solution with concise in-line comments:

\`\`\`${language}
// Optimal solution
\`\`\`

Keep the tone encouraging, concise, and educational. Format using clean GitHub Markdown with bold headings and code blocks.`;

  try {
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'The AI review service is currently experiencing high demand. Please try again in a few seconds.';
  }
}

export async function getGeminiHint({ problemTitle, problemDescription, hintLevel = 1, currentCode = '' }) {
  let levelInstruction = '';
  
  if (hintLevel === 1) {
    levelInstruction = `Provide **Hint 1: High-Level Intuition & Pattern**.
- Give a gentle nudge about the conceptual approach or problem pattern (e.g., Two Pointers, Hash Table, Sliding Window, Monotonic Stack, Greedy, etc.).
- DO NOT reveal explicit code or algorithms yet.
- Keep it under 3-4 sentences.`;
  } else if (hintLevel === 2) {
    levelInstruction = `Provide **Hint 2: Approach & Data Structure Breakdown**.
- Explain step-by-step how to structure the logic and which data structures are ideal.
- Discuss how to handle the main state transitions or conditions.
- DO NOT give complete full solution code yet.
- Keep it concise, focused, and educational.`;
  } else {
    levelInstruction = `Provide **Hint 3: Concrete Pseudocode & Edge Cases**.
- Provide concise algorithmic pseudocode outlining the complete algorithm.
- List 2 key edge cases they must handle to avoid Wrong Answer or Runtime Error.
- Make it easy for the student to translate into their programming language.`;
  }

  const prompt = `You are JudgeX's AI Coding Mentor. A student is working on the following problem and has requested **Hint Level ${hintLevel} of 3**.

### Problem: ${problemTitle || 'Coding Challenge'}
${problemDescription ? `### Description:\n${problemDescription}\n` : ''}
${currentCode ? `### Student's Current Code:\n\`\`\`\n${currentCode}\n\`\`\`\n` : ''}

${levelInstruction}

Format your response cleanly in GitHub Markdown.`;

  try {
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Gemini Hint Error:', error);
    return 'Unable to generate hint at this moment. Please retry shortly.';
  }
}