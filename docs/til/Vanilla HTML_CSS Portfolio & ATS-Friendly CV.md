---
title: Vanilla HTML/CSS Portfolio & ATS-Friendly CV
date: 2026-02-24
type: guide
topic: frontend
status: published
level: beginner
tags:
  - til
  - github-pages
  - css
  - career
---

# Vanilla HTML/CSS Portfolio & ATS-Friendly CV

## Summary
Building a professional, dual-language (EN/DE) DevOps portfolio and CV. Instead of over-engineering with heavy frameworks (React/Next.js) or maintaining separate Word/LaTeX documents, I used Vanilla HTML/CSS hosted on GitHub Pages. The core achievement is an ATS-friendly, auto-formatting CV that exports perfectly to PDF via the browser's native print function, while maintaining a Dark/Light theme toggle for the web version.

## Details
The main goal was to have a single source of truth for the CV that looks great on the web (Dark Mode by default) but prints perfectly as a formal document (Light Mode, no UI elements).

**Key Architectural Decisions:**
1. **Zero-Build Pipeline:** Pure static files (`index.html`, `cv.html`, `style.css`) deployed directly via GitHub Pages. No Node.js vulnerabilities, zero maintenance.
2. **CSS Custom Properties:** Used CSS variables (`:root`) and a `localStorage` JavaScript toggle to switch themes without heavy state-management libraries.
3. **Print Media Queries:** Used `@media print` to strip away web UI elements (navigation, buttons) and force a white background with black text when saving to PDF.
4. **Pragmatic i18n:** Duplicated `cv.html` to `cv-de.html` for the German version. For a 2-page static site, file duplication is much simpler to maintain than a JSON translation layer.

## Commands / Examples

### 1. Theme Toggling (CSS Variables)
This setup allows smooth switching between themes using a simple class on the `<body>` tag.

```css
/* Default Dark Theme */
:root {
    --bg-primary: #0d1117;
    --text-primary: #c9d1d9;
    --accent-primary: #58a6ff;
}

/* Light Theme Override */
body.light-theme {
    --bg-primary: #ffffff;
    --text-primary: #24292f;
    --accent-primary: #0969da;
}
```


### 2. The Print Superpower (`@media print`)

This is the magic that makes the HTML CV export perfectly to an ATS-friendly PDF. It hides the UI and forces page breaks to respect job blocks.

```css
@media print {
    body {
        /* Force high contrast for printing */
        background-color: #ffffff !important;
        color: #000000 !important;
    }
    
    /* Hide navigation and buttons */
    .page-header, .btn {
        display: none !important; 
    }
    
    /* Prevent a job block from splitting across two pages */
    .job-block {
        page-break-inside: avoid; 
    }
    
    /* Standard A4 margins */
    @page {
        margin: 1.5cm; 
    }
}
```


### 3. Minimal Vanilla JS Theme Persister

A tiny script to remember the user's theme choice across reloads.

```javascript
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Load saved preference
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-theme');
}

// Toggle on click
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
```

## Related Notes
- [[Zero-Maintenance DevOps Portfolio & ATS-Friendly CV]]