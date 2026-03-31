import express from "express";
import { addStage, getStages } from "../controllers/selectionStageController.js";

const router = express.Router();

router.post("/", addStage);
router.get("/", getStages);

export default router;