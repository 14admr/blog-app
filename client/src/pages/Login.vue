<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import { useGlobalStore } from "../global";
import api from "../api";

const notyf = new Notyf();
const router = useRouter();
const { getUserDetails } = useGlobalStore();
const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const isEnabled = computed(
  () => email.value.trim() !== "" && password.value.trim() !== "",
);

async function handleSubmit() {
  if (!isEnabled.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (response.data.access) {
      notyf.success("Login Successful");
      localStorage.setItem("token", response.data.access);
      await getUserDetails(response.data.access);

      email.value = "";
      password.value = "";

      router.push({ name: "Home" });
    }
  } catch (error) {
    if ([400, 401, 404].includes(error.response?.status)) {
      notyf.error(error.response.data.error || error.response.data.message);
    } else {
      console.error(error);
      notyf.error("Login Failed. Please contact administrator.");
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form
    class="mx-auto py-5"
    style="max-width: 520px"
    @submit.prevent="handleSubmit"
  >
    <h1 class="mb-4 text-center">Login</h1>
    <div class="mb-3">
      <label for="userEmail" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="userEmail"
        placeholder="Enter email"
        v-model="email"
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <button
      type="submit"
      class="btn btn-primary w-100"
      :disabled="!isEnabled || isSubmitting"
    >
      {{ isSubmitting ? "Logging in..." : "Login" }}
    </button>
  </form>
</template>
