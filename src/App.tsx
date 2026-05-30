/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PreviewPane from './components/PreviewPane';
import BuilderPane from './components/BuilderPane';
import TemplateSelector from './components/TemplateSelector';
import AiAssistant from './components/AiAssistant';
import ProjectManager from './components/ProjectManager';
import { Download, Printer, Settings, Upload, CheckCircle2, Sparkles, Save, FolderOpen, FileText } from 'lucide-react';
import { CVData, initialCVData } from './types';

export type LayoutTheme = 'classic' | 'minimalist' | 'compact' | 'modern' | 'elegant' | 'academic';
export type TypographyStyle = 'serif' | 'sans' | 'mono';
export type Language = 'en' | 'fa';

export default function App() {
  const printRef = useRef<HTMLDivElement>(null);
  
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates' | 'parser'>('editor');
  const [toastMessage, setToastMessage] = useState('');
  
  // Load initial data from localStorage if exists
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('current_cv_data');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        return {
          ...initialCVData,
          ...parsed,
          education: parsed.education || [],
          experience: parsed.experience || [],
          languages: parsed.languages || [],
          skills: parsed.skills || [],
          publications: parsed.publications || [],
          grants: parsed.grants || [],
          teaching: parsed.teaching || [],
          volunteering: parsed.volunteering || [],
          coursework: parsed.coursework || [],
          affiliations: parsed.affiliations || [],
          references: parsed.references || []
        };
      } catch (e) { console.error(e); }
    }
    return initialCVData;
  });
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [theme, setTheme] = useState<LayoutTheme>('classic');
  const [font, setFont] = useState<TypographyStyle>('serif');
  const [language, setLanguage] = useState<Language>('en');
  const [apiBaseUrl, setApiBaseUrl] = useState('https://generativelanguage.googleapis.com/v1beta/openai/');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.5-flash');

  // Auto-save
  useEffect(() => {
    localStorage.setItem('current_cv_data', JSON.stringify(cvData));
  }, [cvData]);

  const handlePrintAction = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'AcademiCV_Export',
    onAfterPrint: () => {
       setIsCompiling(false);
       setToastMessage("Printed successfully.");
       setTimeout(() => setToastMessage(''), 3000);
    },
    onPrintError: (error) => {
       setIsCompiling(false);
       setToastMessage("Print dialog was blocked. Please click 'Open in New Tab'.");
       setTimeout(() => setToastMessage(''), 5000);
    }
  });

  const downloadPDF = async () => {
    setIsCompiling(true);
    setToastMessage("Preparing PDF Document... This may take a moment.");
    
    setTimeout(async () => {
      try {
        const element = printRef.current;
        if (!element) {
          throw new Error("Preview pane not found");
        }
        
        const originalTransform = element.style.transform;
        element.style.transform = 'none';

        // Ensure element is visible
        const canvas = await html2canvas(element, {
          scale: 4, // High-res PDF
          useCORS: true,
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });
        
        element.style.transform = originalTransform;
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let position = 0;
        let leftHeight = pdfHeight;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        leftHeight -= pageHeight;
        
        while (leftHeight > 0) {
          position = leftHeight - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          leftHeight -= pageHeight;
        }
        
        pdf.save('AcademiCV_Export.pdf');
        
        setToastMessage("PDF downloaded successfully.");
        // Try native print as bonus if outside iframe
        if (window.self === window.top) {
           handlePrintAction();
        }
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to generate PDF. Trying native print...");
        if (window.self === window.top) {
           handlePrintAction();
        } else {
           setToastMessage("Failed to generate PDF. Please open in a new tab to use native print.");
        }
      } finally {
        setTimeout(() => setToastMessage(''), 5000);
        setIsCompiling(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white print-area-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 text-sm animate-in fade-in slide-in-from-top-4 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Application Bar */}
      <header className="h-14 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white font-serif">
            A
          </div>
          <span className="font-semibold tracking-wide flex items-center gap-2">
            AcademiCV
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-500/30">
              Beta
            </span>
          </span>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeTab === 'editor' ? 'bg-indigo-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Editor
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeTab === 'templates' ? 'bg-indigo-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" /> Themes
          </button>
          <button 
            onClick={() => setActiveTab('parser')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeTab === 'parser' ? 'bg-indigo-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            <Sparkles className="w-4 h-4" /> AI Assistant
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsProjectManagerOpen(true)}
            className="text-slate-300 hover:text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors border border-slate-700 hover:border-slate-500 bg-slate-800"
          >
            <FolderOpen className="w-4 h-4" /> Resumes
          </button>
          
          <button 
            onClick={downloadPDF}
            disabled={isCompiling}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow flex items-center gap-2 transition-colors"
          >
            {isCompiling ? (
               <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isCompiling ? 'Compiling PDF...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <ProjectManager 
        currentData={cvData}
        onLoadProject={setCvData}
        isOpen={isProjectManagerOpen}
        setIsOpen={setIsProjectManagerOpen}
      />

      {/* Main Split Interface */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Configurable based on tab */}
        <div className="no-print contents">
          {activeTab === 'editor' && <BuilderPane data={cvData} onChange={setCvData} />}
          {activeTab === 'templates' && (
            <TemplateSelector 
              theme={theme} 
              setTheme={setTheme} 
              font={font} 
              setFont={setFont} 
              language={language}
              setLanguage={setLanguage}
            />
          )}
          {activeTab === 'parser' && (
            <AiAssistant
              cvData={cvData}
              setCvData={setCvData}
              setLanguage={setLanguage}
              apiBaseUrl={apiBaseUrl}
              setApiBaseUrl={setApiBaseUrl}
              apiKey={apiKey}
              setApiKey={setApiKey}
              modelName={modelName}
              setModelName={setModelName}
            />
          )}
        </div>

        {/* Right Pane: Live PDF Preview */}
        <div className="flex-1 h-full min-w-0 bg-slate-100 relative print-area-wrapper">
          <PreviewPane ref={printRef} data={cvData} isCompiling={isCompiling} theme={theme} font={font} language={language} />
        </div>
      </main>
    </div>
  );
}
