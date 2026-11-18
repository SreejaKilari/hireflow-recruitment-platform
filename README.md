# 🚀 HireFlow – Professional Job Recruitment Platform

HireFlow is an enterprise-grade, modern MERN Stack Job Recruitment Platform and Applicant Tracking System (ATS). Built from the ground up to reflect a commercial SaaS architecture, HireFlow connects top technical talent with verified companies through frictionless job discovery, verified PDF resume pipelines, and real-time status transitions.

---

## 🌟 Key Highlights & Architectural Strengths

- **Role-Based Access Control (RBAC):** Strictly separates **Job Seeker**, **Recruiter**, and **Admin** personas on both client routes and RESTful endpoints.
- **Enterprise ATS Dashboard:** Recruiter portal to publish roles, review candidates, inspect resumes, transition pipeline statuses, and record confidential notes.
- **Duplicate Application Shield:** Enforces database-level compound unique constraints `{ job: 1, applicant: 1 }` preventing candidate spam.
- **In-Memory & Atlas DB Resilience:** Automatically boots an in-memory MongoDB instance for immediate local development and zero-config evaluation if a native MongoDB daemon is not running.
- **Stateless JWT Security:** Hashed passwords via salted `bcryptjs`, Helmet HTTP protections, CORS whitelisting, and brute-force rate limiters.
- **Modern Navy & White Design System:** Clean SaaS aesthetic with electric blue accents, responsive layouts, accessible forms, and zero bulky UI component dependencies.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (v18+), JavaScript ES6+, HTML5, CSS3 Custom Properties, React Router DOM v6+, Axios, Lucide React, react-hot-toast, date-fns |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM, REST Architecture |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs, Custom RBAC Middleware |
| **File Handling** | Multer (PDF validation, 5MB ceiling), Cloudinary-ready storage engine |
| **Security & Auditing** | Helmet, CORS, Express-Rate-Limit, Morgan |
| **Testing** | Supertest, Automated End-to-End Integration Test Suite |

---

## 📂 Project Directory Structure

```text
HireFlow/
├── backend/
│   ├── src/
│   │   ├── config/             # DB configuration & auto in-memory fallback
│   │   ├── controllers/        # Request controllers (auth, job, application, company, admin)
│   │   ├── middlewares/        # JWT auth protect, RBAC authorize, Multer upload, rateLimiter, errorHandler
│   │   ├── models/             # Mongoose schemas (User, Company, Job, Application, Notification)
│   │   ├── routes/             # REST API routers
│   │   ├── utils/              # ApiResponse, ApiError, Seed data generator
│   │   ├── app.js              # Express app setup & middleware pipeline
│   │   └── server.js           # Server bootstrap & auto-seeder
│   ├── test-integration.js     # 15-point automated integration test suite
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Select, Badge, Card, Modal, Spinner, Skeleton, EmptyState
│   │   │   ├── layout/         # Navbar, Footer, ProtectedRoute
│   │   │   └── jobs/           # JobCard, filters
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── seeker/         # Home, BrowseJobs, JobDetails, Companies, Dashboard, Profile, MyApplications
│   │   │   ├── recruiter/      # RecruiterDashboard, PostJob, JobApplications (ATS), CompanyProfile
│   │   │   ├── admin/          # AdminDashboard (Analytics, User Governance, Job Moderation)
│   │   │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── services/           # Axios HTTP client with JWT interceptors
│   │   ├── styles/             # Global CSS design system & CSS variables
│   │   ├── utils/              # Sample demo data & constants
│   │   ├── App.jsx             # React routing tree
│   │   └── main.jsx            # React root mount
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🗄️ Database Architecture (Mongoose Models)

### Collections & Relations
1. **`User`**: Account identity, hashed passwords, avatar, resume URL, contact info, skills, education, and work experience.
2. **`Company`**: Company branding, logo, description, website, team size, and recruiter owner reference.
3. **`Job`**: Requisition details, category, employment type, remote/hybrid status, compensation bands, requirements, and admin moderation flag.
4. **`Application`**: Candidate submission, attached resume, cover letter, candidate status history, and confidential recruiter notes.
5. **`Notification`**: Real-time in-app alerts dispatched upon application submission or status updates.

### Safeguards & Indexes
- `User`: Unique index on `email`.
- `Application`: **Compound Unique Index** on `{ job: 1, applicant: 1 }` strictly blocking duplicate applications for the same position.
- `Job`: Compound feed index on `{ status: 1, createdAt: -1 }` and full-text index on `{ title: "text", description: "text", skillsRequired: "text" }`.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register as Job Seeker or Recruiter (admin registration is blocked) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current user session & profile |
| `PUT` | `/api/auth/profile` | Protected | Update candidate/recruiter personal profile |
| `POST` | `/api/auth/upload-resume` | Protected | Upload primary PDF resume (Multer validated) |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password/:token`| Public | Reset password with token |

### Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Search & multi-filter jobs (keyword, location, salary, type, category) |
| `GET` | `/api/jobs/:id` | Public | Retrieve detailed job requisition |
| `POST` | `/api/jobs` | Recruiter / Admin | Create new job posting |
| `PUT` | `/api/jobs/:id` | Recruiter / Admin | Update owned job posting |
| `DELETE`| `/api/jobs/:id` | Recruiter / Admin | Delete job posting & associated applications |
| `GET` | `/api/jobs/my-jobs` | Recruiter | Get recruiter's posted jobs with candidate counts |
| `PATCH`| `/api/jobs/:id/status`| Recruiter / Admin | Toggle active/closed job status |

### Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId/apply` | Job Seeker | Submit application with optional PDF upload or profile resume |
| `GET` | `/api/applications/my-applications`| Job Seeker | View candidate application history & pipeline stages |
| `DELETE`| `/api/applications/:id/withdraw` | Job Seeker | Withdraw application prior to interview stage |
| `GET` | `/api/applications/job/:jobId` | Recruiter / Admin | View all candidate submissions for a specific job |
| `PATCH`| `/api/applications/:id/status` | Recruiter / Admin | Update status (`under_review`, `shortlisted`, `hired`, `rejected`) |
| `GET` | `/api/applications/stats/recruiter`| Recruiter | Aggregated recruiter hiring statistics |

### Admin Moderation (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Comprehensive platform metrics & breakdown |
| `GET` | `/api/admin/users` | Admin | Search & filter all system users |
| `PATCH`| `/api/admin/users/:id/status` | Admin | Activate or deactivate user account |
| `GET` | `/api/admin/jobs` | Admin | Moderate all job postings |
| `PATCH`| `/api/admin/jobs/:id/approve` | Admin | Flag/hide or approve job postings |

---

## ⚡ Quickstart & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm run seed     # Seeds realistic development data & demo accounts
npm run dev      # Starts Express API server on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

---

## 🧪 Pre-configured Demo Accounts

| Role | Email Address | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@hireflow.dev` | `AdminPassword123!` | System metrics, user governance, content moderation |
| **Corporate Recruiter** | `recruiter@stripe.com` | `Password123!` | Requisition creation, ATS candidate review board, status transitions |
| **Job Seeker** | `seeker@hireflow.dev` | `Password123!` | Job search, multi-filtering, 1-click apply, application tracker |

---

## 🔬 Automated Testing

Run the end-to-end integration test suite verifying all 15 core workflows:
```bash
cd backend
npm test
```
*Test suite validates health endpoints, authentication, RBAC boundaries, job creation, multi-filtering, duplicate application rejection, candidate shortlisting, notifications, and administrative account deactivation.*

---

## 📄 License

This project is licensed under the MIT License. Developed with high-caliber standards for modern engineering portfolios.
