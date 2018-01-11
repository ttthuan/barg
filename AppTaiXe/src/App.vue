<template>
  <div class="container-fluid fill" style="margin: 0; padding: 0;">
        <button id="hamburger-button" class="hamburger-button no" value="0">
            <img src="../src/assets/image/hamburger-white.png" style="width: 24px">
          </button>
        <div id="hamburger-menu" class="hamburger-menu fill transition-menu" >
          <Customers/>
        </div>
        <div id="map-menu" class="map-menu fill transition-menu" >
          <div id="map-menu-content" class="container-fluid fill" style="margin: 0; padding: 0; position: relative;"> 
              <div class="jumbotron jumbotron-center">
                <!-- <MapDinhVi/> -->
                <router-view></router-view>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Customers from './components/Customers';
//import MapDinhVi from './components/MapDinhVi';

export default {
  name: 'app',
  components: {
    Customers
  },

  data() {
    return {
    }
  },

  methods: {
    
  }
}
</script>

<style>

</style>
