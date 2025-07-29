# Medicine Reminder Full-Stack Project

A full-stack application for managing medicine reminders, tracking medicine intake, and sending notifications to users. The project consists of a backend API (Node.js, Express, PostgreSQL, Prisma, Firebase) and a frontend client (React, Vite, PWA-ready).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [PWA Features](#pwa-features)
- [Firebase Integration](#firebase-integration)
- [Prisma & PostgreSQL](#prisma--postgres)
- [Development Scripts](#development-scripts)

---

## Features

- User authentication with JWT
- Medicine CRUD operations
- Medicine intake tracking (taken days, unique days)
- Notification scheduling and sending (via Firebase Cloud Messaging)
- PWA support for offline usage and push notifications
- Responsive and modern UI

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Firebase Admin SDK
- **Frontend:** React, Vite, TypeScript, PWA
- **Database:** PostgreSQL with Prisma ORM
- **Notifications:** Firebase Cloud Messaging (FCM)

## Project Structure

```
medicine-reminder/
├── medicine-reminder-api/      # Backend API
│   ├── app.ts
│   ├── index.ts
│   ├── firebaseAdmin.ts
│   ├── config/                # DB & JWT configs
│   ├── controllers/           # Route controllers
│   ├── middlewares/           # JWT middleware
│   ├── routers/               # Express routers
│   ├── schedulers/            # Scheduled jobs (medicine reminders)
│   ├── utils/                 # Utility functions (FCM, notifications)
│   ├── prisma/                # Prisma schema & migrations
│   └── generated/             # Generated Prisma client
│
├── medicine-reminder-client/   # Frontend Client
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context providers
│   │   ├── firebase/          # Firebase client config
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   ├── routes/            # App routes
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets & service workers
│   └── ...
└── README.md                  # Project documentation
```

## API Overview

- **User Routes:** Register, login, profile and settings setup preference
- **Medicine Routes:** CRUD, mark as taken, get taken days
- **Notification Routes:** Subscribe, send, manage tokens
- **Scheduler:** Automated reminders for medicines

See `medicine-reminder-api/controllers/` and `routers/` for detailed route handlers.

## API Endpoints

### User Routes

- `GET /api/users` - Get all users
- `GET /api/user/:email` - Get user by email
- `POST /api/user/register` - Register new user
- `POST /api/user/social-login` - Social login
- `PUT /api/user/:email` - Update user
- `DELETE /api/user/:email/account` - Delete user account
- `GET /api/user/:email/settings` - Get user settings
- `PUT /api/user/:email/settings` - Update user settings

### Medicine Routes

- `GET /api/medicine/user/:userEmail` - Get user's medicines
- `GET /api/medicine/:id` - Get medicine by ID
- `POST /api/medicine` - Create new medicine
- `PUT /api/medicine/:id` - Update medicine
- `DELETE /api/medicine/:id` - Delete medicine
- `GET /api/medicine/:id/taken` - Get medicine taken status
- `PUT /api/medicine/:id/taken` - Update medicine taken status
- `GET /api/medicine/:id/history` - Get medicine history
- `GET /api/refill-reminders` - Get refill reminders
- `PUT /api/medicine/:id/refill` - Refill medicine

### Notification Routes

- `GET /api/notifications/:userEmail` - Get user notifications
- `PATCH /api/notifications/:notificationId/read` - Mark notification as read
- `PATCH /api/notifications/:userEmail/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:notificationId` - Delete notification

## Getting Started

### Backend Setup (`medicine-reminder-api`)

1. **Install dependencies:**
   ```sh
   cd medicine-reminder-api
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file for DB connection, JWT secret, and Firebase credentials.
   - Example:
     ```env
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     FIREBASE_CREDENTIALS=./utils/firebaseAdminSDK.json
     ```
3. **Run database migrations:**
   ```sh
   npx prisma migrate dev
   ```
4. **Start the server:**
   ```sh
   npm run dev
   ```

### Frontend Setup (`medicine-reminder-client`)

1. **Install dependencies:**
   ```sh
   cd medicine-reminder-client
   npm install
   ```
2. **Configure Firebase:**
   - Add your Firebase config to `src/firebase/`.
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## PWA Features

- Installable on mobile/desktop
- Offline support via service workers
- Push notifications (requires FCM setup)
- App icons and manifest included

## Firebase Integration

- **Backend:** Uses Firebase Admin SDK for sending notifications
- **Frontend:** Uses Firebase JS SDK for push notifications and token management
- **Setup:** Place your Firebase service account JSON in `medicine-reminder-api/utils/firebaseAdminSDK.json` and configure client SDK in `medicine-reminder-client/src/firebase/`

## Prisma & Postgres

- **Schema:** Defined in `medicine-reminder-api/prisma/schema.prisma`
- **Migrations:** Managed via Prisma CLI
- **Client:** Generated in `medicine-reminder-api/generated/prisma/`

## Development Scripts

- **Backend:**
  - `npm run dev` — Start API in development mode
  - `npx prisma migrate dev` — Run DB migrations
  - `npx prisma studio` — Open Prisma Studio
- **Frontend:**
  - `npm run dev` — Start Vite dev server
  - `npm run build` — Build for production

## Author

**Mehedi Hasan Akash**

- GitHub: [@m-akash](https://github.com/m-akash)
- LinkedIn: [Mehedi Hasan Akash](https://www.linkedin.com/in/mehedi-hasan-akash/)
