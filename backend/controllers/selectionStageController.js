import SelectionStage from "../models/SelectionStage.js";

export const addStage = async (req, res) => {
  try {
    const stage = await SelectionStage.create(req.body);
    res.json(stage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStages = async (req, res) => {
  try {
    const stages = await SelectionStage.find().sort({ _id: -1 });
    res.json(stages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
