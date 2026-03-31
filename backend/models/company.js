import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ctc_stipend: {
    type: Number,
    required: true
  }
});

const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;