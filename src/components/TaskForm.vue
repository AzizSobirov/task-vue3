<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = withDefaults(defineProps<{ mode?: string }>(), {
  mode: "add",
});

const task = defineModel("modelValue", { type: Object, required: true });
const open = defineModel("open", { type: Boolean, required: true });

const emit = defineEmits(["submit"]);
</script>

<template>
  <form class="p-3" @submit.prevent="emit('submit')">
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
        label="Cancel"
        variant="ghost"
        @click="open = false"
      />
      <UButton
        class="w-full justify-center"
        type="submit"
        :label="mode === 'add' ? 'Add task' : 'Save'"
      />
    </div>
  </form>
</template>
