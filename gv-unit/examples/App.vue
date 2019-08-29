<template>
  <div id="app">
      <div class="contianer">
        <side-nav class="nav"></side-nav>
        <router-view class="view"/>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import sideNav from './components/side-nav'
export default {
  name: 'App',
  components: {
    sideNav,
  },
  created() {
    console.log(this)
  }
}
</script>

<style>
@import "./assets/css/index";
  .page-body{
    min-height: 600px;
    box-shadow: rgba(223, 225, 230, 0.5) 0px 4px 30px 0px;
    width: 90%;
    margin: 48px auto;
  }
  .contianer {
    margin: 48px auto;
    width: 100%;
    display: block;
    background-color: rgb(182, 31, 31);
  }
  
  .contianer .nav{
    float: left;
    width: 15%;
  }
  .contianer .view{
    float: left;
    width: 85%;
    padding: 32px 48px 48px;
    box-sizing: border-box
  }
  .container:after {
    content: "";
    clear: both;
    display: block;
  }
</style>
