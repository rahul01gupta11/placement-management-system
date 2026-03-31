import express from "express";
import { addPlacement, getPlacements } from "../controllers/placementController.js";

const router = express.Router();

router.post("/", addPlacement);
router.get("/", getPlacements);

export default router;