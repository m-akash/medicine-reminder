# Medicine Reminder API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-black?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?logo=postgresql)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FCM-FFCA28?logo=firebase)](https://firebase.google.com/)

A **robust backend service** for managing **medications, reminders, and notifications**, powering the **Medicine Reminder** application. Built with **TypeScript, Node.js, Express, Postgres, and Prisma ORM**, this API ensures **secure user management, medicine tracking, push notifications, and analytics**.

---

## ✨ Features

- **👤 User Management:** Registration, JWT authentication, profile management, and settings.
- **💊 Medicine Management:** CRUD operations, schedules, dosage tracking, and refill reminders.
- **⏰ Reminder & Notification System:** Push notifications via **FCM**, missed dose alerts, and smart reminders based on users preferences.
- **📊 Reporting & History:** Medicine intake history and compliance tracking.
- **🔒 Secure:** JWT-based authentication with privacy-focused settings.

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Backend:** Node.js + Express.js
- **Database & ORM:** PostgreSQL + Prisma
- **Auth:** JWT (JSON Web Tokens)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Task Scheduler:** Node-cron

---

## 📂 Project Structure

```
medicine-reminder-api/
├── app.ts                  # Express app configuration
├── index.ts                # Server entry point
├── config/                 # Configurations (DB, JWT)
├── controllers/            # Request handlers
├── middlewares/            # JWT and other middlewares
├── routers/                # API routes
├── schedulers/             # Cron jobs for reminders
├── utils/                  # Helper functions (FCM, notifications)
└── prisma/                 # Prisma schema and migrations
```

---

## 🔗 API Endpoints

### 👤 User Routes

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/users`                | Get all users        |
| GET    | `/api/user/:email`          | Get user by email    |
| POST   | `/api/user/register`        | Register new user    |
| POST   | `/api/user/social-login`    | Social login         |
| PUT    | `/api/user/:email`          | Update user          |
| DELETE | `/api/user/:email/account`  | Delete user account  |
| GET    | `/api/user/:email/settings` | Get user settings    |
| PUT    | `/api/user/:email/settings` | Update user settings |

### 💊 Medicine Routes

| Method | Endpoint                        | Description               |
| ------ | ------------------------------- | ------------------------- |
| GET    | `/api/medicine/user/:userEmail` | Get user's medicines      |
| GET    | `/api/medicine/:id`             | Get medicine by ID        |
| POST   | `/api/medicine`                 | Create new medicine       |
| PUT    | `/api/medicine/:id`             | Update medicine           |
| DELETE | `/api/medicine/:id`             | Delete medicine           |
| GET    | `/api/medicine/:id/taken`       | Get medicine taken status |
| PUT    | `/api/medicine/:id/taken`       | Update taken status       |
| GET    | `/api/medicine/:id/history`     | Get medicine history      |
| GET    | `/api/refill-reminders`         | Get refill reminders      |
| PUT    | `/api/medicine/:id/refill`      | Refill medicine           |

### 🔔 Notification Routes

| Method | Endpoint                                  | Description               |
| ------ | ----------------------------------------- | ------------------------- |
| GET    | `/api/notifications/:userEmail`           | Get user notifications    |
| PATCH  | `/api/notifications/:notificationId/read` | Mark notification as read |
| PATCH  | `/api/notifications/:userEmail/read-all`  | Mark all as read          |
| DELETE | `/api/notifications/:notificationId`      | Delete notification       |

---

## ⚙️ Setup & Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/m-akash/medicine-reminder-api.git
cd medicine-reminder-api
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Setup environment variables**
Create `.env` in root:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
FIREBASE_ADMIN_SDK_PATH="./utils/firebaseAdminSDK.json"
```

4️⃣ **Run migrations**

```bash
npx prisma migrate dev
```

5️⃣ **Start development server**

```bash
npm run dev
```

---

## 📦 Scripts

| Script               | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start dev server with hot reload |
| `npm start`          | Start production server          |
| `npm run build`      | Build TypeScript project         |
| `npm run lint`       | Run ESLint checks                |
| `npm run type-check` | Check TypeScript types           |
| `npx prisma studio`  | Open Prisma database studio      |

---

## 🖥 Deployment

- Deployable to **Render, Railway, Heroku, or any VPS**
- Required: Node.js 18+, PostgreSQL, Firebase Admin SDK JSON

---

## 📊 Future Enhancements

- Role-based access control (RBAC)
- Email reminders & SMS integration
- Offline-first mobile sync
- Advanced reporting and analytics

---

## 👨‍💻 Author

**Mehedi Hasan Akash**  
[![GitHub](https://img.shields.io/badge/GitHub-m--akash-black?logo=github)](https://github.com/m-akash)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mehedi%20Hasan%20Akash-blue?logo=linkedin)](https://www.linkedin.com/in/mehedi-hasan-akash/)
