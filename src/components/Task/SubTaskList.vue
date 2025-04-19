<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useTaskStore } from "@/stores/taskStore";
import { modalType } from "@/types/modalType";
import { type Task } from "@/types/taskType";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";
import { ref } from "vue";

const props = defineProps<{
  parentTaskId: string;
  subtasks?: Task[];
}>();

const modalStore = useModalStore();
const taskStore = useTaskStore();
const toast = useToast();

const modalOpen = ref(false);

const editSubtask = (subtaskId: string) => {
  modalStore.open(modalType.EDIT_SUBTASK, subtaskId, props.parentTaskId);
};

const confirmDelete = () => {
  modalOpen.value = true;
};

const cancelDelete = () => {
  modalOpen.value = false;
};

const deleteSubtask = (taskId: string) => {
  modalOpen.value = false;
  taskStore.deleteSubtask(props.parentTaskId, taskId);
  toast.add({
    title: "Success",
    description: "Subtask deleted successfully.",
    color: "success",
  });
};
</script>

<template>
  <div>
    <h4 class="mb-2 font-bold">Subtasks:</h4>
    <div
      v-if="props.subtasks && props.subtasks.length > 0"
      class="grid grid-cols-2 gap-4 lg:grid-cols-3"
    >
      <UCard v-for="subtask in props.subtasks" :key="subtask.id">
        <TaskDetail :task="subtask" :parent-task-id="props.parentTaskId" />
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              icon="i-lucide-pencil"
              size="sm"
              color="primary"
              variant="outline"
              @click="editSubtask(subtask.id)"
            >
              Edit
            </UButton>
            <UButton
              icon="i-lucide-trash"
              size="sm"
              color="error"
              variant="outline"
              @click="confirmDelete"
            >
              Delete
            </UButton>
          </div>
        </template>

        <UModal
          v-model:open="modalOpen"
          title="Delete Subtask"
          description="Are you sure you want to delete this subtask? This action cannot be undone."
          dismissible
        >
          <template #footer>
            <div class="flex w-full justify-end gap-2">
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                @click="cancelDelete"
              >
                Cancel
              </UButton>
              <UButton
                size="sm"
                color="error"
                variant="outline"
                @click="deleteSubtask(subtask.id)"
              >
                Yes, Delete
              </UButton>
            </div>
          </template>
        </UModal>
      </UCard>
    </div>
    <p v-else>No subtasks for this task.</p>
  </div>
</template>
