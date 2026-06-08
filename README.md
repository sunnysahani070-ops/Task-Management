# TaskFlow: Premium Task Management Platform

![TaskFlow Header](https://via.placeholder.com/1200x400.png?text=TaskFlow+MERN+Stack+Application)

TaskFlow is a modern, responsive, and secure task management web application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed to demonstrate enterprise-grade architecture, advanced security features, and a premium user interface.

## 🚀 Key Features

### Backend Architecture & Security
- **Robust REST API**: Built with Express.js, featuring completely separated controllers, models, and routes.
- **Server-Side Pagination & Filtering**: Offloads heavy data processing to MongoDB, supporting pagination, full-text search, and multi-parameter filtering directly at the database level.
- **Advanced Authentication**: JWT-based authentication with 24-hour token lifespans.
- **Email Verification & Password Reset**: Secure, stateless flows using Nodemailer and time-bound custom JWTs to prevent unauthorized account access.
- **Enterprise Security**:
  - `Helmet`: Sets HTTP headers to secure the Express app.
  - `express-rate-limit`: Prevents brute-force attacks and DDoS by throttling IP requests.
  - `express-mongo-sanitize`: Prevents NoSQL query injection vulnerabilities.
  - `xss-clean`: Sanitizes user inputs to prevent Cross-Site Scripting (XSS) payloads.
- **Centralized Error Handling**: Custom middleware to cleanly format Mongoose validation, casting, and standard errors.

### Frontend UI/UX
- **Vite & React**: Lightning-fast build tooling and modern component architecture.
- **Tailwind CSS Integration**: Premium, bespoke design utilizing a dark-mode ready color palette, glassmorphism elements, and micro-animations.
- **Skeleton Loading & Empty States**: Comprehensive UX implementations to handle network latency and lack of data gracefully.
- **Activity Timeline**: Real-time tracking of user actions (Task Created, Completed, Updated) visualized in a clean timeline component.

## 🛠️ Tech Stack

- **Database**: MongoDB (Mongoose ORM)
- **Backend**: Node.js, Express.js
- **Frontend**: React (Vite), Tailwind CSS, React Router DOM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Tooling**: Nodemailer, Recharts (Analytics)

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd Task-Management
\`\`\`

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment:
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend/` directory:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173

# Optional: SMTP Configuration for Email features. If left blank, it defaults to Ethereal Email test accounts.
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
FROM_NAME=TaskFlow
FROM_EMAIL=noreply@taskflow.com
\`\`\`

Start the backend development server:
\`\`\`bash
npm run server
\`\`\`

### 3. Frontend Setup
In a new terminal, navigate to the frontend directory:
\`\`\`bash
cd frontend
npm install
\`\`\`

Create a `.env` file in the `frontend/` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

Start the frontend Vite server:
\`\`\`bash
npm run dev
\`\`\`

## 🛡️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `POST /api/auth/forgot-password` - Request a password reset link
- `POST /api/auth/reset-password/:id/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email address

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get paginated/filtered tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Toggle completion status
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/analytics` - Fetch user statistics
- `GET /api/tasks/activities` - Fetch activity timeline

---
*Developed for internship portfolio submission.*
