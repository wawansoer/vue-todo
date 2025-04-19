<script setup lang="ts">
import TaskModal from "@/components/Task/TaskModal.vue";
import { useModalStore } from "@/stores/modalStore";
import { modalType } from "@/types/modalType";
import { ref, watch } from "vue";

const modalStore = useModalStore();

const currenOpenModal = ref<modalType | "">("");

const addTask = () => {
  modalStore.open(modalType.ADD_TASK);
};

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
  <UApp>
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
            </div>
          </div>
        </template>
      </UCard>
      <TaskModal
        v-if="currenOpenModal"
        :modal-name="currenOpenModal as modalType"
      />
    </UContainer>
  </UApp>
</template>
