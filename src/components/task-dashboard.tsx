"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfDay } from "date-fns";
import DateSelector from "./date-selector";
import TaskList, { type TaskWithCategory } from "./task-list";
import TaskForm from "./task-form";
import CategoryForm from "./category-form";
import { Logout } from "./logout";

export type Category = { id: string; name: string };

export default function TaskDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date())
  );
  const [tasks, setTasks] = useState<TaskWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const res = await fetch(`/api/tasks?date=${dateStr}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  }, [selectedDate]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void fetchTasks().finally(() => setLoading(false));
  }, [fetchTasks]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleMutate = useCallback(() => {
    void fetchTasks();
    void fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const defaultDueDate = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {format(selectedDate, "EEEE, MMMM d")}
          </h1>
          <Logout />
        </div>

        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Today</h2>
          <DateSelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            daysToShow={7}
          />
        </section>

        <section className="mb-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Add Task</h2>
            <CategoryForm onSuccess={handleMutate} />
          </div>
          <TaskForm
            categories={categories}
            defaultDueDate={defaultDueDate}
            onSuccess={handleMutate}
          />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Your Tasks
          </h2>
          {loading ? (
            <p className="text-muted-foreground py-4">Loading tasks...</p>
          ) : (
            <TaskList tasks={tasks} onMutate={handleMutate} />
          )}
        </section>
      </div>
    </div>
  );
}
