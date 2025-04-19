<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import { computed } from "vue";
import TaskDetail from "@/components/Task/TaskDetail.vue";

const props = defineProps<{
  taskId: string;
}>();

const taskStore = useTaskStore();

const taskDetail = computed(() => taskStore.getTaskById(props.taskId));
</script>

<template>
  <div v-if="taskDetail">
    <TaskDetail :task="taskDetail" />
  </div>
  <div v-else>
    <p>Task not found.</p>
  </div>
</template>
