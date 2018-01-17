<template>
  <div>
    <div id="navbar">
      <button id="hamburger-button">
        <img src="../../src/assets/image/hamburger-white.png" style="width: 24px; height:24px">
      </button>
    </div>
    
    <div id="hamburger-menu">
      <div id="avatar-background">
        <div id="avatar-background-back"></div>
        <div id="avatar-background-front"></div>

        <div id="avatar">
          <img src="../../src/assets/image/avatar.jpg" style="width: 60px; height: 60px">
        </div>
      </div>


      <div id="hamburger-menu-items">
        <div class="hamburger-menu-item">
          <div class="hamburger-menu-item-icon">
            <img src="../../src/assets/image/logout.png" style="width: 18px; height: 18px;">
          </div>
          <div class="hamburger-menu-item-context">
            Đăng xuất
          </div>
        </div>
      </div>
  
    </div>

    <div id="hamburger-menu-back"></div>

    <div id="googlemap"></div>

    <div id="countdown" v-show="showCounter">
      <div id="countdown-text">5</div>
      <svg width="160" height="160">
        <g>
          <circle id="circle-inside" r="62" cy="80" cx="80" stroke-width="4" stroke="#35495e" fill="none"/>
          <circle id="circle" class="circle_animation" r="70" cy="80" cx="80" stroke-width="13" stroke="#41b883" fill="none"/>
        </g>
      </svg>
      <div id="countdown-content" class="noselect">
        <div id="countdown-content-name">
          Sheikou Akiyoshi
        </div>
        <div id="countdown-content-address">
          123 Nguyễn Văn Cừ, xã Thất Thảo, huyện Mộc La, Thành phố HCM
        </div>
        <div id="countdown-content-phone">
          0123456789
        </div>
      </div>
      <div id="countdown-buttons">
        <div id="countdown-buttons-ok">
          <button id="btnOK" class="button">Chấp nhận</button>
        </div>
        <div id="countdown-buttons-cancel">
          <button id="btnCancel" type="submit" class="button">Từ chối</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import firebase from 'firebase';
import axios from 'axios';

export default {
  name: 'index',
  data () {
    return {
      mapName: 'googlemap',
      map: null,
      markers:[],
      bounds: null,
      showCounter: true,
    }
  },

  mounted() {
    var self = this;
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527,-0.1921837)
    };
    
    self.map = new google.maps.Map(element, options);
    self.geocoder = new google.maps.Geocoder;

    self.bounds = new google.maps.LatLngBounds();

    
  },

  methods: {
    loadCounter(e){
        var time = 5;
        var initialOffset = '440';
        var i = 0;

        var interval = setInterval(function() {
            $('#countdown-text').text((5-i));
            if (i == time) {    
              clearInterval(interval);
              $('.circle_animation').css('stroke-dashoffset', 0);
              return;
            }
            $('.circle_animation').css('stroke-dashoffset', ((i+1)*(initialOffset/time)));
            i++;  
        }, 1000);

      },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
