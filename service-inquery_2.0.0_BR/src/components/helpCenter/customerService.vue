<template>
<el-container>
  <el-main class="method-box">
    <div class="method-item">
      <dl>
        <dt>第一种方式</dt>
        <dd>联系门店服务台或者拨打客服电话：400-811-3333</dd>
      </dl>
    </div>
    <div class="method-item">
      <dl>
        <dt>第二种方式</dt>
        <dd>上报ITSM运维平台（自助）：</dd>
        <dd>
          <p>1.登录网址：<a href="http://itsm.gome.inc/ess.do" target="_blank">http://itsm.gome.inc/ess.do</a></p>
          <p>2.登录&lt;国美企业门户：<a href="http://oa.gome.inc" target="_blank">http://oa.gome.inc</a> &gt;-点击左边菜单栏“ITSM运维平台”</p>
          <p><img :class="['itsm',itsmJpgFlag ? 'itsmJpgBig' : '']" :src="itsmJpg" title="点击放缩查看" @click="imgClickBigSmall"></p>
          <p>（点击可以查看大图）</p>
        </dd>
      </dl>
    </div>
    <div class="method-item">
      <dl>
        <dt>第三种方式</dt>
        <dd>与培训老师沟通途径</dd>
        <dd>
          <p>1.员工在门店微信群中反馈当天所遇问题，店长负责归纳汇总上报至分部解决群，由大区培训讲师负责解答。</p>
          <p>2.如大区讲师遇到无法解决的问题，需由大区培训讲师将问题汇总后反馈至大区中台上线指挥微信群中，由相关技术人员负责解答。</p>
        </dd>
      </dl>
    </div>
  </el-main>
</el-container>
</template>
<script>
export default {
  data(){
    return {
      itsmJpg:require("../../assets/images/itsm.jpg"),
      itsmJpgFlag:false
    }
  },
  methods:{
    imgClickBigSmall(){
      this.itsmJpgFlag = !this.itsmJpgFlag
    }
  }
}
</script>
<style lang="stylus" scoped>
.method-box
  border 1px solid #ccc
  .method-item
    dl
      display block
      margin-bottom 15px
      dt
        display block
        text-align left
        margin-bottom 10px
        font-weight bold
      dd
        display block
        margin-bottom 5px
        p
          margin-bottom 5px
          .itsm
            width 20%
            cursor pointer
            transition all ease .3s
          .itsmJpgBig
            width 80%
</style>
