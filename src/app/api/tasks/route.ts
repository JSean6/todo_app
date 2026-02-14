import { auth } from "@/auth";
import { db } from "@/app/db";
import { tasks } from "@/app/db/schema";
import { eq } from "drizzle-orm";


export async function POST(req: Request){
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorised", { status: 401});
  }

  const body = await req.json();

  const newTask = await db.insert(tasks).values({
    title: body.title,
    description: body.description,
    dueAt: body.dueAT ? new Date(body.dueAt): null,
    completed: body.completed ?? false,
    userId: session.user.id,
  }).returning();

  return Response.json(newTask[0]);
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  const userTasks = await db
   .select()
   .from(tasks)
   .where(eq(tasks.userId, session.user.id));

   return Response.json(userTasks)
}