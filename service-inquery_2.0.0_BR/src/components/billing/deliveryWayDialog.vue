<template>
  <div>
    <el-dialog title="建档" width="850px" 
      :visible.sync="deliveryDialog" 
      :closeOnClickModal="false"
      :closeOnPressEscape="false"
      :before-close="handleCancelForm"
      >
      <el-form :model="initInfo" :rules="rules" ref="initInfo" label-width="120px" >
        <el-form-item label="送货方式：" prop="deliverMode.value">
          <el-select v-model="initInfo.deliverMode.value" @change="handleDeliverModeChange" placeholder="请选择" :disabled="initInfo.deliverMode.disabled">
            <el-option v-for="item in initInfo.deliverOptionList" :key="item.deliverType" :label="item.deliverTypeName" :value="item.deliverType"></el-option>
          </el-select>
          <div v-if="initInfo.deliverMode.deliverType==6 || initInfo.deliverMode.deliverType==8" class="deliverMode-tip">
            <img src="../../assets/images/tip.png" alt="">
            : 此配送方式较特殊，请确认该商品为{{initInfo.deliverMode.deliverType==6?'厂家自提配送':'配送自提'}}
          </div>
        </el-form-item>
        <el-form-item label="送货时间：" prop ="dtoDeliverTime.deliverDate">
          <el-date-picker  ref="deliverTimeDom" v-model="initInfo.dtoDeliverTime.deliverDate"  @change="handleDeliverTimeChange" type="date" placeholder="选择日期" 
            :disabled="initInfo.dtoDeliverTime.disabled"
            :picker-options="initInfo.deliverTimePickerOpts"
            :clearable="false" 
            :editable="false">
          </el-date-picker>
          <span @click.stop="handleDeliverTimeFocus" v-if="initInfo.dtoDeliverTime.segmentDescBegin" class="data-slot">{{initInfo.dtoDeliverTime.segmentDescBegin}}-{{initInfo.dtoDeliverTime.segmentDescEnd}}</span> 
          <span class="deliver-install-flag" v-if="_isShowDeliverInstallSynchronous()"><img src="../../assets/images/u2.png" alt=""></span>
          <span v-if="initInfo.deliverMode.deliverType==3" class="deliverMode-tip">
            此送货时间为送到网点的时间，到家以安装时间为准！
          </span>
        </el-form-item>
        <el-form-item label="" v-if="initInfo.storeInstallType">
          <el-radio-group v-model="initInfo.storeInstallType"  @change="handleStoreInstallTypeChange">
            <el-radio :label="2">不安装</el-radio>
            <el-radio :label="1">安装</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安装方式：" prop ="installMode.value" v-if="initInfo.storeInstallType!=2">
          <el-select v-model="initInfo.installMode.value" @change="handleInstallModeChange" placeholder="请选择" :disabled="initInfo.installMode.disabled">
            <el-option v-for="item in initInfo.installOptionList" :key="item.installType" :label="item.installTypeName" :value="item.installType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不安装原因：" v-if="initInfo.installMode.installType==2 && initInfo.installMode.notSupportInstall!=1 || initInfo.storeInstallType==2"  prop="notInstallReason">
          <el-select v-model="initInfo.notInstallReason"  @change="handleNotInstallChange" placeholder="请选择">
            <el-option v-for="item in initInfo.notInstallReasonList" :key="item.reasonId" :label="item.reasonName" :value="item.reasonName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装时间：" v-else prop="dtoInstallTime.installDate">
          <el-date-picker ref="installTimeDom" v-model="initInfo.dtoInstallTime.installDate" @change="handleInstallTimeChange" type="date" placeholder="选择日期" 
            :disabled="initInfo.dtoInstallTime.disabled"
            :picker-options="initInfo.installTimePickerOpts"
            :clearable="false" 
            :editable="false" >
          </el-date-picker>
          <span @click.stop="handleInstallTimeFocus" v-if="initInfo.dtoInstallTime.segmentDescBegin" class="data-slot">{{initInfo.dtoInstallTime.segmentDescBegin}}-{{initInfo.dtoInstallTime.segmentDescEnd}}</span> 
          <span class="deliver-install-flag" v-if="_isShowDeliverInstallSynchronous()"><img src="../../assets/images/u2.png" alt=""></span>
        </el-form-item>
      </el-form>
      <g-delivery v-model="deliveryAbility" @changed="handleDeliveryAbilityChange"></g-delivery>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitForm('initInfo')" >确 定</el-button>
        <el-button @click="handleCancelForm()">取 消</el-button>
      </div>
      <!-- 新增地址弹窗 -->
      <el-dialog 
        :visible.sync="addAddressDialog" 
        :show-close="false"
        width="850px"
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
        class="billing-dialog"
        >
        <AddAddress 
          v-if="addAddressDialog"
          @bind-confirm-add-address="bindConfirmAddAddress"
          @bind-cancel-add-address="bindCancelAddAddress"
          :pFrom="pFrom"
        ></AddAddress>
      </el-dialog>

      <!-- 选择地址弹窗 -->
      <el-dialog 
        :visible.sync="selectAddressDialog" 
        :show-close="false"
        width="850px"
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
        class="billing-dialog"
        >
      
        <SelectAddress 
          @bind-confirm-select-address="bindConfirmSelectAddress"
          @bind-cancel-select-address="bindCancelSelectAddress"
          @bind-add-new-address="bindAddNewAddress"
          :pAddressList="addressList"
          :pFrom="pFrom"
          class="billing-dialog select-address"
        ></SelectAddress>
      </el-dialog>

    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios';
  import { mapActions, mapState,  mapMutations} from 'vuex';
  import API from '@/api/billing/billing';
  import AddAddress from '@/components/billing/addAddress';
  import SelectAddress from '@/components/billing/selectAddress';
  import util from '@/common/util';
  export default {
    props: { query:Object, deliveryDialog: Boolean },
    created() {
      this.init();
    },
    components:{
      AddAddress,
      SelectAddress,
    },
    computed:{
      ...mapState([
        'billingInitData', 
        'billingUsedParam',
        'billingEdit'
      ])
    },
    data() {
      let self = this;
      let deliverModeFn=(rule, value, callback) => { //送货方式验证
        !value ? callback(new Error("送货方式不能为空")) : callback()
      };
      let dtoDeliverTimeFn=(rule, value, callback) => { //送货时间验证
        // 特殊：厂家自提配送必选配送日期（不选运能）
        //特殊：配送自提大件商品的送货时间只可选择日期，不调运能
        //厂家带货安装，日期是必选项
        (self.initInfo.deliverMode.deliverDateAble && self.initInfo.deliverMode.deliverTimeAble && !value) || (self.initInfo.deliverMode.deliverType==6 && !value) || (self.initInfo.deliverMode.deliverDateAble && self.initInfo.deliverMode.deliverType==4 && !value ) || (self.initInfo.deliverMode.deliverType==8 && self.initInfo.big == 1 && !value)  
          ? callback(new Error("送货时间不能为空")) 
          : callback();
      };
      
      let installModeFn=(rule, value, callback) => { //安装方式验证
        !self.initInfo.installMode.disabled && !value ? callback(new Error("安装方式不能为空")) : callback()
      };
      let dtoInstallTimeFn=(rule, value, callback) => { //安装时间验证
        // 特殊：配送方式为门店自提，安装方式为座装或者挂装的情况，安装时间必选
        //送货方式是厂家带货安装，安装方式是厂家安装，安装时间日期是必选项，不调安装能
        (self.initInfo.installMode.installDateAble && self.initInfo.installMode.installTimeAble && !value) || 
        ((self.initInfo.deliverMode.deliverType== 2 && self._installModeIs56(self.initInfo.installMode) && !value) || 
        (self.initInfo.deliverMode.deliverDateAble && self.initInfo.deliverMode.deliverType== 4 && self.initInfo.installMode.installType== 3 && !value) )
          ? callback(new Error("安装时间不能为空"))
          : callback(); 
      };
      let notInstallReasonFn=(rule, value, callback) => { //不安装方式验证
        self.initInfo.installMode.installType == 2  && !value ? callback(new Error("不安装原因不能为空")) : callback()
      };

      return {
        rules:{
          "deliverMode.value":[
            { validator: deliverModeFn, trigger: 'change' }
          ],
          "dtoDeliverTime.deliverDate":[
            { validator: dtoDeliverTimeFn, trigger: 'blur' }
          ],
          "installMode.value":[
            { validator: installModeFn, trigger: 'change' }
          ],
          "dtoInstallTime.installDate":[
            { validator: dtoInstallTimeFn, trigger: 'blur' }
          ],
          "notInstallReason":[
            { validator: notInstallReasonFn, trigger: ['change','blur'] }
          ]
        },
        addAddressDialog: false,//新增地址弹窗显示隐藏变量
        selectAddressDialog: false,//选择地址弹窗显示隐藏变量
        addressList: [],//地址列表数据
        initInfo:{
          "townCode":null,
          "deliverOptionList":[],
          "dtoDeliverTime": {
            "disabled":true,
            "deliverDate": null,
            "segmentCode": null,
            "segmentDescBegin": null,
            "segmentDescEnd": null,
            "startDateForVerifyDeliver": null
          },
          "deliverMode":{
            "disabled":true,
            "value":"",
            "oldValue": "",//存放切换前配送方式前的值
            "deliverType": null,
            "deliverTypeName": null,
            "isUsed":null,
            "isSelected": null,
            "deliverDateAble": null,
            "deliverTimeAble": null,
            "deliverStartDate": null,
            "deliverEndDate": null
          },
          "storeInstallType":null, //2 不安装，1 安装，null 非门店自提且无地址情况
          "installOptionList":[],
          "dtoInstallTime": {
            "disabled":true,
            "installDate": null,
            "segmentCode": null,
            "segmentDescBegin": null,
            "segmentDescEnd": null,
            "startDateForVerifyInstall": null
          },
          "installMode":{
            "disabled":true,
            "value":"",
            "installType": null,
            "installTypeName": null,
            "isUsed": null,
            "isSelected": null,
            "installDateAble": null,
            "installTimeAble": null,
            "installStartDate": null,
            "installEndDate"  : null,
            "notSupportInstall":0
          },
          "deliverTimePickerOpts":{
            disabledDate(time) {
              let deliverMode = self.initInfo.deliverMode;
              return time.getTime() < deliverMode.deliverStartDate || time.getTime() > deliverMode.deliverEndDate
            }
          },
          "installTimePickerOpts":{
            disabledDate(time) {
              let dtoDeliverTime = self.initInfo.dtoDeliverTime,
                  installMode = self.initInfo.installMode ;
              let cur = dtoDeliverTime.deliverDate  ? dtoDeliverTime.deliverDate*1||null  : installMode.installStartDate;
              return time.getTime() < cur  || time.getTime() > installMode.installEndDate;
            }
          },
          "notInstallReasonList":[],
          "notInstallReason": "",// 不安装原因
          "big"  : null //0 小件 1 大件
        },
        deliveryAbility: {},
        pFrom: 0,//调用地址弹窗时传的值，1表示门店自提无收货地址，2表示门店配送无地址
        isHasAddress: false//是否有地址
      };
    },
    methods: {
      ...mapMutations([
      'IS_OPERATE_BILLING_PAGE'
      ]),
      ...mapActions([
        'initOrder' ,
        'initLloadEditSellerBill'
      ]),
      //deliverType 用于重新加载小load，并更新的配送方式
      init(deliverType) {
        let self = this; 
        let params = {
          commerceItemId: self.query.commerceItemId,
          operationType : self.billingEdit?1:0,
          shipmentsDate : self.query.shipmentsDate,
          sellerBillId: self.billingInitData.sellerBillId,
          ...JSON.parse(JSON.stringify(self.billingUsedParam))
        };
        
        API.loadTransportAndInstall(params).then((data) => {
          if(data.success) {
            let  res = data.response;
            self.isHasAddress = res.userAddressInfo && res.userAddressInfo.detailAddress ? true : false;
            // 门店自提且无地址的情况
            if(res.deliverWay==1 && !res.userAddressInfo.detailAddress){
              let self = this;
              res.deliverOptionList = _filterUsed(res.deliverOptionList);
              let deliverMode = _findSelected(res.deliverOptionList); 
              let notInstallReason = _findSelected(res.notInstallReasonList)
              
              res["dtoDeliverTime"]['disabled'] = true;
            
              res['deliverMode'] = {
                ...deliverMode,
                "disabled" : res.deliverOptionList.length ? false : true,
                "value"    : deliverMode ? deliverMode['deliverType'] : "",
                "oldValue" : deliverMode ? deliverMode['deliverType'] : "",
              }
              res["notInstallReason"] = res.notInstallReasonList.length && notInstallReason? notInstallReason['reasonName'] : "";
              res['installMode'] = {
                ...(self.initInfo.installMode),
                "disabled" : true,
                "value"    : ""
              }
              res["storeInstallType"] = 2;
              res["dtoInstallTime"]['disabled'] = true
              res['big'] = res.big;
              return Object.assign(self.initInfo,res)
            }else{
              res["storeInstallType"] = null;
              let deliverMode = _findSelected(res.deliverOptionList),
                installMode = _findSelected(res.installOptionList),
                deliverTimeIsDisabled = self._deliverTimeIsDisabled(deliverMode);
              //(送货方式选中 且 （送货时间不可选或 送货时间填日期（可为空））且 安装方式为空)或（送货方式选中 且 送货时间有值 且 安装方式为空），调请求安装方式接口
              if(deliverMode && !installMode && (deliverMode.deliverTimeAble==0 || res["dtoDeliverTime"]["deliverDate"]) ){
                let params = self._getInstallTypesParams(deliverMode,res["dtoDeliverTime"]);
                return {params,res}
              }else{
                self.initInfo = self._transInitData(res) 
                if(typeof deliverType != 'undefined') {
                  self.handleDeliverModeChange(deliverType);
                }
              }
            }
          }else{
            self.$message({
              showClose: true,
              message  : data.respMsg + '（' + data.linkId + '）',
              type:'warning'
            })
          }
        }).then((data)=>{
          if(data && data.params && data.res){
            API.queryInstallTypes(data.params).then((res2) => {
              if(res2.success){
                data["res"]['notInstallReasonList'] =  res2.response.dtoNotInstallReasonList;
                data["res"]['installOptionList']    =  res2.response.installOptionList;
                self.initInfo = self._transInitData(data["res"])
                if(typeof deliverType != 'undefined') {
                  self.handleDeliverModeChange(deliverType);
                }
              }else{
                self.$message({
                  showClose: true,
                  message  : res2.respMsg + '（' + res2.linkId + '）',
                  type:'warning'
                })
              }
            })
          }
        })
      },
      
      _transInitData(data){
        let self = this;
        data.deliverOptionList = _filterUsed(data.deliverOptionList);
        data.installOptionList = _filterUsed(data.installOptionList);
        let deliverMode = _findSelected(data.deliverOptionList); 
        let installMode = _findSelected(data.installOptionList);
        let notInstallReason = _findSelected(data.notInstallReasonList)
        let deliverTimeIsDisabled = self._deliverTimeIsDisabled(deliverMode);
        
        data["dtoDeliverTime"]['disabled'] = deliverTimeIsDisabled;
       
        data['deliverMode'] = {
          ...(deliverMode || self.initInfo.deliverMode),
          "disabled" : data.deliverOptionList.length ? false : true,
          "value"    : deliverMode ? deliverMode['deliverType'] : "",
          "oldValue"    : deliverMode ? deliverMode['deliverType'] : ""
        }
        if(data.dtoDeliverTime.able==3){
          self.query.fixInstallSyncFlag = 1;
        }

        //不支持安装
        if(installMode.installType==2 && installMode.notSupportInstall==1){
          installMode.installTypeName='不支持安装'
          data["notInstallReason"] = "不支持安装"
        }else{
          data["notInstallReason"] = data.notInstallReasonList.length && notInstallReason? notInstallReason['reasonName'] : "";
        }
        data['installMode'] = {
          ...(installMode || self.initInfo.installMode),
          "disabled" : data.installOptionList.length ? false : true,
          "value"    : installMode ? installMode['installType'] : ""
        }
        //集中配送（大件）&& 座装或挂装,安装时间一直是置灰的状态
        if(data.deliverMode.deliverType== 1 && self._installModeIs56(installMode)){
          data["dtoInstallTime"]['disabled'] = true
        }else{
          data["dtoInstallTime"]['disabled'] = self._installTimeIsDisabled(installMode);
        }
        data['big'] = data.big;
        return Object.assign({},self.initInfo,data)
      },
      //获取安装方式接口参数
      _getInstallTypesParams(deliverMode,dtoDeliverTime){
        let self = this;
        let townCode = null;
        if(self.initInfo.townCode){
          townCode = self.initInfo.townCode;
        }else if(self.billingInitData.address){
          townCode = self.billingInitData.address.townCode;
        }
        let params = {
          "townCode" :      townCode,
          "commerceItemId": self.query.commerceItemId,
          "operationType" : self.billingEdit?1:0,
          "commerceItemId": self.query.commerceItemId,
          "deliverType" :    deliverMode.deliverType,
          "deliverDate" :    dtoDeliverTime.deliverDate*1 || null,
          "segmentCode":     dtoDeliverTime.segmentCode,
          "segmentDescBegin":dtoDeliverTime.segmentDescBegin,
          "segmentDescEnd":  dtoDeliverTime.segmentDescEnd,
          "scene"       : self.billingEdit?"AfterCommit":"BeforeCommit",
          "big"         : self.initInfo.big,
          sellerBillId: self.billingInitData.sellerBillId,
          ...JSON.parse(JSON.stringify(self.billingUsedParam))
        };
        return params
      },
      //获取安装方式
      _getApiQueryInstallTypes(){
        let self = this;
        let params = self._getInstallTypesParams(self.initInfo.deliverMode,self.initInfo.dtoDeliverTime);
        API.queryInstallTypes(params).then((data) => {
          if(data.success){
            let res = data.response,
                initInfo = this.initInfo, 
                dtoNotInstallReasonList = res.dtoNotInstallReasonList;

            initInfo.notInstallReasonList = dtoNotInstallReasonList;
            initInfo.installOptionList = _filterUsed(res.installOptionList);
            //只有一种安装方式，安装方式可用并选中，安装时间或者不安装原因可用
            this._resetFItem(null,false,true);
            if(initInfo.installOptionList.length){
              let installMode = _findSelected(initInfo.installOptionList);
              if(!installMode && initInfo.installOptionList.length==1){
                installMode = initInfo.installOptionList[0]
              }
              initInfo["installMode"] = {
                ...installMode,
                "disabled" : initInfo.installOptionList.length ? false : true,
                "value"    : installMode ? installMode['installType'] : ""
              };
              //不支持安装
              if(initInfo.installMode.notSupportInstall ==1 ){
                installMode.installTypeName ='不支持安装'
                initInfo.dtoInstallTime['disabled'] = true;
                initInfo.notInstallReason = "不支持安装"
              }else{
                //安装方式为不安装,安装时间不可选，其他情况，安装时间按函数判断
                initInfo.dtoInstallTime['disabled'] = installMode['installType']==2 ? true : self._installTimeIsDisabled(installMode);
                let notInstallReason = _findSelected(dtoNotInstallReasonList);
                initInfo.notInstallReason = notInstallReason? notInstallReason['reasonName'] : "";
                if(this.query.fixInstallSyncFlag==1 && self.initInfo.installMode.installType==1){
                  // 集中配送，送货时间有送安标识，售后安装的情况下，将配送时间赋值给安装时间
                  initInfo.dtoInstallTime.disabled = false;
                  initInfo.dtoInstallTime.installDate = initInfo.dtoDeliverTime.deliverDate;
                  initInfo.dtoInstallTime.segmentCode = null;
                  initInfo.dtoInstallTime.segmentDescBegin = initInfo.dtoDeliverTime.segmentDescBegin;
                  initInfo.dtoInstallTime.segmentDescEnd = initInfo.dtoDeliverTime.segmentDescEnd;
                  initInfo.dtoInstallTime.startDateForVerifyInstall = initInfo.dtoDeliverTime.startDateForVerifyDeliver;
                }
              }
            }
          }else{
            this.$message({
              showClose: true,
              message  : data.respMsg + '（' + data.linkId + '）',
              type:'warning'
            })
          }
        })
      },
      //送货时间是否可用
      _deliverTimeIsDisabled(deliverMode){
        return deliverMode && deliverMode.deliverDateAble ? false : true;
      },
      //安装时间是否可用
      _installTimeIsDisabled(installMode){
        return installMode && installMode.installDateAble ? false : true;
      },
      //是否显示送货安装同步标识
      _isShowDeliverInstallSynchronous(){
        let initInfo = this.initInfo;
        let installTime =  initInfo.dtoInstallTime;
        let deliverTime = initInfo.dtoDeliverTime;

        // 有送安同步标识==1
        if(this.query.fixInstallSyncFlag!=1){return false;}
        // 安装方式为售后安装
        if(initInfo.installMode.installType!=1){return false;}
        // 安装时间==送货时间
        if(!(deliverTime.deliverDate && installTime.installDate && deliverTime.segmentDescBegin && installTime.segmentDescBegin && deliverTime.segmentDescEnd && installTime.segmentDescEnd && deliverTime.deliverDate == installTime.installDate && deliverTime.segmentDescBegin == installTime.segmentDescBegin && deliverTime.segmentDescEnd == installTime.segmentDescEnd)){return false;}
        // 同时满足，显示送安同步icon,否则不显示
        return true;
      },
      //安装方式为座装6或挂装5的安装方式
      _installModeIs56(installMode){
        return installMode.installType ==5 ||  installMode.installType ==6
      },
      //重置送货时间，安装方式，安装时间，不安装原因的数据
      _resetFItem(deliverTimeFlag,installModeFlag,installTimeFlag){
        if(deliverTimeFlag!=undefined){
          this.initInfo["dtoDeliverTime"]= {
            "disabled":deliverTimeFlag,
            "deliverDate": null,
            "segmentCode": null,
            "segmentDescBegin": null,
            "segmentDescEnd": null,
            "startDateForVerifyDeliver": null
          }
        }
        if(installModeFlag!=undefined){
          this.initInfo["installMode"]= {
            "disabled":installModeFlag,
            "value":"",
            "installType": null,
            "installTypeName": null,
            "isUsed": null,
            "isSelected": null,
            "installDateAble": null,
            "installTimeAble": null,
            "installStartDate": null,
            "installEndDate"  : null,
            "notSupportInstall":0
          }
        }
        if(installTimeFlag!=undefined){
          this.initInfo["dtoInstallTime"]= {
            "disabled":installTimeFlag,
            "installDate": null,
            "segmentCode": null,
            "segmentDescBegin": null,
            "segmentDescEnd": null,
            "startDateForVerifyInstall": null
          }
        }
        this.initInfo.notInstallReason = ""
      },
      //点击送货时间拨次可以弹出日历控件
      handleDeliverTimeFocus(){
        this.$refs.deliverTimeDom.focus();
      },
      //点击安装时间拨次可以弹出日历控件
      handleInstallTimeFocus(){
        this.$refs.installTimeDom.focus();
      },
      //送货能和安装能回调函数
      handleDeliveryAbilityChange(obj){
        let self = this;
        let dtoDeliverTime = self.initInfo.dtoDeliverTime;
        if(obj['type']=='delivery'){
          this.query.fixInstallSyncFlag = null;
          if(obj.st=="close"){
            dtoDeliverTime.deliverDate = null;
            dtoDeliverTime.segmentCode = null;
            dtoDeliverTime.segmentDescBegin = null;
            dtoDeliverTime.segmentDescEnd   = null;
            return false;
          }
          if(obj.able==3){
            this.query.fixInstallSyncFlag = 1;
          }
          
          dtoDeliverTime.deliverDate = obj.time;
          dtoDeliverTime.segmentCode = obj.code;
          dtoDeliverTime.segmentDescBegin = obj.st;
          dtoDeliverTime.segmentDescEnd   = obj.et;
          self.initInfo.installMode['disabled'] = false
          self._getApiQueryInstallTypes();
        }else if(obj['type']=='installAbility'){
          let dtoInstallTime = self.initInfo.dtoInstallTime;
          if(obj.st=="close"){
            dtoInstallTime.installDate = null;
            dtoInstallTime.segmentCode = null;
            dtoInstallTime.segmentDescBegin = null;
            dtoInstallTime.segmentDescEnd   = null;
            return false;
          }
          dtoInstallTime.installDate = obj.time;
          dtoInstallTime.segmentCode = obj.code;
          dtoInstallTime.segmentDescBegin = obj.st;
          dtoInstallTime.segmentDescEnd   = obj.et;
          /* if(self.initInfo.deliverMode.deliverType ==3 && dtoDeliverTime.disabled){
            // obj.time 赋值给配送时间
            dtoDeliverTime.deliverDate = dtoInstallTime.installDate;
          } */
        }
      },
      //送货方式change事件
      handleDeliverModeChange(val){
        let self = this;
        //如果是门店配送无地址则去选择地址
        if(val == 9 && !this.isHasAddress) {
          this.pFrom = 2;
          this.queryMemberAddressList();
          return false;
        }

        let deliverOptionList = self.initInfo.deliverOptionList;
        _changeListSelected(deliverOptionList,'deliverType',val);
        let deliverMode = _findSelected(deliverOptionList);
        let deliverTimeIsDisabled = self._deliverTimeIsDisabled(deliverMode);
        let installModeIsDisabled =  deliverMode.deliverDateAble && deliverMode.deliverTimeAble ? true : false ;
        this.query.fixInstallSyncFlag = null;
        self.initInfo.deliverMode = Object.assign({},deliverMode,{
          "value":val,
          "oldValue":val,
          "disabled":false
        });
        //安装方式可用
        if(!installModeIsDisabled){
          self._resetFItem(deliverTimeIsDisabled);
          self._getApiQueryInstallTypes();
        }else{
          self._resetFItem(deliverTimeIsDisabled,true,true);
        }
        self.$refs['initInfo'].clearValidate(['dtoDeliverTime.deliverDate','installMode.value','notInstallReason','dtoInstallTime.installDate'])
      },
      //送货时间change事件
      handleDeliverTimeChange(val){
        let self = this;
        //日期和拨次可用的时候，调运能
        if(self.initInfo.deliverMode.deliverDateAble && self.initInfo.deliverMode.deliverTimeAble){
          self.initInfo.dtoDeliverTime.startDateForVerifyDeliver = val;
          self.deliveryAbility={ 
            "val":{
              "commerceItemId":self.query.commerceItemId,
              "startTransportDate":self.initInfo.dtoDeliverTime.deliverDate*1 || null,
              "scene" : self.billingEdit?"AfterCommit":"BeforeCommit",
              "sellerBillId":self.billingInitData.sellerBillId,
              ...JSON.parse(JSON.stringify(self.billingUsedParam)),
              "deliveryType": self.initInfo.deliverMode.deliverType
              },
            "typereq":"openBill",
            "type":"delivery"
          };  //重新赋值 触发组件的watch
        }else{
          self.initInfo.installMode['disabled'] = false
         
          self._getApiQueryInstallTypes();
        }
      },
      // 门店自提无收货地址点击安装需要调用地址模块
      handleStoreInstallTypeChange(val){
        if(val==1){
          this.pFrom = 1;
          this.queryMemberAddressList();
        }
      },
      //安装方式change事件
      handleInstallModeChange(val){
        let self = this;
        let installOptionList = self.initInfo.installOptionList;
        _changeListSelected(installOptionList,'installType',val);
        let installMode = _findSelected(installOptionList);
        self.initInfo.installMode = Object.assign({},installMode,{
          "value":val,
          "disabled":false
        })
        //集中配送（大件）&& 座装或挂装,将配送时间赋值给安装时间
        let dtoDeliverTime = self.initInfo.dtoDeliverTime;
        if(self.initInfo.deliverMode.deliverType== 1 && self._installModeIs56(self.initInfo.installMode)){
          if(dtoDeliverTime.deliverDate ){
            self._resetFItem(null, null, true);
            self.initInfo.dtoInstallTime.installDate = dtoDeliverTime.deliverDate;
          }else{
            self._resetFItem(null, null, self._installTimeIsDisabled(installMode));
          }
        }else if(this.query.fixInstallSyncFlag==1 && self.initInfo.installMode.installType==1){
          // 集中配送，送货时间有送安标识，售后安装的情况下，将配送时间赋值给安装时间
          self.initInfo.dtoInstallTime.disabled = false;
          self.initInfo.dtoInstallTime.installDate = dtoDeliverTime.deliverDate;
          self.initInfo.dtoInstallTime.segmentCode = null;
          self.initInfo.dtoInstallTime.segmentDescBegin = dtoDeliverTime.segmentDescBegin;
          self.initInfo.dtoInstallTime.segmentDescEnd = dtoDeliverTime.segmentDescEnd;
          self.initInfo.dtoInstallTime.startDateForVerifyInstall = dtoDeliverTime.startDateForVerifyDeliver;
        }else{
          self._resetFItem(null, null, self._installTimeIsDisabled(installMode));
        }
        
        self.$refs['initInfo'].clearValidate(['notInstallReason','dtoInstallTime.installDate'])
      },
      //安装时间change事件
      handleInstallTimeChange(val){
        let self = this,
          dtoDeliverTime = self.initInfo.dtoDeliverTime;
        if(self.initInfo.installMode.installDateAble && self.initInfo.installMode.installTimeAble){
          self.initInfo.dtoInstallTime.startDateForVerifyInstall = val;
          self.deliveryAbility={ 
            "val":{
              "townCode": self.initInfo.townCode || self.billingInitData.address.townCode,
              "commerceItemId":self.query.commerceItemId,
              "deliverType": self.initInfo.deliverMode.deliverType,
              "deliverDate": dtoDeliverTime.deliverDate*1 || null,
              "segmentCode":     dtoDeliverTime.segmentCode,
              "segmentDescBegin":dtoDeliverTime.segmentDescBegin,
              "segmentDescEnd":  dtoDeliverTime.segmentDescEnd,
              "startInstallDate":self.initInfo.dtoInstallTime.installDate*1,
              "scene" : self.billingEdit?"AfterCommit":"BeforeCommit",
               "sellerBillId":self.billingInitData.sellerBillId,
              ...JSON.parse(JSON.stringify(self.billingUsedParam)),
              "syncFlag": (this.query.fixInstallSyncFlag==1 ? 1 : 0)
              },
            "typereq":"openBill",
            "type":"installAbility"
          };
        }
      }, 
      //不安装原因选项change事件
      handleNotInstallChange(val){
        _changeListSelected(this.initInfo.notInstallReasonList,'reasonName',val);
      },
      //点击弹窗确定按钮的执行函数
      handleSubmitForm(formName){
        let self = this;
        if(self.initInfo.storeInstallType==2){
          self.initInfo.installMode.installType = 2
        }
        self.$refs[formName].validate((valid) => {
          if(valid){ //提交
            let dtoDeliverTime = self.initInfo.dtoDeliverTime;
            let dtoInstallTime = self.initInfo.dtoInstallTime;
            let params ={
              ...JSON.parse(JSON.stringify(self.billingUsedParam)),
              "sellerBillId":self.billingInitData.sellerBillId,
              "operationType" : self.billingEdit?1:0,
              "saveTransportAndInstall":{
                "commerceItemId" :  self.query.commerceItemId,
                "deliverOption":{
                  "deliverType" : self.initInfo.deliverMode.deliverType,
                  "deliverDate": dtoDeliverTime.deliverDate*1 || null,
                  "segmentCode" :      dtoDeliverTime.segmentCode,
                  "segmentDescBegin" : dtoDeliverTime.segmentDescBegin,
                  "segmentDescEnd" : dtoDeliverTime.segmentDescEnd,
                  "startDateForVerifyDeliver": dtoDeliverTime.startDateForVerifyDeliver*1 || null
                },
                "installOption":{
                  "installType" : self.initInfo.installMode.installType,
                  "installDate":  dtoInstallTime.installDate*1 || null,
                  "segmentCode" :      dtoInstallTime.segmentCode ,
                  "segmentDescBegin" : dtoInstallTime.segmentDescBegin,
                  "segmentDescEnd" : dtoInstallTime.segmentDescEnd,
                  "startDateForVerifyInstall":  dtoInstallTime.startDateForVerifyInstall*1 || null
                },
                "notInstallReason":self.initInfo.notInstallReason,
                "address":{
                  ...JSON.parse(JSON.stringify(self.initInfo.userAddressInfo))
                }
              }
            }
            API.saveTransportAndInstall(params).then((data) => {
              this.IS_OPERATE_BILLING_PAGE(true);
              if(data.success){
                //保存建档信息之后，如果是导购单页面，调用大load,导购车页面，调用编辑导购车接口
                if(this.billingEdit) {
                  this.initLloadEditSellerBill(this)
                }else{
                  this.initOrder(this)
                } 
                this.$emit('bindConfirmDelivery');
              }else{
                this.$message({
                  showClose: true,
                  message  : data.respMsg + '（' + data.linkId + '）',
                  type:'warning'
                })
              }
            })
          }
        })
      },
      //点击弹窗取消按钮事件
      handleCancelForm(){
        this.$emit('bindCancelDelivery');
        // 如果是门店自提，添加完地址需要重新调用load大接口
        let deliverType = this.initInfo.deliverMode.deliverType;
        if(this.initInfo.townCode ){
          this.initOrder(this)
        }
      },

      //获取地址列表数据
      queryMemberAddressList() {
        var billingInitData = this.billingInitData;
        this.addressList = [];
        let param = {
           memberId: this.billingUsedParam.memberId,
           addressId: (billingInitData.address ? billingInitData.address.addressId : '')
        };
        let value = this.initInfo.deliverMode.value;
        if( value == 9) {
          param.storeCode = this.billingUsedParam.storeCode;
          param.deliveryType = value;
        }
        API.queryMemberAddressList(param).then((data) => {
          if(data.success) {
            if(data.response && data.response.length>0) {//如果返回有地址列表，则展示地址列表弹窗，如果没有则展示新增地址弹窗
              this.selectAddressDialog = true;
              this.addressList = data.response;
            }else {
              this.addAddressDialog = true;
            }
          }else {
            this.pFrom = 0;
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
        })
      },

      //绑定新增地址确认事件
      bindConfirmAddAddress(data) {
        if(this.pFrom == 1) {//1表示门店自提无收货地址，2表示门店配送无地址
          this.initInfo.storeInstallType = null;//2 不安装，1 安装，null 非门店自提且无地址情况
          this.init(this.initInfo.deliverMode.value);
        }
        this.initInfo.townCode = data.townCode;
        if(this.pFrom == 2) {
          if(!data.used) {//该收获地址不支持门店配送
            this.init();
          }else {
            this.init(this.initInfo.deliverMode.value);
          }
        }
        this.pFrom = 0;
        this.addAddressDialog = false;
      },
      
      //绑定新增地址取消事件
      bindCancelAddAddress() {
        if(this.pFrom == 1) {
          this.initInfo.storeInstallType = 2;
        }
        if(this.pFrom == 2) { 
          this.initInfo.deliverMode.value = this.initInfo.deliverMode.oldValue;
        }
        this.pFrom = 0;
        this.addAddressDialog = false;
      },
      //绑定选择地址确认事件
      bindConfirmSelectAddress(data) {
      
        this.initInfo.storeInstallType = null;
        this.initInfo.townCode = data.townCode;
        this.pFrom = 0;
        this.selectAddressDialog = false;
        this.init(this.initInfo.deliverMode.value);
      },
      //绑定选择地址取消事件
      bindCancelSelectAddress() {
        if(this.pFrom == 1) {
          this.initInfo.storeInstallType = 2;
        }
        if(this.pFrom == 2) {
          this.initInfo.deliverMode.value = this.initInfo.deliverMode.oldValue;
        }
        this.pFrom = 0;
        
        this.selectAddressDialog = false;
      },
      //绑定选择地址里的新增事件
      bindAddNewAddress() {
        this.selectAddressDialog = false;
        setTimeout(()=> {this.addAddressDialog = true;}, 200)
      },
    }
  };
  let _findSelected = data => data.find( v => v.isSelected==1);
  let _filterUsed = data => data.filter( v => v.isUsed==1);
  // 切换list 中的选中和非选中数据
  let _changeListSelected = (data,type,val) => data.map( v => {
    v[type]==val ? v.isSelected = 1 : v.isSelected = 0
  });
</script>
<style lang="stylus">
.el-dialog .queryDeliveryAbility .showtime .showtimebtn li:hover {
  color: #409EFF;
}
</style>

<style lang="stylus"  scoped>
  .deliverMode-tip{
    display: inline-block;
    color: #E6A23C;
    font-size: 13px;
    img {
      margin-top:-3px;
      vertical-align: middle;
    }
  }
  .data-slot{display:inline-block;width:115px;position:relative;margin-left:-120px;font-size:13.33333px;}
  .deliver-install-flag{
    display: inline-block;
    margin-left :10px;
    width: 140px;
    height: 21px;
    vertical-align: middle;
    }
  .dialog-footer{text-align:center}
</style>