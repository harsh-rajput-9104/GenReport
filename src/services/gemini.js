import { sanitizeReportHtml } from '../utils/sanitize';

// Proxy endpoint — the Gemini API key lives ONLY on the backend server.
// The frontend never contacts Google's API directly.
const BACKEND_URL = 'http://localhost:5000/api/generate';

/**
 * Builds the master prompt from user form data.
 * Blank days are excluded before calling this function.
 *
 * @param {{ name: string, role: string, dateRange: string, days: {day: string, tasks: string}[], additionalNotes: string }} data
 * @returns {string}
 */
function buildPrompt({ name, role, dateRange, days, additionalNotes }) {
    const daySection = days
        .map(({ day, tasks }) => `${day}: ${tasks.trim()}`)
        .join('\n');

    const notesSection = additionalNotes?.trim()
        ? `\nAdditional Notes Provided:\n${additionalNotes.trim()}`
        : 'None.';

    return `You are a professional technical report writer.

Generate a detailed 2–3 page weekly work report in FIRST PERSON perspective.

The report MUST start EXACTLY with this HTML header block (use these tags precisely):

<h1>Weekly Work Report — ${name}</h1>
<p><strong>Role:</strong> ${role}</p>
<p><strong>Date:</strong> ${dateRange}</p>

Then immediately continue with the structured HTML sections below. No blank lines before the first section.

═══════════════════════════════════════════════
VOICE & TONE — NON-NEGOTIABLE
═══════════════════════════════════════════════

- Write in FIRST PERSON throughout. Use "I", "my", "I worked on", "I revised", etc.
- NEVER refer to the writer in third person.
- NEVER use titles like Mr., Ms., Dr., or any honorific.
- NEVER address the reader directly (no "you").
- Professional, formal, corporate tone.

═══════════════════════════════════════════════
ABSOLUTE CONTENT RULES
═══════════════════════════════════════════════

YOU MAY:
- Expand each task into detailed, well-developed explanatory paragraphs.
- Elaborate conceptually on any technology or topic the user has explicitly mentioned.
- Add professional transitions and narrative structure.
- Describe what studying or working on a mentioned topic typically involves, in conceptual terms.

YOU MUST NOT:
- Fabricate tools, libraries, or frameworks NOT mentioned.
- Invent metrics, percentages, or quantified results.
- Claim project completions or deployments not stated by the user.
- Add achievements, awards, or recognition not in the input.
- Invent challenges, blockers, or resolutions.
- Exaggerate or embellish outcomes beyond what the user provided.
- Add business impact, ROI, or performance improvement claims.
- Include any information not derivable from the user's own words.

═══════════════════════════════════════════════
REQUIRED REPORT STRUCTURE
═══════════════════════════════════════════════

After the header block, produce EXACTLY these five sections in order:

<h2>Introduction</h2>
- 2–3 sentences in first person.
- Introduce the reporting period and overall weekly focus naturally.
- Mention my role in context. No fabricated claims.

<h2>Weekly Overview</h2>
- 3–5 sentences of cohesive first-person narrative prose.
- Summarise the week's themes derived only from provided tasks.
- Do NOT list tasks — write flowing, structured paragraphs.

<h2>Daily Work Breakdown</h2>
For EACH provided day (skip days with no input entirely):

- Determine the correct calendar date for each day based on the provided date range.
- Open with <p><strong>Day Name — Corresponding Date</strong></p> as a label.
- Then write a first-person paragraph of 4–7 sentences expanding on the day's stated task.
- Include conceptual depth about the mentioned topic (e.g. if I mention "studied React hooks", elaborate what that involves — useState, useEffect, the mental model — but ONLY because hooks were mentioned).
- Do NOT say what was achieved or completed unless I explicitly said so.

<h2>Key Learnings and Development Focus</h2>
- 3–5 first-person sentences.
- Summarise the learning themes strictly from mentioned technologies and topics.
- No invented insights, no fabricated growth metrics.

<h2>Conclusion</h2>
- 2–4 first-person sentences.
- Professional closing summary derived only from stated work.
- No future plans, promises, or outcomes unless I stated them.

═══════════════════════════════════════════════
LENGTH REQUIREMENT
═══════════════════════════════════════════════

- Minimum 900 words of prose.
- Target: equivalent to 2–3 pages of A4 content.
- Every section must have substantial, well-developed paragraphs.
- Do NOT produce thin bullet lists in place of paragraphs.

═══════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════

- Output valid HTML ONLY.
- Allowed tags: <h1>, <h2>, <p>, <ul>, <li>, <strong>
- No markdown. No backticks. No code fences.
- No explanatory text outside the report.
- No prefacing sentences like "Here is your report:".
- Start directly with <h1>Weekly Work Report — ${name}</h1>.

═══════════════════════════════════════════════
USER INPUT
═══════════════════════════════════════════════

Name: ${name}
Role: ${role}
Reporting Period: ${dateRange}

Daily Tasks:
${daySection}

Additional Notes:
${notesSection}

═══════════════════════════════════════════════
GENERATE THE REPORT NOW.
Start with: <h1>Weekly Work Report — ${name}</h1>`;
}

/**
 * Validates that the response meets minimum length requirements.
 * @param {string} html
 * @returns {boolean}
 */
function isResponseSufficient(html) {
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').filter(Boolean).length;
    return wordCount >= 300;
}

/**
 * Calls the local backend proxy which securely forwards the request to Gemini.
 * The frontend never contacts Google's API or exposes the API key.
 *
 * @param {object} formData
 * @returns {Promise<string>} Sanitized HTML report string.
 */
export async function generateReport(formData) {
    const prompt = buildPrompt(formData);

    let response;
    try {
        response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
    } catch {
        throw new Error('Could not reach the backend server. Make sure it is running on http://localhost:5000.');
    }

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error || `Backend responded with HTTP ${response.status}`;
        throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        throw new Error('Gemini returned an empty response. Please try again.');
    }

    // Strip markdown code fences if model wraps output despite instructions
    const stripped = rawText
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    const sanitized = sanitizeReportHtml(stripped);

    if (!isResponseSufficient(sanitized)) {
        throw new Error('Generated report was too short. Please try again or add more detail to your daily tasks.');
    }

    return sanitized;
}
