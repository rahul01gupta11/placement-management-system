import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";
import PlacementStats from "../models/PlacementStats.js";
import SelectionStage from "../models/SelectionStage.js";
import Student from "../models/Student.js";

const JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || "8h";

const normalizeName = (value) =>
  Array.isArray(value) ? value.filter(Boolean).join(" ") : value || "";

const isBcryptHash = (value = "") => /^\$2[aby]\$\d{2}\$/.test(value);

const signAdminToken = (admin) =>
  jwt.sign(
    {
      admin_id: admin.admin_id,
      email: admin.email,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const sanitizeAdmin = (admin) => ({
  _id: admin._id,
  admin_id: admin.admin_id,
  name: admin.name,
  email: admin.email,
});

const ensureDefaultAdmin = async () => {
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    return null;
  }

  let admin = await Admin.findOne({ admin_id: adminId });

  if (admin) {
    if (!isBcryptHash(admin.password)) {
      admin.password = await bcrypt.hash(admin.password || adminPassword, 10);

      if (!admin.name && process.env.ADMIN_NAME) {
        admin.name = process.env.ADMIN_NAME;
      }

      if (!admin.email && process.env.ADMIN_EMAIL) {
        admin.email = process.env.ADMIN_EMAIL;
      }

      await admin.save();
    }

    return admin;
  }

  admin = await Admin.create({
    admin_id: adminId,
    name: process.env.ADMIN_NAME || "Administrator",
    email: process.env.ADMIN_EMAIL || "",
    password: await bcrypt.hash(adminPassword, 10),
  });

  return admin;
};

export const loginAdmin = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET is not configured on the server." });
    }

    await ensureDefaultAdmin();

    const { admin_id, password } = req.body;

    if (!admin_id || !password) {
      return res
        .status(400)
        .json({ message: "admin_id and password are required." });
    }

    const admin = await Admin.findOne({ admin_id: admin_id.trim() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    let passwordMatches = false;

    if (isBcryptHash(admin.password)) {
      passwordMatches = await bcrypt.compare(password, admin.password);
    } else if (admin.password) {
      passwordMatches = password === admin.password;

      if (passwordMatches) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    return res.json({
      token: signAdminToken(admin),
      admin: sanitizeAdmin(admin),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ _id: -1 });
    return res.json(companies);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    return res.json(company);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAdminCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    await Promise.all([
      Company.findByIdAndDelete(req.params.id),
      Application.deleteMany({ company_id: company.company_id }),
      SelectionStage.deleteMany({ company_id: company.company_id }),
      PlacementStats.deleteMany({ company: company.name }),
    ]);

    return res.json({ message: "Company deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: -1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAdminStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    await Promise.all([
      Student.findByIdAndDelete(req.params.id),
      Application.deleteMany({ roll_no: student.roll_no }),
      SelectionStage.deleteMany({ roll_no: student.roll_no }),
      PlacementStats.deleteMany({ roll_no: student.roll_no }),
    ]);

    return res.json({ message: "Student deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    const [applications, students, companies] = await Promise.all([
      Application.find().sort({ _id: -1 }).lean(),
      Student.find().lean(),
      Company.find().lean(),
    ]);

    const studentMap = new Map(students.map((student) => [student.roll_no, student]));
    const companyMap = new Map(companies.map((company) => [company.company_id, company]));

    const enrichedApplications = applications.map((application) => ({
      ...application,
      student: studentMap.get(application.roll_no) || null,
      company: companyMap.get(application.company_id) || null,
    }));

    return res.json(enrichedApplications);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAdminApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    return res.json({ message: "Application deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminApplicationStats = async (req, res) => {
  try {
    const [applications, companies, students] = await Promise.all([
      Application.find().lean(),
      Company.find().lean(),
      Student.find().lean(),
    ]);

    const statusCounts = applications.reduce((accumulator, application) => {
      accumulator[application.status] = (accumulator[application.status] || 0) + 1;
      return accumulator;
    }, {});

    return res.json({
      totalApplications: applications.length,
      uniqueStudents: new Set(applications.map((item) => item.roll_no)).size,
      uniqueCompanies: new Set(applications.map((item) => item.company_id)).size,
      statusCounts,
      availableCompanies: companies.length,
      registeredStudents: students.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [students, placements] = await Promise.all([
      Student.find().lean(),
      PlacementStats.find().lean(),
    ]);

    const totalStudents = students.length;
    const placedStudents = placements.length;
    const unplacedStudents = Math.max(totalStudents - placedStudents, 0);

    const companyWisePlacements = placements.reduce((accumulator, placement) => {
      const companyName = placement.company || "Unknown";
      accumulator[companyName] = (accumulator[companyName] || 0) + 1;
      return accumulator;
    }, {});

    const branchWiseDistribution = students.reduce((accumulator, student) => {
      accumulator[student.branch] = (accumulator[student.branch] || 0) + 1;
      return accumulator;
    }, {});

    const ctcValues = placements
      .map((placement) => placement.ctc)
      .filter((value) => typeof value === "number" && !Number.isNaN(value));

    return res.json({
      totalStudents,
      placedStudents,
      unplacedStudents,
      companyWisePlacements,
      branchWiseDistribution,
      highestPackage: ctcValues.length ? Math.max(...ctcValues) : null,
      averagePackage: ctcValues.length
        ? Number(
            (
              ctcValues.reduce((sum, value) => sum + value, 0) / ctcValues.length
            ).toFixed(2)
          )
        : null,
      placedStudentsList: placements.map((placement) => ({
        roll_no: placement.roll_no,
        name: normalizeName(placement.name),
        company: placement.company,
        location: placement.loc,
        role: placement.role,
        ctc: placement.ctc,
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
