<template>
  <div id="list-area">
    <div id="list-area-header" class="noselect">
      <h4 style="color: #FFF; line-height: 2.5;">DANH SÁCH KHÁCH HÀNG</h4>
    </div>
    <div id="list-area-content">
      <div class="list-item noselect" v-for="request in requests">
        <div class="item-avatar">
          <div class="avatar">
            <div class="avatar-text">t</div>
          </div>
        </div>
        <div class="item-content">
          <div class="item-name">
            trinh thanh thuan
          </div>
          <div class="item-start">
            <img :src="linkStartPoint" class="item-image">
            <div class="item-start-content">
              {{request.val().address}}
            </div>
          </div>
          <div class="item-phone">
            <img :src="linkPhone" class="item-image">
            <div class="item-phone-content">
              {{request.val().customerid}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Customers',
  data () {
    return {
      linkStartPoint: "../../src/assets/image/start-point.png",
      linkStopPoint: "../../src/assets/image/end-point.png",
      linkPhone: "../../src/assets/image/phone.png",
      requests: []
    }
  },
  mounted(){
    var self = this;
    var database = firebase.database().ref('requests');
    database.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
          //var childKey = childSnapshot.key; get key
          //var childData = childSnapshot.val(); // get data
          self.requests.push(childSnapshot);
          console.log(childSnapshot.val());
        });
    });
  },
  methods:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

