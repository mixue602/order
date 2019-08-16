<template>
    <div class="details-content">
        <g-header v-model="initheader"></g-header>
        <el-steps :active="steps.stepsId" simple style="margin-top: 10px;">
            <el-step v-for="(item,index) in steps.stepsList" :key="index" :title="item"></el-step>
        </el-steps>
        <el-row :infoList="infoList" class="el-row-info" data-before="退订金信息">
            <el-col :span="8" data-before="退订金单号:" class="el-col-info">{{infoList.refundId}}</el-col>
            <el-col :span="8" data-before="退订金状态:" class="el-col-info">{{infoList.statusName}}</el-col>
            <el-col :span="8" data-before="会员卡号:" class="el-col-info">{{infoList.userCard}}</el-col>
            <el-col :span="8" data-before="申请人姓名:" class="el-col-info">{{infoList.operatorName}}</el-col>
            <el-col :span="8" data-before="申请人角色:" class="el-col-info">{{infoList.operatorPositionDesc}}</el-col>
            <el-col :span="8" data-before="申请人编号:" class="el-col-info">{{infoList.operatorId}}</el-col>
            <el-col :span="8" data-before="退订金原因:" class="el-col-info">{{infoList.refundReason}}</el-col>
            <el-col :span="24" data-before="问题描述:" class="el-col-info">{{infoList.refundReasonDetail}}</el-col>
        </el-row>
        <el-row class="el-row-info" data-before="退款明细">
            <el-col :span="24" class="el-col-info" data-before="预计退款金额：">
                <span class="refundMoney">¥{{commodityList.refundAmount}}</span>
            </el-col>
            <el-col :span="24">
                <dl class="refundCommodity">
                    <dt><img :src="commodityList.imgUrl"/></dt>
                    <dd>交定金：<span class="refundMoney">¥{{commodityList.paidAmount}}</span></dd>
                </dl>
            </el-col>
            <div v-if="tableData != ''">
                <el-col :span="24">
                    <p class="refundInfo">退款信息</p>
                </el-col>
                <el-col :span="22" :offset="1">
                    <el-table :data="tableData" align="center" border style="width: 100%" :show-header="true" class="refundTable" size="small">
                        <el-table-column prop="refundId" label="退款单号" align="center"></el-table-column>
                        <el-table-column prop="refundReason" label="退款原因" align="center"></el-table-column>
                        <el-table-column prop="refundType" label="退款方式" align="center"></el-table-column>
                        <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>
                        <el-table-column prop="refundAmount" label="退款金额" align="center"></el-table-column>
                        <el-table-column prop="refundStatusName" label="退款状态" align="center"></el-table-column>
                    </el-table>
                </el-col>
            </div>
            
        </el-row>
        <el-row class="el-row-info" data-before="审核" v-if="infoList.auditFlag == '1' && pageStatus === 'examine'">
            <el-col :span="24" class="el-col-info" data-before="是否同意退换货">
                <el-radio v-model="examineList.radio" label="1" style="margin-left: 20px;">同意</el-radio>
                <el-radio v-model="examineList.radio" label="0">不同意</el-radio>
            </el-col>
            <p class="examineTle">审核理由</p>
            <el-input
                type="textarea"
                maxlength="150"
                class="examineArea"
                placeholder="请在此填写审核理由"
                v-model="examineList.textarea">
            </el-input>
            <div style="text-align: center;margin-top: 20px;">
                <el-button type="primary" size="small" v-if="LOGINDATA.orderplatform_depositRetreat_SubmitAudit" @click="examineSubmit">提交审核</el-button>
            </div>
        </el-row>
        <el-row class="el-row-info" data-before="退定金记录" v-if="orderLog != null">
            <el-col :span="23" :offset="1" class="refundRecord" v-for="(val,index) in orderLog" :key="index">
                <span class="refundTime">{{val.createDate}}</span>
                <i class="el-icon-success sr__icon"></i>
                <span class="refundTxt">{{val.remark}}</span>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import API from '@/api/depositReplace/depositApply';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            initheader:{
                "content":"退订金详情" //tit名字
            },
            steps:{   // 订单进度
                stepsId: 0,
                stepsList: []
            },
            pageStatus: '', //页面状态
            infoList:{}, // 退订金信息
            commodityList: {},  // 退款明细
            tableData: [],   // 退款信息
            orderLog: [],  //退订金记录
            examineList: {
                radio: '',
                textarea: ''
            } //退订金审核
        }
    },
    created() {
        let routerQuery = this.$router.history.current.query;
        this.pageStatus = routerQuery.pageStatus;
        this.refundInfo(routerQuery);
    },
    methods: {
        // 订单初始化
        refundInfo(routerQuery) {
            API.queryRefundDetail({"refundId": routerQuery.refundId}).then(res => {
                if(res.success){
                    this.infoList.refundId = res.response.refundId;
                    this.infoList.statusName = res.response.statusName;
                    this.infoList.userCard = res.response.userCard;
                    this.infoList.operatorName = res.response.operatorName;
                    this.infoList.operatorPositionDesc = res.response.operatorPositionDesc;
                    this.infoList.operatorId = res.response.operatorId;
                    this.infoList.refundReason = res.response.refundReason;
                    this.infoList.refundReasonDetail = res.response.refundReasonDetail;
                    this.infoList.auditFlag = res.response.auditFlag;
                    this.tableData.push(res.response.detail);
                    this.commodityList.imgUrl = res.response.imgUrl;
                    this.commodityList.refundAmount = res.response.refundAmount;
                    this.commodityList.paidAmount = res.response.paidAmount;
                    this.orderLog = res.response.orderLog;
                    if(res.response.statusName == "已取消"){
                        this.steps.stepsList = ['提交申请', '已取消'];
                    }else{
                        this.steps.stepsList = ['提交申请', '店长审核', '财务退款', '退货完成'];
                    }
                    this.isSteps(res.response.statusName);
                }else{
                    this.$message.error(res.respMsg);
                }
            })
        },
        // 订单进度判断
        isSteps(name) {
            switch (name) {
                case "待店长审核":
                    this.steps.stepsId = 1
                    break;
                case '退订金处理中':
                    this.steps.stepsId = 2
                    break;
                case '已完成':
                    this.steps.stepsId = 3
                    break;
                case '已取消':
                    this.steps.stepsId = 1
                    break;
                default:
                    this.steps.stepsId = 0
            }
        },
        // 提交审核
        examineSubmit() {
            if(this.examineList.radio ==="" ){
                this.$message.warning('请选择是否同意退订金');
                return;
            }
            if(this.examineList.textarea === ''){
                this.$message.warning('请输入审核理由');
                return;
            }
             this.$confirm('您确定要提交审核结果吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.examineRefund();
            });
        },
        // 审核请求
        examineRefund() {
            let params = {
                refundId: this.infoList.refundId,
                auditStatus: this.examineList.radio,
                auditRemark: this.examineList.textarea
            };
            API.auditRefund(params).then(res => {
                if(res.success){
                    this.$message.success('审批成功');
                    window.location.reload();
                }else{
                    this.$message.error(res.respMsg);
                }
            })
        }
    },
    computed:mapState({
        LOGINDATA:'LOGINDATA'
    })
}
</script>
<style>
    .details-content{
        border: 1px solid #eaeefb
    }
    .el-row-info{
        padding-bottom: 10px;
        position: relative;
        margin-top: 10px;
    }
    .el-row-info::before{
        content: attr(data-before);
        display: block;
        font-size: 14px;
        font-weight: bold;
        padding: 8px 10px;
        margin-bottom: 15px;
        color: #606266;
        background-color: #eef7ff;
    }
    .el-refund-info{
        font-size: 14px;
        font-weight: bold;
        padding: 8px 10px;
        margin-bottom: 15px;
        color: #606266;
        background-color: #ccc;
    }
    .el-col-info{
        position: relative;
        padding-left: 160px;
        padding-right: 10px;
        line-height: 30px;
        min-height: 30px;
        word-break: break-all;
        word-wrap: break-word;
        color: #606266;
    }
    .refundMoney{
        color: #e3101e;
    }
    .el-col-info::before{
        content: attr(data-before);
        position: absolute;
        width: 155px;
        left: 0;
        text-align: right;
        font-size: 14px;
        color: #606266;
    }
    .refundCommodity{
        margin: 10px 0 0 55px;
    }
    .refundCommodity dt{
        width: 60px;
        height: 60px;
        float: left;
        margin-right: 15px;
    }
    .refundCommodity dt img{
        width: 100%;
    }
    .refundCommodity dd{
        line-height: 60px;
        float: left;
        color: #606266;
    }
    .refundInfo{
        font-size: 14px;
        font-weight: bold;
        padding: 8px 10px;
        margin-bottom: 15px;
        color: #606266;
        background-color: #f9f9f9;
        margin: 10px 20px;
    }
    .examineTle{
        font-size: 14px;
        color: #606266;
        line-height: 28px;
        text-indent: 57px;
    }
    .el-textarea__inner{
        width: 90%;
        height: 100px;
        margin: 0 50px;
    }
    .refundRecord{
        margin-bottom: 10px;
    }
    .refundTime{
        font-size: 14px;
        margin-right: 20px;
    }
    .sr__icon{
        font-size: 18px;
        margin-right: 20px;
        color: #67c23a;
    }
    .refundTxt{
        font-size: 14px;
    }
</style>

