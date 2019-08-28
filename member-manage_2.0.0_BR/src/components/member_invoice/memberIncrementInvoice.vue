<template>
    <div class="">
        <el-form size="small" :inline="true" label-width="120px" class="incrementCondition" @submit.native.prevent>
            <div class="incrementContent">
                <span class="incrementInfo">国美会员卡</span>
                <div class="incrementfrom">
                    <el-form-item label="会员手机号：">
                        <el-input @change.native="memberPhone = memberPhone.replace(/[^\d]/g, '')" v-model="memberPhone" placeholder="请输入会员手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="会员卡号：">
                        <el-input @keyup.native="cardId = cardId.replace(/[^\d]/g, '')" maxLength="30" v-model="cardId" placeholder="请输入会员卡号"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="incrementContent">
                <span class="incrementInfo">增票资质信息</span>
                <div class="incrementfrom">
                    <el-form-item label="纳税人识别号：">
                        <el-input maxLength="20" v-model="taxpayerNO" placeholder="请输入会员纳税人识别号"></el-input>
                    </el-form-item>
                    <el-form-item label="注册电话：">
                        <el-input maxLength="16" v-model="registeredPhone" placeholder="请输入注册电话"></el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="incrementSubmit">
                <el-button size="small" plain style="width:150px;" @click="emptyInvoice">清空</el-button>
                <el-button type="primary" v-if="LOGINDATA.membermanage_memberIncrementInvoice_query" size="small" plain style="width:150px;" @click="queryInvoice">查询</el-button>
            </div>
        </el-form>
        <el-table
            :data="invoiceTableData"
            align="center"
            header-row-class-name = "tabelTab"
            border>
            <el-table-column
                property="mobile"
                align="center"
                width="150"
                label="会员手机号">
            </el-table-column>
            <el-table-column
                property="head"
                align="center"
                label="单位名称">
            </el-table-column>
            <el-table-column
                property="taxpayerNO"
                align="center"
                label="纳税人识别号">
            </el-table-column>
            <el-table-column
                property="registeredAddr"
                align="center"
                label="注册地址">
            </el-table-column>
            <el-table-column
                property="registeredPhone"
                align="center"
                label="注册电话">
            </el-table-column>
            <el-table-column
                property="taxpayerBank"
                align="center"
                label="开户银行">
            </el-table-column>
            <el-table-column
                property="account"
                align="center"
                label="银行卡号">
            </el-table-column>
            <el-table-column
                property="statusName"
                align="center"
                label="审核状态">
            </el-table-column>
            <el-table-column
                property="cardStatus"
                align="center"
                label="会员状态">
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="LOGINDATA.membermanage_memberIncrementInvoice_modify" type="primary" plain @click="modifyInvoice(scope)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改增票资质" v-if="isInvoiceDialog" :visible.sync="isInvoiceDialog" width="600px">
            <el-form :model="isInvoiceRuleForm" :rules="isInvoiceRules" ref="isInvoiceRuleForm" size="mini" label-width="130px">
                <el-form-item label="单位名称：" prop="activityName">
                    <el-input v-model="isInvoiceRuleForm.activityName"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" prop="taxpayerNum">
                    <el-input v-model="isInvoiceRuleForm.taxpayerNum" class="Invoiceform"></el-input>
                </el-form-item>
                <el-form-item label="注册地址：" prop="registeredAddress">
                    <el-input v-model="isInvoiceRuleForm.registeredAddress"></el-input>
                </el-form-item>
                <el-form-item label="注册电话：" prop="registeredPhone">
                    <el-input v-model="isInvoiceRuleForm.registeredPhone" class="Invoiceform"></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="opneBank">
                    <el-input v-model="isInvoiceRuleForm.opneBank" class="Invoiceform"></el-input>
                </el-form-item>
                <el-form-item label="银行账号：" prop="bankNumber">
                    <el-input v-model="isInvoiceRuleForm.bankNumber" class="Invoiceform"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isInvoiceDialog = false">返回</el-button>
                <el-button type="primary" v-if="LOGINDATA.membermanage_memberIncrementInvoice_submitModify" size="medium" @click="submitModifyInvoice('isInvoiceRuleForm')">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex';
