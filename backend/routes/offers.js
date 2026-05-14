import { Router } from "express";
import Offer from "../models/Offer.js";
import Property from "../models/Property.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, async (req, res) => {
  try {
    const { propertyId, amount, message } = req.body;
    const prop = await Property.findById(propertyId);
    if (!prop) return res.status(404).json({ error: "Property not found" });
    const offer = await Offer.create({
      property: propertyId,
      fromUser: req.userId,
      amount,
      message: message || "",
    });
    const populated = await offer.populate("property", "title location");
    res.status(201).json(populated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/mine", authRequired, async (req, res) => {
  const list = await Offer.find({ fromUser: req.userId })
    .populate("property", "title location img price")
    .sort({ createdAt: -1 });
  res.json(list);
});

router.get("/incoming", authRequired, async (req, res) => {
  const props = await Property.find({ owner: req.userId }).select("_id");
  const ids = props.map((p) => p._id);
  const list = await Offer.find({ property: { $in: ids } })
    .populate("property", "title location")
    .populate("fromUser", "name email avatar")
    .sort({ createdAt: -1 });
  res.json(list);
});

router.patch("/:id/status", authRequired, async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected", "pending"].includes(status)) return res.status(400).json({ error: "Bad status" });
  const offer = await Offer.findById(req.params.id).populate({
    path: "property",
    select: "owner title",
  });
  if (!offer) return res.status(404).json({ error: "Not found" });
  const ownerId = offer.property?.owner?.toString();
  if (!ownerId || ownerId !== req.userId) return res.status(403).json({ error: "Only owner can update" });
  offer.status = status;
  await offer.save();
  res.json(offer);
});

export default router;
