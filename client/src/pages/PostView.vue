<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useGlobalStore } from "../global";

const route = useRoute();
const post = ref(null);
const router = useRouter();
const loading = ref(false);
const { user } = useGlobalStore();
const notyf = new Notyf({ duration: 5000, position: { x: "right", y: "top" } });

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await api.get(`/posts/${id}`);

    post.value = response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch post details.";

    notyf.error(errorMessage);
    console.error("Failed to fetch post details:", error);
  }
});

const isAuthor = computed(() => post.value?.author?._id === user.id);
const canDelete = computed(() => isAuthor.value || user.isAdmin);

const deletePost = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await api.delete(`/posts/${post.value._id}`);
    notyf.success("Post deleted successfully.");
    router.push({ name: "Posts" });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to delete post.";

    notyf.error(errorMessage);
    console.error("Failed to delete post:", error);
  }
};
</script>

<template>
  <div class="container mt-5 mb-5 pb-5">
    <div v-if="post" class="row justify-content-center">
      <div class="col-lg-8">
        <article class="blog-article">
          <header class="mb-5 text-center border-bottom border-secondary pb-4">
            <h1 class="fw-bolder display-5 mb-3">{{ post.title }}</h1>
            <div class="text-muted fs-6" v-if="post.author">
              <span class="text-primary fw-semibold">{{
                post.author.username
              }}</span>
              <span class="mx-2">&bull;</span>
              <span>{{
                new Date(post.creationDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}</span>
            </div>
          </header>
          <div
            class="article-content fs-5"
            style="line-height: 1.8; white-space: pre-wrap"
          >
            {{ post.content }}
          </div>
          <div
            class="mt-5 pt-4 border-top border-secondary d-flex justify-content-between align-items-center"
            v-if="user.email && (isAuthor || user.isAdmin)"
          >
            <span class="text-muted small fw-semibold">Manage Post</span>
            <div>
              <router-link
                v-if="isAuthor"
                :to="{ name: 'UpdatePost', params: { id: post._id } }"
                class="btn btn-outline-warning me-2 btn-sm px-3"
              >
                Edit
              </router-link>
              <button
                v-if="canDelete"
                @click="deletePost"
                class="btn btn-outline-danger btn-sm px-3"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div v-else class="text-center mt-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading post...</p>
    </div>
  </div>
</template>
