import mongoose from "mongoose";

const selectionStageSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true
  },
  company_id: {
    type: String,
    required: true
  },
  stage_name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Cleared", "Failed"],
    required: true
  }
});

const SelectionStage =
  mongoose.models.SelectionStage ||
  mongoose.model("SelectionStage", selectionStageSchema);

export default SelectionStage;