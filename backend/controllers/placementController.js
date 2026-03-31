import PlacementStats from "../models/PlacementStats.js";

// ➕ Add Final Placement
export const addPlacement = async (req, res) => {
  try {
    const placement = await PlacementStats.create(req.body);
    res.json(placement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get Placements
export const getPlacements = async (req, res) => {
  try {
    const placements = await PlacementStats.find().populate("roll_no");
    res.json(placements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};