/**
 * Smart College Website Portal - Single Page Application (SPA)
 * Handles:
 * 1. Client-Side Routing via URL Hash (#home, #departments, #courses, #faculty, #notices, #enquiry)
 * 2. Dynamic Asynchronous Data Loading using fetch() from data.json
 * 3. Client-Side Form Validation & LocalStorage Persistence
 * 4. Interactive Accordions & Filtering Components
 */

// Application State
const AppState = {
    data: null,
    currentRoute: "home",
    selectedDeptFilter: "all"
};

// DOM References
const appContainer = document.getElementById("app");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

/**
 * Initialize Application
 */
async function initApp() {
    setupMobileNav();
    window.addEventListener("hashchange", handleRouteChange);

    try {
        // Fetch data dynamically from data.json
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        AppState.data = await response.json();
    } catch (error) {
        console.error("Could not load data.json:", error);
        // Fallback default sample data if fetch fails (e.g., opened directly via file://)
        AppState.data = getFallbackData();
    }

    // Render the initial route based on hash or default to home
    handleRouteChange();
}

/**
 * Mobile Navigation Toggle
 */
function setupMobileNav() {
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            mainNav.classList.toggle("show");
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("show");
            });
        });
    }
}

/**
 * Client-Side Router: Parses hash and renders appropriate component
 */
