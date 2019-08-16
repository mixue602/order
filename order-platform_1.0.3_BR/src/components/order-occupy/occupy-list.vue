<template>
  <div>    
      <!-- 检索条件 -->
        <div class="order_search_box clearfix"> 
            <!-- <div class="c_grey mb20">注：带<span class="red">*</span>号的查询条件，必须填写一项</div>       -->
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="150px" size="mini">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="销售门店" class="categorybox"  v-show="storeCodes.isdata == 1">
                            <g-branch v-model="storeCodes"></g-branch>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="品类：" class="categorybox">
                            <g-category v-model="categoryprop"></g-category>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="商品编码：" prop="skuNo" >
                            <el-input v-model.trim="form.skuNo" placeholder="请输入商品编码" style="width:297px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="品牌编码：">
                            <g-brandcode v-model="brandcode"></g-brandcode>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="日期：" v-bind:class="{iserror:dateerror}">
                                <el-date-picker placeholder="开始日期" value-format="timestamp" :picker-options="pickerStart" v-model="form.startTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker>                    
                                <span>-</span>
                                <el-date-picker type="date" placeholder="结束日期" value-format="timestamp" :picker-options="pickerEnd" v-model="form.endTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker> 
                                <div class="el-form-item__error" v-if="dateerrorMesg !=''">{{dateerrorMesg}}</div>
                        </el-form-item>
                    </el-col> 
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="供应商编码：">
                            <g-suppliercode v-model="supplierCode"></g-suppliercode>
                        </el-form-item>
                    </el-col>                        
                </el-row>  
                <el-row>     
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="占单状态：">
                            <el-select v-model="form.orderState" style="width:296px">
                                <el-option  v-for="item in stateItem" :key="item.code" :label="item.label" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>                                                    
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12" class="ctrolbox">
                        <el-form-item label="会员卡或手机号：" prop="memberCarandTeldNo" v-bind:class="{iserror:memberisError}">
                            <el-col>
                                <el-input placeholder="请输入会员卡或手机号：" style="width:176px;float:left;" v-model.trim="form.memberCarandTeldNo" size="mini" @keyup.enter.native="memberCarandTeldNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont" @click="memberCarandTeldNofn">&#xe61c;</i></el-input>
                                <el-input v-model="form.membername" disabled  style="width:120px;float:left"></el-input>
                            </el-col>
                            <div class="el-form-item__error" v-if="memberisError">未查询到会员信息</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="button-box">                   
                    <el-button size="mini" class="button" @click="onReset('form')">重置</el-button>
                    <el-button type="primary" :loading="loading" size="mini" class="button right" @click="onSubmit">查询</el-button>
                </div>
            </el-form>
            
        </div>
    <!-- 搜索结果 -->
        <div v-loading="loading">
            <div v-if="response.list.length > 0" class="tabel-title">
                <div v-if="formsubmitdata.occupyingState =='SGP'">导购单：{{response.pager.totalSize}}单</div>
                <div v-else>待收款订单{{response.pager.totalSize}}单</div>
            </div>
            <el-table :data="response.list" border style="width: 100%" :show-header="true">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="storeName" label="销售门店" align="center"></el-table-column>
                <el-table-column prop="memberCardNo" label="会员卡号" align="center"></el-table-column>
                <el-table-column prop="memberName" label="会员卡姓名" align="center"></el-table-column>
                <el-table-column width="100" prop="skuNo" label="商品编码" align="center">
                    <template slot-scope="scope">
                        <div v-for="(skuNoItem,index) in scope.row.skuNo" :key="index">
                            {{skuNoItem}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="200" prop="displayName" label="商品名称" align="center">
                    <template slot-scope="scope">
                        <div class="textellipsis" v-for="(nameItem,index) in scope.row.displayName" :key="index">
                            {{nameItem}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="商品数量" align="center">
                    <template slot-scope="scope">
                        <div v-for="(quantityItem,index) in scope.row.quantity" :key="index">
                            x{{quantityItem}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="salePrice" label="销售金额" align="center"></el-table-column>
                <el-table-column prop="guiderCode" label="导购员编号" align="center"></el-table-column>
                <el-table-column prop="guiderName" label="导购员姓名" align="center"></el-table-column>
                <el-table-column prop="guiderOrderId" label="导购单号" align="center"></el-table-column>
                <el-table-column prop="orderId" label="订单号" align="center"></el-table-column>
                <el-table-column prop="orderTime" label="加购/开单时间" align="center"></el-table-column>
                <el-table-column prop="occupyState" label="占单状态" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.occupyState == 'SGP'">
                            导购单
                        </div>
                        <div v-else>
                            {{scope.row.occupyState}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="deleatOrder" label="操作" align="center" fixed="right">                   
                    <template slot-scope="scope">
                        <div v-if="scope.row.occupyState == 'SGP'">
                            <el-button type="text" size="small" v-if="!scope.row.deleatOrder && LOGINDATA.orderplatform_orderOccupy_guiderdelate"  @click.native.prevent="confirmdelateguiderOrder(scope.row.guiderOrderId,scope.row.guiderCode,scope.row.storeCode,scope.row.siteId)" >删单</el-button>
                            <router-link :to="{path:'/order/orderPurchase_detail',query:{guiderOrderId:scope.row.guiderOrderId,guiderCode:scope.row.guiderCode}}" target="_blank"><el-button v-if="LOGINDATA.orderplatform_orderOccupy_guidercheck" type="text" size="small">查看详情</el-button></router-link>
                        </div>
                        <div v-else-if="form.orderState == '1'">
                            <el-button type="text" size="small" v-if="!scope.row.deleatOrder && LOGINDATA.orderplatform_orderOccupy_unpaydelate" @click="delateReasonlist(scope.row,scope.$index)">删单</el-button>
                            <router-link  :to="{path:'/order/orderdetailsbeforesplit',query:{orderId:scope.row.orderId,storeCode:scope.row.storeCode,shippingGroupId:scope.row.shippingGroupId}}" target="_blank"><el-button v-if="LOGINDATA.orderplatform_orderOccupy_unpaycheck" type="text" size="small">查看详情</el-button></router-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block pagebox" v-if="response.list.length!=0">
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
        <!-- 未收款删单弹层 -->
        <el-dialog title="删单确认" :visible.sync="dialogNopayOrderVisible" width="450px" align="left">
            <el-form :model="delateForm" label-width="90px" size="mini">
                <el-row>
                <el-col :span="24">
                <el-form-item label="删单原因：" left>
                    <el-select v-model="delateForm.deleteReason " placeholder="请选择删单原因"> 
                        <el-option v-for="(list,index) in delateList" :key="index" :value="list.code" :label="list.name"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogNopayOrderVisible = false ,delateForm.deleteReason=''"  size="mini">取 消</el-button>
                <el-button type="primary" @click="delateFormEvent()" v-if="LOGINDATA.orderplatform_orderOccupy_unpaydelate"  size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 未收款删单弹层 end-->
        <!-- 导购单删单弹层 end-->
        <el-dialog
            title=""
            :visible.sync="dialogFormVisible"
            width="450px"
            align="left">
            <span>您确定要删除导购单吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false"  size="mini">取 消</el-button>
                <el-button type="primary"   size="mini" v-if="LOGINDATA.orderplatform_orderOccupy_guiderdelate"  @click="delateguiderOrder()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 导购单删单弹层 end-->
  </div>
</template>
<script>
    import {mapState,mapActions} from  'vuex';
    import API from '@/api/orderOccupy/occupy_list';
    export default {
        data() {
             var validateNumber = (rule, value, callback) => {
                var orderRegex = /^[0-9]+$/;
                if (value !=''){
                    if (!orderRegex.test(value)) {
                        callback(new Error('填写信息错误，请输入数字'));
                        this.consigneePhone=false;
                    }else {
                        callback();
                        this.consigneePhone=true;
                    }
                }
            };
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
            return {
                rowsindex:'',
                categoryprop:{
                    categoryCode:null,
                    isDirector:false,
                },
                brandcode:{
                    value:"",
                    isError:false
                },
                storeCodes:{
                    storeCodes:null,
                },
                supplierCode:{
                    value:"",
                    isError:false
                },
                ismember:false,
                isseller:false,
                dateerror:false,//开单时间是不是再30天范围内
                dateerrorMesg:"",//结束时间不能大于开始时间
                value4: [,],
                memberisError:false,//会员卡活手机号查询结果错误
                memberError:true,//会员卡活手机号格式
                consigneePhone:true,//收货人手机号
                form: {
                    skuNo:"",//商品编码
                    memberCarandTeldNo:"",//会员卡号
                    startTime:new Date(new Date().toLocaleDateString()).getTime(),//开始时间.getTime()
                    endTime:new Date(new Date().toLocaleDateString()).getTime(), //结束时间
                    startDate:"",
                    startEnd:"",
                    membername:"",
                    memberCardNo:"",//会员卡号
                    orderState:"SGP",//占单状态
                },
                formsubmitdata:{},
                rules: {//校验规则
                    memberCarandTeldNo:[//会员卡或手机号
                        { validator: validatemember, trigger: 'change' }
                    ],
                    //商品编码
                    skuNo:[
                        {required: true, validator: validateNumber, trigger: 'blur' }
                    ],
                },
                /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */  
                pickerStart: {
                    disabledDate: (time) => {

                        return time.getTime() + 86400000*2 < Date.now() || time.getTime() > Date.now()
                    }
                },
                /** 今日以前日期，后面日期不可选择 */
                pickerEnd: {
                    disabledDate: (time) => {
                        var d = this.form.beginTime-86400000;
                        return time.getTime() > Date.now() || time.getTime() + 86400000*2 < Date.now() || time.getTime() < d
                    }
                },
                response:{
                    pager:{},
                    list:[]
                },
                stateItem:[
                    {"label":"导购单","code":"SGP"},
                    {"label":"待收款订单","code":"1"},
                ],
                dialogFormVisible:false,
                roworderId:'',//未收款删单要用
                rowsstroeId:'',//未收款删单要用
                dialogNopayOrderVisible:false,//未收款删单要用
                delateList:[],//未收款删单要用
                delateForm:{//未收款删单要用
                    deleteReason:'',
                    name:'',
                },
                listIndex:'',//删单时记录所点行数
                loading:false,
                delateguiderparms:{//删除导购单参数
                    guiderOrderId:'',
                    guiderCode:'',
                    storeCode:'',
                    siteId:''
                },
            }
        }, 
        methods: {
            onSubmit(){
                this.gettableData();
            },
            handleCurrentChange(currentPage){//orderindexpage
                //this.response.pager.currentPage = currentPage;
                let formData= this.formsubmitdata;
                formData.currentPage= currentPage;
                this.manageInit(formData);               
            },
            onReset(formName){//重置
                this.$refs[formName].resetFields();
                this.form.startTime=new Date(new Date().toLocaleDateString()).getTime();
                this.form.endTime=new Date(new Date().toLocaleDateString()).getTime();
                this.dateerror =false;
                this.dateerrorMesg ='';
                this.memberisError=false;
                this.sellerNoisError=false;
                this.form.memberCardNo="";//会员编码
                this.categoryprop.categoryCode = "reset";
                this.storeCodes.storeCodes = "reset";
                this.brandcode.value = "reset";
                this.supplierCode.value = "reset";  
                this.form.orderState="SGP"; 
                this.loading = false;
            },
            gettableData(){//查询  memberisError:false, sellerNoisError:false,
                var _this = this;
                if( _this.consigneePhone && !_this.dateerror && !_this.memberisError && _this.memberError && !_this.brandcode.isError && !_this.supplierCode.isError){//有报错信息不能查询
                    if(this.form.skuNo == ""){
                        this.$message({
                            message: '带*查询条件必填一项',
                            type: 'warning'
                        });
                    }else{
                        
                        _this.loading = true;
                        // if ((this.form.startTime && this.form.endTime) || this.form.memberCardNo || this.storeCodes.storeCodes || this.categoryprop.categoryCode !=null || this.form.skuNo || this.brandcode.value || this.supplierCode.value ||  this.form.orderState) {    
                            var endTime =  this.form.endTime ? this.form.endTime+86400000-1 : "";  
                            var startTime = this.form.startTime;
                            var formData={
                                skuNo:this.form.skuNo,
                                skuCategoryIds:this.categoryprop.categoryCode,
                                brandCode:this.brandcode.value,
                                occupyingState:this.form.orderState,
                                supplierCode:this.supplierCode.value,
                                startDate:startTime,
                                endDate:endTime,//结束时间默认加24小时
                                cardNoOrMobile:this.form.memberCardNo,
                                currentPage:1,
                                pageSize:10,
                            };
                            if(this.storeCodes.isdata){//有权限
                                if(this.storeCodes.istotal){//总部的
                                    if(this.storeCodes.isall){//总部的全选和不选将storeNums改成null
                                        formData.storeNums = null;
                                    }else{
                                        formData.storeNums = this.storeCodes.storeCodes;
                                    }; 
                                }else{
                                    formData.storeNums = this.storeCodes.storeCodes;
                                };
                                
                            };
                            _this.formsubmitdata =formData;
                            _this.manageInit(formData);
                    }
                } 
            },
            manageInit(data){//数据请求
                var _this = this;
                if(_this.form.memberCarandTeldNo =="" || _this.memberisError==true){
                    _this.form.memberCarandTeldNo = "";
                };
                let queryAPI = function () {
                };
                if(_this.form.orderState == 'SGP'){
                    queryAPI = API.occupyingResources;
                }else{
                    queryAPI = API.searchSegmentForSingles;
                };
                queryAPI(data).then(function(data){
                    _this.loading = false;
                    if(data.success && data.response !=null){
                        data.response.list.map((item) =>{
                            item.deleatOrder = false;
                            item.skuNo = item.skuNo.split(",");
                            item.displayName = item.displayName.split(",");
                            item.quantity = item.quantity.split(",");
                        });
                        _this.response = data.response;
                    }else{                        
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
            endtimeblur(){//时间校验 不能超过30天 // startTime1:"",
                   // endTime1:""
                let _this =this;
                 if (this.form.endTime !== '' && this.form.endTime !== null && this.form.startTime !== '' && this.form.endTime !== null) {
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
            //未收款删单原因列表
            delateReasonlist(row,index){
                var that=this;
                that.roworderId=row.orderId;
                that.rowsstroeId=row.storeCode;
                that.dialogNopayOrderVisible = true;
                // API.queryDeleteReasonList().then(function(data){
                //     if(data.response){
                //         that.delateList=data.response;
                //     }
                // });
                that.delateList=[
                    {"code":"xdrc1","name":"顾客不买了"},
                    {"code":"xdrc2","name":"长时间未付款"},
                    {"code":"xdrc3","name":"库存占用，无法为新顾客开单"},
                    {"code":"xdrc4","name":"送货时间太长"},
                    {"code":"xdrc5","name":"该商品降价了"},
                    {"code":"xdrc6","name":"支付遇到问题"},
                    {"code":"xdrc7","name":"重复下单/误下单"},
                    {"code":"xdrc8","name":"订单信息有误"},
                    {"code":"xdrc9","name":"忘记使用优惠券、美豆等"},
                    {"code":"xdrc10","name":"添加或删除商品"},
                    {"code":"xdrc11","name":"价格比其他平台贵"}];
                that.listIndex =index;
            },
             //点击删单确认按钮
            delateFormEvent(){
                var that=this;
                if(this.delateForm.deleteReason==''){
                    // Message.warning('请选择删单原因');
                    that.$message({
                        message: '请选择删单原因',
                        type: 'warning'
                    });
                    return false;
                }else{
                    var data={
                            orderId:that.roworderId,
                            storeCode:that.rowsstroeId,
                            reason:this.delateForm.deleteReason
                    };
                    API.deleteOrder(data).then(function(val){
                            if(val.success){
                                that.$message({
                                    message:'删除成功',
                                    duration:5000,
                                    type: 'success',
                                    onClose:function(){
                                        that.manageInit(that.formsubmitdata);
                                    }
                                });
                                //that.response.list[that.listIndex].deleatOrder = true;
                            }else{
                                that.$message({
                                    message: val.respMsg,
                                    type: 'error'
                                });
                            }
                            that.delateForm.deleteReason='';
                    });
                    that.dialogNopayOrderVisible = false;               
                }
            },
            //是否删除导购单
            confirmdelateguiderOrder(guiderOrderId,guiderCode,storeCode,siteId){
                var that = this;
                that.dialogFormVisible =true;
                that.delateguiderparms={//删除导购单参数
                    guiderOrderId:guiderOrderId,
                    guiderCode:guiderCode,
                    storeCode:storeCode,
                    siteId:siteId
                };
            },
            //点击删导购单弹层确认按钮
            delateguiderOrder(){
                var that=this;
                this.dialogFormVisible = false;
                API.deleteGuiderOrder({"guiderOrderId":that.delateguiderparms.guiderOrderId,"guiderCode":that.delateguiderparms.guiderCode,"storeCode":that.delateguiderparms.storeCode,"siteId":that.delateguiderparms.siteId}).then(function(data){
                    if(data.success){
                        that.$message({
                            message:'删除成功',
                            duration:5000,
                            type: 'success',
                            onClose:function(){
                                that.manageInit(that.formsubmitdata);
                            }
                        });

                    }else{
                    // Message.error(data.respMsg);
                        that.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
        },
        mounted(){
           // this.orderState();
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
            }
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
.categorybox .el-form-item__label,
.categorybox .el-form-item__content {
    float: left;
}

.categorybox {
    width: 100%
}

.categorybox .el-form-item__content {
    width: 60%
}
.tabel-title{
    font:bold 20px/50px 'Microsoft YaHei';
    color:#5e5e5e;
}
.textellipsis{
    width:180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
