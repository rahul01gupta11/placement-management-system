import express from "express";
import {
  deleteAdminApplication,
  deleteAdminCompany,
  deleteAdminStudent,
  getAdminApplicationStats,
  getAdminApplications,
  getAdminCompanies,
  getAdminCompanyById,
  getAdminStats,
  getAdminStudentById,
  getAdminStudents,
  loginAdmin,
} from "../controllers/adminController.js";
import verifyAdminToken from "../middleware/verifyAdminToken.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.use(verifyAdminToken);

router.get("/companies", getAdminCompanies);
router.get("/companies/:id", getAdminCompanyById);
router.delete("/companies/:id", deleteAdminCompany);

router.get("/students", getAdminStudents);
router.get("/students/:id", getAdminStudentById);
router.delete("/students/:id", deleteAdminStudent);

router.get("/applications/stats", getAdminApplicationStats);
router.get("/applications", getAdminApplications);
router.delete("/applications/:id", deleteAdminApplication);

router.get("/stats", getAdminStats);

export default router;
