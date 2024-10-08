<template>
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <h1 class="text-center">About Our Charity</h1>
      <p class="text-center">This is about our charity</p>
      <!-- Display the greeting if the user is authenticated -->
      <p v-if="username" class="text-center">Hello, {{ username }}!</p>
      <!-- Show the Logout button only if the user is authenticated -->
      <button v-if="isAuthenticated" @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

// Create refs to store the username and authentication status
const username = ref('');
const isAuthenticated = ref(false); // Track if user is authenticated
const router = useRouter();

// Get the current authenticated user
const auth = getAuth();
const db = getFirestore();

const fetchUserInfo = async () => {
  const user = auth.currentUser; // Get the currently logged-in user
  if (user) {
    isAuthenticated.value = true; // User is authenticated
    const userDoc = doc(db, 'users', user.uid); // Reference to the user's document in Firestore
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      username.value = userData.email || ''; // display the user's email or name
    } else {
      console.log('No such document!');
    }
  } else {
    console.log('No user is signed in.');
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully");
    isAuthenticated.value = false; // Update authentication status
    router.push("/FireLogin"); // Redirect to login page after logout
  } catch (error) {
    console.error("Error logging out: ", error);
  }
};

// On component mount, fetch the user information from Firestore
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* Your existing styles */
</style>
