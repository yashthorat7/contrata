const STATUS_ENUM = ['Not Started', 'Applied', 'Screening', 'Technical Interview', 'Offer', 'Rejected', 'Archived'];

const PRIORITY_ENUM = ['High', 'Medium', 'Low'];

const LOCATION_TYPE_ENUM = ['Remote', 'Hybrid', 'Onsite'];

const JOB_CARD_JSON_SCHEMA = `Each job object in the returned array MUST contain EXACTLY these 21 keys, with no extra keys, no missing keys, and no renamed keys. If a value is genuinely unknown, use null (for strings/objects) or [] (for arrays) — never omit the key, and never invent a placeholder like "N/A" or "Unknown" in place of null.

{
  "id": "string — unique slug built as: lowercase-kebab-case(company)-lowercase-kebab-case(role)-<6 char random alphanumeric suffix>. Example: \"google-senior-software-engineer-core-systems-x7k2p9\". Never reuse an id and never use a plain counter like \"1\" or \"job_1\".",
  "company": "string — the full brand name of the hiring company, correctly capitalized (e.g. \"Google\", not \"google\" or \"GOOGLE\"). No legal suffixes like 'Inc.' or 'Pvt Ltd' unless the posting's own branding uses them.",
  "role": "string — the official job title exactly as posted. Do not shorten, translate, or rephrase it, and do not append the company name to it.",
  "location": "string — 'City, State/Region' for onsite/hybrid roles (e.g. \"Bengaluru, Karnataka\"). Use \"Remote\" only when locationType is Remote and no base city is given. Never leave blank — if genuinely unknown, use \"Not specified\".",
  "locationType": "string — MUST be exactly one of: ${LOCATION_TYPE_ENUM.map(v => `"${v}"`).join(', ')}. Infer it from the posting text (e.g. 'work from home' = Remote, '3 days in office' = Hybrid). Never invent a fourth value.",
  "salary": "string — formatted with the correct currency symbol and the region's numbering convention (₹ with Indian grouping e.g. \"₹8,00,000 - ₹12,00,000\", $ with Western grouping e.g. \"$120,000 - $150,000\"). Append '/month' for stipends. If genuinely not disclosed, use the exact string \"Not disclosed\" — never estimate a number.",
  "status": "string — MUST always be \"Not Started\" for freshly scraped jobs unless customNotes explicitly says otherwise. Never assign Applied, Offer, Rejected, etc. yourself. Full enum (for reference only): ${STATUS_ENUM.map(v => `"${v}"`).join(', ')}.",
  "priority": "string — MUST be exactly one of ${PRIORITY_ENUM.map(v => `"${v}"`).join(', ')}, derived with this exact rubric — HIGH: matchScore ≥ 85 AND salary meets/exceeds the stated minimum AND locationType/jobType align with preferences. MEDIUM: matchScore 65-84, OR exactly one of the three criteria above fails. LOW: matchScore < 65, OR two or more criteria fail. Do not assign High just because the company is prestigious.",
  "platform": "string — the literal source, e.g. \"LinkedIn\", \"Indeed\", \"Naukri\", \"Direct\" (use 'Direct' only for a company's own careers page, never for a job board).",
  "dateScraped": "string — ISO 8601 timestamp of the actual current run time, e.g. \"2026-07-03T09:15:00.000Z\" — not the posting date.",
  "datePosted": "string — ISO 8601 timestamp of when the listing was originally posted, parsed from the posting's relative date ('3 days ago') or explicit date. If only a date (no time) is available, use 00:00:00.000Z.",
  "notes": "string — one to two sentences, under 220 characters total, written like a human job-hunter's own note (not a restatement of the description). Surface the single most decision-relevant fact — why it's a stretch, why it's a strong fit, or what to prep for.",
  "postingLink": "string — the direct, absolute URL to view the original listing (not a search-results page, and not a tracking/redirect URL where an original is available).",
  "applyLink": "string — the direct, absolute URL to apply. If the posting only exposes one URL for both viewing and applying, use it for both fields — never leave applyLink empty.",
  "saved": "boolean — always false for freshly scraped jobs. A real boolean, not the string \"false\".",
  "archived": "boolean — always false for freshly scraped jobs. A real boolean, not the string \"false\".",
  "matchScore": "integer 0-100 (no decimals, no % sign, no quotes) — weighted estimate: ~50% skills/tech-stack overlap with my profile, ~25% experience-level fit, ~25% role/domain relevance to my stated jobType and customNotes.",
  "unmatchedThings": "array of strings, 0 to 3 items — short, specific gaps between the posting's requirements and my profile (e.g. \"Requires 5+ years of Kubernetes in production\"). Use [] if there are none — never omit the key.",
  "tags": "array of EXACTLY 4 strings — the 4 most important technical skills/keywords from the posting, Title Case, most relevant first (e.g. [\"React\", \"TypeScript\", \"AWS\", \"PostgreSQL\"]). Always exactly 4 — never 3, never 5.",
  "recruiter": {
    "name": "string or null — recruiter/hiring manager's full name if named in the posting, else null.",
    "email": "string or null — only if explicitly published on the posting/page. Never guess or construct an email from a name pattern.",
    "linkedin": "string or null — only if explicitly linked from the posting."
  },
  "description": "string — the full job description reformatted as clean Markdown, with **bold** subheaders exactly like \"**Responsibilities:**\" and \"**Requirements:**\" (or \"**Qualifications:**\"), each followed by 3-5 concise bullet points starting with '-'. Preserve every concrete requirement, responsibility, and benefit from the original — this is a full-length field, not a summary. Never compress it into a single paragraph."
}`;

