<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { Task } from "@/types/taskType";
import { computed, ref, watch } from "vue";
import TaskStatusBadge from "./TaskStatusBadge.vue";
import TaskTypeBadge from "./TaskTypeBadge.vue";

const props = defineProps<{
  task: Task;
}>();

const modalStore = useModalStore();

const isModal = computed(() => {
  return Object.values(modalStore.modal).some((m) => m.open);
});

const uTask = ref<Task>();

watch(
  () => props.task,
  (newTask) => {
    uTask.value = { ...newTask };
  },
  {
    immediate: true,
    deep: true,
  },
);

const formattedDate = (date?: string | Date) => {
  if (!date) return "-";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const calculateDuration = (
  createdAt?: Date | string,
  completedAt?: Date | string,
) => {
  if (!createdAt || !completedAt) return null;
  const start = new Date(createdAt).getTime();
  const end = new Date(completedAt).getTime();
  if (isNaN(start) || isNaN(end)) return null;
  const diffMs = end - start;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
};

const duration = computed(() =>
  calculateDuration(uTask?.value?.createdAt, uTask?.value?.completedAt),
);

const durationText = computed(() => {
  if (!duration.value) return "";
  const { days, hours } = duration.value;
  let parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (parts.length === 0) return "Less than 1 hour";
  return parts.join(" ");
});

const uTaskProgress = computed({
  get: () => uTask.value?.progress ?? 0,
  set: (value: number) => {
    if (uTask.value) {
      uTask.value.progress = value;
    }
  },
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3
      class="text-lg font-bold text-wrap"
      :class="{ 'h-16 overflow-auto': !isModal }"
    >
      {{ uTask?.title }}
    </h3>

    <USeparator />

    <div class="space-x-4">
      <TaskStatusBadge :status="uTask?.status" />
      <TaskTypeBadge :type="uTask?.type" />
    </div>

    <div class="text-sm text-wrap" :class="{ 'h-48 overflow-auto': !isModal }">
      {{ uTask?.description }}
    </div>

    <USeparator />

    <div class="flex flex-wrap gap-2">
      <UBadge
        color="info"
        variant="subtle"
        trailing-icon="i-lucide-calendar-plus"
      >
        {{ formattedDate(uTask?.createdAt) }}
      </UBadge>
      <UBadge
        v-if="uTask?.updatedAt"
        color="warning"
        variant="subtle"
        trailing-icon="i-lucide-pencil"
      >
        {{ formattedDate(uTask?.updatedAt) }}
      </UBadge>
      <UBadge
        v-if="uTask?.completedAt"
        color="success"
        variant="subtle"
        trailing-icon="i-lucide-check-circle"
      >
        {{ formattedDate(uTask?.completedAt) }}
      </UBadge>
      <UBadge
        v-if="durationText !== ''"
        trailing-icon="i-lucide-clock-fading"
        variant="subtle"
      >
        {{ durationText }}
      </UBadge>
    </div>

    <UProgress
      v-model="uTaskProgress"
      class="col-span-2 w-full"
      aria-label="Task progress"
      :max="100"
      status
    />
  </div>
</template>
