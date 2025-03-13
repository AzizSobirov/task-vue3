<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/index.store";

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
  <UDropdownMenu
    class="absolute top-4 right-4"
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
</template>
