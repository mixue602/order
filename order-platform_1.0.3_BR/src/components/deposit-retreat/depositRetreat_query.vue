<template>
    <div>
        <el-form 
            :model="ruleForm"  
            ref="ruleForm" 
            :rules="rules"
            label-width="150px" 
            class="from-query">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="退订金单号：" prop="refundId">
                        <el-input placeholder="请输入退订金单号" v-model="ruleForm.refundId" class="query_input" size="mini"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="routerId !== 'approval'">
                    <el-form-item label="退订金状态："  prop="status">
                        <el-select v-model="ruleForm.status" placeholder="请选择" size="mini" class="query_input">
                            <el-option
                                v-for="item in ruleForm.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
           <el-row>
               <el-col :span="12">
                    <el-form-item label="订金单号：" prop="orderId">
                        <el-input placeholder="请输入订金单号" v-model="ruleForm.orderId" class="query_input" size="mini"></el-input>
                    </el-form-item>
                </el-col>
               <el-col :span="12" required>
                    <el-form-item label="开单时间：">
                        <el-form-item prop="startDate" class="dateItem">
                            <el-date-picker
                                class="query_picker"
                                value-format="timestamp"
                                v-model="ruleForm.startDate"
                                type="date"
                                size="mini"
                                placeholder="开始日期"
                                @change="changePicker"
                                :editable="false"
                                :picker-options="startPicker">
                            </el-date-picker>
                        </el-form-item>
                        <span class="pickerDivision">-</span>
                        <el-form-item  prop="endDate" class="dateItem">
                            <el-date-picker
                                class="query_picker"
                                value-format="timestamp"
                                v-model="ruleForm.endDate"
                                type="date"
                                size="mini"
                                placeholder="结束日期"
                                @change="changePicker"
                                :editable="false"
                                :picker-options="endPicker">
                            </el-date-picker>
                        </el-form-item>
                        <div class="picker_error" v-if="pickerErrorMesg !=''" >{{pickerErrorMesg}}</div>
                    </el-form-item>
                </el-col>
           </el-row>
           <el-row>
               <el-col :span="12">
                    <g-cardnumber class="g-query" v-model="cardumber"></g-cardnumber>
                </el-col>
                <el-col :span="12">
                    <g-sellerno v-model="sellerno"></g-sellerno>
                </el-col>
           </el-row>
           <el-form-item class="form-button">
               <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
               <el-button type="primary" size="mini" style="margin-left: 100px;" v-if="routerId !== 'approval'" @click="retreatFormQuery">查询</el-button>
               <el-button type="primary" size="mini" style="margin-left: 100px;" v-else @click="retreatFormExamine">查询</el-button>
           </el-form-item>
        </el-form>
        <div class="bable-query">
            <el-table :data="tableData" align="center" border style="width: 100%" :show-header="true" size="small">
                <el-table-column align="center" prop="storeName" label="销售部门"></el-table-column>
                <el-table-column align="center" prop="refundId" label="退订金单号"></el-table-column>
                <el-table-column prop="userCard" label="会员卡号" align="center"></el-table-column>
                <el-table-column label="退款金额" align="center">
                    <template slot-scope="scope">
                        <div>
                            ¥{{scope.row.refundAmount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="申请时间" align="center"></el-table-column>
                <el-table-column prop="site" label="申请终端" align="center"></el-table-column>
                <el-table-column prop="operatorName" label="申请人姓名" align="center"></el-table-column>
                <el-table-column prop="operatorPosition" label="申请人岗位" align="center"></el-table-column>
                <el-table-column prop="operatorId" label="申请人员工编号" align="center"></el-table-column>
                <el-table-column prop="statusName" label="退定金状态" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div>
                            <router-link v-if="LOGINDATA.orderplatform_depositRetreat_progress" :to="{path: '/order/depositRetreat_details', query: {refundId: scope.row.refundId,pageStatus: buttonType}}" target="_blank"><el-button size="small" type="text">{{buttonName}}</el-button></router-link>
                        </div>
                        <div v-if="scope.row.cancelFlag == '1'">
                            <el-button size="small" v-if="LOGINDATA.orderplatform_depositRetreat_cancel" type="text" @click="cancelBtn(scope.row.refundId)">撤销申请</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            v-if="total !== 0"
            class="depositPage"
            :page-size="15"
            layout="total, prev, pager, next"
            background
            :total="total"
            @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import API from '@/api/depositReplace/depositApply';
export default {
    data() {
        var checkOrderId = (rule, value, callback) => {
            if (value) {
                let reg = /^[\d]+$/g;
                setTimeout(() => {
                    if (value != "" && !reg.test(value)) {
                        callback(new Error('退订金单号只能是数字！'));
                        this.isOrderId = false;
                    } else {
                        callback();
                        this.isOrderId = true;
                    }
                }, 200);
            }
        };
        return {
            cardumber:{   //会员卡号
                memberCardNoPamas:"",
                memberCardNo:""
            },
            sellerno:{      //导购员编号
                guiderCode:"",
                sellerNo:"",
                disabled:false
            },
            isOrderId: true,   // 退订金单号校验
            isPicker: true,     // 时间校验
            pickerErrorMesg: '',    //时间错误提示语
            total: 0,       // 数据总条数
            current: 1,     // 当前页
            ruleForm:{
                refundId:'',
                orderId: '',
                status: '',
                startDate: '',
                endDate: '',
                options: [{
                    value: '0',
                    label: '全部'
                },{
                    value: '1',
                    label: '待店长审核'
                }, {
                    value: '2',
                    label: '退订金处理中'
                }, {
                    value: '3',
                    label: '已完成'
                }, {
                    value: '4',
                    label: '已取消'
                }]
            },
            rules:{
                refundId: [
                    { validator: checkOrderId, trigger: 'blur' }
                ],
                orderId: [
                    { validator: checkOrderId, trigger: 'blur' }
                ]
            },
            tableData: [],
            routerId: '', //路由参数
            buttonName: '', // 按钮名称
            buttonType: '', //按钮状态
            startPicker:{    //开始时间规范
                disabledDate: (time) => {
                    if(this.ruleForm.endDate !== '' && this.ruleForm.endDate !== null){
                        var end = new Date(this.ruleForm.endDate).getTime();
                        return time.getTime() > Date.now() || time.getTime() > end;
                    }else{
                        return time.getTime() > Date.now();
                    }
                }
            },
            endPicker:{   //结束时间规范
                disabledDate: (time) => {
                    if(this.ruleForm.startDate !== '' && this.ruleForm.startDate !== null){
                        var start = new Date(this.ruleForm.startDate).getTime();
                        return time.getTime() > Date.now() || time.getTime() < start;
                    }else{
                        return time.getTime() > Date.now();
                    }
                }
            }
        }
    },
    created() {
        let routerParams = this.$router.history.current.params;
        this.routerId = routerParams.id;
        routerParams.id === 'approval'? this.buttonName="去审核":this.buttonName="进度查询";
        routerParams.id === 'approval'? this.buttonType="examine":this.buttonType="query";
    },
    mounted() {
        let _this = this;
        //如果是导购员，将检索条件中的导购员置灰并获取默认数据
        if(_this.LOGINDATA.storeStaffId != null){
            _this.sellerno.sellerNo =_this.LOGINDATA.storeStaffId;
            _this.sellerno.guiderCode=_this.LOGINDATA.storeStaffId;
            _this.sellerno.disabled = true
        }
    },
    methods: {
        changePicker(){
            if(this.ruleForm.endDate !== '' && this.ruleForm.endDate !== null && this.ruleForm.startDate !== '' && this.ruleForm.startDate !== null){
                let start = new Date(this.ruleForm.startDate).getTime(),
                    end = new Date(this.ruleForm.endDate).getTime();
                if((start - start)<0){
                    this.isPicker = false;
                    this.pickerErrorMesg ='结束时间不能小于开始时间';
                }else{
                    if(start == 0){
                        this.isPicker = false;
                        this.pickerErrorMesg ='请输入开始时间';
                    }else{
                        let chaday= (end - start)/86400000;
                        if(chaday>30){
                            this.isPicker = false;
                            this.pickerErrorMesg ='请选择30天内的时间范围';
                        }else{
                            this.isPicker = true;
                            this.pickerErrorMesg ='';
                        }
                    }   
                }
            }else{
                console.log(225);
                if (this.ruleForm.startDate == '' || this.ruleForm.startDate == null || new Date(this.ruleForm.startDate).getTime()==0) {
                    
                    this.isPicker = false;
                    this.pickerErrorMesg ='请输入开始时间';
                };
                if (this.ruleForm.endDate == '' || this.ruleForm.endDate == null || new Date(this.ruleForm.endDate).getTime()==0) {
                    
                    this.isPicker = false;
                    this.pickerErrorMesg ='请输入结束时间';
                };
                if((this.ruleForm.startDate == '' || this.ruleForm.startDate == null || new Date(this.ruleForm.startDate).getTime()==0) && (this.ruleForm.endDate == '' || this.ruleForm.endDate == null || new Date(this.ruleForm.endDate).getTime()==0)){
                    this.isPicker = true;
                    this.pickerErrorMesg ='';
                    
                }
            }
        },
        retreatFormQuery() {
            let ruleForm = this.ruleForm;
            if(ruleForm.refundId == "" && ruleForm.orderId == "" && ruleForm.status == '' && ruleForm.startDate == '' && ruleForm.endDate == '' && this.cardumber.memberCardNoPamas == ""  && this.sellerno.guiderCode == ''){
                this.$message.warning('请至少输入一个查询条件');
                return;
            }
            if(this.cardumber.memberCardNoPamas != "error" && this.sellerno.guiderCode != 'error' && this.isPicker && this.isOrderId){
                this.refundList(1);
            }
        },
        retreatFormExamine() {
            let ruleForm = this.ruleForm;
            if(ruleForm.refundId == "" && ruleForm.orderId == "" && ruleForm.startDate == '' && ruleForm.endDate == '' && this.cardumber.memberCardNoPamas == ""  && this.sellerno.guiderCode == ''){
                this.$message.warning('请至少输入一个查询条件');
                return;
            }
            if(this.cardumber.memberCardNoPamas != "error" && this.sellerno.guiderCode != 'error' && this.isPicker && this.isOrderId){
                this.refundList(1);
            }
        },
        refundList(cur) {
            let obj = {
                refundId: this.ruleForm.refundId,
                orderId: this.ruleForm.orderId,
                status: this.routerId === 'approval'? '1': this.ruleForm.status,
                userCard: this.cardumber.memberCardNoPamas,
                sellerId: this.sellerno.guiderCode,
                startCreateDate: this.ruleForm.startDate ? this.ruleForm.startDate * 1 : "",
                endCreateDate: this.ruleForm.endDate ? this.ruleForm.endDate * 1 + 24 * 60 * 60 * 1000 - 1 : "",
                pageNo: cur,
                pageSize: '15'
            }
            API.queryRefundList(obj).then(res => {
                if(res.success){
                    this.tableData = res.response.list;
                    this.total = res.response.total;
                }
            })
        },
        handleCurrentChange(val){
            this.current = val;
            this.refundList(val);
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
            this.cardumber.memberCardNo = "";
            this.pickerErrorMesg = "";
            if(this.LOGINDATA.storeStaffId == null){
                this.sellerno.sellerNo = "";
            }
        },
        cancelBtn(id){
            this.$confirm('您确定要撤销此申请吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.cancelRefund({'refundId': id}).then(res => {
                    if(res.success){
                        this.$message.success('撤销成功');
                        this.refundList(this.current);
                    }else{
                        this.$message.error(res.respMsg);
                    }
                })
            }).catch(() => {});
        }  
    },
    computed:mapState({
        LOGINDATA:'LOGINDATA'
    })
}
</script>
<style>
    .from-query{
        border: 1px solid #eaeefb;
        padding: 20px 10px 10px;
    }
    .query_input{
        width: 300px;
    }
    .el-date-editor.el-input{
        width: 145px;
    }
    .el-form-item__label{
        width: 150px;
    }
    .g-query .el-form-item__content{
        width: 300px;
    }
    .picker_error{
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 35px;
        left: 0;
    }
    .form-button{
        width: 100%;
        text-align: center;
    }

    .dateItem{
        float: left;
    }
    .pickerDivision{
        float: left;
        padding: 0 3px;
    }
    .bable-query{
        border: 1px solid #eaeefb;
    }
    .el-table--fit{
        margin-top: 20px;
    }
    .el-table th{
        background-color: #eef7ff;
        font-family: "Microsoft YaHei";
        color: #606266;
        text-align: center;
    }
    .depositPage{
        text-align: right;
        margin-top: 20px;
    }
</style>
