<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useTaskStore } from "@/stores/taskStore";
import { colorType } from "@/types/colorType";
import { modalType } from "@/types/modalType";
import { TaskStatus, TaskType, type Task } from "@/types/taskType";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";
import { computed, ref } from "vue";
import { number, object, string, type InferType } from "yup";

const modalStore = useModalStore();
const taskStore = useTaskStore();
const toast = useToast();

const activeModal = computed(() =>
  Object.values(modalStore.modal).find((m) => m.open),
);

const isEdit = computed(() => {
  return (
    activeModal.value?.name === modalType.EDIT_TASK ||
    activeModal.value?.name === modalType.EDIT_SUBTASK
  );
});

const isSubtask = computed(() => {
  return (
    !!activeModal.value?.parentTaskId ||
    activeModal.value?.name === modalType.ADD_SUBTASK ||
    activeModal.value?.name === modalType.EDIT_SUBTASK
  );
});

const taskDetail = computed<Task | null>(() => {
  const taskId = activeModal.value?.taskId;
  const parentTaskId = activeModal.value?.parentTaskId;

  if (isSubtask.value && parentTaskId && taskId) {
    return taskStore.getSubtaskDetail(parentTaskId, taskId);
  }
  if (!isSubtask.value && taskId) {
    return taskStore.getTaskById(taskId) ?? null;
  }
  return null;
});

const taskTypeOptions = computed(() =>
  Object.values(TaskType).map((type) => ({
    label: type,
    value: type,
  })),
);

const taskStatusOptions = computed(() =>
  Object.values(TaskStatus).map((status) => ({
    label: status,
    value: status,
  })),
);

const formSchema = object({
  title: string().min(5, "Min 5 chars").required("Required"),
  description: string().when("type", {
    is: (type: string) => type === TaskType.FEATURE,
    then: (schema) =>
      schema
        .min(20, "Description for Feature must be at least 20 characters")
        .required("Description for Feature is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  type: string()
    .oneOf(Object.values(TaskType))
    .required("Task Type is required"),
  status: string()
    .oneOf(Object.values(TaskStatus))
    .required("Status is required"),
  progress: number().min(0).max(100).required("Progress is required"),
});

type FormSchema = InferType<typeof formSchema>;

// State form
const form = ref<FormSchema>({
  title: taskDetail.value?.title ?? "",
  description: taskDetail.value?.description ?? "",
  type: taskDetail.value?.type ?? TaskType.GENERAL,
  status: taskDetail.value?.status ?? TaskStatus.TODO,
  progress: taskDetail.value?.progress ?? 0,
});

const onSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  const {
    name: modalName,
    taskId: currentTaskId,
    parentTaskId: currentParentTaskId,
  } = activeModal.value || {};

  if (!modalName) {
    toast.add({
      title: "Error",
      description: "Cannot determine modal context.",
      color: colorType.DANGER,
    });
    return;
  }

  const formData = event.data;

  try {
    let successMessage = "";
    const now = new Date();

    if (isSubtask.value) {
      if (!currentParentTaskId) {
        throw new Error("Parent Task ID is missing for subtask operation.");
      }

      if (isEdit.value && currentTaskId) {
        // Edit Subtask
        const subtaskPayload = { ...formData, updatedAt: now };
        taskStore.updateSubtask(
          currentParentTaskId,
          currentTaskId,
          subtaskPayload,
        );
        successMessage = "Subtask updated successfully.";
      } else {
        const subtaskPayload = { ...formData };
        taskStore.addSubtask(currentParentTaskId, subtaskPayload);
        successMessage = "Subtask added successfully.";
      }
    }
    // --- TASK OPERATIONS ---
    else {
      const isDone = formData.progress === 100;

      const taskBaseData: Partial<Task> = {
        ...formData,
        status: isDone ? TaskStatus.DONE : formData.status,
        ...(isDone && { completedAt: now }),
      };

      if (isEdit.value && currentTaskId) {
        const taskPayload = { ...taskBaseData, updatedAt: now };
        taskStore.updateTask(currentTaskId, taskPayload);
        successMessage = "Task updated successfully.";
      } else {
        taskStore.addTask(taskBaseData as Task);
        successMessage = "Task added successfully.";
      }
    }

    modalStore.close(modalName);
    toast.add({
      title: "Success",
      description: successMessage,
      color: colorType.SUCCESS,
    });
  } catch {
    toast.add({
      title: "Error",
      description: "Failed to submit the form.",
      color: colorType.DANGER,
    });
  }
};
</script>

<template>
  <UForm
    :schema="formSchema"
    :state="form"
    class="grid grid-cols-1 gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Title" name="title" class="w-full">
      <UInput v-model="form.title" placeholder="Task title" class="w-full" />
    </UFormField>

    <UFormField label="Description" name="description" class="w-full">
      <UTextarea
        v-model="form.description"
        placeholder="Task description"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="Type" name="type">
        <USelect
          v-model="form.type"
          :items="taskTypeOptions"
          placeholder="Select task type"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Status" name="status" class="w-full">
        <USelect
          v-model="form.status"
          :items="taskStatusOptions"
          placeholder="Select task status"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField label="Progress" name="progress" class="w-full">
      <UInputNumber v-model="form.progress" class="w-full" :step="20" />
    </UFormField>
    <UButton type="submit" class="mt-auto justify-self-end">
      {{ isEdit ? "Update" : "Create" }}
    </UButton>
  </UForm>
</template>
