<template>
<div class="order_detailsbox">
    <div class="order_details_l"> 
        <el-collapse v-model="pageactiveNames" class="orderdetails_title" @change="handleChange">
            <el-collapse-item title="会员积分充值订单" name="1">   
                <div class="order_details_cont">
                    <!-- 配送单 -->
                    <div class="content">
                        <div class="states">
                            <div class="states_l">
                                <div class="letterspace">{{response.statusName}}</div>
                            </div>
                        </div>
                        <div class="paymentmesg">
                            <span class="mr20">订单编号：{{response.orderId}}</span>
                            <span class="mr20">订单站点：{{response.site}}</span>
                            <span>下单时间：{{response.createDate}}</span>
                        </div>
                        <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">     <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                <thead class="has-gutter">
                                    <tr class="">
                                        <th class="is-center">
                                            <div class="cell">商品</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">充值金额</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">充值美豆</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">会员卡号</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">会员手机号</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">会员姓名</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">导购员编号</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">导购员姓名</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">操作</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="el-table__body">
                                    <tr class="el-table__row">
                                        <td class="el-table_2_column_10 is-center ">
                                            <div class="cell">{{response.goodsDetail.displayName}}</div>
                                        </td>
                                        <td class="el-table_2_column_11 is-center ">
                                            <div class="cell fontYh">￥{{response.goodsDetail.paidamount}}</div>
                                        </td>
                                        <td class="el-table_2_column_12 is-center ">
                                            <div class="cell">{{response.goodsDetail.gomedoNum}}</div>   
                                        </td>
                                        <td class="el-table_2_column_10 is-center ">
                                            <div class="cell">{{response.userCard}}</div>
                                        </td>
                                        <td class="el-table_2_column_11 is-center ">
                                            <div class="cell">{{response.userMobile}}</div>
                                        </td>
                                        <td class="el-table_2_column_12 is-center ">
                                            <div class="cell">{{response.userName}}</div>   
                                        </td>
                                        <td class="el-table_2_column_10 is-center ">
                                            <div class="cell">{{response.goodsDetail.sellerId}}</div>
                                        </td>
                                        <td class="el-table_2_column_11 is-center ">
                                            <div class="cell">{{response.goodsDetail.sellerName}}</div>
                                        </td>
                                        <td class="el-table_2_column_12 is-center ">
                                            <div class="cell"></div>   
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>    
                </div>
            </el-collapse-item>
            <el-collapse-item title="支付信息" name="2">
                <!-- 支付信息 -->
                <div class="ordercont_box">
                    <div class="paymentmesg">
                        <span class="mr20" v-if="response.orderPay.paymentId">支付单号：{{response.orderPay.paymentId}}</span>
                        <span class="mr20" v-if="response.payType">支付类型：{{response.payType}}</span>
                        <span v-if="response.payMethod">支付方式：{{response.payMethod}}</span>
                    </div>
                    <div class="orderinfo" v-if="response.orderId || response.submittedDate || response.state">
                        <div class="item" v-if="response.orderAmount">
                            <span class="label">商品总价： </span> 
                            <div class="info-rcol fontYh">￥{{response.orderAmount}}</div> 
                        </div>
                        <div class="item" v-if="response.payMethod">
                            <span class="label"> {{response.payMethod}}：</span> 
                            <div class="info-rcol fontYh">￥{{response.payAmount}}</div> 
                        </div>
                        <div class="item">
                            <span class="label" v-if="response.payAmount"> 实收金额总计：</span> 
                            <div class="info-rcol fontYh">￥{{response.orderAmount}}</div> 
                        </div>
                    </div>
                    <el-table v-if="response.orderPay.paymentGroupInfoList" :data="response.orderPay.paymentGroupInfoList" border :show-header="true" size="small ">
                        <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>
                        <el-table-column prop="transId" label="交易流水号" align="center"></el-table-column>
                        <el-table-column prop="cashierPayNo" label="收银台支付号" align="center"></el-table-column>
                        <el-table-column prop="paymentAmount" label="交易金额" align="center"></el-table-column>
                        <el-table-column prop="createDate" label="交易时间" align="center"></el-table-column>
                        <el-table-column prop="updateDate" label="交易处理时间" align="center"></el-table-column>
                    </el-table>
                    <el-button type="primary" size="small" v-if="response.cancelFlag == 1 && LOGINDATA.integralrecharge_datails_delate" @click="delateReasonlist">删单</el-button>
                </div>
            </el-collapse-item>
            <el-collapse-item title="订单履历" name="3">
                <!-- 订单履历 -->
                <div class="ordercont_box" v-if="response.orderHistoryList">
                    <ul>
                        <li class="item" v-for="item in response.orderHistoryList" :key="item.id">
                            <span class="item_time">{{item.createDate}}</span><span class="item_cont">{{item.remark}}</span>
                        </li>
                    </ul>
                </div>
                <div class="ordercont_box" v-else>暂无信息</div>
            </el-collapse-item>
        </el-collapse>
    </div>

