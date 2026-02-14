import { NextResponse } from "next/server";
import { db } from "@/app/db"; // your drizzle instance
import { tasks } from "@/app/db/schema";

export async function GET() {
  const allTasks = await db.select().from(tasks);
  return NextResponse.json(allTasks);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newTask = await db.insert(tasks).values({
    title: body.title,
    description: body.description,
    dueAt: body.dueAt ? new Date(body.dueAt) : null,
    completed: body.completed ?? false,
  }).returning();

  return NextResponse.json(newTask[0]);
}
