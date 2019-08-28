<template>
    <el-dialog width="450px" 
    :title="flowQueryginseng.status=='0'&&flowQueryginseng.frozen?'冻结用户':flowQueryginseng.status=='0'&&flowQueryginseng.sfrozen?'申请冻结用户':(flowQueryginseng.status=='1'||flowQueryginseng.status=='2')&&flowQueryginseng.sthaw?'申请解冻用户':'解冻用户'" 
    :visible.sync="isDialog" 
    :before-close="handleClose">
        <p class="applyInfo" v-if="flowQueryList.employeeName">申请人:{{flowQueryList.employeeName}}</p>
        <p class="applyInfo" v-if="flowQueryList.processedReason">冻结原因:{{flowQueryList.processedReason}}</p>
        <textarea style="width:100%; height:70px; resize:none; font-size:12px;" v-model="frozenText"  placeholder="请输入备注" ></textarea>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" v-if="flowQueryginseng.frozen ||flowQueryginseng.thaw" @click="flowExecuteCard('ruleForm')">同意</el-button>
            <el-button type="primary" v-if="flowQueryginseng.status=='0' && flowQueryginseng.sfrozen" @click="flowExecuteCard('ruleForm')">申请冻结</el-button>
            <el-button type="primary" v-if="(flowQueryginseng.status=='1' || flowQueryginseng.status=='2') && flowQueryginseng.sthaw" @click="flowExecuteCard('ruleForm')">申请解冻</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import API from "@/api/api_card/cardCommon"
export default{
    props:{
        dialogType: Boolean,
        flowQueryginseng: Object
    },
    data(){
        return {
            isDialog:true,
            flowQueryFn:"",
            flowQueryList:{},
            parameterObj:{},
            frozenText:""
        }
    },
    computed:mapState({
      LOGINDATA:'LOGINDATA'
    }),
    created(){
        if(this.isDialog){
            if(this.flowQueryginseng.type == 'D'){
                this.flowQueryFn = 'Execute';
                //查询是否有申请
                API.flowQuery({'uid':this.flowQueryginseng.userId,'cid':this.flowQueryginseng.cardNum}).then(res => {
                    if(res.success){
                        if(res.data && res.data!=""){
                            this.flowQueryList = res.data;
                        }
                    }
                })
            }else if(this.flowQueryginseng.type == 'S'){
                this.flowQueryList = {};
                this.flowQueryFn = 'init';
            }
        }
    },
    methods:{
        //提交冻结、解冻原因状态返回信息
        DialogMessage(types, msg){
            this.$message({
                type: types,
                message: msg
            })
        },
        handleClose(){
            this.$emit('Istype',false);
        },
        //确认提交冻结
        flowExecuteCard(){
            this.parameterObj.pcid = this.flowQueryginseng.cardNum;
            this.parameterObj.currentStatus = this.flowQueryginseng.status;
            this.parameterObj.puid = this.flowQueryginseng.userId;
            this.parameterObj.processedReason = this.frozenText;
            //判断点击的是申请冻结还是直接冻结
            if(this.frozenText != ''){
                if(this.flowQueryFn == 'Execute'){
                    if(this.flowQueryList.id){
                        this.parameterObj.id = this.flowQueryList.id;
                    }
                    API.flowExecute(this.parameterObj).then(res => {
                        if(res.success){
                            this.handleClose();
                            this.DialogMessage('success', '提交成功');
                            this.$emit('refreshList',true);
                        }else{
                            this.DialogMessage('error', res.errMsg);
                        }
                    })
                }else{
                    API.flowInit(this.parameterObj).then(res => {
                        if(res.success){
                            this.handleClose();
                            this.DialogMessage('success', '提交成功');
                            this.$emit('refreshList',true);
                        }else{
                            this.DialogMessage('error', res.errMsg);
                        }
                    })
                }
            }else if(this.frozenText.length>200){
                this.DialogMessage('warning', '冻结/解冻原因不能超过两百字');
            }else{
                this.DialogMessage('warning', '请输入冻结/解冻原因');
            }
        },
        alertFn(Hint, callbacks){
            this.$alert(Hint, {
                confirmButtonText: '确定',
                callback: callbacks
            });
        }
    }
}
</script>
<style>
    .applyInfo{
        line-height: 24px;
    }
</style>
