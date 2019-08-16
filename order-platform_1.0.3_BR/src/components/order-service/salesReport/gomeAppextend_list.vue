<template>
	<div>
		<el-row style="text-align:right;margin-bottom:10px;">
			<span>
				<el-button type="primary" plain size="small" v-if="pagedata.length && LOGINDATA.gomeAppextend_list_export" @click="handleExport()" title="最多只能导出30万条数据">导出</el-button>
			</span>
			<el-row v-show="showProgerssBar">
				<el-progress class="sr-progress" :text-inside="true" :percentage="percentage"></el-progress>
			</el-row>
		</el-row>	
	<el-container class="salesOrganization_list">	
		<el-form class="so-list__form"
			ref="so-list__form"
			:inline="true"
			:model="form"
			size="mini"
			@submit.native.prevent
			data-before="查询条件">	
			<!--表单查询 start-->
			<el-row class="input-group-wrapper">
				<el-row class="input-group">
					<el-form-item label="推广日期：">
						<el-date-picker
							v-model="changeDate"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-value="defaultDate">
						</el-date-picker>
						<el-button size="mini" type="primary" native-type="submit" :loading="loading" @click="query()">查询</el-button>
					</el-form-item>
				</el-row>
				<!-- <el-row class="btn-group">
					<el-button size="mini" @click="resetForm()">重置</el-button>
					<el-button size="mini" type="primary" native-type="submit" :loading="loading" @click="query()">查询</el-button>
				</el-row> -->
			</el-row>
			<!--表单查询 end-->
		</el-form>
		<div class="common-table ">
			<el-table :loading="loading" :data="pagedata" border style="width: 100%" :show-header="true">
				<el-table-column prop="org_center" label="总部" width="100" align="center"></el-table-column>
				<el-table-column prop="regione_name" label="大区" width="100" align="center"></el-table-column>
				<el-table-column prop="branch_name_1" label="一级分部" align="center"></el-table-column>
				<el-table-column prop="branch_name_2" label="二级分部" align="center"></el-table-column>
				<el-table-column prop="store_name" label="门店" align="center"></el-table-column>
				<el-table-column width="100" prop="employee_id" label="员工ID" align="center"></el-table-column>
				<el-table-column width="100" prop="employee_name" label="员工姓名" align="center"></el-table-column>
				<el-table-column prop="uid" label="会员编号" align="center"></el-table-column>
				<el-table-column prop="time" width="100" label="推广时间" align="center"></el-table-column>
				<el-table-column prop="user_type_chin" label="推广方式" align="center"></el-table-column>
				<el-table-column prop="is_success_chin" label="推广是否成功" align="center"></el-table-column>
				<el-table-column prop="tuig_source_chin" label="来源" align="center"></el-table-column>			
			</el-table>
			<div v-if="pagedata.length!=0">
                <el-pagination
                background 
                @current-change="handleCurrentChange"
                :current-page="pager.currentPage"          
                :page-size="pager.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="pager.totalSize">
                </el-pagination>
            </div>
		</div>
	</el-container>
  </div>
	
</template>
<style lang="scss">
@import "@/assets/styles/order-service/variable.scss";
@import "@/assets/styles/order-service/common.scss";
@import "@/assets/styles/order-service/salesOrganization_list.scss";
</style>
<script>
import { mapState } from "vuex";
import API from "@/api/order-service/salesReport";
import Env from "@/api/env";
/**
   * 对日期处理
   * return type 参数展示格式
   */
