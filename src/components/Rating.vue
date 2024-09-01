<template>
    <div>
      <span v-for="star in stars" :key="star" @click="rate(star)">
        <i :class="star <= currentRating ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const stars = ref([1, 2, 3, 4, 5]);
  const currentRating = ref(0);
  
  const rate = (star) => {
    currentRating.value = star;
  };
  </script>
  
  <style>
  .fas.fa-star, .far.fa-star {
    cursor: pointer;
    color: #f39c12;
    font-size: 24px;
  }
  </style>
  