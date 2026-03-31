import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  password: String
});

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;