import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "@/stores/user.store";
import HomeView from "../views/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { requiresAuth: true },
      component: HomeView,
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/auth.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const user = await store.getUser();

  if (to.meta.requiresAuth && !user) {
    next({ name: "auth" });
  } else {
    next();
  }
});

export default router;
