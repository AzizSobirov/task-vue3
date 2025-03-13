<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import type { Column, Task } from "@/types";

const props = defineProps<{
  data: Column;
}>();

const emit = defineEmits<{
  editColumn: [id: number, name: string];
  deleteColumn: [id: number];
  createTask: [id: number, data: Task];
  onDragStart: [event: DragEvent, taskId: number, columnId: number];
  onDrop: [event: DragEvent, targetColumnId: number];
}>();

const editColumnName = ref<boolean>(false);

const task = reactive({
  title: "",
  priority: "Low",
  complated: false,
  columnId: props.data.id,
});
const formActive = ref<boolean>(false);

const changeColumnName = (input: HTMLInputElement): void => {
  emit("editColumn", props.data.id, input.value);
  editColumnName.value = false;
  input.blur();
};

const createTask = (): void => {
  emit("createTask", props.data.id, {
    ...task,
    id: Math.floor(Math.random() * 1000),
  } as Task);

  clearForm();
};

const clearForm = (): void => {
  task.title = "";
  task.priority = "Low";
  formActive.value = false;
};
</script>

<template>
  <div
    class="w-72 flex flex-col items-start gap-3"
    @dragover="(e:Event) => e.preventDefault()"
    @drop="emit('onDrop', $event, data.id)"
  >
    <!-- Header -->
    <div class="w-full flex items-center justify-between gap-3">
      <input
        class="p-1 text-lg font-bold grow outline-none focus:border rounded-sm"
        :value="data.name"
        :readonly="!editColumnName"
        @click="editColumnName = true"
        @keyup.enter="changeColumnName($event.target as HTMLInputElement)"
      />

      <UButton
        icon="i-lucide-trash"
        color="error"
        variant="ghost"
        @click="emit('deleteColumn', data.id)"
      />
    </div>

    <!-- Tasks -->
    <div class="w-full flex flex-col gap-2">
      <div
        v-for="task in data.tasks"
        :key="task.id"
        class="p-3 w-full bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent hover:border-primary-500 group"
        draggable="true"
        @dragstart="emit('onDragStart', $event, task.id, task.columnId)"
      >
        <div class="w-full flex items-center justify-start">
          <div
            class="w-0 overflow-hidden transition-all group-hover:w-[25px]"
            :class="{ 'w-[25px]': task.complated }"
          >
            <UCheckbox v-model="task.complated" />
          </div>

          <span class="font-medium">{{ task.title }}</span>
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
      </div>

      <!-- Create task -->
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
          <span class="text-sm font-medium">Create task</span>
        </div>

        <form v-else class="p-3" @submit.prevent="createTask">
          <UFormField label="Title">
            <UTextarea
              class="w-full"
              placeholder="Task title"
              v-model="task.title"
              required
            />
          </UFormField>

          <URadioGroup
            class="mt-2"
            orientation="horizontal"
            legend="Priority"
            :default-value="task.priority"
            :items="['Low', 'Medium', 'High']"
            @update:model-value="task.priority = $event"
          />

          <div class="mt-3 w-full grid grid-cols-2 gap-2">
            <UButton
              class="w-full justify-center"
              variant="ghost"
              @click="clearForm"
            >
              Cancel
            </UButton>

            <UButton class="w-full justify-center" type="submit">
              Create
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
