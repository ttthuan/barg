<template>
  <div id="list-area">
    <div id="list-area-header" class="noselect">
      <h4 style="color: #FFF; line-height: 2.5; padding-left: 60px; margin: 0px; line-height: 3.6;">DANH SÁCH REQUEST</h4>
    </div>
    <div id="list-area-content">
      <div class="list-item noselect" v-for="request in listRequest" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">t</div>
          </div>
        </div>
        <div class="item-content noclick">
          <div class="item-name ">
            {{request.name}}
          </div>
          <div class="item-start">
            <img :src="linkStartPoint" class="item-image">
            <div class="item-start-content">
              {{request.address}}
            </div>
          </div>
          <div class="item-phone">
            <img :src="linkPhone" class="item-image">
            <div class="item-phone-content">
              {{request.phone}}
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
      listRequest: [],
      geocoder: null,

    }
  },
  mounted(){
    var self = this;
    var database = firebase.database().ref('customers');

    database.on('value', function(customers){
      if(customers){
        self.listRequest = [];
        customers.forEach(function(customer) {
          if(customer.hasChild('request')){
            var request = customer.child('request');
              var customRequest = {
                name: customer.val().name,
                address: request.val().address,
                phone: customer.key,
                key: request.key
              };
              //console.log(request.val());
              //console.log(customRequest);
              self.listRequest.push(customRequest);
            
          }
          
          // if(childSnapshot.val().statusforreq == 1){
            
          //   if(!self.IsHasValued(childSnapshot)){
              
          //   }
          //   self.listRequest.push(childSnapshot);

          // }
        });
      }
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

          var id = $(e.target).attr("id");
          //console.log("id: "+id);
          var address = itemActive[0].childNodes[2].childNodes[2].innerText;
          var self = this;
          self.$router.push('/' + id);

        },

        myHover(e){
          if (!$(e.target).hasClass("list-item-selected")) {
            $(e.target).addClass("list-item-hover");
          }
        },

        myLeave(e){
          $(e.target).removeClass("list-item-hover");
        },

        IsHasValued(childSnapshot){
          var self = this;
          var n = self.listRequest.length;
          var isHasValued = false;

          for(var i = 0; i < n; i++){
            if(self.listRequest[i].key == childSnapshot.key){
                isHasValued = true;
                break;
            }
          }
          return isHasValued;
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

