import AddMedicineForm from "../../components/AddMedicineForm.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";

const AddMedicine = () => {
  return (
    <>
      <BaseHelmet
        title="Add Medicine - Medicine Reminder"
        description="Add new medications to your health routine. Set dosages, schedules, and reminders to ensure you never miss your medication."
      />
      <div className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg min-h-screen ">
        <AddMedicineForm />
      </div>
    </>
  );
};

export default AddMedicine;
