<template>
  <div id="list-area">
    <div id="list-area-header" class="noselect">
      <h4 style="color: #FFF; line-height: 2.5; padding-left: 60px; margin: 0px; line-height: 3.6;">DANH SÁCH KHÁCH HÀNG</h4>
    </div>
    <div id="list-area-content">
      <div class="list-item noselect" v-for="request in listRequest" @click.prevent  ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">t</div>
          </div>
        </div>
        <div class="item-content noclick">
          <div class="item-name ">
            {{request.val().name}}
          </div>
          <div class="item-start">
            <img :src="linkStartPoint" class="item-image">
            <div class="item-start-content">
              {{request.val().adress}}
            </div>
          </div>
          <div class="item-phone">
            <img :src="linkPhone" class="item-image">
            <div class="item-phone-content">
              {{request.val().phone}}
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>

var itemActive;

import firebase from 'firebase';

export default {
  name: 'Customers',
  data () {
    return {
      isActive: false,
      linkStartPoint: "../../src/assets/image/start-point.png",
      linkStopPoint: "../../src/assets/image/end-point.png",
      linkPhone: "../../src/assets/image/phone.png",
      listRequest: []
    }
  },
  mounted(){
    var self = this;
    var database = firebase.database().ref('requests');

    database.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
          //var childKey = childSnapshot.key; get key
          //var childData = childSnapshot.val(); // get data
          if(childSnapshot.val().statusforreq == 1){
            self.listRequest.push(childSnapshot);
          }
          console.log(childSnapshot.val());
        });
    });

    database.on('value', function(snapshot){
      addEtemInListRequest(snapshot);
    });
  },
  methods: {
        mySelect(e){
          if (itemActive != null) {
            itemActive.removeClass("list-item-selected");
          }
          itemActive = $(e.target);
          itemActive.addClass("list-item-selected");
          itemActive.removeClass("list-item-hover");
        },

        myHover(e){
          if (!$(e.target).hasClass("list-item-selected")) {
            $(e.target).addClass("list-item-hover");
          }
        },

        myLeave(e){
          $(e.target).removeClass("list-item-hover");
        },

        addEtemInListRequest(request){
          var self = this;
          self.listRequest.push(request);
          console.log(request);
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

