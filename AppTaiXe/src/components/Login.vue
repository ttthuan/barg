<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Login</h3>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col-md-6 col-sm-6">
          <form>
          <div class="form-group">
            <label for="user_name">Email</label>
            <input type="text" class="form-control" id="user_name" placeholder="Email" v-model="txtUsername">
          </div>
          <div class="form-group">
            <label for="pass_word">Password</label>
            <input type="password" class="form-control" id="pass_word" placeholder="Password" v-model="txtPassword">
          </div>
          
        
          <button class="btn btn-primary btn-block" @click="chat">
            <span class="glyphicon glyphicon-user">
              
            </span>
            Đăng nhập
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase';

export default {
  name: 'Login',
  data () {
    return {
      txtUsername: "",
      txtPassword: "",
    }
  },
  methods:{
    dangNhap(){
      var self = this;
      console.log(self.txtUsername);
      console.log(self.txtPassword);
      if(self.txtUsername === 'ttthuan' && self.txtPassword === '123'){
        localStorage.auth_user = self.txtUsername;
        self.txtUsername = "";
        self.txtPassword = "";
        self.$router.push("/profile");
      }else{
        alert('ffff');
      }
    },
    chat(){
      var self = this;
      console.log(firebase);
      var database = firebase.database();

      var entryContent = {
        email: self.txtUsername,
        text: self.txtPassword
      };

      var newPostKey = database.ref().child('contents').push().key;
      var myDataRef = {};
      myDataRef['/contents/' + newPostKey] = entryContent;
      database.ref().update(myDataRef);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