</div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import API from '@/api/order-integralrecharge/integralrecharge';
import { formatDate } from "@/common/time";
import Env from '@/api/env';
export default {
    data() {
        return {
            tooltipShow:true,
            ishow: true,
            orderId: this.$route.query.orderId,
            param: { orderId: this.$route.query.orderId },
            dispatchingmesg: true,
            dialogVisible: false, //取消配送单弹层变量
            i: -1, //商品列表收起展开变量
            queryorder: false, //是否刷新履历
            lefttitle: {
                showclose: "", //右面的关闭
                content: "配送"
            },
            righttitle: {
                showclose: "", //右面的关闭
                content: "订单信息"
            },
            activeNames: [0], //配送默认展开控制
            pageactiveNames: ["1"], //页面左侧第一个展开
            response: {
            //页面信息
                goodsDetail:[],
                orderPay:{},
                paymentGroupInfo: {},
                orderHistoryList: [],
                returnRequestList:{
                    returnRequests:[]
                },
                shippingGroupList:[]
            },
            delateForm: {
                //发送延保邮箱form
                email: ""
            },
            MessageForm: {
                //重新发送短信form
                tel: ""
            },
            istelerroe: false, //手机号是否错误
            insuranceData:{},//查询购买延保数据
            insuranceDialogVisible:false,//补够延保弹层是否展示
            prarentinsuranceDialogVisible:false,//补够延保弹层是否展示
            buyInsuranceData:{},//查询购买延保数据
            addIncrement:{},//购买延保需要提交的数据
            dialogResend:false,//重新发送短信弹层
            myshippingGroupId:'',//配送单号
            dialogFormVisible:false,//发送协议弹层
            sendinsuranceData:{},//发送延保协议存储数据用
            isemailerroe: false, //邮箱是否错误
            cookieDomain:'',//环境变量
            rejectionDialog:false,//拒收弹层
            rejectionMesg:{//配送单号
                shippingGroupId:''
            },
            receiptDialog:false,//确认收货弹层
            applyRefundDialog:false,//导购员权限的申请退还货弹层提示
            vatAuditState:'',//增票提醒
            insuredInformation:{},//参保信息
        };
    },
    methods: {
        getPageData() {
            //获取页面数据
            var _this = this;
            if (this.orderId) {
                _this.manageInit();
            } else {
                // _this.isErrorTxt = true
            }
        },
        manageInit() {
            //获取页面数据的请求
            var _this = this;
            var parms={
                orderId: this.orderId
            };
            API.queryGomedoOrderDetail(parms).then(function(data) {
                if (data.success && data.response != null) {
                    _this.response = data.response;
                } else {
                    _this.$message({
                        message: data.respMsg,
                        type: "error"
                    });
                }
            });
        },
        //订单履历
        handleChange(val) {
        //订单履历 标题栏点击回调，val 是数组
            let _this = this;
            if (val.length > 0) {
                val.forEach(function(element) {
                    if (element == 3) {
                        //订单
                        _this.queryorder = true;
                    } else {
                        _this.queryorder = false;
                    }
                }, this);
            } else {
                _this.queryorder = false;
            };  
        },
        delateReasonlist() {//删单
            var that = this;
            that
                .$confirm("您确定要删除此订单吗?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                API.cancelOrder(that.param).then(res => {
                    if (res.success) {
                    that.$message({
                        showClose: true,
                        message: "删单成功",
                        type: "success",
                        onClose: function() {
                        //刷新页面
                        location.reload();
                        }
                    });
                    } else {
                    that.$message({
                        showClose: true,
                        message: res.respMsg,
                        type: "error"
                    });
                    }
                });
            });
        },
    },
    mounted() {
        this.getPageData();
        this.cookieDomain = Env.cookieDomain;
    },
    filters: {
        formatDate(time) {
            if (time != null) {
                let date = new Date(time);
                return formatDate(date, "yyyy-MM-dd hh:mm:ss");
            }
        },
        formatDate1(time) {
            if (time != null) {
                let date = new Date(time);
                return formatDate(date, "yyyy-MM-dd");
            }
        },
        formatInvoiceType(cellValue){
            //发票类型
            if (cellValue === 0) {
                return "普通发票";
            } else if (cellValue === 1) {
                return "增值税发票";
            }
        },
    },
    watch: {
        queryorder: function() {
            let _this = this;
            if (this.queryorder) {
                //订单履历
                API.queryOrderLogList({
                    orderId: this.response.orderId //订单号
                }).then(function(data) {
                    if (data.success) {
                        //_this.response.orderHistoryList = data.response;
                        _this.$set(_this.response,'orderHistoryList',data.response);
                        console.log(_this.response.orderHistoryList)
                    } else {
                        _this.$message({
                        message: data.respMsg,
                        type: "error"
                        });
                    }
                });
            }
        },
        insuranceData:{
            handler:function(){
                this.buyInsuranceData = this.insuranceData;
            },
            deep: true
        },
        insuranceDialogVisible:{
            handler:function(){
                this.prarentinsuranceDialogVisible = this.insuranceDialogVisible;
            },
            deep: true
        },
    },
    computed: {
        ...mapState({
        //vuex取值
        LOGINDATA: "LOGINDATA"
        }),
    },
};
</script>
<style>
.fl{
    float:left;
}
.fr{
    float:right;
}
.red{
    color:#F56C6C;
}
.mt10 {
  margin-top: 10px;
}
.mt20 {
  margin-top: 20px;
}
.order_detailsbox {
  position: relative;
  min-height: 800px;
}
.order_details_l {
  border: 1px solid #e4e7ed;
}
.orderinfo,
.payinfor {
  margin: 10px auto;
  background: #f2f6fc;
  color: #303133;
  padding: 5px 0;
}
.orderinfo .item {
  width: 260px;
  display: flex;
  /* height: 30px; */
  line-height: 30px;
  padding-left: 20px;
}
.orderinfo .item .label {
  /* flex: 0 0 100px; */
  text-align: right;
}
.orderinfo .item .info-rcol {
  flex: 1;
  text-align: left;
}
.ml10 {
  margin-left: 10px;
}
.ml20 {
  margin-left: 20px;
}
.ml40 {
  margin-left: 40px;
}
.mr20 {
  margin-right: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.payinfor {
  background: #ebeef5;
  font-size: 12px;
}
.payinfor .item {
  width: 220px;
  display: flex;
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
}
.payinfor .item .label {
  /* flex: 0 0 200px; */
  text-align: right;
}
.payinfor .item .info-rcol {
  flex: 1;
  text-align: left;
}
.el-collapse-item__arrow {
  height: 35px;
  line-height: 35px;
}
.order_details_cont {
  padding: 20px;
}
/*配送单下拉*/
.content {
  border: 1px solid #e4e7ed;
  padding: 10px;
}
.states {
  display: flex;
  border-bottom: 1px solid #409eff;
  height: 39px;
  margin-bottom: 20px;
}
.states .states_l {
  position: relative;
  flex: 0 0 300px;
  line-height: 40px;
  text-align: left;
  font-weight: bold;
}
.states .states_r {
  flex: 1;
  text-align: right;
}
.content_title {
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}
thead.has-gutter th,.el-table th.is-leaf {
  background: #eef6ff;
  padding: 8px;
  font-size: 12px;
}
.el-table__body td {
  padding: 5px 0;
  font-size: 12px;
}
.shippingbtn_icon {
  font-size: 18px;
  cursor: pointer;
}
/* 配送信息 */
.dispatching_box {
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 10px;
}
.dispatching_box .item,
.dispatching_box1 .item,
.ordercont_box .item {
  line-height: 30px;
  display: flex;
  color: #909399;
}
.ordercont_box .item {
  color: #303133;
}
.dispatching_box .item .item_time,
.ordercont_box .item .item_time {
  flex: 0 0 180px;
  margin-left: 50px;
}
.dispatching_box1 .item .item_time {
  flex: 0 0 60px;
}
.dispatching_box .item .item_cont,
.dispatching_box1 .item .item_cont,
.ordercont_box .item .item_cont {
  flex: 1;
}
.commontitle {
  height: 35px;
  line-height: 35px;
  padding-left: 15px;
  background: #ebeef5;
  color: #303133;
}
.commontitle_1,
.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
  overflow: hidden;
  clear: both;
}
.paymentmesg {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.paymentmesg1 {
  display:flex;
  line-height: 30px;
}
.paymentmesg1 .title{
    flex:0 0 100px;
    text-align:right;
}
.ordercont_box {
  border: none;
  padding: 10px;
}
.gifttipsmesg {
  color: #909399;
  margin-bottom: 10px;
}
/* 多行文本溢出 */
.ellipsis {
  overflow: hidden;
  height: 46px;
  line-height: 23px;
}

.ellipsis:before {
  content: "";
  float: left;
  width: 5px;
  height: 46px;
}

.ellipsis > *:first-child {
  float: right;
  width: 100%;
  margin-left: -5px;
}

.ellipsis:after {
  content: "...";
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  float: right;
  position: relative;
  top: -25px;
  left: 100%;
  width: 13px;
  margin-left: -13px;
  padding-right: 5px;
  text-align: right;
  background: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover .ellipsis:after,.el-table__body tr.hover-row>td{
  background: #f5f7fa;
}
.orderdetails_subtitle .el-collapse-item__header {
  height: 35px;
  line-height: 35px;
  padding-left: 15px;
  background: #ebeef5;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
  font-size: 12px;
  font-weight: normal;
}
.el-collapse {
  border: none;
}
.el-dialog__header,
.el-dialog__body {
  text-align: left;
}
.el-collapse-item__header.focusing:focus:not(:hover) {
  color: #fff;
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-table--border::after,
.el-table--group::after {
  width: 0;
}
/* 自提 */
.shippingtype {
  margin-right: 20px;
  display: inline-block;
  width: 150px;
}
.inline {
  display: inline;
}
/*赠品分摊*/
.giftbox_title{
    border-bottom:solid 1px #ebeef5;
}
.orderstatusTip{
    transform-origin: left center 0px; 
    z-index: 2087; 
    position: absolute; 
    top: 5px; 
    left: 90px;
    width:340px
}
.orderstatusTip1{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 90px;
    width:280px;
    top: 5px;
}
.orderstatusTip2{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 70px;
    width:230px;
    top: 5px;
}
.orderstatusTip3{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 40px;
    width:460px;
    top: 5px;
}
.orderstatusTip4{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 40px;
    width:450px;
    top: 5px;
}
.orderstatusTip5{
    transform-origin: left center 0px;
    z-index: 2087; 
    position: absolute; 
    left: 90px;
    width:450px;
    top: 5px;
}
.giftbox_cont{
    padding:0px 10px 20px;
    font-family: 12px/1.5 arial,"\65B0\5B8B\4F53"
}
.giftbox_mesg{
    height: 40px;
    line-height:40px;
    font-size: 12px;
}
.giftbox_cont thead.has-gutter th{
    padding:8px 0;
    text-align: center;
}
.giftbox_cont td{
    padding:0px
}
.giftbox_cont td.bordernone{
    border-bottom:none;
}
.giftbox_cont td.pad8{
    height:46px;
} 
.giftbox_cont .pdtop5{
    padding:0px 5px;
    white-space: normal;
    word-break: break-all;
}
.giftbox_cont td.borderright{
    border-right:none;
}
.giftbox_cont .giftlink,.giftbox_cont .giftlink a,.giftlink a,.giftlink{
    font:12px/30px "Microsoft Yahei";
    text-align:right;
    color:#409eff;
}
.fontM{
    font-family:"Microsoft Yahei";
}
.el-icon-question,.cursor{
    cursor: pointer;
}
.el-tooltip__popper.is-light{
    border: 1px solid #FFFFCC;
    color: #FF161A;
    background: #FFFFCC;
    font-weight: normal;
    padding:5px 10px;
    z-index:10;
}
.el-tooltip__popper.is-light[x-placement^=right] .popper__arrow {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper[x-placement^=right] .popper__arrow::after {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper.is-light[x-placement^=right] .popper__arrow::after {
    border-right-color: #FFFFCC;
}
.el-tooltip__popper.is-custom[x-placement^=bottom] .popper__arrow,.el-tooltip__popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #E6A23C;
}
@-moz-document url-prefix(){.letterspace{letter-spacing:-2px;}}/*仅firefox 识别*/ 
.orderTipbtn{
    border:none;
    font-size:12px;
    color:#409eff;
}
.indent20{
    text-indent: 20px;
}
.orderTipbtn:hover{
    background:none;
}
.indent20,.ordertipcont{
    line-height: 24px;
}
.el-tooltip__popper.is-custom{
    border: 1px solid #E6A23C;
    background: #FFF;
    font-weight: normal;
    padding:5px 10px;
    z-index:10;
}
.el-table__expanded-cell[class*=cell]{
    padding: 0;
    background:#EBEEF5

}
.el-table__expand-icon>.el-icon{
    width:16px;
    height:16px;
    margin-top:-6px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA2NDg0QUYzMTU3RjExRTk4NDBBRkQwODZFOURERTQxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA2NDg0QUY0MTU3RjExRTk4NDBBRkQwODZFOURERTQxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDY0ODRBRjExNTdGMTFFOTg0MEFGRDA4NkU5RERFNDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDY0ODRBRjIxNTdGMTFFOTg0MEFGRDA4NkU5RERFNDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6RhlW0AAAB00lEQVR42mL8//8/AxL4/ebejfOnj9z9BGTzK1uaG6ori7AiK2CEa/j95vTC/gVH37DKamhLcoKFvr+4fOPJbxHLlMJoc7i2/2Dw4eSsvLSS9q03PvxHAx+ub+0BSk07CZUBafh1aVZmUtOqh78Qyn59/YrMe7i2Nil/2qVfEA03Zmen9Rz5imzss621FVufI4t8PTIxIXv+9f//mX6f2nmUyynUmosBL+CyDgvhP7711G+mG+euSjjYyzEQBBJG1uJXzt1kefSYQdJMAhRKz6+ce/wdIvnx3vdvDFdPnnoMNV7WQFeSVVJCguHoExa4CR9v7ly28QWU8+3TJ4Ydy+5CeZL+irqSIhA2CxcXw+/vvxkYWEUciic6QFU831Y3iSGr3UsCxVF/gHZxMikrCd+9cZOBCHD58i1hJSUmOQc7/mNb9n8kpPzbsV3H+BwdZJkYJJ2jTF8s6t/xHEmWlYufn4sFSeDF1q6Fd03D3CShSeP5lvq0zM49yHGNFM+PdnbmJ9RvfwbmwRLf78e7+ictv8tp6B8UYK0myc/FyvD728cXN45uXr3x4jflsOJCZzlW1NQKCtlHxzYs3nLk3ts/UAEWYSWrgFgfGzl+uBqAAAMArAgwrgV46BAAAAAASUVORK5CYII=")
}
.el-table__expand-icon--expanded{
    transform:none
}
.el-icon-arrow-right:before{
    content: ""
}
.el-table__expand-icon--expanded>.el-icon{
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRDcxNkUzMTU3RTExRTk5QkUxODkyMTExMkE2RUM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRDcxNkU0MTU3RTExRTk5QkUxODkyMTExMkE2RUM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZENzE2RTExNTdFMTFFOTlCRTE4OTIxMTEyQTZFQzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZENzE2RTIxNTdFMTFFOTlCRTE4OTIxMTEyQTZFQzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4a0wOWAAABFFBMVEWTlZiveWb19+Lw9/qvfWbd9/pgfbRgebRgYmaOyPptZnP18t7Z8vr1yJT19/Vth7lgldDLlWb137SFsdXB5PWJw/VgZn3r6d7w5Mdga51yo96htdCFuudpYoHLmW/Z6fDwzZjrv4/nw5jn28Liuovww4/17cKXa2bL3/Xn9/rw5NlpZma4gmaTw+xgdKazh293ZmaJv/W92+yJv/Bph7ndsX3GsZTPsYtpldDU5PXLtaav3/rw26vP9/rw39D19+yJYn1ygqKTzfVpmdBkeZ2cgnhgZm9ggr3LlW97i5il2/X199XZ9/qXeWp3seJkYmZgYmp7Ym+zh3P1w5TZo3iTi4GOscu46fp3YoZtb3PBw8f19/of7bF8AAAAq0lEQVR42kyPhQ6DQAxAy5gwYMzd3d3d3V3u//9jd4MMXtKmfU3TFBAh0wHwtn8l4HDtF2uAe3ZmE0WEtabJbNhk80SE/Bsk0TtPEGyTVfQn7O5DvLCThYqyg/mAFNRNQOnR4CORQgYdEbG3hI+IXFm5cl3CbaoUAQ9YXk+5T4y6IKy0mv9VdYsGnGu82HNFPMO/cBfHI0gLzkbJyIvfouj8yDCncYXUXwEGAAiCRD0akPSeAAAAAElFTkSuQmCC")
}
.bold{
    font-weight: bold;
}
.changetitle{
    clear: both;
    font:14px/24px "Microsoft Yahei";
}
.changetitle  .el-icon-success{
    color:#67c23a;
}
.changelist{
    padding-left:20px;
    width:30%;
    float:left;
    margin-right:30px;
    overflow: hidden;
}
.changewarp{
    overflow: hidden;
    padding:20px 0px 20px 40px;
    border-bottom:1px solid #dedede
}
.changeicon{
    margin-top:5px;
}
.changeicon i{
    font-weight:bold
}
.changelist .item .item_cont{
    word-wrap: break-word;
    word-break: break-all;
}
.fulldepositbox{
    position:absolute;
    top:0;
    left:50px;
    font-size:12px;
    color:red;
    font-weight:normal;
    width:400px;
}
.fulldepositbox1{
    font-size:12px;
    color:red;
    font-weight:normal;
    margin-left:20px;
}
/* 参保信息 */
.insuredbox{
    margin-top:-40px;
    height:600px;
    overflow-y: auto;
    font-family: "Microsoft Yahei";
}
.insuredbox .title{
    font:bold 14px/40px "Microsoft Yahei";
    color: #5e5e5e;
    border-bottom:1px solid #dedede;
    margin-top:10px;
}
.insuredbox .conent{
    display:flex;
    height: 30px;
    line-height:30px;
    border-bottom:1px solid #dedede;
    font-size:12px;
}
.insuredbox .conentmesg{
    line-height:30px;
    border-bottom:1px solid #dedede;
    font-size:12px;
}
.insuredbox .conentmesg .imgitem{
    text-align: center;
    margin-bottom:10px;
}
.insuredbox .conent .name{
    flex:0 0 150px;
    text-align:left;
}
.insuredbox .conent .mesg{
    flex: 1;
    text-align:right
}
.fontYh{
    font-family: "Microsoft Yahei";
}
</style>




