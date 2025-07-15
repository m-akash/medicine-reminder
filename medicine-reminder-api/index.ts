import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port: number | string = process.env["PORT"] || 3001;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
