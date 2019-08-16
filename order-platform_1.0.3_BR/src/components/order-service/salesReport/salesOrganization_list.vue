<template>
	<div>
		<el-row style="text-align:right;margin-bottom:10px;">
		<span v-if="data5 && data5.length > 0">
			<el-button v-if="LOGINDATA.salesOrganization_list_export" type="primary" plain size="small" @click="handleExport()" title="只能导出30天内数据">导出</el-button>
      <el-button type="primary" plain size="small" v-show="showDownloadLink" @click="handleDownload">下载</el-button>
		</span>
    <el-row v-show="showProgerssBar">
			<el-progress class="sr-progress" :text-inside="true" :percentage="percentage"></el-progress>
		</el-row>
	</el-row>
	
	<el-container class="salesOrganization_list">	
	<el-form class="so-list__form"
				ref="so-list__form"
				:rules="rules"
				:inline="true"
				:model="form"
				size="mini"
				@submit.native.prevent
				data-before="查询条件">
		<el-row class="el-levels-wrapper">
			<el-form-item label="展示层级：" class="el-levels-items">
				<el-select size="mini"
							v-model="form.firstDepartment"
							class="el-levels-select"
							data-before="一级"
							placeholder="请选择"
							@change="changeFirstDepartment">
					<el-option v-for="(item, index) in firstDepartmentList"
								:label="item.label" :value="item.value"
								:key="index">
					</el-option>
				</el-select>
				<el-select size="mini"
							v-model="form.secondStore"
							:disabled = "secondStoreFlag"
							class="el-levels-select"
							data-before="二级"
							placeholder="请选择"
							@change="changeSecondStore">
					<el-option v-for="(item, index) in secondStoreList"
								:label="item.label" :value="item.value"
								:key="index">
					</el-option>
				</el-select>
				<el-select size="mini"
							v-model="form.thirdCategory"
							:disabled = "thirdCategoryFlag"
							class="el-levels-select"
							data-before="三级"
							placeholder="请选择"
							@change="changeThirdCategory">
					<el-option v-for="(item, index) in thirdCategoryList"
								:label="item.label" :value="item.value"
								:key="index">
					</el-option>
				</el-select>
				<el-select size="mini"
							v-model="form.forthBrand"
							:disabled = "forthBrandFlag"
							class="el-levels-select"
							data-before="四级"
							placeholder="请选择"
							@change="changeForthBrand">
					<el-option v-for="(item, index) in forthBrandList"
								:label="item.label" :value="item.value"
								:key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="渠道：">
				<el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="all">全部</el-checkbox>
				<el-checkbox-group v-model="checkedchannel" class="el-channels-checkbox" @change="handleCheckedChannelChange">
					<el-checkbox v-for="(channel, index) in channelList"
						:label="channel" :value="channel"
						:key="index">
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>	
		</el-row>		
		<!--表单查询 start-->
		<el-row class="input-group-wrapper">
			
			<el-row class="input-group">
				<!--销售部门 start-->
				<commonSalesReportTree @getSaleDepartmentsId="getSaleDepartmentsId" ref="salesReportTree" :treewidth="true"></commonSalesReportTree>
				<!--销售部门 end-->
				<!--品类 start-->
				<commonSalesReportCategoryTree @getBrandId="getBrandId" ref="salesReportTreebrand" :treewidth="true"></commonSalesReportCategoryTree>
				<!--品类 end-->		
				<el-form-item label="品牌编码：" style="width:451px;">
					<el-input style="width:200px" placeholder="请输入品牌编码" v-model="form.brandCode"></el-input>
					<el-button type="text" @click="showDialog('dialogGetBrandCode')">查看品牌编码</el-button>
				</el-form-item>
				<el-form-item label="日期：">
					<el-date-picker
						v-model="changeDate"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-value="defaultDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商品编码：">
					<el-input placeholder="请输入商品编码" v-model="form.skuNo"></el-input>
				</el-form-item>
				<el-form-item label="商品名称：">
					<el-input placeholder="请输入商品名称" v-model="form.skuName"></el-input>
				</el-form-item>
				<el-form-item label="促销员编码：" v-show="showMoreFlag">
						<el-input placeholder="请输入促销员编码" v-model="form.sellerCode"></el-input>
				</el-form-item>
				<el-form-item label="促销员名称：" v-show="showMoreFlag">
					<el-input placeholder="请输入促销员名称" v-model="form.sellerName"></el-input>
				</el-form-item>
				<el-form-item label="零售单状态：" v-show="showMoreFlag">
					<el-select v-model="form.orderType" placeholder="请选择">
						<el-option v-for="(item, index) in sellRetailStatusList"
									:label="item.label" :value="item.value"
									:key="index">
						</el-option>
					</el-select>
				</el-form-item>				
				<el-form-item label="供应商编码：" v-show="showMoreFlag">
					<el-input placeholder="请输入供应商编码" v-model="form.supplierCode"></el-input>
				</el-form-item>
				<el-form-item label="业务机型：" v-show="showMoreFlag">
					<el-select v-model="form.businessType" placeholder="请选择">
						<el-option v-for="(item, index) in businessModelsList"
									:label="item.label" :value="item.value"
									:key="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="配送单号：" v-show="showMoreFlag">
					<el-input placeholder="请输入配送单号" v-model="form.deliveryId"></el-input>
				</el-form-item>
			</el-row>
		</el-row>
		<el-row class="btn-group">
			<a href="javascript:;" class="btn-show-more" @click="bindShowMoreEvent">{{showMoreText}}<i :class="showMoreFlag?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
		</el-row>	
		<el-row class="btn-group">
			<el-button size="mini" @click="resetForm()">重置</el-button>
			<el-button size="mini" type="primary" native-type="submit" :loading="loading" @click="query()">查询</el-button>
		</el-row>
		<!--表单查询 end-->
		<!--查询品牌编码弹窗 start-->
		<el-dialog title="查询品牌编码" :visible.sync="dialogGetBrandCode">
			<el-form :model="formBrand" ref="formBrand" :rules="rulesFormBrand" size="mini" @submit.native.prevent>
				<el-form-item label="品牌编码或名称" prop="brandCodeOrName">
				<el-input v-model="formBrand.brandCodeOrName"></el-input>
				</el-form-item>
				<el-form-item>
				<el-button size="mini" type="primary" native-type="submit"
							:loading="formBrand.loading"
							@click="getBrandCodeLists('formBrand')">查询
				</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="BrandCodeLists" v-loading="formBrand.loading" @row-click="checkedFormBrand">
				<el-table-column property="brandCode" label="品牌编码" width="200"></el-table-column>
				<el-table-column property="brandName" label="品牌" width="200"></el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChangeByBrandCode"
				background
				:current-page="formBrand.page.currentPage"
				:page-size="formBrand.page.pageSize"
				v-if="formBrand.page.totalPage>1"
				layout="total, prev, pager, next"
				:total="formBrand.page.totalPage">
			</el-pagination>
		</el-dialog>
		<!--查询品牌编码弹窗 end-->
	</el-form>

	<!-- <el-row class="so-charts-wrapper" v-if="chartData && chartData.length > 0"> -->
	<el-row class="so-contralbox">
		<!-- <span v-if="data5 && data5.length > 0">
			<a size="mini" href="javascript:void(0)" class="btn-download" v-show="showDownloadLink" @click="handleDownload">下载</a> -->
			<span class="tabletip">注：以下为金力、来购、美店分享实时数据</span>
		<!-- </span> -->
	</el-row>
	<el-row class="so-charts-wrapper" v-loading="loadingcharts" v-if="(positionLevel ==1)">
		<el-row class="so-charts-header" v-if="totalSalesAmount || totalSalesQty">
			<span class="total-price" data-before="销售额：" data-after="元">{{totalSalesAmount}}</span>
			<span class="total-quantities" data-before="销售数量：" data-after="台">{{totalSalesQty}}</span>
		</el-row>
		<el-row class="so-charts-content" v-if="chartData && chartData.length > 0">
			<span class="legend-color">销售额</span>
			<el-row class="so-charts-list">
				<ul>
				<li v-for="(item, index) in chartData" :key="index">
					<span class="txt-name">{{item.regionName}}</span>
					<div class="progress-wrapper">
					<!--<span class="progress" :style="{ width: item.percent + '%', opacity: (1/(index+1)).toFixed(2) }"></span>-->
					<span class="progress" :style="item._style"></span>
					<span class="txt-price">{{item.salesAmount}}元</span>
					</div>
				</li>
				</ul>
			</el-row>
		<!--图表 start-->
		<!-- <barchart :lineData="chartData"></barchart> -->
		<!--图表 end-->
		</el-row>
	</el-row>
	<el-row v-loading="loadingtable" style="margin-top:20px;">
		<el-row class="so-tree-list" :class="{borderbot: data5.length==0}">		
			<el-row class="tree-header">
				<ul>
					<li>展示层级</li>
					<li>销售额（元）</li>
					<li>销售数量</li>
					<li>销售额同比
						<el-tooltip class="item" effect="light" content="计算公式：销售额同比（（今年-去年）/去年*100%）" placement="top">
							<i class="el-icon-question"></i>
						</el-tooltip>
					</li>
					<li>同期销售额</li>
					<li>实付额</li>
					<li>操作</li>
				</ul>
			</el-row>
			<el-row class="tree-content">
				<el-tree :data="data5"  :load="loadNode" lazy :props="defaultProps" node-key="id" accordion :indent="10">
					<el-row :class="'tree-node-row tree-node-row'+node.level" slot-scope="{ node, data }">
						<span class="tree-node-cell" :class="'treeNode'+node.level">{{ data.showName =='-999' ? '其他' : data.showName }}</span>
						<span class="tree-node-cell"><b class="fontnormal" v-if="data.salesAmount">{{data.salesAmount}}</b><b class="fontnormal" v-else>--</b></span>
						<span class="tree-node-cell"><b class="fontnormal" v-if="data.salesQty !='' || data.salesQty !=null">{{data.salesQty}}</b><b class="fontnormal" v-else>--</b></span>
						<span class="tree-node-cell">{{ data.salesAmountTb ? data.salesAmountTb+"%" : '--' }}</span>
						<span class="tree-node-cell">{{ data.salesAmountTq ? data.salesAmountTq : '--' }}</span>
						<span class="tree-node-cell">{{ data.dealAmount ? data.dealAmount : '--' }}</span>
						<span class="tree-node-cell" v-if="node.level !=1">
							<a @click.stop="() => jumpto(node, data)" class="btn-normal" target="_blank">查看详情</a>
							<!-- <a @click="dialogTableVisible = true" class="btn-normal" target="_blank">查看详情</a> -->
						</span>
						<span v-else  class="tree-node-cell">--</span>
					</el-row>
				</el-tree>
			</el-row>
		</el-row>
	</el-row>
	<el-dialog title="查看详情" :visible.sync="dialogTableVisible" class="detailsdialog">
		<commonsalesOrganizationDetails v-if="dialogTableVisible" :detailsProps="parms"></commonsalesOrganizationDetails>
	</el-dialog>

	</el-container>
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
import commonsalesOrganizationDetails from "@/components/order-service/common/commonsalesOrganizationDetails";
import Env from "@/api/env";
/**
   * 对日期处理
   * return type 参数展示格式
   */
