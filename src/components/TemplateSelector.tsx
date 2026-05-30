import React from 'react';
import { Type, LayoutTemplate, Globe } from 'lucide-react';
import { LayoutTheme, TypographyStyle, Language } from '../App';

interface TemplateSelectorProps {
  theme: LayoutTheme;
  setTheme: (theme: LayoutTheme) => void;
  font: TypographyStyle;
  setFont: (font: TypographyStyle) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function TemplateSelector({ theme, setTheme, font, setFont, language, setLanguage }: TemplateSelectorProps) {
  
  const themes = [
    {
      id: 'classic',
      name: 'Classic Academic',
      description: 'Best for STEM, CS, and Engineering fields. Highly structured and easy for search committees to scan quickly.'
    },
    {
      id: 'minimalist',
      name: 'Minimalist / Plain',
      description: 'Best for Ivy League applications, Medicine, Psychology, and Humanities. Focuses purely on content without any decorative lines.',
    },
    {
      id: 'compact',
      name: 'Compact / Content-Dense',
      description: 'Best for Postdoc and Faculty roles. Optimizes margins and spacing to pack maximum publications and grants without adding empty pages.',
    },
    {
      id: 'modern',
      name: 'Modern Accent',
      description: 'Clean modern layout with subtle color accents and spacing. Great for industry transition or modern tech roles.',
    },
    {
      id: 'elegant',
      name: 'Elegant Serif',
      description: 'A deeply aesthetic, highly-crafted layout suitable for Art History, Architecture, or Literature applications.',
    },
    {
      id: 'academic',
      name: 'Strict Academic',
      description: 'Based on standard format. Optimized for ATS, clear hierarchy, no distracting graphics. Ideal for multi-disciplinary clinical and technological researchers.',
    }
  ];

  return (
    <div className="w-1/2 max-w-2xl flex flex-col border-r border-slate-200 bg-slate-50 no-print h-full">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Theme Engine</h1>
        <p className="text-slate-500 text-sm mt-1">Select an academic layout and typography</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        
        {/* Language Selection */}
        <section>
          <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
             <Globe className="w-5 h-5 text-indigo-500" /> Document Language
          </h3>
          <div className="flex gap-4">
            <button
               onClick={() => setLanguage('en')}
               className={`flex-1 p-4 rounded-xl text-left border-2 transition-all ${language === 'en' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="font-bold text-lg text-slate-900">English (LTR)</div>
              <div className="text-sm text-slate-500 mt-1">Standard Left-to-Right layout.</div>
            </button>
            <button
               onClick={() => setLanguage('fa')}
               className={`flex-1 p-4 rounded-xl text-left border-2 transition-all ${language === 'fa' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="font-bold border-b border-slate-100 pb-1 text-lg text-slate-900 mb-2 font-['Vazirmatn'] text-right" dir="rtl">فارسی (RTL)</div>
              <div className="text-sm text-slate-500 text-right font-['Vazirmatn']" dir="rtl">راست‌چین با فونت تخصصی دانشگاهی (وزیرمتن).</div>
            </button>
          </div>
        </section>

        {/* Layout Selection */}
        <section>
          <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
             <LayoutTemplate className="w-5 h-5 text-indigo-500" /> Layout Theme
          </h3>
          <div className="space-y-4">
            {themes.map((t) => (
               <button
                 key={t.id}
                 onClick={() => setTheme(t.id as any)}
                 className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                   theme === t.id 
                     ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                     : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                 }`}
               >
                 <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${theme === t.id ? 'text-indigo-900' : 'text-slate-800 group-hover:text-indigo-900'}`}>{t.name}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === t.id ? 'border-indigo-500' : 'border-slate-300'}`}>
                      {theme === t.id && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </div>
                 </div>
                 <p className={`text-sm leading-relaxed ${theme === t.id ? 'text-indigo-700/80' : 'text-slate-500'}`}>
                   {t.description}
                 </p>
               </button>
            ))}
          </div>
        </section>

        {/* Typography Selection */}
        <section>
          <h3 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
             <Type className="w-5 h-5 text-indigo-500" /> Typography
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button
               onClick={() => setFont('serif')}
               className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${
                 font === 'serif'
                   ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                   : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
               }`}
             >
                <span className="font-serif text-3xl text-slate-900">Ag</span>
                <div>
                   <div className="font-bold text-slate-800 font-serif">Serif Font</div>
                   <div className="text-xs text-slate-400 mt-1">Times / Palatino</div>
                </div>
             </button>
             
             <button
               onClick={() => setFont('sans')}
               className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${
                 font === 'sans'
                   ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                   : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
               }`}
             >
                <span className="font-sans text-3xl font-medium text-slate-900">Ag</span>
                <div>
                   <div className="font-bold text-slate-800 font-sans">Sans-Serif</div>
                   <div className="text-xs text-slate-400 mt-1">Helvetica / Arial</div>
                </div>
             </button>

             <button
               onClick={() => setFont('mono')}
               className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${
                 font === 'mono'
                   ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                   : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
               }`}
             >
                <span className="font-mono text-3xl font-medium text-slate-900">Ag</span>
                <div>
                   <div className="font-bold text-slate-800 font-mono">Monospace</div>
                   <div className="text-xs text-slate-400 mt-1">Fira / JetBrains</div>
                </div>
             </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 bg-blue-50 text-blue-800 p-3 rounded-md border border-blue-100">
             <strong>Tip:</strong> Serif fonts are preferred in Medicine, Law, and traditional academia. Sans-serif and Monospace fonts are increasingly popular in Tech and CS for their clean screen readability.
          </p>
        </section>

      </div>
    </div>
  );
}
