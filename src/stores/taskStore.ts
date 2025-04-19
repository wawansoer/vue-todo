import type { Task } from "@/types/taskType";
import { defineStore } from "pinia";

interface State {
  tasks: Task[];
}

export const useTaskStore = defineStore("taskStore", {
  state: (): State => ({
    tasks: [],
  }),
  actions: {
    loadTasksFromLocalStorage() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    },
    saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...task,
      };
      this.tasks.push(newTask);
      this.saveTasksToLocalStorage();
    },
    updateTask(id: string, updatedTask: Partial<Task>) {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask };
        this.saveTasksToLocalStorage();
      }
    },
  },
  getters: {
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id: string) =>
      state.tasks.find((task) => task.id === id),
    getSubtaskDetail: (state) => (taskId: string, subtaskId: string) => {
      const task = state.tasks.find((t) => t.id === taskId);
      return task?.subtasks?.find((s) => s.id === subtaskId) ?? null;
    },
  },
});
