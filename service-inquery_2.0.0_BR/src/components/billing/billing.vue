<template>
  <el-container class="billing-el-container">
    <el-header class="billing-el-header">
      <BillHeader @bind-header="bindHeader"></BillHeader>
    </el-header>
    <el-main style="padding: 0px;overflow:visible; min-height: 550px;">
      <div class="only-presell-pool" v-if="goodsData.onlyPresellFlag == 1 && goodsData.poolFlag==1">
        <p>联营门店不支持预售商品开单</p>
        <p><el-button type="primary" @click="$router.push('/service/pushedList')">返回上一页</el-button></p>
      </div>

      <div class="billing-container" v-else>
        <div class="member-title" v-if="!billingEdit">*会员选择</div>
        <div class="deal-member-box" v-if="!isShowBillingInfo && !isClick">
          <div class="deal-member">
            <div class="input-member clearfloat" v-clickoutside="bindMemberClose">
              <el-input size="small"
                placeholder="请输入手机号/会员卡号"
                maxlength="30"
                v-model="memberNo"
                @focus="bindPhoneFocus"
                @keyup.native="bindInputMemberInfo($event)"
                clearable>
               </el-input>
              <el-button type="primary" @click="bindQueryMemberInfo">查找</el-button>
              <el-card class="select-member-panel"  v-show="memberPanelShow">
                <div class="open-card" v-if="!memberData">
                  <p>此会员卡号未注册，</p>
                  <p v-if="LOGINDATA.service_billing_opencard">请<a :href="memberNewlyBuildUrl" target="blank">点击开卡</a></p>
                </div>

                <template v-if="memberData">
                  <div class="open-card"  style="width: 230px;"  v-if="memberData.isNeedUp == 1">
                    <p>此会员卡号需升级，请去服务台处理</p>
                  </div>
                  <div class="open-card" style="width: 230px;"  v-else>
                    <p>此会员卡已冻结，请去服务台处理</p>
                  </div>
                </template>
              </el-card>
              
            </div>
            <div class="temporary-card" v-if="isShowTemporaryCard" @click="bindTemporaryCard">使用临时卡</div>
          </div>

          <p class="verify-error" v-if="errorMemberNoTip">{{errorMemberNoTip}}</p>

          <div class="goods-info-box" v-if="goodsData">
            <GoodsInfo 
            :pGoodsData="goodsData" 
            :isShowNumPrice="false"
            :isFullDeposit="productType == 6 ? true : false"
            ></GoodsInfo>
          </div>
        </div>
        <template v-if="isShowBillingInfo">
          <EditBilling 
            :memberData="memberData"
            :goodsInfo="goodsData"
            :isRetBindOpCard="isRetBindOpCard"
            @bind-switch-member="bindSwitchMember"
            ></EditBilling>
        </template>
        
      </div>
      
      

    </el-main>
  </el-container>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import ENV from '@/api/env';
  import BillHeader from '@/components/billHeader/billHeader';
  import EditBilling from '@/components/billing/editBilling';
  import GoodsInfo from '@/components/billing/goodsInfo';
  export default {
    components: {
      BillHeader,
      GoodsInfo,
      EditBilling
    },
    created: function() {
      //重置，因为从其它页面过来需要把vuex里的数据重置
      this.BILLING_INIT_NUM(0);
      this.IS_OPERATE_BILLING_PAGE(false);
      this.BILLING_EDIT(false);
      this.SET_BILLING_INIT_DATA({});
      //请求ajax获取到开单首页的商品信息
      var skuNo = this.$route.query.skuno || this.$route.query.skuNo;

      //如果存在表示是全额订金商品
      var lablePrice = this.$route.query.basePrice, supplierCode,activityPrice,priceDate;
      if(lablePrice) {
        supplierCode = this.$route.query.supplierCode;
        activityPrice = this.$route.query.activityPrice;
        priceDate = Number(this.$route.query.timestamp);
      }

      this.SET_FULLDEPOSIT({
        price: activityPrice || '',
        supplier: supplierCode || ''
      });

      if(skuNo) {
        //请求ajax获取商品信息
        API.getSkuInfo({
          skuNo: skuNo.trim()
        }).then((data) => {
          if(data.success) {
            if (data.response != null) {
              this.goodsData = data.response;
              if(lablePrice)  {//表示全额订金
                this.goodsData.priceTagPrice = lablePrice
                this.goodsData.supplierCode = supplierCode
                this.goodsData.activityPrice = activityPrice
                this.goodsData.priceDate = priceDate
              }
              if(this.goodsData.onlyPresellFlag == 1 ) {//表示仅预售
                this.productType = 1;
              }else if(this.goodsData.protocolId) {//5运营商开票
                this.productType = 5;
              }else if(this.goodsData.priceTagPrice) {//6表示全额订金
                this.productType = 6;
              }
            }
          }else {
            this.ajaxMessageTip(data);
          }
        })
      }
    },
    data() {
      return {
        memberNo: '',//会员卡号/手机号
        errorMemberNoTip: "",//手机号校验错误提示语
        memberPanelShow: false,
        memberNewlyBuildUrl: 'http://mpf' + ENV.cookieDomain + '/member/memberNewlyBuild',//开卡地址
        isShowBillingInfo: false,//是否展示开单信息，就是选择会员或临时卡之后的面板
        memberData: null,//会员信息初始化时是null
        goodsData:{},//商品信息数据
        isClick: true,//是否可点击，等头部接口请求完了之后再请点击去请求会员的信息
        noImg: '../../assets/images/noImg.png',
        redemptionParam: {},//加价换购参数信息，在导购车里存入cookie
        productType: 0,//0普通,2套装,1预售,4加价换购,5运营开票，6表示全额定金
        isRetBindOpCard: false//运营商是否重复绑定手机号，在开单的时候如果重复绑定需要提示
      };
    },
    computed: {
      ...mapState([
        'LOGINDATA',
        'billingEdit',
        'billingUsedParam',
      ]),

      //是否显示临时卡
      isShowTemporaryCard() {
        if(this.goodsData.onlyPresellFlag == 1 ) {//仅预售隐藏临时卡
          return false;
        }
        if(this.productType == 6) {//全额订金隐藏临时卡，全额订金用它的价签价来判断
          return false;
        }

        return true;
      }
    },

    watch: {},
    methods: {
      ...mapMutations([
        'BILLING_EDIT',
        'SET_BILLING_USED_PARAM',
        'IS_OPERATE_BILLING_PAGE',
        'SET_BILLING_INIT_DATA',
        'BILLING_INIT_NUM',
        'SET_EDIT_NEED_PARAM',
        'SET_FULLDEPOSIT'
      ]),

      ...mapActions([
        'initOrder'
      ]),

      //头部接口调用自定义事件
      bindHeader() {
        let id = this.$route.params.id;
        this.isClick = false;
        if(id == 'edit') {
          this.isShowBillingInfo = true;
          this.BILLING_EDIT(true);

          for(var attr in this.$route.query) {
            if(attr == 'sellerBillId' || attr == 'sellerCartId') {
              this.SET_EDIT_NEED_PARAM({attr: attr, value: this.$route.query[attr]})
            }else {
              this.SET_BILLING_USED_PARAM({attr: attr, value: this.$route.query[attr]});
            }
          }
          return false;
        }else if(id == 'redemption') {//表示加价换购
          this.isShowBillingInfo = true;
          this.productType = 4;
          
          let redemptionParam = localStorage.getItem('redemptionParam');
          this.redemptionParam = redemptionParam ? JSON.parse(decodeURIComponent(redemptionParam)) : {};
          if(this.redemptionParam.temporaryCardFlag != 0) {
            this.setMemberInfo({
                memberId: this.redemptionParam.memberId,
                memberCard: this.redemptionParam.memberCard,
                temporaryCardFlag: this.redemptionParam.temporaryCardFlag
            })
            this.addToBill();
          }else {
            //加价换购再单独查一下查询会员接口，为获得地址信息
            API.queryMemberCardList({
              cardKey: this.redemptionParam.memberCard
            }).then((data) => {
              if(data.success) {
                if (data.response != null) {
                  var response = data.response;
                  this.memberData = response;
                
                  if(response.isNeedUp > 0) {//需要升级,以及冻结
                    this.ajaxMessageTip({respMsg: '账号异常，请去服务台查询解决'})
                  }else {
                    let memberCardInfo = data.response.memberCardInfo;
                    this.setMemberInfo({
                        memberId: memberCardInfo.memberId,
                        memberCard: memberCardInfo.memberCardId,
                        temporaryCardFlag: 0
                    })
                    
                    this.addToBill();
                  }
                }else {
                  this.ajaxMessageTip({respMsg: '账号异常，请去服务台查询解决'})
                }
              }else {
                this.ajaxMessageTip(data);
              }
            })
          }
        }
      },

      //绑定输入会员信息，只能输入1-18位数字
      bindInputMemberInfo(ev) {
        if(ev.keyCode == 13) {//回车事件
          this.bindQueryMemberInfo();
          return false;
        }
        this.memberPanelShow = false;
        //校验规则只能输入1-30位数字
        var re = /[^\d]/g;
        if(re.test(this.memberNo)) {
          this.memberNo = this.memberNo.replace(re,'');
        }
      },

      //查询会员信息及校验，校验规则只能输入1-18位数字
      bindQueryMemberInfo() {
        var re = /[^\d]/g;
        this.memberPanelShow = false;

        //校验输入的会员或手机号
        if(!this.memberNo || re.test(this.memberNo)) {
          this.memberNo = '';
          this.errorMemberNoTip = '请输入正确的手机号/会员卡号';
          return false;
        }
        if(this.memberNo.length>30) {
          this.memberNo = '';
          this.errorMemberNoTip = '会员卡号不能超过30位';
          return false;
        }

        this.errorMemberNoTip = '';
        
        //请求ajax获取到会员的信息
        API.queryMemberCardList({
          cardKey: this.memberNo
        }).then((data) => {
          if(data.success) {
            if (data.response != null) {
              var response = data.response;
              this.memberData = response;
             
              if(response.isNeedUp > 0) {//需要升级,以及冻结
                this.memberPanelShow = true;
              }else {
                let memberCardInfo = data.response.memberCardInfo;
                this.setMemberInfo({
                    memberId: memberCardInfo.memberId,
                    memberCard: memberCardInfo.memberCardId,
                    temporaryCardFlag: 0
                })
                
                this.addToBill();
              }
            }else {
              this.memberPanelShow = true;
              this.memberData = data.response;
            }
          }else {
            this.ajaxMessageTip(data);
          }
        })
      },

      //获取焦点让错误提示隐藏
      bindPhoneFocus() {
        this.memberPanelShow = false;
        this.errorMemberNoTip = '';
      },
      //选择会员面板消失
      bindMemberClose(e) {
        this.memberPanelShow = false;
      },
      //绑定临时卡片事件，请求ajax获取到临时卡数据
      bindTemporaryCard() {
        //请求ajax获取到临时卡的信息
        var usedParam = this.billingUsedParam;
        API.addTempCard({
          sellerNum: usedParam.sellerNum,
          storeCode: usedParam.storeCode,
        }).then((data) => {
          if(data.success) {
            if (data.response != null) {
              let response = data.response;
              this.setMemberInfo({
                memberId: response.memberId,
                memberCard: response.tempCardId,
                temporaryCardFlag: 1
              })
              this.addToBill();
            }
          }else {
            this.ajaxMessageTip(data);
          }
        })
      },
      //切换自定义事件
      bindSwitchMember() {
        this.isShowBillingInfo = false;
        this.memberData = null;
        this.memberNo = '';
        this.BILLING_INIT_NUM(0);
      },

      //调用添加导购车方法， 有三处如果修改需要修改三处，还有两处在保存选择参库和保存选择套装处
      addToBill() {
        let memberData = this.memberData, address;
        
        let param = {
          ...this.billingUsedParam,
          addToBillNormalPDTO: {
            operatorType: 'add',
            deliverWay: this.productType != 4 && this.productType != 5 ? 0 : 1,//初始化的时候配送方式，默认是国美配送，加价换购是自提，其它添加导购单从大load中获取
            productType: this.productType,//初始化化默认传0普通，预售是1，套装是2，加价换购是4, 运营商开票5，6表示全额订金
            promotionId: this.goodsData.promotionId ? this.goodsData.promotionId : '',
            protocolId: this.goodsData.protocolId || '',//是运营商商品时需要传递
            hasGiftOperator: this.goodsData.hasGiftOperator || '',//是否有运营商卡
            skuInfo: [
              {skuNo: this.$route.query.skuno || this.$route.query.skuNo}
            ]
          },
          siteType: this.goodsData.onlyPresellFlag == 1 ? 2 :1//如果是仅预售站点是2，其它先默认为1
        }

        if(this.productType == 6) {
          param.addToBillNormalPDTO.lablePrice = this.goodsData.lablePrice;
          param.addToBillNormalPDTO.supplierCode = this.goodsData.supplierCode;
          param.addToBillNormalPDTO.priceDate = this.goodsData.priceDate;
        }
        
        //从会员卡信息中取的，没有不用传，其它从大load中获取
        if(memberData &&  memberData.memberCardInfo && memberData.memberCardInfo.address) {
          address = memberData.memberCardInfo.address;
        }

        if(this.productType == 4) {
          param.jjhgGiftPDTO = this.redemptionParam.jjhgGiftPDTO;
          param.addToBillNormalPDTO.skuInfo = this.redemptionParam.skuInfo;
          if(this.billingUsedParam.temporaryCardFlag == 1) {
            address = this.redemptionParam.address||null;
          }
        }
        if(address) {
          param.addToBillNormalPDTO.address = {
            receiveName: address.receiveName,
            receiveMobile: address.receiveMobile,
            addressId: address.addressId,
            townCode: address.townCode,
            detailAddress: address.detailAddress
          };
        }

        //加入导购车接口
        API.addToBill(param).then((data) => {
          if(data.success) {
            this.SET_BILLING_USED_PARAM({
              attr: 'siteType',
              value: data.response.siteType || 1
            });

            this.isRetBindOpCard = data.response.bindCard;//运营商是否重复绑定手机号，在开单的时候如果重复绑定需要提示

            this.memberPanelShow = false;
            this.isShowBillingInfo = true;
            this.initOrder(this);
          }else {
            if(data.code == '0210020027') {
               this.$confirm(data.respMsg || '该商品仅支持预售，不支持换购', '提示', {
                  confirmButtonText: '知道了',
                  type: 'warning',
                  showCancelButton: false,
                }).then(() => {
                  this.$router.go(-1);
                }).catch(() => {
                });
            }else {
              this.ajaxMessageTip(data);
            }
          }
        })

      },

      //接口错误提示
      ajaxMessageTip(data) {
        this.$message({
          showClose: true,
          message: data.respMsg + (data.linkId ? '（' + data.linkId + '）' : '' ),
          type: 'warning'
        });
      },

      //将会员信息存入vuex
      setMemberInfo(data) {
        for(let attr in data) {
          this.SET_BILLING_USED_PARAM({attr: attr, value: data[attr]});
        }
      }

    },
    directives:{
      clickoutside:{
        // 点击空白下拉列表消失事件
        bind(el, binding, vnode) {
          function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
          }
          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
        }
      },
      onfocus:{
        inserted:function(el){
          el.focus()
        }
      }
    },
  };
