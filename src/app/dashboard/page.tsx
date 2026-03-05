import { Logout } from "@/components/logout"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/app/db";
import { task } from "@/app/db/schema";
import { eq } from "drizzle-orm";
export default async function Dashboard() {
    const session = await auth.api.getSession();

    if (!session) {
        redirect("/login");
    }

    const tasks = await db
        .select()
        .from(task)
        .where(eq(task.userId, session.user.id))
    return (
    <div style={{ padding: "2rem"}}>
        <h2>Your Tasks</h2>
        
        <Logout />
    </div>
);
}