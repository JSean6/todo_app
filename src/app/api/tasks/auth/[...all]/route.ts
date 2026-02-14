import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);

//  It automatically creates:

// /api/auth/sign-in
// /api/auth/sign-up
// /api/auth/sign-out
// /api/auth/session

