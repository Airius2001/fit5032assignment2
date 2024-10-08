<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="register">Go register</button></p>
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
            // write it in Firestore
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
