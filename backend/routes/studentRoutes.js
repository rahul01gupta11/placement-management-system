import express from "express";
import { createStudent, getStudents } from "../controllers/studentController.js";

const router = express.Router();

// POST /api/students
router.post("/", createStudent);

// GET /api/students
router.get("/", getStudents);

export default router;