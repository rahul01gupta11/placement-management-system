import Application from "../models/Application.js";

// 🟢 Apply to Company
export const applyToCompany = async (req, res) => {
  try {
    const { roll_no, company_id } = req.body;

    // prevent duplicate
    const existing = await Application.findOne({ roll_no, company_id });

    if (existing) {
      return res.json({ message: "Already applied" });
    }

    const application = await Application.create({
      application_id: Date.now().toString(),
      roll_no,
      company_id,
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get Applications (with relations 🔥)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("roll_no")
      .populate("company_id");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};