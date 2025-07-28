import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure.tsx";

interface UserSettings {
  name: string;
  email: string;
  notifications: {
    enabled: boolean;
    reminderAdvance: number;
    missedDoseAlerts: boolean;
    refillReminders: boolean;
    dailySummary: boolean;
  };
  medicineDefaults: {
    defaultDosesPerDay: number;
    defaultReminderTimes: string[];
    defaultDurationDays: number;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

const defaultSettings: UserSettings = {
  name: "",
  email: "",
  notifications: {
    enabled: true,
    reminderAdvance: 30,
    missedDoseAlerts: true,
    refillReminders: true,
    dailySummary: false,
  },
  medicineDefaults: {
    defaultDosesPerDay: 1,
    defaultReminderTimes: ["08:00", "14:00", "20:00"],
    defaultDurationDays: 0,
  },
  privacy: {
    dataSharing: false,
    analytics: true,
  },
};

const useUserSettings = (userEmail?: string) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const loadSettings = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosSecure.get(
          `/api/user/${userEmail}/settings`
        );
        if (response.data.settings) {
          setSettings({
            ...defaultSettings,
            ...response.data.settings,
          });
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
        try {
          const savedSettings = localStorage.getItem("userSettings");
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsedSettings });
          }
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userEmail, axiosSecure]);

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!userEmail) return false;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      await axiosSecure.put(`/api/user/${userEmail}/settings`, {
        notifications: updatedSettings.notifications,
        medicineDefaults: updatedSettings.medicineDefaults,
        privacy: updatedSettings.privacy,
      });

      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error("Error saving user settings:", error);
      try {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        return true;
      } catch (localError) {
        console.error("Error saving to localStorage:", localError);
        return false;
      }
    }
  };

  const updateSetting = (
    section: keyof UserSettings,
    field: string,
    value: any
  ) => {
    const updatedSettings = {
      ...settings,
      [section]: {
        ...(settings[section] as Record<string, any>),
        [field]: value,
      },
    };
    setSettings(updatedSettings);
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("userSettings");
  };
  const getSetting = (section: keyof UserSettings, field: string) => {
    return (settings[section] as Record<string, any>)[field];
  };

  return {
    settings,
    loading,
    saveSettings,
    updateSetting,
    resetSettings,
    getSetting,
  };
};

export default useUserSettings;
export type { UserSettings };
