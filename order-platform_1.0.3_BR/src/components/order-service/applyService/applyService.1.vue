<template>
    <el-container class="applyService" v-loading.fullscreen.lock="loading">
        <!--左侧退换货处理 start-->
        <el-main class="as-processing">
            <g-header v-model="header"></g-header>
            <h2 class="as-processing__tip"
                v-if="serviceData.productDto.hasFreeGiftRemindMsg && serviceData.productDto.hasFreeGiftRemindMsg == 'Y'">
                购买商品中含有赠品，赠品会分摊部分商品金额，故发生退货时退款金额会与商品售价金额不一致。</h2>
             <!-- 提示 -->
            <div class="as-processing__tipred" v-if="serviceData.productDto.fullDepositItemFlag && serviceData.productDto.fullDepositReturnRemindDesc">
                {{serviceData.productDto.fullDepositReturnRemindDesc}}
            </div>
            <el-form class="as-processing__form" id="as-processing__form"
                     :rules="rules"
                     ref="ruleForm"
                     :model="form"
                     size="mini">
                <!--退换货信息 start-->
                <el-row class="as-info as-processing__caption" data-before="退换货信息">
                    <el-form-item label="退换货类型：">
                        <el-radio-group v-model="form.returnType" v-if="serviceData.returnType == '3'">
                            <el-radio :label="1" @change="initReturnRequest">退货</el-radio>
                            <el-radio :label="2" @change="dynamicQueryReturnMethod(form.returnType)">换货</el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="form.returnType" v-if="serviceData.returnType == '4'">
                            <el-radio :label="2" @change="initReturnRequest">退货</el-radio>
                            <el-radio :label="1" @change="dynamicQueryReturnMethod(form.returnType)">换货</el-radio>
                        </el-radio-group>
                        <span class="form_span" v-if="serviceData.returnType == '1'">退货</span>
                        <span class="form_span" v-if="serviceData.returnType == '2'">换货</span>
                    </el-form-item>
                    <el-form-item label="原因：">
                        <el-select v-model="form.returnReason" placeholder="请选择">
                            <el-option v-for="(item, index) in serviceData.returnReasonList"
                                       :label="item.desc"
                                       :value="item.code"
                                       :key="index">
                                {{item.desc}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="已开凭证：">
                        <el-checkbox v-model="form.hasInvoice">发票</el-checkbox>
                        <el-checkbox v-model="form.hasInspectionReport">检测报告</el-checkbox>
                        <el-checkbox v-model="form.hasAuditOA">审批OA</el-checkbox>
                    </el-form-item>
                    <el-row class="refundExchangeWay refundWay__switch">
                        <!--退换货方式 start-->
                        <el-form-item label="退货方式：">
                            <el-radio-group v-model="form.returnMethod"
                                            v-if="serviceData.returnMethodDtoList && serviceData.returnMethodDtoList.length > 1">
                                <el-radio v-for="(item, index) in serviceData.returnMethodDtoList"
                                          :label=item.returnMethod
                                          :value=item.returnMethod
                                          :key=index
                                          @change="tabSwitch(index)">
                                    {{item.returnMethodName}}
                                    <el-popover
                                            placement="right-start"
                                            width="200"
                                            trigger="hover">
                                        <p>退回方式根据配送类型进行判断：商品配送类型为门店自提，退回方式对应为退回门店。商品配送类型为国美配送的，退货方式为物流上门取件。</p>
                                        <el-button slot="reference" class="form__popover__tips">?</el-button>
                                    </el-popover>
                                </el-radio>
                            </el-radio-group>
                            <span class="form__span" v-else>
                                {{serviceData.returnMethodDtoList[0].returnMethodName}}
                                <el-popover
                                        placement="right-start"
                                        width="200"
                                        trigger="hover">
                                        <p>退回方式根据配送类型进行判断：商品配送类型为门店自提，退回方式对应为退回门店。商品配送类型为国美配送的，退货方式为物流上门取件。</p>
                                        <el-button slot="reference" class="form__popover__tips">?</el-button>
                                    </el-popover>
                            </span>
                        </el-form-item>
                        <!--退换货方式 end-->
                    </el-row>
                    <el-form-item label="顾客姓名：" prop="returnProdConsignee">
                        <el-input placeholder="请输入顾客姓名" v-model="form.returnProdConsignee"></el-input>
                        <span class="form-returnMethod__em" v-if="form.returnMethod == 6 && form.returnProdConsignee == ''">（门店自提的订单，如无顾客姓名，请根据实际情况进行补充。示例：国美顾客）</span>
                    </el-form-item>
                    <el-form-item label="顾客电话：" prop="returnProdPhone">
                        <el-input placeholder="请输入顾客电话" v-model="form.returnProdPhone"></el-input>
                    </el-form-item>
                    <!--退换货地址切换 start-->
                    <el-row class="refundExchangeAddress">
                        <!--自提(退回到门店的地址) start-->
                        <el-row class="rea__item rea__store" v-show="form.tabShow == 0">
                            <el-form-item label="退货地址：" v-if="serviceData.addressInfoDto && serviceData.addressInfoDto.pickUpInStoreDetailAddress">
                                <span class="form__span">{{serviceData.addressInfoDto.pickUpInStoreDetailAddress}}</span>
                            </el-form-item>
                        </el-row>
                        <!--自提(退回到门店的地址) end-->
                        <!--物流上门取件地址 start-->
                        <el-row class="rea__item rea__ogistics" v-show="form.tabShow == 1">
                            <el-form-item label="取件地址：" prop="waitModifyContactDetailAddress"  v-if="serviceData.addressInfoDto && serviceData.addressInfoDto.contactAddress">
                                <span class="form__span">{{serviceData.addressInfoDto.contactAddress}}</span>
                                <br>
                                <el-input class="form__input-wrap"
                                          v-model="form.waitModifyContactDetailAddress"
                                          placeholder="请输入取件详细地址">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="新配送地址：" prop="waitModifyReplShipDetailAddress"
                                          v-if="form.returnType == 2">
                                <span class="form__span">{{serviceData.addressInfoDto.contactAddress}}</span>
                                <br>
                                <el-input class="form__input-wrap" v-model="form.waitModifyReplShipDetailAddress"
                                          placeholder="请输入新配送地址"></el-input>
                            </el-form-item>
                            <!--预约取货时间 start-->
                            <el-row class="exchanger__info"
                                    v-if="form.showSelectPickupDateTimeFlag &&
                                    form.showSelectPickupDateTimeFlag == 'Y'">
                                <el-form-item label="预约取货时间：" prop="pickupDate">
                                    <div class="block">
                                        <el-date-picker
                                                v-model="form.pickupDate"
                                                type="date"
                                                @change="changePickupDate"
                                                placeholder="请选择取货时间"
                                                :picker-options="pickerOptions">
                                        </el-date-picker>
                                        <div class="exchanger__timeslot" v-if="form.pickupStartDateTime">
                                            <span class="start">{{form.pickupStartDateTime}}</span>-<span class="end">{{form.pickupEndDateTime}}</span>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-row>
                            <!--预约取货时间 end-->
                        </el-row>
                        <!--物流上门取件地址 end-->
                        <!-- 当前退货地址下支持安装 start-->
                        <!-- 换货状态下并且支持安装 -->
                        <!-- <el-row class="exchanger__info" v-if="(serviceData.returnType == '2' || form.returnType =='2' || form.returnType =='4')  && form.installFlag ==1"> -->
                        <el-row class="rea__item rea__ogistics">
                            <el-row class="exchanger__info" v-if="(serviceData.returnType == '2' || form.returnType =='2' || form.returnType =='4') && form.installFlag ==1">
                                <el-form-item label="新安装方式：" prop="installation" ref="installDateForm">
                                    <el-select v-model="form.installation" placeholder="请选择" @change="installationmodechange">
                                        <el-option v-for="(item, index) in installMethods"
                                                :label="item.name"
                                                :value="item.code"
                                                :key="index">
                                            {{item.name}}
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="不安装原因：" v-if="form.installation == 2" prop="notinstallreason">
                                    <el-select v-model="form.notinstallreason" placeholder="请选择">
                                        <el-option v-for="(item, index) in notInstallMethods"
                                                :label="item.name"
                                                :value="item.name"
                                                :key="index">
                                            {{item.name}}
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="新安装时间：" prop="installDate" v-show="form.operFlag == 2 || form.deliveryToInstallFlag ==1 || form.operFlag == 1 || form.operFlag == 3">
                                    <div class="block">
                                        <el-date-picker
                                                v-model="form.installDate"
                                                type="date"
                                                placeholder="请选择安装时间"
                                                @change="changeInstallDate"
                                                :picker-options="installpickerOptions"
                                                :disabled="newinstallDate"
                                                >
                                        </el-date-picker>
                                        <div class="exchanger__timeslot" v-if="form.installStartDateTime">
                                            <span class="start">{{form.installStartDateTime}}</span>-<span class="end">{{form.installEndDateTime}}</span>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 厂家安装 -->
                                <!-- <el-form-item label="新安装时间：" v-if="form.installation == 3">
                                    <div class="block">
                                        <el-date-picker
                                                v-model="form.pickupDate"
                                                type="date"
                                                placeholder="请选择安装时间">
                                        </el-date-picker>
                                    </div>
                                </el-form-item> -->
                            </el-row>
                        </el-row>
                        <!-- 当前退货地址下支持安装 end-->
                    </el-row>
                    <!--退换货地址切换 end-->
                </el-row>
                <!--退换货信息 end-->
                <!--促销信息 只有退货有促销信息1是退，3是换转退 start-->
                <commonApplyServicePrice v-if="form.returnType ==1" :returnExchangeDetail="serviceData"></commonApplyServicePrice>
                <!--促销信息 只有退货有促销信息 end-->
                <!--问题描述 start-->
                <el-row class="as-discription as-processing__caption" data-before="问题描述">
                    <el-form-item label="问题描述：" prop="problemDesc">
                        <el-input type="textarea" placeholder="请输入问题描述" v-model="form.problemDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="上传图片：">
                        <el-row v-if="LOGINDATA.orderplatform_applyServiceList_upload">
                            <el-upload
                                    action=""
                                    :limit="5"
                                    :class="{disabled: uploadDisabled}"
                                    :on-exceed="handleExceed"
                                    :before-upload="beforeAvatarUpload"
                                    :on-remove="handleRemove"
                                    :http-request="uploadImage"
                                    :file-list="form.imageList"
                                    list-type="picture-card">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-row>
                    </el-form-item>
                </el-row>
                <!--问题描述 end-->
                <el-row class="btn-group" size="mini">
                    <el-button size="mini" type="primary" @click="handleShowDialog('ruleForm')" v-if="LOGINDATA.orderplatform_applyService_submit">提交处理</el-button>
                </el-row>
            </el-form>
            <!--温馨提示 start-->
            <el-row class="as-success-tip" v-show="showProcessTip">
                <p class="txt">温馨提示：退换货申请正在服务台处理中，请尽快处理，提交处理后，将进入店长审核环节，店长审核后，才可以进行商品退货/换货。</p>
            </el-row>
            <!--温馨提示 end-->
        </el-main>
        <!--左侧退换货处理 end-->
        <!--右侧商品信息 start-->
        <commonApplyServiceAside :asideData="asideData"></commonApplyServiceAside>
        <!--右侧商品信息 end-->
        <!--送货能 start-->
        <g-delivery v-model="form.installEnergy" @changed="changePickupDateSlot"></g-delivery>
        <!--送货能 end-->
        <!--安装能 start-->
        <g-delivery v-model="form.newinstallEnergy" @changed="changeInstallDateSlot"></g-delivery>
        <!--安装能 end-->
        <!--是否确认提交退换货申请/处理 start-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <span>{{confirmContent}}</span>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveReturnRequest('ruleForm')">确 定</el-button>
        </span>
        </el-dialog>
        <!--是否确认提交退换货申请/处理 end-->
        <!--需补购美豆 start-->
        <el-dialog
        title="美豆不足"
        width="30%"
        :visible.sync="dialogBeanNumberVisible"
        :before-close="handleBeanNumberClose">
          <el-row class="el-dialog__body_bean">
            <el-row><p class="dialog_p">目前账户美豆余额不足，需补够<b class="dialog_em">{{pendingBuyGomeBeanNumber}}</b>美豆后，才可申请退货。</p></el-row>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="handleBeanNumberClose">知道了</el-button>
          </span>
        </el-dialog>
        <!--需补购美豆 end-->
        <!--有赠品分摊时提交申请/处理确认退款明细 start-->
        <el-dialog
                title="退款明细"
                width="30%"
                :visible.sync="dialogHasFreeGiftVisible"
                :before-close="handleFreeGiftClose">
            <el-row class="el-dialog__body_module1" v-if="serviceData.returnRefundAgentDto">
                <span data-before="预计退款总额：" class="dialog_span dialog_em" v-if="serviceData.returnRefundAgentDto.suggestRefundAmount || serviceData.returnRefundAgentDto.suggestRefundAmount==0.00">
                  {{serviceData.returnRefundAgentDto.suggestRefundAmount | formatMoney}}
                </span>
                <span data-before="预计退款总额：" class="dialog_span dialog_em" v-else>暂无金额</span>
                <span data-before="退还订金" class="dialog_span dialog_em" v-if="serviceData.returnRefundAgentDto.returnDepositAmount && serviceData.returnRefundAgentDto.returnDepositAmount !='0.00'">
                  {{serviceData.returnRefundAgentDto.returnDepositAmount | formatMoney}}
                </span>
                <span data-before="退还美豆：" v-if="serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.sharePayGomeBeanNumber" class="dialog_span dialog_em">+{{serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.sharePayGomeBeanNumber}}美豆</span>
                <!--预计扣款总额显示条件：有美豆信息并且有赠品信息并且displayAllDeductAmount字段存在-->
                <!-- <span data-before="预计扣款总额：" class="dialog_span" v-if="
                          (serviceData.returnRefundAgentDto.returnGomeBeanAgentDto &&
                          JSON.stringify(serviceData.returnRefundAgentDto.returnGomeBeanAgentDto) != '{}') ||
                      (serviceData.returnRefundAgentDto.shareFreeGifts &&
                      serviceData.returnRefundAgentDto.shareFreeGifts.length > 0) &&
                      serviceData.returnRefundAgentDto.displayAllDeductAmount">-{{serviceData.returnRefundAgentDto.displayAllDeductAmount | formatMoney}}</span> -->
            </el-row>
            <el-row class="el-dialog__body_module2" v-if="serviceData.returnRefundAgentDto">
                <el-row v-if="serviceData.returnRefundAgentDto.returnGomeBeanAgentDto && addCount">
                    <span data-before="已扣美豆：" class="dialog_span">-{{addCount}}美豆</span>
                </el-row>
                <el-row>
                    <span data-before="美豆扣款：" class="dialog_span"
                      v-if="serviceData.returnRefundAgentDto &&
                      serviceData.returnRefundAgentDto.returnGomeBeanAgentDto && serviceData.returnRefundAgentDto.deductGomeBeanAmount !='0.00'">
                      -{{serviceData.returnRefundAgentDto.deductGomeBeanAmount | formatMoney}}
                    </span>
                    <!-- <span data-before="券扣减：" class="dialog_span"
                      v-if="serviceData.returnRefundAgentDto &&
                      serviceData.returnRefundAgentDto.finalDeductCouponAmount && serviceData.returnRefundAgentDto.finalDeductCouponAmount !='0.00'">
                      -{{serviceData.returnRefundAgentDto.finalDeductCouponAmount | formatMoney}}
                    </span> -->
                    <span data-before="赠品等分摊金额：" class="dialog_span"
		                v-if="(serviceData.productDto &&
                    serviceData.productDto.skuType &&
                    serviceData.productDto.skuType != 1) &&
                    (serviceData.returnRefundAgentDto.shareFreeGifts &&
                    serviceData.returnRefundAgentDto.shareFreeGifts.length > 0) && zengpinCount">-{{zengpinCount | formatMoney}}</span>
                </el-row>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogHasFreeGiftVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveReturnRequest('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--有赠品分摊时提交申请/处理确认退款明细 end-->
        <!--运营商卡被使用 start-->
        <el-dialog
        title="运营商商品退货提示"
        width="30%"
        :visible.sync="dialogCardrespMsgVisible"
        :before-close="handleBeanNumberClose">
          <el-row class="el-dialog__body_bean">
            <el-row>
                <p class="dialog_p">{{cardrespMsg}}</p>
            </el-row>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="handleBeanNumberClose">知道了</el-button>
          </span>
        </el-dialog>
        <!--运营商卡被使用 end-->
    </el-container>
</template>

<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/applyService.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import {mapState} from "vuex";
    import API from '@/api/order-service/applyService';
    import Utils from '@/api/order-service/utils';
    import Env from '@/api/env'
    import commonApplyServiceAside from '@/components/order-service/common/commonApplyServiceAside.vue';
    import commonApplyServicePrice from '@/components/order-service/common/commonApplyServicePrice.vue';
    export default {
        data () {
            var checkReturnProdConsignee = (rule, value, callback) => {
                let len = 0;
                if (!value || value.length <= 0) {
                    callback(new Error("顾客姓名不能为空"));
                    return;
                }
                for (var i = 0; i < value.length; i++) {
                    let a = value.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    } else {
                        len += 1;
                    }
                }
                if (len > 60) {
                    callback(new Error("顾客姓名最多60个字符(英文,数字各占一个字符,汉字占两个字符)"));
                    return;
                } else if (!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\.（）\·\_]+$/.test(value)) {
                    callback(new Error("不能输入特殊字符"));
                    return;
                } else {
                    callback();
                }
            };
            var checkReturnProdPhone = (rule, value, callback) => { //手机验证
                if (!value || value.length <= 0) {
                    callback(new Error('顾客电话不能为空！'));
                    return;
                } else if (!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value)) {
                    callback(new Error('请输入正确的电话号码！'));
                    return;
                } else {
                    callback();
                }
            };
            var checkWaitModifyContactDetailAddress = (rule, value, callback) => {
                let returnMethod = this.form.returnMethod ? this.form.returnMethod : this.serviceData.returnMethodDtoList[0].returnMethod;
                if (returnMethod && returnMethod == 1) {
                    if (!value || value.length <= 0) {
                        callback(new Error("取件地址不能为空"));
                        return;
                    }
                    let len = 0;
                    for (var i = 0; i < value.length; i++) {
                        let a = value.charAt(i);
                        if (a.match(/[^\x00-\xff]/ig) != null) {
                            len += 2;
                        } else {
                            len += 1;
                        }
                    }
                    if (len > 80) {
                        callback(new Error("取件地址最多80个字符(英文,数字各占一个字符,汉字占两个字符)"));
                        return;
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkWaitModifyReplShipDetailAddress = (rule, value, callback) => {
                let returnMethod = this.form.returnMethod ? this.form.returnMethod : this.serviceData.returnMethodDtoList[0].returnMethod;
                if (returnMethod && returnMethod == 1) {
                    if (!value || value.length <= 0) {
                        callback(new Error("新配送地址不能为空"));
                        return;
                    }
                    let len = 0;
                    for (var i = 0; i < value.length; i++) {
                        let a = value.charAt(i);
                        if (a.match(/[^\x00-\xff]/ig) != null) {
                            len += 2;
                        } else {
                            len += 1;
                        }
                    }
                    if (len > 80) {
                        callback(new Error("新配送地址最多80个字符(英文,数字各占一个字符,汉字占两个字符)"));
                        return;
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkPickupDate = (rule, value, callback) => {
                let returnMethod = this.form.returnMethod ? this.form.returnMethod : this.serviceData.returnMethodDtoList[0].returnMethod;
                if (returnMethod && returnMethod == 1) {
                    if (!value || value.length <= 0) {
                        callback(new Error("取件时间不能为空"));
                        return;
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkInstallDate = (rule, value, callback) => {
                //换货且支持安装，并且可以是售后安装和厂家安装的时候校验，否则不校验
                if((this.serviceData.returnType == '2' || this.form.returnType =='2' || this.form.returnType =='4') && this.form.installFlag ==1){//换货且支持安装的时候
                    if(this.form.operFlag == 0 || this.form.operFlag == 1){//日期时间不可选和日期可为空的时候不验证
                        callback();
                    }else{
                        if (value =='') {
                            callback(new Error("安装时间不能为空"));
                            return;
                        } else {
                            if(this.form.operFlag == 2){//选日期调安能
                                if(new Date(this.form.installDate).getTime() == new Date(this.form.pickupDate).getTime()){
                                    if(this.form.installEndDateTime !='' && (this.form.installEndDateTime < this.form.pickupEndDateTime)){
                                        callback(new Error("安装时间必须晚于取货时间，请重新选择"));
                                    }else{
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }else{
                                callback();
                            }   
                        } 
                    }
                }else {
                    callback();
                };    
            };
            var checkProblemDesc = (rule, value, callback) => {
                let len = 0;
                if (!value || value.length <= 0) {
                    callback(new Error("问题描述不能为空"));
                    return;
                }
                for (var i = 0; i < value.length; i++) {
                    let a = value.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    } else {
                        len += 1;
                    }
                }
                if (len > 300) {
                    callback(new Error("问题描述最多300个字符(英文,数字各占一个字符,汉字占两个字符)"));
                    return;
                } else {
                    callback();
                }
            };
            var checknotinstallreason =(rule, value, callback) => {
                if (!value) {
                    callback(new Error("不安装原因不能为空"));
                    return;
                }else {
                    callback();
                }

            };
            return {
                header: {
                    "content": ""
                },
                rightheader: {
                    "content": "商品信息"
                },
                cookieDomain: '',
                showProcessTip: true,
                loading: false,
                dialogVisible: false,                                                               //默认确认弹窗
                dialogHasFreeGiftVisible: false,                                                    //有赠品分摊时的退款明细确认弹窗
                dialogBeanNumberVisible: false,                                             //有需补购美豆确认弹窗
                asideData: {},
                confirmContent: '',
                serviceData: {
                    productDto: {},
                    userInfoDto: {},
                    addressInfoDto: {},
                    returnMethodDtoList: [{
                        returnMethodName: '',
                        returnMethod: ''
                    }],
                    returnRefundAgentDto: {//returnRefundAgentDto
                        shareFreeGifts:[],
                        returnGomeBeanAgentDto: {},
                        shareFreeGifts:[],
                        shareJjhgItemList:[],
                        displayAllDeductAmount:'',
                    },
                    returnReasonList: [],
                    returnRequestImageList: [],
                    installMethods:[]
                },
                installMethods:[
                    
                ],
                notInstallMethods:[
                   
                ],
                returnInstallInfo:{
                    installMethod:2,
                },
                agreeDeductFlag: true,
                returnReason: '',
                deductGomeBeanAmount: 0,                                                                  //美豆还需要扣的金额
                deductCouponisuse: 0,                                                                     //美券还需要扣的金额
                allDeductAmount: 0,                                                                       //实扣总金额
                suggestRefundAmount: 0,                                                                   //实退款总金额
                pendingBuyGomeBeanNumber: 0,
                form: {
                    accountAvailableGomeBeanNumber:'',
                    tabShow: 0,                                                                           //默认显示自提
                    returnType: 1,                                                                        //退换货申请类型（默认值为3） 1：只显示退货并选中 2：只显示换货并选中 3：退货换货都显示（退货选中，换货不选中） 4：退货换货都显示（换货选中，退货不选中）
                    returnReason: '',                                                                     //退换货原因
                    voucherType: [],                                                                      //已开凭证
                    returnMethod: '',                                                                     //退货方式
                    hasInvoice: false,                                                                   //是否带发票
                    hasInspectionReport: false,                                                          //是否带出检报告
                    hasAuditOA: false,                                                                   //是否有审批OA
                    hasUninstallProof: false,                                                            //是否有未安装证明
                    returnProdConsignee: '',                                                              //左边可修改的顾客信息
                    returnProdPhone: '',                                                                  //左边可修改的顾客电话
                    townCode: '',                                                                        //四级区域地址代码
                    storeCode: '',                                                                       //门店代码
                    masloc: '',                                                                          //仓库代码
                    quantity: '',                                                                        //商品数量
                    inputPickupAddress: '',                                                              //退货物流上门取件的地址
                    waitModifyContactDetailAddress: '',                                                  //取件地址
                    waitModifyReplShipDetailAddress: '',                                                 //新配送地址
                    showSelectPickupDateTimeFlag: '',                                                    //是否展示预约取货时间
                    pickupDate: '',                                                                      //预约取货时间
                    pickupStartDateTime: '',                                                             //预约取货时间开始时间段
                    pickupEndDateTime: '',                                                               //预约取货时间结束时间段
                    replShipConsignee: '',                                                               //左边隐藏的换货取货联系人(提交的时候需要传给后端)
                    replShipPhone: '',                                                                   //左边隐藏的换货取货联系人电话(提交的时候需要传给后端)
                    pickupSlot: '',                                                                      //运能波次
                    installEnergy: {},                                                                   //安装运能
                    isDeductGomeBeanPrice: false,                                                       //是否同意美豆扣款
                    isDeductCouponPrice: [],                                                            //是否同意美券扣款
                    problemDesc: '',                                                                    //问题描述
                    imageUrl: '',                                                                       //图片url
                    returnRequestImageList: [],                                                         //初始化获得的图片列表
                    imageList: [],                                                                      //图片列表
                    roUploadImageUrls: '',                                                              //上传图片
                    originalStoreCode:'',                                                               //闭店门店
                    installation:1,                                                                    //安装方式code
                    notinstallreason:'',                                                                 //不安装原因
                    installDate:'',                                                                     //安装日期
                    installStartDateTime:'',                                                             //预约安装时间开始时间段   
                    installEndDateTime:'',                                                               //预约安装时间结束时间段   
                    installSlot:'',                                                                      //运能波次
                    newinstallEnergy: {},                                                                //安装能
                    installSegmentCode:'',                                                                //售后公司代码
                    installSite:'',                                                                      //安装网点
                    installArea:'',                                                                      //安装区域
                    installationName:'',                                                                   //安装方式中文
                    operFlag:'',                                                                          //是否可以调安装能0:日期时间不可选 1:日期可选可空 2:选日期调接口 3:必选安装时间，但是不掉安装能
                    installFlag:'',                                                                       //是否支持安装
                    installFlag:'',                                                                       //是否支持安装
                    salesOrganization:'',                                                                 //销售组织
                },
                rules: {
                    returnProdConsignee: [
                        {required: true, validator: checkReturnProdConsignee, trigger: 'blur'}
                    ],
                    returnProdPhone: [
                        {required: true, validator: checkReturnProdPhone, trigger: 'blur'}
                    ],
                    waitModifyContactDetailAddress: [
                        {required: true, validator: checkWaitModifyContactDetailAddress, trigger: 'blur'}
                    ],
                    waitModifyReplShipDetailAddress: [
                        {required: true, validator: checkWaitModifyReplShipDetailAddress, trigger: 'blur'}
                    ],
                    pickupDate: [
                        {required: true, validator: checkPickupDate, trigger: 'blur'}
                    ],
                    problemDesc: [
                        {required: true, validator: checkProblemDesc, trigger: 'blur'}
                    ],
                    installDate:[
                        {required: true, validator: checkInstallDate, trigger: 'blur'},
                    ],
                    installation:[
                        {required: true}
                    ],
                    notinstallreason:[
                        {required: true,validator: checknotinstallreason, trigger: 'blur'}
                    ]
                },
                //时间限制30天之内
                pickerOptions: {
                    disabledDate(time) {
                        let currentTime = new Date();
                        let startTime = new Date(currentTime.getTime() - 24*60*60*1000);
                        let endTime = new Date(startTime);
                        endTime.setDate(startTime.getDate() + 30);
                        return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                    }
                },
                //时间从预约送货日期算起53天
                installpickerOptions: {},
                imageName: '',
                imageData: '',
                returnCoupons:[],
                cardrespMsg:"",//运营商商品退货提示
                dialogCardrespMsgVisible:false,//运营商商品退货提示弹层
            }
        },
        //局部过滤器，格式化金额
        filters: {
            formatMoney (value) {
                "use strict";
                return '￥' + Number(value).toFixed(2);
            }
        },
        //vuex取值
        computed: {
            ...mapState(['LOGINDATA']),
            //计算图片大小
            uploadDisabled () {
                return this.form.imageList.length > 5;
            },
            addCount(){ //计算金额已扣美豆
                return this.serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.needReturnGomeBeanNumber+this.serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.deductCouponGomeBeanNumber
            },
            zengpinCount(){ //计算赠品等分摊金额=赠品促销分摊总额+换购促销分摊总额
                return this.serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.jjhgShareTotalAmountSum+this.serviceData.returnRefundAgentDto.returnGomeBeanAgentDto.freeGiftShareAmountSum
            },
            newinstallDate(){
                if(this.form.showSelectPickupDateTimeFlag == 'Y'){
                    if(this.form.pickupDate =='' || this.form.operFlag == 0){
                        return true;
                    }else{
                        return false
                    }
                }else{
                    if(this.form.operFlag == 0){
                        return true;
                    }else{
                        return false
                    }
                }
                
            }
        },
        components: {
            commonApplyServiceAside,
            commonApplyServicePrice
        },
        created () {
            this.cookieDomain = Env.cookieDomain;
            this.initReturnRequest();
            //退换货处理和申请的入口不同，提示文案不同
            if (this.$route.query.returnRequestId && this.$route.query.returnRequestId != '') {
                this.confirmContent = '您确定要提交退换货处理？';
                this.header.content = '退换货处理';
            } else {
                this.confirmContent = '您确定要提交退换货申请？';
                this.header.content = '申请退换货';
            };
        },
        methods: {
            installationmodechange(val){//安装方式更改回调
                var that =  this;
                this.form.installDate = "";
                this.form.installStartDateTime = "";
                this.form.installEndDateTime = "";
                this.form.installSlot = '';
                this.form.installSegmentCode = '';//售后公司代码
                this.form.installSite = '';//安装网点
                this.form.installArea = '';//安装区域
                that.initInstall('code',val);
                this.$refs.ruleForm.validateField('installDate');
            },
            initInstall(name,val){
                var that =  this;
                for(let i=0; i<that.installMethods.length;i++){
                    if(that.installMethods[i][name]==val){//选取当前选中值对应的数据

                        that.form.installationName = that.installMethods[i]['name'];//安装方式名称
                        that.form.operFlag = that.installMethods[i]['operFlag'];//操作类型
                        that.form.installation = that.installMethods[i]['code'];//安装方式编码
                        that.form.deliveryToInstallFlag = that.installMethods[i]['deliveryToInstallFlag'];//是否运能赋值安装能
                    }
                };
               // if(that.form.deliveryToInstallFlag =='1' || that.form.installationName =='座装' || that.form.installationName =='挂装'){//运能赋值安装能
                if(that.form.deliveryToInstallFlag == 1){//运能赋值安装能
                    if(that.form.showSelectPickupDateTimeFlag == 'Y'){//可以选取货时间
                        that.form.installDate = that.form.pickupDate;
                    };  
                };
                if(that.form.showSelectPickupDateTimeFlag == 'Y'){//有预约取货时间
                    if(that.form.pickupDate){//有预约时间
                        if(that.form.operFlag == 1 || that.form.operFlag == 3){//厂家安装
                            that.installpickerOptions = {
                                disabledDate(time) {
                                    let startTime = new Date(that.form.pickupDate);
                                    let endTime = new Date(startTime);
                                    endTime.setDate(startTime.getDate() + 365);
                                    startTime.setDate(startTime.getDate() - 1);
                                    return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                                }
                            }
                        }else{
                            that.installpickerOptions = {
                                disabledDate(time) {
                                    let startTime = new Date(that.form.pickupDate);
                                    let endTime = new Date(startTime);
                                    endTime.setDate(startTime.getDate() + 52);
                                    startTime.setDate(startTime.getDate() - 1);
                                    return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                                }
                            }
                        }
                    };   
                }else{//没有预约取货时间
                    if(that.form.operFlag == 1 || that.form.operFlag == 3){//厂家安装并且是有预约时间
                        that.installpickerOptions = {
                            disabledDate(time) {
                                let startTime = new Date();
                                let endTime = new Date(startTime);
                                endTime.setDate(startTime.getDate() + 365);
                                //startTime.setDate(startTime.getDate() - 1);
                                return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                            }
                        }
                    }else{
                        that.installpickerOptions = {
                            disabledDate(time) {
                                let startTime = new Date();
                                let endTime = new Date(startTime);
                                endTime.setDate(startTime.getDate() + 52);
                               // startTime.setDate(startTime.getDate() - 1);
                                return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                            }
                        }
                    }
                }   
            },
            blurinstallDaterules(){
                if(this.form.pickupDate =='' || this.form.operFlag == 0){
                    callback();
                }else{
                    if (value =='') {
                        callback(new Error("安装时间不能为空"));
                        return;
                    } else {
                        callback();
                    } 
                }
                    
                //form.installDate
            },
            //退换货申请/处理公共初始化
            commonInit (response,type) {
                if (response.success) {
                    if (response.response) {
                        this.serviceData = response.response;
                        this.loading = false;
                        let _addressInfo = this.serviceData.addressInfoDto;
                        let _promotionInfo = this.serviceData.returnRefundAgentDto;
                        let _reasonList = this.serviceData.returnReasonList;
                        let _imageList = this.serviceData.returnRequestImageList;
                        //退换货方式
                        if (this.serviceData.returnType == 1 || this.serviceData.returnType == 2) {
                            this.form.returnType = this.serviceData.returnType;
                        };
                        
                        //原因列表
                        if (_reasonList && _reasonList.length > 0) {
                            _reasonList.forEach((item, index) => {
                              if (item.isSelected && item.isSelected == 'Y') {
                                this.form.returnReason = item.code;
                              }
                            });
                        } else {
                            this.serviceData.returnReasonList = [];
                        }
                        //退换货方式列表
                        if (this.serviceData.returnMethodDtoList && this.serviceData.returnMethodDtoList.length > 0) {
                            this.serviceData.returnMethodDtoList.forEach((item, index) => {
                              if (item.isSelected === 'Y') {
                                this.form.returnMethod = item.returnMethod;
                                //退回门店默认展示退货地址
                                if (this.form.returnMethod == 6) {
                                  this.form.tabShow = 0;
                                } else {
                                  this.form.tabShow = 1;
                                }
                              }
                            });
                        }
                        //促销信息：美豆/美券
                        if (_promotionInfo) {
                            if (_promotionInfo.returnGomeBeanAgentDto) {
                                this.agreeDeductFlag = _promotionInfo.returnGomeBeanAgentDto.agreeDeductFlag;
                                this.accountAvailableGomeBeanNumber = _promotionInfo.returnGomeBeanAgentDto.accountAvailableGomeBeanNumber;                                 //实退款总金额 = 商品支付实付款总金额 - 实扣款总金额；(来源PRD)
                                this.pendingBuyGomeBeanNumber = _promotionInfo.returnGomeBeanAgentDto.pendingBuyGomeBeanNumber;//11月订单需求：美易分需补购美豆
                            }
                            this.deductGomeBeanAmount = _promotionInfo.deductGomeBeanAmount;                                                                             //美豆还需要扣的金额
                            this.deductCouponisuse = _promotionInfo.deductCouponisuse;
                            // this.allDeductAmount = parseFloat(this.deductGomeBeanAmount) + parseFloat(this.deductCouponisuse);
                            // this.suggestRefundAmount = parseFloat(_promotionInfo.maxRefundAmount) - parseFloat(this.allDeductAmount);                                  //实退款总金额 = 商品支付实付款总金额 - 实扣款总金额；(来源PRD)
                            //一期没有促销券信息，计算时去掉券的金额值
                            this.allDeductAmount = parseFloat(this.deductGomeBeanAmount);                                                                               //实扣总金额 = 美豆扣款（未勾选不同意扣款）+美券扣款（未勾选不同意扣款）；(来源PRD)
                            this.suggestRefundAmount = parseFloat(_promotionInfo.maxRefundAmount) - parseFloat(this.allDeductAmount);
                        }
                        //地址信息
                        if (_addressInfo) {
                            this.form.returnProdConsignee = _addressInfo.returnProdConsignee || '';                                                                     //上门取货联系人
                            this.form.returnProdPhone = _addressInfo.returnProdPhone || '';                                                                             //上门取货联系电话
                            this.form.waitModifyContactDetailAddress = _addressInfo.waitModifyContactDetailAddress || '';                                               //上门取货待修改的详细地址
                            this.form.replShipConsignee = _addressInfo.replShipConsignee || '';                                                                         //换货取货联系人
                            this.form.replShipPhone = _addressInfo.replShipPhone || '';                                                                                 //换货取货联系人电话
                            this.form.waitModifyReplShipDetailAddress = _addressInfo.waitModifyReplShipDetailAddress || '';                                             //换货取货待修改的新配送单详细地址
                            if (_addressInfo.showSelectPickupDateTimeFlag && _addressInfo.showSelectPickupDateTimeFlag == 'Y') {
                                this.form.showSelectPickupDateTimeFlag = _addressInfo.showSelectPickupDateTimeFlag;                                                     //是否需要选择预约取货时间
                            }
                            //申请退换货的门店编码需要更换
                            this.form.originalStoreCode = _addressInfo.originalStoreCode || '';    
                            this.form.storeCode = _addressInfo.storeCode || '';                                                                                       //门店代码
                            this.form.masloc = _addressInfo.masloc || '';                                                                                               //商品的逻辑仓库代码
                            this.form.townCode = _addressInfo.town || '';                                                                                               //原单配送的四级区域代码
                        }
                        this.form.problemDesc = this.serviceData.attachment || '';                                                                                      //问题描述
                        //图片列表
                        if (_imageList && _imageList.length > 0) {
                            this.form.returnRequestImageList = _imageList.map((item, index) => {
                                return Object.assign({}, item, {
                                    url: item.imageUrl,
                                });
                            });
                            this.form.imageList = this.form.returnRequestImageList.concat(this.form.imageList);
                        } else {
                            this.form.returnRequestImageList = [];
                            this.form.imageList = [];
                        }
                        this.form.quantity = this.serviceData.productDto.quantity || 0;                                                                                  //商品数量
                        this.form.brandCode = this.serviceData.productDto.brandCode; //品牌代码
                        this.form.categoryCode = this.serviceData.productDto.categoryCode; //线下四级品类代码
                        this.form.commerceItemId = this.serviceData.commerceItemId; //商品唯一号
                        this.form.skuNo = this.serviceData.productDto.skuNo; //商品编码
                        this.form.installFlag = this.serviceData.productDto.installFlag; //是否支持安装标记
                        this.form.salesOrganization = this.serviceData.productDto.salesOrganization; //是否支持安装标记
                        //美券
                        if(this.serviceData.returnRefundAgentDto.returnCoupons){
                            this.serviceData.returnRefundAgentDto.returnCoupons.forEach((item, index) => {
                                let newitem = {couponId:item.couponId,ticketNo:item.ticketNo,state:item.state,processType:item.processType,expirationDate:item.expirationDate,couponShareAmount:item.couponShareAmount,couponGomebeanDeductAmount:item.couponGomebeanDeductAmount};
                                this.returnCoupons.push(newitem);
                            });    
                        };  
                        //右侧订单信息
                        this.asideData = Object.assign({},
                                {commerceItemId: this.serviceData.commerceItemId},                                                                                       //商品项Id
                                {shippingGroupId: this.serviceData.shippingGroupId},                                                                                     //配送单号
                                {productDto: this.serviceData.productDto},                                                                                               //商品信息
                                {userInfoDto: this.serviceData.userInfoDto});   
                        this.installMethods = this.serviceData.installMethods;
                        this.notInstallMethods = this.serviceData.notInstallMethods;
                        //安装方式列表
                        this.initInstall('isSelected',1);   
                        //不安装原因列表 
                        this.notInstallMethods.forEach((item, index) => {
                            if (item.isSelected && item.isSelected == '1') {
                            this.form.notinstallreason = item.name;
                            }
                        });                                                                                 //顾客信息
                    } else {
                        this.loading = false;
                    }
                } else {
                    if (response.respMsg) {
                        this.loading = false;
                        this.$message.error(response.respMsg);
                    }
                }
            },
            //退换货申请/处理公共提交处理
            commonSave(response, url) {
                let timer = null, _this = this;
                if (response.success) {
                    this.$router.push(url);
                } else {
                    this.loading = false;
                    this.dialogVisible = false;
                    this.dialogHasFreeGiftVisible = false;
                    if (response.respCode) {
                        //如果美豆数发生变化，toast提示文案写在前端
                        if (response.respCode == '510') {
                            this.$message.error("由于顾客账户内余额发生变化，页面将进行刷新操作！");
                            clearTimeout(timer);
                            timer = setTimeout(function () {
                            _this.$router.go(0);
                            }, 2000)
                        }
                        //其他异常，toast根据后端返回文案展示
                        else if (response.respCode == '500') {
                            if (response.respMsg) {
                            this.$message.error(response.respMsg);
                            this.$router.go(0);
                            }
                        }else if (response.respCode == '502') {
                            if (response.respMsg) {
                                this.cardrespMsg = response.respMsg;
                                this.dialogCardrespMsgVisible = true;
                            }
                        }else{
                            if (response.respMsg) {
                                _this.$message({
                                    message: response.respMsg,
                                    type: 'error',
                                    onClose:function(){
                                        _this.$router.go(0);
                                    }
                                });
                            }
                        }
                    }
                }
            },
            /**
             * index:0显示自提，1显示上门取件
             * */
            tabSwitch(index) {
                this.form.tabShow = index;
            },
            //退换货处理页面初始化
            initReturnRequest () {
                let _this = this;
                let url = window.location.href.split('?')[1];
                let params = {};
                this.loading = true;
                //退换货处理
                if (url && url.indexOf('returnRequestId') != -1) {
                    params = {
                        returnRequestId: Utils.getQueryString('returnRequestId'),                                       //退换货单号
                    };
                    API.showNewReturnRequest(params).then(response => {
                        _this.commonInit(response)
                    })
                }
                // 退换货申请
                else {
                    params = {                                                                                    //订单号
                        orderId: this.$route.query.orderId,                                                       //订单号
                        shipId: this.$route.query.shipId,                                                         //配送单号
                        commerceItemId: this.$route.query.commerceItemId,                                         //商品项id
                        detailId: this.$route.query.detailId                                                      //商品明细id
                    };
                    this.showProcessTip = false;
                    API.getStoreReturnInit(params).then(response => {
                        _this.commonInit(response);
                    })
                }
            },
            //退换货申请页动态查询退换货方式列表
            dynamicQueryReturnMethod (type){
                let _this = this;
                const params = {
                    orderId: this.serviceData.orderId,
                    commerceItemId: this.serviceData.commerceItemId,
                    shipId: this.serviceData.shippingGroupId,
                    detailId: this.serviceData.itemDetailId,
                    returnType: type
                };
                this.loading = true;
                API.dynamicQueryReturnMethod(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.loading = false;
                            const _response = response.response;
                            if (this.serviceData.returnMethodDtoList && this.serviceData.returnMethodDtoList.length > 0) {
                                this.serviceData.returnMethodDtoList.forEach((item, index) => {
                                  if (item.isSelected === 'Y') {
                                    this.form.returnMethod = item.returnMethod;
                                    //上门取件默认展示取件地址
                                    if (this.form.returnMethod == 1) {
                                      this.form.tabShow = 1;
                                    } else {
                                      this.form.tabShow = 0;
                                    }
                                  }
                                });
                            }
                            _this.serviceData.addressInfoDto = _response.addressInfoDto;
                            _this.form.waitModifyContactDetailAddress = _response.addressInfoDto.waitModifyContactDetailAddress;   //上门取货待修改的详细地址
                            _this.form.waitModifyReplShipDetailAddress = _response.addressInfoDto.waitModifyReplShipDetailAddress; //换货取货待修改的新配送单详细地址
                        } else {
                            _this.loading = false;
                        }
                    } else {
                        if (response.respMsg) {
                            _this.loading = false;
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            },
            //选择取货时间
            changePickupDate () {
                var _this =this;
                let installEnergy = {
                    "val": {
                        "storeCode": this.form.storeCode,                                                       //门店代码
                        "storageCode": this.form.masloc,                                                         //仓库代码
                        "townCode": this.form.townCode,                                                         //乡镇/街道代码
                        "deliveryCount": this.form.quantity,                                                    //送货数量
                        "deliveryDate": this.form.pickupDate * 1,                                             //预约取货时间
                        "commerceItemId": this.serviceData.commerceItemId                                     //商品唯一号
                    },
                    "type": "delivery"                                                                          // 必填 送货能（运能）delivery
                };
                this.form.installEnergy = installEnergy;
            },
            //选择送货能时间段
            changePickupDateSlot(obj){
                if (obj.type == "delivery") {//送货能返回
                    if (obj.st == "close") {
                        this.form.pickupDate = "";
                        this.form.pickupStartDateTime = "";
                        this.form.pickupEndDateTime = "";
                        this.form.pickupSlot = '';
                        return false;
                    }

                    this.form.pickupDate = Utils.formatDate(obj.time);
                    this.form.pickupStartDateTime = obj.st;
                    this.form.pickupEndDateTime = obj.et;
                    this.form.pickupSlot = obj.code;
                    //安装时间计算
                    if((this.form.operFlag == 1 && this.form.pickupDate) || (this.form.operFlag == 3 && this.form.pickupDate)){//厂家安装并且是有预约时间
                        var _this =this;
                        this.installpickerOptions = {
                            disabledDate(time) {
                                let startTime = new Date(_this.form.pickupDate);
                                let endTime = new Date(startTime);
                                endTime.setDate(startTime.getDate() + 365);
                                startTime.setDate(startTime.getDate() - 1);
                                return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                            }
                        }
                    }else{//售后安装
                        this.installpickerOptions = {
                            disabledDate(time) {
                                let startTime = new Date(obj.time);
                                let endTime = new Date(startTime);
                                endTime.setDate(startTime.getDate() + 52);
                                return time.getTime() < startTime.getTime() || time.getTime() > endTime.getTime();
                            }
                        }
                    };
                    //重新选择了预约取货时间，安装时间要变
                    this.form.installDate = "";
                    this.form.installStartDateTime = "";
                    this.form.installEndDateTime = "";
                    
                };
                //if(this.form.deliveryToInstallFlag =='1'  || this.form.installationName =='座装' || this.form.installationName =='挂装'){//运能赋值安装能
                if(this.form.deliveryToInstallFlag =='1'){//运能赋值安装能
                    if(this.form.showSelectPickupDateTimeFlag == 'Y'){//可以选取货时间
                         this.form.installDate = this.form.pickupDate;
                    };   
                }
            },
            //选择安装时间
            changeInstallDate () {
                var _this =this;
                // let newinstallEnergy = {
                //     "val": {
                //         "brandCode":this.form.brandCode,  //brandCode
                //         "categoryCode":this.form.categoryCode, // 线下四级品类代码
                //         "commerceItemId":this.serviceData.commerceItemId,//商品唯一号
                //         "installCount": this.form.quantity,//安装数量
                //         "installDate":this.form.pickupDate * 1,//安装日期
                //         "saleOrgCode":this.form.salesOrganization,//销售组织代码
                //         "skuNo":this.form.skuNo,//商品编码
                //         "townCode":this.form.townCode,//四级区域
                //         "queryType":0 //0：首次查询  1：修改查询    当修改建档查询返回的安装方式为安装时，传1，其余时候传0
                        
                //     },
                //     "type": "installAbility"                                                                          // 必填 送货能（运能）delivery
                // };
                _this.initInstall('code',_this.form.installation);
                // console.log(this.form.installationName);
                // console.log(this.form.operFlag);
                

                if(this.form.operFlag == 2){//只有售后安装才只能选安装能
                    let newinstallEnergy = {
                        "val": {
                            // "brandCode":"00004",  //brandCode
                            // "categoryCode":"R0501002", // 线下四级品类代码
                            // "commerceItemId":"46857812",//商品唯一号
                            // "installCount": "1",//安装数量
                            // "installDate":this.form.installDate * 1,//安装日期
                            // "saleOrgCode":"1001",//销售组织代码
                            // "skuNo":"100253545",//商品编码
                            // "townCode":"110102002",//四级区域
                            "brandCode":this.form.brandCode,  //brandCode
                            "categoryCode":this.form.categoryCode, // 线下四级品类代码
                            "commerceItemId":this.serviceData.commerceItemId,//商品唯一号
                            "installCount": this.form.quantity,//安装数量
                            "installDate":this.form.installDate * 1,//安装日期
                            "saleOrgCode":this.form.salesOrganization,//销售组织代码
                            "skuNo":this.form.skuNo,//商品编码
                            "townCode":this.form.townCode,//四级区域
                        },
                        "type": "installAbility"                                                                          // 必填 送货能（运能）delivery
                    };
                    this.form.newinstallEnergy = newinstallEnergy;                                                        //重新赋值 触发组件的watch
                }
            },
            //选择安装时间段
            changeInstallDateSlot(obj){
                if (obj.type == "installAbility") {//送货能返回
                    if (obj.st == "close") {
                        this.form.installDate = "";
                        this.form.installStartDateTime = "";
                        this.form.installEndDateTime = "";
                        this.form.installSlot = '';
                        this.form.installSegmentCode = '';//售后公司代码
                        this.form.installSite = '';//安装网点
                        this.form.installArea = '';//安装区域
                        return false;
                    };
                    this.form.installDate = Utils.formatDate(obj.time);//日期
                    this.form.installStartDateTime = obj.st;//安装时段描述开始
                    this.form.installEndDateTime = obj.et;//安装时段描述结束
                    this.form.installSlot = obj.code;//安装时段代码
                    this.form.installSegmentCode = obj.installCompanyCode;//售后公司代码
                    this.form.installSite = obj.installSite;//安装网点
                    this.form.installArea = obj.installArea;//安装区域
                    this.$refs.ruleForm.validateField('installDate');
                }
            },
            //保存
            saveReturnRequest (ruleForm) {
                //将图片地址返回给后端
                this.form.roUploadImageUrls = this.form.imageList.reduce(function (accumulator, currentValue) {
                    return accumulator + "," + currentValue.url;
                }, '');
                let _this = this;
                let params = {
                    returnRequestAgentDto: {
                        returnType: this.form.returnType,                                                                                                                                               //申请类型
                        orderId: this.serviceData.orderId,                                                                                                                                              //订单号
                        shippingGroupId: this.serviceData.shippingGroupId,                                                                                                                              //配送号
                        commerceItemId: this.serviceData.commerceItemId,                                                                                                                                //商品条目ID
                        itemDetailId: this.serviceData.itemDetailId,                                                                                                                                    //商品明细ID
                        returnReason: this.form.returnReason,                                                                                                                                           //退换货原因
                        hasInvoice: this.form.hasInvoice,                                                                                                                                               //是否带发票
                        hasInspectionReport: this.form.hasInspectionReport,                                                                                                                             //是否带出检报告
                        hasAuditOA: this.form.hasAuditOA,                                                                                                                                               //是否有审批OA
                        hasUninstallProof: this.form.hasUninstallProof,                                                                                                                                 //是否有未安装证明
                        returnMethod: this.form.returnMethod ? this.form.returnMethod : this.serviceData.returnMethodDtoList[0].returnMethod,                                                           //退货方式
                        returnProdDetailAddress: this.form.waitModifyContactDetailAddress,                                                                                                              //上门取货取货详细地址
                        townCode: this.form.townCode,                                                                                                                                                   //四级区域地址code
                        returnProdPostCode: '',                                                                                                                                                         //上门取货邮编
                        returnProdConsignee: this.form.returnProdConsignee,                                                                                                                             //上门取货联系人
                        returnProdPhone: this.form.returnProdPhone,                                                                                                                                     //上门取货联系电话
                       // mailToMasLocCode: this.serviceData.addressInfoDto.mailToMasLocCode,                                                                                                              //客户邮寄code
                        roUploadImageUrls: this.form.roUploadImageUrls.substring(this.form.roUploadImageUrls.indexOf(",") + 1),                                                                          //上传图片Url
                        replShipDetailAddress: this.form.waitModifyReplShipDetailAddress,                                                                                                                //换货收货详细地址
                        replShipPostCode: '',                                                                                                                                                            //换货收货邮编
                        replShipConsignee: this.form.replShipConsignee,                                                                                                                               //换货收货联系人(因为在详情页/审核页不管退货还是换货取货联系人展示的都是同一个，所以这里设置成一样的值)
                        replShipPhone: this.form.replShipPhone,                                                                                                                                       //换货收货电话(因为在详情页/审核页不管退货还是换货取货联系人展示的都是同一个，所以这里设置成一样的值)
                        problemDesc: this.form.problemDesc,                                                                                                                     //促销信息
                        returnRefundAgentDto: {
                            maxRefundAmount : this.serviceData.returnRefundAgentDto.maxRefundAmount,
                            suggestRefundAmount : this.suggestRefundAmount,
                            deductCouponisuse : this.serviceData.returnRefundAgentDto.deductCouponisuse,
                            deductGomeBeanAmount : this.serviceData.returnRefundAgentDto.deductGomeBeanAmount,
                            allDeductAmount : this.allDeductAmount,
                            returnGomeBeanAgentDto: {
                                accountAvailableGomeBeanNumber:this.accountAvailableGomeBeanNumber || 0,
                                agreeDeductFlag: this.form.agreeDeductFlag || this.agreeDeductFlag,
                            },
                            returnCoupons:this.returnCoupons,//美券信息
                        },
                        returnRequestId: this.$route.query.returnRequestId || '',                                                                                 //退换货id
                        repeatCommitStr: this.serviceData.md5str,
                        pickupDate: this.form.pickupDate,                                                                                                                             //预约取货时间
                        pickupStartDateTime: this.form.pickupStartDateTime,                                                                                                                             //预约取货时间开始时间段
                        pickupEndDateTime: this.form.pickupEndDateTime,                                                                                                                                 //预约取货时间结束时间段
                        pickupSlot: this.form.pickupSlot,                                                                                                                                                //运能波次
                        memberCardNo: this.serviceData.userInfoDto.memberCardNo,                                                                                                                                       //会员卡号
                    }
                };
                let url = window.location.href.split('?')[1];
                if(this.serviceData.addressInfoDto && this.serviceData.addressInfoDto.mailToMasLocCode){
                    params.returnRequestAgentDto.mailToMasLocCode = this.serviceData.addressInfoDto.mailToMasLocCode;
                }else{
                    params.returnRequestAgentDto.mailToMasLocCode = null;
                };
                //换货增加参数
                // if(_this.form.operFlag == 1){//厂家安装
                //     alert(this.form.installDate)
                //     this.form.installDate = Utils.formatDate(this.form.installDate.getTime());//转换时间格式
                // };
                if((_this.serviceData.returnType == '2' || _this.form.returnType =='2' || _this.form.returnType =='4') && _this.form.installFlag ==1){
                    params.returnRequestAgentDto.dtoArchiveInstall ={//安装运能信息
                         installMethod:this.form.installation,//安装方式
                         installSite:this.form.installSite,//安装网点 
                         installArea:this.form.installArea,//安装区域
                         installCompanyCode:this.form.installSegmentCode,//售后公司代码installCompanyCode
                         installDate:this.form.installDate,//安装日期
                         installSegmentCode:this.form.installSlot,//安装时段编号
                         installStartTime:this.form.installStartDateTime,//开始时间
                         installEndTime:this.form.installEndDateTime,//结束时间
                    };
                    if(_this.form.installationName =='不安装'){
                        params.returnRequestAgentDto.dtoArchiveInstall.notInstallReasonName=this.form.notinstallreason;//不安装原因中文描述   
                    }
                    //换货增加参数
                    //if(_this.form.operFlag == 1 || _this.form.operFlag == 3){//厂家安装
                    if(this.form.installDate){
                        params.returnRequestAgentDto.dtoArchiveInstall.installDate = Utils.formatDatedouble(new Date(this.form.installDate).getTime());//转换时间格式 
                    }
                        
                    //};
                }
                //退换货处理保存
                if (url && url.indexOf('returnRequestId') != -1) {
                    API.dealReturnRequest(params).then(response => {
                        let url = '/order/serviceList_detail?returnRequestId=' + this.$route.query.returnRequestId;
                        _this.commonSave(response, url);
                    })
                }
                //退换货提交保存
                else {
                    API.submitReturnRequest(params).then(response => {
                        let storeCode = _this.form.originalStoreCode;
                        let url = '/order/orderdetails?orderId=' + this.$route.query.orderId + '&storeCode=' + storeCode + '&shippingGroupId=' + this.$route.query.shipId;
                        _this.commonSave(response, url);
                    })
                }
            },
            //删除用户之前上传的图
            handleRemoveRequestImage(index) {
                this.form.imageList.splice(index, 1);
            },
            //删除缩略图
            handleRemove(file, fileList) {
                this.form.imageList = this.form.imageList.filter(function (item) {
                    if (file.uid !== item.uid) {
                        return true;
                    }
                });
            },
            //缩略图预览
            handlePictureCardPreview(file) {
                this.form.imageUrl = file.url;
                this.form.dialogVisible = true;
            },
            //图片个数限制
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 张图片`);
            },
            //图片上传前校验
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' ||
                        file.type === 'image/jpg' ||
                        file.type === 'image/png' ||
                        file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 jpeg,jpg,png,gif 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //上传图片
            uploadImage (e, res) {
                let _this = this;
                let reader = new FileReader();
                reader.readAsDataURL(e.file);//读文件，为base64
                reader.onload = function () {
                    _this.imageName = e.file.name;
                    _this.imageData = reader.result.substring(reader.result.indexOf(",") + 1);//切除“data:image/png;base64,”
                    API.uploadImage({
                        imageName: _this.imageName,
                        imageData: _this.imageData,
                    }).then(response => {
                        let _file = {
                            url: response.response,
                            name: e.file.name,
                            uid: e.file.uid //判断依据
                        };
                        if (response.success) {
                            _this.form.imageList.push(_file);
                            _this.$message.success('图片上传成功！');
                        } else {
                            _this.$message.error('图片上传失败' + response.respMsg);
                            _this.handleRemove(_file);
                        }
                    })
                };
            },
            //关闭普通二次确认弹窗
            handleClose() {
                this.dialogVisible = false;
            },
            //关闭赠品分摊弹窗
            handleFreeGiftClose() {
                this.dialogHasFreeGiftVisible = false;
            },
            //关闭美豆不足弹窗
            handleBeanNumberClose() {
                this.dialogBeanNumberVisible = false;
                this.dialogCardrespMsgVisible = false;
                this.$router.go(0);
            },
            //显示弹窗
            handleShowDialog (ruleForm) {
                var _this = this;
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        if (_this.form.returnType == 1) {
                          // 如果是退货
                            // 如果需补购美豆数大于0，展示美豆不足弹窗，
                            // 如果有促销信息，弹出退款明细确认框，否则弹出普通确认框
                          if (_this.pendingBuyGomeBeanNumber && _this.pendingBuyGomeBeanNumber > 0) {
                            _this.dialogBeanNumberVisible = true;
                          } else {
                            if (_this.serviceData.returnRefundAgentDto) {
                                _this.dialogHasFreeGiftVisible = true;
                            } else {
                                _this.dialogVisible = true;
                            }
                          }
                        } else {
                          // 如果是换货，先判断是否选择了完整的取件时间，
                          // 如果选择了弹出普通确认框，反之展示toast提示'请选择完整的预约取货时间'，并且不发送提交请求
                            if (_this.form.returnMethod == 1 && (_this.form.pickupStartDateTime == '' || _this.form.pickupEndDateTime == '')) {
                                _this.$message.error(`请选择完整的预约取货时间！`);
                                return;
                            }
                            _this.dialogVisible = true;
                        }
                    }
                })
            }
        },
    }
</script>
