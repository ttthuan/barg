<template>
  <div id="list-area">
    <div id="list-area-header" class="noselect">
      <h4 style="color: #FFF; line-height: 2.5; padding-left: 60px; margin: 0px; line-height: 3.6;">DANH SÁCH REQUEST</h4>
    </div>
    <div id="list-area-content">

      <div class="list-item noselect noclick list-item-unlocate" v-for="request in listRequest" v-if="request.status == 1" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">
              {{request.name[0]}}
            </div>
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

      <!-- da dinh vi -->
      <div class="list-item noselect noclick list-item-located" v-else-if="request.status == 2" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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

      <!-- da tu choi -->
      <div class="list-item noselect noclick list-item-ignore" v-else-if="request.status == 3" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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

      <!-- da nhan xe -->
      <div class="list-item noselect list-item-accepted" v-else-if="request.status == 4" @click.prevent ="mySelect" @mouseover="myHover" @mouseleave="myLeave" :id="request.phone" :title="showTitle(request.driver)">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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

      <!-- dang di chuyen -->
      <div class="list-item noselect noclick list-item-moving" v-else-if="request.status == 5" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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

      <!-- da hoan thanh -->
      <div class="list-item noselect noclick list-item-done" v-else-if="request.status == 6" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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

      <!-- da tu choi -->
      <div class="list-item noselect noclick list-item-located" v-else-if="request.status == 7" @click.prevent ="mySelect" @mouseover="myHover" 
      @mouseleave="myLeave" :id="request.phone">
        <div class="item-avatar noclick">
          <div class="avatar">
            <div class="avatar-text">{{request.name[0]}}</div>
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
      dinhviUser: null,
    }
  },
  mounted(){
    var self = this;
    self.dinhviUser = localStorage.auth_dinhvivien;
    var database = firebase.database().ref('customers');

    database.on('value', function(customers){
      if(customers){
        self.listRequest = [];
        customers.forEach(function(customer) {
          if(customer.hasChild('request')){
            var request = customer.child('request');
            var driverFind;
            var drs = request.child('drivers');
            console.log(drs.key);
            console.log(drs.numChildren());
            console.log(drs.val());

            drs.forEach(function(dr) {
              //console.log(dr.key);
              //console.log(dr.val().statusfordriver);
              if(dr.val().statusfordriver == 2)
              {
                driverFind = dr;
              }
            });

              var customRequest = {
                name: customer.val().name,
                address: request.val().address,
                phone: customer.key,
                key: request.key,
                status: request.val().statusforreq,
                handling: request.val().handling,
                driver: driverFind,

              };
              //console.log(request.val());
              //console.log(customRequest);
              if(request.numChildren()>0){
                self.listRequest.push(customRequest);
              }
              
            
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
          var self = this;
          if (itemActive != null) {
            itemActive.removeClass("list-item-selected");
            //self.removeHandling(itemActive.attr("id"));
          }
          itemActive = $(e.target);
          itemActive.addClass("list-item-selected");
          itemActive.removeClass("list-item-hover");

          var id = $(e.target).attr("id");
          //console.log("id: "+id);
          var address = itemActive[0].childNodes[2].childNodes[2].innerText;
          
          self.$router.push('/' + id);

          var dinhviUser = localStorage.auth_dinhvivien;

          if(dinhviUser){
            self.preventClick(id, dinhviUser);
            self.$router.push('/' + id);
          }
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
        },

        preventClick(phone, user){
          var self = this;
          var requestRef = firebase.database().ref('customers/'+phone+'/request');
          requestRef.update({
            handling: user
          })
        },
        removeHandling(phone){
          var self = this;
          var requestRef = firebase.database().ref('customers/'+phone+'/request');
          requestRef.update({
            handling: 'null'
          })
        },
        showTitle(requestDriver){
          return "Tài xế: " + requestDriver.key;
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

