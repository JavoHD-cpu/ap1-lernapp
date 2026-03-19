import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema } from "../shared/schema";

export function registerRoutes(httpServer: Server, app: Express) {
  app.get("/api/progress", async (_req, res) => {
    const all = await storage.getAllProgress();
    res.json(all);
  });

  app.post("/api/progress", async (req, res) => {
    const parsed = insertUserProgressSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const record = await storage.saveProgress(parsed.data);
    res.json(record);
  });

  app.delete("/api/progress", async (_req, res) => {
    await storage.clearProgress();
    res.json({ ok: true });
  });
}
