import React from 'react';
import { CVData, EducationInfo, PublicationInfo, SkillInfo, GrantInfo, TeachingInfo, ExperienceInfo, VolunteerInfo, CourseworkInfo, ReferenceInfo, LanguageInfo, AffiliationInfo } from '../types';
import { Plus, Trash2, GripVertical, Info } from 'lucide-react';

interface BuilderPaneProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function BuilderPane({ data, onChange }: BuilderPaneProps) {
  
  const updatePersonal = (field: keyof CVData['personal'], value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const updateArrayItem = <K extends keyof Omit<CVData, 'personal'>>(
    arrayName: K,
    id: string,
    field: string,
    value: string
  ) => {
    const updatedArray = data[arrayName].map((item: any) =>
      item.id === id ? { ...item, [field]: value } : item
    ) as any;
    onChange({ ...data, [arrayName]: updatedArray });
  };

  const removeArrayItem = (arrayName: keyof Omit<CVData, 'personal'>, id: string) => {
    const updatedArray = data[arrayName].filter((item: any) => item.id !== id) as any;
    onChange({ ...data, [arrayName]: updatedArray });
  };

  const addEducation = () => {
    const newEd: EducationInfo = {
      id: `ed-${Date.now()}`,
      degree: '', institution: '', period: '', gpa: '', thesis: '', advisors: ''
    };
    onChange({ ...data, education: [...data.education, newEd] });
  };

  const addPublication = () => {
    const newPub: PublicationInfo = {
      id: `pub-${Date.now()}`,
      title: '', authors: '', journal: '', type: 'Journal', status: 'Published', year: '', doi: '', isbn: ''
    };
    onChange({ ...data, publications: [...data.publications, newPub] });
  };

  const addGrant = () => {
    const newGrant: GrantInfo = {
      id: `gr-${Date.now()}`,
      name: '', role: '', funder: '', amount: '', period: ''
    };
    onChange({ ...data, grants: [...data.grants, newGrant] });
  };

  const addTeaching = () => {
    const newTeaching: TeachingInfo = {
      id: `te-${Date.now()}`,
      course: '', role: '', institution: '', period: ''
    };
    onChange({ ...data, teaching: [...data.teaching, newTeaching] });
  };

  const addSkill = () => {
    const newSkill: SkillInfo = {
      id: `sk-${Date.now()}`,
      category: '', items: ''
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const addExperience = () => {
    const newExp: ExperienceInfo = { id: `exp-${Date.now()}`, role: '', organization: '', location: '', period: '', description: '' };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const addVolunteering = () => {
    const newVol: VolunteerInfo = { id: `vol-${Date.now()}`, role: '', organization: '', period: '', description: '' };
    onChange({ ...data, volunteering: [...data.volunteering, newVol] });
  };

  const addCoursework = () => {
    const newCourse: CourseworkInfo = { id: `cw-${Date.now()}`, courseName: '', institution: '', year: '' };
    onChange({ ...data, coursework: [...data.coursework, newCourse] });
  };

  const addReference = () => {
    const newRef: ReferenceInfo = { id: `ref-${Date.now()}`, name: '', title: '', institution: '', email: '' };
    onChange({ ...data, references: [...data.references, newRef] });
  };

  const addAffiliation = () => {
    const newAffiliation: AffiliationInfo = { id: `aff-${Date.now()}`, organization: '', role: '', period: '' };
    onChange({ ...data, affiliations: [...data.affiliations, newAffiliation] });
  };

  const addLanguage = () => {
    const newLang: LanguageInfo = { id: `lang-${Date.now()}`, name: '', proficiency: '' };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative ml-2 flex items-center">
      <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded shadow-lg z-50">
        <span className="font-semibold text-indigo-300 block mb-1">Academic Tip</span>
        {text}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
      </div>
    </div>
  );

  return (
    <div className="w-1/2 max-w-2xl flex flex-col border-r border-slate-200 bg-slate-50 no-print h-full">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Editor</h1>
        <p className="text-slate-500 text-sm mt-1">Updates reflect instantly in the preview</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        
        {/* Personal Details */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">1</span>
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <input value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-white" placeholder="Dr. Jane Doe" />
            </div>
            <div className="col-span-2">
              <div className="flex items-center mb-1">
                <label className="block text-xs font-medium text-slate-600">Author Name Highlight</label>
                <Tooltip text="Type your name exactly as it appears in publications (e.g. 'Doe, J.') to automatically bold it in the output." />
              </div>
              <input value={data.personal.highlightName || ''} onChange={e => updatePersonal('highlightName', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-white" placeholder="e.g. Doe, J." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} type="email" className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-md px-3 py-2 text-sm bg-white" placeholder="jane.doe@university.edu" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
              <input value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="(555) 123-4567" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Website</label>
              <input value={data.personal.website} onChange={e => updatePersonal('website', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="https://..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn</label>
              <input value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="linkedin.com/in/..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">GitHub</label>
              <input value={data.personal.github} onChange={e => updatePersonal('github', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="github.com/..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Google Scholar</label>
              <input value={data.personal.scholar} onChange={e => updatePersonal('scholar', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="scholar.google.com/..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">ORCID / Link</label>
              <input value={data.personal.orcid} onChange={e => updatePersonal('orcid', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="orcid.org/..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Department & Institution</label>
              <input value={data.personal.department} onChange={e => updatePersonal('department', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="Department of Computer Science..." />
            </div>
            <div className="col-span-2">
              <div className="flex items-center mb-1">
                <label className="block text-xs font-medium text-slate-600">Research Interests</label>
                <Tooltip text="Keep this brief (2-4 phrases). Committees scan this first to see if you fit their department's focus." />
              </div>
              <input value={data.personal.researchInterests} onChange={e => updatePersonal('researchInterests', e.target.value)} type="text" className="w-full border border-slate-300 focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 rounded-md px-3 py-2 text-sm bg-white" placeholder="Machine Learning, Compilers..." />
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">2</span>
              Education
              <Tooltip text="Always list education in reverse chronological order. Postdocs belong in a separate 'Academic Appointments' section, not here." />
            </h3>
            <button onClick={addEducation} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.education.map((ed, index) => (
              <div key={ed.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('education', ed.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Degree</label>
                    <input value={ed.degree} onChange={e => updateArrayItem('education', ed.id, 'degree', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Ph.D. in CS" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution</label>
                    <input value={ed.institution} onChange={e => updateArrayItem('education', ed.id, 'institution', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="University of Tech" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={ed.period} onChange={e => updateArrayItem('education', ed.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2020 — 2024" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">GPA (Optional)</label>
                    <input value={ed.gpa} onChange={e => updateArrayItem('education', ed.id, 'gpa', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="4.0/4.0" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Dissertation Title</label>
                    <input value={ed.thesis} onChange={e => updateArrayItem('education', ed.id, 'thesis', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Thesis title..." />
                  </div>
                   <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Advisors</label>
                    <input value={ed.advisors} onChange={e => updateArrayItem('education', ed.id, 'advisors', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Dr. XYZ..." />
                  </div>
                </div>
              </div>
            ))}
            {data.education.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No education entries.</p>}
          </div>
        </section>

        {/* Publications */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">3</span>
              Publications
              <Tooltip text="We'll automatically highlight your name in bold when compiled. Ensure 'Under Review' papers are clearly marked so you don't appear dishonest." />
            </h3>
            <button onClick={addPublication} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.publications.map((pub, index) => (
              <div key={pub.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                 <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                 <button onClick={() => removeArrayItem('publications', pub.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                   <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                    <input value={pub.title} onChange={e => updateArrayItem('publications', pub.id, 'title', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Paper title" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Authors</label>
                    <input value={pub.authors} onChange={e => updateArrayItem('publications', pub.id, 'authors', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Doe, J., Smith, A." />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                    <select value={pub.type} onChange={e => updateArrayItem('publications', pub.id, 'type', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white">
                      <option value="Journal">Journal</option>
                      <option value="Conference">Conference</option>
                      <option value="Book">Book</option>
                      <option value="Book Chapter">Book Chapter</option>
                      <option value="Oral Presentation">Oral Presentation</option>
                      <option value="Poster Presentation">Poster Presentation</option>
                      <option value="Patent">Patent</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Journal/Conference/Book</label>
                    <input value={pub.journal} onChange={e => updateArrayItem('publications', pub.id, 'journal', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Name, Vol..." />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                    <select value={pub.status} onChange={e => updateArrayItem('publications', pub.id, 'status', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white">
                      <option value="Published">Published</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Pre-print">Pre-print (arXiv)</option>
                      <option value="In Preparation">In Preparation</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">DOI (Optional)</label>
                    <input value={pub.doi} onChange={e => updateArrayItem('publications', pub.id, 'doi', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="10.1000/xyz" />
                  </div>
                  {(pub.type === 'Book' || pub.type === 'Book Chapter') && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">ISBN (Optional)</label>
                      <input value={pub.isbn || ''} onChange={e => updateArrayItem('publications', pub.id, 'isbn', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="978-..." />
                    </div>
                  )}
                </div>
              </div>
            ))}
             {data.publications.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No publication entries.</p>}
          </div>
        </section>

        {/* Grants */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">4</span>
              Grants & Awards
              <Tooltip text="If you were a Co-PI, explicitly state your role. List the total award amount if it strengthens your application." />
            </h3>
            <button onClick={addGrant} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.grants.map((gr) => (
              <div key={gr.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('grants', gr.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Grant / Award Name</label>
                    <input value={gr.name} onChange={e => updateArrayItem('grants', gr.id, 'name', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="NSF Faculty Early Career Development..." />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                    <input value={gr.role} onChange={e => updateArrayItem('grants', gr.id, 'role', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="PI / Co-PI" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Funder</label>
                    <input value={gr.funder} onChange={e => updateArrayItem('grants', gr.id, 'funder', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="NSF / NIH..." />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Amount</label>
                    <input value={gr.amount} onChange={e => updateArrayItem('grants', gr.id, 'amount', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="$500,000" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={gr.period} onChange={e => updateArrayItem('grants', gr.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2024 — 2029" />
                  </div>
                </div>
              </div>
            ))}
             {data.grants.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No grants or awards.</p>}
          </div>
        </section>

        {/* Teaching */}
         <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">5</span>
              Teaching & Mentoring
            </h3>
            <button onClick={addTeaching} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.teaching.map((te) => (
              <div key={te.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('teaching', te.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Course Name</label>
                    <input value={te.course} onChange={e => updateArrayItem('teaching', te.id, 'course', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Advanced Compilers" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                    <input value={te.role} onChange={e => updateArrayItem('teaching', te.id, 'role', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Instructor / TA" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution</label>
                    <input value={te.institution} onChange={e => updateArrayItem('teaching', te.id, 'institution', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="University..." />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={te.period} onChange={e => updateArrayItem('teaching', te.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Fall 2023" />
                  </div>
                </div>
              </div>
            ))}
             {data.teaching.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No teaching entries.</p>}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">6</span>
              Research & Work Experience
            </h3>
            <button onClick={addExperience} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Role/Position</label>
                    <input value={exp.role} onChange={e => updateArrayItem('experience', exp.id, 'role', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Postdoctoral Researcher" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Organization</label>
                    <input value={exp.organization} onChange={e => updateArrayItem('experience', exp.id, 'organization', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="University of XYZ" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                    <input value={exp.location} onChange={e => updateArrayItem('experience', exp.id, 'location', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="New York, USA" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={exp.period} onChange={e => updateArrayItem('experience', exp.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2020 — Present" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                    <input value={exp.description} onChange={e => updateArrayItem('experience', exp.id, 'description', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Led a team of..." />
                  </div>
                </div>
              </div>
            ))}
             {data.experience.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No experience entries.</p>}
          </div>
        </section>

        {/* Volunteering */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">7</span>
              Volunteering & Service
            </h3>
            <button onClick={addVolunteering} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.volunteering.map((vol) => (
              <div key={vol.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('volunteering', vol.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                    <input value={vol.role} onChange={e => updateArrayItem('volunteering', vol.id, 'role', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Reviewer" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Organization</label>
                    <input value={vol.organization} onChange={e => updateArrayItem('volunteering', vol.id, 'organization', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Conference Name" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={vol.period} onChange={e => updateArrayItem('volunteering', vol.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2022 — Present" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Description (Optional)</label>
                    <input value={vol.description} onChange={e => updateArrayItem('volunteering', vol.id, 'description', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="..." />
                  </div>
                </div>
              </div>
            ))}
             {data.volunteering.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No volunteering entries.</p>}
          </div>
        </section>

        {/* Affiliations */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">8</span>
              Professional Affiliations
            </h3>
            <button onClick={addAffiliation} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.affiliations.map((aff) => (
              <div key={aff.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('affiliations', aff.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Organization</label>
                    <input value={aff.organization} onChange={e => updateArrayItem('affiliations', aff.id, 'organization', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="IEEE / ACM" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                    <input value={aff.role} onChange={e => updateArrayItem('affiliations', aff.id, 'role', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Member" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                    <input value={aff.period} onChange={e => updateArrayItem('affiliations', aff.id, 'period', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2020 — Present" />
                  </div>
                </div>
              </div>
            ))}
             {data.affiliations.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No affiliations.</p>}
          </div>
        </section>

        {/* Coursework */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">9</span>
              Coursework & Certifications
            </h3>
            <button onClick={addCoursework} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.coursework.map((cw) => (
              <div key={cw.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('coursework', cw.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Course / Certificate Name</label>
                    <input value={cw.courseName} onChange={e => updateArrayItem('coursework', cw.id, 'courseName', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Deep Learning Specialization" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution</label>
                    <input value={cw.institution} onChange={e => updateArrayItem('coursework', cw.id, 'institution', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Coursera / University..." />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
                    <input value={cw.year} onChange={e => updateArrayItem('coursework', cw.id, 'year', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="2021" />
                  </div>
                </div>
              </div>
            ))}
             {data.coursework.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No coursework entries.</p>}
          </div>
        </section>

        {/* Skills */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">10</span>
              Technical Skills
            </h3>
            <button onClick={addSkill} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.skills.map((sk) => (
              <div key={sk.id} className="flex items-start gap-4 p-3 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="mt-1 flex-shrink-0 cursor-move text-slate-300 hover:text-slate-500">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3 min-w-0">
                  <div className="col-span-12 sm:col-span-4">
                    <input value={sk.category} onChange={e => updateArrayItem('skills', sk.id, 'category', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 font-semibold bg-white" placeholder="Category" />
                  </div>
                  <div className="col-span-12 sm:col-span-8">
                    <input value={sk.items} onChange={e => updateArrayItem('skills', sk.id, 'items', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Skills (comma separated)" />
                  </div>
                </div>
                 <button onClick={() => removeArrayItem('skills', sk.id)} className="text-slate-400 hover:text-red-500 p-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
             {data.skills.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No skills added.</p>}
          </div>
        </section>

         {/* Languages */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">11</span>
              Languages
            </h3>
            <button onClick={addLanguage} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex items-start gap-4 p-3 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="mt-1 flex-shrink-0 cursor-move text-slate-300 hover:text-slate-500">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3 min-w-0">
                  <div className="col-span-12 sm:col-span-6">
                    <input value={lang.name} onChange={e => updateArrayItem('languages', lang.id, 'name', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 font-semibold bg-white" placeholder="Language (e.g. English)" />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <input value={lang.proficiency} onChange={e => updateArrayItem('languages', lang.id, 'proficiency', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Proficiency (e.g. Fluent, IELTS 8.0)" />
                  </div>
                </div>
                 <button onClick={() => removeArrayItem('languages', lang.id)} className="text-slate-400 hover:text-red-500 p-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
             {data.languages.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No languages added.</p>}
          </div>
        </section>

        {/* References */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">12</span>
              References
              <Tooltip text="List 3-4 professional references. Always include their academic title and official institutional email." />
            </h3>
            <button onClick={addReference} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {data.references.map((ref) => (
              <div key={ref.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move text-slate-300 hover:text-slate-500 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button onClick={() => removeArrayItem('references', ref.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3 pr-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                    <input value={ref.name} onChange={e => updateArrayItem('references', ref.id, 'name', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Prof. John Smith" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                    <input value={ref.title} onChange={e => updateArrayItem('references', ref.id, 'title', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="Professor of Physics" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution</label>
                    <input value={ref.institution} onChange={e => updateArrayItem('references', ref.id, 'institution', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="University of Tech" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                    <input value={ref.email} onChange={e => updateArrayItem('references', ref.id, 'email', e.target.value)} className="w-full border border-slate-300 rounded text-sm px-2 py-1.5 outline-none focus:border-indigo-500 bg-white" placeholder="j.smith@uni.edu" />
                  </div>
                </div>
              </div>
            ))}
             {data.references.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No references added.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}
