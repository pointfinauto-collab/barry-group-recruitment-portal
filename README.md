# Barry Group Inc. — Recruitment Portal

A complete enterprise-grade recruitment portal for Barry Group Inc., a Canadian seafood processing and export company.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT + Email Verification |
| Email | Nodemailer |
| Files | Multer |
| Deploy | Render + GitHub |

---

## 📁 Project Structure

```
barry-group/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # All pages
│       ├── components/# Layout components
│       ├── context/   # Auth context
│       └── utils/     # API client
├── backend/           # Express API
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── utils/
├── database/
│   └── schema.sql     # Full PostgreSQL schema
└── render.yaml        # Deployment config
```

---

## ⚙️ Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/barry-group.git
cd barry-group

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. PostgreSQL Database

```bash
# Create the database
createdb barrygroup_db

# Run the schema (creates all tables + seeds jobs + admin user)
psql barrygroup_db < database/schema.sql
```

### 3. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://your_user:your_pass@localhost:5432/barrygroup_db
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Barry Group Inc. <recruitment@barrygroup.ca>

FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

### 4. Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the App

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## 👤 Default Admin Account

| Field | Value |
|-------|-------|
| Email | admin@barrygroup.ca |
| Password | Admin@123456 |
| Role | superadmin |

> **Change the admin password immediately after first login!**

---

## 🌐 Deploy to Render

### Step 1 — Push to GitHub
```bash
cd barry-group
git init
git add .
git commit -m "Initial commit: Barry Group Recruitment Portal"
git remote add origin https://github.com/your-username/barry-group.git
git push -u origin main
```

### Step 2 — Deploy on Render
1. Go to [render.com](https://render.com) and sign in
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create:
   - PostgreSQL database
   - Backend web service
   - Frontend static site
5. Set these environment variables manually in Render dashboard:
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`

### Step 3 — Initialize Database
After deployment, go to your backend service shell on Render:
```bash
psql $DATABASE_URL < database/schema.sql
```

---

## 🔐 Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing (12 rounds)
- Email verification on registration
- Rate limiting (100 req/15min, 10 auth req/15min)
- Helmet.js security headers
- CORS protection
- Role-based access control (applicant / admin / superadmin)
- File type validation (PDF, JPG, JPEG, PNG only)
- File size limit (10MB)

---

## 📧 Email Notifications

Automatically sent for:
- Registration → verification code
- Forgot password → reset code
- Application submitted → confirmation + application number
- Status change → notification with details
- Document requests → list of required documents

---

## 📋 Application Number Format

- Applications: `APP-2026-000001`
- LMIA References: `LMIA-2026-000001` (generated on approval)

> LMIA reference numbers are **internal tracking numbers only** and do not constitute official government immigration approvals.

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| users | All user accounts (applicants + admins) |
| applicant_profiles | Extended applicant information |
| jobs | Job listings |
| applications | Job applications |
| lmia_references | Internal LMIA tracking numbers |
| application_status_history | Status change log |
| documents | Uploaded files metadata |
| messages | Applicant-admin messaging |
| notifications | In-app notifications |
| audit_logs | Admin action logs |
| system_settings | Configurable settings |

---

## 🔧 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Jobs
```
GET  /api/jobs
GET  /api/jobs/departments
GET  /api/jobs/:id
GET  /api/jobs/admin/all     [admin]
POST /api/jobs               [admin]
PUT  /api/jobs/:id           [admin]
DELETE /api/jobs/:id         [admin]
```

### Applications
```
POST /api/applications
GET  /api/applications/my
GET  /api/applications/:id
GET  /api/applications       [admin]
PUT  /api/applications/:id/status [admin]
```

### Profile
```
GET /api/profile
PUT /api/profile
```

### Documents
```
POST /api/documents/upload
GET  /api/documents/my
DELETE /api/documents/:id
GET  /api/documents/download/:id
GET  /api/documents          [admin]
PUT  /api/documents/:id/review [admin]
```

### Messages
```
POST /api/messages
GET  /api/messages/inbox
GET  /api/messages/unread
GET  /api/messages/:id/thread
```

### Notifications
```
GET /api/notifications
GET /api/notifications/unread
PUT /api/notifications/:id/read
```

### Admin
```
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id/status
DELETE /api/admin/users/:id
```

---

## 📱 Pages

### Public
- `/` — Homepage (hero, about, benefits, featured jobs)
- `/jobs` — All jobs with search & filter
- `/login` — Sign in
- `/register` — Create account
- `/verify-email` — Email verification
- `/forgot-password` — Password recovery
- `/reset-password` — Set new password

### Applicant Dashboard
- `/dashboard` — Overview, application status, notifications
- `/dashboard/profile` — Complete personal/passport/education profile
- `/dashboard/application` — Submit & track application
- `/dashboard/documents` — Upload & manage documents
- `/dashboard/messages` — Inbox & messaging
- `/dashboard/notifications` — All notifications

### Admin Panel
- `/admin` — Statistics dashboard
- `/admin/users` — Manage all applicants
- `/admin/users/:id` — Full applicant detail
- `/admin/applications` — Review & update applications
- `/admin/jobs` — Create/edit/publish job listings
- `/admin/documents` — Review uploaded documents
- `/admin/messages` — Communicate with applicants

---

## 📞 Support

Barry Group Inc.  
Nova Scotia, Canada  
recruitment@barrygroup.ca
