<template>
    <div>
        <h1>Admin Page</h1>
        <button @click="logout" class="btn btn-danger">Logout</button>
        
        <!-- Search box -->
        <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by email" 
            class="form-control mb-3" 
        />

        <table class="table">
            <thead>
                <tr>
                    <th @click="sort('email')" style="cursor: pointer;">
                        Email 
                        <span v-if="sortKey === 'email' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'email' && sortOrder === 'desc'">↓</span>
                    </th>
                    <th @click="sort('isAdmin')" style="cursor: pointer;">
                        Is Admin 
                        <span v-if="sortKey === 'isAdmin' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'isAdmin' && sortOrder === 'desc'">↓</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.uid">
                    <td>{{ user.email }}</td>
                    <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" @click="changePage(currentPage - 1)">Previous</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                    <a class="page-link" @click="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" @click="changePage(currentPage + 1)">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const db = getFirestore();
const auth = getAuth();
const router = useRouter();
const users = ref([]);
const searchQuery = ref('');
const sortKey = ref('email');
const sortOrder = ref('asc');
const currentPage = ref(1);
const itemsPerPage = 10;

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

// Computed property for filtered and sorted users
const filteredUsers = computed(() => {
    return users.value.filter(user => 
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).sort((a, b) => {
        const modifier = sortOrder.value === 'asc' ? 1 : -1;
        if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
        if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
        return 0;
    });
});

// Computed property for pagination
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredUsers.value.slice(start, start + itemsPerPage);
});

// Total number of pages
const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

// Change page function
const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
};

const sort = (key) => {
    sortKey.value = key;
    sortOrder.value = (sortOrder.value === 'asc') ? 'desc' : 'asc';
};

const logout = async () => {
    try {
        await signOut(auth);
        console.log("Logged out successfully");
        router.push("/FireLogin"); // Redirect to login page after logout
    } catch (error) {
        console.error("Error logging out: ", error);
    }
};

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
.btn {
    margin-bottom: 15px;
}
.pagination {
    justify-content: center;
    margin-top: 15px;
}
</style>
