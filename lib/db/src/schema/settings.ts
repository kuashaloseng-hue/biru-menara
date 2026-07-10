import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  instagram: text("instagram").notNull().default("@biru_menara"),
  facebook: text("facebook").notNull().default("โรงเรียนอัตตัรกียะห์อิสลามียะห์"),
  address: text("address").notNull().default("โรงเรียนอัตตัรกียะห์อิสลามียะห์ จ.นราธิวาส 96000"),
  phone: text("phone"),
  heroTitle: text("hero_title").notNull().default("BIRU MENARA"),
  heroSlogan: text("hero_slogan").notNull().default("กีฬาสร้างคน สายน้ำสร้างวิถีชีวิต บรรพบุรุษสร้างแนวคิด สีฟ้าพิชิต เชิดชูเมืองนรา"),
  heroSubSlogan: text("hero_sub_slogan").notNull().default("หนึ่งใจ หนึ่งพลัง สายน้ำเดียวกัน เพื่อศักดิ์ศรีฟ้าแห่งนรา"),
  heroImageUrl: text("hero_image_url"),
  logoUrl: text("logo_url"),
  teamRosterImageUrl: text("team_roster_image_url"),
  adminPassword: text("admin_password"),
  navItems: text("nav_items"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
