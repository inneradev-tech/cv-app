export interface EducationInfo {
  id: string;
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  thesis: string;
  advisors: string;
}

export interface PublicationInfo {
  id: string;
  title: string;
  authors: string;
  journal: string; // Used for Journal, Conference, Book title, or Patent number depending on type
  type: 'Journal' | 'Conference' | 'Book' | 'Book Chapter' | 'Patent' | 'Oral Presentation' | 'Poster Presentation';
  status: string; // e.g. Published, Under Review, Ongoing, In Press, or a year
  year?: string;
  doi?: string;
  isbn?: string; // Used for Book and Book Chapter
}

export interface SkillInfo {
  id: string;
  category: string;
  items: string;
}

export interface GrantInfo {
  id: string;
  name: string;
  role: string;
  funder: string;
  amount: string;
  period: string;
}

export interface TeachingInfo {
  id: string;
  course: string;
  role: string;
  institution: string;
  period: string;
}

export interface ExperienceInfo {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
}

export interface VolunteerInfo {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface CourseworkInfo {
  id: string;
  courseName: string;
  institution: string;
  year: string;
}

export interface ReferenceInfo {
  id: string;
  name: string;
  title: string;
  institution: string;
  email: string;
}

export interface AffiliationInfo {
  id: string;
  organization: string;
  role: string;
  period: string;
}

export interface LanguageInfo {
  id: string;
  name: string;
  proficiency: string;
}

export interface PersonalInfo {
  name: string;
  highlightName: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  scholar: string;
  orcid: string;
  department: string;
  researchInterests: string;
}

export interface CVData {
  personal: PersonalInfo;
  education: EducationInfo[];
  publications: PublicationInfo[];
  grants: GrantInfo[];
  teaching: TeachingInfo[];
  experience: ExperienceInfo[];
  volunteering: VolunteerInfo[];
  coursework: CourseworkInfo[];
  affiliations: AffiliationInfo[];
  references: ReferenceInfo[];
  languages: LanguageInfo[];
  skills: SkillInfo[];
}

export const initialCVData: CVData = {
  personal: {
    name: 'Dr. Jane Doe',
    highlightName: 'Doe, J.',
    email: 'jane.doe@university.edu',
    phone: '(555) 123-4567',
    website: 'https://janedoe.ac.ir',
    github: 'github.com/janedoe',
    linkedin: 'linkedin.com/in/janedoe',
    scholar: 'scholar.google.com/xyz',
    orcid: 'orcid.org/0000-0001-2345-6789',
    department: 'Department of Computer Science, University of Technology',
    researchInterests: 'Machine Learning, CV Parsing, Academic Typesetting'
  },
  education: [
    {
      id: 'ed-1',
      degree: 'Ph.D. in Computer Science',
      institution: 'University of Technology',
      period: '2020 — 2024',
      gpa: '4.0/4.0',
      thesis: 'Machine Learning Applications in Academic Typesetting and Document Parsing',
      advisors: 'Prof. Alan Turing, Prof. Ada Lovelace'
    },
    {
      id: 'ed-2',
      degree: 'M.Sc. in Computer Science',
      institution: 'University of Science',
      period: '2018 — 2020',
      gpa: '3.9/4.0',
      thesis: '',
      advisors: ''
    }
  ],
  publications: [
    {
      id: 'pub-1',
      title: 'A novel approach to CV parsing using Large Language Models',
      authors: 'Doe, J., Smith, A., and Johnson, B.',
      journal: 'Journal of Academic Technology',
      type: 'Journal',
      status: 'Published',
      doi: '10.1000/xyz123'
    },
    {
      id: 'pub-2',
      title: 'Automated Citation Formatting via WebAssembly LaTeX Engines',
      authors: 'Williams, R., Doe, J.',
      journal: 'International Conference on Typesetting',
      type: 'Conference',
      status: 'Under Review',
      doi: ''
    },
    {
      id: 'pub-3',
      title: 'Advanced AI and Academic Engineering',
      authors: 'Doe, J., Peterson, M.',
      journal: 'Tech Publishing House',
      type: 'Book',
      status: 'Published',
      doi: '10.1000/book456',
      isbn: '978-3-16-148410-0'
    }
  ],
  grants: [
    {
      id: 'gr-1',
      name: 'Visionary Science Fellowship',
      role: 'Principal Investigator',
      funder: 'National Science Foundation',
      amount: '$150,000',
      period: '2023 — 2025'
    }
  ],
  teaching: [
    {
      id: 'te-1',
      course: 'CS 401: Advanced Compilers',
      role: 'Guest Lecturer',
      institution: 'University of Technology',
      period: 'Fall 2023'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Postdoctoral Research Associate',
      organization: 'Institute of AI',
      location: 'New York, USA',
      period: '2024 — Present',
      description: 'Researching novel architectures for real-time document compilation.'
    },
    {
      id: 'exp-2',
      role: 'Software Engineering Intern',
      organization: 'Tech Giant Inc.',
      location: 'San Francisco, CA',
      period: 'Summer 2019',
      description: 'Developed scalable machine learning models for internal tools.'
    }
  ],
  volunteering: [
    {
      id: 'vol-1',
      role: 'Reviewer',
      organization: 'International Conference on Machine Learning (ICML)',
      period: '2022 — Present',
      description: ''
    }
  ],
  coursework: [
    {
      id: 'cw-1',
      courseName: 'Deep Learning Specialization',
      institution: 'Coursera / deeplearning.ai',
      year: '2021'
    }
  ],
  affiliations: [
    {
      id: 'aff-1',
      organization: 'IEEE Computer Society',
      role: 'Member',
      period: '2020 — Present'
    }
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Prof. Alan Turing',
      title: 'Professor of Computer Science',
      institution: 'University of Technology',
      email: 'a.turing@university.edu'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Fluent (IELTS 8.0)' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Intermediate (B2)' }
  ],
  skills: [
    { id: 'sk-1', category: 'Languages', items: 'Python, Rust, TypeScript, C++, MATLAB' },
    { id: 'sk-2', category: 'Frameworks', items: 'React, Node.js, PyTorch, TensorFlow' },
    { id: 'sk-3', category: 'Tools', items: 'LaTeX, Git, Docker, AWS, WebAssembly' }
  ]
};
