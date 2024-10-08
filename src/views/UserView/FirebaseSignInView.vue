<template>
    <h1>Sign In</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="signin">Sign in</button></p>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore" 
import { useRouter } from "vue-router";

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const signin = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (data) => {
        console.log("Login successful")
        
        // get current user id
        const userId = auth.currentUser.uid
        
        // get Firestore user data
        const userDoc = await getDoc(doc(db, "users", userId)) 
        
        if (userDoc.exists()) {
            const userData = userDoc.data()
            
            // check admin
            if (userData.isAdmin) {
                router.push("/adminpage") 
            } else {
                router.push("/")
            }
        } else {
            console.log("No such user document!")
        }
    })
    .catch((error) => {
        console.log(error.code)
    })
}
</script>
