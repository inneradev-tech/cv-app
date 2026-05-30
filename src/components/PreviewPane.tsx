import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Loader2, FileDown, FileCode2, Mail, Phone, Globe, Linkedin, Github, GraduationCap, Link } from 'lucide-react';
import { CVData } from '../types';
import { generateLatex as generateLatexString } from '../utils/latexGenerator';
import { LayoutTheme, TypographyStyle, Language } from '../App';

interface PreviewPaneProps {
  data: CVData;
  isCompiling: boolean;
  theme: LayoutTheme;
  font: TypographyStyle;
  language: Language;
}

const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(({ data, isCompiling, theme, font, language }, forwardedRef) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const docRef = (forwardedRef as React.MutableRefObject<HTMLDivElement>) || innerRef;
  const [docHeight, setDocHeight] = useState(1123);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 40;
        const targetWidth = 794;
        const newScale = Math.max(0.2, Math.min(1.5, availableWidth / targetWidth));
        setScale(newScale);
      }
    };
    
    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleDocResize = () => {
      if (docRef.current) {
        const h = docRef.current.clientHeight;
        setDocHeight(h);
        setPages(Math.max(1, Math.ceil(h / 1123)));
      }
    };
    
    handleDocResize();
    const docObserver = new ResizeObserver(() => handleDocResize());
    if (docRef.current) docObserver.observe(docRef.current);
    return () => docObserver.disconnect();
  }, [data, theme, font]);
  
  const generateLatex = (cv: CVData) => {
    return `\\documentclass[11pt,a4paper]{article}
\\usepackage{scholarly_cv}
\\usepackage{hyperref}

\\name{${cv.personal.name || 'Your Name'}}
\\contact{${cv.personal.email || 'email@example.com'}}{${cv.personal.phone || 'Phone Number'}}
% ... Rest of LaTeX document
`;
  };

  const handleDownloadTex = () => {
    const texContent = generateLatexString(data, language);
    const blob = new Blob([texContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine classes based on theme and font
  let containerClasses = "bg-white transition-opacity duration-300 ";
  containerClasses += isCompiling ? 'opacity-50 ' : 'opacity-100 ';
  
  if (language === 'fa') {
    containerClasses += "font-['Vazirmatn'] text-right ";
  } else {
    containerClasses += font === 'mono' ? 'font-mono ' : font === 'serif' ? 'font-serif ' : 'font-sans ';
  }
  
  let paddingClasses = "p-10 sm:p-14 gap-8"; // default classic/minimalist
  if (theme === 'compact') paddingClasses = "p-8 sm:p-10 gap-5";
  if (theme === 'elegant') paddingClasses = "p-12 sm:p-16 gap-10";
  if (theme === 'modern') paddingClasses = "p-10 sm:p-12 gap-7";
  if (theme === 'academic') paddingClasses = "p-10 sm:p-14 gap-6";
  
  containerClasses += paddingClasses + " flex flex-col text-slate-900 mx-auto";

  // Section Heading Styles
  const getHeadingStyle = () => {
    switch(theme) {
      case 'classic': return "text-lg font-semibold uppercase tracking-widest border-b-2 border-slate-800 mb-4 pb-1 break-after-avoid";
      case 'minimalist': return "text-xl font-bold uppercase tracking-wider mb-4 border-b border-black/10 mt-2 break-after-avoid";
      case 'compact': return "text-md font-semibold uppercase tracking-widest border-b border-slate-800 mb-2 pb-0.5 mt-1 break-after-avoid";
      case 'modern': return "text-lg font-bold tracking-tight text-indigo-700 bg-indigo-50/50 px-3 py-1.5 rounded-md mb-4 mt-2 break-after-avoid";
      case 'elegant': return "text-2xl font-normal italic text-slate-800 mb-5 border-b border-slate-200 pb-2 mt-3 text-center break-after-avoid";
      case 'academic': return "text-lg font-bold tracking-wider uppercase text-slate-900 border-b-[1.5px] border-slate-900 mb-3 pb-1 mt-4 break-after-avoid";
      default: return "text-xl font-bold uppercase tracking-wider mb-4 pb-1 break-after-avoid";
    }
  };

  const itemMargin = theme === 'compact' ? "mb-2" : theme === 'elegant' ? "mb-6" : theme === 'academic' ? "mb-4" : "mb-4";

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 border-l border-slate-200 print-area-wrapper">
      {/* Toolbar - Excluded from Print */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-10 no-print backdrop-blur-sm bg-white/90 sticky top-0">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-indigo-600" />
          Live Preview
        </h2>
        <div className="flex gap-2">
          <button 
             onClick={handleDownloadTex}
             className="px-3 py-1.5 text-sm flex items-center gap-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
             title="Download Raw LaTeX (.tex)"
          >
            <FileCode2 className="w-4 h-4" />
            Export .tex
          </button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex justify-center bg-slate-200 relative print-area-wrapper shadow-inner"
        ref={containerRef}
      >

        {/* Scaled Wrapper */}
        <div style={{ width: `${794 * scale}px`, height: `${Math.max(1123, docHeight) * scale}px` }} className="relative shrink-0 transition-all shadow-xl">
          {isCompiling && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] no-print">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
              <p className="text-sm text-slate-700 font-medium">
                Generating high-quality PDF...
              </p>
            </div>
          )}

          {/* The actual A4 document */}
          <div 
            id="print-document"
            ref={docRef}
            dir={language === 'fa' ? 'rtl' : 'ltr'}
            className={containerClasses} 
            style={{ 
               width: '794px', 
               minHeight: '1123px',
               transform: `scale(${scale})`, 
               transformOrigin: 'top left',
               position: 'absolute',
               top: 0,
               left: 0
            }}
          >
            
            {/* Header / Contact Info */}
            <div className={`${theme === 'modern' ? 'text-start mb-6 border-s-4 border-indigo-500 ps-5 bg-slate-50 py-4 pe-4' : theme === 'elegant' ? 'text-center mb-8 border-b-2 border-slate-200 pb-8' : theme === 'academic' ? 'text-center mb-5' : theme === 'minimalist' ? 'text-center mb-4 border-b border-black/10 pb-4' : 'text-center border-b border-slate-300 pb-6 mb-2'} break-words break-inside-avoid`}>
              <h1 className={`${theme === 'compact' ? 'text-2xl sm:text-3xl' : theme === 'elegant' ? 'text-4xl sm:text-5xl font-serif mb-4' : theme === 'modern' ? 'text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2' : theme === 'academic' ? 'text-3xl sm:text-4xl font-bold mb-2' : 'text-3xl sm:text-4xl font-normal'} tracking-tight mb-2`}>{data.personal.name || "Your Name"}</h1>
              <div className={`flex flex-wrap ${theme === 'modern' ? 'justify-start' : 'justify-center'} items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-700 ${font === 'serif' ? 'font-sans' : 'font-serif'} tracking-wide mb-1`}>
                {data.personal.email && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Mail className="w-3.5 h-3.5" /> {data.personal.email}</span>
                )}
                {data.personal.phone && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Phone className="w-3.5 h-3.5" /> {data.personal.phone}</span>
                )}
              </div>
              <div className={`flex flex-wrap ${theme === 'modern' ? 'justify-start' : 'justify-center'} items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600 ${font === 'serif' ? 'font-sans' : 'font-serif'} tracking-wide mb-2 mt-1.5`}>
                {data.personal.website && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Globe className="w-3.5 h-3.5" /> {data.personal.website.replace(/^https?:\/\//, '')}</span>
                )}
                {data.personal.linkedin && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Linkedin className="w-3.5 h-3.5" /> {data.personal.linkedin.replace(/^https?:\/\//, '').replace('linkedin.com/in/', '')}</span>
                )}
                {data.personal.github && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Github className="w-3.5 h-3.5" /> {data.personal.github.replace(/^https?:\/\//, '').replace('github.com/', '')}</span>
                )}
                {data.personal.scholar && (
                  <span className="flex items-center gap-1.5" dir="ltr"><GraduationCap className="w-3.5 h-3.5" /> Scholar</span>
                )}
                {data.personal.orcid && (
                  <span className="flex items-center gap-1.5" dir="ltr"><Link className="w-3.5 h-3.5" /> {data.personal.orcid.replace(/^https?:\/\//, '').replace('orcid.org/', '')}</span>
                )}
              </div>
              {data.personal.department && (
                <p className={`text-xs sm:text-sm text-slate-600 ${font === 'serif' ? 'font-sans' : 'font-serif'} tracking-wide`}>
                  {data.personal.department}
                </p>
              )}
               {data.personal.researchInterests && (
                <p className="text-xs sm:text-sm italic text-slate-700 mt-2">
                  <span className="font-semibold">{language === 'fa' ? 'زمینه‌های تحقیقاتی:' : 'Research Interests:'}</span> {data.personal.researchInterests.replace(/^Research Interests:\s*/i, '')}
                </p>
              )}
            </div>

            {/* Education Section */}
            {data.education.length > 0 && (
              <div>
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'تحصیلات' : 'Education'}</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  {data.education.map(ed => (
                    <div key={ed.id} className={`break-inside-avoid ${itemMargin}`}>
                      <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span>{ed.degree || "Degree Title"}</span>
                          <span className={`${font === 'serif' ? 'font-sans text-sm' : 'font-serif text-sm'} font-normal text-slate-600`} dir="auto">{ed.period}</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5">
                        <span className="italic text-slate-700">{ed.institution || "Institution Name"}</span>
                        {ed.gpa && <span className={`${font === 'serif' ? 'font-sans' : ''} text-sm text-slate-600 font-medium`} dir="ltr">GPA: {ed.gpa}</span>}
                      </div>
                      {ed.thesis && (
                        <div className="text-sm mt-1 leading-relaxed text-slate-700 break-words">
                          <span className="font-semibold text-slate-900">{language === 'fa' ? 'پایان‌نامه:' : 'Thesis:'}</span> {language === 'fa' ? `«${ed.thesis}»` : `"${ed.thesis}"`}
                        </div>
                      )}
                      {ed.advisors && (
                        <div className="text-sm mt-0.5 leading-relaxed text-slate-700 break-words">
                          <span className="font-semibold text-slate-900">{language === 'fa' ? 'اساتید راهنما:' : 'Advisors:'}</span> {ed.advisors}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grouped Publications Section */}
             {data.publications.length > 0 && (() => {
                const grouped: Record<string, any[]> = {
                   'Journal': data.publications.filter(p => p.type === 'Journal'),
                   'Conference': data.publications.filter(p => p.type === 'Conference'),
                   'Book': data.publications.filter(p => p.type === 'Book'),
                   'Book Chapter': data.publications.filter(p => p.type === 'Book Chapter'),
                   'Oral Presentation': data.publications.filter(p => p.type === 'Oral Presentation'),
                   'Poster Presentation': data.publications.filter(p => p.type === 'Poster Presentation'),
                   'Patent': data.publications.filter(p => p.type === 'Patent')
                };

                const renderPubs = (pubs: any[], title: string) => {
                   if (!pubs || pubs.length === 0) return null;
                   return (
                     <div className="mb-4 break-inside-avoid">
                       <h3 className={`font-semibold text-slate-800 ${theme === 'classic' ? 'mb-2' : 'mb-1'} ${language === 'fa' ? 'font-["Vazirmatn"]' : ''}`}>{title}</h3>
                       <div className={`text-sm leading-relaxed text-slate-800 ${theme === 'classic' ? 'ps-4 border-s border-slate-200' : ''}`}>
                         {pubs.map((pub, idx) => {
                            const isPublished = pub.status === 'Published';
                            const nameToHighlight = data.personal.highlightName || (data.personal.name ? data.personal.name.split(' ').pop() : '');
                            const highlightedAuthors = pub.authors && nameToHighlight
                              ? pub.authors.split(nameToHighlight).join(`<span class="font-bold border-b border-black/40">${nameToHighlight}</span>`)
                              : pub.authors;

                            return (
                              <div key={pub.id} className={`relative break-inside-avoid mb-2 ${theme === 'classic' ? 'ms-2' : 'flex gap-2'}`}>
                                {theme === 'classic' && (
                                   <div className={`absolute -start-[23px] top-1.5 w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-slate-800' : 'bg-slate-400'} ring-2 ring-white no-print`}></div>
                                )}
                                {theme !== 'classic' && <span className="font-semibold flex-shrink-0 text-slate-500">[{idx+1}]</span>}
                                <div>
                                  <p className="break-words">
                                    {pub.authors ? <span dangerouslySetInnerHTML={{__html: highlightedAuthors}} /> : 'Authors'}. {language === 'fa' ? `«${pub.title || 'Paper Title'}»` : `"${pub.title || 'Paper Title'}."`}{' '}
                                    {pub.journal && <span className="italic">{pub.journal}</span>}
                                    {(pub.year && String(pub.year).trim().length > 0) && <span className="ms-1 font-sans">({pub.year})</span>}
                                    {(!isPublished && pub.status) && <span className="text-slate-500 italic ms-1">({pub.status})</span>}
                                  </p>
                                  {pub.doi && <div className="text-xs text-indigo-600 mt-0.5" dir="ltr"><span className="font-medium text-slate-500">DOI:</span> {pub.doi}</div>}
                                  {pub.isbn && <div className="text-xs text-slate-600 mt-0.5" dir="ltr"><span className="font-medium text-slate-500">ISBN:</span> {pub.isbn}</div>}
                                </div>
                              </div>
                            );
                         })}
                       </div>
                     </div>
                   );
                };

                return (
                  <div className="mt-4">
                    <h2 className={getHeadingStyle()}>{language === 'fa' ? 'انتشارات' : 'Publications'}</h2>
                    {renderPubs(grouped['Journal'], language === 'fa' ? 'مقالات چاپ شده در مجلات' : 'Journal Articles')}
                    {renderPubs(grouped['Conference'], language === 'fa' ? 'مقالات کنفرانسی' : 'Conference Proceedings')}
                    {renderPubs(grouped['Oral Presentation'], language === 'fa' ? 'ارائه‌های شفاهی' : 'Oral Presentations')}
                    {renderPubs(grouped['Poster Presentation'], language === 'fa' ? 'ارائه‌های پوستری' : 'Poster Presentations')}
                    {renderPubs(grouped['Patent'], language === 'fa' ? 'اختراعات' : 'Patents')}
                    {renderPubs(grouped['Book'], language === 'fa' ? 'کتاب‌ها' : 'Books')}
                    {renderPubs(grouped['Book Chapter'], language === 'fa' ? 'عناوین فصول کتاب' : 'Book Chapters')}
                  </div>
                );
             })()}


            {/* Experience Section */}
            {data.experience.length > 0 && (
              <div className="mt-4">
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'سوابق کاری و پژوهشی' : 'Experience'}</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  {data.experience.map(exp => (
                    <div key={exp.id} className={`break-inside-avoid ${itemMargin}`}>
                      <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span>{exp.role || "Role"}</span>
                          <span className={`${font === 'serif' ? 'font-sans text-sm' : 'font-serif text-sm'} font-normal text-slate-600`} dir="auto">{exp.period}</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5">
                        <span className="italic text-slate-700">{exp.organization || "Organization"}</span>
                        {exp.location && <span className={`${font === 'serif' ? 'font-sans' : ''} text-sm text-slate-600 font-medium`}>{exp.location}</span>}
                      </div>
                      {exp.description && (
                         <div className="text-sm mt-1 leading-relaxed text-slate-700 break-words">
                           {exp.description}
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grants Section */}
            {data.grants.length > 0 && (
              <div>
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'بودجه‌های پژوهشی و افتخارات' : 'Grants & Awards'}</h2>
                <div className="space-y-3 text-sm sm:text-base">
                  {data.grants.map(gr => (
                    <div key={gr.id} className={`break-inside-avoid ${itemMargin}`}>
                      <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span>{gr.name || "Grant/Award Name"}</span>
                          <span className={`font-sans text-sm font-normal text-slate-600`} dir="auto">{gr.period}</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5 text-sm text-slate-700">
                        <span>
                           <span className="italic">{gr.role ? `${gr.role}, ` : ''}{gr.funder}</span>
                        </span>
                        {gr.amount && <span className="font-sans font-medium text-slate-800">{gr.amount}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teaching Section */}
            {data.teaching.length > 0 && (
               <div className="mt-4">
                 <h2 className={getHeadingStyle()}>{language === 'fa' ? 'سوابق تدریس' : 'Teaching & Mentoring'}</h2>
                 <ul className={`list-disc list-outside ms-4 text-sm text-slate-800 space-y-1 ${theme === 'compact' ? 'space-y-0.5' : ''}`}>
                    {data.teaching.map(te => (
                      <li key={te.id} className="break-inside-avoid ps-1">
                        <div className="flex justify-between items-baseline gap-2">
                           <span className="text-pretty">
                              <span className="font-semibold">{te.course}</span> — <span className="italic">{te.role}</span> at {te.institution}
                           </span>
                           <span className="font-sans text-slate-500 shrink-0 text-xs text-end" dir="auto">{te.period}</span>
                        </div>
                      </li>
                    ))}
                 </ul>
               </div>
            )}
            
            {/* Coursework Section */}
            {data.coursework.length > 0 && (
               <div className="mt-4">
                 <h2 className={getHeadingStyle()}>{language === 'fa' ? 'دوره‌های آموزشی و گواهینامه‌ها' : 'Coursework & Certifications'}</h2>
                 <ul className={`list-disc list-outside ms-4 text-sm text-slate-800 space-y-1 ${theme === 'compact' ? 'space-y-0.5' : ''}`}>
                    {data.coursework.map(cw => (
                      <li key={cw.id} className="break-inside-avoid ps-1">
                        <div className="flex justify-between items-baseline gap-2">
                           <span className="text-pretty">
                              <span className="font-semibold">{cw.courseName}</span>, <span className="italic">{cw.institution}</span>
                           </span>
                           <span className="font-sans text-slate-500 shrink-0 text-xs text-end" dir="auto">{cw.year}</span>
                        </div>
                      </li>
                    ))}
                 </ul>
               </div>
            )}

            {/* Volunteering Section */}
            {data.volunteering.length > 0 && (
               <div className="mt-4">
                 <h2 className={getHeadingStyle()}>{language === 'fa' ? 'خدمات، افتخارات و فعالیت‌های داوطلبانه' : 'Service & Volunteering'}</h2>
                 <ul className={`list-disc list-outside ms-4 text-sm text-slate-800 space-y-1 ${theme === 'compact' ? 'space-y-0.5' : ''}`}>
                    {data.volunteering.map(vol => (
                      <li key={vol.id} className="break-inside-avoid ps-1">
                        <div className="flex justify-between items-baseline gap-2">
                           <span className="text-pretty">
                              <span className="font-semibold">{vol.role}</span>, {vol.organization}
                           </span>
                           <span className="font-sans text-slate-500 shrink-0 text-xs text-end" dir="auto">{vol.period}</span>
                        </div>
                        {vol.description && <div className="text-slate-600 italic block mt-0.5">{vol.description}</div>}
                      </li>
                    ))}
                 </ul>
               </div>
            )}

            {/* Affiliations Section */}
            {data.affiliations.length > 0 && (
               <div className="mt-4">
                 <h2 className={getHeadingStyle()}>{language === 'fa' ? 'عضویت در انجمن‌های تخصصی' : 'Professional Affiliations'}</h2>
                 <ul className={`list-disc list-outside ms-4 text-sm text-slate-800 space-y-1 ${theme === 'compact' ? 'space-y-0.5' : ''}`}>
                    {data.affiliations.map(aff => (
                      <li key={aff.id} className="break-inside-avoid ps-1">
                        <div className="flex justify-between items-baseline gap-2">
                           <span className="text-pretty">
                              <span className="font-semibold">{aff.organization}</span> — <span className="italic">{aff.role}</span>
                           </span>
                           <span className="font-sans text-slate-500 shrink-0 text-xs text-end" dir="auto">{aff.period}</span>
                        </div>
                      </li>
                    ))}
                 </ul>
               </div>
            )}

            {/* Technical Skills Section */}
            {data.skills.length > 0 && (
               <div className="break-inside-avoid mt-4">
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'مهارت‌ها' : 'Skills'}</h2>
                <div className={`grid ${theme === 'compact' ? 'gap-y-1' : 'gap-y-2'} gap-x-4 text-sm`}>
                   {data.skills.map(sk => (
                     <div key={sk.id} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr]">
                       <div className="font-semibold text-slate-900 pr-2">
                         {sk.category || 'Category'}
                       </div>
                       <div className="text-slate-700 break-words">
                         {sk.items || 'Skill items...'}
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {data.languages.length > 0 && (
               <div className="break-inside-avoid mt-4">
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'زبان‌ها' : 'Languages'}</h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm`}>
                   {data.languages.map(lang => (
                     <div key={lang.id} className="flex">
                       <span className="font-semibold text-slate-900 w-32 shrink-0">{lang.name}</span>
                       <span className="text-slate-700">{lang.proficiency}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* References Section */}
            {data.references.length > 0 && (
               <div className="break-inside-avoid mt-4">
                <h2 className={getHeadingStyle()}>{language === 'fa' ? 'معرف‌ها' : 'References'}</h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm`}>
                   {data.references.map(ref => (
                     <div key={ref.id} className="flex flex-col">
                       <span className="font-semibold text-slate-900">{ref.name}</span>
                       <span className="text-slate-700 italic">{ref.title}</span>
                       <span className="text-slate-700">{ref.institution}</span>
                       <span className="text-indigo-600 font-sans">{ref.email}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
            
            {/* Raw TeX Preview at bottom */}
            <div className="mt-auto pt-16 border-t border-slate-100 break-inside-avoid no-print hidden">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 relative overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex items-center gap-2 mb-2">
                  <FileCode2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Generated LaTeX Output</span>
                </div>
                <pre className="text-[10px] text-slate-600 font-mono leading-relaxed overflow-x-auto p-2">
                  {generateLatexString(data, language).substring(0, 500)}...
                </pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

export default PreviewPane;