function getParseTime(times) {
  if (!times) {
    return {
      type: {
        start: "",
        end: ""
      }
    };
  }
  let start = new Date(times[0]),
    end = new Date(times[1]);

  function _formatByGe(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  function format(date) {
    return (
      date.getFullYear() +
      "-" +
      _formatByGe(date.getMonth() + 1) +
      "-" +
      _formatByGe(date.getDate()) +
      " " +
      _formatByGe(date.getHours()) +
      ":" +
      _formatByGe(date.getMinutes()) +
      ":" +
      _formatByGe(date.getSeconds())
    );
  }

  return {
    type: {
      start: format(start),
      end: format(end)
    }
  };
}

function getQueryParams(content) {
  const date = getParseTime(content.changeDate).type;
  return {
    currentStoreCode: content.form.currentStoreCode, //登录门店id
    storeCodes: content.form.storeCodes, //销售部门
    mainCategoryCode: content.form.mainCategoryCode, //一级品类编码
    category2Code: content.form.category2Code, //二级分类编码
    brandCode: content.form.brandCode, //品牌编码/名称
    skuNo: content.form.skuNo, //商品编码
    skuName: content.form.skuName, //商品名称
    sellerCode: content.form.sellerCode, //促销员编码
    sellerName: content.form.sellerName, //促销员名称
    orderType: content.form.orderType, //零售单状态
    beginTime: date.start, //开始日期
    endTime: date.end, //结束日期
    supplierCode: content.form.supplierCode, //供货商代码
    salesChannel: (typeof content.form.salesChannel =="object") ? content.form.salesChannel.join(',') :'16,13,10', //渠道
    deliveryId: content.form.deliveryId, //配送单号
    businessType: content.form.businessType, //业务机型
    showLevel: content.showLevel //层级
  };
};
function delcommafy(num) {
  if (num != undefined) {
    num = num.toString();
    num = num.replace(/[ ]/g, ""); //去除空格  
    num = num.replace(/,/gi, '');
    return Number(num);
  }
}
export default {
  data() {
    return {
		formsubmitdata:"",
		dialogTableVisible:false,//查看详情弹层	
		treewidth:'451px',
		checkAll: true, //渠道全选
		isIndeterminate: true, //渠道全选
		//loading: false,
		loadingcharts: false,
		loadingtable: false,
		dialogGetBrandCode: false, //查询品牌弹层
		dialogGetSupplierCode: false, //查询品牌弹层
		expand: "expand",
		header: {
			content: "查询条件" // tit名字
		},
		formBrand: {},
		rulesFormBrand: {
			brandCodeOrName: [{ required: true, message: "请输入", trigger: "blur" }]
		},
		BrandCodeLists: [],
		show: {
			showTime: { start: "", end: "" },
			totalSalesAmount: "--", //销售金额总计
			totalSalesQty: "--", //销售数量总计
			totalPayAmount: "--"
		},
		page: {
			currentPage: 1,
			pageSize: 10,
			totalPage: 1
		},
		form: {
			currentStoreCode: "", //登录门店id
			storeCodes: "", //部门
			mainCategoryCode: "", //一级品类编码
			category2Code: "", //二级分类编码
			brandCode: "", //品牌编码/名称
			skuNo: "", //商品编码
			skuName: "", //商品名称
			sellerCode: "", //促销员编码
			sellerName: "", //促销员名称
			orderType: 0, //零售单状态
			beginTime: "", //开始日期
			endTime: "", //结束日期
			supplierCode: "", //供货商代码
			salesChannel: "16,13,10", //渠道
			deliveryId: "", //配送单号
			businessType: "", //业务机型
			firstDepartment: "branch", //一级分部
			secondStore: "store", //二级门店
			thirdCategory: "category", //三级品类
			forthBrand: "brand", //四级品牌
			times: [] //时间
		},
		pickerStart: {
			disabledDate: time => {
			return time.getTime() < new Date("2019-01-01").getTime();
			}
		},
		defaultDate: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)],
		changeDate: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)],
		//零售单状态
		sellRetailStatusList: [
			{ value: 0, label: "全部" },
			{ value: 1, label: "支付" },
			{ value: 2, label: "取消" }
		],
		//渠道
		channelList: ["来购", "美店分享", "金力"],
		channelListVal: [16, 13, 10],
		checkedchannel: ["来购", "美店分享", "金力"],
		configItmesAll: [
			{
			label: "分部代码",
			prop: "salesOrgCode",
			className: "hide",
			width: 100,
			disabled: false
			},
			{
			label: "分部名称",
			prop: "salesOrgName",
			className: "show",
			width: 150,
			disabled: false
			},
			{
			label: "销售门店代码",
			prop: "storeCode",
			className: "hide",
			width: 120,
			disabled: false
			},
			{
			label: "销售门店",
			prop: "storeName",
			className: "show",
			width: 150,
			disabled: false
			}
		],
		rules: {},
		chartData: [],
		//一级分部
		firstDepartmentList: [
			{ value: "branch", label: "分部" },
			{ value: "store", label: "门店" },
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" }
		],
		secondStoreList: [
			{ value: "store", label: "门店" },
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" },
			{ value: "0", label: "不选" }
		], //二级门店
		thirdCategoryList: [
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" },
			{ value: "0", label: "不选" }
		], //三级品类
		forthBrandList: [{ value: "brand", label: "品牌" },{ value: "0", label: "不选" }], //四级品牌
		firstDepartmentFlag: true, //一级分部
		secondStoreFlag: false, //二级门店
		thirdCategoryFlag: false, //三级品类
		forthBrandFlag: false, //四级品牌
		//业务机型
		businessModelsList: [
			{ value: '', label: "全部" },
			{ value: '01', label: "标准商品" },
			{ value: '02', label: "包销机" },
			{ value: '03', label: "定制机" },
			{ value: '04', label: "临采机" },
			{ value: '05', label: "特价机" },
			{ value: '06', label: "工程机" },
			{ value: '07', label: "会员商品" },
			{ value: '08', label: "赠品" },
			{ value: '09', label: "样机" },
			{ value: '11', label: "一步到位价" },
			{ value: '15', label: "免费赠品" },
			{ value: '16', label: "返利机" }
		],
		showMoreFlag: false,
		showMoreText: "点击查看更多",
		isShowMoreText: false,
		data5: [],
		totalSalesAmount: "", //销售额
		totalSalesQty: "", //销售数量
		totalListData: [], //表格数据
		positionLevel:'',//人员级别
		defaultProps: {
			label: "showName",
			children: "children",
			isLeaf: 'leaf'
		},
		parms: "",
		showDownloadLink: false, //下载
		percentage: 0,
		showProgerssBar: false, //导出
		cookieDomain: "",
		showLevelTabel:[]
    };
  },
  //vuex取值
  computed: mapState({
    LOGINDATA: "LOGINDATA",
    showLevel: function() {
		let showLevel = [];
		let newLevelArr = [];
		if (this.form.firstDepartment) {
			newLevelArr[0] = this.form.firstDepartment;
		}
		if (this.form.secondStore && this.form.secondStore!='0') {
			newLevelArr[1] = this.form.secondStore;
		}
		if (this.form.thirdCategory && this.form.thirdCategory !="0") {
			newLevelArr[2] = this.form.thirdCategory;
		}
		if (this.form.forthBrand && this.form.forthBrand !="0") {
			newLevelArr[3] = this.form.forthBrand;
		}
		newLevelArr.map((item, index) => {
			let obj = { 
				key: item,
				value: ""
			};
			showLevel.push(obj);
		});
		return showLevel;
	},
	loading:function(){
		return (this.loadingcharts && this.loadingtable) ? true : false
	}
  }),
  components: {
    commonSalesReportTree,
    commonSalesReportCategoryTree,
	commonsalesOrganizationDetails
  },
  created() {
    this.init();
  },
  mounted() {
    const that = this;
    this.query();
    this.getParms();
  },
  methods: {
    init() {
      this._initFormBrand();
      this.form.times = [new Date(), new Date()];
    },
    jumpto(node, data) {
		// console.log(data)
		// console.log(node)
		var requestParms = this.formsubmitdata;
		let index = node.level - 1;
		requestParms.showLevel[index].value = node.label;
		if (node.level === 1) {
			//this.showLevel[0].value = node.label;
			//this.showLevel为计算属性，循环更改会报错
			if(requestParms.showLevel.length ==2){
			requestParms.showLevel[1].value = "";
			}else if(requestParms.showLevel.length ==3){
			requestParms.showLevel[1].value = "";
			requestParms.showLevel[2].value = "";
			}else if(requestParms.showLevel.length >=4){
			requestParms.showLevel[1].value = "";
			requestParms.showLevel[2].value = "";
			requestParms.showLevel[3].value = "";
			} 
		}else if(node.level === 2) {
			//this.showLevel[0].value = node.label;
			//this.showLevel为计算属性，循环更改会报错
			if(requestParms.showLevel.length ==3){
			requestParms.showLevel[2].value = "";
			}else if(requestParms.showLevel.length >=4){
			requestParms.showLevel[2].value = "";
			requestParms.showLevel[3].value = "";
			} 
		}else if(node.level === 3) {
			//this.showLevel[0].value = node.label;
			//this.showLevel为计算属性，循环更改会报错
			if(requestParms.showLevel.length ==4){
			requestParms.showLevel[3].value = "";
			}
		};
      setTimeout(() =>{

		this.parms = JSON.parse(JSON.stringify(this.formsubmitdata));
		this.dialogTableVisible=true;
	  },500)
		
      
    },
    //渠道全选
    handleCheckAllChange(val) {
      this.form.salesChannel = val ? this.channelListVal : [];
      this.checkedchannel = val ? this.channelList : [];
      this.isIndeterminate = false;
    },
    handleCheckedChannelChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.channelList.length;
    },
    //点击更多事件
    bindShowMoreEvent() {
      if (this.showMoreFlag) {
        this.showMoreFlag = false;
        this.showMoreText = "点击查看更多";
      } else {
        this.showMoreFlag = true;
        this.showMoreText = "点击收起";
      }
    },
    //设置进度条样式
    setProcessBarStyle() {
      this.chartData.map((item, index) => {
		 // Math.round(item.salesAmount / this.totalSalesAmount * 10000)
		 let  totalSalesAmount = delcommafy(this.totalSalesAmount);
        item._style = {
          width: delcommafy(item.salesAmount) / totalSalesAmount * 10000 / 100.0 + "%"
          //opacity: (1 / (index + 1)).toFixed(2)
        };
      });
    },
    //调用子组件的方法获得id值
    getSaleDepartmentsId(data) {
      this.form.storeCodes = data.storeCodes;
    },
    //调用子组件的方法获得id值
    getBrandId(data) {
      this.form.mainCategoryCode = data.mainCategoryCode;
      this.form.category2Code = data.category2Code;
    },
    query() {
		//查询
		if(this.showLevel.length ==1){
			this.showLevel[0].value = "";
		}else if(this.showLevel.length ==2){
			this.showLevel[0].value = "";
			this.showLevel[1].value = "";
		}else if(this.showLevel.length ==3){
			this.showLevel[0].value = "";
			this.showLevel[1].value = "";
			this.showLevel[2].value = "";
		}else{
			this.showLevel[0].value = "";
			this.showLevel[1].value = "";
			this.showLevel[2].value = "";
			this.showLevel[3].value = "";
		}
		var requestParms = getQueryParams(this);
		this.formsubmitdata = requestParms;
		this._queryChartmesg(requestParms); //柱状图
		this._querySalesTotalList(requestParms); //表格
    },
    getParms() {
      this.parms = getQueryParams(this);
    },
    //柱状图
    _queryChartmesg(requestParms) {
      this.loadingcharts = true;
      
      API.querySalesTotalRegion(requestParms).then(response => {
        this.loadingcharts = false;
        if (response.success) {
			var result = response.response;

			this.positionLevel = result.positionLevel;
			if (result.salesTotal) {
				this.totalSalesAmount = result.salesTotal.totalSalesAmount;
				this.totalSalesQty = result.salesTotal.totalSalesQty;
			}else{
				this.totalSalesAmount = "";
				this.totalSalesQty = "";
			}
			this.chartData = result.items;
			if (result.items && result.items.length) {
				this.setProcessBarStyle();
			}
        }else{
			this.$message({
				message: '服务器开小差儿了，请稍后再试~',
				type: 'warning'
			});
		}
      });
    },
    /**
       * 一级分部选择事件
       * 1.将一级列表数据中被选中的过滤掉剩下的值赋值给二级列表
       * 2.如果一级选择不选，二级置灰不可选
       * 3.将三级四级数据清空，并且置灰以防来回切换数据不能正确显示
       */
    changeFirstDepartment() {
		let _this = this;
		this.secondStoreList = this.firstDepartmentList.filter(
			item => item.value != _this.form.firstDepartment && item.value != "0" 
		);
		this.secondStoreList.push({ value: "0", label: "不选" })
		this.form.firstDepartment == 4
			? (this.secondStoreFlag = true)
			: (this.secondStoreFlag = false);
		this.form.secondStore = "";

		//置灰三级
		this.thirdCategoryList = [];
		this.thirdCategoryFlag = true;
		this.form.thirdCategory = "";

		//置灰四级
		this.forthBrandList = [];
		this.forthBrandFlag = true;
		this.form.forthBrand = "";
    },
    /**
       * 二级门店选择事件
       * 1.将二级列表数据中被选中的过滤掉剩下的值赋值给三级列表
       * 2.如果二级选择不选，三级置灰不可选
       * 3.将四级数据清空，并且置灰以防来回切换数据不能正确显示
       */
    changeSecondStore() {
		let _this = this;
		this.thirdCategoryList = this.secondStoreList.filter(
			item => item.value != _this.form.secondStore  && item.value != "0" 
		);
		this.thirdCategoryList.push({ value: "0", label: "不选" });
		(this.form.secondStore == 4 || this.form.secondStore ==0)
			? (this.thirdCategoryFlag = true)
			: (this.thirdCategoryFlag = false);
		this.form.thirdCategory = "";

		//置灰四级
		this.forthBrandList = [];
		this.forthBrandFlag = true;
		this.form.forthBrand = "";
    },
    /**
       * 三级品类选择事件
       * 1.将三级列表数据中被选中的过滤掉剩下的值赋值给四级列表
       * 2.如果三级选择不选，四级置灰不可选
       */
    changeThirdCategory() {
		let _this = this;
		this.forthBrandList = this.thirdCategoryList.filter(
			item => item.value != _this.form.thirdCategory && item.value != "0" 
		);
		this.forthBrandList.push({ value: "0", label: "不选" });
		(this.form.thirdCategory == 4 || this.form.thirdCategory == 0)
		? (this.forthBrandFlag = true)
		: (this.forthBrandFlag = false);
		this.form.forthBrand = "";
    },
    /**
       * 四级品牌选择事件
       */
    changeForthBrand() {},
    resetForm() {
		//重置
		let _this = this;
		this.secondStoreFlag = false;
		this.thirdCategoryFlag = false;
		this.forthBrandFlag = false;
		this.secondStoreList = [];
		this.thirdCategoryList = [];
		this.forthBrandList = [];
		this.form.firstDepartment = "branch";
		this.form.secondStore = "store";
		this.form.thirdCategory = "category";
		this.form.forthBrand = "brand";
		this.showLevel[0].value = "";
		this.showLevel[1].value = "";
		this.showLevel[2].value = "";
		this.showLevel[3].value = "";
		this.form.storeCodes = [];
		this.form.store = "";
		this.form.brandCode = "";
		this.form.skuNo = "";
		this.form.skuName = "";
		this.form.orderType = 0;
		this.form.sellerCode = "";
		this.form.sellerName = "";
		this.form.supplierCode = "";
		this.form.businessModels = "";
		this.form.deliveryId = "";
		this.form.currentStoreCode = "";
		this.form.businessType = "";
		this.changeDate =  [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)];
		this.firstDepartmentList = [
			//一级分部
			{ value: "branch", label: "分部" },
			{ value: "store", label: "门店" },
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" }
		];
		this.secondStoreList = [
			//二级门店
			{ value: "store", label: "门店" },
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" },
      { value: "0", label: "不选" }
		];
		this.thirdCategoryList = [
			//三级品类
			{ value: "category", label: "品类" },
			{ value: "brand", label: "品牌" },
      { value: "0", label: "不选" }
		];
		this.forthBrandList = [
			//四级品牌
			{ value: "brand", label: "品牌" },
      { value: "0", label: "不选" }
		];
		this.checkAll = true;
			this.checkedchannel = ["来购", "美店分享", "金力"];
			this.form.salesChannel = "16,13,10";
		this.form.mainCategoryCode = ""; //品类编码
		this.form.category2Code = ""; //二级分类编码
		//重置操作需要清空分部列表和部门树勾选状态，因为通过获取dom元素来更新数据，所以放在this.$nextTick()中
		this.$nextTick(() => {
			_this.$refs.salesReportTree.checkedTreeItems = [];
			_this.$refs.salesReportTreebrand.checkedTreeItems = [];
			_this.$refs.salesReportTree.setCheckedKeys();
			_this.$refs.salesReportTreebrand.setCheckedKeys();
		});
		this.query(); //重新查询
    },
    loadNode(node, resolve) {
		var requestParms = this.formsubmitdata;
      //表格层级查询
      //console.log('node:'+node.label+"node.level:"+node.level)
      if (node.level === 0 || node.level== requestParms.showLevel.length) {
        return resolve([]);
	  };
	  if(node.level== requestParms.showLevel.length-1){
		  var isLeaf = true;
	  }else{
		  var isLeaf = false;
	  };
      if (node.level === 1) {
        //this.showLevel[0].value = node.label;
        //this.showLevel为计算属性，循环更改会报错
        if(requestParms.showLevel.length ==2){
          requestParms.showLevel[1].value = "";
        }else if(requestParms.showLevel.length ==3){
          requestParms.showLevel[1].value = "";
          requestParms.showLevel[2].value = "";
        }else if(requestParms.showLevel.length >=4){
          requestParms.showLevel[1].value = "";
          requestParms.showLevel[2].value = "";
          requestParms.showLevel[3].value = "";
        } 
      }else if(node.level === 2) {
        //this.showLevel[0].value = node.label;
        //this.showLevel为计算属性，循环更改会报错
        if(requestParms.showLevel.length ==3){
          requestParms.showLevel[2].value = "";
        }else if(requestParms.showLevel.length >=4){
          requestParms.showLevel[2].value = "";
          requestParms.showLevel[3].value = "";
        } 
      }else if(node.level === 3) {
        //this.showLevel[0].value = node.label;
        //this.showLevel为计算属性，循环更改会报错
        if(requestParms.showLevel.length ==4){
          requestParms.showLevel[3].value = "";
        }
      };

      if (node.level >= 1) {
        let index = node.level - 1;
        requestParms.showLevel[index].value = node.label;
      }

	  //console.log(requestParms);
      setTimeout(() => {
        var data = [];
		let requestParms =this.formsubmitdata;
        API.querySalesTotalList(requestParms).then(response => {
			if (response.success) {
				if (response.response.items) {
					if(isLeaf){
						response.response.items.map( (item) =>{
							item.leaf=true;
						})
					};
					data = response.response.items;
					resolve(data);
				} else {
					resolve([]);
				}
			} else {
				this.$message({
					message: '服务器开小差儿了，请稍后再试~',
					type: 'warning'
				});		
				resolve([]);
			}
        });
      }, 500);
    },
    _querySalesTotalList(requestParms) {
	  //查询表格
	  	this.loadingtable = true;
		this.showDownloadLink = false;
		API.querySalesTotalList(requestParms).then(response => {
			this.loadingtable = false;
			if (response.success) {
				this.form.currentStoreCode = response.response.userId;	  
				if (response.response.items && response.response.items.length) {
					if(this.showLevel.length==1){
						response.response.items.map( (item) =>{
							item.leaf=true;
						})
					};
					this.totalListData = response.response.items;
					this.data5 = JSON.parse(JSON.stringify(this.totalListData));
				} else {
					this.data5 = [];
				}
			}else{
				this.$message({
					message: '服务器开小差儿了，请稍后再试~',
					type: 'warning'
				});
			}
		});
    },
    showDialog(type) {
      //显示弹窗
      this._initFormBrand();
      this.formBrand.type = type;
      if (type === "dialogGetSupplierCode") {
        this.dialogGetSupplierCode = true;
      } else if (type === "dialogGetBrandCode") {
        this.dialogGetBrandCode = true;
      }
    },
    //品牌信息
    _initFormBrand() {
      this.formBrand.brandCodeOrName = "";
      this.formBrand.loading = false;
      this.formBrand.page = {
        currentPage: 1,
        pageSize: 10,
        totalPage: 1
      };
    },
    //查询品牌编码列表
    getBrandCodeLists(formBrand) {
      this.$refs[formBrand].validate(valid => {
        if (valid) {
          this.formBrand.page.currentPage = 1;
          this.__getBrandCodeLists();
        }
      });
    },

    //查询品牌编码列表
    __getBrandCodeLists() {
      let requestPara = {};

      this.formBrand.loading = true;
      const _this = this;
      let queryAPI = function() {};
      if (this.formBrand.type === "dialogGetBrandCode") {
        queryAPI = API.queryBrandList;
        requestPara = {
          brandCodeOrName: this.formBrand.brandCodeOrName,
          currentPage: this.formBrand.page.currentPage,
          pageSize: this.formBrand.page.pageSize
        };
      } else if (this.formBrand.type === "dialogGetSupplierCode") {
        queryAPI = API.querySupplierList;
        requestPara = {
          supplierCodeOrName: this.formBrand.brandCodeOrName,
          currentPage: this.formBrand.page.currentPage,
          pageSize: this.formBrand.page.pageSize
        };
      }
      queryAPI(requestPara).then(response => {
        _this.formBrand.loading = false;
        if (response.success) {
          if (response.response) {
            const _res = response.response;
            _this.formBrand.page = {
              currentPage: _res.pager.currentPage,
              pageSize: _res.pager.pageSize,
              totalPage: _res.pager.totalSize
            };
            _this.BrandCodeLists = _res.list || [];
          }
        } else {
          _this.formBrand.loading = false;
          _this.BrandCodeLists = [];
        }
      });
    },
    //关闭品牌弹窗
    checkedFormBrand(row) {
      this.form.brandCode = row.brandCode;
      this.dialogGetBrandCode = false;
    },
    //品牌弹窗的页面点击事件
    handleCurrentChangeByBrandCode(val) {
      this.formBrand.page.currentPage = val;
      this.__getBrandCodeLists();
    },
    //导出报表生成数据
    handleExport() {
      const requestPara = this.formsubmitdata;
      const _times = this.form.times;
      const _this = this;
	  let timer = null;
	  _this.percentage = 0;
      if (_times[1] - _times[0] > 1000 * 60 * 60 * 24 * 30) {
        //只能下载30天内数据
        _this.$message.error("只能导出30天内数据");
        return;
      }

      function __errorhandle(response) {
        if (response.respMsg) {
          _this.$message.error("接口exportSalesTotalExcel", response.respMsg);
        }
      }

      this.showProgerssBar = true;
      timer = setInterval(() => {
        _this.percentage++;
        if (_this.percentage > 100) {
          clearTimeout(timer);
          _this.percentage = 100;
        }
      }, 10);
      function __down(data) {
        if (data && data.success) {
          _this.form.cookieDomain = data.response;
          _this.showDownloadLink = true;
        }
      }

      API.exportSalesCollectExcel(requestPara).then(
        response => {
          if (response && response.success) {
            __down(response);
            _this.showProgerssBar = false;
            _this.percentage = 0;
          } else {
            __errorhandle(response.respMsg);
          }
        },
        reject => {}
      );
    },

    //下载
    handleDownload() {
      let _this = this,
        href = "",
        downloadElement = "",
        params = {
          userId: this.form.currentStoreCode,
          ip: this.form.cookieDomain
        };
      API.saleFileExit(params).then(
        response => {
          if (response) {
            if (response.respCode && response.respCode == 1) {
			  _this.showDownloadLink = false;
              window.open(
                "//" +
                  _this.form.cookieDomain +
                  "/downloadSalesCollectZip?storeCode=" +
                  _this.form.currentStoreCode,
                "_self"
              );
              return false;
            } else {
              if (response.respMsg) {
                _this.$message.error(response.respMsg);
              }
            }
          }
        },
        reject => {}
      );
	}
  },
  watch: {
    checkedchannel: {
      handler(a) {
        let that = this;
        if (a.length) {
          this.form.salesChannel = [];
          a.map((item, index) => {
            if (item == "来购") {
              this.form.salesChannel.push("16");
            } else if (item == "美店分享") {
              this.form.salesChannel.push("13");
            } else if (item == "金力") {
              this.form.salesChannel.push("10");
            }
          });
        } else {
          this.form.salesChannel = "";
        }
      }
    }
  },
	filters:{
		numFormat:function(num){
			var res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
				return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
				return $1+",";
				});
			})
			return res;
		}
  	}
};
</script>
