import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import useAuth from "../hooks/useAuth.tsx";
import useUserSettings from "../hooks/useUserSettings.tsx";
import {
  medicineNotifications,
  formNotifications,
} from "../utils/notifications.ts";
import { useNavigate } from "react-router-dom";

const AddMedicineForm: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { settings } = useUserSettings(user?.email);

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split("T")[0],
    scheduledTimes: [] as string[],
    durationDays: "",
    originalDurationDays: "",
    instructions: "",
    totalPills: "",
    originalTotalPills: "",
    pillsPerDose: "",
    dosesPerDay: "",
  });

  useEffect(() => {
    if (settings.medicineDefaults) {
      const defaults = settings.medicineDefaults;
      setForm((prev) => ({
        ...prev,
        scheduledTimes: defaults.defaultReminderTimes,
      }));
    }
  }, [settings.medicineDefaults]);

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

  const calculateOriginalTotalPills = (
    frequency: string,
    originalDurationDays: string
  ) => {
    if (!frequency || !originalDurationDays) return "";

    const pattern = frequency.split("-").map(Number);
    const dosesPerDay = pattern.reduce((sum, dose) => sum + dose, 0);
    const totalPills = dosesPerDay * Number(originalDurationDays);

    return totalPills.toString();
  };
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "frequency") {
      const times = parseFrequencyAndSetTimes(value);
      const originalTotalPills = calculateOriginalTotalPills(
        value,
        form.originalDurationDays
      );
      setForm((prev) => ({
        ...prev,
        [name]: value,
        scheduledTimes: times,
        dosesPerDay: times.length.toString(),
        originalTotalPills: originalTotalPills,
      }));
    }

    if (name === "originalDurationDays") {
      const originalTotalPills = calculateOriginalTotalPills(
        form.frequency,
        value
      );
      setForm((prev) => ({
        ...prev,
        [name]: value,
        originalTotalPills: originalTotalPills,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.scheduledTimes.length === 0) {
      formNotifications.requiredField("frequency pattern");
      return;
    }

    setLoading(true);
    try {
      const addedMedi = await axiosSecure.post("/api/medicine", {
        userEmail: user?.email,
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        scheduledTimes: form.scheduledTimes,
        durationDays: Number(form.durationDays),
        originalDurationDays: Number(form.originalDurationDays),
        instructions: form.instructions,
        totalPills: Number(form.totalPills),
        originalTotalPills: Number(form.originalTotalPills),
        pillsPerDose: Number(form.pillsPerDose),
        dosesPerDay: Number(form.dosesPerDay),
      });
      if (addedMedi.statusText === "Created") {
        medicineNotifications.added(form.name);
      }
      navigate("/medication");
      setForm({
        name: "",
        dosage: "",
        frequency: "",
        startDate: new Date().toISOString().split("T")[0],
        scheduledTimes: [],
        durationDays: "",
        originalDurationDays: "",
        instructions: "",
        totalPills: "",
        originalTotalPills: "",
        pillsPerDose: "",
        dosesPerDay: "",
      });
    } catch (err: any) {
      formNotifications.requiredField(err.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold text-primary text-center mb-2">
        Add Medicine
      </h2>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Medicine Name<span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter medicine name"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="dosage" className="text-sm font-medium text-gray-700">
          Dosage
        </label>
        <input
          id="dosage"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          placeholder="e.g. 500mg"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Frequency Pattern (Key Field) <span className="text-red-500">*</span>
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Scheduled Times (Auto-set based on frequency pattern)
        </label>
        {form.scheduledTimes.length > 0 ? (
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">
              ✅ Scheduled times:
            </p>
            <div className="space-y-1">
              {form.scheduledTimes.map((time, index) => (
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
      </div>

      <div className="space-y-2">
        <label
          htmlFor="startDate"
          className="text-sm font-medium text-gray-700"
        >
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          id="startDate"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          type="date"
          className="input input-bordered w-full text-black bg-gray-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hover:scale-110 [&::-webkit-calendar-picker-indicator]:transition-transform"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="originalDurationDays"
          className="text-sm font-medium text-gray-700"
        >
          Total Treatment Duration (days)<span className="text-red-500">*</span>
        </label>
        <input
          id="originalDurationDays"
          name="originalDurationDays"
          value={form.originalDurationDays}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How long will you take this medicine for in total?"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="durationDays"
          className="text-sm font-medium text-gray-700"
        >
          Current Supply Duration (days)<span className="text-red-500">*</span>
        </label>
        <input
          id="durationDays"
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          required
          type="number"
          min="1"
          placeholder="How long can you take the medicine you have now?"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <input
        name="originalTotalPills"
        value={form.originalTotalPills}
        onChange={handleChange}
        required
        type="number"
        min="1"
        className="hidden"
      />
      <div className="space-y-2">
        <label
          htmlFor="totalPills"
          className="text-sm font-medium text-gray-700"
        >
          Total Pills in Current Supply<span className="text-red-500">*</span>
        </label>
        <input
          id="totalPills"
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
        <label
          htmlFor="pillsPerDose"
          className="text-sm font-medium text-gray-700"
        >
          Pills Per Dose<span className="text-red-500">*</span>
        </label>
        <input
          id="pillsPerDose"
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
        required
        type="number"
        min="1"
        className="hidden"
      />
      <div className="space-y-2">
        <label
          htmlFor="instructions"
          className="text-sm font-medium text-gray-700"
        >
          Special Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Any special instructions (optional)"
          className="textarea textarea-bordered w-full text-black bg-gray-100"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Medicine"}
      </button>
    </form>
  );
};

export default AddMedicineForm;
