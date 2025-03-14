<script lang="ts" setup>
import { ref, reactive, defineProps } from "vue";
import TaskForm from "./TaskForm.vue";
import { useTodosStore } from "@/stores/todos.store";
import type { Column, Task } from "@/types";

const props = defineProps<{
  data: Column;
}>();

const store = useTodosStore();

const editColumnName = ref<boolean>(false);
const formActive = ref<boolean>(false);

const taskState = reactive({
  title: "",
  priority: "Low",
  complated: false,
  columnId: props.data.id,
});

const editTask = reactive({
  title: "",
  priority: "Low",
});

const changeColumnName = (input: HTMLInputElement): void => {
  store.editColumn(props.data.id, input.value);
  editColumnName.value = false;
  input.blur();
};

const clearForm = (): void => {
  taskState.title = "";
  taskState.priority = "Low";
  taskState.complated = false;
  formActive.value = false;
};
</script>

<template>
  <div class="w-72 flex flex-col items-start gap-2 drop-zone">
    <!-- Header -->
    <div class="w-full flex items-center justify-between gap-3">
      <input
        class="p-1 text-lg font-semibold grow outline-none focus:border rounded-sm"
        :value="data.name"
        :readonly="!editColumnName"
        @click="editColumnName = true"
        @keyup.enter="changeColumnName($event.target as HTMLInputElement)"
      />

      <UButton
        icon="i-lucide-trash"
        color="error"
        variant="ghost"
        @click="store.deleteColumn(data.id)"
      />
    </div>

    <!-- Tasks -->
    <div
      class="pt-2 w-full flex flex-col gap-2"
      @dragover="store.onDragOver($event)"
      @dragend="store.onDrop($event, data.id)"
    >
      <div
        v-for="task in data.tasks"
        :key="task.id"
        class="p-3 w-full bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent hover:border-primary-500 group drop-task"
        :class="{
          '!p-0': task.editing,
          'blur-xs is-dragging': task.dragging,
        }"
        draggable="true"
        @dragstart="($event: DragEvent) => {
          task.dragging = true
          store.onDragStart($event, task.id, task.columnId)
        }"
        @dragend="() => (task.dragging = false)"
      >
        <template v-if="!task.editing">
          <div class="w-full flex items-center justify-start">
            <div
              class="w-0 overflow-hidden transition-all group-hover:w-[25px]"
              :class="{ 'w-[25px]': task.complated }"
            >
              <UCheckbox
                v-model="task.complated"
                @update:model-value="store.editTask(data.id, task)"
              />
            </div>

            <span class="font-medium">{{ task.title }}</span>

            <UButton
              class="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              icon="i-lucide-edit"
              color="primary"
              variant="ghost"
              size="sm"
              @click="
                () => {
                  task.editing = true;
                  editTask.title = task.title;
                  editTask.priority = task.priority;
                }
              "
            />

            <UButton
              class="ml-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              icon="i-lucide-trash"
              color="error"
              variant="ghost"
              size="sm"
              @click="store.deleteTask(data.id, task.id)"
            />
          </div>

          <div class="w-full">
            <UBadge
              v-if="task.priority != 'Low'"
              class="mt-2"
              :color="task.priority == 'Medium' ? 'warning' : 'error'"
            >
              {{ task.priority }}
            </UBadge>
          </div>
        </template>
        <template v-else>
          <TaskForm
            v-model="editTask"
            v-model:open="task.editing"
            mode="edit"
            @submit="
              () => {
                task.editing = false;
                store.editTask(data.id, {
                  ...task,
                  title: editTask.title,
                  priority: editTask.priority,
                } as Task);
              }
            "
          />
        </template>
      </div>
    </div>

    <!-- Add task -->
    <div
      class="min-w-72 w-72 border border-dashed border-slate-300 dark:border-slate-500 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
      :class="{
        '!bg-transparent border-solid ': formActive,
      }"
    >
      <div
        v-if="!formActive"
        class="p-3 w-full flex items-center justify-center gap-2"
        @click="formActive = true"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        <span class="text-sm font-medium">Add task</span>
      </div>

      <TaskForm
        v-else
        v-model="taskState"
        v-model:open="formActive"
        @submit="
            () => {
              store.createTask(data.id, taskState as Task);
              clearForm();
            }
          "
      />
    </div>
  </div>
</template>
