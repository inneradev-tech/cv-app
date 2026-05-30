# AcademiCV: Product Architecture & Development Roadmap

## Core Concept
A specialized web platform that bridges the gap between MS Word and LaTeX for academic applicants, eliminating the LaTeX learning curve while generating high-quality, compile-ready, and ATS-compliant CVs.

---

## 1. Ideal Tech Stack

### Frontend (Client-Side)
*   **Framework:** React 19 + Vite (TypeScript) for a fast, modular, and component-driven architecture.
*   **Styling:** Tailwind CSS for building a minimal, clean, utility-first interface that aligns with academic aesthetics (no flamboyant UI).
*   **State Management:** Zustand for managing complex, deeply nested CV data structures (sections, entries, items) without prop drilling.
*   **Drag-and-Drop:** `@hello-pangea/dnd` for fluid section and item reordering.

### Backend (API & Data Processing)
*   **Framework:** Node.js + Express (TypeScript) deployed on serverless/auto-scaling containers.
*   **Database:** PostgreSQL (Cloud SQL or Supabase) for structured academic data, utilizing `JSONB` for flexible document structures.
*   **AI & Parsing:** Python service utilizing `pdfminer`/`python-docx` for document parsing, and integration with LLMs to structure text.

### LaTeX Compilation Engine
*   **Primary (Server-Side):** **Tectonic (Rust-based LaTeX engine)**. Tectonic is lightweight, self-contained, and pulls packages on the fly.
*   **Alternative (Client-Side Fallback):** **WebAssembly LaTeX (e.g., SwiftLaTeX or pdfTeX.js)**. Allows in-browser compilation.

---

## 2. Database Schema Strategy (PostgreSQL)

A hybrid relational and document approach works best for modular documents.

*   `users`: `id`, `email`, `name`, `google_scholar_id`, `orcid`, `created_at`
*   `cv_documents`: `id`, `user_id`, `title`, `layout_theme` (classic, minimalist, compact), `typography_style` (serif, sans), `margin_size`, `created_at`
*   `cv_sections`: `id`, `cv_document_id`, `section_type` (education, publications, grants, etc.), `order_index`, `is_visible`
*   `cv_entries`: `id`, `section_id`, `type`, `order_index`, `data` (JSONB).
    *   *Example JSONB for Publication:* `{"title": "...", "authors": ["..."], "status": "published", "doi": "...", "year": 2023}`

---

## 3. Technical Bottlenecks & Production-Ready Workarounds

### Bottleneck 1: LaTeX Rendering Speed & Server Load
*   **The Issue:** Compiling LaTeX on a server for a split-screen "real-time" WYSIWYG preview on every keystroke will overwhelm backend resources and cause latency.
*   **The Workaround:** 
    *   **Fake it till you make it:** Render the real-time split-screen preview using HTML/CSS (Tailwind) that visually mimics the chosen LaTeX template exactly. 
    *   **Debounced Compilation:** Only trigger the actual expensive Tectonic LaTeX-to-PDF compilation when the user pauses typing for >2 seconds, or when they explicitly click "Update PDF".

### Bottleneck 2: MS Word (DOCX) Parsing Accuracy
*   **The Issue:** MS Word CVs are highly unstructured. Standard regex or NLP will fail to accurately categorize paragraphs into structured fields.
*   **The Workaround:** 
    *   **LLM Intermediary:** Extract the raw text from the DOCX file and pass it to an LLM with a strict System Prompt to output validated JSON matching our database schema.
    *   **Human-in-the-Loop (Interactive UI Editor):** Present the LLM-parsed JSON inside the Builder Form as "Drafts" so the user can review, correct, and approve the data mapping in the split-screen view.

### Bottleneck 3: Citation Formatting & Smart Author Highlighting
*   **The Issue:** Highlighting the user's name in a messy string of authors ("Smith, John A.", "J. Smith", "Smith JA") to apply `\textbf{}` in LaTeX.
*   **The Workaround:** Implement a fuzzy string matching algorithm (e.g., Levenshtein distance) in the backend that normalizes author strings and compares them against variations of the user's profile name.

---

## 4. Development Roadmap

### Phase 1: Core Foundation & UI Interactivity (Weeks 1-4)
*   **Define Schema:** Finalize the JSON structures for Education, Research Interests, Publications, Grants & Awards, Teaching/Mentoring, Professional Affiliations, Patents, and References.
*   **Templates & Typography:** Develop 3 core themes (Classic, Minimalist, Compact) with Serif/Sans-Serif toggles and margin controls. Implement guided selection UI cards.
*   **Interactive UI Editor:** Build the modular React form builder with tooltips (Academic Tips). Ensure left-side editing syncs dynamically with the right-side live DOM-based preview.
*   **Engine:** Setup the basic Node.js + Tectonic compilation pipeline to generate final PDFs.

### Phase 2: Ingestion & Smart Automation (Weeks 5-8)
*   **DOCX Upload:** Implement the LLM-powered Word-to-JSON pipeline.
*   **Citation Manager:** Integrate DOI/BibTeX auto-fill for the Publications section. Format standard citations (APA, IEEE) automatically via AI.
*   **Smart Formatting:** Implement author highlighting and publication status tags.

### Phase 3: The Academic Ecosystem (Weeks 9-12)
*   **Integrations:** Connect ORCID and Google Scholar APIs to fetch live metrics (h-index, citations) and render them in a LaTeX header badge.
*   **Iconography:** Integrate `academicons` LaTeX package.
*   **Web Export:** Build the CV-to-Web generator allowing JSON payload export to Markdown/HTML formats for personal websites (GitHub Pages/Hugo).
*   **AI Eval & LinkedIn Sync:** Launch the AI CV Evaluator for impact verbs and generate optimized LinkedIn 'About' sections from the parsed CV data.
