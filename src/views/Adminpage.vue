<template>
    <div class="container mt-5">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Admin Page</h1>
        <p class="text-center">This is admin page</p>
      </div>

      <div class="text-center mt-4">
        <button @click="logout" class="btn btn-primary">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();


const logout = () => {
  // Clear authentication status
  localStorage.removeItem('isAuthenticated');

  // Redirect to login page
  router.push('/login');
};


onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    router.push('/login');
  }
});
  </script>
  
  <style>
  </style>