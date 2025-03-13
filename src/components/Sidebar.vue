<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/user.store";
import { useTodosStore } from "@/stores/todos.store";
import { useColorMode } from "@vueuse/core";

const router = useRouter();
const mode = useColorMode();
const store = useStore();
const todosStore = useTodosStore();

const showBoardModal = ref<boolean>(false);
const boardName = ref<string>("");

const items = ref([
  {
    label: "Profile",
    icon: "i-lucide-user",
  },
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    onSelect: () => store.logout(),
  },
]);
</script>

<template>
  <teleport to="body">
    <UModal v-model:open="showBoardModal" class="max-w-md">
      <template #content>
        <form
          class="p-5 space-y-4"
          @submit.prevent="
            () => {
              todosStore.createBoard(boardName);
              showBoardModal = false;
              boardName = '';
            }
          "
        >
          <div class="text-xl font-bold">Create board</div>

          <UFormField label="Title" name="title">
            <UInput v-model="boardName" class="w-full" required />
          </UFormField>

          <UButton class="w-full justify-center" type="submit">
            Create
          </UButton>
        </form>
      </template>
    </UModal>
  </teleport>

  <aside
    class="p-4 min-w-64 w-64 h-screen bg-slate-200 dark:bg-slate-800 flex flex-col items-start gap-4"
  >
    <div class="w-full flex items-center justify-between gap-2">
      <div class="text-xl font-bold">Canban board</div>

      <UButton
        class="ml-auto"
        :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        @click="mode = mode === 'dark' ? 'light' : 'dark'"
      />
    </div>

    <!-- boards -->
    <ul class="w-full flex flex-col gap-2">
      <li
        class="py-2 px-3 w-full bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
        v-for="board in todosStore.boards"
        :key="board.id"
        @click="router.push({ path: '/', query: { board: board.id } })"
      >
        {{ board.title }}
      </li>
      <li
        class="py-2 px-3 w-full text-center border-[2px] border-dashed border-slate-100 dark:border-slate-700 rounded-lg cursor-pointer"
        @click="showBoardModal = true"
      >
        + New board
      </li>
    </ul>

    <UDropdownMenu
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8,
      }"
      :ui="{
        content: 'w-48',
      }"
    >
      <div class="mt-auto">
        <div class="flex items-center gap-3 cursor-pointer">
          <UAvatar size="lg" :src="store.user?.image" />
          <div class="flex flex-col">
            <div class="text-base font-medium">
              {{ store.user?.firstName }} {{ store.user?.lastName }}
            </div>
            <div class="text-sm">
              {{ store.user?.username }}
            </div>
          </div>
        </div>
      </div>
    </UDropdownMenu>
  </aside>
</template>
