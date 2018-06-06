<template>
<div class="order_detailsbox">
    <div class="order_details_l"> 
        <el-collapse v-model="pageactiveNames" class="orderdetails_title" @change="handleChange">
            <el-collapse-item title="配送" name="1">   
                <div class="order_details_cont">
                    <!-- 配送单 -->
                    <el-collapse v-model="activeNames">
                            <el-collapse-item class="orderdetails_subtitle" :name="shippingItem.cur" v-for="(shippingItem,key, index) in response.shippingGroupList" :key="shippingItem.id">
                                <template slot="title">配送单：{{shippingItem.shippingGroupId}}</template>
                                <div class="content">
                                    <div class="states">
                                        <div class="states_l">{{shippingItem.state}}</div>
                                        <div class="states_r" v-if="shippingItem.canCancel ==1 && LOGINDATA.orderplatform_orderDetaile_cancel">
                                            <el-button type="primary" v-if="shippingItem.shippingPromotion ==1" size="mini" @click="jumpto('/order/cancelDelivery_detail',{'storeCode':storeCode,'orderId':orderId,'shippingGroupId':shippingItem.shippingGroupId})">取消配送单</el-button>
                                            <el-button type="primary" v-if="shippingItem.shippingPromotion ==0" @click="shippingItem.dialogVisible = true" size="mini">取消配送单</el-button>
                                            <!-- 取消订单弹层 -->
                                            <el-dialog
                                                title="取消订单确认"
                                                :visible.sync="shippingItem.dialogVisible"
                                                width="30%"
                                                :before-close="handleClose">
                                                <span>您确定要取消配送单/订单？</span>
                                                <span slot="footer" class="dialog-footer">
                                                    <el-button @click="shippingItem.dialogVisible = false">取 消</el-button>
                                                    <el-button type="primary" @click="cancelOrder(shippingItem)" v-if="LOGINDATA.orderplatform_orderDetaile_cancelSure">确 定</el-button>
                                                </span>
                                            </el-dialog> 
                                        </div>
                                    </div>
                                    <!-- 收货人表格 -->
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small"  v-if="shippingItem.consigneeName || shippingItem.consigneePhone || shippingItem.consigneeAddress">                          
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
                                                    <td class="el-table_2_column_10 is-center ">
                                                        <div class="cell">{{shippingItem.consigneeName}}</div>
                                                    </td>
                                                    <td class="el-table_2_column_11 is-center ">
                                                        <div class="cell" v-if="LOGINDATA.orderplatform_orderDetaile_seeTel">{{shippingItem.consigneePhone}}<el-button @click="lookTelNum(shippingItem)" v-if="!shippingItem.showbtn" class="ml10" type="primary" size="mini" plain>查看</el-button>
                                                        </div>
                                                    </td>
                                                    <td class="el-table_2_column_12 is-center ">
                                                        <div class="cell">{{shippingItem.consigneeAddress}}</div>                                           
                                                    </td>
                                                </tr>
                                                <tr v-if="!shippingItem.consigneeName && !shippingItem.consigneePhone && !shippingItem.consigneeAddress">
                                                    <td colspan="3" class="is-center ">
                                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 商品信息 -->
                                    <div class="content_title">商品信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="overflow-x:auto;">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
                                            <thead class="has-gutter">
                                                <tr class="el-table__row">
                                                    <th width="5%"></th>
                                                    <th class="is-center" width="12%">
                                                        <div class="cell">商品名称</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
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
                                                        <div class="cell">品类</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">业务机型</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">导购员编号</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">导购员姓名</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">配送方式</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell" style="width:70px;">配送时间</div>
                                                    </th>
                                                    <th class="is-center" width="6%">
                                                        <div class="cell">安装方式</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell" style="width:70px;">安装时间</div>
                                                    </th>
                                                    <th class="is-center" width="7%">
                                                        <div class="cell">操作</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.commerceItemList" :key="prdItem.id">
                                                <tr class="el-table__row">
                                                    <td class="is-center ">
                                                        <i v-if='prdItem.salesPromotionList.length !=0' class="shippingbtn_icon" @click="prdItem.show=!prdItem.show" v-bind:class="prdItem.show ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell ellipsis" :title="prdItem.displayName">
                                                            <div>
                                                            <el-tag type="danger" v-if="prdItem.type ==2" size="mini">赠品</el-tag>
                                                            <el-tag  v-if="prdItem.packageTab ==1" size="mini">套装</el-tag>
                                                            <el-tag v-if="prdItem.preSellTab ==1" type="success" size="mini">预售</el-tag>
                                                            {{prdItem.displayName}}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.skuNo}}</div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.salePrice}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.quantity}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.brandName}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.categoryName}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.salesModel}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.guiderCode}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.guiderName}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.shippingMethod}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.appointmentDeliveryDate}}</div>
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.installMethod}}</div>                                           
                                                    </td>
                                                    <td class="is-center ">
                                                        <div class="cell">{{prdItem.appointmentInstallDate}}</div> 
                                                    </td>
                                                    <td class="is-center ">   
                                                        <router-link  :to="{path:'/order/applyService',query:{orderId:orderId,shipId:shippingItem.shippingGroupId,commerceItemId:prdItem.commerceItemId,detailId:prdItem.detailId}}">
                                                            <span v-if="prdItem.canReturn==1"><el-button v-if="LOGINDATA.orderplatform_orderDetaile_exchange" type="text" size="small">申请退换货</el-button></span>
                                                        </router-link>

                                                    </td>
                                                </tr>
                                                <!-- <tr class="el-table__row" style="background:#EBEEF5;"  v-show="index == i"> -->
                                                <tr class="el-table__row" style="background:#EBEEF5;"  v-if='prdItem.show && prdItem.salesPromotionList.length !=0'>
                                                    <td colspan="15">
                                                        <div class="ml40">
                                                            <div class="paymentmesg" v-for="(item,index) in (prdItem.salesPromotionList)" :key="item.id" v-if="index<2"><span class="mr20">{{item.promotionName}}：{{item.promotionDesc}}</span></div>                            
                                                            <div class="gifttipsmesg">返劵和返美豆在订单收款后发放至用户的会员账户</div>
                                                            <div class="gifttipsmesg" v-for="(item,index) in (prdItem.salesPromotionList)" :key="item.id" v-if="item.giftCouponItemNum>1">{{item.giftCouponItemNum}}件商品共同享受此促销</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody class="el-table__body" v-if="shippingItem.commerceItemList.length ==0">
                                                <tr>
                                                    <td colspan="15" class="is-center ">
                                                        <div class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
                                                    </td>
                                                </tr> 
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 发票信息 -->
                                    <div class="content_title" v-if="shippingItem.invoiceInfoList.length">发票信息</div>
                                    <template v-if="shippingItem.invoiceInfoList.length">
                                        <el-table :data="shippingItem.invoiceInfoList" border style="width: 100%" :show-header="true">
                                            <el-table-column prop="invoiceMediaType" label="发票类型" align="center" :formatter="formatInvoiceMediaType"></el-table-column>
                                            <el-table-column prop="invoiceState" label="发票状态" align="center"></el-table-column>
                                            <el-table-column prop="invoiceNum" label="发票号码" align="center" ></el-table-column>
                                            <el-table-column prop="invoiceHeadType" :formatter="formatInvoiceHeadType" label="发票抬头" align="center"></el-table-column>
                                            <el-table-column prop="taxpayerNo" label="购方税号" align="center"></el-table-column>
                                            <el-table-column prop="invoiceHead" label="抬头内容" align="center"></el-table-column>
                                            <el-table-column prop="invoiceContent" label="发票内容" align="center"></el-table-column>
                                            <el-table-column prop="invoiceBack" :formatter="formatinvoiceBack" label="是否收回" align="center"></el-table-column>
                                        </el-table>
                                    </template>
                                    <!-- 配送信息 -->
                                    <div class="content_title">配送信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small ">                          
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th width="50" class="is-center"></th>
                                                    <th class="is-center">
                                                        <div class="cell">配送(货运)单号</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">配送单状态</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">承运商</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">承运商电话</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">送货人姓名</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">送货人电话</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body">
                                                <tr class="el-table__row">
                                                    <td class="el-table_2_column_10 is-center ">
                                                        <i class="shippingbtn_icon" v-bind:class="shippingItem.shippingisopen ? 'el-icon-remove-outline':'el-icon-circle-plus-outline'" @click="ShippingResume(shippingItem)"></i>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.shippingGroupId}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.state}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryCompanyName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryCompanyPhone}}</div>                                           
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryStaffName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{shippingItem.deliveryStaffPhone}}</div>                                           
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="dispatching_box" v-if="shippingItem.shippingisopen" style="background:#EBEEF5;">
                                        <ul>
                                            <li class="item" v-for="ShippingResumeItem in shippingItem.shippingResumeList" :key="ShippingResumeItem.id">
                                                <span class="item_time">{{ShippingResumeItem.stateDate | formatDate}}</span><span class="item_cont">{{ShippingResumeItem.description}}</span>
                                            </li>
                                        </ul>
                                        <div v-if="!shippingItem.shippingResumeList">暂无信息</div>
                                    </div>
                                    <!-- 安装信息 -->
                                    <div class="content_title" v-if="shippingItem.shippingInstallList.length != 0">安装信息</div>
                                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" v-if="shippingItem.shippingInstallList.length != 0">
                                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
                                            <thead class="has-gutter">
                                                <tr class="">
                                                    <th width="50"></th>
                                                    <th  class="is-center">
                                                        <div class="cell" width="120">商品名称</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">处理时间</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装状态</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装单号</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">安装网点名称</div>
                                                    </th>
                                                    <th class="is-center">
                                                        <div class="cell">是否作废</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="el-table__body" v-for="(prdItem,index) in shippingItem.shippingInstallList" :key="prdItem.id">
                                                <tr class="el-table__row">
                                                    <td class="is-center">
                                                        <i class="shippingbtn_icon" @click="InstallResume(prdItem,shippingItem)" v-bind:class="prdItem.installisopen ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell ellipsis" :title="prdItem.skuName"><div>{{prdItem.skuName}}</div></div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.appointmentDate | formatDate}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.state}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installNum}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div class="cell">{{prdItem.installSiteName}}</div>
                                                    </td>
                                                    <td class="is-center">
                                                        <div v-if="prdItem.invalidFlag == 0">否</div>
                                                        <div v-else-if="prdItem.invalidFlag == 1">是</div>
                                                    </td>
                                                </tr>
                                                <tr class="el-table__row" style="background:#EBEEF5;" v-if="prdItem.installisopen">
                                                    <td colspan="7">
                                                        <!-- 安装信息履历 -->
                                                        <div class="dispatching_box">
                                                            <ul>
                                                                <li class="item" v-for="installItem in prdItem.installResumeList" :key="installItem.id">
                                                                    <span class="item_time">{{installItem.stateDate | formatDate}}</span><span class="item_cont">{{installItem.description}}</span>
                                                                </li>
                                                            </ul>
                                                            <div v-if="!prdItem.installResumeList">暂无信息</div>
                                                        </div>
                                                        
                                                    </td>
                                                </tr>                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </el-collapse-item>
                    </el-collapse>
                </div>
            </el-collapse-item>
            <el-collapse-item title="订单履历" name="2">
                <!-- 订单履历 -->
                <div class="ordercont_box" v-if="response.orderHistoryList.length">
                    <ul>
                        <li class="item" v-for="item in response.orderHistoryList" :key="item.id">
                            <span class="item_time">{{item.stateDate | formatDate}}</span><span class="item_cont">{{item.description}}</span>
                        </li>
                    </ul>
                </div>
            </el-collapse-item>
            <el-collapse-item title="支付信息" name="3" v-if="response.paymentGroupInfoList">
                <!-- 支付信息 -->
                <div class="ordercont_box" v-for="(paymentItem,index) in response.paymentGroupInfoList" :key="paymentItem.id">
                    <div class="paymentmesg"><span class="mr20">支付单号：{{paymentItem.paymentGroupId}}</span><span>支付类型：{{paymentItem.paymentType}}</span></div>
                    <el-table :data="paymentItem.paymentGroupList" border :show-header="true" size="small ">
                        <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>
                        <el-table-column prop="transId" label="交易流水号" align="center"></el-table-column>
                        <el-table-column prop="cashierPayNo" label="收银台支付号" align="center"></el-table-column>
                        <el-table-column prop="payEntityId" label="合并支付号" align="center"></el-table-column>
                        <el-table-column prop="paymentsType" label="付款类型" align="center"></el-table-column>
                        <el-table-column prop="payAmount" label="交易金额" align="center"></el-table-column>
                        <el-table-column prop="transTimestamp" label="交易时间" align="center"></el-table-column>
                        <el-table-column label="交易处理时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.transDealTimestamp | formatDate}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="ordercont_box" v-if="response.paymentGroupInfoList.length==0">暂无信息</div>
            </el-collapse-item>
            <el-collapse-item title="退货信息" name="4">
                <!-- 退货信息 -->
                <div class="ordercont_box" v-if="response.returnRequestList">
                    <el-table :data="response.returnRequestList" border :show-header="true" size="small ">
                        <el-table-column prop="returnRequestId" label="退换货单号" align="center">
                            <template slot-scope="scope"><el-button  @click="jumpto('/order/serviceList_detail',{'returnRequestId':scope.row.returnRequestId})" type="text" size="small">{{scope.row.returnRequestId}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdDate" label="提交时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.createdDate | formatDate}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="退换货状态" align="center"></el-table-column>
                        <el-table-column prop="refundId" label="退款单号" align="center"></el-table-column>
                        <el-table-column prop="refundState" label="退款单状态" align="center"></el-table-column>
                    </el-table>
                </div>
                <div class="ordercont_box" v-if="!response.returnRequestList">暂无信息</div>
            </el-collapse-item>
        </el-collapse>
    </div>
    <div class="order_details_r">
        <g-header v-model="righttitle"></g-header>
        <div class="orderinfo" v-if="response.orderId || response.createdByOrder || response.submittedDate ||response.state">
            <div class="item" v-if="response.orderId">
                <span class="label">订单编号： </span> 
                <div class="info-rcol">{{response.orderId}}</div> 
            </div>
            <div class="item" v-if="response.createdByOrder">
                <span class="label">原始订单编号：</span> 
                <div class="info-rcol">{{response.createdByOrder}}</div> 
            </div>
            <div class="item" v-if="response.submittedDate">
                <span class="label"> 下单时间：</span> 
                <div class="info-rcol">{{response.submittedDate | formatDate}}</div> 
            </div>
            <div class="item" v-if="response.state">
                <span class="label"> 订单状态：</span> 
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
                <div class="info-rcol">{{response.memberPhone}}<el-button v-if="!response.showbtn && LOGINDATA.orderplatform_orderDetaile_seeMemberTel" @click="checkmemberPhone" type="primary" size="mini" class="ml10">查看</el-button></div>
            </div>
        </div>
        <div class="orderinfo" v-if="response.payMethod || response.payType || response.siteId">            
            <div class="item" v-if="response.payType">
                <span class="label">支付类型：</span> 
                <div class="info-rcol">{{response.payType}}</div> 
            </div>
            <div class="item" v-if="response.payMethod">
                <span class="label">支付方式： </span> 
                <div class="info-rcol">{{response.payMethod}}</div> 
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
    </div>
