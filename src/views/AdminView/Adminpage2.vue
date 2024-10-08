<template>
    <div>
        <h1>Admin Page</h1>
        <table class="table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Is Admin</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.uid">
                    <td>{{ user.email }}</td>
                    <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();
const users = ref([]);

const fetchUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        users.value = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
};

// use onMounted to get user data
onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
}
.table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
}
.table th {
    background-color: #f2f2f2;
}
</style>
