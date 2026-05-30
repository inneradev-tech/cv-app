import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, X, Plus } from 'lucide-react';
import { CVData, initialCVData } from '../types';

interface Project {
  id: string;
  name: string;
  data: CVData;
  lastUpdated: number;
}

interface ProjectManagerProps {
  currentData: CVData;
  onLoadProject: (data: CVData) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProjectManager({ currentData, onLoadProject, isOpen, setIsOpen }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('academics_cv_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('academics_cv_projects', JSON.stringify(newProjects));
  };

  const handleSaveCurrent = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      data: currentData,
      lastUpdated: Date.now()
    };
    saveProjects([...projects, newProject]);
    setNewProjectName('');
  };

  const handleUpdateProject = (id: string) => {
    const updated = projects.map(p => 
      p.id === id ? { ...p, data: currentData, lastUpdated: Date.now() } : p
    );
    saveProjects(updated);
  };

  const handleDelete = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold flex items-center gap-2"><FolderOpen className="w-5 h-5" /> Saved Resumes</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="p-4 border-b border-slate-200 flex gap-2">
          <input 
            type="text" 
            placeholder="Name for current resume (e.g., Postdoc Application 2026)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrent()}
          />
          <button 
            onClick={handleSaveCurrent}
            disabled={!newProjectName.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Plus className="w-4 h-4"/> Save New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No saved resumes found.</div>
          ) : (
            projects.sort((a,b) => b.lastUpdated - a.lastUpdated).map(proj => (
              <div key={proj.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between group">
                <div>
                  <h3 className="font-semibold text-slate-800">{proj.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Last updated: {new Date(proj.lastUpdated).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { onLoadProject(proj.data); setIsOpen(false); }}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    Load
                  </button>
                  <button 
                    onClick={() => handleUpdateProject(proj.id)}
                    className="text-xs px-3 py-1.5 bg-slate-50 text-slate-700 font-medium rounded-md hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
                    title="Overwrite this saved project with your current editor data"
                  >
                    <Save className="w-3 h-3"/> Overwrite
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
