import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.tsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.tsx";
import useUserSettings from "../../hooks/useUserSettings.tsx";
import {
  showToast,
  showAlert,
  showConfirm,
} from "../../utils/notifications.ts";
import {
  FiUser,
  FiBell,
  FiShield,
  FiEye,
  FiEyeOff,
  FiSave,
  FiEdit3,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { MdNotifications, MdAccessTime, MdSecurity } from "react-icons/md";
import BaseHelmet from "../../components/BaseHelmet.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";

import type { UserSettings } from "../../hooks/useUserSettings.tsx";
import useUserByEmail from "../../hooks/useUserByEmail.tsx";
import { User } from "../../types/index.ts";

const Settings = () => {
  const { user, logoutUser } = useAuth();
  const email = user?.email || "";
  const { data } = useUserByEmail(email);
  const userInfo: User | undefined = data?.findUser;
  const axiosSecure = useAxiosSecure();
  const {
    settings,
    loading: settingsLoading,
    updateSetting,
    saveSettings,
  } = useUserSettings(user?.email);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
      }));
    }
  }, [userInfo]);

  const handleInputChange = (
    section: keyof UserSettings,
    field: string,
    value: any
  ) => {
    updateSetting(section, field, value);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.email) return;

    try {
      setSaving(true);
      await axiosSecure.put(`/api/user/${user.email}`, {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword && { password: formData.newPassword }),
      });

      showToast.success("Profile updated successfully!");
      setEditingProfile(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const success = await saveSettings(settings);
      if (success) {
        showToast.success("Settings saved successfully!");
      } else {
        showToast.error("Failed to save settings");
      }
    } catch (error) {
      showToast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await showConfirm.delete(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted."
    );

    if (result.isConfirmed) {
      try {
        setSaving(true);
        await axiosSecure.delete(`/api/user/${user?.email}/account`);
        showAlert.success("Account deleted successfully");
        logoutUser()
          .then(() => {
            window.location.href = "/";
          })
          .catch(() => {
            alert("Unsuccessfull attempt!");
          });
      } catch (error: any) {
        showToast.error(
          error.response?.data?.message || "Failed to delete account"
        );
      } finally {
        setSaving(false);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axiosSecure.get(
        `/api/medicine/user/${user?.email}`
      );
      const data = {
        user: user,
        medicines: response.data.findMedicine,
        settings: settings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medicine-reminder-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast.success("Data exported successfully!");
    } catch (error) {
      showToast.error("Failed to export data");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "notifications", label: "Notifications", icon: FiBell },
    {
      id: "medicineDefaults",
      label: "Set Medicine Times",
      icon: MdAccessTime,
    },
    { id: "privacy", label: "Privacy & Security", icon: FiShield },
  ];

  if (settingsLoading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  return (
    <>
      <BaseHelmet
        title="Settings - Medicine Reminder"
        description="Manage your account settings, notification preferences, and app customization options."
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and app settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Profile Settings
                      </h2>
                      <button
                        onClick={() => setEditingProfile(!editingProfile)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit3 className="w-4 h-4" />
                        {editingProfile ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleFormChange("name", e.target.value)
                          }
                          disabled={!editingProfile}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 text-black"
                        />
                      </div>

                      {editingProfile && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) =>
                                  handleFormChange(
                                    "currentPassword",
                                    e.target.value
                                  )
                                }
                                disabled
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <FiEyeOff className="w-5 h-5" />
                                ) : (
                                  <FiEye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) =>
                                handleFormChange("newPassword", e.target.value)
                              }
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleFormChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {editingProfile && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={
                            saving ||
                            formData.newPassword !== formData.confirmPassword
                          }
                          className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 transition-colors"
                        >
                          <FiSave className="w-4 h-4" />
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Account Actions */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Actions
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={handleExportData}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FiDownload className="w-4 h-4" />
                          Export Data
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Notification Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MdNotifications className="w-6 h-6 text-amber-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Push Notifications
                            </h3>
                            <p className="text-sm text-gray-600">
                              Receive medicine reminders and alerts
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.enabled}
                            onChange={(e) =>
                              handleInputChange(
                                "notifications",
                                "enabled",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reminder Advance Time
                          </label>
                          <select
                            value={settings.notifications.reminderAdvance}
                            onChange={(e) =>
                              handleInputChange(
                                "notifications",
                                "reminderAdvance",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                          >
                            <option value={15}>15 minutes before</option>
                            <option value={30}>30 minutes before</option>
                            <option value={60}>1 hour before</option>
                            <option value={120}>2 hours before</option>
                          </select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Missed Dose Alerts
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  settings.notifications.missedDoseAlerts
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "notifications",
                                    "missedDoseAlerts",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Refill Reminders
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.refillReminders}
                                onChange={(e) =>
                                  handleInputChange(
                                    "notifications",
                                    "refillReminders",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Daily Summary
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.dailySummary}
                                onChange={(e) =>
                                  handleInputChange(
                                    "notifications",
                                    "dailySummary",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medicine Defaults */}
                {activeTab === "medicineDefaults" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                      Default Reminder Times
                    </h2>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Doses Per Day
                        </label>
                        <select
                          value={settings.medicineDefaults.defaultDosesPerDay}
                          onChange={(e) =>
                            handleInputChange(
                              "medicineDefaults",
                              "defaultDosesPerDay",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        >
                          <option value={1}>1 dose per day</option>
                          <option value={2}>2 doses per day</option>
                          <option value={3}>3 doses per day</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Duration (Days)
                        </label>
                        <input
                          type="number"
                          value={
                            settings.medicineDefaults.defaultDurationDays || 0
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "medicineDefaults",
                              "defaultDurationDays",
                              parseInt(e.target.value)
                            )
                          }
                          min="1"
                          max="365"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        />
                      </div>
                    </div> */}

                    <div className="flex justify-center items-center">
                      <div className="space-y-3">
                        {settings.medicineDefaults.defaultReminderTimes.map(
                          (time, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="time"
                                value={time}
                                onChange={(e) => {
                                  const newTimes = [
                                    ...settings.medicineDefaults
                                      .defaultReminderTimes,
                                  ];
                                  newTimes[index] = e.target.value;
                                  handleInputChange(
                                    "medicineDefaults",
                                    "defaultReminderTimes",
                                    newTimes
                                  );
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                              />
                              <button
                                onClick={() => {
                                  const newTimes =
                                    settings.medicineDefaults.defaultReminderTimes.filter(
                                      (_, i) => i !== index
                                    );
                                  handleInputChange(
                                    "medicineDefaults",
                                    "defaultReminderTimes",
                                    newTimes
                                  );
                                }}
                                className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                        <button
                          onClick={() => {
                            const newTimes = [
                              ...settings.medicineDefaults.defaultReminderTimes,
                              "12:00",
                            ];
                            handleInputChange(
                              "medicineDefaults",
                              "defaultReminderTimes",
                              newTimes
                            );
                          }}
                          className="px-4 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          Add Time
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Privacy & Security
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MdSecurity className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Data Sharing
                            </h3>
                            <p className="text-sm text-gray-600">
                              Allow anonymous usage data to improve the app
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.dataSharing}
                            onChange={(e) =>
                              handleInputChange(
                                "privacy",
                                "dataSharing",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FiShield className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Analytics
                            </h3>
                            <p className="text-sm text-gray-600">
                              Help us improve by sharing app usage analytics
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.analytics}
                            onChange={(e) =>
                              handleInputChange(
                                "privacy",
                                "analytics",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Data Management
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Export Your Data
                          </h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Download all your medicine data and settings
                          </p>
                          <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" />
                            Export Data
                          </button>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-medium text-red-900 mb-2">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 mb-3">
                            Permanently delete your account and all data
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Save Button */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-lg hover:from-amber-500 hover:to-amber-700 disabled:bg-gray-400 transition-all duration-200 shadow-md"
                    >
                      <FiSave className="w-4 h-4" />
                      {saving ? "Saving..." : "Save All Settings"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
