<template>
  <div>    
      <!-- 检索条件 -->
        <div class="order_search_box clearfix"> 
            <!-- <div class="c_grey mb20">注：带<span class="red">*</span>号的查询条件，必须填写一项</div>       -->
            <el-form  ref="form" :rules="rules" :model="form" label-width="150px" size="mini">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="销售门店：" v-show="storeCodes.isdata == 1">
                            <commonBranch v-model="storeCodes"></commonBranch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="充值订单号：" prop="orderId">
                            <el-input v-model.trim="form.orderId" placeholder="请输入充值订单号" style="width:296px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="订单状态：">
                            <el-select v-model="form.orderState" style="width:298px">
                            <el-option v-for="stateItem in orderStateList" :key="stateItem.statusCode"  :label="stateItem.statusName" :value="stateItem.statusCode" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                                                  
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12" class="ctrolbox">
                        <el-form-item label="会员卡号或手机号：" prop="memberCarandTeldNo" v-bind:class="{iserror:memberisError}">
                            <el-col>
                                <el-input placeholder="请输入会员卡或手机号：" style="width:176px;float:left;" v-model.trim="form.memberCarandTeldNo" size="mini" @keyup.enter.native="memberCarandTeldNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont" @click="memberCarandTeldNofn">&#xe61c;</i></el-input>
                                <el-input v-model="form.membername" disabled  style="width:120px;float:left"></el-input>
                            </el-col>
                            <div class="el-form-item__error" v-if="memberisError">未查询到会员信息</div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="员工编号：" prop="sellerNo" v-bind:class="{iserror:sellerNoisError}" v-if="LOGINDATA.storeStaffId==null && !categoryprop.isCheckMyself">
                            <el-col :span="24">
                                <el-input placeholder="请输入员工编号" style="width:176px;float:left;" v-model.trim="form.sellerNo" size="mini" @keyup.enter.native="sellerNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont"  @click="sellerNofn">&#xe61c;</i></el-input>
                                <el-input v-model="form.sellername" disabled style="width:120px;float:left;"></el-input>
                            </el-col>
                            <div class="el-form-item__error" v-if="sellerNoisError">未查询到导购员信息</div>
                        </el-form-item>
                        <el-form-item label="员工编号："  prop="sellerNo"  v-else>
                            <el-col :span="24">
                                <el-input placeholder="请输入员工编号" disabled style="width:176px;float:left;" v-model.trim="form.sellerNo" size="mini"  class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont">&#xe61c;</i></el-input>
                                <el-input v-model="form.sellername" disabled style="width:120px;float:left;"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="开单时间：" v-bind:class="{iserror:dateerror}">
                                <el-date-picker placeholder="选择开始日期" value-format="timestamp" :picker-options="pickerStart" v-model="form.startTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker>                    
                                <span>-</span>
                                <el-date-picker type="date" placeholder="选择结束日期" value-format="timestamp" :picker-options="pickerEnd" v-model="form.endTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker> 
                                <div class="el-form-item__error" v-if="dateerrorMesg !=''">{{dateerrorMesg}}</div>
                        </el-form-item>
                    </el-col> 
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="收款方式：">
                            <el-select v-model="form.paymentMethod" style="width:298px">
                            <el-option v-for="paymantItem in paymantList" :key="paymantItem.payMethodCode"  :label="paymantItem.payMethodName" :value="paymantItem.payMethodCode" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>                        
                </el-row>  
                <div class="button-box">                   
                    <el-button size="mini" class="button" @click="onReset('form')">重置</el-button>
                    <el-button type="primary" :loading="loading" size="mini" class="button right" @click="onSubmit">查询</el-button>
                    <el-button v-if="LOGINDATA.integralrecharge_list_export" :loading="exportloading" type="primary" size="mini" class="button right" @click="gettableData('export')">导出</el-button>
                </div>
            </el-form>
            
        </div>
    <!-- 搜索结果 -->
        <div>
            <el-table :data="response.list" border style="width: 100%" :show-header="true" v-loading="loading">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="storeName" label="销售门店" align="center"></el-table-column>
                <el-table-column prop="storeCode" label="门店编码" align="center"></el-table-column>
                <el-table-column prop="orderId" label="充值订单号" align="center"></el-table-column>
                <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
                <el-table-column prop="userCard" label="会员卡号" align="center"></el-table-column>
                <el-table-column prop="orderAmount" label="充值金额" align="center"></el-table-column>
                <el-table-column prop="gomedoNum" label="充值美豆数量" align="center"></el-table-column>
                <el-table-column prop="sellerNo" label="导购员编号" align="center"></el-table-column>
                <el-table-column prop="sellerName" label="导购员姓名" align="center"></el-table-column>
                <el-table-column prop="createDate" label="开单时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">                   
                    <template slot-scope="scope">
                        <router-link :to="{path:'/order/integralrecharge_datails',query:{orderId:scope.row.orderId}}" target="_blank"><el-button v-if="LOGINDATA.integralrecharge_list_check" type="text" size="small">查看详情</el-button></router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block pagebox" v-if="response.list.length!=0">
                <el-pagination
                background 
                @current-change="handleCurrentChange"
                :current-page="response.pageNo"          
                :page-size="response.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="response.total">
                </el-pagination>
            </div>
        </div>
  </div>
