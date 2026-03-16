import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Chip, Button, Container, Box, Typography } from "@mui/material";

const categories = [
  "Exercise",
  "Read books",
  "Meditate",
  "Plan meals",
  "Water plants",
  "Study",
  "Journal",
  "Morning routine",
];

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Container maxWidth="sm">
      <Box className="flex flex-col items-center justify-center min-h-screen text-center">

        <h1 className="text-4xl font-bold mb-3">
            Pick some categories to get started
          </h1>

        <Typography className="text-gray-500 mb-6">
          Quickly organize your tasks with common categories
        </Typography>


        <Box className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              variant="outlined"
              className="cursor-pointer hover:bg-gray-100"
            />
          ))}
        </Box>


        <Button
          variant="contained"
          size="large"
          href="/login"
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "50px", // fully rounded
            padding: "12px 28px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#111",
              boxShadow: "0px 10px 25px rgba(0,0,0,0.35)",
              transform: "translateY(-3px)", // lifts the button
            },
          }}
        >
          Continue
        </Button>

        {/* Auth links */}
        <div className="mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Signup
          </a>
        </div>
      </Box>
    </Container>
  );
}