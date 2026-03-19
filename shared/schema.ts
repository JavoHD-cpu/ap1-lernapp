import { pgTable, text, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull(),
  questionId: text("question_id").notNull(),
  correct: boolean("correct").notNull(),
  attempts: integer("attempts").notNull().default(0),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
