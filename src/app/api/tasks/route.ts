import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/db";
import { task as taskTable, category as categoryTable } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq, and, gte, lt } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  let tasks;

  if (dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    tasks = await db
      .select({
        id: taskTable.id,
        title: taskTable.title,
        description: taskTable.description,
        dueAt: taskTable.dueAt,
        completed: taskTable.completed,
        categoryId: taskTable.categoryId,
        categoryName: categoryTable.name,
      })
      .from(taskTable)
      .leftJoin(categoryTable, eq(taskTable.categoryId, categoryTable.id))
      .where(
        and(
          eq(taskTable.userId, session.user.id),
          gte(taskTable.dueAt, startOfDay),
          lt(taskTable.dueAt, new Date(endOfDay.getTime() + 1))
        )
      )
      .orderBy(taskTable.categoryId);
  } else {
    tasks = await db
      .select({
        id: taskTable.id,
        title: taskTable.title,
        description: taskTable.description,
        dueAt: taskTable.dueAt,
        completed: taskTable.completed,
        categoryId: taskTable.categoryId,
        categoryName: categoryTable.name,
      })
      .from(taskTable)
      .leftJoin(categoryTable, eq(taskTable.categoryId, categoryTable.id))
      .where(eq(taskTable.userId, session.user.id));
  }

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, dueAt, categoryId } = await request.json();

  const [task] = await db
    .insert(taskTable)
    .values({
      id: crypto.randomUUID(),
      title,
      description,
      dueAt: dueAt ? new Date(dueAt) : null,
      categoryId: categoryId || null,
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json(task);
}
