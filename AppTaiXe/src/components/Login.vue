<template>
  <div id="app">
    <div id="logo" class="noselect">
      <img src="../../src/assets/logo.png" id="img-logo">
    </div>

    <div id="login">
      <div class="template-input">
        <div class="textboxD">
          <input id="txtID" type="text" name="id" class="textbox" placeholder="Tài khoản" v-model="username" v-on:click="clearPassWrong" v-on:focus="activeID" v-on:blur="deactiveID">
          <hr id="txtID-border">
        </div>
      </div>

      <div class="template-input">
        <div class="textboxD">
          <input id="txtPW" type="password" name="pw" class="textbox" placeholder="Mật khẩu" v-model="password" v-on:click="clearPassWrong" v-on:focus="activePW" v-on:blur="deactivePW">
          <hr id="txtPW-border">
        </div>
      </div>
      <div class="template-input">
        <div class="textboxD">
          <input type="button" value="Đăng Nhập" class="button" v-on:click="login">
        </div>
      </div>
      <div class="template-input">
        <div class="textboxD">
          <div class="wrongPW noselect" v-show="showPasswordWrong">※ Tài khoản hoặc mật khẩu không đúng!</div>
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
      username: null,
      password: null,
      usernameactive: false,
      passwordactive: false,
      showPasswordWrong: false,
    }
  },
  methods:{
    activeID: function (event) {
      $('#txtID-border').addClass("textbox-active");
    },
    deactiveID: function (event) {
      $('#txtID-border').removeClass("textbox-active");
    },
    activePW: function (event) {
      $('#txtPW-border').addClass("textbox-active");
    },
    deactivePW: function (event) {
      $('#txtPW-border').removeClass("textbox-active");
    },
    login(){
      var self = this;
      console.log("login " + self.username + ' ' + self.password);

      if(self.username && self.password){
        var url = `https://barg-server.herokuapp.com/taixe/login/${self.username}/${self.password}`;
        axios.get(url)
        .then(function(response){
          console.log(response);
          localStorage.auth_driver = self.username;
          self.$router.push('/');
        })
        .catch(function(error){
          console.log(error);
          self.showPasswordWrong = true;
        });
      }

    },

    clearPassWrong(){
      var self = this;
      self.showPasswordWrong = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
  body {
    min-height: 100%;
    height: 100%;
  }

  html {
    overflow-y: hidden;
  }

  hr{
    position: absolute;
    border-top: 2px solid #41b883;
    bottom: 0px;
    transition: 0.15s ease-out;
    width: 0%;
    left: 50%;   
    margin: 0px;
  }

  .fill {
    min-height: 100%;
    height: 100%;
  }

  .vcenter {
    display: inline-block;
    vertical-align: middle;
    float: none;
  }

  #app{
    min-height: 100%;
    height: 100%;
    background-color: #bba7df;
    position: relative;
  }

  #logo{
    width: 100%;
    height: 50%;
    position: relative;
  }

  #login{
    position: relative;
    top: 50px;
  }

  .textbox{
    border-width: 0px;
    height: 35px;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    text-align: left;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    padding: 3px 10px 0 10px;
    color: #303c48;

    box-shadow: 0px 2px 5px 1px #6b6b6bc7;
  }

  .textbox-active{
    left: 0%;
    width: 100%;
  }

  .template-input{
    margin: 8px;
  }

  .textboxD{
    height: 35px;
    width: 70%;
    position: relative;
    left: 15%;
  }

  .button{    
    border: 2px solid #35495e;
    background-color: #35495e;
    width: 100%;
    height: 35px;
    text-align: center;
    text-decoration: none;
    color: #41b883;
    display: inline-block;
    font-weight: bold;    
    font-size: 16px;
    border-radius: 3px;

    box-shadow: 0px 2px 5px 1px #6b6b6bc7;
  }

  #img-logo
  {
    border-radius: 100px;
    width: 150px;
    height: 150px;
    position: absolute;
    overflow: hidden;
    /*left: 50%;*/
    /* Firefox */
    left: -moz-calc(50% - 79px);
    /* WebKit */
    left: -webkit-calc(50% - 79px);
    /* Opera */
    left: -o-calc(50% - 79px);
    /* Standard */
    left: calc(50% - 79px);

    /* Firefox */
    top: -moz-calc(45%);
    /* WebKit */
    top: -webkit-calc(45%);
    /* Opera */
    top: -o-calc(45%);
    /* Standard */
    top: calc(45%);
  }

  .wrongPW{
    color: #d1431d;
    font-weight: bold;
  }

  .noselect {
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                      supported by Chrome and Opera */
  }

  .noclick {
    pointer-events: none;
  }
</style>
