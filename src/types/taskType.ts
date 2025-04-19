export enum TaskType {
  FEATURE = "Feature",
  BUG = "Bug",
  IMPROVEMENT = "Improvement",
  GENERAL = "General",
  OTHER = "Other",
}

export enum TaskStatus {
  BACKLOG = "Backlog",
  TODO = "To Do",
  ON_PROGRESS = "On Progress",
  DONE = "Done",
}

export interface Tasks {
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: TaskStatus;
  type: TaskType;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  subtasks?: Task[];
}
