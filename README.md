# WT_CCE5_SmartCollegePortal: Smart College Website Portal

**Subject:** Web Technology 1 (`AD124PE507.1`)  
**Class:** T.Y. (AI&DS) &bull; Semester V  
**Evaluation:** CCE-5 (Unit V: SPA Concepts and Final Project Integration, PR5)  
**Marks:** 10 Marks  

---

## 1. Project Overview & Problem Statement
The **Smart College Website Portal** is a modern, responsive **Single Page Application (SPA)** designed for academic institutions. Traditional multi-page college websites trigger full page refreshes on every hyperlink click, consuming excessive bandwidth and creating jarring user experiences.

This project addresses these challenges by implementing:
- **SPA Architecture**: Smooth navigation without full page reloads.
- **Simulated Client-Side Routing**: Using URL hash change listeners (`#home`, `#departments`, `#courses`, `#faculty`, `#notices`, `#enquiry`).
- **Dynamic Asynchronous Data Loading**: Utilizing JavaScript `fetch()` API to consume structured JSON data (`data.json`) for departments, courses, faculty, and notices.
- **Client-Side Validation & Persistence**: Robust real-time validation on the student enquiry form with persistent storage in browser `localStorage`.
- **Responsive Web UI**: Built with modern CSS (Flexbox, CSS Grid, media queries) adhering to mobile-first standards.

---

## 2. Key Features

| Component / Feature | Implementation Details |
|---------------------|------------------------|
| **Header & Brand** | Responsive navigation bar with brand icon, hamburger toggle for mobile devices, and active route indicators. |
| **Simulated SPA Routing** | Hash-based routing (`window.addEventListener('hashchange', ...)`) that seamlessly swaps views without page refresh. |
| **Home Overview** | Engaging Hero section, live statistic counters derived from data, and college highlight cards. |
| **Departments View** | Dynamic cards loaded from `data.json` displaying department names, HODs, intake capacities, labs, and cover photos. |
| **Curriculum & Courses** | Filterable course directory allowing users to sort courses by department in real time without network calls. |
| **Faculty Directory** | Interactive accordion interface displaying credentials, qualifications, contact info, and research areas. |
| **Campus Notices** | Categorized notice board with badges (`Urgent`, `New`, `Academic`, `Events`) rendered from JSON. |
| **Student Enquiry Form** | Client-side input validation (regex checks for email, 10-digit mobile number, required fields) and `localStorage` persistence. |
| **Saved Enquiries Viewer** | Local history manager allowing applicants and reviewers to inspect previous submissions or clear them. |
| **Footer** | Contact coordinates, quick route navigation links, and university accreditation info. |

---

## 3. Technology Stack
- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`).
- **CSS3**: Responsive Flexbox, CSS Grid, custom properties (CSS variables), smooth transitions, and mobile media queries.
- **JavaScript (ES6+)**:
  - Asynchronous `async/await` and `fetch()` API.
  - DOM manipulation and Event Delegation.
  - Client-side routing with `window.location.hash` and `hashchange`.
  - Browser Storage API (`localStorage`).
  - Input sanitation and RegExp-based form validation.
- **JSON**: Centralized mock database (`data.json`).

---

## 4. Project Directory Structure
```
WT_CCE5_SmartCollegePortal/
│
├── index.html       # Single entrypoint HTML with Header, Navigation, Main App Container & Footer
├── style.css        # Responsive styling, modern color schemes, variables & media queries
├── app.js           # Client-side router, JSON fetch handler, views renderer, validation & localStorage
├── data.json        # Structured JSON dataset (departments, courses, faculty, notices)
└── README.md        # Comprehensive technical documentation & evaluation guide
```

---

## 5. How to Run Locally

### Prerequisites
A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).

### Running with VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"** (runs at `http://127.0.0.1:5500/index.html`).
4. Alternatively, use any local static server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```
5. Open your browser and navigate to `http://localhost:8000`.

---

## 6. Viva & Evaluation Guide (CCE-5 Unit V Rubrics)

### Rubric 1: Problem Identification (2 Marks)
- **Target Audience:** Prospective students, enrolled scholars, faculty members, and campus visitors.
- **Problem Solved:** Eradicates repetitive server round-trips and page reloads by centralizing state and dynamically loading academic data on demand.

### Rubric 2: Web Application Design (2 Marks)
- Tested on standard desktop screens (1920x1080), laptops, and mobile screens (< 768px).
- Uses consistent CSS variables for uniform color palettes, shadows, border radii, and responsive layout scaling.

### Rubric 3: Implementation using HTML/CSS/JS (2 Marks)
- **No Page Reloads:** All navigation links target `#<route>` hashes intercepted by `handleRouteChange()` in `app.js`.
- **Data Loading:** Asynchronous `fetch("data.json")` loads records without blocking UI rendering.
- **Form Validation:** Validates full name length, email structure (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), Indian 10-digit phone format (`/^[6-9]\d{9}$/`), and mandatory dropdown selections.

### Rubric 4: Documentation & GitHub (2 Marks)
- Clean repository structure, detailed setup instructions, and problem breakdown documented here.

### Rubric 5: Presentation & Viva (2 Marks)
- Key code functions to explain:
  - `handleRouteChange()`: Handles hash detection and view switching.
  - `renderCoursesView()` / `renderFacultyView()`: Demonstrates template literals and dynamic array mapping.
  - `setupEnquiryForm()`: Demonstrates DOM events, regex validation, and `localStorage.setItem()`.
