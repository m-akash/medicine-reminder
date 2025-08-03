# Medicine Reminder Client

A **modern, responsive Progressive Web App (PWA)** for **medicine tracking and reminders**, designed to help users **manage their medications and receive push notifications**. This is the **frontend** of the **Medicine Reminder** project, built with **React, TypeScript, Vite, and Firebase**.

---

## ✨ Features

- **👤 User Authentication**: Login and registration integrated with the backend API  
- **💊 Medicine Management**: Add, edit, and delete medicines with flexible schedules  
- **🔔 Reminders & Notifications**: Push notifications using **Firebase Cloud Messaging (FCM)**  
- **📱 PWA Support**: Installable app, offline support, and background sync  
- **📊 History Tracking**: Track daily medicine intake (taken/missed)  
- **🎨 Responsive Design**: Mobile-first UI for all screen sizes  

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript  
- **Build Tool**: Vite 5  
- **Styling**: Tailwind CSS (or preferred CSS framework)  
- **Push Notifications**: Firebase Cloud Messaging (FCM)  
- **PWA Support**: Custom Service Worker with offline caching and A2HS  
- **State Management**: React Context API + Hooks  

---

## 📂 Project Structure

```
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
│   ├── sw.ts                # Service Worker source
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json             # Project metadata and scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── ...
```

---

## ⚙️ Setup & Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/m-akash/medicine-reminder.git
cd medicine-reminder/medicine-reminder-client
```

2️⃣ **Install dependencies**
```bash
npm install
# or
yarn install
```

3️⃣ **Configure environment variables**  
Create a `.env` file in the root:
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-public-vapid-key
```

4️⃣ **Start development server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at **http://localhost:5173**

---

## 📦 Available Scripts

| Script             | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start development server              |
| `npm run build`    | Build the app for production          |
| `npm run preview`  | Preview production build locally      |
| `npm run lint`     | Run ESLint checks                     |

---

## 📱 PWA Features

- **Add to Home Screen** on mobile devices  
- **Offline Support** via Service Worker caching  
- **Push Notifications** with Firebase Cloud Messaging  
- **Background Sync** for reliable reminders  

> ⚠️ PWA features require **HTTPS** in production.

---

## 🖥 Deployment

- **Netlify**, **Vercel**, or any **static hosting with HTTPS**  
- Ensure you configure:
  - Service Worker (`sw.ts`) is built correctly
  - Firebase credentials for FCM
  - `.env` for production values

---

## 📊 Future Enhancements

- Dark mode toggle  
- Improved medicine analytics and adherence reports  
- Multi-language support (i18n)  
- Full offline mode with IndexedDB syncing  

---

## 👨‍💻 Author

**Mehedi Hasan Akash**  
[![GitHub](https://img.shields.io/badge/GitHub-m--akash-black?logo=github)](https://github.com/m-akash)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mehedi%20Hasan%20Akash-blue?logo=linkedin)](https://www.linkedin.com/in/mehedi-hasan-akash/)  