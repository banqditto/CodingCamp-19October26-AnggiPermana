# Code Standards

Guidelines followed throughout this project.

## General Rules

- **1 CSS file** inside `css/` — no additional stylesheets
- **1 JS file** inside `js/` — no additional scripts or modules
- No frameworks (React, Vue, Angular, etc.)
- No backend required — fully client-side
- No test setup required

## HTML

- Semantic elements (`<header>`, `<main>`, `<section>`, `<ul>`, etc.)
- `aria-label` attributes on all interactive elements for accessibility
- `role="dialog"` and `aria-modal="true"` on modal overlays
- `rel="noopener noreferrer"` on all external links

## CSS

- CSS custom properties (variables) on `:root` and `[data-theme]` for theming
- Mobile-first responsive layout using CSS Grid and Flexbox
- `clamp()` for fluid typography
- Smooth transitions on interactive elements (`.18s ease`)
- No hardcoded pixel colors in component rules — always use `var(--token)`

## JavaScript

- `'use strict'` at the top of the file
- All DOM queries stored in `const` variables at module scope
- LocalStorage access wrapped in a single `LS` helper object with try/catch
- Functions are small and single-purpose
- Event listeners attached once at the bottom of each feature section
- No inline event handlers in HTML (`onclick=""` etc.)
