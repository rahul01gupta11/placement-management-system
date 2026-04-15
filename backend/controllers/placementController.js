import PlacementStats from "../models/PlacementStats.js";

export const addPlacement = async (req, res) => {
  try {
    const placement = await PlacementStats.create(req.body);
    res.json(placement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlacements = async (req, res) => {
  try {
    const placements = await PlacementStats.find().sort({ ctc: -1, _id: -1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