</script>

<style lang="stylus"  >
  $b-c-g = #ccc;
  a {
    text-decoration: none;
  }
  .clearfloat:after {
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0
  }
  
  .el-container {
  }
  .el-main {
  }
  .billing-tip {
    padding: 6px;
    line-height: 1;
  }
  .billing-dialog .el-input--small .el-input__inner,.billing-container .el-input--small .el-input__inner {
    height: 28px;
    line-height: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }

  .billing-container {
    .el-dialog__body {
      padding-top: 0;
    }

    margin: 0 auto;
    .deal-member {
      .el-input {
        width: 520px;
        float: left;
      }
      .el-input--small .el-input__inner {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

      }
      .el-button {
        float: left;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        padding-top: 0;
        padding-bottom: 0;
        line-height: 28px;
        height: 28px;
        box-sizing: border-box;
      }
    }
    .preferential-box {
      line-height: 40px;
      position: relative;
      [class*=" el-icon-"], [class^=el-icon-] {
        font-size: 16px;
        vertical-align: middle;
      }
      .preferential-tip {
        position: absolute;
        left: 0;
        top: 0;

      }
      .preferential-content {
        padding-left: 56px;
        .click-btn {
          padding: 0 20px;
          display: inline-block;
          cursor: pointer;
        }
        .selected-show {
          display: inline-block;
          border: 1px solid #fff;
          box-sizing: border-box;
          line-height: 30px;
          padding: 0 5px;
          cursor: pointer;
          margin-left: 14px;
          &:hover {
            border-color: $b-c-g;
          }
        }
      }
    }

    .input-address {
      line-height: 18px;
      margin-bottom: 10px;
      box-sizing: border-box;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 4px 15px;
      min-height: 28px;
    }
  }
  .edit-billing-info-box {
    .preferential-box, .main-address, .labels,.goods-info .suits-box .more, .suits-box, .goods-desc {
      color: #999;
    }
    .note-box .preferential-box {
      color: #303133;
    }
  }


