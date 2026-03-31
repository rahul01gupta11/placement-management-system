import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: [String], // multivalued attribute
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  }
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;