const APIFY_ACTOR_GUIDE = `### Apify Actor Playbook (use these, in this priority order — actually call them, do not just describe calling them)

**LinkedIn → worldunboxer/rapid-linkedin-scraper** (primary, reliable)
- Typical inputs: a title/keyword query, a location string (city, or a broad region like "Worldwide" / "India"), optionally a list of cities to split the search across, plus date-posted and experience-level filters where the Actor supports them.
- Known limitation: applyLink can duplicate postingLink on this Actor. If that happens, keep both fields populated with whatever URL is available rather than leaving one blank.
- If the run fails or returns 0 items, retry once. If it still fails, fall back to a plain web_search + web_fetch of LinkedIn's public job-search results for the same query rather than silently returning an empty LinkedIn set.

**Indeed → borderline/indeed-scraper** (primary, reliable)
- Typical inputs: country (2-letter code, e.g. "in", "us"), query (role/keywords), sort, fromdays (recency window as a number of days).
- Map publishedAge (e.g. "7 days", "2 weeks", "1 month") into fromdays precisely — "2 weeks" → 14, "1 month" → 30.
- Map listingsLimit into whatever max-results field the Actor exposes so you don't over-fetch or over-charge the run.

**Naukri / other India-specific boards → no locked-in Actor yet.**
- Do not assume a specific Actor name. Search the live Apify Store (via the Apify tools available to you) for a currently well-rated, actively maintained Naukri Actor (4+ stars, modified within the last few months) before running one blind. If nothing looks trustworthy, fall back to web_search + web_fetch of Naukri's public listing pages, extract manually, and note in that job's "notes" field that it came from a manual fallback rather than a dedicated Actor.

**BLACKLISTED — never use these, even if search or a tool suggests them:**
- cheap_scraper/linkedin-job-scraper — historically unreliable, has produced duplicate and stale entries in past JobPilot AI runs.
- Unstop-focused scrapers in general — Unstop's anti-scraping measures have made every Actor tried so far unreliable for this pipeline. If targetWebsites includes Unstop, either skip it and say so explicitly, or fall back to a careful manual web_search + web_fetch pass and clearly flag those entries as manually extracted.

**General Actor hygiene:**
- One Actor call per requested platform per run — don't fan out into dozens of tiny calls.
- Always pass a hard result cap derived from listingsLimit so runs don't rack up unnecessary usage.
- If an Actor requires a paid/rental tier you can't access, don't silently substitute fabricated data — report the failure for that platform and move on to the next one.`;

