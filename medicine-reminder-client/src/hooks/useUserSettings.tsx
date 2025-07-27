import { useState, useEffect } from 'react';
import useAxiosSecure from './useAxiosSecure.tsx';

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
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    showAvatars: boolean;
  };
}

const defaultSettings: UserSettings = {
  name: '',
  email: '',
  notifications: {
    enabled: true,
    reminderAdvance: 30,
    missedDoseAlerts: true,
    refillReminders: true,
    dailySummary: false,
  },
  medicineDefaults: {
    defaultDosesPerDay: 2,
    defaultReminderTimes: ['08:00', '20:00'],
    defaultDurationDays: 30,
  },
  privacy: {
    dataSharing: false,
    analytics: true,
  },
  appearance: {
    theme: 'auto',
    compactMode: false,
    showAvatars: true,
  },
};

const useUserSettings = (userEmail?: string) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosSecure.get(`/api/user/${userEmail}/settings`);
        if (response.data.settings) {
          setSettings({
            ...defaultSettings,
            ...response.data.settings,
          });
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        // Fallback to localStorage if API fails
        try {
          const savedSettings = localStorage.getItem('userSettings');
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsedSettings });
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userEmail, axiosSecure]);

  // Save settings to API
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!userEmail) return false;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to API
      await axiosSecure.put(`/api/user/${userEmail}/settings`, {
        notifications: updatedSettings.notifications,
        medicineDefaults: updatedSettings.medicineDefaults,
        privacy: updatedSettings.privacy,
        appearance: updatedSettings.appearance,
      });

      // Also save to localStorage as backup
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Error saving user settings:', error);
      // Fallback to localStorage only
      try {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
        return true;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        return false;
      }
    }
  };

  // Update a specific setting
  const updateSetting = (section: keyof UserSettings, field: string, value: any) => {
    const updatedSettings = {
      ...settings,
      [section]: {
        ...(settings[section] as Record<string, any>),
        [field]: value,
      },
    };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
  };

  // Get a specific setting value
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