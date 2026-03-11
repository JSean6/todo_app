import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/db";
import { category as categoryTable } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function PATCH(
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
  const { name } = await _request.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(categoryTable)
    .set({ name: name.trim() })
    .where(
      and(
        eq(categoryTable.id, id),
        eq(categoryTable.userId, session.user.id)
      )
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Category not found" },
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

  await db
    .delete(categoryTable)
    .where(
      and(
        eq(categoryTable.id, id),
        eq(categoryTable.userId, session.user.id)
      )
    );

  return NextResponse.json({ message: "Category deleted successfully" });
}
