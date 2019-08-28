<template>
  <div id="app">
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapState,mapActions} from  'vuex';
export default {
  name: 'app',
  created(){
  },
  methods:{
  },
  computed:mapState({
    TEST:"TEST"
  })
}
</script>

<style lang="stylus">
* {
  margin: 0;
  padding: 0;
}
body {
  color: #303133;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
ul,ol,dl,dt,dd {
  list-style: none;
}
.deal-billing-message-box {
  .el-message-box__btns {
    overflow: hidden;
    .el-button {
      float: right;

    }
  }
  .el-message-box__btns button:nth-child(2) {
    margin-right: 10px;
    margin-left: 0;
  }
}
.self-select-box {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    text-align: center;
    padding: 0 13px 0 10px;

    cursor: pointer;
    .select-icon {
      display: none;
      position: absolute;
      bottom: 0;
      right: 0;
      background: url(assets/images/choseIcon.png);
      width: 14px;
      height: 14px;
    }
    &.active {
      color: #409EFF;
      border-color: #409EFF;
      .select-icon {
        display: block;
      }
    }
  }

</style>



