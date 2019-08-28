<template>
  <div class="select-address-box">
    <div class="select-address">
      <p class="text-tip">选择地址</p>
      <ul class="select-address-all">
        <li class="address-list" v-for="item in adressList" :key="item.id"  :class="{'out-range': item.supportDeliver === false}">
          <div class="self-select-box select-item" :class="{active: item.isSelected }" @click="bindSelectedAddress(item)">{{ item.receiveName + ' ' + item.stateName}}<span class="select-icon"></span></div>
          <div class="detail-address">
            <P class="content">
              <span>{{ item.cityName + ' ' + item.countyName + ' ' + item.townName + ' '}}</span> <span>{{item.detailAddress}}</span> <span>{{' ' + item.receiveMobile}}</span>
            </P>
            <P class="out-range-tip" v-if="item.supportDeliver === false">该地址不在门店配送范围类</P>
          </div>

        </li>
      </ul>
    </div>
    <div class="new-add" @click="bindNewAdd">
      <span class="el-icon-circle-plus"></span>新增
    </div>
    
    <div class="dialog-foot">
      <el-button type="primary" @click="bindConfirm()">确 定</el-button>
      <el-button @click="bindCancel()">取 消</el-button>
    </div>
  </div> 
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  export default {
    props: {
      pAddressList: {
        type: Array,
        default: function () {
          return []
        }
      },
      pFrom: {//1表示门店自提无收货地址，2表示门店配送无地址
        type: Number,
        default: 0
      }
    },
    components: {
    },
    created: function() { 
    },
    data() {
      return {
        adressList: JSON.parse(JSON.stringify(this.pAddressList))
      };
    },
    computed:{
      
    },
    watch:{
      pAddressList: {
        handler: function () {
          this.adressList = JSON.parse(JSON.stringify(this.pAddressList));
        },
        deep: true
      }
    },
    methods: {
       ...mapMutations([
          'IS_OPERATE_BILLING_PAGE'
       ]),
      ...mapActions([
        'initOrder', 
      ]),
      //绑定选择地址事件
      bindSelectedAddress(data) {
        if(data.supportDeliver === false)  {
          return false;
        }
        this.adressList.forEach((item,index) => {
          item.isSelected = 0;
          if(data === item) {
            data.isSelected = 1;
          }
        });
      },
      //绑定新增事件，最多可以添加20条，超出20条提示
      bindNewAdd() {
        if(this.adressList.length>=20) {
          this.$message({
            message: '已达上限，请联系服务台解决或者让顾客在国美线上平台修改！',
            type: 'warning'
          });
        }else {
          this.$emit('bind-add-new-address');
        }
      },
      //确定事件
      bindConfirm() {
        var selectItem = (this.adressList.filter(function (item) {
            return item.isSelected;
        }))[0];
        //调ajax
        var param = JSON.parse(JSON.stringify(this.$store.state.billingUsedParam));
        if(this.pFrom){
          param.sellerBillId = this.$store.state.billingInitData.sellerBillId;
        }
        if(this.pFrom == 2) {
          param.countyCode = selectItem.countyCode;
          param.deliveryType = 9;
        }
        param.address = {
          receiveName: selectItem.receiveName,
          receiveMobile: selectItem.receiveMobile,
          addressId: selectItem.addressId,
          townCode: selectItem.townCode,
          detailAddress: selectItem.detailAddress
        };
        API.saveAddress(param).then((data) => {
          if(data.success) {
            if(!this.pFrom) {
              this.initOrder(this);
            }
            this.IS_OPERATE_BILLING_PAGE(true);
            this.$emit('bind-confirm-select-address', {townCode: selectItem.townCode});
          }else {
            this.$message({
              showClose: true,
              message: data.respMsg + '（' + data.linkId + '）',
              type: 'warning'
            });
          }
          
        })

        
      },
      //取消事件
      bindCancel() {
        this.$emit('bind-cancel-select-address');
      }
    }
  };
</script>


<style lang="stylus"  scoped>
.select-address-box {
  position: relative;
  .new-add {
    position: absolute;
    top: -35px;
    right: 0;
    line-height: 24px;
    font-size: 16px;
    cursor: pointer;
    span {
      margin-right: 2px;
    }
  }
}
$b-c-g = #ccc;
.select-address {
  .text-tip {
    line-height: 32px;
    float: left;
    padding-left: 10px;
  }
}
.select-address-all {
  padding: 20px;
  padding-right: 0px;
  margin-left: 80px;
  max-height: 400px;
  overflow-y: auto;
  background: rgba(242, 242, 242, 0.498039215686275);
  .address-list {

    margin-bottom: 10px;
    overflow: hidden;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .select-item {
    float: left;
    width: 140px;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
    text-overflow: ellipsis;
  }
  .detail-address {
    float: left;
    width: 540px; 
    box-sizing: border-box;
    padding-left: 10px;
    .content {
      line-height: 32px;
    }
    span {
      display: inline-block;
      white-space: nowrap;
      max-width: 220px;
      overflow: hidden;
      vertical-align: middle;
      text-overflow: ellipsis;
    }
  }
  .out-range {
    .select-item {
      background: #ccc;
    }
    .content {
      line-height: 14px;
    }
    .out-range-tip {
      font-size: 12px;
      color: #f00;
    }
  }

}
.dialog-foot {
  text-align: center;
  margin-top: 20px;
}
</style>

