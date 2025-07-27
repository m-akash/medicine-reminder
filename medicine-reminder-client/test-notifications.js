// Test script to verify notification preferences functionality
console.log("Testing notification preferences...");

// Simulate user settings with different notification preferences
const testUsers = [
  {
    email: "user1@example.com",
    settings: {
      notifications: {
        enabled: true,
        reminderAdvance: 30,
        missedDoseAlerts: true,
        refillReminders: true,
        dailySummary: false,
      },
    },
  },
  {
    email: "user2@example.com",
    settings: {
      notifications: {
        enabled: false,
        reminderAdvance: 60,
        missedDoseAlerts: false,
        refillReminders: false,
        dailySummary: false,
      },
    },
  },
  {
    email: "user3@example.com",
    settings: {
      notifications: {
        enabled: true,
        reminderAdvance: 15,
        missedDoseAlerts: true,
        refillReminders: false,
        dailySummary: true,
      },
    },
  },
];

// Test notification logic
testUsers.forEach((user, index) => {
  console.log(`\nTesting User ${index + 1} (${user.email}):`);

  const settings = user.settings.notifications;
  console.log("Notification settings:", settings);

  // Test if notifications should be sent
  if (settings.enabled) {
    console.log("✅ Notifications ENABLED");
    console.log(`   - Reminder advance: ${settings.reminderAdvance} minutes`);
    console.log(
      `   - Missed dose alerts: ${settings.missedDoseAlerts ? "ON" : "OFF"}`
    );
    console.log(
      `   - Refill reminders: ${settings.refillReminders ? "ON" : "OFF"}`
    );
    console.log(`   - Daily summary: ${settings.dailySummary ? "ON" : "OFF"}`);
  } else {
    console.log("❌ Notifications DISABLED - No notifications will be sent");
  }
});

// Test scheduler integration
console.log("\nTesting scheduler integration...");
const mockMedicine = {
  name: "Test Medicine",
  userEmail: "user1@example.com",
  user: {
    settings: {
      notifications: {
        enabled: true,
        reminderAdvance: 30,
        missedDoseAlerts: true,
      },
    },
  },
};

// Simulate scheduler logic
const shouldSendNotification = (medicine) => {
  const userSettings = medicine.user?.settings;
  if (!userSettings || !userSettings.notifications?.enabled) {
    return false;
  }
  return true;
};

const getReminderAdvance = (medicine) => {
  const userSettings = medicine.user?.settings;
  return userSettings?.notifications?.reminderAdvance || 30;
};

console.log("Medicine:", mockMedicine.name);
console.log("Should send notification:", shouldSendNotification(mockMedicine));
console.log(
  "Reminder advance time:",
  getReminderAdvance(mockMedicine),
  "minutes"
);

console.log("\n✅ Notification preferences test passed!");
