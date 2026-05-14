import { Router } from "express";
import Property from "../models/Property.js";
import { authRequired, attachUser } from "../middleware/auth.js";

const router = Router();

router.get("/", attachUser, async (req, res) => {
  try {
    const { q, type, city } = req.query;
    const parts = [];
    if (type && type !== "All") parts.push({ type });
    if (city && city !== "All Cities") parts.push({ location: new RegExp(city, "i") });
    if (q && String(q).trim()) {
      const rx = new RegExp(String(q).trim(), "i");
      parts.push({ $or: [{ title: rx }, { location: rx }, { type: rx }] });
    }
    const filter = parts.length ? { $and: parts } : {};
    const list = await Property.find(filter).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).populate("owner", "name email avatar");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const body = { ...req.body, owner: req.userId };
    const p = await Property.create(body);
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", authRequired, async (req, res) => {
  try {
    const p = await Property.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    if (p.owner && p.owner.toString() !== req.userId) return res.status(403).json({ error: "Forbidden" });
    Object.assign(p, req.body);
    p.owner = p.owner || req.userId;
    await p.save();
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const p = await Property.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    if (!p.owner || p.owner.toString() !== req.userId) return res.status(403).json({ error: "Forbidden" });
    await p.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
