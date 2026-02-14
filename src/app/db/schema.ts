import {pgTable, text, timestamp, uuid, boolean} from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id:uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    title: text("title").notNull(),
    description: text("description"),
    dueAt: timestamp("due_at"),
    completed: boolean("completed").default(false),
});

