# Student CRM Dashboard

A lightweight internal CRM dashboard for managing student interactions and tracking application progress at **Undergraduation.com**.

---

## ✨ Features

### 🔐 Authentication

- Firebase Authentication with email/password
- Protected routes and user sessions
- Logout functionality

### 📊 Dashboard Overview

- Summary stats (students total, active, needs essay help)
- Quick filters (e.g., “Needs Essay Help”, “Not Contacted in 7 Days”)
- Mocked metrics for demo purposes (can be upgraded to live Firestore queries)

### 👥 Student Management

- **Directory View**:
  - Student table with search + filters
  - Key columns: Name, Email, Country, Status, Last Active
  - Clickable rows open profile
- **Profile View**:
  - Full student info (contact, GPA, SAT, budget, majors, etc.)
  - Application stage progress bar (Firestore-backed)
  - Intent scoring system
  - Flags (e.g., “Needs Essay Help”)

### 💬 Communication Tools

- Log communications manually (Email, Call, Note → saved in Firestore)
- Internal Notes system (add / edit / delete, with audit trail)
- Communication history timeline synced with Firestore

### 📅 Tasks / Reminders

- Student-specific tasks (due dates, status open/done, delete)
- Global reminder bell (🔔) in header shows all open tasks across students
- Mark tasks done directly from dropdown

### 📝 AI Summary (Mock)

- Mock AI-generated summary for each student profile
- Typing animation effect for realistic “AI writing” feel
- Ready to integrate with OpenAI/Claude API

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: CSS Modules (scoped styles, matches Undergraduation.com theme)
- **Authentication**: Firebase Auth
- **Database**: Firestore (students, comms, notes, tasks)
- **Deployment**: Ready for Vercel/Netlify

---

## 📂 Project Structure

src/
├── app/
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Dashboard home
│ ├── login/ # Login page
│ └── students/ # Student directory + profiles
│ └── [id]/page.tsx # Individual profile
├── components/
│ └── dashboard/ # Auth wrapper, layout, reminder bell
├── lib/ # Firebase, Firestore helpers, mock AI
└── hooks/ # useAuth (auth state)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repo
   ```bash
   git clone <your-repo-url>
   cd student-crm
   npm install
   ```
2. Set up environment variables:
   cp .env.example .env.local
   ⚠️ .env.local must NOT be committed — it’s already in .gitignore.
   Example:

NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx

3. Configure Firebase:
   • Enable Authentication (Email/Password)
   • Enable Firestore Database

4. Start dev server:
   npm run dev

5. Test credentials (example):
   Email: maibu@pasha.com
   Password: maibu123
