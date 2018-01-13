<template>
  <div class="map-container">
    <div id="floating-panel">
      <button type="button" class="btn btn-primary" v-on:click="ShowDriverNearLest">
        <span class="glyphicon glyphicon-ok"></span>
      </button>
    </div>
    <div class="google-map" :id="mapName"></div>
  </div>
  
</template>

<script>
import firebase from 'firebase';
import axios from 'axios';

export default {
  name: 'Index',
  data () {

    return {
      mapName: 'GoogleMap',
      map: null,
      markers:[],
      bounds: null,
      phoneRef: null,
      lat: null,
      lng: null,
      driversRef:[],
      driverMarker:[],
    }

  },

  mounted() {

    var self = this;
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527,-0.1921837)
    };
    self.bounds = new google.maps.LatLng(51.501527,-0.1921837);
    self.map = new google.maps.Map(element, options);
    self.geocoder = new google.maps.Geocoder;

    self.Detachlisteners();
    self.DeleteAllDriverMarker();

    if(self.$route.params.phone){
      //console.log('phone param '+self.$route.params.phone);
      self.GeocodeInGoogle(self.GetValue(self.$route.params.phone, 'address'));
    }
  },

  methods: {

    GeocodeInGoogle(address){
      var self = this;

      self.geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {

          self.DeleteAllMarker();

          self.AddNewMarker(results[0].geometry.location);
          self.lat = results[0].geometry.location.lat();
          self.lng = results[0].geometry.location.lng();
          console.log('latlng ' + self.lat + ' ' + self.lng);

        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          //console.log(self.GetValue(self.$route.params.phone, 'addressold'));

          //self.GeocodeInGoogle(self.GetValue(self.$route.params.key, 'addressold'));
        }
      });
    },

    GeocodeLatLng(latLng){
      var self = this;
      self.geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            
            // console.log(results[0].formatted_address);
            // get key
            var phone = self.$route.params.phone;
            //console.log("key " + key);
            var dataref = firebase.database().ref('customers/'+phone+'/request');
            var dragged = { address: results[0].formatted_address};

            dataref.update(dragged);
            
          } else {
            //window.alert('No results found');
          }
        } else {
          //window.alert('Geocoder failed due to: ' + status);
        }
      });
    },

    MarkerMoveChange(event){
      var self = this;
      //console.log(event.latLng);
      self.GeocodeLatLng(event.latLng);
      
      self.lat = event.latLng.lat();
      self.lng = event.latLng.lng();
      console.log('latlng ' + self.lat + ' ' + self.lng);
    },

    DeleteAllMarker(){
      var self = this;
      self.markers.forEach(function(marker){
        marker.setMap(null);
      })
    },

    AddNewMarker(location){
      var self = this;
      var marker = new google.maps.Marker({
        map: self.map,
        draggable: true,
        position: location
      });

      marker.addListener('dragend', function(event){
        self.MarkerMoveChange(event);
      });

      self.markers.push(marker);
      self.map.setCenter(location);
    },

    ShowDriverNearLest(){
      var self = this;
      console.log("Near lest " + self.$route.params.phone);
      var phone = self.$route.params.phone;

      if(self.phoneRef){
        self.phoneRef.off();
      }

      self.Detachlisteners();
      self.DeleteAllDriverMarker();


      self.phoneRef = firebase.database().ref('customers/' + phone + '/request/drivers');

      self.phoneRef.on('value', function(datas){
        if(datas.numChildren() > 0){
          //console.log('drivers change ' + datas.key + ' ' + datas.val().driver1.statusfordriver);
          
          datas.forEach(function(data){
            console.log("driver gan " + data.key);
            var driverRef = firebase.database().ref('drivers/' + data.key);
            driverRef.on('value', function(snapshot){
              if(snapshot){
                console.log("driver " + snapshot.key);
                // add marker
                if(!self.CheckIsHasMarker(snapshot.key)){
                  var marker = new google.maps.Marker({
                    map: self.map,
                    position: new google.maps.LatLng(snapshot.val().locations.lat,snapshot.val().locations.lng),
                    title: snapshot.key,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    tag: snapshot,
                  });
                  marker.addListener('click', function(event){
                    console.log(snapshot.key);
                    // call api hỏi tài xế có lái không
                    // gửi phone, gửi key tài xế
                    self.CallApiRequestDriver(phone, snapshot.key);
                  });

                  self.driverMarker.push(marker);
                }else{
                  var idx = self.GetMarkerHasTitle(snapshot.key);
                  if(idx > 0){
                    var marker = self.driverMarker[idx];
                    console.log("marker " + marker);
                    //console.log(snapshot.locations);
                    //console.log(snapshot.locations.lat + " location " + snapshot.locations.lng);
                    marker.setPosition(new google.maps.LatLng(snapshot.val().locations.lat,snapshot.val().locations.lng));
                  }
                }
              }
            });
            self.driversRef.push(driverRef);
          });
        }
      });

      axios.post('https://barg-server.herokuapp.com/driver/finddrivernearest', {
        phone: phone,
        lat: self.lat,
        lng: self.lng
      })
      .then(function(response){

      })
      .catch(function(error){

      });

      self.CallApiLocated();
    },

    CallApiLocated(){
      var self = this;
      var phone = self.$route.params.phone;

      var addressold = self.GetValue(phone, 'addressold');
      //console.log('point located '+addressold);
      axios.post('https://barg-server.herokuapp.com/driver/located', {
        address:addressold,
        lat: self.lat,
        lng: self.lng
      })
      .then(function(response){
        console.log('call api located seccess');
      })
      .catch(function(error){
        console.log('call api located error ' + error);
      });
    },

    CallApiRequestDriver(phone, driver){
      var url = `https://barg-server.herokuapp.com/`;
      axios.get(url)
      .then(function(response){

      })
      .catch(function(error){

      });
    },

    GetValue(key, name){
      var self = this;
      var dataref = firebase.database().ref('customers/'+key+'/request');
      var value;
      dataref.once('value', function(snapshot){

        value = snapshot.child(name).val();
        //console.log('address firt ' + value);
      });
      return value;
    },

    CheckIsHasMarker(title){
      var self = this;
      if(self.driverMarker){
        self.driverMarker.forEach( function(element, index) {
          if(element.getTitle() == title){
            return true;
          }
        });
      }
      return false;
    },

    GetMarkerHasTitle(title){
      var self = this;
      if(self.driverMarker){
        self.driverMarker.forEach( function(element, index) {
          if(element.getTitle() == title){
            return index;
          }
        });
      }
      return -1;
    },

    Detachlisteners(){
      var self = this;
      if(self.driverRef){
        self.driverRef.forEach( function(element, index) {
          if(element){
            element.off();
          }
        });
      }
    },

    DeleteAllDriverMarker(){
      var self = this;
      if(self.driverMarker){
        self.driverMarker.forEach( function(element, index) {
          if(element){
            element.setMap(null);
          }
        });
      }
    },

  },

  watch: {

    '$route'(to, from){
      //console.log(to.params.address);
      //console.log(to.params.phone);
      this.GeocodeInGoogle(this.GetValue(to.params.phone, 'address'));
      this.Detachlisteners();
      this.DeleteAllDriverMarker();
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .google-map {
    width: 100%;
    height: 100%;
    background: gray;
  }
</style>
