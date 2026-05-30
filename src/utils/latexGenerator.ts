import { CVData } from '../types';

export function generateLatex(cv: CVData, language: 'en' | 'fa'): string {
  const isFa = language === 'fa';
  
  // Basic escaping for LaTeX special characters
  const escapeLatex = (text: string | null | undefined) => {
    if (!text) return '';
    return text
      .split('\\').join('\\textbackslash ')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde ')
      .replace(/\^/g, '\\textasciicircum ')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}');
  };

  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[top=1in,bottom=1in,left=1in,right=1in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{fontawesome5}
\\usepackage{parskip}

% Styling
\\definecolor{primary}{RGB}{30, 58, 138} % Dark blue
\\definecolor{borderbox}{RGB}{230, 230, 230}

% Section format
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{}[\\vspace{-0.5ex}\\textcolor{borderbox}{\\rule{\\textwidth}{1pt}}]
\\titlespacing{\\section}{0pt}{1.5ex plus 1ex minus .2ex}{1ex plus .2ex}

\\setlength{\\parindent}{0pt}
`;

  if (isFa) {
    latex += `
% Persian Configuration
\\usepackage{xepersian}
\\settextfont[Scale=1.1, Path=./, Extension=.ttf]{Vazirmatn-Regular} % Or any available Persian font
\\setlatintextfont{Times New Roman}
`;
  }

  latex += `
\\begin{document}
\\pagestyle{empty}

% --- Header ---
\\begin{center}
    {\\Huge \\textbf{\\color{primary} ${escapeLatex(cv.personal.name)}}} \\\\
    \\vspace{1ex}
    \\small{
    \\href{mailto:${escapeLatex(cv.personal.email)}}{\\faEnvelope~${escapeLatex(cv.personal.email)}}
`;

  if (cv.personal.phone) {
    latex += `    \\quad\\textbar\\quad \\dir{\\faPhone~${escapeLatex(cv.personal.phone)}}\n`;
  }
  if (cv.personal.website) {
    latex += `    \\quad\\textbar\\quad \\href{${escapeLatex(cv.personal.website)}}{\\faGlobe~${escapeLatex(cv.personal.website)}}\n`;
  }
  if (cv.personal.linkedin) {
    latex += `    \\quad\\textbar\\quad \\href{${escapeLatex(cv.personal.linkedin)}}{\\faLinkedin~LinkedIn}\n`;
  }
  if (cv.personal.github) {
    latex += `    \\quad\\textbar\\quad \\href{${escapeLatex(cv.personal.github)}}{\\faGithub~GitHub}\n`;
  }
  if (cv.personal.scholar) {
    latex += `    \\quad\\textbar\\quad \\href{${escapeLatex(cv.personal.scholar)}}{\\faGraduationCap~Scholar}\n`;
  }
  if (cv.personal.orcid) {
    latex += `    \\quad\\textbar\\quad \\href{${escapeLatex(cv.personal.orcid)}}{\\faLink~ORCID: ${escapeLatex(cv.personal.orcid.replace(/^https?:\/\//, '').replace('orcid.org/', ''))}}\n`;
  }
  
  latex += `    }
\\end{center}
\\vspace{1.5ex}
`;

  if (cv.education && cv.education.length > 0) {
    latex += `
\\section*{${isFa ? 'تحصیلات' : 'Education'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1ex]
`;
    cv.education.forEach((ed) => {
      latex += `  \\item \\textbf{${escapeLatex(ed.degree)}} \\hfill \\textbf{${escapeLatex(ed.period)}} \\\\
  \\textit{${escapeLatex(ed.institution)}}`;
      if (ed.gpa) latex += ` \\hfill \\small{GPA: ${escapeLatex(ed.gpa)}}`;
      latex += ` \\\\`;
      if (ed.thesis) latex += `\n  \\textbf{${isFa ? 'پایان‌نامه' : 'Thesis'}:} ${escapeLatex(ed.thesis)} \\\\`;
      if (ed.advisors) latex += `\n  \\textbf{${isFa ? 'استاد راهنما' : 'Advisor(s)'}:} ${escapeLatex(ed.advisors)}`;
      latex += `\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.experience && cv.experience.length > 0) {
    latex += `
\\section*{${isFa ? 'سوابق کاری' : 'Experience'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1.5ex]
`;
    cv.experience.forEach((exp) => {
      latex += `  \\item \\textbf{${escapeLatex(exp.role)}} \\hfill \\textbf{${escapeLatex(exp.period)}} \\\\
  \\textit{${escapeLatex(exp.organization)}${exp.location ? `, ${escapeLatex(exp.location)}` : ''}}
`;
      if (exp.description) {
        latex += `  \\vspace{0.5ex}\\\\
  ${escapeLatex(exp.description)}
`;
      }
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.publications && cv.publications.length > 0) {
    latex += `
\\section*{${isFa ? 'انتشارات' : 'Publications'}}
`;
    const grouped = {
      'Journal': cv.publications.filter(p => p.type === 'Journal'),
      'Conference': cv.publications.filter(p => p.type === 'Conference'),
      'Book': cv.publications.filter(p => p.type === 'Book'),
      'Book Chapter': cv.publications.filter(p => p.type === 'Book Chapter'),
      'Oral Presentation': cv.publications.filter(p => p.type === 'Oral Presentation'),
      'Poster Presentation': cv.publications.filter(p => p.type === 'Poster Presentation'),
      'Patent': cv.publications.filter(p => p.type === 'Patent')
    };

    const pubSections = [
      { key: 'Journal', titleEn: 'Journal Articles', titleFa: 'مقالات چاپ شده در مجلات' },
      { key: 'Conference', titleEn: 'Conference Proceedings', titleFa: 'مقالات کنفرانسی' },
      { key: 'Book', titleEn: 'Books', titleFa: 'کتاب‌ها' },
      { key: 'Book Chapter', titleEn: 'Book Chapters', titleFa: 'عناوین فصول کتاب' },
      { key: 'Oral Presentation', titleEn: 'Oral Presentations', titleFa: 'ارائه‌های شفاهی' },
      { key: 'Poster Presentation', titleEn: 'Poster Presentations', titleFa: 'ارائه‌های پوستری' },
      { key: 'Patent', titleEn: 'Patents', titleFa: 'اختراعات' }
    ];

    pubSections.forEach(section => {
      const pubs = grouped[section.key as keyof typeof grouped];
      if (pubs && pubs.length > 0) {
        latex += `\\vspace{1ex}\\noindent\\textbf{\\large ${isFa ? section.titleFa : section.titleEn}}\\\\
\\begin{itemize}[leftmargin=1.5em, label=\\textbullet, itemsep=0.5ex]\n`;
        pubs.forEach(pub => {
          let authorStr = escapeLatex(pub.authors);
          if (cv.personal.highlightName) {
            let hName = escapeLatex(cv.personal.highlightName);
            authorStr = authorStr.split(hName).join(`\\textbf{${hName}}`);
          } else if (cv.personal.name) {
            let lastName = escapeLatex(cv.personal.name.trim().split(' ').pop() || '');
            if (lastName.length > 2) {
               authorStr = authorStr.split(lastName).join(`\\textbf{${lastName}}`);
            }
          }
          
          latex += `  \\item ${authorStr}. "${escapeLatex(pub.title)}." \\textit{${escapeLatex(pub.journal)}}`;
          if (pub.year) latex += ` \\textbf{(${escapeLatex(pub.year)})}`;
          if (pub.status && pub.status !== 'Published') latex += ` [${escapeLatex(pub.status)}]`;
          latex += `\n`;
          if (pub.doi || pub.isbn) {
            latex += `    \\\\\\scriptsize{`;
            if (pub.doi) latex += `\\textcolor{primary}{DOI: ${escapeLatex(pub.doi)}} `;
            if (pub.isbn) latex += `\\textcolor{primary}{ISBN: ${escapeLatex(pub.isbn)}} `;
            latex += `}\n`;
          }
        });
        latex += `\\end{itemize}\n`;
      }
    });
  }
  
  if (cv.grants && cv.grants.length > 0) {
    latex += `
\\section*{${isFa ? 'بودجه‌های پژوهشی و افتخارات' : 'Grants, Awards \\& Honors'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1ex]
`;
    cv.grants.forEach((gr) => {
      latex += `  \\item \\textbf{${escapeLatex(gr.name)}} \\hfill \\textbf{${escapeLatex(gr.period)}} \\\\
  \\textit{${escapeLatex(gr.funder)}}`;
      if (gr.amount) latex += ` (${escapeLatex(gr.amount)})`;
      if (gr.role) latex += ` \\\\ ${escapeLatex(gr.role)}`;
      latex += `\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.teaching && cv.teaching.length > 0) {
    latex += `
\\section*{${isFa ? 'تدریس' : 'Teaching Experience'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1ex]
`;
    cv.teaching.forEach(te => {
      latex += `  \\item \\textbf{${escapeLatex(te.course)}} \\hfill \\textbf{${escapeLatex(te.period)}} \\\\
  \\textit{${escapeLatex(te.role)}} at ${escapeLatex(te.institution)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.coursework && cv.coursework.length > 0) {
    latex += `
\\section*{${isFa ? 'دوره‌های آموزشی و گواهینامه‌ها' : 'Coursework \\& Certifications'}}
\\begin{itemize}[leftmargin=1.5em, label=\\textbullet, itemsep=0.5ex]
`;
    cv.coursework.forEach(cw => {
      latex += `  \\item \\textbf{${escapeLatex(cw.courseName)}}, \\textit{${escapeLatex(cw.institution)}} \\hfill ${escapeLatex(cw.year)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.volunteering && cv.volunteering.length > 0) {
    latex += `
\\section*{${isFa ? 'فعالیت‌های داوطلبانه' : 'Service \\& Volunteering'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1ex]
`;
    cv.volunteering.forEach(vol => {
      latex += `  \\item \\textbf{${escapeLatex(vol.role)}}, ${escapeLatex(vol.organization)} \\hfill \\textbf{${escapeLatex(vol.period)}}\n`;
      if (vol.description) latex += `  \\\\${escapeLatex(vol.description)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.affiliations && cv.affiliations.length > 0) {
    latex += `
\\section*{${isFa ? 'عضویت در انجمن‌ها' : 'Professional Affiliations'}}
\\begin{itemize}[leftmargin=1.5em, label=\\textbullet, itemsep=0.5ex]
`;
    cv.affiliations.forEach(aff => {
      latex += `  \\item \\textbf{${escapeLatex(aff.organization)}} --- \\textit{${escapeLatex(aff.role)}} \\hfill ${escapeLatex(aff.period)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.skills && cv.skills.length > 0) {
    latex += `
\\section*{${isFa ? 'مهارت‌ها' : 'Technical Skills'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=0.5ex]
`;
    cv.skills.forEach(sk => {
      latex += `  \\item \\textbf{${escapeLatex(sk.category)}:} ${escapeLatex(sk.items)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.languages && cv.languages.length > 0) {
    latex += `
\\section*{${isFa ? 'زبان‌ها' : 'Languages'}}
\\begin{itemize}[leftmargin=1.5em, label=\\textbullet, itemsep=0.5ex]
`;
    cv.languages.forEach(lang => {
      latex += `  \\item \\textbf{${escapeLatex(lang.name)}:} ${escapeLatex(lang.proficiency)}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  if (cv.references && cv.references.length > 0) {
    latex += `
\\section*{${isFa ? 'معرف‌ها' : 'References'}}
\\begin{itemize}[leftmargin=0pt, label={}, itemsep=1.5ex]
`;
    cv.references.forEach(ref => {
      latex += `  \\item \\textbf{${escapeLatex(ref.name)}} \\\\
  \\textit{${escapeLatex(ref.title)}}, ${escapeLatex(ref.institution)} \\\\
  \\dir{\\faEnvelope~${escapeLatex(ref.email)}}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  latex += `
\\end{document}
`;

  // Fix up dir wrapper for xepersian phone/email rendering LTR inside RTL context
  if (isFa) {
    latex = latex.replace(/\\dir{/g, '\\lr{');
  } else {
    latex = latex.replace(/\\dir{/g, '{');
  }

  return latex;
}
