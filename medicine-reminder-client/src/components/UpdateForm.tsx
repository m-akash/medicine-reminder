import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import { data, useLoaderData, useNavigate } from "react-router-dom";
import { medicineNotifications, formNotifications } from "../utils/notifications.ts";

const UpdateForm = () => {
  const loaderData = useLoaderData();
  const med = loaderData?.findMedi || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Extract scheduled times from existing reminders
  const existingTimes = med?.reminders?.[0]?.times?.map((t: any) => 
    new Date(t.time).toTimeString().slice(0, 5)
  ) || [];

  const [form, setForm] = useState({
    userEmail: med?.userEmail || "",
    name: med?.name || "",
    dosage: med?.dosage || "",
    frequency: med?.frequency || "",
    startDate: med?.startDate ? med.startDate.slice(0, 10) : "",
    scheduledTimes: existingTimes,
    durationDays: med?.durationDays?.toString() || "",
    originalDurationDays: med?.originalDurationDays?.toString() || "",
    instructions: med?.instructions || "",
    totalPills: med?.totalPills?.toString() || "",
    originalTotalPills: med?.originalTotalPills?.toString() || "",
    pillsPerDose: med?.pillsPerDose?.toString() || "",
    dosesPerDay: med?.dosesPerDay?.toString() || "",
  });

  // Default times for different periods
  const defaultTimes = {
    morning: "08:00",
    afternoon: "14:00", 
    evening: "20:00"
  };

  // Parse frequency pattern and set times accordingly
  const parseFrequencyAndSetTimes = (frequency: string) => {
    const pattern = frequency.split('-').map(Number);
    const times = [];
    
    if (pattern[0] === 1) times.push(defaultTimes.morning); // Morning
    if (pattern[1] === 1) times.push(defaultTimes.afternoon); // Afternoon  
    if (pattern[2] === 1) times.push(defaultTimes.evening); // Evening
    
    return times;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Auto-set scheduled times when frequency changes
    if (name === 'frequency') {
      const times = parseFrequencyAndSetTimes(value);
      setForm(prev => ({
        ...prev,
        [name]: value,
        scheduledTimes: times,
        dosesPerDay: times.length.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!med.id) {
      formNotifications.requiredField("Medicine ID");
      return;
    }

    // Validate and sanitize fields
    const payload: any = {
      ...form,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
      originalDurationDays: form.originalDurationDays ? Number(form.originalDurationDays) : undefined,
      totalPills: form.totalPills ? Number(form.totalPills) : undefined,
      originalTotalPills: form.originalTotalPills ? Number(form.originalTotalPills) : undefined,
      pillsPerDose: form.pillsPerDose ? Number(form.pillsPerDose) : undefined,
      dosesPerDay: form.dosesPerDay ? Number(form.dosesPerDay) : undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      scheduledTimes: form.scheduledTimes,
    };

    // Remove undefined fields
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

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
      formNotifications.requiredField("Update failed. Please check your input and try again.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8  shadow-lg flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
        Update Medicine
      </h2>
      <input type="hidden" name="userEmail" value={form.userEmail} />
      <div className="form-control">
        <label className="label font-semibold text-black">
          Medicine Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          placeholder="Enter medicine name"
          required
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Dosage</label>
        <input
          type="text"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          placeholder="e.g. 10mg, 500mg, etc."
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Frequency Pattern (Key Field)</label>
        <input
          type="text"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black border-2 border-blue-300"
          placeholder="e.g. 1-0-1 (Morning-Evening)"
        />
        <p className="text-xs text-gray-500 mt-1">Format: Morning-Afternoon-Evening (1 = take, 0 = skip)</p>
      </div>
      
      {/* Scheduled Times Display */}
      <div className="form-control">
        <label className="label font-semibold text-black">Scheduled Times (Auto-set based on frequency pattern)</label>
        {form.scheduledTimes.length > 0 ? (
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">✅ Scheduled times:</p>
            <div className="space-y-1">
              {form.scheduledTimes.map((time: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-green-700">
                    {index + 1}. {time === "08:00" ? "8:00 AM (Morning)" : 
                                 time === "14:00" ? "2:00 PM (Afternoon)" : 
                                 time === "20:00" ? "8:00 PM (Evening)" : time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 Set frequency pattern above to automatically schedule times
            </p>
          </div>
        )}
      </div>
      
      <div className="form-control">
        <label className="label font-semibold text-black">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">
          Duration (days)
        </label>
        <input
          type="number"
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          min="1"
          placeholder="e.g. 30"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">
          Original Duration (days)
        </label>
        <input
          type="number"
          name="originalDurationDays"
          value={form.originalDurationDays}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          min="1"
          placeholder="e.g. 30"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Total Pills</label>
        <input
          type="number"
          name="totalPills"
          value={form.totalPills}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          min="1"
          placeholder="e.g. 60"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">
          Original Total Pills
        </label>
        <input
          type="number"
          name="originalTotalPills"
          value={form.originalTotalPills}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          min="1"
          placeholder="e.g. 60"
        />
      </div>
      <input
        name="pillsPerDose"
        value={form.pillsPerDose}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Pills Per Dose"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="dosesPerDay"
        value={form.dosesPerDay}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Doses Per Day"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      
      {/* Help Section */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
        <p><strong>💡 Frequency Pattern Examples:</strong></p>
        <ul className="list-disc list-inside mt-1">
          <li><strong>1-0-0:</strong> 8:00 AM (Morning only)</li>
          <li><strong>0-1-0:</strong> 2:00 PM (Afternoon only)</li>
          <li><strong>0-0-1:</strong> 8:00 PM (Evening only)</li>
          <li><strong>1-0-1:</strong> 8:00 AM + 8:00 PM (Morning + Evening)</li>
          <li><strong>1-1-1:</strong> 8:00 AM + 2:00 PM + 8:00 PM (All three times)</li>
        </ul>
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Instructions</label>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          className="textarea textarea-bordered w-full bg-gray-100 text-black"
          placeholder="Any special instructions (optional)"
          rows={3}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4">
        Update
      </button>
    </form>
  );
};

export default UpdateForm;
