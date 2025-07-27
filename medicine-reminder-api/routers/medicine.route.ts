import express from "express";
import {
  createMedicine,
  deleteMedicine,
  getMedicineByEmail,
  getMedicineById,
  updateMedicine,
  getMedicineTakenDay,
  setMedicineTakenDay,
  getRefillReminders,
  refillMedicine,
  getMedicineTakenHistory,
  createReminder,
  createRemindersForExistingMedicines,
} from "../controllers/medicine.controller";
const router = express.Router();

router.get("/medicine/user/:userEmail", getMedicineByEmail);
router.get("/medicine/:id", getMedicineById);
router.post("/medicine", createMedicine);
router.put("/medicine/:id", updateMedicine);
router.delete("/medicine/:id", deleteMedicine);
router.patch("/medicine/:id/refill", refillMedicine);
router.get("/medicine/:id/taken", getMedicineTakenDay);
router.put("/medicine/:id/taken", setMedicineTakenDay);
router.get("/medicine/:id/taken-history", getMedicineTakenHistory);
router.get("/refill-reminders", getRefillReminders);
router.post("/reminder", createReminder);
router.post(
  "/create-reminders-for-existing",
  createRemindersForExistingMedicines
);

export default router;
