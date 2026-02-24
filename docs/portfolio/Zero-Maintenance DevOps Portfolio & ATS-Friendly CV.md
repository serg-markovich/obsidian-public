---
title: Zero-Maintenance DevOps Portfolio & ATS-Friendly CV
date: 2026-02-24
type: project
topic: portfolio
status: published
level: intermediate
tags:
  - github-pages
  - html-css
  - architecture
  - career
---
# Project: Zero-Maintenance DevOps Portfolio & ATS-Friendly CV

## Summary
A lightweight, zero-maintenance personal portfolio and dual-language CV built without frameworks. Designed to serve as both a developer-friendly website (Dark Theme) and a formal, ATS-compliant printable document (Light Theme) using only Vanilla HTML/CSS and GitHub Pages.

**Links:**

*   📄 **Web CV (English):** [serg-markovich.de/cv](https://serg-markovich.de/cv.html)
*   🇩🇪 **Web Lebenslauf (Deutsch):** [serg-markovich.de/de/cv](https://serg-markovich.de/de/cv.html)
*   💻 **Source Code:** [GitHub Repository](https://github.com/serg-markovich/serg-markovich.github.io/blob/main/cv.html)

## Details

### The Problem
As a DevOps Engineer entering the German market, I needed a way to present my experience that satisfied two very different audiences:
1. **Engineers/Tech Leads:** Who appreciate clean code, dark themes, and fast load times.
2. **HR/ATS Systems:** Who require standard, parsable, light-themed PDF documents (`Lebenslauf`).

Maintaining a website, a separate Word document for the English CV, and another for the German CV violates the DRY (Don't Repeat Yourself) principle and leads to outdated information.

### The Architecture
Instead of using a heavy Static Site Generator (SSG) like Next.js or Hugo, which would require CI/CD pipelines and node module maintenance, I chose radical simplicity:
*   **Hosting:** GitHub Pages (Native, Free, High Availability)
*   **Tech Stack:** Vanilla HTML5, CSS3, ES6 JavaScript
*   **Routing:** Simple file paths (`/`, `/cv.html`, `/cv-de.html`)

### Key Engineering Decisions

#### 1. Single Source of Truth for CVs
The HTML pages (`cv.html` and `cv-de.html`) serve as both the web presentation and the source for the PDF. 
By utilizing CSS `@media print` queries, the browser's native print engine strips away the web UI (navigation, buttons), forces a white background, and enforces strict page-break rules. This guarantees a 100% ATS-readable PDF with zero layout shifts.

#### 2. Client-Side Theme Management
To accommodate different viewing preferences without a backend, I implemented a CSS Variable-based theme system. 
A tiny Vanilla JS script toggles a `.light-theme` class on the `<body>` and persists the state in `localStorage`. 

#### 3. Localization Strategy (i18n)
For a massive web app, a translation layer (JSON/YAML) is necessary. For a 3-page personal site, file duplication (`index.html` vs `/de/index.html`) is actually more maintainable. It allows for language-specific structural tweaks (like adding a photo for the German Lebenslauf, which isn't standard in the US/UK format) without complex conditional rendering logic.

## Results & Impact
*   **Performance:** 100/100 Lighthouse score (instant load times).
*   **Maintenance:** 0 hours per month. Updating a job description is a single Git commit.
*   **UX:** Seamless transition between a "hacker-style" dark portfolio and a corporate-ready CV.
## Related
- [[Vanilla HTML_CSS Portfolio & ATS-Friendly CV]]