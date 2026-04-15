import Student from "../models/Student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
