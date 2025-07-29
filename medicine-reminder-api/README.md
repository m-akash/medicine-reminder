# Medicine Reminder API

A robust backend service for the Medicine Reminder application, built with Node.js, Express, TypeScript, and Prisma ORM. This API provides comprehensive functionality for managing medications, reminders, notifications, and user preferences.

## Features

- **User Management**

  - User registration and authentication
  - Social login integration
  - User profile management
  - Custom user settings and preferences

- **Medicine Management**

  - Create, read, update, and delete medications
  - Track medicine intake
  - Manage medicine schedules
  - Refill tracking and reminders

- **Reminder System**

  - Customizable reminder schedules
  - Multiple daily reminders
  - Reminder activation/deactivation
  - Missed dose tracking

- **Notification System**

  - Real-time push notifications via Firebase Cloud Messaging (FCM)
  - Customizable notification preferences
  - Multiple notification types:
    - Medicine reminders
    - Missed dose alerts
    - Refill reminders
    - System notifications

- **History and Reports**
  - Medicine intake history
  - Compliance tracking
  - Detailed medicine logs

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Push Notifications**: Firebase Cloud Messaging (FCM)

## Project Structure

```
medicine-reminder-api/
├── app.ts                  # Express app configuration
├── index.ts               # Server entry point
├── config/                # Configuration files
│   ├── db.config.ts      # Database configuration
│   └── jwt.config.ts     # JWT configuration
├── controllers/           # Request handlers
│   ├── medicine.controller.ts
│   ├── notification.controller.ts
│   └── user.controller.ts
├── middlewares/          # Custom middleware
│   └── jwtMiddleware.ts
├── routers/              # Route definitions
│   ├── medicine.route.ts
│   ├── notification.route.ts
│   └── user.route.ts
├── schedulers/           # Scheduled tasks
│   └── medicineReminder.ts
├── utils/                # Utility functions
│   ├── fcmUtils.ts
│   └── notificationUtils.ts
└── prisma/               # Prisma configuration and migrations
    └── schema.prisma     # Database schema
```

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

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```env
   DATABASE_URL="your-database-url"
   JWT_SECRET="your-jwt-secret"
   FIREBASE_ADMIN_SDK_PATH="path-to-firebase-admin-sdk.json"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Development**: `npm run dev`
- **Type Check**: `npm run type-check`
- **Lint**: `npm run lint`

## Features in Detail

### Medicine Management

- Supports various medicine types and schedules
- Flexible dosage and frequency settings
- Track remaining pills and duration
- Automatic refill reminders
- Medicine intake history and compliance tracking

### Reminder System

- Customizable reminder times
- Support for multiple daily doses
- Smart reminder scheduling based on user preferences
- Missed dose detection and alerts
- Refill reminders based on remaining medicine

### User Settings

- Notification preferences
- Default medicine settings
- Privacy settings
- Data sharing preferences
- Analytics opt-in/out

## Author

**Mehedi Hasan Akash**

- GitHub: [@m-akash](https://github.com/m-akash)
- LinkedIn: [Mehedi Hasan Akash](https://www.linkedin.com/in/mehedi-hasan-akash/)
