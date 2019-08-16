<template>
	<div>
		<div class="common-table ">
			<el-table :data="tableData" style="width: 100%" v-loading="loadingcharts" height="450">
				<el-table-column
					:prop="props1"
					:label="tabletile.label1"
					empty-text="--"
					min-width="150" 
					v-if="tabletile.label1">
				</el-table-column>
				<el-table-column
					:prop="props2"
					:label="tabletile.label2"
					empty-text="--"
					min-width="150"
					v-if="tabletile.label2">
				</el-table-column>				
				<el-table-column
					:prop="props3"
					:label="tabletile.label3"
					empty-text="--"
					min-width="150"
					v-if="tabletile.label3">
				</el-table-column>
				<el-table-column
					:prop="props4"
					:label="tabletile.label4"
					empty-text="--"
					min-width="150"
					v-if="tabletile.label4">
				</el-table-column>
				<el-table-column
					prop="skuNo"
					label="商品编码"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="skuName"
					label=" 商品名称"
					min-width="250">
				</el-table-column>
				<el-table-column
					prop="salesQty"
					label="销售数量"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="retailAmount"
					label="订单金额"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="dealAmount"
					label="实收金额"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="meiQuan"
					label="使用美券（无预算、领券）"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="meiDou"
					label="使用美豆"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="jichuzengDou"
					label="赠基础美豆"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="zengDou"
					label="赠促销美豆"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="deliveryId"
					label="配送单号"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="orderType"
					label="配送单状态"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="payTime"
					label="销售日期"
					min-width="180">
				</el-table-column>
				<el-table-column
					prop="sellerCode"
					label="促销员编码"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="sellerName"
					label="促销员名称"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="supplierNames"
					label="供应商名称"
					min-width="150">
				</el-table-column>
				<el-table-column
					prop="shipDates"
					label="发货日期"
					min-width="180">
				</el-table-column>
				<el-table-column
					prop="note"
					label="备注"
					min-width="150">
				</el-table-column>
			</el-table>
			<!-- 分页 -->
		<div class="report-page">
			<el-pagination
				background 
				@current-change="handleCurrentChange"
				:current-page="response.pager.currentPage"          
				:page-size="response.pager.pageSize"
				layout="total,prev, pager, next, jumper"
				:total="response.pager.totalSize">
			</el-pagination>
		</div>	
		</div>
			
	</div>
	
</template>
<style lang="scss">
@import "@/assets/styles/order-service/variable.scss";
@import "@/assets/styles/order-service/salesOrganization_list.scss";
@import "@/assets/styles/order-service/common.scss";
</style>
<script>
import { mapState } from "vuex";
import API from "@/api/order-service/salesReport";
import commonSalesReportTree from "@/components/order-service/common/commonSalesReportTree";
import commonSalesReportCategoryTree from "@/components/order-service/common/commonSalesReportCategoryTree";
import commonSalesReportColumnSetting from "@/components/order-service/common/commonSalesReportColumnSetting";
import Env from "@/api/env";


