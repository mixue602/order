<template>
    <el-container>
        <el-main class="deposit-main">
            <g-header v-model="header"></g-header>
            <el-form class="depositFrom" ref="depositForm" :model="depositForm" label-width="150px" label-position="right" size="mini">
                <el-form-item label="订金单号：">
                    <p>{{depositForm.orderId}}</p>
                    <dl class="deposit-orderInfo">
                        <dt><img :src="depositForm.imgUrl" alt=""></dt>
                        <dd>
                            <p class="depositInfoSub">交订金：¥{{depositForm.paidAmount}}</p>
                            <p class="depositInfoDetail" v-if="!(depositForm.usedAmount === '0.00' && depositForm.refundAmount === '0.00')">
                                <span v-if="depositForm.usedAmount !== '0.00'">已使用 ¥{{depositForm.usedAmount}}，</span>
                                <span v-if="depositForm.refundAmount !== '0.00'">已退 ¥{{depositForm.refundAmount}}，</span>
                                <span>剩余可退 ¥{{depositForm.leftAmount}}</span>
                            </p>
                        </dd>
                    </dl>
                </el-form-item>
                <el-form-item label="顾客会员卡号：">
                    <p>{{depositForm.userCard}}</p>
                </el-form-item>
                <el-form-item label="预计退款金额：">
                    <p style="color:red;">¥{{depositForm.leftAmount}}</p>
                </el-form-item>
                <el-form-item label="退订金原因：">
                    <el-select v-model="depositForm.region" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in depositForm.reasonList"
                            :key="item.index"
                            :label="item.note"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="问题描述：">
                    <el-input type="textarea" v-model="depositForm.note" :maxlength="150"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="LOGINDATA.orderplatform_depositRetreat_apply" @click="centerDialogVisible = true" >提交申请</el-button>
                </el-form-item>
            </el-form>
            <el-dialog
                title="退款明细"
                :visible.sync="centerDialogVisible"
                width="350px"
                center>
                <div>
                    <span style="float:left;">预计退款金额</span>
                    <span style="float:right;">¥{{depositForm.leftAmount}}</span>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submitApply" size="small">确 定</el-button>
                </span>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<script>
import { mapState } from 'vuex';
import API from '@/api/depositReplace/depositApply';
export default {
    data(){
        return {
            centerDialogVisible: false,  // 弹框判断
            header: {  // 头部
                "content": "申请退订金"
            },
            depositForm: {
                orderId: '',
                imgUrl: '',
                paidAmount: '',
                usedAmount: '',
                refundAmount: '',
                leftAmount: '',
                userCard: '',
                reasonList:[],
                region: '',
                note: ''
            },
            
        }
    },
    created() {
        this.initDepositApply();
    },
    methods: {
        initDepositApply() {
            var orderId = this.$router.history.current.query.orderId,
                _this = this;
            API.applyRefund({"orderId": orderId}).then(res => {
                if(res.success){
                    this.depositForm.orderId = res.response.orderId;
                    this.depositForm.imgUrl = res.response.imgUrl;
                    this.depositForm.paidAmount = res.response.paidAmount;
                    this.depositForm.usedAmount = res.response.usedAmount;
                    this.depositForm.refundAmount = res.response.refundAmount;
                    this.depositForm.leftAmount = res.response.leftAmount;
                    this.depositForm.userCard = res.response.userCard;
                    this.depositForm.reasonList = res.response.reasonList;
                    this.depositForm.region = res.response.reasonList[0].code;
                    this.depositForm.note = res.response.note;
                }else{
                    this.$message.error(res.respMsg);
                }
            })
        },
        submitApply(){
            var params = {
                orderId: this.depositForm.orderId,
                refundAmount: this.depositForm.leftAmount,
                refundReasonCode: this.depositForm.region,
                refundReasonDetail: this.depositForm.note
            }
            API.comifrmRefund(params).then(res => {
                if(res.success){
                    this.$message.success( '提交退换货申请，提交成功!');
                    this.centerDialogVisible = false;
                    this.$router.push({path: '/order/depositRetreat_details', query: {refundId: res.response}});
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
<style type="text/css">
    .deposit-main{
        border: 1px solid #eaeefb;
        padding: 0;
    }
    .deposit-head{
        height: 36px;
        line-height: 36px;
        background: #409EFF;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        text-indent: 15px;
    }
    .depositFrom{
        margin-top: 20px;
    }
    .deposit-orderInfo{
        margin-top: 10px;
    }
    .deposit-orderInfo dt{
        width: 60px;
        height: 60px;
        float: left;
        margin-right: 10px;
    }
    .deposit-orderInfo dt img{
        width: 100%;
    }
    .deposit-orderInfo dd{
        float: left;
        font-size: 12px;
    }
    .depositInfoSub{
        color: #333;
    }
    .depositInfoDetail{
        color: #E6A23C;
    }
    .el-textarea__inner{
        width: 600px;
        height: 100px;
    }
</style>
