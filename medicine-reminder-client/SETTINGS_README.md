# Settings Page Documentation

## Overview

The Settings page provides a comprehensive interface for users to manage their account preferences, notification settings, medicine defaults, privacy settings, and appearance options.

## Features

### 1. Profile Settings

- **Edit Profile Information**: Update name and email address
- **Change Password**: Secure password change with current password verification
- **Account Actions**: Export data and delete account options

### 2. Notification Settings

- **Push Notifications**: Enable/disable all notifications
- **Reminder Advance Time**: Set how early to receive medicine reminders (15 min, 30 min, 1 hour, 2 hours)
- **Missed Dose Alerts**: Get notified when doses are missed
- **Refill Reminders**: Receive alerts when medicine is running low
- **Daily Summary**: Optional daily medication summary

### 3. Medicine Defaults

- **Default Doses Per Day**: Set preferred number of doses (1-4)
- **Default Duration**: Set default medicine duration in days
- **Default Reminder Times**: Configure preferred reminder times with add/remove functionality

### 4. Privacy & Security

- **Data Sharing**: Control anonymous usage data sharing
- **Analytics**: Enable/disable app usage analytics
- **Data Export**: Download all user data as JSON
- **Account Deletion**: Permanently delete account and all data

### 5. Appearance

- **Theme**: Choose between Light, Dark, or Auto (system preference)
- **Compact Mode**: Enable compact UI layout
- **Show Avatars**: Toggle user avatar display

## Technical Implementation

### Components

- **Settings.tsx**: Main settings page component
- **useUserSettings.tsx**: Custom hook for settings management

### State Management

- Settings are stored in localStorage for persistence
- Real-time updates across the application
- Type-safe settings interface

### API Integration

- Profile updates use existing user API endpoints
- FCM token management for notifications
- Data export functionality

## Usage

### Accessing Settings

1. Navigate to the Settings page via the navbar dropdown menu
2. Use the sidebar to switch between different setting categories
3. Make changes and click "Save All Settings" to persist changes

### Settings Hook Usage

```typescript
import useUserSettings from "../hooks/useUserSettings";

const MyComponent = () => {
  const { settings, updateSetting, getSetting } = useUserSettings();

  // Get a specific setting
  const isNotificationsEnabled = getSetting("notifications", "enabled");

  // Update a setting
  updateSetting("notifications", "enabled", false);
};
```

## File Structure

```
src/
├── pages/
│   └── Settings/
│       └── Settings.tsx          # Main settings page
├── hooks/
│   └── useUserSettings.tsx       # Settings management hook
└── routes/
    └── Main.tsx                  # Router configuration (updated)
```

## Future Enhancements

- Backend integration for settings persistence
- Theme implementation with CSS variables
- Advanced notification scheduling
- Settings import/export functionality
- User preferences analytics
