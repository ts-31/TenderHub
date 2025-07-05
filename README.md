# TenderHub – B2B Tender Management Platform

TenderHub is a full-stack B2B tender management platform where companies can register, post tenders, apply to others' tenders, and manage their company profiles — all through a seamless and modern interface.

## 🌐 Live Demo

Frontend (Vercel): [https://your-frontend.vercel.app](https://your-frontend.vercel.app)  
Backend (Railway/Render/Localhost): [https://your-backend-api.com](https://your-backend-api.com)

---

## 📦 Tech Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS  
- **Backend**: Express.js (TypeScript), Prisma ORM  
- **Database**: PostgreSQL  
- **Storage**: Supabase (for company logo uploads)  
- **Authentication**: JWT-based token auth  
- **DevOps**: Docker (optional)

---

## 🚀 Features

### ✅ Authentication
- Email & password-based sign-up/sign-in
- JWT token handling for protected routes

### 🏢 Company Management
- Company sign-up with name, industry, and description
- Company logo upload via Supabase
- View all registered companies on the homepage
- View tenders posted by any company

### 📄 Tender Management
- Authenticated companies can create tenders
- All tenders are listed publicly
- Users cannot apply to their own tenders

### 📨 Application Workflow
- Apply to tenders with a proposal
- Duplicate applications are blocked
- View all applications for a specific tender (admin only/optional)

### 🔎 Search
- Search for companies by name, industry, or description

---

## 🛠️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/TenderHub.git
cd TenderHub
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Update database & Supabase credentials

# Generate Prisma Client & Apply Migrations
npx prisma generate
npx prisma migrate dev --name init

# Run Server
npx ts-node-dev src/index.ts
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Folder Structure

```
TenderHub/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── styles/
```

---

## 🧪 API Overview

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| POST   | `/auth/signup` or `/companies/signup` | Register a company                 |
| POST   | `/auth/signin` or `/companies/signin` | Login and receive JWT              |
| GET    | `/companies`                     | List all companies                  |
| GET    | `/companies/me`                  | Get current logged-in company       |
| POST   | `/tenders/create`                | Create a tender (auth required)     |
| GET    | `/tenders`                       | Get all tenders                     |
| POST   | `/applications`                  | Apply to a tender                   |
| GET    | `/applications?tenderId=...`     | View all applications for a tender |

---

## 📦 Environment Variables

**Backend `.env`**
```
DATABASE_URL=postgresql://user:password@localhost:5432/tenderhub
JWT_SECRET=your_secret_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
SUPABASE_BUCKET=company-logos
```

---

## 🧱 Database Schema (Prisma)

- `Company`: id, email, password, name, industry, description, logoUrl
- `Tender`: id, title, description, deadline, budget, companyId (FK)
- `Application`: id, proposal, tenderId (FK), companyId (FK)

---

## 📸 Screenshots

### 🔐 Signup Page
![Signup](screenshots/signup.png)

### 📥 Apply to Tender
![Apply](screenshots/apply.png)

### 🏢 Dashboard
![Dashboard](screenshots/dashboard.png)


---

## 🎥 Demo Walkthrough (Optional)

## 📽️ Demo Video

<video src="demo/walkthrough.mp4" controls width="600" />

---

## 📄 License

MIT © [Your Name]