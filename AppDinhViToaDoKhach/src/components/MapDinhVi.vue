<template>
  <div class="google-map" :id="mapName"></div>
</template>

<script>
export default {
  name: 'MapDinhVi',
  data () {
    return {
      mapName: 'GoogleMap',
    }
  },
  mounted(){
    const element = document.getElementById(this.mapName)
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(51.501527,-0.1921837)
    }
    const map = new google.maps.Map(element, options);
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
