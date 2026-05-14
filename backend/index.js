import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./db.js";
import { seedPropertiesIfEmpty, seedSupportUser } from "./seed.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import offerRoutes from "./routes/offers.js";
import messageRoutes from "./routes/messages.js";
import savesRoutes from "./routes/saves.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-zexan-change-me";
  console.warn("JWT_SECRET missing — using insecure dev default. Set JWT_SECRET in .env for production.");
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "zexan-api" });
});

app.get("/api/public/support", (req, res) => {
  const id = req.app.locals.supportUserId;
  if (!id) return res.status(503).json({ error: "Not ready" });
  res.json({ userId: id, label: "Zexan Concierge" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/saves", savesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zexan_realestate";

connectDb(mongoUri)
  .then(async () => {
    await seedPropertiesIfEmpty();
    app.locals.supportUserId = await seedSupportUser();
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.error("Start MongoDB or set MONGODB_URI. Server will not start.");
    process.exit(1);
  });