function handleRouteChange() {
    const rawHash = window.location.hash.slice(1).trim();
    const route = rawHash || "home";
    AppState.currentRoute = route;

    // Update active state in Navigation Bar
    updateActiveNav(route);

    // Render View without page reload
    renderView(route);

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Highlights active link in Header
 */
function updateActiveNav(route) {
    navLinks.forEach(link => {
        const linkRoute = link.getAttribute("data-route");
        if (linkRoute === route) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

/**
 * Main View Renderer (Simulates Client-side Routing)
 */
function renderView(route) {
    if (!AppState.data) {
        appContainer.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading application data...</p>
            </div>
        `;
        return;
    }

    switch (route) {
        case "home":
            appContainer.innerHTML = renderHomeView();
            break;
        case "departments":
            appContainer.innerHTML = renderDepartmentsView();
            break;
        case "courses":
            appContainer.innerHTML = renderCoursesView();
            setupCourseFilters();
            break;
        case "faculty":
            appContainer.innerHTML = renderFacultyView();
            setupFacultyAccordions();
            break;
        case "notices":
            appContainer.innerHTML = renderNoticesView();
            break;
        case "enquiry":
            appContainer.innerHTML = renderEnquiryView();
            setupEnquiryForm();
            renderStoredEnquiries();
            break;
        default:
            appContainer.innerHTML = `
                <div class="section-header" style="padding: 4rem 1rem;">
                    <h2 class="section-title">404 - Page Not Found</h2>
                    <p class="section-subtitle">The requested route <strong>#${escapeHtml(route)}</strong> does not exist.</p>
                    <div style="margin-top: 1.5rem;">
                        <a href="#home" class="btn btn-primary">Return to Home</a>
                    </div>
                </div>
            `;
            break;
    }
}

/**
 * 1. Home View
 */
function renderHomeView() {
    const deptCount = AppState.data.departments?.length || 4;
    const courseCount = AppState.data.courses?.length || 6;
    const facultyCount = AppState.data.faculty?.length || 4;
    const noticesCount = AppState.data.notices?.length || 4;

    return `
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <span class="hero-tag">Excellence in Engineering &amp; Technology</span>
                <h1 class="hero-title">Shaping Future Leaders in AI, Data Science &amp; Computing</h1>
                <p class="hero-subtitle">
                    Welcome to the Smart College Portal. Discover cutting-edge academic departments, accredited engineering courses, renowned faculty mentors, and stay updated with live campus announcements.
                </p>
                <div class="hero-actions">
                    <a href="#courses" class="btn btn-primary">Explore Courses &rarr;</a>
                    <a href="#enquiry" class="btn btn-outline-light">Admissions Enquiry</a>
                </div>
            </div>
        </section>

        <!-- Dynamic Counter Stats -->
        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${deptCount}</div>
                <div class="stat-label">Academic Departments</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${courseCount}+</div>
                <div class="stat-label">Specialized Courses</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${facultyCount}+</div>
                <div class="stat-label">PhD &amp; Research Faculty</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Placement Assistance</div>
            </div>
        </section>

        <!-- Feature Highlights -->
        <div class="section-header">
            <h2 class="section-title">Why Choose Smart College?</h2>
            <p class="section-subtitle">Industry-aligned curriculums, world-class labs, and top-tier technical mentoring.</p>
        </div>

        <div class="features-grid">
            <div class="feature-box">
                <span class="feature-icon">🤖</span>
                <h3 class="feature-heading">AI &amp; Data Centers</h3>
                <p class="feature-text">High-performance GPU computing clusters tailored for deep learning, NLP, computer vision, and big data experiments.</p>
            </div>
            <div class="feature-box">
                <span class="feature-icon">🌐</span>
                <h3 class="feature-heading">Single Page Architecture</h3>
                <p class="feature-text">Experience instantaneous page transitions with simulated client-side routing and reactive JSON data binding.</p>
            </div>
            <div class="feature-box">
                <span class="feature-icon">🏆</span>
                <h3 class="feature-heading">Research &amp; Innovation</h3>
                <p class="feature-text">Encouraging student hackathons, patents, published journals, and funded research with prominent industries.</p>
            </div>
        </div>
    `;
}

/**
 * 2. Departments View (Dynamic from JSON)
 */
function renderDepartmentsView() {
    const departments = AppState.data.departments || [];

    const cardsHtml = departments.map(dept => `
        <div class="dept-card">
            <img class="dept-image" src="${escapeHtml(dept.image)}" alt="${escapeHtml(dept.name)}" loading="lazy">
            <div class="dept-body">
                <span class="dept-badge">${escapeHtml(dept.code)}</span>
                <h3 class="dept-title">${escapeHtml(dept.name)}</h3>
                <p class="dept-desc">${escapeHtml(dept.description)}</p>
                <div class="dept-meta">
                    <div class="dept-meta-item"><strong>Head of Dept:</strong> ${escapeHtml(dept.hod)}</div>
                    <div class="dept-meta-item"><strong>Annual Intake:</strong> ${dept.intake} seats</div>
                    <div class="dept-labs">
                        ${dept.labs.map(lab => `<span class="lab-tag">${escapeHtml(lab)}</span>`).join("")}
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    return `
        <div class="section-header">
            <h2 class="section-title">Academic Departments</h2>
            <p class="section-subtitle">Explore our specialized departments equipped with state-of-the-art laboratories and research infrastructure.</p>
        </div>
        <div class="dept-grid">
            ${cardsHtml}
        </div>
    `;
}

/**
 * 3. Courses View with Dynamic Filtering
 */
function renderCoursesView() {
    const courses = AppState.data.courses || [];
    const depts = ["all", ...new Set(courses.map(c => c.department))];

    const filterBtns = depts.map(dept => `
        <button class="filter-btn ${dept === AppState.selectedDeptFilter ? "active" : ""}" data-filter="${escapeHtml(dept)}">
            ${dept === "all" ? "All Departments" : escapeHtml(dept)}
        </button>
    `).join("");

    const filteredCourses = AppState.selectedDeptFilter === "all" 
        ? courses 
        : courses.filter(c => c.department === AppState.selectedDeptFilter);

    const coursesHtml = filteredCourses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <span class="course-code">${escapeHtml(course.code)}</span>
                <span class="course-credits">${course.credits} Credits</span>
            </div>
            <h3 class="course-name">${escapeHtml(course.name)}</h3>
            <div class="course-dept">📚 ${escapeHtml(course.department)} &bull; ${escapeHtml(course.semester)}</div>
            <p class="course-desc">${escapeHtml(course.description)}</p>
        </div>
    `).join("");

    return `
        <div class="section-header">
            <h2 class="section-title">Curriculum &amp; Courses</h2>
            <p class="section-subtitle">Browse core and elective courses dynamically categorized by department.</p>
        </div>
        <div class="courses-filter" id="coursesFilterContainer">
            ${filterBtns}
        </div>
        <div class="courses-grid" id="coursesGridContainer">
            ${coursesHtml}
        </div>
    `;
}

function setupCourseFilters() {
    const filterContainer = document.getElementById("coursesFilterContainer");
    if (!filterContainer) return;

    filterContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            const filterValue = e.target.getAttribute("data-filter");
            AppState.selectedDeptFilter = filterValue;
            renderView("courses");
        }
    });
}

/**
 * 4. Faculty View (Interactive Accordion & Dynamic JSON Data)
 */
function renderFacultyView() {
    const facultyList = AppState.data.faculty || [];

    const facultyHtml = facultyList.map((f, idx) => `
        <div class="faculty-card">
            <button class="faculty-header-bar ${idx === 0 ? "active" : ""}" type="button">
                <div class="faculty-info-brief">
                    <img class="faculty-avatar" src="${escapeHtml(f.avatar)}" alt="${escapeHtml(f.name)}" loading="lazy">
                    <div class="faculty-name-title">
                        <h3>${escapeHtml(f.name)}</h3>
                        <p>${escapeHtml(f.designation)} &bull; ${escapeHtml(f.department)}</p>
                    </div>
                </div>
                <span class="accordion-chevron">&#9660;</span>
            </button>
            <div class="faculty-panel" style="${idx === 0 ? 'max-height: 400px;' : ''}">
                <div class="faculty-details-body">
                    <div>
                        <div class="detail-row"><span class="detail-label">Qualification:</span> ${escapeHtml(f.qualification)}</div>
                        <div class="detail-row"><span class="detail-label">Experience:</span> ${escapeHtml(f.experience)}</div>
                        <div class="detail-row"><span class="detail-label">Email:</span> <a href="mailto:${escapeHtml(f.email)}">${escapeHtml(f.email)}</a></div>
                    </div>
                    <div>
                        <div class="detail-row"><span class="detail-label">Key Specializations:</span></div>
                        <p style="color: #475569; margin-top: 0.25rem;">${escapeHtml(f.specialization)}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    return `
        <div class="section-header">
            <h2 class="section-title">Distinguished Faculty</h2>
            <p class="section-subtitle">Click on any faculty member's profile to expand and inspect their credentials, research background, and domain expertise.</p>
        </div>
        <div class="faculty-list">
            ${facultyHtml}
        </div>
    `;
}

function setupFacultyAccordions() {
    const headers = document.querySelectorAll(".faculty-header-bar");
    headers.forEach(header => {
        header.addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}

/**
 * 5. Notices View
 */
function renderNoticesView() {
    const notices = AppState.data.notices || [];

    const noticesHtml = notices.map(notice => {
        const isUrgent = notice.badge.toLowerCase() === "urgent";
        const badgeClass = isUrgent ? "badge-urgent" : (notice.badge.toLowerCase() === "new" ? "badge-new" : "");

        return `
            <div class="notice-card ${isUrgent ? 'urgent' : ''}">
                <div class="notice-header">
                    <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
                    <span class="notice-badge ${badgeClass}">${escapeHtml(notice.badge)}</span>
                </div>
                <div class="notice-date">📅 Posted on ${escapeHtml(notice.date)} &bull; ${escapeHtml(notice.category)}</div>
                <p class="notice-desc">${escapeHtml(notice.description)}</p>
            </div>
        `;
    }).join("");

    return `
        <div class="section-header">
            <h2 class="section-title">Official Campus Notices</h2>
            <p class="section-subtitle">Stay informed about academic schedules, submissions, practicals, and collegiate events.</p>
        </div>
        <div class="notices-list">
            ${noticesHtml}
        </div>
    `;
}

/**
 * 6. Enquiry View (Client-side Form Validation + LocalStorage)
 */
function renderEnquiryView() {
    return `
        <div class="section-header">
            <h2 class="section-title">Student Admissions &amp; Enquiries</h2>
            <p class="section-subtitle">Submit your questions or admission requests. Form entries are validated on the client side and saved in browser localStorage.</p>
        </div>

        <div class="enquiry-layout">
            <!-- Enquiry Submission Form -->
            <div class="form-wrapper">
                <h3 class="form-heading">Online Enquiry Form</h3>
                <p class="form-subtext">Fill in all required fields accurately. Our counseling team will review your query.</p>

                <form id="enquiryForm" novalidate>
                    <div class="form-group">
                        <label for="studentName">Full Name *</label>
                        <input type="text" id="studentName" name="studentName" placeholder="e.g. Rahul Sharma" autocomplete="name">
                        <span class="error-msg" id="nameError"></span>
                    </div>

                    <div class="form-group">
                        <label for="studentEmail">Email Address *</label>
                        <input type="email" id="studentEmail" name="studentEmail" placeholder="e.g. rahul.sharma@example.com" autocomplete="email">
                        <span class="error-msg" id="emailError"></span>
                    </div>

                    <div class="form-group">
                        <label for="studentPhone">Phone Number *</label>
                        <input type="tel" id="studentPhone" name="studentPhone" placeholder="10-digit mobile number" maxlength="10">
                        <span class="error-msg" id="phoneError"></span>
                    </div>

                    <div class="form-group">
                        <label for="courseInterest">Program / Course of Interest *</label>
                        <select id="courseInterest" name="courseInterest">
                            <option value="">-- Choose a Program --</option>
                            <option value="Artificial Intelligence & Data Science">B.E. Artificial Intelligence &amp; Data Science</option>
                            <option value="Computer Engineering">B.E. Computer Engineering</option>
                            <option value="Electronics & Telecommunication">B.E. Electronics &amp; Telecommunication</option>
                            <option value="Mechanical Engineering">B.E. Mechanical Engineering</option>
                        </select>
                        <span class="error-msg" id="courseError"></span>
                    </div>

                    <div class="form-group">
                        <label for="enquiryMessage">Enquiry Details / Message *</label>
                        <textarea id="enquiryMessage" name="enquiryMessage" rows="4" placeholder="Mention your query regarding admission criteria, syllabus, or fee structure..."></textarea>
                        <span class="error-msg" id="messageError"></span>
                    </div>

                    <button type="submit" class="btn-submit" id="submitEnquiryBtn">Submit Enquiry</button>

                    <div id="formSuccessAlert" class="alert-success hidden">
                        <span>✅</span>
                        <div><strong>Success!</strong> Your enquiry has been verified and recorded into browser storage.</div>
                    </div>
                </form>
            </div>

            <!-- Stored Inquiries Viewer (LocalStorage) -->
            <div class="records-wrapper">
                <div class="records-header">
                    <div>
                        <h3 class="form-heading" style="margin-bottom: 0.2rem;">Submitted Enquiries</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Stored locally in your browser (LocalStorage)</p>
                    </div>
                    <button id="clearEnquiriesBtn" class="btn-danger-outline" type="button">Clear All</button>
                </div>
                <div class="enquiry-list" id="enquiryRecordsList">
                    <!-- Populated dynamically from localStorage -->
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup Enquiry Form Verification & Storage Logic
 */
function setupEnquiryForm() {
    const form = document.getElementById("enquiryForm");
    const nameInput = document.getElementById("studentName");
    const emailInput = document.getElementById("studentEmail");
    const phoneInput = document.getElementById("studentPhone");
    const courseSelect = document.getElementById("courseInterest");
    const messageInput = document.getElementById("enquiryMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const courseError = document.getElementById("courseError");
    const messageError = document.getElementById("messageError");
    const successAlert = document.getElementById("formSuccessAlert");
    const clearBtn = document.getElementById("clearEnquiriesBtn");

    if (!form) return;

    // Real-time input clearing on typing
    [nameInput, emailInput, phoneInput, courseSelect, messageInput].forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Reset errors
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        courseError.textContent = "";
        messageError.textContent = "";
        successAlert.classList.add("hidden");

        let isValid = true;

        // Name Validation (at least 3 alphabetic characters)
        const nameVal = nameInput.value.trim();
        if (!nameVal) {
            nameError.textContent = "Full name is required.";
            nameInput.classList.add("input-error");
            isValid = false;
        } else if (nameVal.length < 3) {
            nameError.textContent = "Name must be at least 3 characters long.";
            nameInput.classList.add("input-error");
            isValid = false;
        }

        // Email Validation (standard regex)
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            emailError.textContent = "Email address is required.";
            emailInput.classList.add("input-error");
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            emailError.textContent = "Please provide a valid email (e.g. name@domain.com).";
            emailInput.classList.add("input-error");
            isValid = false;
        }

        // Phone Validation (10 digits)
        const phoneVal = phoneInput.value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneVal) {
            phoneError.textContent = "Mobile phone number is required.";
            phoneInput.classList.add("input-error");
            isValid = false;
        } else if (!phoneRegex.test(phoneVal)) {
            phoneError.textContent = "Please enter a valid 10-digit mobile number.";
            phoneInput.classList.add("input-error");
            isValid = false;
        }

        // Course Selection Validation
        const courseVal = courseSelect.value;
        if (!courseVal) {
            courseError.textContent = "Please select a preferred program.";
            courseSelect.classList.add("input-error");
            isValid = false;
        }

        // Message Validation (at least 10 characters)
        const messageVal = messageInput.value.trim();
        if (!messageVal) {
            messageError.textContent = "Please enter your enquiry message.";
            messageInput.classList.add("input-error");
            isValid = false;
        } else if (messageVal.length < 10) {
            messageError.textContent = "Enquiry message must be at least 10 characters long.";
            messageInput.classList.add("input-error");
            isValid = false;
        }

        if (isValid) {
            const newRecord = {
                id: Date.now(),
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
                course: courseVal,
                message: messageVal,
                submittedAt: new Date().toLocaleString()
            };

            saveToLocalStorage(newRecord);
            form.reset();
            successAlert.classList.remove("hidden");
            renderStoredEnquiries();

            setTimeout(() => {
                successAlert.classList.add("hidden");
            }, 6000);
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all stored enquiries?")) {
                localStorage.removeItem("smart_college_enquiries");
                renderStoredEnquiries();
            }
        });
    }
}

/**
 * Save single enquiry record into browser localStorage
 */
function saveToLocalStorage(record) {
    let records = [];
    try {
        const stored = localStorage.getItem("smart_college_enquiries");
        if (stored) {
            records = JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Error parsing localStorage records:", e);
        records = [];
    }

    records.unshift(record); // Add to beginning of array
    localStorage.setItem("smart_college_enquiries", JSON.stringify(records));
}

/**
 * Render localStorage records list
 */
function renderStoredEnquiries() {
    const listContainer = document.getElementById("enquiryRecordsList");
    if (!listContainer) return;

    let records = [];
    try {
        const stored = localStorage.getItem("smart_college_enquiries");
        if (stored) {
            records = JSON.parse(stored);
        }
    } catch (e) {
        records = [];
    }

    if (!records || records.length === 0) {
        listContainer.innerHTML = `
            <div class="no-records">
                <p>📋 No enquiries saved yet.</p>
                <small>Submit the form on the left to test instant client-side validation and local storage retention.</small>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = records.map(rec => `
        <div class="enquiry-entry">
            <div class="entry-header">
                <span class="entry-name">${escapeHtml(rec.name)}</span>
                <span class="entry-date">${escapeHtml(rec.submittedAt)}</span>
            </div>
            <div class="entry-email">✉️ ${escapeHtml(rec.email)} &bull; 📞 ${escapeHtml(rec.phone || "N/A")}</div>
            <div class="entry-course">🎓 ${escapeHtml(rec.course)}</div>
            <div class="entry-message">${escapeHtml(rec.message)}</div>
        </div>
    `).join("");
}

/**
 * Fallback static data in case the page is executed offline directly from filesystem
 */
function getFallbackData() {
    return {
        departments: [
            {
                id: "cs",
                name: "Artificial Intelligence & Data Science",
                code: "AIDS",
                description: "Pioneering education in machine learning, deep learning, big data analytics, and generative AI systems.",
                hod: "Dr. S. K. Patil",
                intake: 120,
                labs: ["Deep Learning Lab", "Cloud Computing Lab", "Data Analytics Lab"],
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: "comp",
                name: "Computer Engineering",
                code: "COMP",
                description: "Focussing on algorithms, distributed computing, cybersecurity, and software engineering.",
                hod: "Dr. R. M. Sharma",
                intake: 180,
                labs: ["High-Performance Computing Lab", "Cybersecurity Lab"],
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
            }
        ],
        courses: [
            {
                code: "AD124PE507.1",
                name: "Web Technology 1",
                department: "Artificial Intelligence & Data Science",
                semester: "Semester V",
                credits: 3,
                description: "Single-page application (SPA) paradigms, responsive design, and dynamic data binding."
            }
        ],
        faculty: [
            {
                id: 1,
                name: "Dr. Alice Smith",
                designation: "Professor & HOD",
                department: "Artificial Intelligence & Data Science",
                qualification: "Ph.D. in Artificial Intelligence",
                experience: "15+ Years",
                specialization: "Deep Learning, Natural Language Processing",
                email: "alice.smith@college.edu",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
            }
        ],
        notices: [
            {
                id: 1,
                title: "CCE-5 Unit V Mini Project Presentation Schedule",
                date: "2026-11-18",
                category: "Academic",
                badge: "Urgent",
                description: "Students must present their Single Page Application (SPA) in their assigned lab slot."
            }
        ]
    };
}

/**
 * XSS prevention utility helper
 */
function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Start Application on DOM Content Loaded
document.addEventListener("DOMContentLoaded", initApp);
