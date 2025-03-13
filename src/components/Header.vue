<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/index.store";
import { useColorMode } from "@vueuse/core";

const mode = useColorMode();
const store = useStore();

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
  <header class="w-full flex items-center justify-between p-5">
    <div class="text-xl font-bold">Canban board</div>

    <UButton
      class="ml-auto"
      :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      @click="mode = mode === 'dark' ? 'light' : 'dark'"
    />

    <UDropdownMenu
      v-if="store.user"
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
      <div>
        <div class="flex items-center gap-3 cursor-pointer">
          <div class="flex flex-col text-right">
            <div class="text-sm font-medium">
              {{ store.user?.firstName }} {{ store.user?.lastName }}
            </div>
            <div class="text-sm">{{ store.user?.username }}</div>
          </div>
          <UAvatar size="lg" :src="store.user?.image" />
        </div>
      </div>
    </UDropdownMenu>
  </header>
</template>
