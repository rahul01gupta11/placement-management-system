import Company from "../models/Company.js";

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ _id: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
