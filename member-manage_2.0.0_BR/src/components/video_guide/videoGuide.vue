<template>
<el-container>
    <el-main>
    	<el-main>
				<div class="videoGuideBox">
						<div class="videoGuideSearchTitle">
							<span class="left">查询条件</span>
							<!-- <span class="right">视频导购审核--{{storeInfo.storeName}}</span> -->
						</div>
						<div class="videoGuideSearchBox el-input--mini">
							<el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
								<div>
								<el-form-item label="选择门店：" style="display: block;">
									<g-stores 
									v-model="storeCodes" 
									:isMutex="isMutex"
									partUrl="/queryread/store"
									@changeend="bindChangeend"
									v-if="!isStoreManager"></g-stores>

									<div class="gray" v-else>{{storeInfo.storeName || ''}}</div>
								</el-form-item>
								</div>

								<div>
									
								<el-form-item label="审核状态：" prop="auditStatus" size="small">
									<el-select v-model="form.auditStatus"  size="small">
											<el-option
												v-for="item in auditOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value">
											</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="员工服务状态：" prop="serviceStatus" size="small" v-if="form.auditStatus==2">
									<el-select v-model="form.serviceStatus"  size="small">
											<el-option
												v-for="item in serviceOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value">
											</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div>
								<!-- <el-form-item label="品牌品类：">
									<span class="select-btn">请选择(默认全选)></span>
								</el-form-item> -->
								<!-- 品牌品类  -->
								<brandCategoryTree @getBrandId="getBrandId" ref="brandCategoryTree"></brandCategoryTree>
							</div>
							<div class="searchLine">
								<el-form-item label="员工姓名：" prop="name">
									<el-input v-model="form.name"></el-input>
								</el-form-item>
								<!-- <el-form-item label="员工电话：" prop="staffTelNum">
									<el-input v-model="form.staffTelNum"></el-input>
								</el-form-item> -->
							</div>
							<div class="searchLine">
								<el-form-item label="员工编号：" prop="employeeId">
									<el-input v-model="form.employeeId"></el-input>
								</el-form-item>
							</div>

							<div class="searchLine video-guide-date">
								<el-form-item label="申请时间：">
									<el-date-picker
													v-model="form.applyStartDate"
													type="date"
													placeholder="开始日期"
													:picker-options="pickerStart"
													style="width: 290px;"
                          value-format="yyyy-MM-dd"
											>
											</el-date-picker>

											<el-date-picker
													v-model="form.applyEndDate"
													type="date"
													placeholder="结束日期"
													:picker-options="pickerEnd"
													style="width: 290px;margin-left: 20px"
                          value-format="yyyy-MM-dd"
											>
											</el-date-picker>
								</el-form-item>

								
							</div>

							<div>
								<el-form-item>
									<el-button type="primary" @click="submitForm('ruleForm')"  size="small">查询</el-button>
										<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
											<div class="export" style="display: inline-block;margin-left: 10px">
												<!-- <a:href="'/xxx/' + id">链接</a> -->
												<span v-if="form.serviceStatus!==0 && form.serviceStatus!==1">
													<a v-if="pager.totalCount>0" :href="exportHerf1" style="display:inline-block;"><el-button type="primary" size="small">导出</el-button></a>
												</span>
												<span v-if="form.serviceStatus==0 || form.serviceStatus==1">
													<a v-if="pager.totalCount>0" :href="exportHerf2" style="display:inline-block;"><el-button type="primary" size="small">导出</el-button></a>
												</span>
											</div>
								</el-form-item>
							</div>
						</el-form>
						</div>
					</div>
					<el-table  class="videoGuideBox"
						:data="tableData"
						border
						style="width: 100%;margin-top:20px;">
						<el-table-column
							prop="employeeId"
							label="员工编号(工号)">
						</el-table-column>
						<el-table-column
							prop="name"
							label="员工姓名">
						</el-table-column>
						<el-table-column
							prop="brand"
							label="申请品牌品类">
							<template slot-scope="scope">
								<div v-for="item in scope.row.applyCategory">
									<p style="font-weight:bold;">{{item.categoryName}}</p>
									<p style="text-indent:20px;"><span v-for="itemBrand in item.brandNames">--{{itemBrand}}</span></p>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="applyDate"
							label="申请时间">
							<template slot-scope="scope">{{scope.row.applyDate | formatDateTime}}</template>
						</el-table-column>
						<el-table-column
							prop="serviceStatus"
							label="服务状态">
							<template slot-scope="scope">
						<div v-if="scope.row.hasOwnProperty('serviceStatus')&&scope.row.serviceStatus==0">关闭</div>
						<div v-if="scope.row.hasOwnProperty('serviceStatus')&&scope.row.serviceStatus==1">开启</div>
						<div v-if="!scope.row.hasOwnProperty('serviceStatus')">--</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="auditStatus"
							label="审核状态">
							<template slot-scope="scope">
						<div v-if="scope.row.auditStatus==1">待审核</div>
						<div v-if="scope.row.auditStatus==2">审核通过</div>
						<div v-if="scope.row.auditStatus==3">审核未通过</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="reason1"
							label="备注">
							<template slot-scope="scope">
						<p v-for="item in scope.row.reason1">{{item}}</p>
						<p>{{scope.row.reason2}}</p>
							</template>
						</el-table-column>
						<el-table-column
							label="操作">
							<template slot-scope="scope">
								<el-button v-if="scope.row.auditStatus==1" :disabled="!isStoreManager?true: false" @click="operateHandle(scope.row)" type="text" size="small">审核</el-button>
							<el-button v-if="scope.row.auditStatus==2 || scope.row.auditStatus==3" :disabled="!isStoreManager?true: false" @click="operateHandle(scope.row)" type="text" size="small">修改</el-button>
						</template>
						</el-table-column>
						<el-table-column
							label="操作记录">
							<template slot-scope="scope">
							<el-button @click="operateRecord(scope.row)" type="text" size="small">查看</el-button>
						</template>
						</el-table-column>

				</el-table>

				<!-- <div class="export" style="float:right;margin-top:22px;margin-bottom:20px;">
					<span class="padLR10" v-if="pager.totalCount>pager.pageSize">|</span>
					<span v-if="form.serviceStatus!==0 && form.serviceStatus!==1">
						<a v-if="pager.totalCount>0" :href="'/laigoaccess/audit/getAuditExcel?'+'employeeId='+form.employeeId+'&mainCategoryCode='+form.mainCategoryCode+'&category2Code='+form.category2Code+'&auditStatus='+form.auditStatus+'&name='+form.name+'&applyStartDate='+form.applyStartDate+'&applyEndDate='+form.applyEndDate" style="display:inline-block;"><el-button type="primary" size="mini">导出</el-button></a>
					</span>
					<span v-if="form.serviceStatus==0 || form.serviceStatus==1">
						<a v-if="pager.totalCount>0" :href="'/laigoaccess/audit/getAuditExcel?'+'employeeId='+form.employeeId+'&mainCategoryCode='+form.mainCategoryCode+'&category2Code='+form.category2Code+'&auditStatus='+form.auditStatus+'&serviceStatus='+form.serviceStatus+'&name='+form.name+'&applyStartDate='+form.applyStartDate+'&applyEndDate='+form.applyEndDate" style="display:inline-block;"><el-button type="primary" size="mini">导出</el-button></a>
					</span>
				</div> -->
				<pager :total="pager.totalCount" :pageNum="pager.pageNum" :pageSize="pager.pageSize" v-on:pageinfo="pageInit"></pager>

					<el-dialog title="审核" :visible.sync = "operate">
						<el-form :model="operateDataBak" :rules="operateRules" ref="operateDataBak" label-width="100px" class="demo-ruleForm">
						<div>
							<el-form-item label="审核：" prop="auditStatus">
								<el-radio-group v-model="operateDataBak.auditStatus" @change="showReason()">
									<el-radio :label="2">通过</el-radio>
									<el-radio :label="3">不通过</el-radio>
							</el-radio-group>
						</el-form-item>
					</div>
					<div v-if="operateForm.isShowReason">
						<el-form-item label="不通过原因：" prop="reason1">
							<el-checkbox-group v-model="operateDataBak.reason1">
								<p><el-checkbox label="业务能力有待提高"></el-checkbox>
									<el-checkbox label="申请与所负责的不匹配"></el-checkbox></p>
								<p><el-checkbox label="视频导购话术不熟练"></el-checkbox>
								<el-checkbox label="态度和积极性有待提高"></el-checkbox></p>
							</el-checkbox-group>
						</el-form-item>
					
						<p>
						<el-form-item label="" prop="reason2">
						<el-input type="textarea" v-model="operateDataBak.reason2" placeholder="其他审核不通过的原因请在此描述（50个字以内）"></el-input>
						</el-form-item>
						</p>

							<!-- <el-form-item label="服务状态：" prop="serviceStatus" class="marT5">
								<el-radio-group v-if="operateDataBak" v-model="operateDataBak.serviceStatus">
									<el-radio :label="1">开启</el-radio>
									<el-radio :label="0">关闭</el-radio>
							</el-radio-group>
						</el-form-item> -->
					</div>
					<div>
						<el-form-item class="marT20">
							<el-button type="primary" @click="submitOperateForm('operateDataBak')">确定</el-button>
							<el-button @click="operate = false">取消</el-button>
						</el-form-item>
					</div>
					</el-form>
				</el-dialog>
					<el-dialog class="operateRecord" title="操作记录" :visible.sync="operateRecordDialogVisible">

						<ul v-if="operateRecordData && operateRecordData.length>0">
						<li v-for="item in operateRecordData" :key="item.auditUserId">
							<span>{{item.createTime | formatDateTime}}</span>
							<span>{{item.auditUserId}}</span>
							<span>{{item.auditUserName}}审核为</span>
							<span v-if="item.auditStatus==2">通过</span>
							<span v-if="item.auditStatus==3">不通过</span>
						</li>
					</ul>
					<p v-if="operateRecordData && operateRecordData.length==0">无操作记录</p>
					
				</el-dialog>
				<!-- <el-dialog
					custom-class="grayBa"
					title=""
					top="40vh"
					:visible="isStoreManager==false"
					:show-close="false"
					width="50%"
					center>
						<span>视频导购审核只对店长开放，您没有权限操作此页面</span>
				</el-dialog> -->
		</el-main>
	</el-main>
