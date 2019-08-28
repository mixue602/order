<template>
  <div class="delivery-way-box" >
    <div class="dwb-sh" v-if="billingInitData.deliverWay==1 && !billingInitData.address" @click="handleDeliverDialog">
      <div class="dwb-row-hei"  >
        <span>门店自提</span>
      </div>
      <div class="dwb-row-hei"  >
        <span>不安装：</span>
        <span class="rText" v-if="!tiModel.notInstallReason">请选择不安装原因</span>
        <span v-else>{{tiModel.notInstallReason}}</span>
      </div>
    </div>
    <div class="dwb-sh" :class="{'isDisabledBg':!billingInitData.address}" v-else-if="tiModel.deliverTypeName || tiModel.installTypeName" @click="handleDeliverDialog" >
      <div class="dwb-row-hei"  >
          <span>{{tiModel.deliverTypeName}}</span>
          <span v-if="tiModel.docDelivery && tiModel.docDelivery.deliveryDate">
            : {{tiModel.docDelivery.deliveryDate | timeToDate}}&nbsp;
              <span v-if="tiModel.docDelivery.startSlotTime">
                {{tiModel.docDelivery.startSlotTime}}-{{tiModel.docDelivery.endSlotTime}}
              </span>
          </span>
      </div>
      <div class="dwb-row-hei">
          <span>{{tiModel.installTypeName}} </span>
          <span class="rText" v-if="!tiModel.notInstallReason && tiModel.installType==2 && tiModel.installTypeName!='不支持安装'">: 请选择不安装原因</span>
          <span v-if="tiModel.notInstallReason && tiModel.notInstallReason!='不支持安装'">: {{tiModel.notInstallReason}}</span>
          <span v-else-if="tiModel.docInstall && tiModel.docInstall.installDate">
            : {{tiModel.docInstall.installDate | timeToDate}}&nbsp;
            <span v-if="tiModel.docInstall.startSlotTime">
              {{tiModel.docInstall.startSlotTime}}-{{tiModel.docInstall.endSlotTime}}
            </span>
          </span>
      </div> 
    </div>
    <div class="dwb-sh" :class="{'isDisabledBg':!billingInitData.address}" v-else @click="handleDeliverDialog">
      <div class="dwb-row-hei"  >
        <div><em class="dwb-tip">请建档</em></div>
      </div>
    </div>

    <deliveryWayDialog 
      :query = "query"
      v-if ="deliveryDialog"
      :deliveryDialog="deliveryDialog"
      @bindConfirmDelivery="bindConfirmDelivery"
      @bindCancelDelivery="bindCancelDelivery"
    ></deliveryWayDialog>
  </div>
</template>

<script>
  import util from '@/common/util';
  import { mapActions, mapState,  mapMutations} from 'vuex';
  import deliveryWayDialog from '@/components/billing/deliveryWayDialog';
  
  export default {
    props: {
      tiModel: Object,
      query:Object
    },
    components:{
      deliveryWayDialog,
    },
    computed:{
      ...mapState([
        'billingInitData',
        'billingUsedParam',
      ])
    },
    data() {
      return {
        deliveryDialog: false,
      };
    },
    filters:{
      timeToDate(time){
        if(!time) return '';
        return util.formatDate.format(new Date(time),'y-M-d')
      }
    },
    methods: {
      handleDeliverDialog(){
        if(this.billingInitData.deliverWay==1 ||  this.billingInitData.address){
          this.deliveryDialog = true
        }else{
          this.deliveryDialog = false
        }
      },
      bindConfirmDelivery(){
        this.deliveryDialog = false;
      },
      bindCancelDelivery(){
        this.deliveryDialog = false;
      }
    }
  };
</script>
<style lang="stylus"  scoped>
  .rText{
    color:#f00;
  }
  .isDisabledBg{
    background-color:#eee;
    .dwb-row-hei{
      cursor:not-allowed;
    }
  }
  .dwb-sh{
    cursor:pointer;
    border:1px solid #dcdfe6;
    border-radius:4px;
  }
  .tr{text-align: right;}
  .dwb-row-hei{
    margin-left:15px;
    height:28px;line-height:28px;
    box-sizing:border-box;
    cursor: pointer;
  }
  .dwb-tip{
    font-style: normal;
    display: inline-block;
    color: #409eff;
    margin-left: 15px; 
    font-size:14px;
  }
</style>
