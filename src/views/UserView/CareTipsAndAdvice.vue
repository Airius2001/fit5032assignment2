<template>
    <div class="container mt-5">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Health Care Tips and Advice</h1>
        <p class="health-tips">
          It's important to maintain a healthy lifestyle, especially as we age.
          Here are some tips:
          - Stay active with regular exercise.
          - Eat a balanced diet rich in fruits and vegetables.
          - Stay hydrated by drinking enough water.
          - Ensure regular check-ups with your healthcare provider.
        </p>
  
        <!-- Rating Section -->
        <div v-if="isAuthenticated">
          <h2 class="text-center">Rate Your Experience</h2>
          <p class="text-center">Please select your rating for the care services provided.</p>
  
          <!-- Rating Options (1 to 5) -->
          <div class="rating-options text-center">
            <label v-for="n in 5" :key="n" class="rating-label">
              <input
                type="radio"
                :value="n"
                v-model="rating"
              /> {{ n }}
            </label>
          </div>
  
          <button @click="submitRating" class="btn btn-primary mt-3">
            Submit Rating
          </button>
        </div>
        <div v-else>
          <p class="text-center text-warning">Please login to rate the tips.</p>
          <router-link to="/login" class="btn btn-secondary mt-3">Login</router-link>
        </div>
  
        <!-- Average Rating Display -->
        <h3 class="text-center mt-4">Average Rating: {{ averageRating }}</h3>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const rating = ref(0);
  const ratings = ref([]); // This array will store all ratings
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
  const router = useRouter();
  const tipId = 1; // Unique identifier for this specific tip
  
  // Retrieve the username (or user ID) from localStorage for unique user data
  const username = localStorage.getItem('username') || 'guest'; // Replace 'guest' with your logic
  
  const submitRating = () => {
    if (isAuthenticated.value) {
      // Add rating to ratings array
      ratings.value.push(rating.value);
  
      // Store ratings per user
      const userRatings = JSON.parse(localStorage.getItem(`${username}_ratings`)) || [];
      userRatings.push(rating.value);
      localStorage.setItem(`${username}_ratings`, JSON.stringify(userRatings));
  
      alert('Rating submitted successfully!');
    } else {
      alert('You need to login to submit a rating.');
      router.push('/login');
    }
  };
  
  const averageRating = computed(() => {
    const total = ratings.value.reduce((sum, r) => sum + r, 0);
    return ratings.value.length > 0 ? (total / ratings.value.length).toFixed(1) : 'No ratings yet';
  });
  
  onMounted(() => {
    // Load stored ratings per user
    const storedRatings = JSON.parse(localStorage.getItem(`${username}_ratings`)) || [];
    ratings.value = storedRatings;
  });
  </script>
  
  <style>
  .health-tips {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .text-warning {
    color: #ffcc00;
  }
  
  .rating-options {
    margin-bottom: 20px;
  }
  
  .rating-label {
    margin: 0 10px;
    font-size: 18px;
  }
  </style>
  