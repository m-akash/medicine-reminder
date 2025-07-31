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

```plaintext
medicine-reminder-client/
├── public/                  # Static assets (icons, manifest.webmanifest)
├── src/
│   ├── assets/              # Images and static resources
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── firebase/            # Firebase config and messaging logic
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components (Home, Login, etc.)
│   ├── routes/              # App routing
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── sw.ts                # The unified Service Worker source file
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
3. **Environment Variables:**
   - Create a `.env` file for any required environment variables (API base URL, Firebase keys, etc.).
   - Ensure your Firebase configuration variables (e.g., `VITE_FIREBASE_API_KEY`) are present in this file. These are used by both the client app and the service worker.

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

## Author

**Mehedi Hasan Akash**

- GitHub: [@m-akash](https://github.com/m-akash)
- LinkedIn: [Mehedi Hasan Akash](https://www.linkedin.com/in/mehedi-hasan-akash/)

---

For backend/API setup, see the `medicine-reminder-api` directory.
