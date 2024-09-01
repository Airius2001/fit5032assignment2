<template>
    <div class="container mt-5">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Personal Information</h1>
        <p class="text-center">This is about yourself</p>
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
  if (confirm('Are you sure you want to logout?')) {
    // Perform logout actions
    localStorage.removeItem('isAuthenticated');
    
    // Show a success message
    alert('Logout successful');
    
    // Redirect to login page after message is displayed
    router.push('/');
  }
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