import API from '@/api/api_invoice/memberIncrementInvoice';
export default {
    data(){
        var isTaxpayer = (rule, value, callback) => {
            if(value == ""){
                callback(new Error("请输入纳税人识别号"));
            }else if(!/^[A-Z0-9]*$/.test(value)){
                callback(new Error("纳税人识别号只能输入半角的数字和大写字母"));
            }else if(value.length < 15 || value.length > 20){
                callback(new Error("纳税人识别号位数限制为15-20位"));
            }else{
                callback();
            }
        }
        var isActivityName = (rule, value, callback) => {
            if(value == ""){
                callback(new Error("请输入单位名称"));
            }else if(!/^[\u4e00-\u9fa5（）《》<>()a-zA-Z]*$/.test(value)){
                callback(new Error("请填写有效的单位名称(汉字、字母、小括号、书名号)"));
            }else if(value.length > 40){
                callback(new Error("单位名称不能超过40个字"));
            }else{
                callback();
            }
        }
        var isRegisteredPhone = (rule, value, callback) => {
            if(value == ''){
                callback(new Error("请输入注册电话"));
            }else if(value.length < 7){
                callback(new Error("注册电话不能少于7位"));
            }else if(value.length > 15){
                callback(new Error("注册电话最多输入16位"));
            }else{
                callback();
            }
        }
        var isBankNumber = (rule, value, callback) => {
            if(value == ""){
                callback(new Error("请输入银行账号"));
            }else if(/\D/.test(value)){
                callback(new Error("银行账号只能输入数字"));
            }else if(value.length > 32){
                callback(new Error("银行账号最多输入32位"));                
            }else{
                callback();
            }
        }
        return{
            chkId: "",              //增票Id
            userID: "",             //用户id
            memberPhone: "",        //会员手机号
            cardId: "",             //会员卡号
            taxpayerNO: "",         //纳税人识别号
            registeredPhone: "",    //注册电话
            queryObj: {},           //查询条件统计
            invoiceTableData: [],    //增票详细信息
            isInvoiceDialog: false,   //修改增票显示隐藏
            isInvoiceRuleForm: {
                activityName: '',       //单位名称
                taxpayerNum: '',        //纳税人编号
                registeredAddress: '',  //注册地址
                registeredPhone: '',    //注册电话
                opneBank: '',           //开户银行
                bankNumber: ''          //银行账号
            },
            isInvoiceRules: {
                activityName: [
                    { required: true, validator: isActivityName, trigger: 'blur' }
                ],
                taxpayerNum: [
                    { required: true, validator: isTaxpayer, trigger: 'blur' }
                ],
                registeredAddress: [
                    { required: true, message: '请输入注册地址', trigger: 'blur' },
                    { max: 80, message: '注册地址最多输入80个', trigger: 'blur' }
                ],
                registeredPhone: [
                    { required: true, validator: isRegisteredPhone, trigger: 'blur' }
                ],
                opneBank: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' },
                    { max: 40, message: '开户银行最多输入40个', trigger: 'blur' }
                ],
                bankNumber: [
                    { required: true, validator: isBankNumber, trigger: 'blur' }
                ]
            }
        }
    },
    computed:mapState({
        LOGINDATA:'LOGINDATA'
    }),
    methods:{
        // 清空查询条件
        emptyInvoice(){
            this.memberPhone = "";
            this.cardId = "";
            this.taxpayerNO = "";
            this.registeredPhone = "";
        },
        // 查询增票详细信息
        queryInvoice(){
            this.queryObj = {
                'mobile': this.memberPhone,
                'cardID': this.cardId,
                'taxpayerNO': this.taxpayerNO,
                'registeredPhone': this.registeredPhone
            };
            this.invoiceList();
        },
        // 增票详细信息判断和接口请求
        invoiceList(){
            let _this = this;
            if(_this.queryObj.mobile=="" && _this.queryObj.cardId=="" && _this.queryObj.taxpayerNO=="" && _this.queryObj.registeredPhone==""){
                this.$message.error('至少填写1个查询条件');
                return;
            }
            if(_this.queryObj.mobile!="" && !/^1[3456789]\d{9}$/.test(_this.queryObj.mobile)){
                this.$message.error('请输入正确的手机号');
                return;
            }
            if(_this.queryObj.cardID.length > 30){
                this.$message.error('会员卡号最多输入30位');
                return;
            }
            if(_this.queryObj.taxpayerNO.length > 20){
                this.$message.error('纳税人识别号最多输入20位');
                return;
            }
            if(_this.queryObj.registeredPhone.length > 16){
                this.$message.error('注册电话最多输入16位');
                return;
            }
            API.queryInvoiceList(_this.queryObj).then(res => {
                if(res.success){
                    console.log(_this.invoiceTableData);
                    _this.invoiceTableData = res.data;
                }else{
                    _this.$message.error(res.errMsg);
                }
                
            })
        },
        // 修改增票信息
        modifyInvoice(scope){
            let _this = this;
            _this.chkId = scope.row.chkId;
            _this.userID = scope.row.userID;
            API.queryInvoiceDetail({'chkId':_this.chkId, 'userID':_this.userID})
            .then(res => {
                if(res.success){
                    _this.isInvoiceDialog = true;
                    _this.isInvoiceRuleForm.activityName = res.data.head;
                    _this.isInvoiceRuleForm.taxpayerNum = res.data.taxpayerNO;
                    _this.isInvoiceRuleForm.registeredAddress = res.data.registeredAddr;
                    _this.isInvoiceRuleForm.registeredPhone = res.data.registeredPhone;
                    _this.isInvoiceRuleForm.opneBank = res.data.taxpayerBank;
                    _this.isInvoiceRuleForm.bankNumber = res.data.account;
                    _this.chkId = res.data.chkId;
                    _this.userID = res.data.userID;
                }else{
                    _this.$message.error(res.errMsg);
                }
            })
        },
        submitModifyInvoice(ruleForm){
            let _this = this;
            this.$refs[ruleForm].validate(valid => {
                if(valid){
                    let obj = {
                        "head": _this.isInvoiceRuleForm.activityName,
                        "taxpayerNO": _this.isInvoiceRuleForm.taxpayerNum,
                        "registeredAddr": _this.isInvoiceRuleForm.registeredAddress,
                        "registeredPhone": _this.isInvoiceRuleForm.registeredPhone,
                        "taxpayerBank": _this.isInvoiceRuleForm.opneBank,
                        "account": _this.isInvoiceRuleForm.bankNumber,
                        "chkId": _this.chkId,
                        "userID": _this.userID
                    }
                    API.updateInvoiceInfo(obj).then(res => {
                        if(res.success){
                            _this.isInvoiceDialog = false;
                            this.invoiceList();
                            _this.$message.success('修改增票信息成功');
                        }else{
                            _this.$message.error(res.errMsg);
                        }
                    })
                }
            })
        }
    }
}
</script>
<style>
    .incrementCondition{
        height: 180px;
        border: 1px solid #DCDFE6;
    }
    .incrementContent{
        height: 59px;
        border-bottom:1px solid #DCDFE6;
    }
    .incrementSubmit{
        text-align: center;
        margin-top: 10px;
    }
    .incrementInfo{
        width: 120px;
        height: 60px;
        font-size: 14px;
        color: #606266;
        line-height: 50px;
        display: block;
        text-align: center;
        border-right: 1px solid #DCDFE6;
        float: left;
    }
    .incrementfrom{
        margin-top: 10px;
        float: left;
        height: 40px;
    }
    .el-table{
        margin-top:20px;    
    }
    .tabelTab th{
        background:#EEF6FF;
        height: 40px;
    }
    .Invoiceform{
        width: 200px;
    }
</style>
