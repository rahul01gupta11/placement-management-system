import mongoose from "mongoose";

const placementStatsSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true,
    unique: true
  },
  name: [String],
  company: String,
  loc: String,
  role: String,
  ctc: Number
});

const PlacementStats =
  mongoose.models.PlacementStats ||
  mongoose.model("PlacementStats", placementStatsSchema);

export default PlacementStats;