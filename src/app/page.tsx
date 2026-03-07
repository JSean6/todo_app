import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({
     headers: await headers(),
   });

  if(session){
    redirect("/dashboard");
  }
  return (
    <div style={{ padding: "3rem", textAlign: "center"}}>
      <h1>Welcome to TaskFlow</h1>
      <p>
        A simple to-do app where you can create and manage your tasks.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <a href="/login">Login</a> |{" "}
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

