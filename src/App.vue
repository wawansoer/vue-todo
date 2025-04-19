<script setup lang="ts">
import TaskModal from "@/components/Task/TaskModal.vue";
import { useModalStore } from "@/stores/modalStore";
import { modalType } from "@/types/modalType";
import { onMounted, ref, watch } from "vue";
import ThemeToggle from "@/components/Common/ThemeToggle.vue";
import TaskTable from "@/components/Task/TaskTable.vue";
import { useTaskStore } from "@/stores/taskStore";

const modalStore = useModalStore();
const taskStore = useTaskStore();
const currenOpenModal = ref<modalType | "">("");

const addTask = () => {
  modalStore.open(modalType.ADD_TASK);
};

onMounted(() => {
  taskStore.loadTasksFromLocalStorage();
});

watch(
  () => {
    return (
      Object.values(modalStore.modal).find((modal) => modal.open)?.name || ""
    );
  },
  (newOpenModalName) => {
    currenOpenModal.value = newOpenModalName;
  },
);
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <UContainer>
      <UCard color="stone" class="my-8">
        <template #header>
          <div class="flex items-center justify-between">
            Task Lists
            <div class="inline-flex items-center gap-4">
              <UButton
                size="md"
                color="neutral"
                variant="ghost"
                icon="i-lucide-circle-plus"
                @click="addTask"
              >
                <span class="hidden md:inline"> Add Task </span>
              </UButton>
              <ThemeToggle />
            </div>
          </div>
        </template>
        <TaskTable />
      </UCard>
      <TaskModal
        v-if="currenOpenModal"
        :modal-name="currenOpenModal as modalType"
      />
    </UContainer>
  </UApp>
</template>
