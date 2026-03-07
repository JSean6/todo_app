"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton
} from "@mui/material";
import { DeleteIcon } from "lucide-react";
import { useRouter } from "next/navigation";


type Task = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | Date | null;
  completed: boolean;
};

export default function TaskTable({ tasks }: { tasks: Task[] }) {

  const router = useRouter();

  const formatDueDate = (dueAt: Task["dueAt"]) => {
    if (!dueAt) return "-";

    if (dueAt instanceof Date) {
      if (Number.isNaN(dueAt.getTime())) return "-";
      return dueAt.toLocaleDateString();
    }

    // handle string or any other serialised form
    const dateFromString = new Date(dueAt as string);
    if (!Number.isNaN(dateFromString.getTime())) {
      return dateFromString.toLocaleDateString();
    }

    // fall back to raw value so at least something shows
    return String(dueAt);
  };

  
 // Toggle completed status
  const toggleComplete = async (task: Task) => {

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        description: task.description,
        dueAt: task.dueAt ? new Date(task.dueAt).toISOString() : null,
        completed: !task.completed,
      }),
    });

    // reload tasks from server
    router.refresh();
  };

 
  const deleteTask = async (taskId: string) => {

    await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: taskId })
    });

    router.refresh();
  };

  return (
    <TableContainer component={Paper}>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {tasks.map((task) => (

            <TableRow key={task.id}>

              <TableCell>{task.title}</TableCell>

              <TableCell>
                {task.description || "-"}
              </TableCell>

              <TableCell>{formatDueDate(task.dueAt)}</TableCell>

              <TableCell>

                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />

              </TableCell>

              <TableCell>

                <IconButton
                  color="error"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </TableContainer>
  );
}