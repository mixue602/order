<template>
<div class="block fr" >
    <el-pagination  layout="prev, pager, next"  :total="total"  @current-change="handleCurrentChange"  :page-size="pageSize"  :current-page="pageNum"  v-show="total>pageSize"></el-pagination>
</div>
</template>

<script type="text/ecmascript-6">
export default {
    /* total总页数，pageSize每页条数，pageNum第几页，pages总条数 */
      props: ['total','pageSize','pageNum'],
      methods: {
          /* 点击按钮换页，this.$parent是当前组件的父组件，即为 vm 对象 */
        handleCurrentChange(val){
            this.$emit( 'pageinfo',{'pageNum': val})
        }
    }
}
</script>
<style>
.fr{float:right}
</style>
