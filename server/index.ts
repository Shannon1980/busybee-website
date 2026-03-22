import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";
import { waitlistSignups, insertWaitlistSchema } from "./schema.js";
import { eq, count } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: isProd ? "https://busybee.app" : true }));

const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again later." },
});

// Waitlist signup
app.post("/api/waitlist", waitlistLimiter, async (req, res) => {
  try {
    const parsed = insertWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const { email, source } = parsed.data;

    // Check for duplicate
    const existing = await db
      .select()
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, email))
      .limit(1);

    if (existing.length > 0) {
      return res.status(200).json({ message: "already_registered" });
    }

    await db.insert(waitlistSignups).values({ email, source });
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Waitlist count (public, no auth needed for social proof)
app.get("/api/waitlist/count", async (_req, res) => {
  try {
    const result = await db.select({ value: count() }).from(waitlistSignups);
    return res.json({ count: result[0].value });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch count." });
  }
});

// Serve static frontend in production
if (isProd) {
  const distPath = path.join(__dirname, "../../dist/client");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Busy Bee landing server running on port ${PORT}`);
});
