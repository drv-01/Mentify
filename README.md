# 🧠 Mentify

**Mentify** is a comprehensive, AI-driven student empowerment platform designed to harmonize academic excellence with mental well-being. By combining smart mood tracking, personalized mentorship, and wellness management, Mentify provides students with the tools they need to thrive in a high-pressure academic environment.

---

## 🌟 Key Features

### 🤖 24/7 AI-Powered Support
An intelligent chatbot that provides immediate mental health support, academic guidance, and emotional venting space, ensuring students never feel alone in their journey.

### 📊 Smart Mood Tracking
Go beyond simple check-ins. Mentify analyzes your emotional patterns, stress levels, and triggers to provide personalized insights and actionable wellness recommendations.

### 🤝 Expert Mentorship Network
Connect with a curated network of mentors and professionals. Manage your connections, schedule sessions, and get career-defining advice tailored to your goals.

### 🥗 Holistic Wellness Management
Integrated tools for fitness tracking, diet planning, and sleep quality monitoring. Mentify helps you maintain the physical health that powers your academic success.

### 📅 Intelligent Scheduler & Tasks
A dedicated productivity hub to manage your academic deadlines, personal tasks, and wellness activities in one unified view.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: React Context / Hooks
- **Carousels**: [React Slick](https://react-slick.neostack.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Prisma Provider)
- **Authentication**: JWT & Bcrypt
- **Emailing**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Mentify.git
cd Mentify
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mentify"
DIRECT_URL="postgresql://user:password@localhost:5432/mentify"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="your_email"
EMAIL_PASS="your_email_password"
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_FROM="Mentify <no-reply@example.com>"
PORT=8000
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```
Run migrations:
```bash
npx prisma migrate dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8000
```

### 4. Run the Application
Start Backend (from `/backend`):
```bash
npm run dev
```
Start Frontend (from `/frontend`):
```bash
npm run dev
```

For a deployed environment, set `BACKEND_URL`, `FRONTEND_URL`, and (when needed) `CORS_ORIGINS` to the public origins. Register this exact Google OAuth redirect URI in Google Cloud:

```text
<BACKEND_URL>/api/auth/google/callback
```

---

## 📂 Project Structure

```text
Mentify/
├── backend/                # Node.js Express server
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth and validation
│   │   └── server.js       # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # API and global configs
│   │   ├── App.jsx         # Main router
│   │   └── main.jsx        # Entry point
└── README.md
```

---

## 🛣️ Roadmap
- [ ] Integration with Google Calendar/Apple Health.
- [ ] Real-time peer-to-peer study groups.
- [ ] Advanced AI sentiment analysis for long-term health reports.
- [ ] Mobile App (React Native).

---

## 📄 License
This project is licensed under the ISC License.

## ✉️ Contact
**Project Maintainer** - [dhruvkumar](mailto:dhruv@example.com)

---
*Mentify — Because your mental health is your greatest academic asset.*