</template>
<script>
    import {mapState,mapActions} from  'vuex';
    import API from '@/api/order-integralrecharge/integralrecharge';
    import commonBranch from '@/components/order-integralrecharge/gbranch.vue';
    export default {
        data() {
            var validatemember = (rule, value, callback) => {
                //this.memberisError=false;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                if (!newRegex.test(value)) {
                    this.memberError=false;//会员卡活手机号格式错误
                    this.memberisError=false;
                    callback(new Error('填写信息错误，请输入数字或字母'));
                } else if (value ==''){
                    this.memberisError=false;
                    this.memberError=true;
                }else{    
                    this.memberError=true;
                    if(this.ismember){
                        this.memberisError=true;
                        this.ismember =false;
                    }else{
                        this.memberisError=false;
                    }
                    callback();

                }
            };
            var validatesellerNo = (rule, value, callback) => {
               // this.sellerNoisError=false;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                if (!newRegex.test(value)) {                   
                    this.sellerNoError=false;//导购员编号格式错误
                    callback(new Error('填写信息错误，请输入数字或字母'));
                } else if (value ==''){
                    this.sellerNoError=true;
                }else{
                    if(this.isseller){
                        this.sellerNoisError=true;
                        this.isseller =false;
                    }else{
                        this.sellerNoisError=false;
                    }
                    this.sellerNoError=true;
                    callback();
                }
            };
            var validateorderId = (rule, value, callback) => {
                var orderRegex = /^[0-9]+$/;
                if(value == ""){
                    this.orderId=true;
                }else if (!orderRegex.test(value)) {
                    callback(new Error('填写信息错误，请输入数字'))
                    this.orderId=false;
                } else {
                    callback();
                    this.orderId=true;
                }
            };
            return {
                loading:false,
                exportloading:false,
                ismember:false,
                isseller:false,
                dateerror:false,//开单时间是不是再30天范围内
                dateerrorMesg:"",//结束时间不能大于开始时间
                title:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"单据查询-订单查询" 
                },
                value4: [,],
                memberisError:false,//会员卡活手机号查询结果错误
                sellerNoisError:false,//导购员编号查询结果错误
                memberError:true,//会员卡活手机号格式
                sellerNoError:true,//导购员编号格式
                orderId:true,//订单号
                form: {
                    orderId:"",//充值订单号
                    orderState:"",//订单状态
                    paymentMethod:"",//收款方式
                    memberCarandTeldNo:"",//会员卡号
                    sellerNo:"",//导购员编号
                    startTime:"",//开始的日期
                    endTime:"",//结束日期    
                    membername:"",//会员名称
                    sellername:"",//导购员名称
                    startDate:"",
                    startEnd:"",
                    memberCardNo:"",//会员卡号
                    guiderCode:"",//请求成功的导购员编号
                    employeeID:'',//员工编号
                    isStoreStaff:'0',//销售门店只有总部和大区帐号才会传,门店帐号登录的时候需要传isStoreStaff参数，后端用来做区分：门店传1，非门店传0
                },
                formsubmitdata:{},
                rules: {//校验规则
                    orderId: [//订单号
                        { validator: validateorderId, trigger: 'change'}
                    ],
                    memberCarandTeldNo:[//会员卡或手机号
                        { validator: validatemember, trigger: 'change' }
                    ],//sellerNo
                    sellerNo:[//导购员编号
                        { validator: validatesellerNo, trigger: 'change' }
                    ],
                },
                /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */  
                pickerStart: {
                    // startTime1:"",
                   // endTime1:""
                    disabledDate: (time) => {
                        //alert(time)
                        if (this.form.endTime !== '' && this.form.endTime !== null) {
                            var d = new Date(this.form.endTime).getTime()
                           // return time.getTime() > Date.now() || time.getTime() > d
                            return time.getTime() > Date.now() || time.getTime() > d
                        } else {
                            return time.getTime() > Date.now()
                            
                        }
                    }
                },
                /** 今日以前日期，后面日期不可选择 */
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.startTime !== '') {
                            
                            var d = new Date(this.form.startTime).getTime()-86400000;

                            return time.getTime() <= d || time.getTime() > Date.now()
                           //   return time.getTime() > d + 86400000*30 || time.getTime() > Date.now()
                        } else {
                            return time.getTime() > Date.now()
                        }
                    }
                },
                response:{
                    pager:{},
                    list:[]
                },
                orderStateList:[],
                paymantList:[],
                storeCodes:{//销售门店
                    storeCodes:"",
                },
                skuNo:true,
                categoryprop:{
                    isDirector:false,//是否是主任
                    isCheckMyself:false,//是否仅查看自己开的单
                },
            }
        }, 
        methods: {
            onSubmit(){
                //this.formsubmit = this.form;
                this.gettableData();
            },
            handleCurrentChange(currentPage){//orderindexpage
                //this.response.pager.currentPage = currentPage;
                let formData= this.formsubmitdata;
                formData.pageNo= currentPage;
                this.manageInit(formData);               
            },
            onReset(formName){//重置
                this.$refs[formName].resetFields();
                this.form.orderState="";
                this.form.paymentMethod="";
                this.form.startTime="";
                this.form.endTime="";
                this.dateerror =false;
                this.dateerrorMesg ='';
                this.memberisError=false;
                this.sellerNoisError=false;
                this.form.membername="";//会员名称
                this.form.sellername="";//导购员名称
                this.form.memberCardNo="";//会员编码
                if(this.LOGINDATA.storeStaffId == null && this.LOGINDATA.isDirector != 1){//不是导购员
                    this.form.sellerNo = "";
                    this.form.guiderCode="";//导购员编号
                };
                this.storeCodes.storeCodes = "reset";//销售门店
                this.loading = false;
                
            },
            gettableData(isexport){//查询  memberisError:false, sellerNoisError:false,
                var _this = this;
                if(_this.orderId && !_this.dateerror && !_this.memberisError && !_this.sellerNoisError && _this.memberError && _this.sellerNoError){//有报错信息不能查询
                    if (this.form.orderId || (this.form.startTime && this.form.endTime) || this.form.memberCardNo || this.form.guiderCode || this.form.orderState|| this.form.employeeID || this.form.paymentMethod || this.storeCodes.storeCodes) {   
                        var endTime =  this.form.endTime ? this.form.endTime+86400000-1 : "";           
                        var formData={
                            orderId:this.form.orderId,
                            status:this.form.orderState,
                            paymentMethod:this.form.paymentMethod,
                            userCard:this.form.memberCardNo,
                            sellerId:this.form.guiderCode,
                            startCreateDate:this.form.startTime,
                            endCreateDate:endTime,//结束时间默认加24小时
                            pageNo:1,
                            pageSize:15,
                            storeCode:this.storeCodes.storeCodes,
                        };
                        // if(this.storeCodes.isdata){//有权限
                        //     formData.storeNums = this.storeCodes.storeCodes;
                        // };
                        console.log( formData)
                        _this.formsubmitdata =formData;
                        
                        if(isexport){
                            _this.exportloading = true;
                            formData.pageSize =null;
                            formData.pageNo =null;
                            _this.handleDownload(formData);
                        }else{
                            _this.loading = true;
                            _this.manageInit(formData);
                        }
                    } else {
                        this.$message({
                            message: '请至少输入一个查询条件',
                            type: 'warning'
                        });
                    }
                }
            },
            manageInit(data){//数据请求
                var _this = this;
                if(_this.form.memberCarandTeldNo =="" || _this.memberisError==true){
                    _this.form.memberCarandTeldNo = "";
                };
                if(_this.form.sellername =="" || _this.sellerNoisError==true){
                    if(_this.LOGINDATA.storeStaffId == null && _this.LOGINDATA.isDirector !=1){//不是导购员也不是主任
                        _this.form.sellerNo = "";
                    }
                };
                _this.loading = true;
                API.queryGomedoOrderList(data).then(function(data){
                    if(data.success && data.response !=null){
                        _this.loading = false;
                        _this.response = data.response;
                    }else{   
                        _this.loading = false;               
                        _this.response.list=[];
                        if(data.respMsg!=null){
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }
                        
                    }                       
                })
            },
            memberCarandTeldNofn:function(){//会员卡或手机号
                let _this =this;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                //alert(newRegex.test(value))
                if (!newRegex.test(this.form.memberCarandTeldNo) || this.form.memberCarandTeldNo =="") {
                    _this.form.memberCardNo='';
                    _this.form.membername='';
                    return false;
                } else{
                    API.orderMemberInfo({
                        memberCardNo:this.form.memberCarandTeldNo
                    }).then(function(data){
                        if(data.success==false){
                            _this.ismember=true;
                            _this.memberisError=true;
                            _this.form.membername='';   
                           // alert(_this.memberisError)                        
                        }else{
                            _this.memberisError=false;
                            if(data.response.memberName=='' || data.response.memberName==null){
                                _this.form.membername=data.response.memberCardNo;
                            }else{
                                _this.form.membername=data.response.memberName;
                            }                            
                            _this.form.memberCardNo=data.response.memberCardNo; //点击查询按钮的时候 需要统一传改接口里面的会员卡号
                        }
                    });
                }               
            },
            sellerNofn:function(){//导购员编号
                let _this =this;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                //alert(newRegex.test(value))
                if (!newRegex.test(this.form.sellerNo) || this.form.sellerNo =="") {
                    _this.form.sellername='';
                    _this.form.sellerNo = "";
                    _this.form.guiderCode="";//导购员编号
                    return false;

                } else{
                   // alert(this.form.sellerNo)
                    API.ordersellerInfo({
                        account:this.form.sellerNo
                    }).then(function(data){
                        if(data.success==false){
                             _this.isseller=true;
                            _this.sellerNoisError=true;
                            _this.form.sellername='';
                            _this.form.guiderCode="";
                        }else{
                            _this.sellerNoisError=false;
                            if(data.response.name=='' || data.response.name==null){
                                _this.form.sellername=data.response.userNo;
                            }else{
                                _this.form.sellername=data.response.name;
                            }  
                            _this.form.guiderCode=data.response.userNo;//点击查询按钮的时候 需要统一传改接口里面的导购员便号
                        }
                    });
                }
            },
            endtimeblur(){//时间校验 不能超过30天 // startTime1:"",
                   // endTime1:""
                let _this =this;
                 if (this.form.endTime !== '' && this.form.endTime !== null && this.form.startTime !== '' && this.form.startTime !== null) {
                   // if (this.form.startTime !== '' && this.form.endTime !== null) {
                    let endDay = new Date(this.form.endTime).getTime();
                    let startDay = new Date(this.form.startTime).getTime();
                    if((endDay - startDay)<0){
                        _this.dateerror =true;
                        _this.dateerrorMesg ='结束时间不能小于开始时间';
                    }else{
                        if(startDay == 0){
                            _this.dateerror =true;
                            _this.dateerrorMesg ='请输入开始时间';
                        }else{
                            let chaday= (endDay - startDay)/86400000;
                            if(chaday>30){
                                _this.dateerror =true;
                                _this.dateerrorMesg ='请选择30天内的时间范围';
                            }else{
                                _this.dateerror =false;
                                _this.dateerrorMesg ='';
                            }
                        }   
                    }
                }else{
                    if (this.form.startTime == '' || this.form.startTime == null || new Date(this.form.startTime).getTime()==0) {
                        
                        _this.dateerror =true;
                        _this.dateerrorMesg ='请输入开始时间';
                    };
                    if (this.form.endTime == '' || this.form.endTime == null || new Date(this.form.endTime).getTime()==0) {
                        
                        _this.dateerror =true;
                        _this.dateerrorMesg ='请输入结束时间';
                    };
                    if((this.form.startTime == '' || this.form.startTime == null || new Date(this.form.startTime).getTime()==0) && (this.form.endTime == '' || this.form.endTime == null || new Date(this.form.endTime).getTime()==0)){
                        _this.dateerror =false;
                        _this.dateerrorMesg ='';
                    }
                }
            },
            orderState(){
                var _this = this;
                //订单状态数据请求
                API.queryOrderStateList().then(function(data){
                    _this.orderStateList = data.response;
                });
                //支付方式数据请求
                API.queryGomedoPayMethodList().then(function(data){
                    _this.paymantList = data.response;
                });
                //如果是导购员，将检索条件中的导购员置灰并获取默认数据
                if(_this.LOGINDATA.storeStaffId != null){
                    _this.form.sellerNo =_this.LOGINDATA.storeStaffId;
                    _this.form.guiderCode=_this.LOGINDATA.storeStaffId;
                }
            },
            handleDownload(params) {
                let _this = this;
                function __down(data) {
                    var blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    var downloadElement = document.createElement('a');
                    var href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = `会员积分充值订单.xls`; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //downPromotionFeeList点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放掉blob对象
                };
                function __errorhandle(response) {
                    if (response.respMsg) {
                        _this.$message.error("exportGomedoOrderList" + response.respMsg);
                    }
                };
                API.exportGomedoOrderList(params).then(
                    response => {
                        if (response && response.data) {
                            _this.exportloading = false;
                            __down(response.data);
                        } else {
                            __errorhandle(response.respMsg);
                        }
                    },
                    reject => {

                    }
                )
            },
        },
        mounted(){
           // this.orderState();
        },
        created(){
            //判断是不是主任
            if(this.LOGINDATA.isDirector == 1){
                this.categoryprop.isCheckMyself = true;//主任仅查看自己开的单
                this.form.sellerNo = this.LOGINDATA.employeeId;
                this.form.guiderCode=this.LOGINDATA.employeeId;//导购员编号
            };
            this.orderState();
        },
        computed:{
            ...mapState({//vuex取值
            LOGINDATA:"LOGINDATA"
            }),
            startSubmittedDate:function(){
                let date = new Date(this.form.startDate);//日期框
                let time = new Date(this.form.startTime);//时间框     
                let Y = date.getFullYear();
                let M = date.getMonth()+1;
                let D = date.getDate();
                let H = time.getHours();
                let m = time.getMinutes();
                let s = time.getSeconds();


                let newtime = Y+"-"+M+"-"+D+" "+H+":"+m+":"+s
                return newtime;               //return 
            },
            endSubmittedTime:function(){//结束时间
                let time =  this.form.endDate+" "+this.form.endTime;//结束时间
                return time;     
            },
            time1:function(){
                return new Date().getTime();  
            },
        },
        components:{
            commonBranch
        }
    }
