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

        <div v-if="filteredUsers.length === 0" class="alert alert-warning">
            No users found.
        </div>
        
        <table class="table table-striped table-responsive">
            <thead>
                <tr>
                    <th @click="sort('email')" style="cursor: pointer;">
                        Email 
                        <span v-if="sortKey === 'email' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'email' && sortOrder === 'desc'">↓</span>
                    </th>
                    <th @click="sort('gender')" style="cursor: pointer;">
                        Gender 
                        <span v-if="sortKey === 'gender' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'gender' && sortOrder === 'desc'">↓</span>
                    </th>
                    <th @click="sort('age')" style="cursor: pointer;">
                        Age 
                        <span v-if="sortKey === 'age' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'age' && sortOrder === 'desc'">↓</span>
                    </th>
                    <th @click="sort('isAdmin')" style="cursor: pointer;">
                        Is Admin 
                        <span v-if="sortKey === 'isAdmin' && sortOrder === 'asc'">↑</span>
                        <span v-if="sortKey === 'isAdmin' && sortOrder === 'desc'">↓</span>
                    </th>
                    <th>Select to send email</th>
                    <th>Action</th> 
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.uid" @mouseover="highlightRow(user)" :class="{ 'table-primary': highlightedUser === user.uid }">
                    <td>{{ user.email }}</td>
                    <td>{{ user.gender }}</td>
                    <td>{{ calculateAge(user.dateOfBirth) }}</td>
                    <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
                    <td>
                        <input 
                            type="checkbox" 
                            :checked="selectedUsers.includes(user.email)" 
                            @change="toggleSelection(user.email)" 
                        />
                    </td>
                    <td>
                        <button @click="deleteUser(user.uid)" class="btn btn-danger btn-sm">Delete</button> 
                    </td>
                </tr>
            </tbody>
        </table>

        <textarea v-model="emailContent" placeholder="Enter email content" class="form-control mb-3" rows="4"></textarea>
        <button @click="sendBulkEmail" class="btn btn-primary">Send Bulk Email</button>

        <!-- Pagination controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
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
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
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
const highlightedUser = ref(null);

const selectedUsers = ref([]);
const emailContent = ref(''); // Email content state

// Function to calculate age based on date of birth
const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDiff = new Date() - birthDate;
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age in years
};

// Delete user function
const deleteUser = async (uid) => {
    // Find the user to be deleted
    const userToDelete = users.value.find(user => user.uid === uid);
    if (userToDelete && userToDelete.isAdmin) {
        alert("Cannot delete an admin user.");
        return; // Stop further execution if the user is an admin
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
        try {
            await deleteDoc(doc(db, "users", uid));
            alert("User deleted successfully!");
            fetchUsers(); // Refresh user list after deletion
        } catch (error) {
            console.error("Error deleting user: ", error);
            alert("Failed to delete user.");
        }
    }
};

const sendBulkEmail = async () => {
    if (selectedUsers.value.length === 0) {
        alert("Please select at least one user.");
        return;
    }

    const subject = "Your Email Subject"; 
    const message = emailContent.value; // Use the content from the textarea

    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emails: selectedUsers.value,
                subject: subject,
                message: message,
            }),
        });

        if (response.ok) {
            alert("Emails sent successfully!");
            selectedUsers.value = []; // Clear selected users after sending
            emailContent.value = ''; // Clear email content after sending
        } else {
            alert("Failed to send emails.");
        }
    } catch (error) {
        console.error("Error sending email:", error);
        alert("An error occurred while sending emails.");
    }
};

// Multiple selection
const toggleSelection = (email) => {
    if (selectedUsers.value.includes(email)) {
        selectedUsers.value = selectedUsers.value.filter(userEmail => userEmail !== email); 
    } else {
        selectedUsers.value.push(email);
    }
};

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

// Sort function
const sort = (key) => {
    sortKey.value = key;
    sortOrder.value = (sortOrder.value === 'asc') ? 'desc' : 'asc';
};

// Highlight row function
const highlightRow = (user) => {
    highlightedUser.value = user.uid;
};

// Logout function
const logout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        try {
            await signOut(auth);
            console.log("Logged out successfully");
            router.push("/FireLogin"); // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.table-primary {
    background-color: rgba(0, 123, 255, 0.1);
}
</style>
