"use client";

import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

type CategoryFormProps = {
  onSuccess?: () => void; // Callback function to refresh the task list
};

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const router = useRouter(); 
  const [name, setName] = useState(""); // State to store the category name

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      setName("");
      onSuccess?.(); // Call the onSuccess function to refresh the task list
      router.refresh(); // Refresh the page to show the new category
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <TextField
        label="New category"
        variant="outlined"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        sx={{ minWidth: 180 }}
      />
      <Button
        variant="contained"
        size="small"
        className="!bg-black hover:!bg-gray-300 hover:!text-gray-900"
        onClick={handleAdd}
        startIcon={<Plus className="h-4 w-4" />}
      >
        Add
      </Button>
    </div>
  );
}
