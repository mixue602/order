<template>
  <div></div>
</template>
<script>
export default {
  created:function(){
    //这个页面为了解决router-link不能刷新当前页的bug
  },
  data(){
    this.$router.replace({
      path:'/service/billingpurchase/',
      query:{
        memberId:this.$route.query.memberId,
        memberCard:this.$route.query.memberCard,
        temporaryCardFlag:this.$route.query.temporaryCardFlag,
        sellerNum:this.$store.state.billingUsedParam.sellerNum,
        storeCode:this.$store.state.billingUsedParam.storeCode,
        siteType:this.$route.query.siteType
      }
    })
    return {

    }
  }
}
</script>
