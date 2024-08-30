<template>
    <div class="container mt-5">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Admin Page</h1>
        <p class="text-center">This is admin page</p>
        <DataTable :value="users" class="p-datatable p-component">
      <Column field="username" header="Username"></Column>
      <Column field="password" header="Password"></Column>
      <Column field="confirmPassword" header="Confirm Password"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="dob" header="Date of Birth"></Column>
    </DataTable>
      </div>

      <div class="text-center mt-4">
        <button @click="logout" class="btn btn-primary">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const users = ref([]);

onMounted(() => {
  const storedCards = JSON.parse(localStorage.getItem('submittedCards')) || [];
  users.value = storedCards;
});

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