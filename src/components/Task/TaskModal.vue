<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { modalType } from "@/types/modalType";
import { computed, ref } from "vue";
import TaskForm from "@/components/Task/TaskForm.vue";

const props = defineProps<{
  modalName: modalType;
}>();

const modalStore = useModalStore();

const open = ref(true);

const headerText = computed(() => {
  switch (props.modalName) {
    case modalType.ADD_TASK:
      return "Fill this form to add your task";
    case modalType.EDIT_TASK:
      return "Fill this form to edit your task";
    case modalType.VIEW_TASK:
      return "Task Details";
    case modalType.DELETE_TASK:
      return "Please confirm to delete this task";
    case modalType.ADD_SUBTASK:
      return "Fill this form to add your subtask";
    case modalType.EDIT_SUBTASK:
      return "Fill this form to edit your subtask";
    default:
      return "No operation found.";
  }
});

const closeModal = () => {
  modalStore.close(props.modalName);
  open.value = false;
};
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.modalName"
    :description="headerText"
    :dismissible="false"
    :close="{ onClick: () => closeModal() }"
  >
    <template #body>
      <div>
        <TaskView
          v-if="props.modalName === modalType.VIEW_TASK"
          :task-id="modalStore.getTaskId(props.modalName) || ''"
        />
        <TaskForm
          v-if="
            [
              modalType.ADD_TASK,
              modalType.EDIT_TASK,
              modalType.ADD_SUBTASK,
              modalType.EDIT_SUBTASK,
            ].includes(props.modalName)
          "
        />
        <TaskDelete v-if="props.modalName === modalType.DELETE_TASK" />
      </div>
    </template>
  </UModal>
</template>
