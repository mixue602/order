<template>
  <div class="header">
      <div class="header-left">返回</div>
      <div class="header-input">输入城市景点</div>
      <div class="header-right">{{this.$store.state.cityName}}</div>
  </div>
</template>
<script>
export default {
    name: 'HomeHeader',
    computed: {
        cityName () {
            return this.$store.state.cityName
        }
    },
    mounted(){
        console.log("test store",this.$store);
    }
}
</script>
<style lang="stylus" scoped>
@import '../../../assets/styles/varibles.styl';
.header
    display: flex
    height: 2.6875rem
    line-height: 2.6875rem
    background: $bgcolor
    color: #fff
    .header-left
        width: 2rem
        float: left
        text-align: center
    .header-input
        flex: 1
        margin-top: .375rem
        background: #fff
        border-radius: .625rem
        height: 2rem
        line-height: 2rem
        color: #ccc
        text-align: left
        margin-left: .75rem
        padding-left: .625rem
    .header-right
        width: 3.75rem
        float: right
        text-align : center
</style>
