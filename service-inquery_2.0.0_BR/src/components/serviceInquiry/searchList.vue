<template>
  <div class="list">
    <ul v-if="querySellData.skuList">
      <li
        class="search-item"
        v-for="item in querySellData.skuList"
        :key="item.id"
        @click="returnText({inputName:item.skuName,sku:item.skuNo})"
      >
      <span class="item-name" :title="item.skuName">{{item.skuName}}</span>
      <span class="item-code">{{item.skuNo}}</span>
      </li>
    </ul>
    <ul v-else-if="querySellData.brandList">
      <li
        class="search-item"
        v-for="item in querySellData.brandList"
        :key="item.id"
        @click="returnText({inputBrand:item.brandName,brand:item.brandCode})"
      >
      <span class="item-name" :title="item.brandName">{{item.brandName}}</span>
      <span class="item-code">{{item.brandCode}}</span>
      </li>
    </ul>
    <ul v-else-if="querySellData.supplierList">
      <li
        class="search-item"
        v-for="item in querySellData.supplierList"
        :key="item.id"
        @click="returnText({inputSupplier:item.supplierName,inputSupplierCode:item.supplierCode})"
      >
      <span class="item-name" :title="item.supplierName">{{item.supplierName}}</span>
      <span class="item-code">{{item.supplierCode}}</span>
      </li>
    </ul>
    <div v-else>
      <div class="center nodata">{{querySellData.nodata}}</div>
    </div>
    <div class="page"
      v-if="querySellData.pager && querySellData.pager.totalSize && querySellData.pager.totalSize > 10"
    >
      <el-pagination
        :class="['pager',querySellData.pager.totalSize < 10000 ? 'scale80' : 'scale75']"
        v-if="querySellData.pager.totalSize"
        @current-change="handleCurrentChange"
        background
        small
        :pager-count="5"
        layout="total, prev, pager, next"
        :current-page="querySellData.pager.currentPage"
        :page-sizes="[10,20,50]"
        :page-size="querySellData.pager.pageSize"
        :total="querySellData.pager.totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      querySellData:{
        type: Object,
        required: true,
      }
    },
    data() {
      return {

      }
    },
    methods: {
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`)
        this.$emit("outputGoodListByPage",val);
      },
      returnText(json){
        this.$emit("returnText",json);
      }
    }
  };
</script>

<style lang="stylus" scoped>
.center
  text-align center
.scale80
  margin-left -10%
  transform scale(0.8)
  -webkit-transform scale(0.8)
.scale75
  margin-left -12%
  transform scale(0.75)
  -webkit-transform scale(0.75)

.pager
  /*text-align right*/
.list-blank
  padding-top 80px
  color #333
.list
  background #ffffff
  border 1px solid #ccc
  color #333
  min-height 200px

  ul
    margin-bottom 10px
    li
      padding-left 5px
      height 2em
      line-height 2em
      cursor pointer
      display flex
      &:hover
        background #e3e3e3
      span.item-name
        flex 6
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        padding-right 5px
      span.item-code
        flex 1
        padding-right 5px
        text-align right
.nodata
  margin-top 80px
</style>

