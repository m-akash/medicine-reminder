import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { medicineNotifications } from "../utils/notifications.ts";

const UpdateForm = () => {
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const med = loaderData || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: med?.name || "",
      dosage: med?.dosage || "",
      frequency: med?.frequency || "",
      startDate: med?.startDate
        ? med.startDate.slice(0, 10)
        : new Date().toISOString().split("T")[0],
      durationDays: med?.durationDays?.toString() || "",
      originalDurationDays: med?.originalDurationDays?.toString() || "",
      totalPills: med?.totalPills?.toString() || "",
      pillsPerDose: med?.pillsPerDose?.toString() || "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const updateMedi = await axiosSecure.put(`/api/medicine/${med.id}`, {
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate,
        durationDays: Number(data.durationDays),
        originalDurationDays: Number(data.originalDurationDays),
        totalPills: Number(data.totalPills),
        pillsPerDose: Number(data.pillsPerDose),
      });
      if (updateMedi.statusText === "OK") {
        medicineNotifications.updated(med.name);
      }
      navigate("/");
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg p-6 rounded-xl"
    >
      <h2 className="text-xl font-bold text-primary text-center mb-2">
        Update Medicine
      </h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Medicine Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", { required: true })}
          placeholder="Medicine Name"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Dosage</label>
        <input
          type="text"
          {...register("dosage", { required: true })}
          placeholder="Dosage (e.g. 500mg)"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Frequency Pattern (Key Field)
        </label>
        <input
          type="text"
          {...register("frequency", { required: true })}
          placeholder="e.g. 1-0-1 (Morning-Evening)"
          className="input input-bordered w-full text-black bg-gray-100 border-2 border-blue-300"
        />
        <p className="text-xs text-gray-500">
          Format: Morning-Afternoon-Evening (1 = take, 0 = skip)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Started Date<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("startDate", { required: true })}
          className="input input-bordered w-full text-black bg-gray-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hover:scale-110 [&::-webkit-calendar-picker-indicator]:transition-transform"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Total Duration (days)<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("originalDurationDays", { required: true })}
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
          type="number"
          {...register("durationDays", { required: true })}
          min="1"
          placeholder="How long can you take the medicine you have now? (days)"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Current Total Pills<span className="text-red-500">*</span>
        </label>
        <input
          {...register("totalPills", { required: true })}
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
          {...register("pillsPerDose", { required: true })}
          type="number"
          min="1"
          placeholder="How many pills would you take per dose?"
          className="input input-bordered w-full text-black bg-gray-100"
        />
      </div>

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
