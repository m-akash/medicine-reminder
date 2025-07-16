import React, { useState } from "react";

const UpdateForm = () => {
  const [form, setForm] = useState({
    prescriptionId: "",
    userEmail: "",
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    durationDays: "",
    instructions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle form submission (API call or parent callback)
    console.log(form);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8  shadow-lg flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
        Update Medicine
      </h2>
      <input type="hidden" name="prescriptionId" value={form.prescriptionId} />
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
