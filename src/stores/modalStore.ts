import { modalType } from "@/types/modalType";
import { defineStore } from "pinia";

type ModalState = {
  open: boolean;
  name: modalType;
  taskId?: string;
  parentTaskId?: string;
};

export const useModalStore = defineStore("modal", {
  state: () => ({
    modal: {} as Record<string, ModalState>,
  }),
  actions: {
    open(name: modalType, taskId?: string, parentTaskId?: string) {
      this.modal[name] = {
        open: true,
        name: name,
        taskId: taskId,
        parentTaskId: parentTaskId,
      };
    },
    close(name: modalType) {
      if (this.modal[name]) {
        delete this.modal[name];
      }
    },
    getTaskId(name: modalType) {
      return this.modal[name]?.taskId;
    },
  },
  
});
