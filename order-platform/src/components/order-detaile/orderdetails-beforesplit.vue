<template>
<div class="order_detailsbox">
    <div class="order_details_l"> 
        <el-collapse v-model="pageactiveNames" class="orderdetails_title" @change="handleChange">
            <el-collapse-item title="配送" name="1">
                <div class="order_details_cont">
                    <!-- 配送单 -->
                    <div class="commontitle">配送单：{{response.shippingGroupId}}</div>               
                    <div class="content">
                        <div v-for="(shippingItem,index) in response.shippingGroupList" :key="shippingItem.id">
                            <!-- 收货人表格 -->
                            <div v-if="shippingItem.consigneeName || shippingItem.consigneePhone || shippingItem.consigneeAddress" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small ">                   
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                    <thead class="has-gutter">
                                        <tr class="">
                                            <th width="20%" class="is-center">
                                                <div class="cell">收货人</div>
                                            </th>
                                            <th class="is-center">
                                                <div class="cell">电话</div>
                                            </th>
                                            <th class="is-center">
                                                <div class="cell">收货地址</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="el-table__body">
                                        <tr class="el-table__row">
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneeName}}</div>
                                            </td>
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneePhone}}<el-button  v-if="!shippingItem.showbtn && LOGINDATA.orderplatform_orderBeforesplit_seeTel" @click="lookTelNum(shippingItem)" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                                </div>
                                            </td>
                                            <td class="is-center ">
                                                <div class="cell">{{shippingItem.consigneeAddress}}</div>                                           
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- 套装信息 -->
                            <div class="content_title" v-if="shippingItem.packageTab=='1'">套装<span class="fr">套装总价： ¥{{shippingItem.packagePrice}}</span></div>
                            <div class="content_title" v-else>商品信息</div>
                                <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">   
                                    <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
                                        <thead class="has-gutter">
                                            <tr class="">
                                                <th width="5%"></th>
                                                <th class="is-center" width="10%">
                                                    <div class="cell">商品名称</div>
                                                </th>
                                                <th class="is-center" width="10%">
                                                    <div class="cell">商品编码</div>
                                                </th>
                                                <th class="is-center" width="6%">
                                                    <div class="cell">价格</div>
                                                </th>
                                                <th class="is-center" width="6%">
                                                    <div class="cell">数量</div>
                                                </th>
                                                <th class="is-center" width="6%">
                                                    <div class="cell">品牌</div>
                                                </th>
                                                <th class="is-center" width="6%">
                                                    <div class="cell">业务机型</div>
                                                </th>
                                                <th class="is-center" width="8%">
                                                    <div class="cell">导购员编号</div>
                                                </th>
                                                <th class="is-center" width="10%">
                                                    <div class="cell">导购员姓名</div>
                                                </th>
                                                <th class="is-center" width="9%">
                                                    <div class="cell">配送方式</div>
                                                </th>
                                                <th class="is-center" width="9%">
                                                    <div class="cell" style="width:70px;">配送时间</div>
                                                </th>
                                                <th class="is-center" width="6%">
                                                    <div class="cell">安装方式</div>
                                                </th>
                                                <th class="is-center" width="9%">
                                                    <div class="cell" style="width:70px;">安装时间</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.commerceItemList" :key="prdItem.id">
                                            <tr class="el-table__row">
                                                <td class="is-center">
                                                    <i v-if='prdItem.salesPromotionList.length !=0' class="shippingbtn_icon" @click="prdItem.show=!prdItem.show" v-bind:class="prdItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell ellipsis" :title="prdItem.displayName">
                                                        <div>
                                                        <el-tag type="danger" v-if="prdItem.type ==2" size="mini">赠品</el-tag>
                                                        <el-tag  v-if="prdItem.packageTab ==1" size="mini">套装</el-tag>
                                                        <el-tag v-if="prdItem.preSellTab ==1" type="success" size="mini">预售</el-tag>
                                                        {{prdItem.displayName}}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.skuNo}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.salePrice}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.quantity}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.brandName}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.salesModel}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.guiderCode}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.guiderName}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.shippingMethod}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.appointmentDeliveryDate}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.installMethod}}</div>
                                                </td>
                                                <td class="is-center">
                                                    <div class="cell">{{prdItem.appointmentInstallDate}}</div>
                                                </td>
                                            </tr>
                                            <tr class="el-table__row" style="background:#EBEEF5;" v-if='prdItem.show && prdItem.salesPromotionList.length !=0'>
                                                <td colspan="13">
                                                    <div class="ml40">
                                                        <div class="paymentmesg" v-for="salesItem in prdItem.salesPromotionList" :key="salesItem.id"><span class="mr20">{{salesItem.promotionName}}：{{salesItem.promotionDesc}}</span></div>
                                                        <div class="gifttipsmesg">返劵和返美豆在订单收款后发放至用户的会员账户</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            <div class="order_line"></div>
                        </div>
                    </div>
                </div> 
            </el-collapse-item>
            <el-collapse-item title="订单赠品信息" name="2" v-if="response.orderPromotion">
            <!-- 订单赠品信息 -->
                <div class="ordercont_box">
                    <div class="paymentmesg" v-for="(item,index) in response.orderPromotion.orderPromotionList" :key="item.id"><span class="mr20">{{item.promotionName}}：{{item.promotionDesc}}</span></div>
                    <div class="gifttipsmesg">返劵和返美豆在订单收款后发放至用户的会员账户</div>
                    <div  v-for="(zengitem,index) in (response.orderPromotion.orderGiftInfoList)" :key="zengitem.id">
                    <!-- 赠品收货人表格 -->
                        <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small">                   
                            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                <thead class="has-gutter">
                                    <tr class="">
                                        <th width="20%" class="is-center">
                                            <div class="cell">收货人</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">电话</div>
                                        </th>
                                        <th class="is-center">
                                            <div class="cell">收货地址</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="el-table__body">
                                    <tr class="el-table__row">
                                        <td class="is-center">
                                            <div class="cell">{{zengitem.consigneeName}}</div>
                                        </td>
                                        <td class="is-center">
                                            <div class="cell">{{zengitem.consigneePhone}}<el-button v-if="!zengitem.showbtn"  @click="lookTelNum(response,zengitem,zengitem)" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                            </div>
                                        </td>
                                        <td class="is-center">
                                            <div class="cell">{{zengitem.consigneeAddress}}</div>                                           
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- 赠品信息列表 -->
                        <div class="mt20">
                            <template>
                                <el-table :data="zengitem.giftItemList" border style="width: 100%" :show-header="true">
                                    <el-table-column prop="displayName" label="赠品" align="center"></el-table-column>
                                    <el-table-column prop="skuNo" label="商品编码" align="center"></el-table-column>
                                    <el-table-column prop="salePrice" label="价格" align="center" ></el-table-column>
                                    <el-table-column prop="quantity" label="数量" align="center"></el-table-column>
                                    <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
                                    <el-table-column prop="salesModel" label="业务机型" align="center"></el-table-column>
                                    <el-table-column prop="guiderCode" label="导购员编号" align="center"></el-table-column>
                                    <el-table-column prop="guiderName" label="导购员名字" align="center"></el-table-column>
                                    <el-table-column prop="shippingMethod" label="配送方式" align="center"></el-table-column>
                                    <el-table-column width="90" prop="appointmentDeliveryDate" label="配送时间" align="center">
                                        <template slot-scope="scope">
                                            {{scope.row.appointmentDeliveryDate}} 
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="installMethod" label="安装方式" align="center"></el-table-column>
                                    <el-table-column width="90" prop="appointmentInstallDate" label="安装时间" align="center">
                                        <template slot-scope="scope">
                                            {{scope.row.appointmentInstallDate}} 
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                        <div class="order_line"></div>
                    </div>
                </div>   
            </el-collapse-item>
            <el-collapse-item title="发票信息" name="3">
                <!-- 发票信息 -->
                <div class="ordercont_box">
                    <template>
                        <el-table :data="response.invoiceInfoList" border style="width: 100%" :show-header="true">
                            <el-table-column prop="invoiceMediaType" :formatter="formatInvoiceMediaType" label="发票类型" align="center"></el-table-column>
                            <el-table-column prop="invoiceState" label="发票状态" align="center"></el-table-column>
                            <el-table-column prop="invoiceHeadType" label="发票抬头" :formatter="formatInvoiceHeadType" align="center"></el-table-column>
                            <el-table-column prop="taxpayerNo" label="单位税号" align="center"></el-table-column>
                            <el-table-column prop="elecMobile" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="elecMail" label="邮箱地址" align="center"></el-table-column>
                        </el-table>
                    </template>
                </div>
            </el-collapse-item>
            <el-collapse-item title="订单履历" name="4">
                <!-- 订单履历 -->
                <div class="ordercont_box">
                    <ul>
                        <li class="item" v-for="item in response.orderHistoryList" :key="item.id">
                            <span class="item_time">{{item.stateDate | formatDate}}</span><span class="item_cont">{{item.description}}</span>
                        </li>
                    </ul>
                </div>
            </el-collapse-item>
        </el-collapse>

    </div>
    <div class="order_details_r">
        <g-header v-model="righttitle"></g-header>
        <div class="orderinfo" v-if="response.orderId || response.submittedDate || response.state">
            <div class="item" v-if="response.orderId">
                <span class="label">订单编号： </span> 
                <div class="info-rcol">{{response.orderId}}</div> 
            </div>
            <div class="item" v-if="response.submittedDate">
                <span class="label"> 下单时间：</span> 
                <div class="info-rcol">{{response.submittedDate | formatDate}}</div> 
            </div>
            <div class="item">
                <span class="label" v-if="response.state"> 订单状态：</span> 
                <div class="info-rcol">{{response.state}}</div> 
            </div>
        </div>
        <div class="orderinfo" v-if="response.memberCardId || response.memberPhone">
            <div class="item" v-if="response.memberCardId">
                <span class="label">会员卡号： </span> 
                <div class="info-rcol">{{response.memberCardId}}</div>
            </div>
            <div class="item" v-if="response.memberPhone">
                <span class="label">会员电话：</span> 
                <div class="info-rcol">{{response.memberPhone}}<el-button v-if="!response.showbtn && LOGINDATA.orderplatform_orderBeforesplit_seeMemberTel" @click="checkmemberPhone" type="primary" size="mini" class="ml10">查看</el-button></div>
            </div>
        </div>
        <div class="orderinfo" v-if="response.payMethod || response.payType || response.siteId">
            <div class="item" v-if="response.payMethod">
                <span class="label">支付类型： </span> 
                <div class="info-rcol">{{response.payMethod}}</div> 
            </div>
            <div class="item" v-if="response.payType">
                <span class="label">支付方式：</span> 
                <div class="info-rcol">{{response.payType}}</div> 
            </div>
            <div class="item" v-if="response.siteId">
                <span class="label">订单站点：</span> 
                <div class="info-rcol">{{response.siteId}}</div> 
            </div>
        </div>
        <div class="payinfor">
            <div class="item mb10" v-if="response.orderAmount">
                <span class="label">订单小计：</span> 
                <div class="info-rcol">¥{{response.orderAmount}}</div> 
            </div>
            <div class="item" v-if="response.gomeCouponAmount">
                <span class="label">使用美券：</span> 
                <div class="info-rcol">- ¥{{response.gomeCouponAmount}}</div> 
            </div>
            <div class="item mb10" v-if="response.gomeBeansAmount">
                <span class="label">美豆金额：</span> 
                <div class="info-rcol">- ¥{{response.gomeBeansAmount}}</div> 
            </div>
            <div v-if="response.depositExpandAmount">
                <div class="item" v-if="response.depositAmount">
                    <span class="label">定金金额：</span> 
                    <div class="info-rcol">¥{{response.depositAmount}}(抵扣 ¥{{response.depositExpandAmount}})</div> 
                </div>
                <div class="item mb10">
                    <span class="label">尾款金额：</span> 
                    <div class="info-rcol">¥{{response.balanceAmount}}</div> 
                </div>
            </div>
            <div v-else>
                <div class="item mb10" v-if="response.depositAmount">
                    <span class="label">全额定金：</span> 
                    <div class="info-rcol">¥{{response.depositAmount}}</div> 
                </div>
            </div>
            <div class="item" v-for="(item, index) in response.paymentGroupList" :key="item.id">
                <span class="label">{{item.paymentMethodName}}：</span> 
                <div class="info-rcol">¥{{item.payAmount}}</div> 
            </div>
            <div class="item mt10">
                <span class="label">订单金额总计：</span> 
                <div class="info-rcol">¥{{response.orderPaidAmount}}</div> 
            </div>
        </div>
        <div class="orderctrolbox">
            <el-button type="primary" size="small"  @click="selectedtype" v-if="LOGINDATA.orderplatform_orderBeforesplit_select && response.canSelectBizType ==1">选择机型</el-button>
            <el-button type="primary" size="small" @click="dialogVisible = true" v-if="LOGINDATA.orderplatform_orderBeforesplit_cancel && response.canCancel==1">取消订单</el-button>
            <!-- 选择机型弹层 -->
            <el-dialog title="选择商品" :visible.sync="dialogsearchFormVisible" width="830px" align="left">
                <el-form :inline="true" size="mini">
                    <el-row style="height:300px;overflow-y:auto;">
                        <el-table :data="aptList" border style="width: 100%" :show-header="true">
                            <el-table-column prop="itemTypeName" label="业务机型"align="center" width="230px">
                                <template slot-scope="scope">
                                    {{scope.row.itemTypeName}}（在库{{scope.row.qty}}，在途{{scope.row.abQty}}）
                                </template>
                            </el-table-column>
                            <el-table-column prop="poolFlag" width="70" align="center">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.poolFlag=='Y'">联营</div>
                                    <div v-else-if="scope.row.poolFlag=='N'">非联营</div>
                                    <div v-else></div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="logicMasLocDesc" label="仓库" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.logicMasLocDesc}}（编号{{scope.row.logicMasLoc}}）
                                </template>
                            </el-table-column>
                            <el-table-column prop="supplierName" label="供应商" align="center" width="230px">
                                <template slot-scope="scope">
                                    {{scope.row.supplierName}}（编号{{scope.row.supplier}}）
                                </template>
                            </el-table-column>
                            <el-table-column  label="操作" align="center" width="80">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="confirmClick(scope.row)" v-if="LOGINDATA.orderplatform_orderBeforesplit_confirm">确认</el-button>      
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row type="flex"  justify="end" style="margin-top:20px" v-if="searchData.length!=0">
                        <el-col :span="18">
                            <div class="block pagebox">
                                <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="searchPager.currentPage"
                                :page-size="searchPager.pageSize"
                                layout="total,prev, pager, next, jumper"
                                :total="searchPager.totalPage">
                                </el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </div>
    <!-- 取消订单弹层 -->
    <el-dialog
        title="取消订单确认"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>您确定要取消配送单/订单？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="cancelOrder" v-if="LOGINDATA.orderplatform_orderBeforesplit_cancelSure">确 定</el-button>
        </span>
    </el-dialog> 
    <!-- 选择机型选项后，点击“确认”时，选择的机型可卖数为0 -->
    <el-dialog
    title="提示"
    :visible.sync="queryOrderAPTVisible"
    width="30%"
    :before-close="handleClose">
    <span>该选项商品无货，请重新选择！</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="queryOrderAPTVisible = false">取 消</el-button>
        <el-button type="primary" @click="queryOrderAPTVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 选择机型选项后，点击“确认”时，选择的机型可卖数成功去建档 -->
    <el-dialog
    title="提示"
    :visible.sync="creatfilesVisible"
    width="30%"
    :before-close="handleClose">
    <span>机型选择成功，请进行建档！</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="opencreatfiles" v-if="LOGINDATA.orderplatform_orderBeforesplit_creatfile">去建档</el-button>
    </span>
    </el-dialog>
