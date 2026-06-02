<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const router = useRouter();
const post = ref({
  title: "",
  content: "",
});
const loading = ref(false);
const notyf = new Notyf({ duration: 5000, position: { x: "right", y: "top" } });

const createPost = async () => {
  loading.value = true;

  try {
    await api.post("/posts", post.value);
    notyf.success("Post created successfully!");
    router.push({ name: "Posts" });
  } catch (err) {
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Failed to create post.";

    notyf.error(errorMessage);
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h1>Create New Post</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="createPost">
          <div class="mb-3">
            <label for="title" class="form-label">Post Title</label>
            <input
              type="text"
              id="title"
              class="form-control"
              v-model="post.title"
              required
            />
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">Content</label>
            <textarea
              id="content"
              class="form-control"
              v-model="post.content"
              rows="6"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? "Creating..." : "Create Post" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}

.card {
  box-shadow: 0 10px 24px rgba(61, 44, 46, 0.08);
}

.alert {
  margin-bottom: 1rem;
}
</style>
