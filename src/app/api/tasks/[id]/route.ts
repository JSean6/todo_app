import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/db";
import { task as taskTable } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const { title, description, completed, dueAt, categoryId } =
    await request.json();

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (completed !== undefined) updates.completed = completed;
  if (dueAt !== undefined) updates.dueAt = dueAt ? new Date(dueAt) : null;
  if (categoryId !== undefined) updates.categoryId = categoryId || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(taskTable)
    .set(updates)
    .where(
      and(
        eq(taskTable.id, id),
        eq(taskTable.userId, session.user.id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await db
    .delete(taskTable)
    .where(
      and(
        eq(taskTable.id, id),
        eq(taskTable.userId, session.user.id)
      )
    )
    .returning();

  if (result.length === 0) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}

