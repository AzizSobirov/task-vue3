<script setup lang="ts">
import { reactive } from "vue";
import * as v from "valibot";
import { useStore } from "@/stores/user.store";
import type { FormSubmitEvent } from "@nuxt/ui";

const store = useStore();

const schema = v.object({
  username: v.pipe(v.string(), v.minLength(2, "Invalid username")),
  password: v.pipe(v.string(), v.minLength(8, "Must be at least 8 characters")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  username: "",
  password: "",
});

const tabs = [
  {
    label: "Login",
    slot: "login",
  },
  {
    label: "Register",
    slot: "register",
  },
];

async function handleLogin(event: FormSubmitEvent<Schema>): Promise<void> {
  await store.login(event.data);
}

async function handleRegister(event: FormSubmitEvent<Schema>): Promise<void> {
  await store.register(event.data);
}
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center">
    <div class="container flex items-center justify-center">
      <UTabs :items="tabs" class="w-full max-w-96">
        <template #login="{ item }">
          <div class="mt-2 text-xl font-bold">{{ item.label }}</div>

          <UForm
            class="mt-3 w-full space-y-4"
            :schema="v.safeParser(schema)"
            :state="state"
            @submit="handleLogin"
          >
            <UFormField label="Username" name="username">
              <UInput class="w-full" v-model="state.username" />
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput class="w-full" v-model="state.password" type="password" />
            </UFormField>

            <UButton class="w-full justify-center" size="lg" type="submit">
              Login
            </UButton>
          </UForm>
        </template>

        <template #register="{ item }">
          <div class="mt-2 text-xl font-bold">{{ item.label }}</div>

          <UForm
            class="mt-3 w-full space-y-4"
            :schema="v.safeParser(schema)"
            :state="state"
            @submit="handleRegister"
          >
            <UFormField label="Username" name="username">
              <UInput class="w-full" v-model="state.username" />
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput class="w-full" v-model="state.password" type="password" />
            </UFormField>

            <UButton class="w-full justify-center" size="lg" type="submit">
              Login
            </UButton>
          </UForm>
        </template>
      </UTabs>
    </div>
  </div>
</template>
