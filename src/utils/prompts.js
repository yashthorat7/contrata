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
    "company": "Full name of the company",
    "role": "Official job title / role",
    "companyDescription": "Brief description of the company",
    "companyLogo": "URL to company logo if available, otherwise null",
    "companyWebsite": "URL of company official website if available, otherwise null",
    "jobDescription": "Complete job description text",
    "shortSummary": "A concise 2-3 sentence overview summarizing the role and why it fits me",
    "requiredSkills": ["core technical and soft skills"],
    "preferredSkills": ["nice-to-have skills"],
    "responsibilities": ["key duties"],
    "qualifications": ["certifications/degrees"],
    "experienceRequired": "Summary of experience level required",
    "employmentType": "Full-time, Internship, etc.",
    "locationType": "Remote, Hybrid, or Onsite",
    "salary": "Salary amount or range if available, otherwise null",
    "currency": "Currency code if available",
    "benefits": ["benefits, perks, equity offered"],
    "location": "City and state/region",
    "country": "Country name if available",
    "timezone": "Timezone if applicable",
    "department": "Engineering, Design, etc.",
    "seniorityLevel": "Junior, Mid-level, Senior, etc.",
    "numberOfOpenings": "Number of positions if specified, otherwise null",
    "date": "Posting date in YYYY-MM-DD",
    "expiryDate": "Expiry date in YYYY-MM-DD if available, otherwise null",
    "jobDescriptionLink": "URL of the original job posting details page",
    "applyLink": "URL to directly apply",
    "platform": "Name of the platform (LinkedIn, Indeed, Direct, etc.)",
    "recruiterInformation": {
      "name": "Recruiter name or null",
      "email": "Recruiter email or null",
      "linkedin": "Recruiter LinkedIn URL or null"
    },
    "technologiesUsed": ["programming languages, tools used"],
    "industry": "Company industry",
    "tags": ["relevant keywords"],
    "matchedSkills": ["matching skills from my profile found in job description"],
    "unmatchedSkills": ["required skills NOT found in my profile"],
    "suggestions": ["suggestions of what I could add to my profile to match this role better"]
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
    "company": "Full name of the company",
    "role": "Official job title / role",
    "companyDescription": "Brief description of the company",
    "companyLogo": "URL to company logo if available, otherwise null",
    "companyWebsite": "URL of company official website if available, otherwise null",
    "jobDescription": "Complete job description text",
    "shortSummary": "A concise 2-3 sentence overview summarizing the role and why it fits me",
    "requiredSkills": ["core technical and soft skills"],
    "preferredSkills": ["nice-to-have skills"],
    "responsibilities": ["key duties"],
    "qualifications": ["certifications/degrees"],
    "experienceRequired": "Summary of experience level required",
    "employmentType": "Full-time, Internship, etc.",
    "locationType": "Remote, Hybrid, or Onsite",
    "salary": "Salary amount or range if available, otherwise null",
    "currency": "Currency code if available",
    "benefits": ["benefits, perks, equity offered"],
    "location": "City and state/region",
    "country": "Country name if available",
    "timezone": "Timezone if applicable",
    "department": "Engineering, Design, etc.",
    "seniorityLevel": "Junior, Mid-level, Senior, etc.",
    "numberOfOpenings": "Number of positions if specified, otherwise null",
    "date": "Posting date in YYYY-MM-DD",
    "expiryDate": "Expiry date in YYYY-MM-DD if available, otherwise null",
    "jobDescriptionLink": "URL of the original job posting details page",
    "applyLink": "URL to directly apply",
    "platform": "Name of the platform (LinkedIn, Indeed, Direct, etc.)",
    "recruiterInformation": {
      "name": "Recruiter name or null",
      "email": "Recruiter email or null",
      "linkedin": "Recruiter LinkedIn URL or null"
    },
    "technologiesUsed": ["programming languages, tools used"],
    "industry": "Company industry",
    "tags": ["relevant keywords"],
    "matchedSkills": ["matching skills from my profile found in job description"],
    "unmatchedSkills": ["required skills NOT found in my profile"],
    "suggestions": ["suggestions of what I could add to my profile to match this role better"]
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
