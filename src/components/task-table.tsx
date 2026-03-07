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
  dueAt: string | null;
  completed: boolean;
};

export default function TaskTable({ tasks }: { tasks: Task[] }) {

  const router = useRouter();

  
 // Toggle completed status
  const toggleComplete = async (task: Task) => {

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: task.id,
        completed: !task.completed
      })
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

              <TableCell>
                {task.dueAt
                  ? new Date(task.dueAt).toLocaleDateString()
                  : "-"
                }
              </TableCell>

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