const SCRAPE_DOS_AND_DONTS = `### Do's
- DO actually invoke the Apify tools available to you — never simulate, imagine, or hand-write results and present them as if they came from a real scrape.
- DO run one Actor/search per requested platform and merge everything into a single flat array.
- DO de-duplicate: if the same company + role + location appears twice, even across two different platforms, keep only the single best-quality entry (most complete description, most recent datePosted).
- DO treat every filter as a hard constraint, not a suggestion: jobType, experienceLevel, location, minimum salary, publishedAge, and listingsLimit must all be respected exactly.
- DO reason about matchScore, priority, tags, and unmatchedThings individually for every job against "My Profile Context" — never copy the same values across multiple entries.
- DO check every result against the Already-Tracked Jobs blacklist below and exclude any job that matches the same company + role OR apply link.
- DO return valid, parseable JSON and absolutely nothing else — no markdown fences, no leading or trailing commentary, no trailing commas.
- DO return an empty array if literally nothing matches — that is a valid, expected outcome, not a failure to paper over with invented jobs.

### Don'ts
- DON'T fabricate a job, a company, a URL, a salary figure, or a recruiter contact. If a field is unknown, follow the null / "Not specified" rules in the schema below — never guess to fill a gap.
- DON'T include jobs older than the publishedAge window.
- DON'T include jobs outside the requested location unless locationType is Remote.
- DON'T return more items than listingsLimit.
- DON'T wrap the output in Markdown code fences of any kind, and don't add any explanation before or after the array.
- DON'T rename, reorder, add, or remove any key from the schema below — the frontend will fail to render cards with an incorrect shape.
- DON'T return duplicate ids.
- DON'T collapse the Requirements/Responsibilities structure in "description" into a single freeform paragraph — it must keep the bolded subheaders and bullets.`;

const CONTEXT_TEMPLATE = `Name:
Title:
Location:
Contact: (email / phone / LinkedIn / GitHub / portfolio / LeetCode / X)
Summary & Bio:
Core Domain Competencies:
Work & Freelance Experience:
Projects (include URLs, dates, and full tech stack):
Technical Skills & Tools:
Achievements, Certifications & Leadership:
Education & Coursework:`;

