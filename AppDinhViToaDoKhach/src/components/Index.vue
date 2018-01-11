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

export default {
  name: 'Index',
  data () {

    return {
      mapName: 'GoogleMap',
      map: null,
      markers:[],
      bounds: null
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

    if(self.$route.params.phone){
      //console.log(self.$route.params.phone);
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

        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          //console.log(self.GetValue(self.$route.params.phone, 'addressold'));

          //self.GeocodeInGoogle(self.GetValue(self.$route.params.key, 'addressold'));
          //self.map.setCenter(location);
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
      console.log("Near lest");
    },

    GetValue(key, name){
      var self = this;
      var dataref = firebase.database().ref('customers/'+key+'/request');
      var value;
      dataref.once('value', function(snapshot){

        value = snapshot.child(name).val();
        
      });
      return value;
    }

  },

  watch: {

    '$route'(to, from){
      //console.log(to.params.address);
      //console.log(to.params.phone);
      this.GeocodeInGoogle(this.GetValue(to.params.phone, 'address'));
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
