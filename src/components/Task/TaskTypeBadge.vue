<script setup lang="ts">
import { TaskType, typeBadge } from "@/types/taskType";
import { computed } from "vue";

const props = defineProps<{
  type?: TaskType;
}>();

const typeValue = computed(() => props.type ?? TaskType.GENERAL);

const badge = computed(() => {
  return (
    typeBadge[typeValue.value] || {
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
