<template>
<div class="block fr" >
    <el-pagination
      @size-change=""
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      v-show="total">
    </el-pagination>
	<div class="fr marT22" v-show="total">
		<el-button type="primary" size="mini">确定</el-button>
	</div>
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
.fr{
	float:right
}
.marT22{
	margin-top: 22px;
}
.padLR10{
	padding:0 10px;
}
.el-pagination{
	display: inline-block;
	margin:20px 0;
}
</style>
