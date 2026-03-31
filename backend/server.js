import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// routes
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import selectionStageRoutes from "./routes/selectionStageRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// DB
connectDB();

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stages", selectionStageRoutes);
app.use("/api/placements", placementRoutes);

// test
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});