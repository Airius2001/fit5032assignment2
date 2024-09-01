<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About Us
          </router-link>
        </li>
        
        <!-- Dropdown Menu for User Account -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="userAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            User Account
          </a>
          <ul class="dropdown-menu" aria-labelledby="userAccountDropdown">
            <li>
              <router-link to="/login" class="dropdown-item">Login</router-link>
            </li>
            <li>
              <router-link to="/register" class="dropdown-item">Register</router-link>
            </li>
            <li>
              <router-link to="/personal-info" class="dropdown-item">Personal Information</router-link>
            </li>
          </ul>
        </li>

        <li class="nav-item">
          <router-link to="/care-tips-and-advice" class="nav-link" active-class="active">
            Care Tips and Advice
          </router-link>
        </li>

        <!-- Admin Page link, visible only for admin users -->
        <li v-if="isAdmin" class="nav-item">
          <router-link to="/admin" class="nav-link" active-class="active">
            Admin Page
          </router-link>
        </li>

      </ul>
    </header>
  </div>
</template>

<script>
export default {
  name: 'BHeader',
  data() {
    return {
      isAdmin: false // Default value
    };
  },
  created() {
  const submittedCards = JSON.parse(localStorage.getItem('submittedCards')) || [];
  const currentUsername = localStorage.getItem('currentUsername');

  if (currentUsername) {
    const currentUser = submittedCards.find(user => user.username === currentUsername);
    // Check if the currentUser exists and if their role is 'admin'
    this.isAdmin = currentUser && currentUser.role === 'admin'; 
    console.log('Is Admin:', this.isAdmin); // Debugging
  } else {
    this.isAdmin = false;
  }
}
}
</script>


<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1), inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
