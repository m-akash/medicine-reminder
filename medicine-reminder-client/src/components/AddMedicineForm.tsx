import useAxiosSecure from "../hooks/useAxiosSecure.tsx";

const AddMedicineForm = () => {
  const axiosSecure = useAxiosSecure();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const userEmail = "akash@gmail.com";
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const dosage = (form.elements.namedItem("dosage") as HTMLInputElement).value;
    const frequency = (form.elements.namedItem("frequency") as HTMLInputElement).value;
    const startDate = (form.elements.namedItem("startDate") as HTMLInputElement).value;
    const durationDays = (form.elements.namedItem("durationDays") as HTMLInputElement).value;
    const instructions = (form.elements.namedItem("instructions") as HTMLTextAreaElement).value;

    const mediItem = {
      userEmail: userEmail,
      name: name,
      dosage: dosage,
      frequency: frequency,
      startDate: startDate,
      durationDays: Number(durationDays),
      instructions: instructions,
    };
    const result = await axiosSecure.post("/api/medicine", mediItem);
    if (result.statusText === "Created") {
      alert("Medicine Created successfully!");
      form.reset();
    }
    console.log(result);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8  shadow-lg flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
        Add Medicine
      </h2>
      <input type="hidden" name="userEmail" />
      <div className="form-control">
        <label className="label font-semibold text-black">
          Medicine Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
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
          className="input input-bordered w-full bg-gray-100 text-black"
          placeholder="e.g. 10mg, 500mg, etc."
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Frequency</label>
        <input
          type="text"
          name="frequency"
          className="input input-bordered w-full bg-gray-100 text-black"
          placeholder="e.g. 1-0-0, 1-0-1, 1-1-1"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Start Date</label>
        <input
          type="date"
          name="startDate"
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
          className="input input-bordered w-full bg-gray-100 text-black"
          min="1"
          placeholder="e.g. 30"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-black">Instructions</label>
        <textarea
          name="instructions"
          className="textarea textarea-bordered w-full bg-gray-100 text-black"
          placeholder="Any special instructions (optional)"
          rows={3}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4">
        Add
      </button>
    </form>
  );
};

export default AddMedicineForm;
