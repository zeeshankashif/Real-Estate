import { Router } from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, async (req, res) => {
  try {
    const { toUserId, body, propertyId } = req.body;
    if (!toUserId || !body) return res.status(400).json({ error: "Missing fields" });
    const to = await User.findById(toUserId);
    if (!to) return res.status(404).json({ error: "Recipient not found" });
    const msg = await Message.create({
      fromUser: req.userId,
      toUser: toUserId,
      property: propertyId || null,
      body,
    });
    res.status(201).json(msg);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/inbox", authRequired, async (req, res) => {
  const list = await Message.find({
    $or: [{ fromUser: req.userId }, { toUser: req.userId }],
  })
    .sort({ createdAt: -1 })
    .populate("fromUser", "name avatar")
    .populate("toUser", "name avatar")
    .populate("property", "title img")
    .limit(200);
  res.json(list);
});

router.get("/with/:userId", authRequired, async (req, res) => {
  const other = req.params.userId;
  const list = await Message.find({
    $or: [
      { fromUser: req.userId, toUser: other },
      { fromUser: other, toUser: req.userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("fromUser", "name avatar")
    .populate("property", "title");
  res.json(list);
});

export default router;
