<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useTaskStore } from "@/stores/taskStore";
import { modalType } from "@/types/modalType";
import type { Task, TaskStatus } from "@/types/taskType";
import { TaskType } from "@/types/taskType";
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import { h, ref, resolveComponent, watch } from "vue";
import TaskStatusBadge from "./TaskStatusBadge.vue";
import TaskTypeBadge from "./TaskTypeBadge.vue";

const UButton = resolveComponent("UButton");
const UProgress = resolveComponent("UProgress");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UTable = resolveComponent("UTable");
const taskStore = useTaskStore();
const modalStore = useModalStore();

const tableTasks = ref([...taskStore.getTasks]);

watch(
  () => taskStore.$state,
  () => {
    tableTasks.value = [...taskStore.getTasks];
  },
  { deep: true, immediate: true },
);

const columns: TableColumn<Task>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "text-left text-wrap min-w-[8rem]",
        },
        row.original.title,
      ),
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      h("div", { class: "text-center" }, getHeader(column, "Type")),
    cell: ({ row }) =>
      h(
        "div",
        { class: "flex items-center justify-center" },
        h(TaskTypeBadge, { type: row.getValue("type") as TaskType }),
      ),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h("div", { class: "text-center" }, getHeader(column, "Status")),
    cell: ({ row }) =>
      h(
        "div",
        { class: "flex items-center justify-center" },
        h(TaskStatusBadge, { status: row.getValue("status") as TaskStatus }),
      ),
  },
  {
    accessorKey: "progress",
    header: ({ column }) =>
      h("div", { class: "text-center" }, getHeader(column, "Progress")),
    cell: ({ row }) => {
      return h(
        "div",
        {
          class: "flex items-center justify-center",
        },
        h(UProgress, {
          modelValue: row.getValue("progress"),
          status: false,
        }),
      );
    },
  },
  {
    accessorKey: "id",
    id: "id",
    header: () => h("div", { class: "text-center" }, "Actions"),
    cell: ({ row }) => {
      const taskId = row.getValue("id") as string;

      return h(
        "div",
        { class: "text-center" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "center",
            },
            items: [
              {
                icon: "i-lucide-eye",
                label: "View",
                onSelect() {
                  modalStore.open(modalType.VIEW_TASK, taskId);
                },
              },
              {
                icon: "i-lucide-pencil",
                label: "Edit",
                onSelect() {
                  modalStore.open(modalType.EDIT_TASK, taskId);
                },
              },
              {
                icon: "i-lucide-trash-2",
                label: "Delete",
                onSelect() {
                  modalStore.open(modalType.DELETE_TASK, taskId);
                },
              },
              {
                icon: "i-lucide-list-todo",
                label: "Add Subtask",
                onSelect() {
                  modalStore.open(modalType.ADD_SUBTASK, taskId, taskId);
                },
              },
            ],
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            }),
        ),
      );
    },
  },
];

const sorting = ref();

const getHeader = (column: Column<Task>, label: string) => {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: {
        align: "start",
      },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "Asc",
          type: "checkbox",
          icon: "i-lucide-arrow-up-narrow-wide",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          },
        },
        {
          label: "Desc",
          icon: "i-lucide-arrow-down-wide-narrow",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-(--ui-bg-elevated)",
        "aria-label": `Sort by ${isSorted === "asc" ? "descending" : "ascending"}`,
      }),
  );
};

const expanded = ref({});
</script>

<template>
  <UTable
    ref="taskTable"
    v-model:expanded="expanded"
    v-model:sorting="sorting"
    sticky
    :data="tableTasks"
    :columns="columns"
    :ui="{ tr: 'data-[expanded=true]:bg-(--ui-bg-elevated)/50' }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <SubTaskList
        :subtasks="row.original.subtasks"
        :parent-task-id="row.original.id"
      />
    </template>
  </UTable>
</template>
