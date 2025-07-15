import express, { Request, Response } from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import userRouter from "./routers/user.route";
app.use("/api", userRouter);

import prescriptionRouter from "./routers/prescription.route";
app.use("/api", prescriptionRouter);

import medicineRouter from "./routers/medicine.route";
app.use("/api", medicineRouter);

app.get("/", async (_: Request, res: Response) => {
  res.send("Hello");
});

export default app;
