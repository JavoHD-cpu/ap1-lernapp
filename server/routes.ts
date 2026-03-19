import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema } from "../shared/schema";
import fs from "fs";
import path from "path";

// ── Persistent JSON helpers ──────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return [] as unknown as T;
  }
}

function writeJson(filename: string, data: unknown): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

// ── Types ────────────────────────────────────────────────────────────────────
interface WikiArticle {
  id: string;
  title: string;
  category: string;
  type: "article" | "cheatsheet" | "howto";
  tags: string[];
  content: string; // Markdown string
}

interface CustomQuestion {
  id: string;
  type: "multiple-choice" | "open" | "calculation";
  topic: string;
  difficulty: "leicht" | "mittel" | "schwer";
  points: number;
  question: string;
  answers?: Array<{ text: string; correct: boolean }>;
  modelAnswer?: string;
  keyPoints?: string[];
  createdAt: string;
}

export function registerRoutes(httpServer: Server, app: Express) {

  // ── Progress API ─────────────────────────────────────────────────────────
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

  // ── Wiki API ─────────────────────────────────────────────────────────────
  app.get("/api/wiki", (_req, res) => {
    const articles = readJson<WikiArticle[]>("wiki.json");
    res.json(articles);
  });

  app.post("/api/wiki", (req, res) => {
    const articles = readJson<WikiArticle[]>("wiki.json");
    const body = req.body as Partial<WikiArticle>;

    if (!body.title || !body.category || !body.type) {
      return res.status(400).json({ error: "title, category und type sind Pflichtfelder" });
    }

    const newArticle: WikiArticle = {
      id: body.id || `article-${Date.now()}`,
      title: body.title,
      category: body.category,
      type: body.type,
      tags: body.tags ?? [],
      content: body.content ?? "",
    };

    // Prevent duplicate IDs
    if (articles.find(a => a.id === newArticle.id)) {
      newArticle.id = `${newArticle.id}-${Date.now()}`;
    }

    articles.push(newArticle);
    writeJson("wiki.json", articles);
    res.status(201).json(newArticle);
  });

  app.put("/api/wiki/:id", (req, res) => {
    const articles = readJson<WikiArticle[]>("wiki.json");
    const idx = articles.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Artikel nicht gefunden" });

    const body = req.body as Partial<WikiArticle>;
    articles[idx] = {
      ...articles[idx],
      title: body.title ?? articles[idx].title,
      category: body.category ?? articles[idx].category,
      type: body.type ?? articles[idx].type,
      tags: body.tags ?? articles[idx].tags,
      content: body.content ?? articles[idx].content,
    };
    writeJson("wiki.json", articles);
    res.json(articles[idx]);
  });

  app.delete("/api/wiki/:id", (req, res) => {
    const articles = readJson<WikiArticle[]>("wiki.json");
    const filtered = articles.filter(a => a.id !== req.params.id);
    if (filtered.length === articles.length) {
      return res.status(404).json({ error: "Artikel nicht gefunden" });
    }
    writeJson("wiki.json", filtered);
    res.json({ ok: true });
  });

  // ── Questions API ────────────────────────────────────────────────────────
  app.get("/api/questions", (_req, res) => {
    const questions = readJson<CustomQuestion[]>("questions.json");
    res.json(questions);
  });

  app.post("/api/questions", (req, res) => {
    const questions = readJson<CustomQuestion[]>("questions.json");
    const body = req.body as Partial<CustomQuestion>;

    if (!body.type || !body.topic || !body.question) {
      return res.status(400).json({ error: "type, topic und question sind Pflichtfelder" });
    }

    const newQuestion: CustomQuestion = {
      id: `q-${Date.now()}`,
      type: body.type as CustomQuestion["type"],
      topic: body.topic,
      difficulty: body.difficulty ?? "mittel",
      points: body.points ?? 10,
      question: body.question,
      answers: body.answers,
      modelAnswer: body.modelAnswer,
      keyPoints: body.keyPoints,
      createdAt: new Date().toISOString(),
    };

    questions.push(newQuestion);
    writeJson("questions.json", questions);
    res.status(201).json(newQuestion);
  });

  app.put("/api/questions/:id", (req, res) => {
    const questions = readJson<CustomQuestion[]>("questions.json");
    const idx = questions.findIndex(q => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Frage nicht gefunden" });

    const body = req.body as Partial<CustomQuestion>;
    questions[idx] = { ...questions[idx], ...body, id: questions[idx].id, createdAt: questions[idx].createdAt };
    writeJson("questions.json", questions);
    res.json(questions[idx]);
  });

  app.delete("/api/questions/:id", (req, res) => {
    const questions = readJson<CustomQuestion[]>("questions.json");
    const filtered = questions.filter(q => q.id !== req.params.id);
    if (filtered.length === questions.length) {
      return res.status(404).json({ error: "Frage nicht gefunden" });
    }
    writeJson("questions.json", filtered);
    res.json({ ok: true });
  });
}
