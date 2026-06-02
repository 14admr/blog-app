<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card h-100 border-0 shadow-sm blog-card">
    <div class="card-body p-4 d-flex flex-column">
      <h3 class="card-title fw-bold mb-3">{{ props.post.title }}</h3>
      <div class="text-muted small mb-3">
        <span v-if="props.post.author" class="me-3 text-primary fw-semibold">
          {{ props.post.author.username }}
        </span>
        <span>
          {{
            new Date(props.post.creationDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }}
        </span>
      </div>
      <p
        class="card-text flex-grow-1 text-muted"
        style="
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        "
      >
        {{ props.post.content }}
      </p>
      <div class="mt-auto pt-3">
        <RouterLink
          :to="{ name: 'PostView', params: { id: props.post._id } }"
          class="text-primary fw-semibold text-decoration-none read-more"
        >
          Read Article &rarr;
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-card {
  transition: transform 0.2s ease-in-out;
  background-color: var(--card-dark);
}

.blog-card:hover {
  transform: translateY(-5px);
}

.read-more:hover {
  text-decoration: underline !important;
}
</style>
