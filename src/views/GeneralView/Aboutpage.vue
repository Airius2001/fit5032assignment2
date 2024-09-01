<template>
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <h1 class="text-center">About Our Charity</h1>
      <p class="text-center">This is about our charity</p>
      <!-- Display the greeting if the user is authenticated -->
      <p v-if="username" class="text-center">Hello, {{ username }}!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Create a ref to store the username
const username = ref('');

// On component mount, retrieve the username from localStorage
onMounted(() => {
  const storedUsername = localStorage.getItem('currentUsername');
  if (storedUsername) {
    username.value = storedUsername;
  }
});
</script>

<style scoped>
/* Your existing styles */
</style>
