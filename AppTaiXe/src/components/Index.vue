<template>
  <div>
    <div id="navbar">
      <button id="hamburger-button" @click="hamburgerClick">
        <img src="../../src/assets/image/hamburger-white.png" style="width: 24px; height:24px">
      </button>
    </div>
    
    <div id="hamburger-menu" class="noselect">
      <div id="avatar-background">
        <div id="avatar-background-back"></div>
        <div id="avatar-background-front"></div>

        <div id="avatar">
          <img src="../../src/assets/image/avatar.jpg" style="width: 60px; height: 60px">
        </div>

        <div id="name">
          {{customerName}}
        </div>
      </div>


      <div id="hamburger-menu-items">
        <div class="hamburger-menu-item noselect hamburger-menu-item-disable">
          <div class="hamburger-menu-item-icon">
            <img src="../../src/assets/image/clock-start.png" style="width: 18px; height: 18px;">
          </div>
          <div class="hamburger-menu-item-context" v-on:click="startTranferCustomer">
            Bắt đầu
          </div>
        </div>
        <div class="hamburger-menu-item noselect hamburger-menu-item-disable">
          <div class="hamburger-menu-item-icon">
            <img src="../../src/assets/image/clock-end.png" style="width: 18px; height: 18px;">
          </div>
          <div class="hamburger-menu-item-context" v-on:click="stopTranferCustomer">
            Kết thúc
          </div>
        </div>
        <div class="hamburger-menu-item noselect noclick">
          <hr style="margin:5px 0px 5px 0px; border-top: 1px solid #dedede">
        </div>
        <div class="hamburger-menu-item noselect">
          <div class="hamburger-menu-item-icon">
            <img src="../../src/assets/image/logout.png" style="width: 18px; height: 18px;">
          </div>
          <div class="hamburger-menu-item-context" v-on:click="logout">
            Đăng xuất
          </div>
        </div>
      </div>
  
    </div>

    <div id="hamburger-menu-back" @click="menubackClick"></div>

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
          {{customerName}}
        </div>
        <div id="countdown-content-address">
          {{customerAddress}}
        </div>
        <div id="countdown-content-phone">
          {{customerPhone}}
        </div>
      </div>
      <div id="countdown-buttons">
        <div id="countdown-buttons-ok">
          <button id="btnOK" class="button" v-on:click="AppceptCustomer">Chấp nhận</button>
        </div>
        <div id="countdown-buttons-cancel">
          <button id="btnCancel" type="submit" class="button" v-on:click="RejectCustomer">Từ chối</button>
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
      showCounter: false,
      customerName: null,
      customerPhone: null,
      customerAddress: null,
      driverUser: null,
      geocoder: null,
      key: null,
      myposition: null,
      directionsService: null,
      directionsDisplay: null,
      customerLocation: null,
      timeOut: null,
    }
  },

  mounted() {
    var self = this;

    self.markers = [];
    self.key = 'AIzaSyArPtL7gTh6ZIN0LNS4fiC7j_HjKkK3-kA';
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527,-0.1921837)
    };
    
    self.map = new google.maps.Map(element, options);
    self.geocoder = new google.maps.Geocoder;

    self.bounds = new google.maps.LatLngBounds();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          self.showPosition(position.coords);
        });
    } else { 
        
    }

    self.directionsService = new google.maps.DirectionsService();
    self.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    self.directionsDisplay.setMap(self.map);

    self.ListenOnDriver();
  },

  methods: {
    loadCounter(){
      var self = this;
      var time = 5;
      var initialOffset = '440';
      var i = 0;

      var interval = setTimeout(function() {
          $('#countdown-text').text((5-i));
          if (i == time) {    
            clearInterval(interval);
            $('.circle_animation').css('stroke-dashoffset', 0);
            // call reject
            self.RejectCustomer();
            return;
          }
          $('.circle_animation').css('stroke-dashoffset', ((i+1)*(initialOffset/time)));
          i++;  
      }, 1000);

    },

    ListenOnDriver(){
      var self = this;
      var userDiver = localStorage.auth_driver;
      self.driverUser = userDiver;

      if(userDiver){
        var mycustomerRef = firebase.database().ref('drivers/' + self.driverUser +'/mycustomer');
        mycustomerRef.on('value', function(mycustomer){
          console.log('listen on mycustomer ' + mycustomer.key);
          if(mycustomer.numChildren() > 0){
            self.ShowInforCustomer(mycustomer.child('name').val(), mycustomer.child('phone').val(), mycustomer.child('address').val());
          }
        });

        self.timeOut = setInterval(self.fiveSecon, 5000);
      }else{
        self.$router.push('/login');
      }
      
    },

    ShowInforCustomer(name, phone, address){
      var self = this;
      self.showCounter = true;
      self.customerName = name;
      self.customerPhone = phone;
      self.customerAddress = address;
      self.loadCounter();
    },

    AppceptCustomer(){
      var self = this;
      ///confirmcustomer/:customer/:driver'
      self.showCounter = false;
      if(self.customerPhone && self.driverUser){
        var url = `https://barg-server.herokuapp.com/taixe/confirmcustomer/${self.customerPhone}/${self.driverUser}`;
        axios.get(url)
        .then(function(response){
          // hiển thị vị trí của customer
          self.geocoder.geocode({'address': self.customerAddress}, function(results, status) {
            if (status == 'OK') {
              var location = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              var marker = new google.maps.Marker({
                map: self.map,
                draggable: false,
                position: location
              });

              self.customerLocation = location;
              self.bounds.extend(location);
              self.markers.push(marker);
              self.map.fitBounds(self.bounds);

              // show đường đi ngắn nhất
              self.showPath();
            } else {
              console.log('Geocode was not successful for the following reason: ' + status);
            }
          });
        })
        .catch(function(error){

        });
      }
    },

    RejectCustomer(){
      var self = this;
      // unconfirmcustomer/:customer/:driver
      self.showCounter = false;
      if(self.customerPhone && self.driverUser){
        var url = `https://barg-server.herokuapp.com/taixe/unconfirmcustomer/${self.customerPhone}/${self.driverUser}`;
        axios.get(url)
        .then(function(response){

        })
        .catch(function(error){
          console.log('lỗi từ chối khách hàng ' + error);
        });
      }
      
    },

    showPosition(position){
      var self = this;
      var location = new google.maps.LatLng(position.latitude,position.longitude);
      self.myposition = location;
      var marker = new google.maps.Marker({
        map: self.map,
        draggable: true,
        position: location
      });

      self.bounds.extend(location);
      self.markers.push(marker);
      self.map.setCenter(location);
      marker.addListener('drag', function(){
        self.updateLocation(marker.getPosition().lat(), marker.getPosition().lng());
        // tính path lại
        self.myposition = marker.getPosition();
      });

      marker.addListener('dragend', function(){
        self.showPath();
      });
      //console.log('location ' + position);
      self.updateLocation(location.lat(), location.lng());
    },
    GeocodeInGoogle(address){
      var self = this;
      console.log(address);

      self.geocoder.geocode({'address': address}, function(results, status) {
        if (status == 'OK') {

          self.lat = results[0].geometry.location.lat();
          self.lng = results[0].geometry.location.lng();
          console.log('latlng ' + self.lat + ' ' + self.lng);

        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          self.lat = null;
          self.lng = null;
        }
      });
    },

    showPath(){
      var self = this;
      //console.log(origin);
      var origin = self.myposition;
      var destion = self.customerLocation;
      if(origin && destion){
        var request = {
          origin: origin,
          destination: destion,
          travelMode: 'DRIVING',
        };
        self.directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            self.directionsDisplay.setDirections(result);
          }
        });
      }
    },

    updateLocation(lat, lng){
      var self = this;
      var locationRef = firebase.database().ref('drivers/' + self.driverUser+'/locations');
      locationRef.update({
        lat: lat,
        lng: lng
      });
    },

    fiveSecon(){
      var self = this;
      //console.log('second');
      if(self.markers[0]){
        self.updateLocation(self.markers[0].getPosition().lat(), self.markers[0].getPosition().lng());
      }
    },

    startTranferCustomer(){
      // /start/:customer/
      var self = this;
      if(self.customerPhone){
        var url = `https://barg-server.herokuapp.com/taixe/start/${self.customerPhone}`;
        axios.get(url)
        .then(function(response){

        })
        .catch(function(error){
          console.log('Loi call api start tranfer customer ' + error);
        });
      }
    },

    stopTranferCustomer(){
      var self = this;
      // /stop/:customer/:driver
      if(self.customerPhone && self.driverUser){
        var url = `https://barg-server.herokuapp.com/taixe/stop/${self.customerPhone}/${self.driverUser}`;
        axios.get(url)
        .then(function(response){

        })
        .catch(function(error){
          console.log('Loi call api stop tranfer customer ' + error);
        });
      }
    },

    logout(){
      // /logout/:driver/
      var self = this;
      console.log("logout");
      if(self.driverUser){
        var url = `https://barg-server.herokuapp.com/taixe/logout/${self.driverUser}`;
        axios.get(url)
        .then(function(response){
          localStorage.removeItem('auth_driver');
          self.$router.push('/login');
        })
        .catch(function(error){

        });
      }
    },

    hamburgerClick(){
          $('#hamburger-menu').addClass("hamburger-menu-expanded");
          $('#hamburger-menu-back').addClass("hamburger-menu-back-actived");

    },

    menubackClick(){
          $('#hamburger-menu').removeClass("hamburger-menu-expanded");
          $('#hamburger-menu-back').removeClass("hamburger-menu-back-actived");
    },

  },

  watch: {
    '$route'(to, from){
      //console.log(to.params.address);
      //console.log(to.params.phone);
      this.ListenOnDriver();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