</script>
<style>
.red{
    color:#F56C6C;
}
.mb20{
    margin-bottom:20px;
}
.c_grey{
    color:#909399;
}
.order_search_box{
    border: 1px solid #E4E7ED;
    padding:20px 10px 5px;
    margin-bottom:20px;
}
.order_search_box .order_title{
    height: 36px;
    border-bottom:1px solid #DCDFE6;
    background:#409EFF;
    color:#fff;
    font:15px/36px 'Microsoft YaHei';
    padding-left:15px;
}
.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.aligncenter{
    text-align: center;
}
.alignleft{
    text-align: left;
}
.controlbox .el-form-item__content{
    margin-left:0px;
}
.button-box{
width: 100%;
padding: 20px 0;
text-align: center;
}
.button.right{
margin-left: 100px;
}
thead.has-gutter th,.el-table th.is-leaf{
    background:#eef6ff;
    padding:8px;
}
.el-table__body td{
    padding:5px 0;
    font-size:12px;
}
/* 翻页 */
.pagebox{
    text-align:right;
    margin-top:20px;
}
/*错误提示*/
.errortext{
    position:absolute;
    font-size:12px;
    color:#f56c6c;
    left:125px;
    width:150px;
    top:5px;
}
.el-form-item.iserror .memberCar_input .el-input__inner{
    border-color:#f56c6c;
}
.gcloseshop{
    z-index:10;
}
.gcs-body {
    width:auto;
    min-width: 180px;
}
</style>
