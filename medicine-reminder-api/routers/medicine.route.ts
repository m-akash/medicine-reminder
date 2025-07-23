import express from "express";
import {
  createMedicine,
  deleteMedicine,
  getMedicineByEmail,
  getMedicineById,
  updateMedicine,
} from "../controllers/medicine.controller";
const router = express.Router();

router.get("/medicine/user/:userEmail", getMedicineByEmail);
router.get("/medicine/:id", getMedicineById);
router.post("/medicine", createMedicine);
router.put("/medicine/:id", updateMedicine);
router.delete("/medicine/:id", deleteMedicine);

export default router;
