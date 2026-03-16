"use client";

import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Category = { id: string; name: string };

type TaskFormProps = {
  categories?: Category[];
  defaultDueDate?: string;
  onSuccess?: () => void;
};

export default function TaskForm({ categories = [], defaultDueDate = "", onSuccess }: TaskFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState(defaultDueDate);
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    setDueAt(defaultDueDate);
  }, [defaultDueDate]);

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueAt: dueAt || null,
          categoryId: categoryId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      setTitle("");
      setDescription("");
      setDueAt(defaultDueDate || "");
      setCategoryId("");
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={3}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={2}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={2}>
          <TextField
            type="date"
            label="Due date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={2}>
          <Button variant="contained" className="!bg-black hover:!bg-gray-300 hover:!text-gray-900" fullWidth onClick={handleAdd}>
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}