import { Router } from "express";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/agents", async (req, res) => {
  /* demo agents as users optional — return empty or seed users; frontend uses static agents */
  const users = await User.find({}).select("name email avatar").limit(20);
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const u = await User.findById(req.params.id).select("name email avatar");
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json(u);
});

router.patch("/me", authRequired, async (req, res) => {
  const { name, avatar } = req.body;
  const u = await User.findById(req.userId);
  if (!u) return res.status(404).json({ error: "Not found" });
  if (name) u.name = name;
  if (avatar) u.avatar = avatar;
  await u.save();
  res.json({ id: u._id, name: u.name, email: u.email, avatar: u.avatar });
});

export default router;
