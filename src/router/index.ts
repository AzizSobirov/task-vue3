import { createRouter, createWebHistory } from "vue-router";
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next({ name: "auth" });
  } else {
    next();
  }
});

export default router;
