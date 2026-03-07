import { Logout } from "@/components/logout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/app/db";
import { task } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import TaskForm from "@/components/task-form";
import TaskTable from "@/components/task-table";
export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const tasksData = await db
    .select()
    .from(task)
    .where(eq(task.userId, session.user.id));

  const tasks = tasksData.map((t) => ({
    ...t,
    dueAt: t.dueAt ? t.dueAt.toISOString() : null,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Task</h1>
      <TaskForm />
      <h2>Your Tasks</h2>
      
      <TaskTable tasks={tasks} />
      <Logout />
    </div>
  );
}