export default {
	props:{
		detailsProps:{}
	},
	data() {
		return {
			loadingcharts: false,
			tableData:[],
			form:{
				currentStoreCode: this.detailsProps.currentStoreCode, //登录门店id
				storeCodes: this.detailsProps.storeCodes, //销售部门
				mainCategoryCode: this.detailsProps.mainCategoryCode, //一级品类编码
				category2Code: this.detailsProps.category2Code, //二级分类编码
				brandCode: this.detailsProps.brandCode, //品牌编码/名称
				skuNo: this.detailsProps.skuNo, //商品编码
				skuName: this.detailsProps.skuName, //商品名称
				sellerCode: this.detailsProps.sellerCode, //促销员编码
				sellerName: this.detailsProps.sellerName, //促销员名称
				orderType: this.detailsProps.orderType, //零售单状态
				beginTime: this.detailsProps.beginTime, //开始日期
				endTime: this.detailsProps.endTime, //结束日期
				supplierCode: this.detailsProps.supplierCode, //供货商代码
				salesChannel: this.detailsProps.salesChannel, //渠道
				deliveryId: this.detailsProps.deliveryId, //配送单号
				businessType: this.detailsProps.businessType, //业务机型	
				showLevel:this.detailsProps.showLevel,//层级
				currentPage:1,
				pageSize:10,
			},
			showLevel:{
				"branch":"分部名称",
				"store":"销售门店",
				"category":"品类名称",
				"brand":"品牌"
			},
			showProps:{
				"branch":"branchName",
				"store":"storeName",
				"category":"categoryName",
				"brand":"brandName"
			},
			response:{
				pager:{},
				items:[]
			},
			orderStatus: [
				{value: 0, label: "全部"},
				{value: 1, label: "支付"},
				{value: 2, label: "取消"}
			]
		};
	},
	mounted() {
			this._querySalesTotalDetail();
			//this._getQuery();
		
	},
	methods: {
		// _getQuery(){
		// 	this.form ={

		// 		currentStoreCode: query.currentStoreCode, //登录门店id
		// 		storeCodes: query.storeCodes, //销售部门
		// 		mainCategoryCode: query.mainCategoryCode, //一级品类编码
		// 		category2Code: query.category2Code, //二级分类编码
		// 		brandCode: query.brandCode, //品牌编码/名称
		// 		skuNo: query.skuNo, //商品编码
		// 		skuName: query.skuName, //商品名称
		// 		sellerCode: query.sellerCode, //促销员编码
		// 		sellerName: query.sellerName, //促销员名称
		// 		orderType: query.orderType, //零售单状态
		// 		beginTime: query.beginTime, //开始日期
		// 		endTime: query.endTime, //结束日期
		// 		supplierCode: query.supplierCode, //供货商代码
		// 		salesChannel: query.salesChannel, //渠道
		// 		deliveryId: query.deliveryId, //配送单号
		// 		businessType: query.businessType, //业务机型	
		// 		showLevel:query.showLevel,//层级
		// 		currentPage:1,
		// 		pageSize:20,
		// 	}
			
		// },
		_querySalesTotalDetail(){
			const requestParms = this.form;
			//console.log(requestParms)
			this.loadingcharts = true;
			API.querySalesTotalDetail(requestParms).then(response =>{
				this.loadingcharts = false;
				if (response.success) {
					let _res= response.response;
					if(_res.items.length){
						_res.items.map((current, index) => {
							//数据为空时--占位处理
							for (let v in current) {
								
								if (typeof current[v] == 'undefined' || current[v] == null || current[v] == 'null' || parseInt(current[v]) == 'NAN') {
									current[v] = '--';
								}
								
							};
							//促销和美豆处理
							if(current.promoItems !="--"){
								const items = current.promoItems || [];
								let meiQuan = 0, //美券
									meiDou = 0, //美豆
									jichuzengDou = 0, //基础美豆
									zengDou = 0; //赠豆
								if (items.length > 0) {
									items.forEach((item) => {
										if (item.typeCode === "ZD67")
											current.meiQuan = (item.amount / 100).toFixed(2) || "0.00"; //美券
										if (item.typeCode === "ZD12" || item.typeCode === "ZD73")
											current.meiDou = (item.amount / 100).toFixed(2) || "0.00"; //美豆
										if (item.typeCode === "ZD20") current.jichuzengDou = jichuzengDou+item.amount;//基础美豆
										if (item.typeCode === "ZD11") current.zengDou = zengDou+item.amount; //赠豆

									});
								};
							};						
							current.meiQuan = (!current.meiQuan) ? "--" : ("美券" + current.meiQuan + "元");
							current.meiDou = (!current.meiDou) ? "--" : ("美豆" + current.meiDou + "元");
							current.jichuzengDou = (!current.jichuzengDou) ? "--" : ((current.jichuzengDou / 100).toFixed(2) + "元");
							current.zengDou = (!current.zengDou) ? "--" : ((current.zengDou / 100).toFixed(2) + "元");
							//配送单状态
							current.orderType = this.orderStatus.find((item) =>{
								return item.value === current.orderType;
							}).label;
							//名称为空改为其他
							current.categoryName =(current.categoryName =='-999') ? '其他' : current.categoryName;
							current.brandName =(current.brandName =='-999') ? '其他' : current.brandName;
							current.storeName =(current.storeName =='-999') ? '其他' : current.storeName;
							current.branchName =(current.branchName =='-999') ? '其他' : current.branchName;
						});
						this.tableData =_res.items;
					}
					this.response = response.response;			
				}

			})
		},
		handleCurrentChange(currentPage){//orderindexpage
			this.form.currentPage= currentPage;
			this._querySalesTotalDetail();               
		}
	},
	//vuex取值
	computed: mapState({
		LOGINDATA: "LOGINDATA",
		tabletile:function(){
			let data ={};
			//表格前四个的名称
			if(this.form.showLevel[0]){
				data.label1 = this.showLevel[this.form.showLevel[0].key];
			};
			if(this.form.showLevel[1]){
				data.label2 = this.showLevel[this.form.showLevel[1].key];
			};
			if(this.form.showLevel[2]){
				data.label3 = this.showLevel[this.form.showLevel[2].key];
			};
			if(this.form.showLevel[3]){
				data.label4 = this.showLevel[this.form.showLevel[3].key];
			};
			return data;
		},
		//表格前四个的取值
		props1:function(){
			return this.showProps[this.form.showLevel[0].key];
		},
		props2:function(){
			return this.showProps[this.form.showLevel[1].key];
		},
		props3:function(){
			return this.showProps[this.form.showLevel[2].key];
		},
		props4:function(){
			return this.showProps[this.form.showLevel[3].key];
		},
	}),
};
</script>
