<script lang="ts" setup>
import { ref, reactive } from "vue";
import TheColumn from "@/components/Column.vue";
import type { Column } from "@/types";

const columns = ref<Column[]>([
  {
    id: 1,
    name: "To-Do",
    tasks: [
      {
        id: 1,
        title: "task 1",
        priority: "Low",
        columnId: 1,
        complated: false,
      },
      {
        id: 2,
        title: "task 2",
        priority: "Medium",
        columnId: 1,
        complated: true,
      },
    ],
  },
  {
    id: 2,
    name: "Pending",
    tasks: [
      {
        id: 3,
        title: "task 3",
        priority: "Low",
        columnId: 1,
        complated: false,
      },
    ],
  },
]);

const columnName = ref<string>("");
const formActive = ref<boolean>(false);

const createColumn = (): void => {
  columns.value.push({
    id: Math.floor(Math.random() * 1000),
    name: columnName.value,
    tasks: [],
  });

  columnName.value = "";
  formActive.value = false;
};

const editColumn = (id: number, name: string) => {
  const column = columns.value.find((column) => column.id === id);
  if (column) {
    column.name = name;
  }
};

const deleteColumn = (id: number) => {
  columns.value = columns.value.filter((column) => column.id !== id);
};

const createTask = (columnId: number, data: any) => {
  columns.value.find((column) => column.id === columnId)?.tasks.push(data);
};

let draggedTaskId: number | null = null;
let taskColumnId: number | null = null;

const onDragStart = (event: DragEvent, taskId: number, columnId: number) => {
  draggedTaskId = taskId;
  taskColumnId = columnId;

  event.dataTransfer?.setData("taskId", taskId.toString());
};

const onDrop = (event: DragEvent, targetColumnId: number) => {
  event.preventDefault();

  if (!draggedTaskId) return;

  const column = columns.value.find((column) => column.id === taskColumnId);
  const task = column?.tasks.find((task) => task.id === draggedTaskId);
  const taskColumn = columns.value.find(
    (column) => column.id === task?.columnId
  );

  if (targetColumnId == taskColumn?.id) return;

  if (column && task && taskColumn) {
    const targetColumn = columns.value.find(
      (column) => column.id === targetColumnId
    );

    targetColumn?.tasks.push({
      ...task,
      columnId: targetColumnId,
    });

    taskColumn.tasks = taskColumn.tasks.filter(
      (task) => task.id !== draggedTaskId
    );

    draggedTaskId = null;
    taskColumnId = null;
  }
};
</script>

<template>
  <div class="w-full flex items-start justify-start gap-5">
    <TheColumn
      v-for="column in columns"
      :key="column.id"
      :data="column"
      @editColumn="editColumn"
      @deleteColumn="deleteColumn"
      @createTask="createTask"
      @onDragStart="onDragStart"
      @onDrop="onDrop($event, column.id)"
    />

    <!--Create Column  -->
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
        <span class="text-sm font-medium">Create column</span>
      </div>

      <form v-else class="p-3" @submit.prevent="createColumn">
        <UInput
          class="w-full"
          placeholder="Column name"
          v-model="columnName"
          required
        />

        <div class="mt-3 w-full grid grid-cols-2 gap-2">
          <UButton
            class="w-full justify-center"
            variant="ghost"
            @click="
              () => {
                formActive = false;
                columnName = '';
              }
            "
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
</template>
