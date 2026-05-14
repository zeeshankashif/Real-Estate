import { Router } from "express";
import ContactLead from "../models/ContactLead.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const lead = await ContactLead.create(req.body);
    res.status(201).json({ ok: true, id: lead._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
