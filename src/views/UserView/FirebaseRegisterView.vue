<template>
    <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">We so excited to see you can join us!</h1>
      </div>
    </div>
    </div>
    <div class="register-container">
      <h1>Create an Account</h1>
      <form @submit.prevent="register">
        <div class="input-group">
          <input type="text" placeholder="Email" v-model="email" required />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Password" v-model="password" required />
        </div>
        <div class="button-group">
          <button type="submit">Go Register</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue"
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
  import { getFirestore, doc, setDoc } from "firebase/firestore"
  import { useRouter } from "vue-router";
  
  const email = ref("")
  const password = ref("")
  const router = useRouter()
  const auth = getAuth()
  const db = getFirestore()
  
  const register = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (data) => {
          console.log("Your registration has been successfully created")
          
          const userId = data.user.uid
  
          try {
              // Write it in Firestore
              await setDoc(doc(db, "users", userId), {
                  email: email.value,
                  isAdmin: false 
              })
              console.log("User data saved to Firestore")
          } catch (error) {
              console.error("Error writing document: ", error)
          }
  
          router.push("/FireLogin")
      })
      .catch((error) => {
          console.log(error.code)
      })
  };
  </script>
  
  <style scoped>
  .register-container {
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
  </style>
  