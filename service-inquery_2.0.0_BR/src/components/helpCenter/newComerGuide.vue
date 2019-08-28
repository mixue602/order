<template>
<el-container>
  <el-main class="guide-box">
    <div class="guide-item">
      <dl>
        <dt>1.导购员和顾客沟通商品，为顾客开单：</dt>
        <dd>
          <p><img class="guideImg" src="../../assets/images/guideImg01.png"></p>
        </dd>
      </dl>
    </div>
    <div class="guide-item">
      <dl>
        <dt>2.购买延保（支持延保的商品）：</dt>
        <dd>
          <p><img class="guideImg" src="../../assets/images/guideImg02.png"></p>
        </dd>
      </dl>
    </div>
    <div class="guide-item">
      <dl>
        <dt>3.预售：</dt>
        <dd>
          <p><img class="guideImg" src="../../assets/images/guideImg03.png"></p>
        </dd>
      </dl>
    </div>
  </el-main>
</el-container>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
.guide-box
  border 1px solid #ccc
  .guide-item
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
          .guideImg
            width 100%
            display block
</style>
