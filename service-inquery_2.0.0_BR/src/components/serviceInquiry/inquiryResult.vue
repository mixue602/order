<template>
<div class="result-table center">
  <el-table
      :data="resultData.dataList"
      border
      empty-text="共查到0条记录"
      style="width: 100%"
      class="center"
      @sort-change="bindSortChange"
    >
      <el-table-column
        prop="sortId"
        label="排序"
        sortable
        v-if="isShowSortId"
        >
      </el-table-column>
      <el-table-column
        prop="skuNo"
        :sortable="isShowSort"
        label="商品编码"
        >
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="商品名称"
        >
      </el-table-column>
      
      <el-table-column
        v-if="storeType == 1"
        prop="masLocName"
        label="门店"
        >
      </el-table-column>
      <el-table-column :key="Math.random()"
        prop="supplierName"
        label="供应商(含代码)"
        >
         <template slot-scope="scope">{{ scope.row.supplierName + ' ' + scope.row.supplier}}</template>
      </el-table-column>
      <el-table-column
        prop="logicMasLocDesc"
        label="仓库(含代码)"
        :key="Math.random()"
        >
         <template slot-scope="scope" >{{ scope.row.logicMasLocDesc + ' ' + scope.row.logicMasLoc}}</template>
      </el-table-column>
      <el-table-column
        prop="poolFlag"
        label="自营/联营"
        :key="Math.random()"
        >
         <template slot-scope="scope">{{ scope.row.poolFlag == 'Y' ? '联营' : '非联营'}}</template>
      </el-table-column>
      <el-table-column
        prop="itemTypeName"
        label="业务机型"
        >
      </el-table-column>
      <el-table-column
        prop="qty"
        label="在库可卖数"
        >
      </el-table-column>
      <el-table-column
        v-if="storeType == 2"
        prop="abQty"
        label="在途可卖数"
        >
      </el-table-column>
    </el-table>
    <div class="inquiry-page" v-if="resultData.dataList && resultData.dataList.length>0 && resultData.totalNum > 50">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next"
        :current-page="resultData.currentPage"
        :page-sizes="[10,20,50]"
        :page-size="resultData.pageSize"
        :total="resultData.totalNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    resultData:{
      type: Object,
      required: true,
    },
    storeType: {
      type: String,
      default: 1
    }
  },
  data() {
    return {
      isShowSortId: false,//之所以这么做是因为，如果不怎增加一个排序字段，这会默认对商品编码进行排序，而要求点查询时不对商品编码进行排序
    }
  },
  computed: {
    isShowSort() {
       if(this.resultData && this.resultData.dataList &&  this.resultData.dataList.length>1) {
         return 'custom';
       }else {
         return false;
       }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("totalSearchByPage",val);
    },
    bindSortChange(data) {
      console.log(data,'排序改变事件')
      let sortField = (data.prop == 'skuNo' ? 'SKU_NO' : 'QTY');
      let sort = (data.order == 'descending' ? 'ASC' : 'DESC')
      this.$emit("bindSortChange",{
        sortField: sortField,
        sort: sort
      });
    },
  }
}
</script>
<style lang="stylus">
.el-table th
  text-align center

.has-gutter th
  background #eef6ff
  font-size 14px
  color #909399

.inquiry-page
  background #fff
  text-align center
  margin 0 0 15px
  padding 15px 0 15px 0
</style>
