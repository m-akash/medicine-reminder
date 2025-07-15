import express from "express";
import {
  createMedicine,
  deleteMedicine,
  getMedicineByEmail,
  updateMedicine,
} from "../controllers/medicine.controller";
const router = express.Router();

router.get("/medicine/:userEmail", getMedicineByEmail);
router.post("/medicine", createMedicine);
router.put("/medicine/:id", updateMedicine);
router.delete("/medicine/:id", deleteMedicine);

export default router;
