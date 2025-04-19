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
    deleteTask(id: string) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasksToLocalStorage();
    },
    addSubtask(
      taskId: string,
      subtask: Omit<Task, "id" | "createdAt" | "updatedAt">,
    ) {
      const parentTask = this.getTaskById(taskId);
      if (parentTask) {
        const newSubtask: Task = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          ...subtask,
        };
        if (!parentTask.subtasks) {
          parentTask.subtasks = [];
        }
        parentTask.subtasks.push(newSubtask);
        this.saveTasksToLocalStorage();
      }
    },
    updateSubtask(
      taskId: string,
      subtaskId: string,
      updatedSubtask: Partial<Task>,
    ) {
      const parentTask = this.getTaskById(taskId);
      if (parentTask && parentTask.subtasks) {
        const subtaskIndex = parentTask.subtasks.findIndex(
          (subtask) => subtask.id === subtaskId,
        );
        if (subtaskIndex !== -1) {
          parentTask.subtasks[subtaskIndex] = {
            ...parentTask.subtasks[subtaskIndex],
            ...updatedSubtask,
          };
          this.saveTasksToLocalStorage();
        }
      }
    },
    deleteSubtask(taskId: string, subtaskId: string) {
      const parentTask = this.getTaskById(taskId);
      if (parentTask && parentTask.subtasks) {
        parentTask.subtasks = parentTask.subtasks.filter(
          (subtask) => subtask.id !== subtaskId,
        );
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
