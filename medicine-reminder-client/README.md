# Medicine Reminder Client

A modern, responsive Progressive Web App (PWA) for managing and reminding users to take their medicines on time. This is the frontend for the Medicine Reminder project, built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Secure login and registration (integrated with backend API)
- **Medicine Management**: Add, edit, and delete medicines with schedules
- **Reminders & Notifications**: Receive push notifications for medicine reminders (PWA + Firebase Cloud Messaging)
- **Responsive Design**: Mobile-first UI for seamless experience on all devices
- **PWA Support**: Installable, offline support, and background sync
- **History Tracking**: Track taken/untaken medicines by day

## Tech Stack

- **React** (with hooks & context)
- **TypeScript**
- **Vite** (for fast development & build)
- **Firebase** (for push notifications)
- **Tailwind CSS** (or your preferred CSS framework)
- **Service Worker** (for PWA features)

## Project Structure

```
medicine-reminder-client/
├── public/                  # Static assets (icons, manifest, sw, etc.)
├── src/
│   ├── assets/              # Images and static resources
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers (auth, etc.)
│   ├── firebase/            # Firebase config and messaging logic
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components (Home, Login, etc.)
│   ├── routes/              # App routing
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json             # Project metadata and scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/m-akash/medicine-reminder.git
   cd medicine-reminder/medicine-reminder-client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Firebase:**

   - Add your Firebase config to `src/firebase/` (see `firebase-messaging-sw.js` and related files).
   - Update `public/firebase-messaging-sw.js` with your Firebase messaging sender ID.

4. **Environment Variables:**
   - Create a `.env` file for any required environment variables (API base URL, Firebase keys, etc.).

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

### Building for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## PWA Features

- Add to Home Screen on mobile
- Offline support
- Push notifications (requires HTTPS and proper Firebase setup)

## Customization

- Update icons and manifest in `public/`
- Modify theme and styles in `src/index.css` or your preferred CSS framework

---

For backend/API setup, see the `medicine-reminder-api` directory.
