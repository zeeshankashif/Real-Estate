import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    type: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("ContactLead", contactSchema);
