<template>
  <div class="map-container">
    <div id="floating-panel">
      <button type="button" class="btn btn-primary" v-on:click="ShowDriverNearLest">
        <span class="glyphicon glyphicon-screenshot"></span>
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
      geocoder: null,
      dinhviUser: null,
    }

  },

  mounted() {

    var self = this;

    self.dinhviUser = localStorage.auth_dinhvivien;

    if(self.dinhviUser){
      const element = document.getElementById(this.mapName);
      const options = {
        zoom: 14,
        disableDefaultUI: true,
        center: new google.maps.LatLng(51.501527,-0.1921837)
      };
      
      self.map = new google.maps.Map(element, options);
      self.geocoder = new google.maps.Geocoder;

      if(self.$route.params.phone){
        //console.log('phone param '+self.$route.params.phone);
        self.GeocodeInGoogle(self.GetValue(self.$route.params.phone, 'address'));
      }

      if(self.phoneRef){
        self.phoneRef.off();
        self.phoneRef = null;
      }
      self.Detachlisteners();
      self.DeleteAllDriverMarker();
      self.bounds = new google.maps.LatLngBounds();
    }
  },

  methods: {

    GeocodeInGoogle(address){
      var self = this;

      self.geocoder.geocode({'address': address}, function(results, status) {
        if (status == 'OK') {

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
        icon: '../../src/assets/image/marker-unlocate.png',
        position: location
      });

      marker.addListener('dragend', function(event){
        self.MarkerMoveChange(event);
      });

      self.bounds.extend(location);
      self.markers.push(marker);
      self.map.setCenter(location);
    },

    ShowDriverNearLest(){
      var self = this;
      console.log("Near lest " + self.$route.params.phone);
      var phone = self.$route.params.phone;

      if(phone){
        var numberDriver = 1;

      if(self.phoneRef){
        self.phoneRef.off();
        self.phoneRef = null;
      }

      self.Detachlisteners();
      self.DeleteAllDriverMarker();


      self.phoneRef = firebase.database().ref('customers/' + phone + '/request/drivers');

      self.phoneRef.on('value', function(driversInCustomer){
        if(driversInCustomer.numChildren() > 0){
          //console.log('drivers change ' + driversInCustomer.key + ' ' + driversInCustomer.val().driver1.statusfordriver);
          
          driversInCustomer.forEach(function(data){
            console.log("driver gan " + data.key);
            var driverRef = firebase.database().ref('drivers/' + data.key);
            driverRef.on('value', function(driverItem){
              if(driverItem){
                console.log("driver " + driverItem.key);
                // add marker
                if(!self.CheckIsHasMarker(driverItem.key)){
                  var marker = new google.maps.Marker({
                    map: self.map,
                    position: new google.maps.LatLng(driverItem.val().locations.lat,driverItem.val().locations.lng),
                    title: driverItem.key,
                    icon: '../../src/assets/image/bike-waiting.png',
                    tag: driverItem,
                    label: (numberDriver)+'',
                  });
                  numberDriver++;
                  marker.addListener('click', function(event){
                    console.log(driverItem.key);
                    // call api hỏi tài xế có lái không
                    // gửi phone, gửi key tài xế
                    self.CallApiRequestDriver(phone, driverItem.key);
                  });
                  self.bounds.extend(marker.getPosition());
                  self.driverMarker.push(marker);
                }else{
                  var idx = self.GetMarkerHasTitle(driverItem.key);
                  console.log("index found " + idx);
                  if(idx >= 0){
                    var marker = self.driverMarker[idx];
                    console.log("marker " + marker);
                    //console.log(driverItem.locations);
                    //console.log(driverItem.locations.lat + " location " + driverItem.locations.lng);
                    marker.setPosition(new google.maps.LatLng(driverItem.val().locations.lat,driverItem.val().locations.lng));
                    if(driverItem.val().statusfordriver == 2){ // chấp nhận lái
                      marker.setIcon('../../src/assets/image/bike-accepted.png');
                    }else if(driverItem.val().statusfordriver == 1){ // đang sẵn sàng
                      marker.setIcon('../../src/assets/image/bike-ignore.png');
                    }else if(driverItem.val().statusfordriver == 3){ // đang sẵn sàng
                      marker.setIcon('../../src/assets/image/bike-waiting.png');
                    }
                  }
                }
              }
            });
            self.driversRef.push(driverRef);
          });
          self.map.fitBounds(self.bounds);
        }
      });

      axios.post('https://barg-server.herokuapp.com/taixe/finddrivernearest', {
        phone: phone,
        lat: self.lat,
        lng: self.lng
      })
      .then(function(response){

      })
      .catch(function(error){

      });

      self.CallApiLocated();
      }
    },

    CallApiLocated(){
      var self = this;
      var phone = self.$route.params.phone;

      var addressold = self.GetValue(phone, 'addressold');
      //console.log('point located '+addressold);
      axios.post('https://barg-server.herokuapp.com/dinhvi/located', {
        address: addressold,
        lat: self.lat,
        lng: self.lng
      })
      .then(function(response){
        console.log('call api located success');
      })
      .catch(function(error){
        console.log('call api located error ' + error);
      });
    },

    CallApiRequestDriver(phone, driver){
      var url = `https://barg-server.herokuapp.com/dinhvi/choosedriver/${phone}/${driver}`;
      axios.get(url)
      .then(function(response){
        console.log("call api request driver success");
      })
      .catch(function(error){
        console.log("call api request driver error " + error);
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
      var result = false;
      if(self.driverMarker){
        self.driverMarker.forEach( function(element, index) {
          if(element.getTitle() == title){
            result = true;
          }
        });
      }
      return result;
    },

    GetMarkerHasTitle(title){
      var self = this;
      var idx = -1;
      if(self.driverMarker){
        self.driverMarker.forEach( function(element, index) {
          if(element.getTitle() == title){
            idx = index;
          }
        });
      }
      return idx;
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
      self.driverRef = [];
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
      self.driverMarker = [];
    },

  },

  watch: {

    '$route'(to, from){
      //console.log(to.params.address);
      //console.log(to.params.phone);
      this.dinhviUser = localStorage.auth_dinhvivien;

      if(this.dinhviUser){
        this.GeocodeInGoogle(this.GetValue(to.params.phone, 'address'));
        this.Detachlisteners();
        this.DeleteAllDriverMarker();
      }
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
