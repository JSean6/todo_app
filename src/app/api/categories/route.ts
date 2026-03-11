import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/db";
import { category as categoryTable } from "@/app/db/schema";
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

  const categories = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.userId, session.user.id));

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name } = await request.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  const [newCategory] = await db
    .insert(categoryTable)
    .values({
      id: crypto.randomUUID(),
      name: name.trim(),
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json(newCategory);
}
