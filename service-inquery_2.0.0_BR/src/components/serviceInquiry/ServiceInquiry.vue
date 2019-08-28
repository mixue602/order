<template>
  <el-container>
    <!-- <el-header class="header"></el-header> -->
    <el-main>
      <InquiryForm></InquiryForm>
    </el-main>
  </el-container>
</template>
<script>
import InquiryForm from "./inquiryForm"
import { mapState, mapMutations, mapGetters, mapActions } from  'vuex'

export default {
  data(){
    return {
    }
  },
  components:{
    InquiryForm
  },
  methods: {
  },
  computed:mapState({
    TEST:"TEST",
    storeName:state => state.storeName
  }),

}
</script>
<style lang="stylus" scoped>

.el-container
  overflow visible
  margin 20px
  border 1px solid #ccc
  color: #fff;

.center
  text-align center

.header
  background #409eff
  font-size 14px
  height 36px !important
  line-height 36px

</style>
<style lang="stylus">
.el-main
  overflow visible
  overflow-x hidden
</style>
