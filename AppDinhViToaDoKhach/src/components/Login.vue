<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Login</h3>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col-md-6 col-sm-6">
          <div class="form-group">
            <label for="user_name">Username</label>
            <input type="text" class="form-control" id="user_name" placeholder="Username" v-model="txtUsername">
          </div>
          <div class="form-group">
            <label for="pass_word">Password</label>
            <input type="password" class="form-control" id="pass_word" placeholder="Password" v-model="txtPassword">
          </div>
          
        
          <button class="btn btn-primary btn-block" @click="dangNhap">
            <span class="glyphicon glyphicon-user">
            </span>
            Đăng nhập
          </button>
          <div class="alert alert-danger" role="alert" v-if="showWrong">Sai username hoặc password</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase';
import axios from 'axios';

export default {
  name: 'Login',
  data () {
    return {
      txtUsername: null,
      txtPassword: null,
      showWrong: false,
    }
  },
  methods:{
    dangNhap(){
      var self = this;
      console.log(self.txtUsername);
      console.log(self.txtPassword);
      if(self.txtUsername && self.txtPassword){
        // /login/:username/:password
        var url = `https://barg-server.herokuapp.com/dinhvi/login/${self.txtUsername}/${self.txtPassword}`;
        axios.get(url)
        .then(function(response){
          localStorage.auth_dinhvivien = self.txtUsername;
          self.$router.push('/');
        })
        .catch(function(error){
          self.showWrong = true;
        });

      }
    },

    clearWrongPassword(){
      var self = this;
      self.showWrong = false;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
