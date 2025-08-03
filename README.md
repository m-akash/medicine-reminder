# 💊 Medicine Reminder — Full-Stack Application

A comprehensive full-stack(backend heavy) application to help users manage and track their medicine intake with features like notifications, scheduling, PWA support, and offline-first design.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [PWA & Firebase Features](#pwa--firebase-features)
- [Prisma & PostgreSQL](#prisma--postgresql)
- [Development Scripts](#development-scripts)
- [Author](#author)

---

## 🧠 Overview

Medicine Reminder is a full-stack application built to help users track daily medicine intake, manage prescriptions, receive push notifications for scheduled reminders, and view refill alerts. It supports Progressive Web App (PWA) capabilities for offline use and push notifications.

---

## 🚀 Features

- ✅ User registration, login, and profile management (JWT-based)
- 💊 CRUD operations for medicines
- 📅 Medicine intake tracking with history
- 🔔 Push notifications via Firebase Cloud Messaging
- 🔄 Refill reminders
- 📲 Installable PWA with offline support
- 🖥️ Responsive UI with modern UX

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Firebase Admin SDK
- **Frontend:** React, Vite, TypeScript, PWA-ready
- **Notifications:** Firebase Cloud Messaging (FCM)
- **ORM:** Prisma

---

## 📁 Project Structure

```
medicine-reminder/
├── medicine-reminder-api/      # Backend API
│   ├── index.ts
│   ├── firebaseAdmin.ts
│   ├── config/                # DB & JWT configs
│   ├── controllers/           # Route controllers
│   ├── middlewares/           # JWT middleware
│   ├── routers/               # Express routers
│   ├── schedulers/            # Scheduled jobs
│   ├── utils/                 # Utility functions (e.g. FCM)
│   ├── prisma/                # Prisma schema & migrations
│   └── generated/             # Prisma client
│
├── medicine-reminder-client/   # Frontend Client
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── firebase/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── ...
└── README.md
```

---

## ⚙️ Setup & Installation

### Backend Setup (`medicine-reminder-api`)

1. **Install dependencies**
   ```bash
   cd medicine-reminder-api
   npm install
   ```

2. **Create `.env`**
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   FIREBASE_CREDENTIALS=./utils/firebaseAdminSDK.json
   ```

3. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

---

### Frontend Setup (`medicine-reminder-client`)

1. **Install dependencies**
   ```bash
   cd medicine-reminder-client
   npm install
   ```

2. **Add Firebase config**
   - Place Firebase configuration in `src/firebase/firebaseConfig.ts`.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the app**
   [medping.netlify.app](https://mediping.netlify.app/)

---

## 📡 API Reference

### 👤 User Routes

- `GET /api/users`
- `GET /api/user/:email`
- `POST /api/user/register`
- `POST /api/user/social-login`
- `PUT /api/user/:email`
- `DELETE /api/user/:email/account`
- `GET /api/user/:email/settings`
- `PUT /api/user/:email/settings`

### 💊 Medicine Routes

- `GET /api/medicine/user/:userEmail`
- `GET /api/medicine/:id`
- `POST /api/medicine`
- `PUT /api/medicine/:id`
- `DELETE /api/medicine/:id`
- `GET /api/medicine/:id/taken`
- `PUT /api/medicine/:id/taken`
- `GET /api/medicine/:id/history`
- `GET /api/refill-reminders`
- `PUT /api/medicine/:id/refill`

### 🔔 Notification Routes

- `GET /api/notifications/:userEmail`
- `PATCH /api/notifications/:notificationId/read`
- `PATCH /api/notifications/:userEmail/read-all`
- `DELETE /api/notifications/:notificationId`

---

## 🧩 PWA & Firebase Features

- **PWA:**
  - Installable
  - Offline support via service workers
  - App manifest and icons included

- **Firebase Integration:**
  - **Backend:** Firebase Admin SDK for push
  - **Frontend:** Firebase JS SDK for token handling
  - **Setup:** Add Firebase JSON in `medicine-reminder-api/utils/firebaseAdminSDK.json`

---

## 🧬 Prisma & PostgreSQL

- **Schema:** Located at `medicine-reminder-api/prisma/schema.prisma`
- **Migrations:** Managed via `npx prisma migrate`
- **Client:** Auto-generated under `generated/`

---

## 🧪 Development Scripts

### Backend

- `npm run dev` — Start dev server
- `npx prisma migrate dev` — Run DB migrations
- `npx prisma studio` — Visual DB browser

### Frontend

- `npm run dev` — Start dev server
- `npm run build` — Build production app

---

## 👤 Author

**Mehedi Hasan Akash**  
- GitHub: [@m-akash](https://github.com/m-akash)  
- LinkedIn: [Mehedi Hasan Akash](https://www.linkedin.com/in/mehedi-hasan-akash/)