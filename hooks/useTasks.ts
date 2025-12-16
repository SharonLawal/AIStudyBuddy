import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libs/supabase";
import { Task } from "../types";
import { useAuth } from "../providers/AuthProvider";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data as Task[]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (text: string) => {
    if (!text.trim() || !user) return;
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ user_id: user.id, text, priority: "medium" }])
        .select()
        .single();

      if (error) throw error;
      if (data) setTasks([data, ...tasks]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id: string, newText: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ text: newText })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating task:", error);
      fetchTasks(); // Revert on error
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t))
    );
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !currentStatus })
        .eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Error toggling task:", error);
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting task:", error);
      fetchTasks();
    }
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    refreshTasks: fetchTasks,
  };
}
