<script setup>
import { onBeforeMount } from "vue";
import AppNavBar from "./components/AppNavBar.vue";
import { useGlobalStore } from "./global.js";

const { user, getUserDetails } = useGlobalStore();

onBeforeMount(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const userData = localStorage.getItem("user");

    if (userData) {
      Object.assign(user, JSON.parse(userData));
    }
    getUserDetails(token);
  }
});
</script>

<template>
  <AppNavBar />
  <div class="container">
    <router-view />
  </div>
</template>
