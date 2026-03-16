"use client";

import { useMemo } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TaskWithCategory = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | Date | null;
  completed: boolean;
  categoryId: string | null;
  categoryName: string | null;
};

type TaskListProps = {
  tasks: TaskWithCategory[];
  onMutate?: () => void;
  className?: string;
};

function groupTasksByCategory(
  tasks: TaskWithCategory[]
): { categoryName: string; tasks: TaskWithCategory[] }[] {
  const map = new Map<string, TaskWithCategory[]>();

  for (const task of tasks) {
    const key = task.categoryName ?? "Uncategorized";
    const list = map.get(key) ?? [];
    list.push(task);
    map.set(key, list);
  }

  const groups: { categoryName: string; tasks: TaskWithCategory[] }[] = [];
  map.forEach((tasks, categoryName) => {
    groups.push({ categoryName, tasks });
  });

  groups.sort((a, b) => {
    if (a.categoryName === "Uncategorized") return 1;
    if (b.categoryName === "Uncategorized") return -1;
    return a.categoryName.localeCompare(b.categoryName);
  });

  return groups;
}

export default function TaskList({ tasks, onMutate, className }: TaskListProps) {
  const router = useRouter();

  const grouped = useMemo(() => groupTasksByCategory(tasks), [tasks]);

  const toggleComplete = async (task: TaskWithCategory) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });
    onMutate?.();
    router.refresh();
  };

  const deleteTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    onMutate?.(); // refetch tasks
    router.refresh(); // refresh the page
  };

  return (
    <div className={cn("space-y-6", className)}>
      {grouped.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No tasks for this date. Add one below.
        </p>
        // if there are no tasks, show a message
      ) : (
        // if there are tasks, show them in a list
        grouped.map(({ categoryName, tasks: categoryTasks }) => (
          <section key={categoryName}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground !text-orange-300">
              {categoryName}
            </h3>
            <div className="space-y-2">
              {categoryTasks.map((task) => (
                <Card
                  key={task.id}
                  className="overflow-hidden rounded-lg border bg-card/50 shadow-sm transition-colors hover:bg-card"
                >
                  <CardContent className="flex flex-row items-center gap-3 px-4 py-3">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      size="small"
                      // set the checkbox to the primary color when checked
                      sx={{
                        padding: 0,
                        "&.Mui-checked": {
                          color: "var(--color-primary)", 
                        },
                      }}
                    />
                    
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium text-foreground",
                          task.completed && "line-through text-muted-foreground" // if the task is completed, strike through the text
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <IconButton
                      size="small"
                      onClick={() => deleteTask(task.id)}
                      sx={{ color: "var(--color-destructive)" }}
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
