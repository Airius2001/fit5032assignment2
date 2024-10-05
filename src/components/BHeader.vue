<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About Us
          </router-link>
        </li>

        <!-- Dropdown Menu for User Account, visible if authenticated -->
        <li v-if="isAuthenticated" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="userAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User Account
          </a>
          <ul class="dropdown-menu" aria-labelledby="userAccountDropdown">
            <li>
              <router-link to="/personal-info" class="dropdown-item">Personal Information</router-link>
            </li>
            <li>
              <button @click="handleLogout" class="dropdown-item">Logout</button>
            </li>
          </ul>
        </li>

        <!-- Show login/register links if not authenticated -->
        <!-- Assignement 2 Code (Login) -->
        <!-- <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">
            Login
          </router-link>
        </li> -->
        <li class="nav-item">
          <router-link to="Firelogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>

        <!-- Assignement 2 Code (Register) -->
        <!-- <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/register" class="nav-link" active-class="active">
            Register
          </router-link>
        </li> -->

        <li class="nav-item">
          <router-link to="FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/care-tips-and-advice" class="nav-link" active-class="active">
            Care Tips and Advice
          </router-link>
        </li>

        <!-- Admin Page link, visible only for admin users -->
        <li v-if="isAdmin" class="nav-item">
          <router-link to="/admin" class="nav-link" active-class="active">
            Admin Page
          </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';

const isAuthenticated = ref(false);
const isAdmin = ref(false);

const checkAuthentication = () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
  const currentUsername = localStorage.getItem('currentUsername');

  if (currentUsername) {
    const submittedCards = JSON.parse(localStorage.getItem('submittedCards')) || [];
    const currentUser = submittedCards.find(user => user.username === currentUsername);
    isAdmin.value = currentUser && currentUser.role === 'admin'; 
  } else {
    isAdmin.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUsername');
  isAuthenticated.value = false;
  isAdmin.value = false;
  router.push("/")
};

onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
/* Your existing styles */
</style>
