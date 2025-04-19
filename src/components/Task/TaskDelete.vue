<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useTaskStore } from "@/stores/taskStore";
import { colorType } from "@/types/colorType";
import { modalType } from "@/types/modalType";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";
import { ref } from "vue";

const modalStore = useModalStore();
const taskStore = useTaskStore();

const confirmOpen = ref(false);
const open = ref(true);

const modalName = modalType.DELETE_TASK;

const closeModal = () => {
  modalStore.close(modalName);
  open.value = false;
};

const onDeleteClick = () => {
  confirmOpen.value = true;
};

const toast = useToast();

const onCancelDelete = () => {
  confirmOpen.value = false;
};

const onConfirmDelete = () => {
  try {
    taskStore.deleteTask(modalStore.getTaskId(modalName) || "");
    closeModal();
    confirmOpen.value = false;
    toast.add({
      title: "Success",
      orientation: "horizontal",
      description: "Task and SubTasks Successfully Deleted.",
      color: colorType.SUCCESS,
    });
  } catch {
    // console.log(error);
    toast.add({
      title: "Error",
      orientation: "horizontal",
      description: "Failed to delete task.",
      color: colorType.DANGER,
    });
  }
};
</script>

<template>
  <div>
    <TaskView :task-id="modalStore.getTaskId(modalName) || ''" />
    <USeparator />
    <div class="mt-4 flex justify-end gap-2">
      <UButton color="neutral" variant="outline" @click="closeModal">
        Cancel
      </UButton>
      <UButton color="error" @click="onDeleteClick"> Delete </UButton>
    </div>
  </div>

  <!-- Secondary confirmation modal -->
  <UModal
    v-model:open="confirmOpen"
    title="Confirm Delete"
    description="Are you sure you want to delete this task and subtasks? This action cannot be undone."
    :dismissible="false"
  >
    <template #body>
      <div class="mt-4 flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="onCancelDelete">
          Cancel
        </UButton>
        <UButton color="error" @click="onConfirmDelete"> Yes, Delete </UButton>
      </div>
    </template>
  </UModal>
</template>