</div>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import API from "@/api/orderDetail/orderdetails";
//import TEL from "@/api/orderDetail/orderdetailstelnum";
//import Shipping from "@/api/orderDetail/orderShippingResume";
//import Install from "@/api/orderDetail/orderInstallResume";
//import MemberTel from "@/api/orderDetail/ordermembertel";
import { formatDate } from "@/common/time";
export default {
    data() {
        return {
            "ishow":true,
            orderId: this.$route.query.orderId,
            storeCode: this.$route.query.storeCode,
            dispatchingmesg: true,
            dialogVisible: false,//取消配送单弹层变量
            i:-1,//商品列表收起展开变量
            queryorder:false,//是否刷新履历
            returninfo:false,//退货信息是否刷新
            lefttitle: {
                showclose: "", //右面的关闭
                content: "配送"
            },
            righttitle: {
                showclose: "", //右面的关闭
                content: "订单信息"
            },
            activeNames: ["1"], //配送默认展开控制
            pageactiveNames:["1"],//页面左侧第一个展开
            response: {//页面信息
                paymentGroupInfo: {},
                orderHistoryList:[]
            }
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
       // alert('sssss')
            var _this = this;
            if (this.orderId || this.storeCode) {
                _this.manageInit();
               // alert('ss')
            } else {
                // _this.isErrorTxt = true
            }
        },
        manageInit() {//获取页面数据的请求
            var _this = this;
            API.orderdetails({
                orderId: this.orderId,
                storeCode: this.storeCode
            }).then(function(data) {  
                if(data.success && data.response!=null){
                    data.response.shippingGroupList[0].cur="1";  
                    data.response.shippingGroupList.forEach(function(item){
                        item.shippingisopen=false;//配送信息增加展开收起标示
                        item.dialogVisible=false;//取消配送单弹层
                        item.commerceItemList.forEach(function(prditem){//商品信息增加展开收起标示
                            prditem.show=false;
                        });
                        item.shippingInstallList.forEach(function(prditem){//商品信息增加展开收起标示
                            prditem.installisopen=false;
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
        formatinvoiceState:function(row, column, cellValue){//发票状态
            if (cellValue === 0){
                return '不开发';
            }else if (cellValue === 1){
                return '未开票';
            }else if (cellValue === 2){
                return '已开票';
            }else if (cellValue === 3){
                return '已作废';
            }else if (cellValue === 4){
                return '已冲红';
            }else if (cellValue === 5){
                return '虚拟开票';
            }else if (cellValue === 6){
                return '发票冲红';
            }
        },
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
        lookTelNum:function(itemitem){//查看完整手机号
            API.lookTelNum({
                shippingGroupId:itemitem.shippingGroupId
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
        ShippingResume:function(shippingItem){//配送履历  
            let _this =this;     
            if(shippingItem.shippingisopen){
                shippingItem.shippingisopen = !shippingItem.shippingisopen;
            }else{
                //alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
                API.orderShippingResume({
                    storeCode: this.response.storeCode,
                    orderId: this.response.orderId,
                    shippingGroupId:shippingItem.shippingGroupId
                }).then(function(data) {   
                    if(data.success){
                        //alert('ss')
                        shippingItem.shippingisopen = !shippingItem.shippingisopen;
                        shippingItem.shippingResumeList = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }             
                });
            }      
        },
        InstallResume:function(installItem,shippingItem){//安装履历
            
            if(installItem.installisopen){
                installItem.installisopen=!installItem.installisopen
            }else{
                //alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId+"commerceItemId:"+installItem.commerceItemId)
                API.orderInstallResume({
                    storeCode: this.response.storeCode,//销售门店
                    orderId: this.response.orderId,//订单号
                    shippingGroupId:shippingItem.shippingGroupId,//配送单号
                    commerceItemId:installItem.commerceItemId,//商品唯一号
                }).then(function(data) {  
                    if(data.success){
                        installItem.installisopen=!installItem.installisopen;
                        installItem.installResumeList = data.response;
                    }else{
                        _this.$message({
                            message: data.respMsg,
                            type: 'error'
                        });
                    }               
                });
            }
            
        },
        //取消订单
        cancelOrder:function(shippingItem){
            let _this = this;
        // alert("storeCode:"+ this.response.storeCode+"orderId:"+ this.response.orderId+"shippingGroupId:"+shippingItem.shippingGroupId)
            API.cancelOrder({          
                orderId: this.orderId,//订单号
                shippingGroupId:shippingItem.shippingGroupId,//配送单号
                storeCode: this.storeCode,//销售门店
                reason:"",//取消原因
            }).then(function(data) {  
                if(data.success){
                    shippingItem.dialogVisible = false;
                     _this.$message({
                        showClose: true,
                        message: '订单取消成功',
                        type: 'success'
                    });
                    setTimeout(function(){_this.getPageData();},2000)
                    //_this.$router.push({path:'/order/orderindex/'});
                // this.$router.push('/order/creatfilesdetaile/'+this.response.storeCode+'-'+this.response.orderId+'-'+this.response.shippingGroupList[0].commerceItemList[0].commerceItemId+'-1');
                }else{
                     _this.$message({
                        message: data.respMsg,
                        type: 'error'
                    });
                    shippingItem.dialogVisible = false;
                }              
            });
        },
        //订单履历
        handleChange(val) {//订单履历 标题栏点击回调，val 是数组
            //alert(val)
            let _this =this;
            if(val.length>0){
                val.forEach(function(element) {
                    if(element==2){//订单
                        _this.queryorder=true;
                    }else{
                        _this.queryorder=false;
                    };
                    if(element==4){//退货
                        _this.returninfo=true;
                    }else{
                        _this.returninfo=false;
                    };
                }, this);
            }else{
                _this.queryorder=false;
                _this.returninfo=false;
            }  
        },
        //跳转
        jumpto(path,parms){//跳转页面
            //alert(to)
            //this.$router.push(to?to:'/order/orderindex');
            let routeData = this.$router.resolve({ path: path, query: parms });
            window.open(routeData.href, '_blank');
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
            if(this.queryorder){//订单履历
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
        },
        returninfo:function(){//退货信息
            let _this =this;
            if(this.returninfo){
                API.queryreturninfo({                         
                    storeCode: this.response.storeCode,//销售门店
                    orderId: this.response.orderId,//订单号
                }).then(function(data) {  
                    if(data.success){
                        _this.response.returnRequestList = data.response;
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
};
</script>
<style>
.mt10{
    margin-top:10px;
}
.mt20 {
  margin-top: 20px;
}
.order_detailsbox {
  position: relative;
  min-height:800px;
}
.order_details_l {
  margin-right: 320px;
  border: 1px solid #e4e7ed;
}
.order_details_r {
  position: absolute;
  width: 300px;
  border: 1px solid #e4e7ed;
  right: 0px;
  top: 0px;
}
.orderinfo,
.payinfor {
  width: 280px;
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
  padding-left:20px;
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
.ml40{
    margin-left:40px;
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
  padding-left:20px;
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
  overflow: hidden;
  margin-bottom: 20px;
}
.states .states_l {
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
thead.has-gutter th {
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
.dispatching_box .item .item_cont,
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
.commontitle_1,.orderdetails_title .el-collapse-item__header {
  line-height: 36px;
  background: #409eff;
  height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding-left: 15px;
  overflow:hidden;
  clear:both;
}
.paymentmesg {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.ordercont_box {
  border: none;
  padding: 10px;
}
.gifttipsmesg{
    color:#909399;
    margin-bottom:10px;
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
.el-collapse{
    border:none
}
.el-dialog__header,.el-dialog__body{
    text-align:left;
}
.el-collapse-item__header.focusing:focus:not(:hover){
    color:#fff;
}
.el-collapse-item__content{
    padding-bottom:0;
}
.el-table--border::after, .el-table--group::after{
    width:0;
}
</style>