</el-container>
</template>
<script>
	import API from '@/api/api_videoGuide/videoGuide'
	import brandCategoryTree from '@/components/video_guide/common/brandCategoryTree';
	import pager from '@/components/video_guide/common/pager';
	import gStores from "@/components/video_guide/common/g-stores"
	/**
   * 对日期处理
   * return type1 请求参数格式
   *        type2 展示格式
   */
	export default{
		components:{
			pager,
			brandCategoryTree,
			gStores
		},
		computed:{
			//导出
			exportHerf1: function() {
				let herf = '/laigoaccess/audit/getAuditExcel?'+'employeeId='+this.form.employeeId+'&mainCategoryCode='+this.form.mainCategoryCode+'&category2Code='+this.form.category2Code+'&auditStatus='+this.form.auditStatus+'&name='+this.form.name+'&applyStartDate='+this.form.applyStartDate+'&applyEndDate='+this.form.applyEndDate;

				let storeIds = this.dealStoreIds();

				herf += '&storeIDs=' +storeIds;
				
				return herf || '';
			},

			exportHerf2: function() {
				let herf = '/laigoaccess/audit/getAuditExcel?'+'employeeId='+this.form.employeeId+'&mainCategoryCode='+this.form.mainCategoryCode+'&category2Code='+this.form.category2Code+'&auditStatus='+this.form.auditStatus+'&serviceStatus='+this.form.serviceStatus+'&name='+this.form.name+'&applyStartDate='+this.form.applyStartDate+'&applyEndDate='+this.form.applyEndDate;

				let storeIds = this.dealStoreIds();

				herf += '&storeIDs=' +storeIds;

				return herf;
			},
		},
		created(){
			
			API.getLoginInfo().then(res=>{
					if(res && res.success){
						let response = res.response;
						if(response.roleGroup.includes(11)){
							this.isStoreManager=true;
							this.getStoreInfo();
						}else{
							this.isStoreManager=false;
						}

						if(response.roleIds && response.roleIds.includes('er326')) {
							 this.isMutex = true;
            }
					}
				})
		},
		filters: {
			formatDateTime: function (time) {
				if (!time) return ''
				time = new Date(time);
				let hour = time.getHours()<10 ? ('0'+time.getHours() ) : time.getHours();
				let minutes = time.getMinutes()<10 ? ('0'+time.getMinutes()) : time.getMinutes();
				return time.getFullYear()+'-'+(time.getMonth() + 1)+'-'+time.getDate()+' '+hour+':'+minutes;
			}
		},
		data(){
			let _this = this;
			let validatestaffNum = (rule, value, callback) =>{
				if (value!='' && !/^\d{8}$/.test(value)) {
					callback(new Error('请输入8位数字'));
				} else {
					callback();
				}
			}
			let validateStaffName = (rule,value,callback)=>{
				if(value!='' && !/^[\u4e00-\u9fffa-zA-Z0-9\•\·]{0,40}$/.test(value)){
					callback(new Error('姓名输入不符合规则，请输入正确姓名'));
					_this.form.name = value.substring(0,40);
				}else{
					callback();
				}
			}
			let valideReason2 = (rule, value, callback) =>{
				let valueBak = value.replace(/(^\s*)|(\s*$)/g, "");
				if (valueBak!='' && (valueBak.length<10 || valueBak.length>50)) {
					if(valueBak.length>50){
						_this.operateDataBak.reason2 = _this.operateDataBak.reason2.slice(0,50)
					}
					callback(new Error('请输入10-50个字符'));
				} else {
					callback();
				}
			}
			return {
				isStoreManager:true,
				auditOptions: [{
			          value: 2,
			          label: "审核通过"
			        }, {
			          value: 3,
			          label: "审核未通过"
			        }, {
			          value: 1,
			          label: "待审核"
			        }, {
			          value: 0,
			          label: "全部"
			    }],
		        serviceOptions:[{
		          value: 0,
		          label: "关闭"
		        }, {
		          value: 1,
		          label: "开启"
		        }],
		        pickerStart: {
		            disabledDate: time => {
									let normal = time.getTime() < new Date("2019-01-23").getTime() || time.getTime() > Date.now();

									if (this.form.applyEndDate !== '' && this.form.applyEndDate !== null) {
											var d = new Date(this.form.applyEndDate).getTime()
											return normal || time.getTime() > d
                  } else {
                      return normal;
                      
                  }
		            }
						},
						pickerEnd: {
		            disabledDate: time => {
                  let normal = time.getTime() < new Date("2019-01-23").getTime() || time.getTime() > Date.now();

                  if (this.form.applyStartDate !== '') {
                      var d = new Date(this.form.applyStartDate).getTime()-86400000;//默认减一天

                      return time.getTime() <= d || normal
                  } else {
                      return normal
                  }
		            }
		        },
						
				form:{
					auditStatus:1,
					serviceStatus:-1,
					name:'',
					employeeId:'',
					// storeId:'',
					pageNum:1,
					pageSize:15,
					applyStartDate:'',
					applyEndDate:'',
					mainCategoryCode:"",//品类编码
					category2Code:"",//二级分类编码
					startTime: '',
					endTime: '',
				},
				rules:{
					employeeId:[
						{ required:false,validator: validatestaffNum, trigger: 'blur' }
					],
					name:[
						// {required:false ,min:0, max:10, message:'最多支持输入40个字符', trigger:'change'},
						{required:false ,validator:validateStaffName, trigger:'change'}
					]
				},
				tableData: [],
		        operateRecordDialogVisible:false,
		        operateRecordData:[],
		        operate:false,
		        operateData:{},
		        operateForm: {
				  checkList:[],
				  isShowReason:false
		        },
		        operateDataBak:{
		        	reason2:'',
		        	reason1:[],
		        },
		        operateRules:{
		        	reason2:[
		        		// { required:false ,min: 10, max: 50, message: '请输入10-50个字符', trigger: 'change' }
		        		{ required:false ,min: 10, max: 50, validator: valideReason2, trigger: 'change' }
		        	]
		        },
		        pager:{
		        	totalPage: 0,
		        	totalCount:0,
		        	pageNum:1,
		        	pageSize:10
		        },
						storeInfo:{},
						
						 storeCodes:{//门店编码
							storeCodes:"",
						},
						isMutex: false,//树结构1级列表是否互斥
		    }
		},
		methods:{
			getStoreInfo(){
				const _this = this;
				API.getStoreInfo().then(response=>{
					if(response && response.success){
						_this.storeInfo = response.data;
						this.storeCodes.storeCodes = [response.data.storeId];
						_this.getList(_this.form);
					}else{
						_this.$message.error(response.errMsg);
					}
				})
			},
			bindChangeend() {
				if(!this.isStoreManager) {
					this.getList(this.form);
				}
			},
			showReason(){
				const _this = this;
				_this.operateForm.isShowReason = false;
				if(_this.operateDataBak.auditStatus===3){//3为审核不通过 
					_this.operateForm.isShowReason = true;
				}
				
			},
			operateHandle(row){
				const _this = this;
				_this.operate = true;
				_this.operateData = row;
				_this.operateDataBak = JSON.parse(JSON.stringify(row));
				_this.showReason();
			},
		    submitOperateForm(formName){
		    	const _this = this;
		    	this.$refs[formName].validate((valid) => {
					if (valid) {
						toastHandle();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
		    	
		    	function toastHandle(){
		    		let reason2Str = (_this.operateDataBak.reason2).replace(/(^\s*)|(\s*$)/g, "")
		    		if(_this.operateDataBak.auditStatus==1){
			    		_this.$message({
				          showClose: true,
				          message: '请选择审核结果',
				          type: 'error'
				        })
				        _this.operate = true;
				        return false;
			    	}else if(_this.operateDataBak.auditStatus==3 && _this.operateDataBak.reason1.length==0 && reason2Str==''){
			    		_this.$message({
				          showClose: true,
				          message: '请您选择或填写未审核通过原因',
				          type: 'error'
				        })
				        _this.operate = true;
				        return false;
			    	}else{
			    		addOrUpdateAuditInfo();
			    	}
		    	}
		    	function addOrUpdateAuditInfo(){
			    	API.addOrUpdateAuditInfo({
			    		"employeeId":_this.operateDataBak.employeeId,
			    		"auditStatus":_this.operateDataBak.auditStatus,
			    		// "serviceStatus":_this.operateDataBak.serviceStatus,
			    		"storeIDs":_this.dealStoreIds(),
			    		"reason1":_this.operateDataBak.reason1,//_this.operateDataBak.reason1
			    		"reason2":_this.operateDataBak.reason2,
			    		"auditor":_this.operateDataBak.auditor
			    	}).then(response=>{
			    		if(response && response.success){
			    			_this.$message({
					          message: '审核结果保存成功',
					          type: 'success'
					        });
			    			_this.operate = false;
			    			_this.pageInit({"pageNum":1});
			    		}else{
			    			_this.$message.error(response.errMsg);
			    		}
			    	})
		    	} 		    	
		    },
			operateRecord(row){ //展示操作记录
				const _this = this;
				_this.operateRecordDialogVisible = true;
				// this.operateRecordData = row;
				const params = {"employeeId":row.employeeId};
				API.getAuditLog(params).then(response=>{
					if(response && response.success){
						_this.operateRecordData = response.data.videoAuditLogList;
					}else{
						_this.$message.error(response.errMsg);
					}
				})
			},
			submitForm(formName) {
				const _this = this;
		        this.$refs[formName].validate((valid) => {
		        	if (valid) {
		        		// _this.getList(_this.form);
		        		_this.pageInit({"pageNum":1});
		        	} else {
						console.log('error submit!!')
						return false;
					}
		        })
		    },
		    init(){
		    	const _this = this;
		    	//重置操作需要清空分部列表和部门树勾选状态，因为通过获取dom元素来更新数据，所以放在this.$nextTick()中
				this.$nextTick(() => {
					_this.$refs.brandCategoryTree.checkedTreeItems = [];
					_this.$refs.brandCategoryTree.setCheckedKeys();
				});
				// _this.getList();
				// this.__queryReturnRequestList();
				// this._initFormBrand();
		    },
		    resetForm(formName) {
		    	const _this = this;
          this.form.applyStartDate = '';
          this.form.applyEndDate = '';
				_this.$refs[formName].resetFields();
				if(!this.isStoreManager) {
					this.storeCodes.storeCodes = 'reset';
				}
				_this.init();
		    },
		    getBrandId(data){
		    	console.log(data);
				this.form.mainCategoryCode = data.mainCategoryCode;
				this.form.category2Code = data.category2Code;
			},
			pageInit(data){
				const _this = this;
				_this.form.pageNum = data.pageNum;
				_this.pager.pageNum = data.pageNum;
				_this.getList(_this.form);
			},
			getList(params){
				const _this = this;
          _this.form.applyStartDate =  _this.form.applyStartDate || '';
	    		_this.form.applyEndDate = _this.form.applyEndDate || '';
        	params.applyStartDate = _this.form.applyStartDate;
	    		params.applyEndDate = _this.form.applyEndDate;


    			// params.storeId = _this.storeInfo.storeId;
    			if(params.serviceStatus==-1 || params.auditStatus!=2){
    				delete params["serviceStatus"];
					}
					params.storeIDs = _this.dealStoreIds();
				
    			// console.log(params);
    			// console.log('params---------------------')
				API.getAuditList(params).then(response=>{
					if(response && response.success){
						_this.tableData = response.data.videoAuditList;
						_this.pager.totalPage = response.data.totalPage; //总页数
						_this.pager.totalCount = response.data.totalCount; //记录数（总条数）
						//response.data.pageNum //当前页
						_this.pager.pageSize = response.data.pageSize; //一页显示多少条
					}else{
						_this.$message.error(response.errMsg);
					}
				})
			},
		
			dealStoreIds() {
				if(this.storeCodes.checkedAll) {//门店或仓库编码,如果角色是er326则全选是传null
					return 'AllStores';
				}else {
					return  this.storeCodes.storeCodes.join(',');
				}
			}
		}
	}
</script>

<style>
	.grayBa .el-dialog__header{
		display: none;
	}
	.grayBa .el-dialog__body{
		text-align: center;
	}
	.grayBa .el-dialog__body span{
		font-size: 16px;
	}
	.el-textarea__inner{
		width:310px;
	}
	.el-dialog__header{
		padding:10px;
	}
	.el-dialog__headerbtn{
		top:15px;
	}
	.el-dialog__title{
		display: block;
		text-align: center;
		color:#fff;
	}
	.el-form-item__error{
		padding-top: 0;
		margin-top:-4px;
	}
	.el-dialog__body .el-form-item__error{
		margin-top: 2px;
	}
	.el-dialog__header{
		background: #409EFF;
	}
	.el-dialog__headerbtn .el-dialog__close{
		color:#fff;
	}
	.el-dialog__headerbtn .el-dialog__close:hover{
		color:#fff;
	}
	.el-input--mini .el-input__inner{
		width:290px;
	}

	.el-pagination__sizes .el-input--mini .el-input__inner{
		width:80px;
	}
</style>
<style scoped>
	.marT5{
		margin-top: 5px;
	}
	.marT20{
		margin-top: 20px;
	}
	.videoGuideBox{
		border:1px solid #DCDFE6;
	}
	.searchLine{
		padding-bottom:8px;
	}
	.videoGuideSearchTitle{
		height: 36px;
		line-height: 36px;
		background: #409EFF;
		color: #fff;
	}
	.videoGuideSearchTitle .left{
			float:left;
		    padding-left: 20px;
		    font-size: 16px;
		}
	.videoGuideSearchTitle .right{
			float:right;
		    font-size: 14px;
		    padding-right:20px;
		}
	.videoGuideSearchBox{
		padding: 20px;
	}
	.videoGuideSearchBox .item{
		display: inline-block;
	}
	.videoGuideSearchBox .item span{
		display: inline-block;
	}
	.el-input--mini .el-input__inner{
		height: 32px;
		line-height: 32px;
	}
	.videoGuideSearchBox .select-btn{
		color:#409eff;
		cursor: pointer;
	}
	.el-form-item{
		margin-bottom: 0;
		display: inline-block;
	}
	.operateRecord li{
		line-height: 24px;
	}
	.operateRecord li span{
		font-size: 14px;
	}
</style>