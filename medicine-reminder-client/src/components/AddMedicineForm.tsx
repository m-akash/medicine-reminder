import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import useAuth from "../hooks/useAuth.tsx";

const AddMedicineForm: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    durationDays: "",
    originalDurationDays: "",
    instructions: "",
    totalPills: "",
    originalTotalPills: "",
    pillsPerDose: "",
    dosesPerDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axiosSecure.post("/api/medicine", {
        userEmail: user?.email,
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        durationDays: Number(form.durationDays),
        originalDurationDays: Number(form.originalDurationDays),
        instructions: form.instructions,
        totalPills: Number(form.totalPills),
        originalTotalPills: Number(form.originalTotalPills),
        pillsPerDose: Number(form.pillsPerDose),
        dosesPerDay: Number(form.dosesPerDay),
      });
      setSuccess("Medicine added successfully!");
      setForm({
        name: "",
        dosage: "",
        frequency: "",
        startDate: "",
        durationDays: "",
        originalDurationDays: "",
        instructions: "",
        totalPills: "",
        originalTotalPills: "",
        pillsPerDose: "",
        dosesPerDay: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold text-primary text-center mb-2">
        Add Medicine
      </h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Medicine Name"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="dosage"
        value={form.dosage}
        onChange={handleChange}
        placeholder="Dosage (e.g. 500mg)"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        placeholder="Frequency (e.g. 1-0-1)"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        required
        type="date"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="durationDays"
        value={form.durationDays}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Duration (days)"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="originalDurationDays"
        value={form.originalDurationDays}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Original Duration (days)"
        className="input input-bordered w-full text-black bg-gray-100"
      />

      <input
        name="totalPills"
        value={form.totalPills}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Total Pills"
        className="input input-bordered w-full text-black bg-gray-100"
      />
      <input
        name="originalTotalPills"
        value={form.originalTotalPills}
        onChange={handleChange}
        required
        type="number"
        min="1"
        placeholder="Original Total Pills"
        className="input input-bordered w-full text-black bg-gray-100"
      />
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
      <textarea
        name="instructions"
        value={form.instructions}
        onChange={handleChange}
        placeholder="Instructions"
        className="textarea textarea-bordered w-full text-black bg-gray-100"
      />
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Medicine"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
};

export default AddMedicineForm;