</style>

<style lang="stylus"  scoped>
  $b-c-g = #ccc;
  $a-c = #409EFF;
  .verify-error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 12px;;
    text-align: left;
    margin-top: 5px;
  }

  .billing-el-header {
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
  }

  .billing-el-container {
    padding: 0;
    min-width: 900px;
    width: 100%;
  }

  .billing-container {

    box-sizing: border-box;
    padding: 20px;
    font-size: 14px;
    min-height: 400px;
    border: 1px solid $b-c-g;
    box-sizing: border-box;
  }

  .member-title {
    line-height: 14px;
    margin-bottom: 15px;
  }
  .deal-member-box {
    position: relative;
  }
  .deal-member {
    height: 28px;
  }
  .input-member {
    position: relative;
    width: 600px;
    float: left;
  }
  .temporary-card {
    float: left;
    line-height: 32px;
    cursor: pointer;
    color: $a-c;
  }

  .select-member-panel {
    z-index: 10;
    position: absolute;
    left: 0;
    top: 29px;
    width: 520px;
    max-height: 400px;
    a {
      color: $a-c;
    }
  }

  .select-member {
    .item {
      font-size: 12px;
      line-height: 1;
      padding: 10px 0;
      border-bottom: 1px solid $b-c-g;
      a {
        float: right;
        text-decoration: none;
      }
    }
    .item:first-of-type {
      padding-top: 0;
    }
  }

  .open-card {
    line-height: 20px;
    padding: 20px 0;
    width: 130px;
    margin: 0 auto;
  }
  .goods-info-box {
    margin-top: 20px;
    padding-top: 20px;
    padding-left: 20px;
    border-top: 1px solid $b-c-g;
  }

  .only-presell-pool {
    border: 1px solid #ccc;
    min-height: 400px;
    text-align: center;
    padding-top: 130px;
    box-sizing: border-box;
    p {
      margin-top: 20px;
    }

  }

</style>

