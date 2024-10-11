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

        <!-- Show login/register links if not authenticated -->
        <li v-if="!isLoggedIn" class="nav-item">
          <router-link to="Firelogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>

        <li class="nav-item">
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

        <li class="nav-item">
          <router-link to="Map" class="nav-link" active-class="active">Map</router-link>
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
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();  
      console.log('User Data:', userData); 
      
      
      if (userData.isAdmin) {
        console.log('User is Admin'); 
        isAdmin.value = true;
      } else {
        console.log('User is not Admin');
        isAdmin.value = false;
      }
    } else {
      isAdmin.value = false;
    }
  } else {
    isAuthenticated.value = false;
    isAdmin.value = false;
  }
};

onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
</style>
