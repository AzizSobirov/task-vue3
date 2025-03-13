<script lang="ts" setup>
import { ref } from "vue";
import TheColumn from "@/components/Column.vue";
import { useTodosStore } from "@/stores/todos.store";
import type { Board } from "@/types";

const props = defineProps<{ data: Board | null }>();

const store = useTodosStore();

const columnName = ref<string>("");
const formActive = ref<boolean>(false);
</script>

<template>
  <div v-if="data" class="w-full flex items-start justify-start gap-5">
    <TheColumn v-for="column in data.columns" :key="column.id" :data="column" />

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
        <span class="text-sm font-medium">Add another list</span>
      </div>

      <form
        v-else
        class="p-3"
        @submit.prevent="
          () => {
            store.createColumn(columnName);
            formActive = false;
            columnName = '';
          }
        "
      >
        <UInput
          class="w-full"
          placeholder="List name"
          v-model="columnName"
          required
        />

        <div class="mt-3 w-full grid grid-cols-2 gap-2">
          <UButton
            label="Cancel"
            class="w-full justify-center"
            variant="ghost"
            @click="
              () => {
                formActive = false;
                columnName = '';
              }
            "
          />
          <UButton
            class="w-full justify-center"
            type="submit"
            label="Add list"
          />
        </div>
      </form>
    </div>
  </div>

  <div v-else class="w-full h-full flex items-center justify-center">
    <div class="text-2xl font-bold">No board selected</div>
  </div>
</template>
