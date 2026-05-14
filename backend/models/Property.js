import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    priceShort: { type: String, default: "" },
    type: { type: String, required: true },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    area: { type: String, default: "" },
    tag: { type: String, default: "Featured" },
    img: { type: String, required: true },
    agent: { type: String, default: "" },
    agentImg: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
