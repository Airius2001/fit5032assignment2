import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import Loginpage from '../views/Loginpage.vue'
import Adminpage from '../views/Adminpage.vue'
import AccessDeniedPage from '../views/AccessDeniedPage.vue'
import Registerpage from '../views/Registerpage.vue'
import Aboutpage from '../views/Aboutpage.vue'



const routes = [
    {
      path: '/',
      name: 'Home',
      component: Homepage,
    },
    {
      path: '/about',
      name: 'About',
      component: Aboutpage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Loginpage,
    },
    {
      path: '/access-denied',
      name: 'AccessDenied',
      component: AccessDeniedPage,
    },
    {
        path: '/register',
        name: 'register',
        component: Registerpage,
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Adminpage,
        meta: { requiresAuth: true, requiredRole: 'admin' }
      }
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole'); 
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next('/access-denied'); 
      } else if (to.matched.some(record => record.meta.requiredRole) && to.meta.requiredRole !== userRole) {
        next('/access-denied'); 
      } else {
        next();
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (isAuthenticated) {
        next('/'); 
      } else {
        next();
      }
    } else {
      next();
    }
  });
  export default router;
  