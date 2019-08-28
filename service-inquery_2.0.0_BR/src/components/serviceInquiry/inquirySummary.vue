<template>
<div class="result-table center">
  <el-table
      :data="summary"
      border
      empty-text="共查到0条记录"
      style="width: 100%"
      class="center"
    >
      <el-table-column
        prop="skuNo"
        label="商品编码"
        >
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="仓库类型"
        >
      </el-table-column>
      <el-table-column
        prop="qty"
        label="在库可卖数"
        >
      </el-table-column>
      <el-table-column
        prop="abQty"
        label="在途可卖数"
        v-if="storeType != 1"
        :key="Math.random()"
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:{
    summary: {
      type: Array,
    },
    storeType: {
      type: String,
      default: 1
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style lang="stylus">
.el-table th
  text-align center
</style>
