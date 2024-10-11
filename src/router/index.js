import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/GeneralView/Homepage.vue'
import Loginpage from '../views/UserView/Loginpage.vue'
import Adminpage from '../views/AdminView/Adminpage.vue'
import AccessDeniedPage from '../views/GeneralView/AccessDeniedPage.vue'
import Registerpage from '../views/UserView/Registerpage.vue'
import Aboutpage from '../views/GeneralView/Aboutpage.vue'
import PersonalInfo from '../views/UserView/PersonalInfo.vue'
import CareTipsAndAdvice from '../views/UserView/CareTipsAndAdvice.vue'
import FirebaseSignInView from '../views/UserView/FirebaseSignInView.vue'
import FirebaseRegisterView from '../views/UserView/FirebaseRegisterView.vue'
import SendEmail from '../views/UserView/SendEmail.vue'
import Adminpage2 from '../views/AdminView/Adminpage2.vue'
import GeoLoc from '../views/GeneralView/GeoLoc.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Homepage,
    },
    {
      path: '/Map',
      name: 'Map',
      component: GeoLoc,
    },
    {
      path: '/adminpage',
      name: 'adminpage',
      component: Adminpage2,
    },
    {
      path: '/SendEmail',
      name: 'SendEmail',
      component: SendEmail,
    },
    {
      path: '/FireLogin',
      name: 'FireLogin',
      component: FirebaseSignInView,
    },
    {
      path: '/FireRegister',
      name: 'FireRegister',
      component: FirebaseRegisterView,
    },
    {
      path: '/about',
      name: 'About',
      component: Aboutpage,
    },
    {
      path: '/personal-info',
      name: 'PersonalInfo',
      component: PersonalInfo,
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
        path: '/care-tips-and-advice',
        name: 'CareTipsAndAdvice',
        component: CareTipsAndAdvice,
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Adminpage,
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
  