# 📚 Course Management System

A modern, full-featured **Course Management System** built with **React** and **shadcn/ui**, integrated with the ICT Bangladesh REST API. The application supports role-based access for both **Admin** and **regular Users**, with a clean and responsive UI.

---

## 🌐 Live Demo

🔗 [https://course-management-system-nu.vercel.app/](https://course-management-system-nu.vercel.app/)

---

## 🔐 Test Credentials

| Role  | Email                    | Password    |
| ----- | ------------------------ | ----------- |
| Admin | system@admin.com         | password123 |
| User  | asibhasanriyad@gmail.com | 006007      |

---

## ✨ Features

### 👤 User Features

- User registration and login
- Browse all available courses
- Enroll in courses
- View enrolled courses and progress
- Manage personal profile

### 🛠️ Admin Features

- Secure admin login
- Create, update, and delete courses
- Manage all user accounts
- View enrollment statistics
- Dashboard with overview metrics

---

## 🧰 Tech Stack

| Technology    | Purpose               |
| ------------- | --------------------- |
| React         | Frontend framework    |
| shadcn/ui     | UI component library  |
| Tailwind CSS  | Utility-first styling |
| React Router  | Client-side routing   |
| Axios / Fetch | API communication     |
| Vercel        | Deployment & hosting  |

---

## 📡 API

This project consumes the **ICT Bangladesh Course Management API**.

📖 API Docs: [https://register.cseconference.org/swagger/index.html](https://register.cseconference.org/swagger/index.html)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/course-management-system.git

# 2. Navigate to the project directory
cd course-management-system

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Navbar, Footer, Sidebar
│   │   └── shared/        # Reusable components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Dashboard.jsx
│   │   └── admin/         # Admin-only pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── services/          # API service functions
│   ├── context/           # Auth & global state
│   ├── App.jsx
│   └── main.jsx
├── screenshots/           # App screenshots
├── Project Presentation/  # Demo video
├── expected.txt           # Expected monthly salary
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📸 Screenshots

Screenshots of key features are available in the `/screenshots` directory.

---

## 🎥 Project Presentation

A video walkthrough of the project is available in the `/Project Presentation` directory.

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment.

---

## 📄 License

This project was developed as part of an assignment for **ICT Bangladesh**.

---

## 👨‍💻 Author

**Asib Hasan Riyad**

- Email: asibhasanriyad@gmail.com
- Project submitted to: mrhridoy.me@gmail.com
