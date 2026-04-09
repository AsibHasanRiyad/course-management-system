# 📚 Course Management System

A responsive **Course Management System** built with **React, TypeScript, Vite, Tailwind CSS, and shadcn/ui**. It integrates with the **ICT Bangladesh Course Management API** and supports both **admin** and **regular user** workflows.

---

## 🌐 Live Demo

🔗 [https://course-management-system-nu.vercel.app/](https://course-management-system-nu.vercel.app/)

---

## ✨ Core Features

### 👥 Public & User Features

- Register and log in with API-based authentication
- Browse all courses and categories
- View detailed course information
- Access a personal dashboard
- Edit profile information
- Responsive navigation for desktop, tablet, and mobile

### 🛠️ Admin Features

- Admin dashboard with overview cards
- Create new courses from `/admin/courses/new`
- Manage users from `/admin/users`
- Update user roles and active status
- Delete user accounts
- View dashboard weather widget powered by `/WeatherForecast`

---

## 🧰 Tech Stack

| Technology               | Purpose                       |
| ------------------------ | ----------------------------- |
| `React 19`               | Frontend UI                   |
| `TypeScript`             | Type safety                   |
| `Vite`                   | Development and build tooling |
| `Tailwind CSS`           | Styling                       |
| `shadcn/ui` + `Radix UI` | UI components                 |
| `React Router`           | Routing                       |
| `TanStack Query`         | Data fetching and caching     |
| `Axios`                  | API requests                  |
| `Sonner`                 | Toast notifications           |
| `Vercel`                 | Deployment                    |

---

## 📡 API Integration

This project consumes the REST API hosted at:

📖 **Swagger Docs:** [https://register.cseconference.org/swagger/index.html](https://register.cseconference.org/swagger/index.html)

### Main API areas used

- `/api/Auth/login`
- `/api/Auth/register`
- `/api/Courses`
- `/api/Categories`
- `/api/Enrollments`
- `/api/Users`
- `/WeatherForecast`

---

## 🚀 Getting Started

### Prerequisites

- `Node.js` 18+
- `npm`

### Installation

```bash
git clone https://github.com/AsibHasanRiyad/course-management-system.git
cd course-management-system
npm install
npm run dev
```

App runs at:

```bash
http://localhost:5173
```

---

## 📜 Available Scripts

```bash
npm run dev      # start development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # run eslint
```

---

## 🗂️ Current Project Structure

```text
course-management-system/
├── public/
├── src/
│   ├── api/
│   │   ├── auth.api.ts
│   │   ├── category.api.ts
│   │   ├── course.api.ts
│   │   ├── enrollment.api.ts
│   │   ├── user.api.ts
│   │   └── weather.api.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── shared/
│   │   │   └── CourseCard.tsx
│   │   └── ui/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.tsx
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── CourseDetails.page.tsx
│   │   ├── Home.page.tsx
│   │   ├── Profile.page.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── dashboard/
│   │       ├── Categories.tsx
│   │       ├── Courses.tsx
│   │       ├── CreateCourse.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Enrollments.tsx
│   │       ├── ManageUsers.tsx
│   │       └── Users.tsx
│   ├── routes/
│   │   ├── AppRouter.tsx
│   │   └── PrivateRoute.tsx
│   ├── type/
│   │   └── index.ts
│   ├── utils/
│   │   └── axios.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧭 Main Routes

| Route                | Description              |
| -------------------- | ------------------------ |
| `/`                  | Home page                |
| `/courses`           | Browse all courses       |
| `/courses/:id`       | Course details           |
| `/categories`        | Category listing         |
| `/login`             | Login page               |
| `/register`          | Register page            |
| `/profile`           | User profile             |
| `/dashboard`         | Main dashboard           |
| `/admin/courses/new` | Admin create course page |
| `/admin/users`       | Admin manage users page  |

---

## 🔐 Demo Credentials

| Role  | Email                      | Password      |
| ----- | -------------------------- | ------------- |
| Admin | `system@admin.com`         | `password123` |
| User  | `asibhasanriyad@gmail.com` | `006007`      |

---

## 📦 Production Build

```bash
npm run build
```

The production output is generated in the `dist/` folder.

---

## 👨‍💻 Author

**Asib Hasan Riyad**

- Email: `asibhasanriyad@gmail.com`
- Submission: `mrhridoy.me@gmail.com`
