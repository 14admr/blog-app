<script setup>
import "../assets/home.css";
</script>

<template>
  <section class="home-hero">
    <div class="home-hero__content text-center">
      <h1 class="display-3 fw-bold mb-3">Welcome to the Blog</h1>
      <p class="lead mt-3 text-muted mb-5">
        Share your thoughts, read amazing stories, and connect with the
        community.
      </p>
      <router-link
        :to="{ name: 'Posts' }"
        class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
      >
        Start Reading
      </router-link>
    </div>
  </section>
</template>
