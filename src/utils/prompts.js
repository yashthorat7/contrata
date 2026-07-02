const CONTEXT_TEMPLATE = `Name: 
Title: 
Projects: 
Skills: 
Achievements: `;

const CONTEXT_PROMPT = `You are an expert professional profile formatter. Please take the following unstructured context data and rewrite it into a highly structured Markdown format. Follow these detailed instructions exactly:

1. **Header**: Extract the candidate's Name, Title, and Links, formatting them cleanly at the top.
2. **Projects**: For each project, provide a clear title. Write 3-4 detailed, impact-driven bullet points focusing on technologies used, metrics achieved, and overall value.
3. **Skills**: Categorize skills logically (e.g., Frontend, Backend, Tools) and list them clearly.
4. **Achievements & Experience**: Extract any roles, numbers, awards, or milestones and format them as a numbered list with bolded key metrics.
5. **Formatting Rules**:
   - Use Markdown headers (##) for main sections.
   - Use bold text (**) to highlight key technologies and numerical impact.
   - Keep the language concise, professional, and action-oriented.
   - Output ONLY the final Markdown structure without any conversational filler.

Here is the raw context data to reformat:`;

const PREFERENCES_PROMPT = `Please act as an expert job scraper and use Apify (if available) to search the requested job boards. Return the matching job listings formatted strictly as a clean JSON array of objects. Filter the jobs to ensure they align with my specific search preferences and profile context.

### My Search Preferences:
I am looking for an {jobType} position focused on {experienceLevel} roles. I want to scrape from {targetWebsites} located in {location} offering a stipend/salary of at least {salary} posted within the last {publishedAge} and limit results to {listingsLimit} items. Additionally, the role should focus on: {customNotes}.

### My Profile Context (For Filtering & Matching):
{CONTEXT}

### Required JSON Structure:
Each job object MUST exactly match the following structure. Do not include markdown block syntax (like \`\`\`json), explanations, or conversational text. Return ONLY a valid, parseable JSON array:
[
  {
    "id": "Unique string identifier for the job entry",
    "company": "Full name of the company",
    "role": "Official job title / role",
    "location": "City and state/region",
    "locationType": "Remote, Hybrid, or Onsite",
    "salary": "Salary amount or range (e.g., ₹20,00,000)",
    "status": "Current status (e.g., Not Started, Applied, Technical Interview)",
    "priority": "High, Medium, or Low (accoring to match)",
    "platform": "Name of the platform (e.g., LinkedIn, Indeed, Direct)",
    "dateScraped": "ISO string of when the job was scraped",
    "datePosted": "ISO string of when the job was originally posted",
    "notes": "A concise 1-2 sentence overview or user note",
    "postingLink": "URL to directly view the original job posting",
    "applyLink": "URL to directly apply for the job",
    "saved": "Boolean indicating if bookmarked",
    "archived": "Boolean indicating if archived",
    "matchScore": "Integer match percentage (0-100)",
    "unmatchedThings": ["Array of reasons or requirements where the candidate's profile does not match"],
    "tags": ["Array of 2-3 core technical skills/keywords"],
    "recruiter": {
      "name": "Recruiter name or null",
      "email": "Recruiter email or null",
      "linkedin": "Recruiter LinkedIn URL or null"
    },
    "description": "Full detailed job description (long-form text or markdown)"
  }
]`;

const LINKS_PROMPT = `Please act as an expert job data extractor. I have a list of job URLs. Please scrape or analyze these links and extract all the relevant job information into a clean JSON array of objects. Ensure the extracted data is evaluated against my profile context for matching.

### Job URLs to Extract:
{LINKS}

### My Profile Context (For Filtering & Matching):
{CONTEXT}

### Required JSON Structure:
Each job object MUST exactly match the following structure. Do not include markdown block syntax (like \`\`\`json), explanations, or conversational text. Return ONLY a valid, parseable JSON array:
[
  {
    "id": "Unique string identifier for the job entry",
    "company": "Full name of the company",
    "role": "Official job title / role",
    "location": "City and state/region",
    "locationType": "Remote, Hybrid, or Onsite",
    "salary": "Salary amount or range (e.g., ₹20,00,000)",
    "status": "Current status (e.g., Not Started, Applied, Technical Interview)",
    "priority": "High, Medium, or Low (accoring to match)",
    "platform": "Name of the platform (e.g., LinkedIn, Indeed, Direct)",
    "dateScraped": "ISO string of when the job was scraped",
    "datePosted": "ISO string of when the job was originally posted",
    "notes": "A concise 1-2 sentence overview or user note",
    "postingLink": "URL to directly view the original job posting",
    "applyLink": "URL to directly apply for the job",
    "saved": "Boolean indicating if bookmarked",
    "archived": "Boolean indicating if archived",
    "matchScore": "Integer match percentage (0-100)",
    "unmatchedThings": ["Array of reasons or requirements where the candidate's profile does not match"],
    "tags": ["Array of 3-4 core technical skills/keywords"],
    "recruiter": {
      "name": "Recruiter name or null",
      "email": "Recruiter email or null",
      "linkedin": "Recruiter LinkedIn URL or null"
    },
    "description": "Full detailed job description (long-form text or markdown)"
  }
]`;

export const generateSearchPrompt = (searchConfig, contextText) => {
  let prompt = PREFERENCES_PROMPT.replace('{CONTEXT}', contextText);
  prompt = prompt.replace('{jobType}', searchConfig.jobType || '[job type]');
  prompt = prompt.replace('{experienceLevel}', searchConfig.experienceLevel || '[experience level]');
  prompt = prompt.replace('{targetWebsites}', searchConfig.targetWebsites || '[target websites]');
  prompt = prompt.replace('{location}', searchConfig.location || '[location]');
  prompt = prompt.replace('{salary}', searchConfig.salary || '[salary]');
  prompt = prompt.replace('{publishedAge}', searchConfig.publishedAge || '[published age]');
  prompt = prompt.replace('{listingsLimit}', searchConfig.listingsLimit || '[listings limit]');
  prompt = prompt.replace('{customNotes}', searchConfig.customNotes || '[custom notes]');
  return prompt;
};

export const generateLinksPrompt = (links, contextText) => {
  let prompt = LINKS_PROMPT.replace('{CONTEXT}', contextText);
  const linksText = links.length > 0 ? links.map(l => `- ${l}`).join('\n') : '[No links provided]';
  return prompt.replace('{LINKS}', linksText);
};

export const generateContextPrompt = contextText => {
  const dataToFormat = contextText.trim() || CONTEXT_TEMPLATE;
  return `${CONTEXT_PROMPT}\n\n\`\`\`markdown\n${dataToFormat}\n\`\`\``;
};
