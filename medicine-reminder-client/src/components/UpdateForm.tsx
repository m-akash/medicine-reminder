interface FormState {
  userEmail: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  scheduledTimes: string[];
  durationDays: string;
  originalDurationDays: string;
  instructions: string;
  totalPills: string;
  originalTotalPills: string;
  pillsPerDose: string;
  dosesPerDay: string;
}

import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import { data, useLoaderData, useNavigate } from "react-router-dom";
import {
  medicineNotifications,
  formNotifications,
} from "../utils/notifications.ts";
import useUserSettings from "../hooks/useUserSettings.tsx";
import useAuth from "../hooks/useAuth.tsx";

const UpdateForm = () => {
  const { user } = useAuth();
  const loaderData = useLoaderData();
  const med = loaderData?.findMedi || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { settings } = useUserSettings(user?.email);

  const [form, setForm] = useState<FormState>(() => {
    const existingTimes =
      med?.reminders?.[0]?.times?.map((t: any) =>
        new Date(t.time).toTimeString().slice(0, 5)
      ) || [];

    return {
      userEmail: med.userEmail || "",
      name: med.name || "",
      dosage: med.dosage || "",
      frequency: med.frequency || "",
      startDate: med.startDate
        ? med.startDate.slice(0, 10)
        : new Date().toISOString().split("T")[0],
      scheduledTimes: existingTimes,
      durationDays: med.durationDays?.toString() || "",
      originalDurationDays: med.originalDurationDays?.toString() || "",
      instructions: med.instructions || "",
      totalPills: med.totalPills?.toString() || "",
      originalTotalPills: med.originalTotalPills?.toString() || "",
      pillsPerDose: med.pillsPerDose?.toString() || "",
      dosesPerDay: med.dosesPerDay?.toString() || "",
    };
  });

  const [loading, setLoading] = useState(false);

  const userDefaultTimes = settings.medicineDefaults?.defaultReminderTimes || [
    "08:00",
    "14:00",
    "20:00",
  ];

  const parseFrequencyAndSetTimes = (frequency: string) => {
    const pattern = frequency.split("-").map(Number);
    const times = [];
    if (pattern[0] === 1) times.push(userDefaultTimes[0]);
    if (pattern[1] === 1) times.push(userDefaultTimes[1]);
    if (pattern[2] === 1) times.push(userDefaultTimes[2]);
    return times;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "frequency") {
      const times = parseFrequencyAndSetTimes(value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        scheduledTimes: times,
        dosesPerDay: times.length.toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!med.id) {
      formNotifications.requiredField("Medicine ID");
      return;
    }

    if (form.scheduledTimes.length === 0) {
      formNotifications.requiredField("frequency pattern");
      return;
    }

    setLoading(true);

    const payload: any = {
      ...form,
      durationDays: form.durationDays ? Number(form.durationDays) : 0,
      originalDurationDays: form.originalDurationDays
        ? Number(form.originalDurationDays)
        : 0,
      totalPills: form.totalPills ? Number(form.totalPills) : 0,
      originalTotalPills: form.originalTotalPills
        ? Number(form.originalTotalPills)
        : 0,
      pillsPerDose: form.pillsPerDose ? Number(form.pillsPerDose) : 0,
      dosesPerDay: form.dosesPerDay ? Number(form.dosesPerDay) : 0,
      startDate: form.startDate
        ? new Date(form.startDate).toISOString()
        : new Date().toISOString(),
      scheduledTimes: form.scheduledTimes,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    console.log("Sending update payload:", payload);
    console.log("Medicine ID:", med.id);

    try {
      const updateMedi = await axiosSecure.put(
        `/api/medicine/${med.id}`,
        payload
      );
      if (updateMedi.statusText === "OK") {
        medicineNotifications.updated(med.name);
      }
      navigate("/medication");
    } catch (err) {
      console.error("Update failed", err);
      formNotifications.requiredField(
        "Update failed. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg p-6 rounded-xl"
    >
      <h2 className="text-xl font-bold text-primary text-center mb-2">
        Update Medicine
      </h2>
      <input type="hidden" name="userEmail" value={form.userEmail} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Medicine Name<span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Medicine Name"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Dosage</label>
        <input
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          placeholder="Dosage (e.g. 500mg)"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Frequency Pattern (Key Field)
        </label>
        <input
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          required
          placeholder="e.g. 1-0-1 (Morning-Evening)"
          className="input input-bordered w-full text-black bg-gray-100 border-2 border-blue-300"
        />
        <p className="text-xs text-gray-500">
          Format: Morning-Afternoon-Evening (1 = take, 0 = skip)
        </p>
      </div>

      {/* <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Scheduled Times (Auto-set based on frequency pattern)
        </label>
        {form.scheduledTimes.length > 0 ? (
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">
              ✅ Scheduled times:
            </p>
            <div className="space-y-1">
              {form.scheduledTimes.map((time: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-green-700">
                    {index + 1}.{" "}
                    {(() => {
                      // Show label based on userDefaultTimes
                      if (time === userDefaultTimes[0])
                        return `${time} (Morning)`;
                      if (time === userDefaultTimes[1])
                        return `${time} (Afternoon)`;
                      if (time === userDefaultTimes[2])
                        return `${time} (Evening)`;
                      return time;
                    })()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              Set "Doses Per Day" below to automatically schedule times
            </p>
          </div>
        )}
      </div> */}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Started Date<span className="text-red-500">*</span>
        </label>
        <input
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          type="date"
          className="input input-bordered w-full text-black bg-gray-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hover:scale-110 [&::-webkit-calendar-picker-indicator]:transition-transform"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Total Duration (days)<span className="text-red-500">*</span>
        </label>
        <input
          name="originalDurationDays"
          value={form.originalDurationDays}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How long will you take this medicine for in total? (days)"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Current Duration (days)<span className="text-red-500">*</span>
        </label>
        <input
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How long can you take the medicine you have now? (days)"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <input
        name="originalTotalPills"
        value={form.originalTotalPills}
        onChange={handleChange}
        type="number"
        min="1"
        className="hidden"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Current Total Pills<span className="text-red-500">*</span>
        </label>
        <input
          name="totalPills"
          value={form.totalPills}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How many pills do you have now?"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Pills Per Dose<span className="text-red-500">*</span>
        </label>
        <input
          name="pillsPerDose"
          value={form.pillsPerDose}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How many pills would you take per dose?"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <input
        name="dosesPerDay"
        value={form.dosesPerDay}
        onChange={handleChange}
        type="number"
        min="1"
        className="hidden"
      />

      <input
        type="hidden"
        name="instructions"
        value={form.instructions}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Medicine"}
      </button>
    </form>
  );
};

export default UpdateForm;
