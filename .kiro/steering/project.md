# Project Overview

## Personal Dashboard — CodingCamp 19 October 2026
**Author:** Anggi Permana  
**GitHub:** https://github.com/banqditto/CodingCamp-19October26-AnggiPermana  
**Live Site:** https://banqditto.github.io/CodingCamp-19October26-AnggiPermana/

---

## Description

A clean, minimal personal dashboard web app built with vanilla HTML, CSS, and JavaScript.  
No frameworks, no backend — everything runs in the browser using the LocalStorage API.

---

## Tech Stack

| Layer   | Technology              |
|---------|-------------------------|
| Structure | HTML5                 |
| Styling   | CSS3 (custom properties, CSS Grid, Flexbox) |
| Logic     | Vanilla JavaScript (ES6+) |
| Storage   | Browser LocalStorage API |
| Hosting   | GitHub Pages            |

---

## Folder Structure

```
CodingCamp-19October26-AnggiPermana/
├── index.html        # Main HTML file
├── css/
│   └── style.css     # All styles (only 1 CSS file allowed)
├── js/
│   └── app.js        # All JavaScript logic (only 1 JS file allowed)
└── .kiro/
    └── steering/
        └── project.md   # This file — project documentation
```

---

## MVP Features

### 1. Greeting
- Displays current date and time (updates every second)
- Shows time-based greeting: Good Morning / Afternoon / Evening / Night

### 2. Focus Timer
- 25-minute Pomodoro countdown timer
- Start, Stop, and Reset controls
- Visual state changes (color shifts when running / done)

### 3. To-Do List
- Add, edit, mark as done, and delete tasks
- All tasks persisted in LocalStorage

### 4. Quick Links
- Add favorite website shortcuts as pill chips
- Each link opens in a new tab
- Links persisted in LocalStorage

---

## Challenges Completed (all 5)

| # | Challenge | Implementation |
|---|-----------|----------------|
| 1 | Light / Dark Mode | Toggle button in top bar; theme saved to LocalStorage |
| 2 | Custom Name in Greeting | Inline edit below the greeting; name saved to LocalStorage |
| 3 | Change Pomodoro Time | Number input (1–120 min) with Apply button; saved to LocalStorage |
| 4 | Prevent Duplicate Tasks | Case-insensitive check on add and edit; inline warning shown for 3s |
| 5 | Sort Tasks | Dropdown: Added order / A→Z / Done last; preference saved to LocalStorage |

---

## LocalStorage Keys

| Key                  | Stores                          |
|----------------------|---------------------------------|
| `dashboard_theme`    | `"dark"` or `"light"`          |
| `dashboard_name`     | User's custom name (string)     |
| `dashboard_pomo_minutes` | Pomodoro duration (number)  |
| `dashboard_todos`    | Array of task objects           |
| `dashboard_sort`     | Sort preference string          |
| `dashboard_links`    | Array of quick link objects     |

---

## Development Notes

- All code lives in **one CSS file** and **one JS file** as required
- No build tools, no npm, no dependencies — open `index.html` directly in any modern browser
- Compatible with Chrome, Firefox, Edge, and Safari
