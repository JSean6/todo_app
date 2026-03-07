"use client";

import { Box, TextField, Button, Grid, Checkbox } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskForm() {

  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [completed, setCompleted] = useState(false);

  
  const handleAdd = async () => {

    if (!title) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          title,
          description,
          dueAt: dueAt || null,
          completed
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      // Clear form after success
      setTitle("");
      setDescription("");
      setDueAt("");
      setCompleted(false);

      // Refresh the page so the dashboard fetches tasks again from the database
      router.refresh();

    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Grid container spacing={2}>

        <Grid size={3}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid size={3}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid size={2}>
          <TextField
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <Checkbox
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </Grid>

        <Grid size={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "100%" }}
            onClick={handleAdd}
          >
            Add Task
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
}