</div>
</template>
<script>
    import API from "@/api/orderDetail/orderdetailsbeforesplit";
    import commitAPT from "@/api/orderDetail/commitOrderAPT";
    import { formatDate } from "@/common/time";
    import {mapState,mapActions} from  'vuex';
    export default{
        data(){
            return {
                orderId: this.$route.query.orderId,
                storeCode: this.$route.query.storeCode,
                openstate:false,
                dialogVisible: false,//取消配送单弹层变量
                dialogsearchFormVisible: false,//选择机型弹层变量
                queryOrderAPTVisible:false,//选择的机型可卖数为0弹层
                creatfilesVisible:false,//选择的机型可卖数成功去建档
                i:-1,//商品列表收起展开变量
                dispatchingmesg:true,
                queryorder:false,//是否刷新履历
                pageactiveNames:["1"],//页面左侧第一个展开
                searchData: [],
                searchPager:{},
                lefttitle:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"配送" 
                },
                righttitle:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"订单信息" 
                },
                activeNames: ['1'],//配送默认展开控制
                response: {//页面信息
                    paymentGroupInfo: {},
                    orderPromotion:{}
                },
                aptList:[]                       
            }
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
            },
            getPageData() {//获取页面数据
                var _this = this;
                if (this.orderId || this.storeCode) {
                    _this.manageInit();
                } else {
                    // _this.isErrorTxt = true
                }
            },
            manageInit() {//获取页面数据的请求
                var _this = this;
                API.orderdetailsbeforesplit({
                    orderId: this.orderId,
                    storeCode: this.storeCode
                }).then(function(data) {
                    if(data.success && data.response !=null){
                        data.response.shippingGroupList.forEach(function(item){
                            //console.log(item);
                            item.commerceItemList.forEach(function(prditem){
                                prditem.show=false;

                            });
                        });                      
                        _this.response = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
            formatInvoiceMediaType: function (row, column, cellValue) {//发票媒介类型
                if (cellValue === 0){
                    return '不开发票';
                }else if (cellValue === 1){
                    return '纸质发票';
                }else if (cellValue === 2){
                    return '电子发票';
                }
            },
            // formatinvoiceState:function(row, column, cellValue){//发票状态
            //     if (cellValue === 0){
            //         return '不开发';
            //     }else if (cellValue === 1){
            //         return '未开票';
            //     }else if (cellValue === 2){
            //         return '已开票';
            //     }else if (cellValue === 3){
            //         return '已作废';
            //     }else if (cellValue === 4){
            //         return '已冲红';
            //     }else if (cellValue === 5){
            //         return '虚拟开票';
            //     }else if (cellValue === 6){
            //         return '发票冲红';
            //     }
            // },
            formatInvoiceHeadType:function(row, column, cellValue){//发票抬头类型  0-个人、1-单位（企业）
                if (cellValue === 0){
                    return '个人';
                }else if (cellValue === 1){
                    return '单位（企业）';
                }
            },
            formatinvoiceBack:function(row, column, cellValue){//发票是否收回  0-未确认收回、1-已确认收回
                if (cellValue === 0){
                    return '未确认收回';
                }else if (cellValue === 1){
                    return '已确认收回';
                }
            },
            // changesort:function(a,b){//表格排序
            //     console.log(a["itemTypeName"].localeCompare(b["itemTypeName"])>0 ? 1:0)
            //    // return a.itemTypeName.localeCompare(b.itemTypeName)>0 ? 1:0;
            //     return a["itemTypeName"].localeCompare(b["itemTypeName"])>0 ? 1:0

            // },
            lookTelNum:function(itemitem){//查看完整手机号
               // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+itemitem.shippingGroupId)
                API.lookTelNum({
                    commerceItemId:itemitem.commerceItemList[0].commerceItemId,
                }).then(function(data) {   
                    if(data.success && data.response!=null){  
                        itemitem.showbtn =true;
                        itemitem.consigneePhone = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
            },
            checkmemberPhone:function(){//查看完整会员手机号
                let _this = this;
                API.memberPhone({
                    storeCode: _this.storeCode,
                    orderId: _this.orderId
                }).then(function(data) { 
                    if(data.success && data.response!=null){
                        _this.response.showbtn = true;
                        _this.response.memberPhone = data.response.phone;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                    
                });
            },
            selectedtype:function(row){//选择机型
                let _this =this;
                _this.dialogsearchFormVisible = true;
                API.queryType({
                    daId:_this.response.shippingGroupList[0].commerceItemList[0].address3,//配送区域（三级）
                    daId2:_this.response.shippingGroupList[0].commerceItemList[0].address4,//配送区域（四级）
                    delivery:_this.response.shippingGroupList[0].commerceItemList[0].shippingMethodCode,//配送方式
                    storeCode: _this.response.storeCode,//门店编码
                    salesOrg: _this.response.saleOrg,//销售组织编码
                    lineId: _this.response.shippingGroupList[0].commerceItemList[0].commerceItemId,//行项目ID
                    partNum:_this.response.shippingGroupList[0].commerceItemList[0].skuNo,//商品编码
                    qty: _this.response.shippingGroupList[0].commerceItemList[0].quantity//数量

                    	// "daId": null,
                        // "daId2": null,
                        // "delivery": "2",
                        // "storeCode": "A007",
                        // "salesOrg": "1001",
                        // "lineId": "45574560",
                        // "partNum": "100253560",
                        // "qty": 1
                }).then(function(data) {   
                    if(data.success){
                        _this.aptList = data.response.skuAptList;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }
                });
                
            },
            confirmClick:function(row){//选择机型确认
                let _this =this;
                if(row.qty == 0){//可卖数为0，提示重新选择
                    this.queryOrderAPTVisible =true;
                }else{//请求可卖数接口，成功后提示去建档
                    commitAPT.commitOrderAPT({
                        daId:_this.response.shippingGroupList[0].commerceItemList[0].address3,//配送区域（三级）
                        daId2:_this.response.shippingGroupList[0].commerceItemList[0].address4,//配送区域（四级）
                        orderNum:_this.orderId,//主订单号
                        requestId:_this.response.shippingGroupId,//配送单号
                        delivery:_this.response.shippingGroupList[0].commerceItemList[0].shippingMethodCode,//配送方式
                        storeCode: _this.response.storeCode,//门店编码
                        salesOrg: _this.response.saleOrg,//销售组织编码
                        lineId: _this.response.shippingGroupList[0].commerceItemList[0].commerceItemId,//行项目ID
                        partNum:_this.response.shippingGroupList[0].commerceItemList[0].skuNo,//商品编码
                        itemType:row.itemType,//业务机型编码
                        supplier:row.supplier,//供应商编码
                        qty: _this.response.shippingGroupList[0].commerceItemList[0].quantity,//数量
                        logicMasLoc:row.logicMasLoc,//逻辑仓编码
                        masLoc:row.masloc,//物理仓编码
                        maslocType:row.maslocType,//仓库类型
                        itemFlag:_this.response.shippingGroupList[0].commerceItemList[0].type,//商品属性
                        poolFlag:row.poolFlag//是否联营（非自然流量NPOP）
                    }).then(function(data) {   
                        if(data.success){
                            _this.creatfilesVisible = true;
                        }else{
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }
                    });
                }
            },
            opencreatfiles:function(){//去建档
                this.creatfilesVisible = false;
                //this.$router.push('/order/creatfilesdetaile/storeCode(门店代码)-orderId(订单号)-commerceItemId(商品唯一号)-operFlag(操作标记：0查看 1新增 2修改)');                
                this.$router.push('/order/creatfilesdetaile/'+this.response.storeCode+'-'+this.response.orderId+'-'+this.response.shippingGroupList[0].commerceItemList[0].commerceItemId+'-1');
            },
            //取消订单
            cancelOrder:function(shippingItem){
                let _this = this;
            // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
                API.cancelOrder({          
                    orderId: this.orderId,//订单号
                    shippingGroupId:this.response.shippingGroupId,//配送单号
                    storeCode: this.storeCode,//销售门店
                    reason:"",//取消原因
                }).then(function(data) {  
                    if(data.success){
                        _this.dialogVisible = false;
                        _this.$message({
                            showClose: true,
                            message: '订单取消成功',
                            type: 'success'
                        });
                        //location.reload();
                        setTimeout(function(){_this.getPageData();},2000)
                        
                        //_this.response.state="已取消";
                        //_this.$router.push({path:'/order/orderindex/'});
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }              
                });
            },
            //订单履历
            handleChange(val) {//订单履历 标题栏点击回调，val 是数组
                let _this =this;
                console.log(val)
                if(val.length>0){
                    val.forEach(function(element) {
                        if(element==4){
                            _this.queryorder=true;
                        }else{
                            _this.queryorder=false;
                        }
                    }, this);
                }else{
                    _this.queryorder=false;
                }                   
            }
        },
        mounted() {
            this.getPageData();
        },
        filters: {
            formatDate(time) {
                if(time!=null){
                    let date = new Date(time);
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
            }
        },
        watch:{         
            queryorder:function(){
                 let _this =this;
                if(this.queryorder){
                    API.queryOrder({                         
                        storeCode: this.response.storeCode,//销售门店
                        orderId: this.response.orderId,//订单号
                    }).then(function(data) {  
                        if(data.success){
                            _this.response.orderHistoryList = data.response;
                        }else{
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }              
                    });
                }
            }
        },
        computed:{
            ...mapState({//vuex取值
            LOGINDATA:"LOGINDATA"
            })
        }
    }
</script>
<style>
.mt10{
    margin-top:10px;
}
.fr{
    float:right;
}
.mt20{
    margin-top:20px;
}
.ml40{
    margin-left:40px;
}
.order_detailsbox{
    position: relative;
    min-height:800px;
}
.order_details_l{
    margin-right:320px;
    border:1px solid #E4E7ED;
}
.order_details_r{
    position:absolute; 
    width:300px;
    border:1px solid #E4E7ED;
    right:0px;
    top:0px;
}
.orderinfo,.payinfor,.orderctrolbox{
    width:280px;
    margin:10px auto;
    background:#f2f6fc;
    color:#303133;
    padding:5px 0;
}
.orderctrolbox{
    background:#fff;
    text-align: right;
}
.orderinfo .item{
    width:260px;
    display: flex;
    /* height:30px; */
    line-height:30px;
    padding-left:20px;
}
.orderinfo .item .label{
    /* flex:0 0 100px; */
    text-align:right;
}
.orderinfo .item .info-rcol{
    flex:1;
    text-align:left;
}
.ml10{
    margin-left: 10px;
    
}
.mr20{
    margin-right:20px;
}
.mb10{
    margin-bottom:10px;
}
.payinfor{
    background:#EBEEF5;
    font-size:12px; 
}
.payinfor .item{
    width:220px;
    display: flex;
    height:24px;
    line-height:24px;
    padding-left:20px;
}
.payinfor .item .label{
    /* flex:0 0 200px; */
    text-align:right;
}
.payinfor .item .info-rcol{
    flex:1;
    text-align:left;
}
.el-collapse-item__header{
    height:35px;
    line-height:35px;
    padding-left:15px;
    background:#EBEEF5;
    border-bottom:1px solid #E4E7ED;
    color: #303133;
}
.el-collapse-item__arrow{
    height:35px;
    line-height:35px;
}
.order_details_cont{
    padding:20px;
}
/*配送单下拉*/
.content{
    border:1px solid #E4E7ED;
    padding:10px;
}
.states{
    display:flex;   
    border-bottom:1px solid #409EFF;
    height: 39px;
    overflow:hidden;
    margin-bottom:20px;
}
.states .states_l{
    flex:0 0 300px;
    line-height:40px;
    text-align:left;
    font-weight:bold;
}
.states .states_r{
     flex:1;
    text-align:right;
}
.content_title{
    height: 30px;
    line-height:30px;
    margin-top:10px;
    font-weight:bold;  
    border-bottom:1px solid #E4E7ED;
    margin-bottom:10px;
    font-size: 14px;
}
thead.has-gutter th{
    background:#eef6ff;
    padding:8px;
    font-size: 12px;
}
.el-table__body td{
    padding:5px 0;
    font-size:12px;
}
.shippingbtn_icon{
    font-size:18px;
    cursor: pointer;
}
/* 配送信息 */
.dispatching_box{
    border:1px solid #ebeef5;
    border-top:none;
    padding:10px;
}
.dispatching_box .item,.ordercont_box .item{
    line-height:30px;
    display: flex;
    color:#909399;
}
.ordercont_box .item{
    color:#303133;
}
.dispatching_box .item .item_time,.ordercont_box .item .item_time{
    flex:0 0 180px;
    margin-left:50px;
}
.dispatching_box .item .item_cont,.ordercont_box .item .item_cont{
    flex:1;  
}
.commontitle{
    height:35px;
    line-height:35px;
    padding-left:15px;
    background:#EBEEF5;
    color: #303133;
}
.commontitle_1,.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
}
.paymentmesg{
    height: 30px;
    line-height:30px;
    margin-bottom:10px;
}
.ordercont_box{
    border:none;
    padding:10px;
}
.order_line{
    height: 0px;
    overflow: hidden;
    border-bottom:1px solid #909399;
    margin-top:20px;
    margin-bottom:20px;
}
.gifttipsmesg{
    color:#909399;
    margin-bottom:10px;
}
.el-collapse{
    border:none
}
.el-collapse-item__header.focusing:focus:not(:hover){
    color:#fff;
}
.el-collapse-item__content{
    padding-bottom:0;
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

.ellipsis>*:first-child {
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
.el-table--enable-row-hover .el-table__body tr:hover .ellipsis:after {
    background:#f5f7fa;
}
.el-table--border::after, .el-table--group::after{
    width:0;
}
</style>




