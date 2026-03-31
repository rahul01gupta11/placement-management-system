import express from "express";
import { applyToCompany, getApplications } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply", applyToCompany);
router.get("/", getApplications);

export default router;