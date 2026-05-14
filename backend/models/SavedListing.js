import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  },
  { timestamps: true }
);

savedSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.model("SavedListing", savedSchema);
