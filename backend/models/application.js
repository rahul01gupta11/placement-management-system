import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true
  },
  company_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected"],
    default: "Applied"
  }
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;