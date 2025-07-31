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
  getReminderStatus,
  toggleReminderStatus,
} from "../controllers/medicine.controller";
import verifyToken from "../middlewares/jwtMiddleware";
const router = express.Router();

router.get("/medicine/user/:userEmail", verifyToken, getMedicineByEmail);
router.post("/medicine", verifyToken, createMedicine);
router.put("/medicine/:id", verifyToken, updateMedicine);
router.delete("/medicine/:id", verifyToken, deleteMedicine);
router.get("/medicine/:id", verifyToken, getMedicineById);
router.get("/medicine/:id/taken", getMedicineTakenDay);
router.put("/medicine/:id/taken", setMedicineTakenDay);
router.get("/medicine/:id/history", getMedicineTakenHistory);
router.get("/refill-reminders", getRefillReminders);
router.put("/medicine/:id/refill", refillMedicine);
router.post("/reminder", createReminder);
router.get("/medicine/:id/reminder", getReminderStatus);
router.put("/medicine/:id/reminder", toggleReminderStatus);
router.post(
  "/create-reminders-for-existing",
  createRemindersForExistingMedicines
);

export default router;
