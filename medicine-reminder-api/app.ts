import express, { Request, Response } from "express";
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import userRouter from "./routers/user.route";
app.use("/api", userRouter);

import medicineRouter from "./routers/medicine.route";
app.use("/api", medicineRouter);

app.get("/", async (_: Request, res: Response) => {
  res.send("Hello");
});

export default app;
