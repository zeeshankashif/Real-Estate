import { Router } from "express";
import SavedListing from "../models/SavedListing.js";
import Property from "../models/Property.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, async (req, res) => {
  const saves = await SavedListing.find({ user: req.userId }).populate("property");
  res.json(saves.map((s) => s.property).filter(Boolean));
});

router.post("/:propertyId", authRequired, async (req, res) => {
  const prop = await Property.findById(req.params.propertyId);
  if (!prop) return res.status(404).json({ error: "Not found" });
  try {
    await SavedListing.create({ user: req.userId, property: req.params.propertyId });
  } catch {
    /* duplicate */
  }
  res.json({ saved: true });
});

router.delete("/:propertyId", authRequired, async (req, res) => {
  await SavedListing.deleteOne({ user: req.userId, property: req.params.propertyId });
  res.json({ saved: false });
});

router.get("/check/:propertyId", authRequired, async (req, res) => {
  const s = await SavedListing.findOne({ user: req.userId, property: req.params.propertyId });
  res.json({ saved: !!s });
});

export default router;
