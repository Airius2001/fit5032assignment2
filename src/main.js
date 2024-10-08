import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCblmSIlQW7CNaC7TqhgfYTGwYyUg_dI4",
  authDomain: "fit5032-a3-b7772.firebaseapp.com",
  projectId: "fit5032-a3-b7772",
  storageBucket: "fit5032-a3-b7772.appspot.com",
  messagingSenderId: "1050814265586",
  appId: "1:1050814265586:web:636e689686a7278ada386b"
};

// Initialize Firebase and store the firebaseApp instance
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore with firebaseApp
const db = getFirestore(firebaseApp);

const app = createApp(App)
app.use(router)
app.use(BootstrapVue3)
app.use(PrimeVue);

// Register PrimeVue components
app.component('DataTable', DataTable);
app.component('Column', Column);

export { db }; // Export Firestore for use in other parts of the application

// Mount the Vue app
app.mount('#app')
