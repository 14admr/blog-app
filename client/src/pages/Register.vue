<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import api from "../api";

const router = useRouter();
const notyf = new Notyf();
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPass = ref("");
const isSubmitting = ref(false);

const isEnabled = computed(() => {
  const requiredFields = [
    username.value,
    email.value,
    password.value,
    confirmPass.value,
  ];

  return (
    requiredFields.every((input) => input.trim() !== "") &&
    password.value.length >= 8 &&
    password.value === confirmPass.value
  );
});

async function handleSubmit() {
  if (!isEnabled.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await api.post("/users/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    if (response.status === 201) {
      notyf.success(response.data.message || "Registration successful.");

      username.value = "";
      email.value = "";
      password.value = "";
      confirmPass.value = "";

      router.push({ name: "Login" });
    } else {
      notyf.error("Registration Failed. Please contact administrator.");
    }
  } catch (error) {
    console.error(error);
    notyf.error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration Failed. Please contact administrator.",
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form
    class="mx-auto py-5"
    style="max-width: 640px"
    @submit.prevent="handleSubmit"
  >
    <h1 class="mb-4 text-center">Register</h1>
    <div class="mb-3">
      <label for="registerUsername" class="form-label">Username</label>
      <input
        type="text"
        id="registerUsername"
        class="form-control"
        placeholder="Enter Username"
        v-model="username"
      />
    </div>
    <div class="mb-3">
      <label for="registerEmail" class="form-label">Email</label>
      <input
        type="email"
        id="registerEmail"
        class="form-control"
        placeholder="Enter Email"
        v-model="email"
      />
    </div>
    <div class="mb-3">
      <label for="registerPassword" class="form-label">Password</label>
      <input
        type="password"
        id="registerPassword"
        class="form-control"
        placeholder="Enter Password"
        v-model="password"
      />
    </div>
    <div class="mb-3">
      <label for="registerConfirmPassword" class="form-label"
        >Confirm Password</label
      >
      <input
        type="password"
        id="registerConfirmPassword"
        class="form-control"
        placeholder="Confirm Password"
        v-model="confirmPass"
      />
    </div>
    <button
      type="submit"
      class="btn btn-primary w-100"
      :disabled="!isEnabled || isSubmitting"
    >
      {{ isSubmitting ? "Registering..." : "Register" }}
    </button>
  </form>
</template>
