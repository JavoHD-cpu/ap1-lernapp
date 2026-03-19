import type { UserProgress, InsertUserProgress } from "../shared/schema";

export interface IStorage {
  getAllProgress(): Promise<UserProgress[]>;
  saveProgress(data: InsertUserProgress): Promise<UserProgress>;
  clearProgress(): Promise<void>;
}

class InMemoryStorage implements IStorage {
  private records: UserProgress[] = [];
  private nextId = 1;

  async getAllProgress(): Promise<UserProgress[]> {
    return [...this.records];
  }

  async saveProgress(data: InsertUserProgress): Promise<UserProgress> {
    // Upsert by topicId + questionId
    const existing = this.records.find(
      r => r.topicId === data.topicId && r.questionId === data.questionId
    );
    if (existing) {
      existing.correct = data.correct;
      existing.attempts = (existing.attempts ?? 0) + 1;
      return existing;
    }
    const record: UserProgress = { id: this.nextId++, ...data, attempts: 1 };
    this.records.push(record);
    return record;
  }

  async clearProgress(): Promise<void> {
    this.records = [];
    this.nextId = 1;
  }
}

export const storage = new InMemoryStorage();
