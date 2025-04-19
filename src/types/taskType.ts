import { colorType } from "./colorType";

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


export const statusBadge: Record<
  TaskStatus,
  { color: colorType; icon: string; label: string }
> = {
  [TaskStatus.BACKLOG]: {
    color: colorType.NEUTRAL,
    icon: "i-lucide-list-todo",
    label: "Backlog",
  },
  [TaskStatus.TODO]: {
    color: colorType.WARNING,
    icon: "i-lucide-circle-dot",
    label: "To Do",
  },
  [TaskStatus.ON_PROGRESS]: {
    color: colorType.INFO,
    icon: "i-lucide-loader-2",
    label: "On Progress",
  },
  [TaskStatus.DONE]: {
    color: colorType.SUCCESS,
    icon: "i-lucide-check-circle-2",
    label: "Done",
  },
};


export const typeBadge: Record<
  TaskType,
  { color: colorType; icon: string; label: string }
> = {
  [TaskType.FEATURE]: {
    color: colorType.PRIMARY,
    icon: "i-lucide-sparkles",
    label: TaskType.FEATURE,
  },
  [TaskType.BUG]: {
    color: colorType.DANGER,
    icon: "i-lucide-bug",
    label: TaskType.BUG,
  },
  [TaskType.IMPROVEMENT]: {
    color: colorType.INFO,
    icon: "i-lucide-rocket",
    label: TaskType.IMPROVEMENT,
  },
  [TaskType.GENERAL]: {
    color: colorType.WARNING,
    icon: "i-lucide-tag",
    label: TaskType.GENERAL,
  },
  [TaskType.OTHER]: {
    color: colorType.NEUTRAL,
    icon: "i-lucide-asterisk",
    label: TaskType.OTHER,
  },
};