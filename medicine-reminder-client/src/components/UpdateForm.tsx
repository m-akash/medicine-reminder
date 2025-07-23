import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure.tsx";
import { data, useLoaderData, useNavigate } from "react-router-dom";

const UpdateForm = () => {
  const loaderData = useLoaderData();
  const med = loaderData?.findMedi || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userEmail: med?.userEmail || "",
    name: med?.name || "",
    dosage: med?.dosage || "",
    frequency: med?.frequency || "",
    startDate: med?.startDate ? med.startDate.slice(0, 10) : "",
    durationDays: med?.durationDays?.toString() || "",
    originalDurationDays: med?.originalDurationDays?.toString() || "",
    instructions: med?.instructions || "",
    totalPills: med?.totalPills?.toString() || "",
    originalTotalPills: med?.originalTotalPills?.toString() || "",
    pillsPerDose: med?.pillsPerDose?.toString() || "",
    dosesPerDay: med?.dosesPerDay?.toString() || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!med.id) {
      alert("Medicine ID is missing.");
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
        alert(`${med.name} updated successfully!`);
      }
      navigate("/medication");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Please check your input and try again.");
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
        <label className="label font-semibold text-black">Frequency</label>
        <input
          type="text"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-100 text-black"
          placeholder="e.g. Once daily, Twice daily, etc."
        />
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
