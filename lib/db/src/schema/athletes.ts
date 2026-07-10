import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { schedulesTable } from "./schedules";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const athletesTable = pgTable("athletes", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").notNull().references(() => schedulesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  studentId: text("student_id").notNull().default(""),
  grade: text("grade").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAthleteSchema = createInsertSchema(athletesTable).omit({ id: true, createdAt: true });
export type InsertAthlete = z.infer<typeof insertAthleteSchema>;
export type Athlete = typeof athletesTable.$inferSelect;
