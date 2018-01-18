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
  { 
    path: '/', 
    component: Index,
    meta:{
      requireAuth: true
    }
  },
  { path: '/login', component: Login },
  { 
    path: '/:phone', 
    component: Index,
    meta:{
      requireAuth: true
    }
  },
];

const router = new VueRouter({routes});

Vue.config.productionTip = false;

router.beforeEach((to, from, next)=>{
  var r = to.matched.some(record => record.meta.requireAuth);
  console.log("requireAuth " + r);
  if(r === true){
    var user = localStorage.auth_dinhvivien;
    console.log("localStorage " + user);
    if(!user){
      console.log("login");
      next('/login');
    }
  }
  next();
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
