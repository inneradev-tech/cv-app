import React, { useState } from 'react';
import { CVData } from '../types';
import { Settings, Sparkles, Upload, Loader2, Target } from 'lucide-react';
import * as mammoth from 'mammoth';
import Markdown from 'react-markdown';

interface AiAssistantProps {
  cvData: CVData;
  setCvData: (data: CVData) => void;
  setLanguage: (lang: 'en'|'fa') => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  modelName: string;
  setModelName: (model: string) => void;
}

export default function AiAssistant({ 
  cvData, 
  setCvData, 
  setLanguage,
  apiBaseUrl, 
  setApiBaseUrl, 
  apiKey, 
  setApiKey, 
  modelName, 
  setModelName 
}: AiAssistantProps) {
  
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [confirmImprove, setConfirmImprove] = useState(false);
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  const testApi = (silent = false) => {
    if (!apiKey) {
      if (!silent) setMessage({ type: 'error', text: 'Please enter an API Key first.' });
      return false;
    }
    return true;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingDoc(true);
    try {
      let rawText = '';
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        rawText = result.value;
      } else if (file.name.endsWith('.txt')) {
        rawText = await file.text();
      } else {
        throw new Error('Unsupported file format. Please upload .docx or .txt');
      }

      if (!rawText.trim()) {
        throw new Error('File is empty or could not be read.');
      }

      // If no API key, use a completely local heuristic basic parser
      if (!apiKey) {
        console.log("No API Key, falling back to local heuristic extraction.");
        const lines = rawText.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
        let section = 'personal';
        const newCv = { ...cvData };
        let buffer = "";

        const assignBuffer = () => {
          if (!buffer.trim()) return;
          const id = Date.now().toString() + Math.random().toString().substring(2, 6);
          if (section === 'education') newCv.education.push({ id, degree: buffer.substring(0, 50) + "...", institution: "Imported Data", period: "", gpa: "", thesis: buffer, advisors: "" });
          else if (section === 'experience') newCv.experience.push({ id, role: "Imported Experience", organization: "", location: "", period: "", description: buffer });
          else if (section === 'publications') newCv.publications.push({ id, title: buffer.substring(0, 60), authors: "Imported Authors", type: "Journal", journal: "", status: "Published", doi: "" });
          else if (section === 'skills') newCv.skills.push({ id, category: "Imported Skills", items: buffer });
          else if (section === 'personal') newCv.personal.researchInterests = buffer;
          buffer = "";
        };

        for (const line of lines) {
          const lower = line.toLowerCase();
          if (lower === 'education' || lower === 'تحصیلات') {
            assignBuffer();
            section = 'education';
          } else if (lower === 'experience' || lower.includes('work history') || lower === 'سوابق پژوهشی' || lower === 'سوابق حرفه ای') {
            assignBuffer();
            section = 'experience';
          } else if (lower === 'publications' || lower === 'انتشارات' || lower === 'مقالات') {
            assignBuffer();
            section = 'publications';
          } else if (lower === 'skills' || lower === 'مهارت ها') {
            assignBuffer();
            section = 'skills';
          } else {
            if (section === 'personal') {
              if (line.includes('@') && !newCv.personal.email) newCv.personal.email = line.split(' ').find(w => w.includes('@')) || '';
              else if (!newCv.personal.name && line.length < 30) newCv.personal.name = line;
              else if (!newCv.personal.phone && (line.includes('+') || line.match(/^[0-9\-\s]{8,15}$/))) newCv.personal.phone = line;
              else buffer += line + "\n";
            } else {
              buffer += line + "\n";
            }
          }
        }
        assignBuffer();

        setCvData(newCv);
        setMessage({ type: 'success', text: 'Document imported locally (Heuristic Mapping). For intelligent structured parsing, add an API key.' });
        return;
      }

      // If API key IS present, do intelligent AI parsing
      const prompt = `You are a highly precise and strict data extraction AI. I will provide raw text extracted from a CV document.
Your task is to parse this information into a precise JSON structure.

CRITICAL INSTRUCTIONS:
1. ONLY USE INFORMATION EXPLICITLY PRESENT IN THE TEXT. Do not hallucinate or guess fields.
2. If a specific field is missing, leave it as "".
3. Generate completely unique string IDs for everything (e.g. 'edu-1234', 'exp-9876').
4. The output must be perfectly valid parsed JSON. Do not include any trailing commas or markdown framing.
5. METICULOUSLY SCAN FOR PUBLICATIONS, BOOKS, AND ORAL/POSTER PRESENTATIONS. DO NOT SKIP ANY ITEM.
   - You MUST extract EVERY SINGLE item listed in the raw text, especially under 'Presentations', 'Posters', 'Conferences', 'Books', and 'Journal Articles'.
   - Use 'type' correctly: 'Journal', 'Conference', 'Book', 'Book Chapter', 'Patent', 'Oral Presentation', or 'Poster Presentation'. FOR PERSIAN TEXT, map words like "مقالات ژورنالی" or "مقالات چاپ شده در مجلات" to 'Journal', "مقالات کنفرانسی" to 'Conference', "ارائه‌های شفاهی" to 'Oral Presentation', "ارائه‌های پوستری" to 'Poster Presentation', "کتاب" to 'Book'. The 'type' MUST be in English EXACTLY as in the schema.
   - Extract the 'year' properly for publications.
   - Put "In Press", "Under Review", "Ongoing", "Published" or Persian equivalents like "در دست بررسی", "زیر چاپ" in the 'status' field.
6. If the document has "Awards", "Honors", or "Grants", map them all into the \`grants\` array.
7. If the document has "Certificates", "Courses", or "Certifications", map them into the \`coursework\` array.
8. If the document has "Executive and Voluntary", "Service", or related terms, map them to \`volunteering\`.
9. In \`education\`, populate \`thesis\` and \`advisors\` if available.
10. Determine a good \`highlightName\` (e.g. "Doe, J." or just Last Name) that usually appears bolded in publication author lists, so we can highlight it.
11. **DATES FORMATTING**: If the primary language of the resume is Persian, translate ALL Gregorian month names to Persian (e.g. "August" to "اوت"), and ideally convert the years to Jalali solar calendar (e.g. 2023 -> 1402) if appropriate. Also ensure all descriptions are in Persian.
12. DO NOT translate JSON keys. The keys MUST remain EXACTLY in English as given in the JSON schema.

JSON SCHEMA TO MATCH EXACTLY:
${JSON.stringify({
  personal: { name: "", highlightName: "", email: "", phone: "", website: "", linkedin: "", github: "", scholar: "", orcid: "", department: "", researchInterests: "" },
  education: [{ id: "edu-1", degree: "", institution: "", period: "", gpa: "", thesis: "", advisors: "" }],
  experience: [{ id: "exp-1", role: "", organization: "", location: "", period: "", description: "" }],
  languages: [{ id: "lang-1", name: "", proficiency: "" }],
  skills: [{ id: "sk-1", category: "", items: "" }],
  publications: [{ id: "pub-1", title: "", authors: "", journal: "", type: "Journal | Conference | Book | Book Chapter | Patent | Oral Presentation | Poster Presentation", status: "", year: "", doi: "", isbn: "" }],
  grants: [{ id: "grant-1", name: "", role: "", funder: "", amount: "", period: "" }],
  teaching: [{ id: "teach-1", course: "", role: "", institution: "", period: "" }],
  volunteering: [{ id: "vol-1", role: "", organization: "", period: "", description: "" }],
  coursework: [{ id: "cw-1", courseName: "", institution: "", year: "" }],
  affiliations: [{ id: "aff-1", organization: "", role: "", period: "" }],
  references: [{ id: "ref-1", name: "", title: "", institution: "", email: "" }]
}, null, 2)}

RAW RESUME TEXT:
${rawText}
Respond ONLY with valid JSON matching the structure.`;

      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.replace(/[^\x20-\x7E]/g, '').trim()}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      let responseText = data.choices[0].message.content.trim();
      
      if (responseText.startsWith('\`\`\`json')) {
        responseText = responseText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
      } else if (responseText.startsWith('\`\`\`')) {
        responseText = responseText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
      }

      const parsedData = JSON.parse(responseText);
      
      // Merge with existing data structure to ensure all arrays exist
      const mergedData = {
        ...cvData,
        ...parsedData,
        education: parsedData.education || [],
        experience: parsedData.experience || [],
        languages: parsedData.languages || [],
        skills: parsedData.skills || [],
        publications: parsedData.publications || [],
        grants: parsedData.grants || [],
        teaching: parsedData.teaching || [],
        volunteering: parsedData.volunteering || [],
        coursework: parsedData.coursework || [],
        affiliations: parsedData.affiliations || [],
        references: parsedData.references || []
      };

      setCvData(mergedData);
      setMessage({ type: 'success', text: 'CV successfully parsed and imported.' });

    } catch (e: any) {
      setMessage({ type: 'error', text: `Failed to parse document: ${e.message}` });
    } finally {
      setIsParsingDoc(false);
      e.target.value = '';
    }
  };

  const handleAnalyze = async () => {
    setMessage(null);
    if (!testApi()) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    try {
      const prompt = `You are an expert academic and professional career advisor. 
I am sending you my CV data in JSON format.
${jobDescription ? `I am targeting the following position/domain: ${jobDescription}\n` : 'Please analyze my general academic/professional profile.\n'}

CRITICAL INSTRUCTIONS:
1. Provide a rigorous, realistic, and highly detailed analysis in Markdown.
2. Structure your response with the following precise sections:
   - Match Percentage (e.g. 75%) [Only if a target role was provided]
   - Strengths (how the CV matches the target)
   - Weaknesses & Gaps (where it explicitly falls short)
   - Actionable Improvements (clear, concrete steps to bridge the gaps)
   - Personalized Strategies (for a successful application/interview)
3. Use bullet points for readability.
4. Base your analysis STRICTLY on the provided CV JSON. Do not assume I have skills or experiences not listed.
5. Respond in the primary language of the CV (Persian or English).

CV JSON:
${JSON.stringify(cvData, null, 2)}
`;

      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.replace(/[^\x20-\x7E]/g, '').trim()}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisResult(data.choices[0].message.content);
    } catch (e: any) {
      setMessage({ type: 'error', text: `Error analyzing CV: ${e.message}` });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTranslate = async (targetLang: 'en' | 'fa') => {
    setMessage(null);
    if (!testApi()) return;
    
    setIsImproving(true);
    
    try {
      const prompt = `You are an expert bilingual academic translator. I will provide my CV data in JSON format.
Your task is to translate ALL textual content (names, titles, descriptions, roles, organizations, etc.) to ${targetLang === 'en' ? 'highly professional, standard Academic English' : 'fluent, standard Academic Persian (Farsi)'}.
CRITICAL INSTRUCTIONS:
1. ONLY translate. DO NOT invent facts, numbers, dates, or experiences. BE METICULOUS. DO NOT drop any items or truncate arrays. If there are 10 items in an array, return exactly 10 translated items. Ensure every section (personal, education, experience, publications, grants, volunteering, coursework, affiliations, skills, languages, references) is ALL fully translated.
2. Maintain academic tone and standard terminology. For Persian: translate all abstract terms like "Ongoing" into "در حال انجام", "Under Review" into "زیر چاپ" or "در حال بررسی", "In Press" to "زیر چاپ". Ensure all authors names are faithfully translated or transliterated to Persian perfectly (e.g. 'D. Nejadmasoom' -> 'د. نژادمعصوم'). 
3. Keep the JSON schema (keys) EXACTLY the same. DO NOT translate JSON keys. The keys (like 'title', 'publications', 'experience') MUST remain in English. Ensure ID fields are untouched.
4. Respond ONLY with the complete, updated JSON object. No extra text, no markdown formatting blocks. Just raw JSON. Every missing bracket breaks the application.
5. CRITICAL: DO NOT translate the Enum values for publication 'type'. They MUST remain in English exactly as ('Journal', 'Conference', 'Book', 'Book Chapter', 'Patent', 'Oral Presentation', 'Poster Presentation').
6. Translate Gregorian dates to Shamsi (Jalali) when targeting Persian, and vice versa when targeting English, if appropriate.
7. Do not miss ANY array items. Double-check that length of publications matches exactly the input.

CV JSON:
${JSON.stringify(cvData, null, 2)}`;

      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.replace(/[^\x20-\x7E]/g, '').trim()}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      let rawContent = data.choices[0].message.content.trim();
      if (rawContent.startsWith('\`\`\`json')) {
        rawContent = rawContent.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
      } else if (rawContent.startsWith('\`\`\`')) {
        rawContent = rawContent.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
      }

      const updatedData = JSON.parse(rawContent);
      const mergedData = {
        ...cvData,
        ...updatedData,
        education: updatedData.education || [],
        experience: updatedData.experience || [],
        languages: updatedData.languages || [],
        skills: updatedData.skills || [],
        publications: updatedData.publications || [],
        grants: updatedData.grants || [],
        teaching: updatedData.teaching || [],
        volunteering: updatedData.volunteering || [],
        coursework: updatedData.coursework || [],
        affiliations: updatedData.affiliations || [],
        references: updatedData.references || []
      };
      setCvData(mergedData);
      setLanguage(targetLang);
      setMessage({ type: 'success', text: `CV parsed and switched to ${targetLang === 'en' ? 'English layout' : 'Persian (RTL) layout'}.` });
    } catch (e: any) {
       console.error("Translation error", e);
       setMessage({ type: 'error', text: `Failed to translate CV: ${e.message}` });
    } finally {
      setIsImproving(false);
    }
  };

  const handleImprove = async () => {
    setMessage(null);
    if (!testApi()) return;
    if (!confirmImprove) {
      setConfirmImprove(true);
      return;
    }
    
    setIsImproving(true);
    setConfirmImprove(false);
    
    try {
      const prompt = `You are a professional CV editor and expert copywriter. I will provide my CV data in JSON format.
Your task is to refine the textual descriptions (experience descriptions, volunteer descriptions, summary/research interests if present) to sound more professional, impact-driven, academic, and grammatically perfect.
${jobDescription ? `\nCRITICAL CONTEXT: The user is targeting this position: "${jobDescription}". Tailor the tone and emphasize relevant action verbs suited for this role.\n` : ''}
CRITICAL INSTRUCTIONS:
1. ONLY refine existing text. DO NOT invent facts, numbers, dates, titles, or experiences. BE METICULOUS. DO NOT drop or forget any existing objects in arrays (e.g., KEEP ALL books, publications, experiences). Do not alter the length of arrays unless you are removing amateur skills.
2. Filter Irrelevant Skills: Remove extremely irrelevant, non-academic or amateur skills (e.g., 'InShot', 'Basic MS Word') if this is an academic CV.
3. Use strong action verbs (e.g., spearheaded, architected, synthesized) where appropriate.
4. Keep the JSON schema (keys) EXACTLY the same. DO NOT translate JSON keys. The keys MUST remain in English. Ensure ID fields are untouched.
5. Respond ONLY with the complete, updated JSON object. No extra text, no markdown formatting blocks. Just raw JSON. Every missing bracket breaks the application.
6. CRITICAL: DO NOT translate the Enum values for publication 'type'. They MUST remain in English exactly as ('Journal', 'Conference', 'Book', 'Book Chapter', 'Patent', 'Oral Presentation', 'Poster Presentation').

CV JSON:
${JSON.stringify(cvData, null, 2)}`;

      const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.replace(/[^\x20-\x7E]/g, '').trim()}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      let rawContent = data.choices[0].message.content.trim();
      if (rawContent.startsWith('\`\`\`json')) {
        rawContent = rawContent.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
      } else if (rawContent.startsWith('\`\`\`')) {
        rawContent = rawContent.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
      }

      const updatedData = JSON.parse(rawContent);
      const mergedData = {
        ...cvData,
        ...updatedData,
        education: updatedData.education || [],
        experience: updatedData.experience || [],
        languages: updatedData.languages || [],
        skills: updatedData.skills || [],
        publications: updatedData.publications || [],
        grants: updatedData.grants || [],
        teaching: updatedData.teaching || [],
        volunteering: updatedData.volunteering || [],
        coursework: updatedData.coursework || [],
        affiliations: updatedData.affiliations || [],
        references: updatedData.references || []
      };
      setCvData(mergedData);
      setMessage({ type: 'success', text: 'CV successfully rewritten and improved.' });
    } catch (e: any) {
       setMessage({ type: 'error', text: `Failed to improve CV: ${e.message}` });
    } finally {
      setIsImproving(false);
    }
  }

  return (
    <div className="w-1/2 max-w-2xl border-r border-slate-200 bg-slate-50 p-6 overflow-y-auto flex flex-col no-print h-full">
      <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-slate-300 mb-8 mt-4">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow text-indigo-600">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI CV Assistant</h2>
        <p className="text-slate-500 mb-6 max-w-sm">Analyze your profile, get feedback for specific roles, and automatically rewrite your descriptions for maximum impact.</p>
        
        {message && (
          <div className={`w-full text-left mb-6 p-4 rounded-lg text-sm flex font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
             {message.text}
          </div>
        )}

        <div className="flex gap-4">
           <div className="relative group overflow-hidden rounded-lg">
              <input type="file" onChange={handleFileUpload} accept=".docx,.txt" disabled={isParsingDoc} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed" />
              <button disabled={isParsingDoc} className="bg-white border text-sm border-slate-300 group-hover:border-indigo-500 group-hover:ring-1 group-hover:ring-indigo-500 text-slate-700 px-6 py-2 rounded-lg font-medium shadow-sm transition-all focus:outline-none flex items-center gap-2 disabled:opacity-75">
                 {isParsingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
                 {isParsingDoc ? 'Parsing DOCX/TXT...' : 'Import DOCX / TXT'}
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md mb-6">
        <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />LLM API Configuration
        </h3>
        <p className="text-xs text-slate-500 mb-4">Set up your LLM credentials for the AI Assistant.</p>
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Provider / API Base URL</label>
              <select
                className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-800"
                value={
                  apiBaseUrl === 'https://api.openai.com/v1' || apiBaseUrl === 'https://generativelanguage.googleapis.com/v1beta/openai/' || apiBaseUrl === 'https://api.gapgpt.app/v1'
                    ? apiBaseUrl 
                    : 'custom'
                }
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    setApiBaseUrl(e.target.value);
                    if (e.target.value === 'https://generativelanguage.googleapis.com/v1beta/openai/') {
                      setModelName('gemini-2.5-flash');
                    } else if (e.target.value === 'https://api.openai.com/v1') {
                      setModelName('gpt-4o');
                    } else if (e.target.value === 'https://api.gapgpt.app/v1') {
                      setModelName('gpt-4o');
                    }
                  } else {
                    setApiBaseUrl('');
                  }
                }}
              >
                <option value="https://api.openai.com/v1">OpenAI (api.openai.com/v1)</option>
                <option value="https://generativelanguage.googleapis.com/v1beta/openai/">Gemini (OpenAI Compatible API)</option>
                <option value="https://api.gapgpt.app/v1">GapGPT (Comprehensive Models)</option>
                <option value="custom">Custom Endpoint...</option>
              </select>
              {apiBaseUrl !== 'https://api.openai.com/v1' && apiBaseUrl !== 'https://generativelanguage.googleapis.com/v1beta/openai/' && apiBaseUrl !== 'https://api.gapgpt.app/v1' && (
                <input 
                  type="text" 
                  className="mt-2 w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-800 font-mono" 
                  placeholder="https://your-custom-endpoint.com/v1" 
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                />
              )}
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">API Key</label>
              <input 
                type="password" 
                className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 font-mono" 
                placeholder="sk-..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value.replace(/[^\x20-\x7E]/g, ''))}
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Model Name</label>
              {(apiBaseUrl === 'https://api.openai.com/v1' || apiBaseUrl === 'https://generativelanguage.googleapis.com/v1beta/openai/' || apiBaseUrl === 'https://api.gapgpt.app/v1') ? (
                <select 
                  className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-800 font-mono" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                >
                  {apiBaseUrl === 'https://api.openai.com/v1' && (
                    <>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="gpt-4.5-preview">gpt-4.5-preview</option>
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                      <option value="o1">o1</option>
                      <option value="o1-mini">o1-mini</option>
                      <option value="o3-mini">o3-mini</option>
                    </>
                  )}
                  {apiBaseUrl === 'https://generativelanguage.googleapis.com/v1beta/openai/' && (
                    <>
                      <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                      <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>
                      <option value="gemini-2.0-pro-exp">gemini-2.0-pro-exp</option>
                      <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                    </>
                  )}
                  {apiBaseUrl === 'https://api.gapgpt.app/v1' && (
                    <optgroup label="GapGPT / Comprehensive Models">
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                      <option value="o1">o1</option>
                      <option value="o3-mini">o3-mini</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                      <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                      <option value="claude-3-7-sonnet-20250219">claude-3-7-sonnet-20250219</option>
                      <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet-20241022</option>
                      <option value="deepseek-chat">deepseek-chat</option>
                      <option value="deepseek-reasoner">deepseek-reasoner</option>
                      <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                      <option value="qwen-2.5-72b">qwen-2.5-72b</option>
                    </optgroup>
                  )}
                </select>
              ) : (
                <input 
                  type="text" 
                  className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-800 font-mono" 
                  placeholder="e.g. gpt-4o" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md mb-6">
        <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" /> Profiling & Optimization
        </h3>
        <p className="text-sm text-slate-600 mb-4">Analyze your CV against a specific role or get general feedback. The AI will highlight hidden strengths and correct weaknesses.</p>
        
        <div className="space-y-4">
          <div>
             <label className="block text-xs font-medium text-slate-600 mb-1">Target Position / Job Description (Optional)</label>
             <textarea 
               rows={3}
               className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-800 resize-none"
               placeholder="e.g. Applying for Assistant Professor at MIT or a PhD position in ML..."
               value={jobDescription}
               onChange={(e) => setJobDescription(e.target.value)}
             />
          </div>

          <div className="flex gap-3">
             <button 
               onClick={handleAnalyze} 
               disabled={isAnalyzing || isImproving}
               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
               {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
             </button>
             <button 
               onClick={handleImprove}
               disabled={isImproving || isAnalyzing}
               title={confirmImprove ? "Click to confirm overwrite" : "Auto-improve textual fields"}
               className={`flex-1 flex justify-center items-center gap-2 text-sm font-medium py-2 rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed
                 ${confirmImprove ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
             >
               {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
               {isImproving ? 'Improving...' : confirmImprove ? 'Confirm Overwrite?' : 'Auto-Improve Text'}
             </button>
          </div>

          {/* Localization Actions */}
          <div className="pt-2 border-t border-slate-100 flex gap-3">
             <button 
               onClick={() => handleTranslate('fa')}
               disabled={isImproving || isAnalyzing}
               className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium py-1.5 rounded-md shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
               Translate to Persian (فا)
             </button>
             <button 
               onClick={() => handleTranslate('en')}
               disabled={isImproving || isAnalyzing}
               className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium py-1.5 rounded-md shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
               Translate to English (EN)
             </button>
          </div>

          {analysisResult && (
             <div className="mt-4 p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
                <h4 className="text-sm font-bold text-indigo-700 mb-3 border-b border-indigo-100 pb-2">Position Analysis / AI Feedback</h4>
                <div className="prose prose-sm prose-slate max-w-none prose-headings:text-indigo-900 prose-headings:font-bold prose-a:text-indigo-600 prose-li:my-0.5 overflow-auto max-h-[400px] pe-2" dir="auto">
                  <Markdown>{analysisResult}</Markdown>
                </div>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
