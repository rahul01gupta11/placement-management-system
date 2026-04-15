import Application from "../models/Application.js";

export const applyToCompany = async (req, res) => {
  try {
    const { roll_no, company_id } = req.body;

    const existing = await Application.findOne({ roll_no, company_id });

    if (existing) {
      return res.json({ message: "Already applied" });
    }

    const application = await Application.create({
      roll_no,
      company_id,
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ _id: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
