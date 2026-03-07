import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/db";
import { task as taskTable } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const tasks = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.userId, session.user.id));

  return NextResponse.json(tasks);
}


export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, dueAt } = await request.json();
  
  const task = await db.insert(taskTable).values({
    id: crypto.randomUUID(),
    title,
    description,
    dueAt: dueAt ? new Date(dueAt) : null,
    userId: session.user.id,
  });

  return NextResponse.json(task);
}