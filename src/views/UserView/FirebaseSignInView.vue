<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">Welcome to the Health Charity Platform</h1>
        </div>
      </div>
    </div>
    <div class="signin-container">
      <h1>Sign In</h1>
      <form @submit.prevent="signin">
        <div class="input-group">
          <input type="text" placeholder="Email" v-model="email" required />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Password" v-model="password" required />
        </div>
        <div class="button-group">
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
    
    <div v-if="showMessage" class="popup-message">
      <p>Login successful!</p>
      <button @click="closeMessage">Close</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { getFirestore, doc, getDoc } from "firebase/firestore"; 
  import { useRouter } from "vue-router";
  
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const showMessage = ref(false); 
  
  const signin = () => {
      signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (data) => {
          console.log("Login successful");
          showMessage.value = true; 
          
          // get current user id
          const userId = auth.currentUser.uid;
          
          // get Firestore user data
          const userDoc = await getDoc(doc(db, "users", userId)); 
          
          if (userDoc.exists()) {
              const userData = userDoc.data();
              
              // check admin
              if (userData.isAdmin) {
                  router.push("/adminpage"); 
              } else {
                  router.push("/");
              }
          } else {
              console.log("No such user document!");
          }
      })
      .catch((error) => {
          console.log(error.code);
      });
  };
  
  const closeMessage = () => {
      showMessage.value = false;
  };
  </script>
  
  <style scoped>
  .signin-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: #f9f9f9;
  }
  
  h1 {
      text-align: center;
      margin-bottom: 20px;
  }
  
  .input-group {
      margin-bottom: 15px;
  }
  
  input[type="text"],
  input[type="password"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color 0.3s;
  }
  
  input[type="text"]:focus,
  input[type="password"]:focus {
      border-color: #007bff;
      outline: none;
  }
  
  .button-group {
      text-align: center;
  }
  
  button {
      padding: 10px 20px;
      background-color: #007bff;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
  }
  
  button:hover {
      background-color: #0056b3;
  }
  
  
  .popup-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000; 
  }
  
  .popup-message p {
      margin: 0 0 10px;
  }
  
  .popup-message button {
      background-color: #007bff;
      border: none;
      color: white;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
  }
  
  .popup-message button:hover {
      background-color: #0056b3;
  }
  </style>
  