<script setup>
import { useGlobalStore } from "../global";

const { user } = useGlobalStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary py-3 shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold fs-4" :to="{ name: 'Home' }"
        >BlogSpot</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto">
          <router-link :to="{ name: 'Home' }" class="nav-link"
            >Home</router-link
          >
          <router-link :to="{ name: 'Posts' }" class="nav-link"
            >Posts</router-link
          >
          <router-link
            :to="{ name: 'AddPost' }"
            class="nav-link"
            v-if="user.email"
            >Add Post</router-link
          >
          <router-link
            :to="{ name: 'Login' }"
            class="nav-link"
            v-if="!user.email"
            >Login</router-link
          >
          <router-link
            :to="{ name: 'Register' }"
            class="nav-link"
            v-if="!user.email"
            >Register</router-link
          >
          <router-link :to="{ name: 'Logout' }" class="nav-link" v-else
            >Logout</router-link
          >
        </ul>
      </div>
    </div>
  </nav>
</template>