const CONTEXT_PROMPT = `You are a Principal Engineering Architect and Executive Technical Writer. Your task is to transform the candidate's raw, unstructured profile data into an exhaustive, highly detailed online professional biodata and engineering portfolio document in clean GitHub-flavored Markdown.

Unlike a compressed one-page resume, this document serves as a comprehensive, deep-dive technical dossier (~400 to 500 lines of rich markdown documentation) designed for AI matching engines, technical recruiters, hiring managers, and deep engineering evaluations.

### Document Architecture & Required Sections (in this exact order)

1. **# [Candidate Name] — Professional Biodata & Technical Dossier**
   - **Identity & Contact Block**: Full name, current role/title, location, work mode preferences (Remote/Hybrid/Onsite), and direct links (Email, Phone, LinkedIn, GitHub, Portfolio, LeetCode, X/Twitter). Format cleanly using bullet points or structured metadata lines.

2. **## Executive Summary & Engineering Philosophy**
   - Provide a comprehensive 3 to 4 paragraph technical narrative. Detail the candidate's core domain specialization (e.g., Full-Stack Architecture, AI/ML Workflows, Serverless Systems), engineering principles, scalability mindset, and overarching career trajectory.

3. **## Comprehensive Technical Skills Architecture**
   - Categorize all skills exhaustively into structured subsections:
     - **Languages & Core Syntax**: (e.g., TypeScript, JavaScript ES6+, Python, C++, C#)
     - **Frontend Engineering**: (e.g., Next.js, React, Zustand, Tailwind CSS, Three.js/WebGL, HTML5/CSS3)
     - **Backend & Cloud Infrastructure**: (e.g., Node.js, Express, AWS, Serverless, Docker, REST APIs, Microservices)
     - **Databases & Data Layer**: (e.g., PostgreSQL, Supabase, Neon, Prisma ORM, Connection Pooling, Indexing)
     - **AI, ML & RAG Ecosystems**: (e.g., RAG Architectures, LLM Fine-Tuning, Llama 3.3, Groq LPUs, Semantic Search, Prompt Engineering)
     - **DevOps, Tooling & Workflow**: (e.g., Git/GitHub, Vercel, VS Code, CI/CD, Claude Code, Antigravity)

4. **## In-Depth Project Documentation (6 to 8 exhaustive bullet points per project)**
   - For EVERY project in the candidate's history, provide a deep technical case study.
   - Format each project header as: \`### [Project Name](URL) | [One-Line Technical Tagline] | [Timeframe]\`
   - Write **strictly 6 to 8 exhaustive, highly granular bullet points per project**. Each bullet must:
     - Dive deep into system design, algorithmic complexity, data structures (e.g., Kahn's topological sort, DFS, HCPT algorithms, Euler integration), database schema design, or infrastructure choices.
     - Bold all specific technologies, architectural patterns, algorithms, and quantifiable metrics using **double asterisks**.
     - Detail the *problem statement*, the *engineering solution*, and the *measurable business/system impact* (e.g., latency reductions, token cost savings, FPS locks, throughput scaling, accuracy rates).
     - Never use surface-level summaries — explain *how* and *why* the technology was implemented at a low level.

5. **## Work & Freelance Engineering Experience**
   - For each role/engagement, format as: \`### [Role Title] | [Company / Client Base] | [Timeframe]\`
   - Provide 4 to 6 detailed bullet points detailing architectural leadership, client acquisition/scaling, system optimizations, database restructuring, and DevOps improvements. Quantify all performance gains and delivery timelines.

6. **## Achievements, Competitions & Leadership**
   - Document every competitive programming milestone (e.g., LeetCode Top 1%, rating, problems solved), hackathon victories, SIH/DIPEX recognitions, VC interest, certifications (AWS Certified Cloud Foundations), and campus leadership roles (e.g., Pandora Club Lead).
   - Write 2 to 3 informative sentences or detailed bullets per achievement explaining the scope, competitiveness, and technical significance.

7. **## Education & Academic Background**
   - Detail degree, institution, graduation timeframe, CGPA/academic performance, and relevant computer science coursework or academic milestones.

### Strict Formatting & Tone Guidelines
- Target length: Aim for a comprehensive, exhaustive document of roughly **400 to 500 lines of detailed Markdown**. Never truncate or summarize away technical depth.
- Write in an authoritative, highly technical engineering tone. Avoid vague corporate buzzwords; rely entirely on architectural facts, algorithmic depth, and verifiable metrics.
- Output ONLY the raw Markdown document. Do NOT wrap the output in code fences (\`\`\`markdown), and do NOT include any introductory or concluding conversational text.

Here is the candidate's raw profile data to expand into the comprehensive biodata dossier:`;

export const buildBlacklistText = (existingJobs = []) => {
  if (!existingJobs || !existingJobs.length) {
    return 'None yet — no jobs currently tracked. Nothing to exclude.';
  }

  const lines = existingJobs
    .map(job => {
      const company = job?.company?.trim() || '';
      const role = job?.role?.trim() || '';
      const applyLink = job?.applyLink?.trim() || job?.postingLink?.trim() || '';
      if (!company && !role && !applyLink) return null;
      return `- Company: "${company || 'Unknown'}", Role: "${role || 'Unknown'}", Apply Link: "${applyLink || 'None'}"`;
    })
    .filter(Boolean);

  const uniqueLines = [...new Set(lines)];

  return uniqueLines.length > 0 ? uniqueLines.join('\n') : 'None yet — no jobs currently tracked. Nothing to exclude.';
};

