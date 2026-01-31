import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import taskRoutes from "./routes/task.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.get("/", (req, res) => {
  res.send("task API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
