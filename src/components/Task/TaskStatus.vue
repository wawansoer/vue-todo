<script setup lang="ts">
import { TaskStatus, statusBadge } from "@/types/taskType";
import { computed } from "vue";

const props = defineProps<{
  status?: TaskStatus;
}>();

const typeStatus = computed(() => props.status ?? TaskStatus.BACKLOG);

const badge = computed(() => {
  return (
    statusBadge[typeStatus.value] || {
      color: "neutral",
      icon: "i-lucide-help-circle",
      label: "Unknown",
    }
  );
});

const badgeColor = computed(() => badge.value.color);
const badgeIcon = computed(() => badge.value.icon);
const badgeLabel = computed(() => badge.value.label);
</script>

<template>
  <UBadge
    class="w-fit justify-self-center"
    variant="subtle"
    :color="badgeColor"
    :trailing-icon="badgeIcon"
  >
    {{ badgeLabel }}
  </UBadge>
</template>