const stripContactInfo = text => {
  if (!text) return text;
  return text
    .replace(/^Contact:.*$/im, 'Contact: [REDACTED FOR PRIVACY]')
    .replace(/-\s\*\*Identity & Contact Block\*\*:.*$/im, '- **Identity & Contact Block**: [REDACTED FOR PRIVACY]');
};

export const generateSearchPrompt = (searchConfig = {}, contextText = '', existingJobs = []) => {
  const blacklistText = buildBlacklistText(existingJobs);
  return `You are an expert technical recruiter and job-market data analyst with direct tool access to Apify Actors for live web scraping. Your task is to actually scrape the requested job boards for real, currently-live listings — not to describe what you would do — and return the results as a strictly structured JSON array of job cards.

### My Search Preferences
I am looking for an ${searchConfig.jobType || '[job type]'} position focused on ${searchConfig.experienceLevel || '[experience level]'} roles. Scrape from ${searchConfig.targetWebsites || '[target websites]'}, located in ${searchConfig.location || '[location]'}, offering a stipend/salary of at least ${searchConfig.salary || '[salary]'}, posted within the last ${searchConfig.publishedAge || '[published age]'}, and limit results to ${searchConfig.listingsLimit || '[listings limit]'} items. Additionally, the role should focus on: ${searchConfig.customNotes || '[custom notes]'}.

${APIFY_ACTOR_GUIDE}

### Already-Tracked Jobs (blacklist — do not return any job that matches the company + role OR apply link of these existing items)
${blacklistText}

### My Profile Context (for matching, scoring, and tagging every job below)
${stripContactInfo(contextText) || '[No profile context provided]'}

${SCRAPE_DOS_AND_DONTS}

### Required JSON Structure
Return ONLY a valid, parseable JSON array of job objects — no markdown block syntax, no explanations, no conversational text before or after it.

${JOB_CARD_JSON_SCHEMA}`;
};

export const generateLinksPrompt = (links = [], contextText = '', existingJobs = []) => {
  const linksText = links.length > 0 ? links.map(l => `- ${l}`).join('\n') : '[No links provided]';
  const blacklistText = buildBlacklistText(existingJobs);
  return `You are an expert job data extractor with direct tool access to Apify Actors and web-fetch tools. I have a list of specific job posting URLs. Visit and extract the real content of each one — do not guess at what a listing on that domain "usually" contains.

### Job URLs to Extract
${linksText}

### Extraction Guidance
- For each URL, fetch the live page content (use the Apify RAG web browser Actor or a direct fetch tool, whichever you have access to) and parse the actual posting — company, role, location, salary, description, and apply link must all come from that specific page.
- If a URL is dead, blocked, requires login, or returns no job content, skip it entirely rather than fabricating a placeholder entry, and mention the skipped URL in a short note outside the JSON (the JSON array itself must contain only successfully extracted jobs).
- If a URL is a search-results page rather than a single job posting, extract each individual listing visible on that page as its own separate job object.

### Already-Tracked Jobs (blacklist — do not return any job that matches the company + role OR apply link of these existing items)
${blacklistText}

### My Profile Context (for matching, scoring, and tagging every job below)
${stripContactInfo(contextText) || '[No profile context provided]'}

${SCRAPE_DOS_AND_DONTS}

### Required JSON Structure
Return ONLY a valid, parseable JSON array of job objects — no markdown block syntax, no explanations, no conversational text before or after it.

${JOB_CARD_JSON_SCHEMA}`;
};

export const generateContextPrompt = (contextText = '') => {
  const dataToFormat = contextText.trim() || CONTEXT_TEMPLATE;
  return `${CONTEXT_PROMPT}\n\n\`\`\`markdown\n${dataToFormat}\n\`\`\``;
};
