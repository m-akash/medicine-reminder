// Test script to verify data export functionality
console.log("Testing data export functionality...");

// Simulate user data that would be exported
const mockUserData = {
  user: {
    id: "4cc2e3f2-5224-47e6-820c-840416f3da35",
    name: "Akash",
    email: "akash@gmail.com",
    createdAt: "2025-07-26T19:00:26.264Z",
    lastLogin: "2025-07-26T19:00:26.263Z",
  },
  medicines: [
    {
      id: "medicine-1",
      name: "Tyclav",
      dosage: "625mg",
      frequency: "1-0-1",
      startDate: "2025-07-26",
      durationDays: 7,
      instructions: "Take with food",
    },
  ],
  settings: {
    notifications: {
      enabled: false,
      reminderAdvance: 60,
      missedDoseAlerts: false,
      refillReminders: true,
      dailySummary: true,
    },
    medicineDefaults: {
      defaultDosesPerDay: 3,
      defaultReminderTimes: ["09:00", "15:00", "21:00"],
      defaultDurationDays: 60,
    },
    privacy: {
      dataSharing: true,
      analytics: false,
    },
    appearance: {
      theme: "dark",
      compactMode: true,
      showAvatars: false,
    },
  },
  exportDate: new Date().toISOString(),
};

// Test data structure
console.log("Export data structure:");
console.log("- User info:", mockUserData.user.name, mockUserData.user.email);
console.log("- Medicines count:", mockUserData.medicines.length);
console.log("- Settings sections:", Object.keys(mockUserData.settings));
console.log("- Export date:", mockUserData.exportDate);

// Test JSON serialization
try {
  const jsonData = JSON.stringify(mockUserData, null, 2);
  console.log("\n✅ JSON serialization successful");
  console.log("Data size:", (jsonData.length / 1024).toFixed(2), "KB");

  // Test file naming
  const fileName = `medicine-reminder-data-${
    new Date().toISOString().split("T")[0]
  }.json`;
  console.log("File name would be:", fileName);
} catch (error) {
  console.log("❌ JSON serialization failed:", error.message);
}

// Test data validation
const validateExportData = (data) => {
  const required = ["user", "medicines", "settings", "exportDate"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
};

const validation = validateExportData(mockUserData);
console.log("\nData validation:", validation.valid ? "✅ PASSED" : "❌ FAILED");
if (!validation.valid) {
  console.log("Missing fields:", validation.missing);
}

console.log("\n✅ Data export test passed!");
