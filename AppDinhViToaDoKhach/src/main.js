// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

// main compoment
import App from './App';

// router components
import Index from './components/Index.vue';
import Login from './components/Login.vue';
import MapDinhVi from './components/MapDinhVi.vue';

Vue.use(VueRouter);

// Initialize Firebase
var config = {
   apiKey: "AIzaSyAARBsG4HnBEqtCGFTDpR-BL7HLmBKD7TQ",
   authDomain: "barg-firebase.firebaseapp.com",
   databaseURL: "https://barg-firebase.firebaseio.com",
   projectId: "barg-firebase",
   storageBucket: "barg-firebase.appspot.com",
   messagingSenderId: "573103357657"
};
firebase.initializeApp(config);

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/:phone', component: Index },
];

const router = new VueRouter({routes});


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
