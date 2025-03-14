<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTodosStore } from "@/stores/todos.store";

const route = useRoute();
const todosStore = useTodosStore();

const getData = computed(() => {
  if (route.query.board) {
    const board = todosStore.boards.find(
      (b) => b.id == Number(route.query.board)
    );
    return board || null;
  } else {
    return null;
  }
});

onMounted(() => {
  todosStore.loadData();
});
</script>

<template>
  <div class="w-full flex items-start">
    <Sidebar />
    <main class="p-5 w-full grow overflow-x-auto">
      <Canban :data="getData" />
    </main>
  </div>
</template>
