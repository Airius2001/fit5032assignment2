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
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="Firelogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>

        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
        </li>

        <li class="nav-item">
          <router-link to="/care-tips-and-advice" class="nav-link" active-class="active">
            Care Tips and Advice
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="SendEmail" class="nav-link" active-class="active">Send Email</router-link>
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
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const db = getFirestore();

const checkAuthentication = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    isAuthenticated.value = true;
    // Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      isAdmin.value = userData.role === 'admin'; 
    } else {
      isAdmin.value = false;
    }
  } else {
    isAuthenticated.value = false;
    isAdmin.value = false;
  }
};

const handleLogout = async () => {
  const auth = getAuth();
  await auth.signOut();
  isAuthenticated.value = false;
  isAdmin.value = false;
  router.push("/");
};

onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
</style>
