<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api.js";
import PostCard from "../components/PostCard.vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const posts = ref([]);
const notyf = new Notyf({ duration: 5000, position: { x: "right", y: "top" } });

const postList = computed(() =>
  posts.value.filter(
    (post) => post && typeof post === "object" && post._id && post.title,
  ),
);

onMounted(async () => {
  try {
    const response = await api.get("/posts");
    posts.value = response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch posts.";

    notyf.error(errorMessage);
    console.error("Failed to fetch posts:", err);
  }
});
</script>

<template>
  <div>
    <div class="container mt-5">
      <h1 class="text-center mb-5 fw-bold">Latest Articles</h1>
      <div class="row justify-content-center">
        <template v-if="postList.length > 0">
          <div v-for="post in postList" :key="post._id" class="col-lg-8 mb-4">
            <PostCard :post="post" />
          </div>
        </template>
        <div v-else class="col-12">
          <p class="text-center text-muted fs-5">
            No posts available at the moment. Be the first to write one!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
