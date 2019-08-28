<template>
  <div class="order-list-res-box">
    <ul :class="['order-list-res-tab',listData.list.length > 8 ? 'order-list-res-tab-scroll' : '']" v-if="listData.list.length">
      <li v-for="item in listData.list" :key="item.id" class="list-item" @click="goPurchase(item)">
        <div class="clearfix order-list-res-item">
          <div class="fl time">{{item.createTime}}<span class="item-rec" v-if="item.sgpType == 3">预售</span></div>
          <div class="fl tel">{{item.mobile || item.memberCard}}</div>
          <div class="fl member">{{item.temporaryCardFlag == 1 ? '临时卡' : item.memberName}}</div>
        </div>
      </li>
    </ul>
    <ul v-else>
      <li class="nodata-img" v-if="listData.nodata.length">
        <img src="../../assets/images/default.png" alt="">
      </li>
      <li class="center res-nodata">{{listData.nodata}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
    listData:{
      type: Object,
      required: true,
    }
  },
  created:function(){

  },
  data(){
    return {
      activeName:"first",
    }
  },
  methods:{
    goPurchase(item){
      this.$router.replace({
        path:'/service/allBack/',
        name:'allBack',
        query:{
          memberId:item.memberId,
          memberCard:item.memberCard,
          temporaryCardFlag:item.temporaryCardFlag,
          sellerNum:this.$store.state.billingUsedParam.sellerNum,
          storeCode:this.$store.state.billingUsedParam.
          storeCode,
          siteType: (item.sgpType == 3 ? 2 : (item.sgpType == 4 || item.sgpType == 5 ? 3 : 1))//站点 1-普通 2-预售 3-延保,item.sgpType: 0 2 都是普通商品；3预售 4和5是延保
        }
      })
      this.$store.state.skuNoSearchKeyWord = ""
    }
  }
}
</script>
<style lang="stylus" scoped>
.clearfix:after
  content "."
  display block
  height 0
  clear both
  visibility hidden
.clearfix
  zoom 1
.fl
  float left
.center
  text-align center
.order-list-res-box
  min-height 150px
.nodata-img
  text-align center
.res-nodata
  padding-top 50px
.order-list-res-tab
  ul
    li
      padding 8px 0
      .order-list-res-item
        color #333
        display block
        text-decoration none
        div
          width 33.333%
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          line-height 16px
        .item-rec
          display inline-block
          color #ff0000
          border 1px solid #ff0000
          padding 1px 3px
          font-size 12px
          line-height 12px
          border-radius 2px
          margin-left 5px;
          
    li.list-item:hover
      background #e0e0e0
      cursor pointer
.order-list-res-tab-scroll
  height 195px
  overflow-y scroll
</style>


