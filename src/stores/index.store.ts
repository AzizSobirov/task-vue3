import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useCookie } from "@/composables/useCookie";
import $axios from "@/libs/axios";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  image: string;
}

export const useStore = defineStore("store", () => {
  const { setCookie, getCookie, deleteCookie } = useCookie();
  const toast = useToast();
  const router = useRouter();

  const user = ref<User | null>(null);

  const login = async (data: {
    username: string;
    password: string;
  }): Promise<void> => {
    try {
      const res = await $axios.post("/auth/login", data);

      if (res) {
        user.value = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          gender: res.data.gender,
          image: res.data.image,
        };

        setCookie("accessToken", res.data.accessToken, 1);
        setCookie("refreshToken", res.data.refreshToken, 7);

        toast.add({
          title: "Success",
          description: "Logged in successfully",
          color: "success",
        });

        router.push("/");
      } else {
        toast.add({
          title: "Error",
          description: "Something went wrong",
          color: "error",
        });
      }
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Something went wrong",
        color: "error",
      });
    }
  };

  const register = async (data: {
    username: string;
    password: string;
  }): Promise<void> => {
    try {
      const res = await $axios.post("/auth/register", data);

      if (res) {
        toast.add({
          title: "Success",
          description: "Registered successfully",
          color: "success",
        });

        router.push("/");
      } else {
        toast.add({
          title: "Error",
          description: "Something went wrong",
          color: "error",
        });
      }
    } catch (error) {
      toast.add({
        title: "Error",
        description: "Something went wrong",
        color: "error",
      });
    }
  };

  const getUser = async (): Promise<boolean> => {
    const accessToken = getCookie("accessToken");

    if (user.value) return true;
    if (accessToken) {
      const res = await $axios.get<User>("/auth/me");
      if (res) {
        user.value = res.data;
      }
    }

    return !!user.value;
  };

  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    router.push("/auth");
    user.value = null;
    toast.add({
      title: "Success",
      description: "Logged out successfully",
      color: "success",
    });
  };

  return { user, login, register, getUser, logout };
});