function getParseTime(times) {
    if (!times) {
      return {
        type1: {
          start: "",
          end: ""
        },
        type2: {
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

    function format2(date) {
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日"
      );
    }

    return {
      type1: {
        start: format(start),
        end: format(end)
      },
      type2: {
        start: format2(start),
        end: format2(end)
      }
    };
  }

function getQueryParams(content) {
	const date = getParseTime(content.changeDate).type1;
	return {  
		beginTime: date.start, //开始日期
		endTime: date.end, //结束日期
		currentPage: content.form.currentPage, //结束日期
		pageSize: content.form.pageSize, //结束日期
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
			pager: {
				currentPage: 1,
				pageSize: 20,
				totalPage: 1
			},
			form: {
				beginTime: "", //开始日期
				endTime: "", //结束日期
				currentPage: 1, //结束日期
				pageSize: 20, //结束日期
			},
			pickerStart: {
				disabledDate: time => {
				return time.getTime() < new Date("2019-01-01").getTime();
				}
			},
			defaultDate: [new Date(new Date(new Date().toLocaleDateString()).getTime()-24*60*60*1000), new Date(new Date(new Date().toLocaleDateString()).getTime()-1)],
			changeDate: [new Date(new Date(new Date().toLocaleDateString()).getTime()-24*60*60*1000), new Date(new Date(new Date().toLocaleDateString()).getTime()-1)],
			showDownloadLink: false, //下载
			percentage: 0,
			showProgerssBar: false, //导出
			cookieDomain: "",
			loading:false,
			pagedata:[],
			formsubmitdata:{},
			showtime:{}
		};
	},
	//vuex取值
	computed: mapState({
		LOGINDATA: "LOGINDATA",
	}),
	created() {
		this.init();
	},
	mounted() {
		const that = this;
		this.query();
	},
	methods: {
		init() {
		this.form.times = [new Date(), new Date()];
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
		query() {
			let _this =this;
			var requestParms = getQueryParams(_this);
			_this.formsubmitdata = requestParms;
			if(requestParms.beginTime =='' && requestParms.endTime ==''){
				this.$message({
					message: '请输入查询条件',
					type: 'warning'
				});
				return false;
			}
			this._querySalesTotalList(this.formsubmitdata); //表格
		},
		resetForm() {
			//重置
			let _this = this;
			this.changeDate =  [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)];
			this.query(); //重新查询
		},
		_querySalesTotalList(requestParms) {
		//查询表格
			this.loading = true;
			this.showDownloadLink = false;
			API.getApplist(requestParms).then(response => {
				this.loading = false;

				if (response.success) {
					this.pagedata = response.response.items;
					this.pager = response.response.pager;
				}else{
					this.$message({
						message: '服务器开小差儿了，请稍后再试~',
						type: 'warning'
					});
				}
			});
		},
		//导出下载数据
		handleExport() {
			var _this = this;
			
			const requestPara = getQueryParams(this);
			_this.showTime = getParseTime([requestPara.beginTime,requestPara.endTime]).type2;
			
			function __errorhandle(response) {
				if (response.respMsg) {
					_this.$message.error("接口exportOfflineAPPList：" + response.respMsg);
				}
			};

			this.loading = true;
			function __down(data) {
				var blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
				var downloadElement = document.createElement('a');
				var href = window.URL.createObjectURL(blob); //创建下载的链接
				downloadElement.href = href;
				downloadElement.download = `国美App推广${_this.formsubmitdata.beginTime}-${_this.formsubmitdata.endTime}.xls`; //下载后文件名
				document.body.appendChild(downloadElement);
				downloadElement.click(); //downPromotionFeeList点击下载
				document.body.removeChild(downloadElement); //下载完成移除元素
				window.URL.revokeObjectURL(href); //释放掉blob对象
			}

			API.exportOfflineAPPList(requestPara).then(
				response => {
					if (response && response.data) {
					_this.loading = false;
					__down(response.data);
					} else {
					__errorhandle(response.respMsg);
					}
				},
				reject => {

				}
			)
		},
		handleCurrentChange(currentPage){//翻页
			//this.response.pager.currentPage = currentPage;
			let formData= this.formsubmitdata;
			formData.currentPage= currentPage;
			this._querySalesTotalList(formData); //表格            
		},
	},
};
</script>
