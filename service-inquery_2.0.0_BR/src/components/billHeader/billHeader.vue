<template>
  <div class="bill-header">
    <el-row class="operator-switch">
      <el-col :span="24">
        <el-row class="operator-info" v-if="operator">
          <el-col :span="22">
            <span class="operatorCode operatorName">营业员：{{sellerNum}}&nbsp;&nbsp;<span :title="sellerName">{{sellerName}}</span></span>
            &nbsp;&nbsp;<span class="" v-show="tabOperatorShow"><el-button @click="tabOperator">切换</el-button></span>
          </el-col>
        </el-row>
        <div class="operator-info" v-else>
          <el-col :span="2">
            营业员：
          </el-col>
          <el-col :span="9">
            <el-input v-model="operatorCode" placeholder="请输入编号" @click="insertOperatorCode">
              <el-button type="primary" slot="append" @click="insertOperatorCode" :disabled="insertOperatorDisabled">确定</el-button>
            </el-input>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <div class="bill-search-box">
      <el-row>
        <el-col :span="4">
          <div class="logo">
            <router-link :to="{path:logoUrl}"><img src="../../assets/images/lg-logo.png" alt=""></router-link>
          </div>
        </el-col>
        <template v-if="isShowSearch">
          <el-col :span="12" class="search-box">
            <el-input size="small" placeholder="输入商品名称/编码" v-model="$store.state.skuNoSearchKeyWord" @keyup.enter.native="skuNoSearch" clearable>
              <el-button slot="append" type="primary" @click="skuNoSearch">搜索</el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <div class="bill-order-box" v-clickoutside="handleOrderClose">
              <span class="order-btn" @click="orderBtnClick">导购单 <i class="order-btn-ico"></i></span>
              <div class="order-list" v-show="orderListShow">
                <div class=""><i class="el-icon-star-on"></i>会员选择</div>
                <div class="order-list-search">
                  <el-input size="small" :placeholder="'搜索' + orderTip" v-model="goodInfoTel" @keyup.enter.native="listSearch" clearable>
                    <el-button slot="append" type="primary" @click="listSearch" @keyup.enter="listSearch">搜索</el-button>
                  </el-input>
                </div>
                <div class="order-list-res">
                  <div class="order-list-res-tit" v-if="orderListTelShow">近期加购物车会员：</div>
                  <div class="order-list-res-tab">
                    <BillHeaderList :listData="headerListData"></BillHeaderList>
                  </div>

                  
                  <div class="order-pagination-box" v-if="totalNum>0">
                    <el-pagination
                      @current-change="handleCurrentChange"
                      layout="prev, pager, next"
                      :current-page.sync="currentPage"
                      :page-size="size"
                      :total="totalNum">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from '@/api/pushed_list/pushed_list'
import BillHeaderList from '../billHeader/billHeaderList.vue'
import { Loading } from "element-ui"
import { mapState, mapMutations, mapGetters, mapActions } from  'vuex'
export default {
  components:{
    BillHeaderList
  },
  created:function(){
    //进入页面首先获取导购员信息
    API.getLoginUserInfo().then((data) => {
      if(data.success){
        this.sellerNum = data.response.sellerNum//员工编号
        this.storeCode =  data.response.storeCode//门店编码
        this.sellerName = data.response.sellerName//员工姓名
        this.SET_BILLING_USED_PARAM({attr: 'sellerNum', value: data.response.sellerNum});
        this.SET_BILLING_USED_PARAM({attr: 'storeCode', value: data.response.storeCode});
        this.$emit('bind-header');
      }else{
        if(data.linkId && data.respCode !== "logic.user.positionInfo"){
          this.$message({
            showClose: true,
            message: (data.respMsg || "获取登陆人信息失败！") + '（' + data.linkId + '）',
            type: 'warning'
          })
        }
      }
    })

  },
  props:{
    /*operatorSwitchShow:{
      type: Boolean,
      required: true
    }*/
    isShowSearch: {
      type: Boolean,
      default: true
    },
    type: {//type 为0时 logo链接默认是搜索页，为1时为定金充值页，为2时为积分充值页，为3时为全额定金提前发货
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      operator:true,//显示导购员信息 2018-6-29 切换导购员功能暂时不做了
      tabOperatorShow:false,//是否显示切换导购员按钮功能
      sellerNum:"",//员工编号
      storeCode:"",//门店编码
      sellerName:"",//员工姓名
      operatorCode:"",//默认的营业员编码
      //goodInfoCode:"",//商品编码
      goodInfoTel:"",//会员手机号
      orderListShow:false,//导购单是否展示
      orderListTelShow:true,//导购单展示近期会员还是展示单个手机号查询结果
      insertOperatorDisabled:false,
      headerListData:{
        list:[],
        nodata:""
      },
      size: 6,//每页展示多少条
      currentPage: 1,//当前在第几页
      orderTip:'会员/商品编码',//导购单的placeholder提示
      totalNum: 0 //总共有多少条
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
  computed:{
    ...mapState({

    }),
    logoUrl() {
      if(this.type == 1) {
        return '/service/depositDouble/';
      }else if(this.type == 2) {
        return '/service/buyPoints/';
      }else if(this.type == 3) {
        return '/service/fullDeposit/';
      }else {
        return '/service/pushedList/';
      }
    }
  },
  methods:{
    ...mapMutations({
      SET_BILLING_USED_PARAM: 'SET_BILLING_USED_PARAM'
    }),
    //切换 输入导购员code
    insertOperatorCode(){
      let params = {},_this = this
      params.sellerNum = this.operatorCode
      this.insertOperatorDisabled = true //防止连续点击
      API.changeSeller(params).then(function(res){
        if(res.success){
          _this.sellerNum = _this.$store.state.sellerNum = _this.operatorCode
          _this.operator = true
        }else{
          _this.popMessage(res.respMsg || "切换失败")
          setTimeout(()=>{
            _this.operator = true
            _this.insertOperatorDisabled = false
          },3000)
        }
      })
    },
    tabOperator(){
      this.operatorCode = this.$store.state.sellerNum
      this.operator = false
      this.insertOperatorDisabled = false
    },
    //搜索商品编码
    skuNoSearch(){
      //this.$store.state.skuNoSearchKeyWord = this.goodInfoCode
      // if(!this.$store.state.skuNoSearchKeyWord.length){
      //   this.popMessage("搜索词不能为空！")
      //   return
      // }
      this.$router.push('/service/pushedList')
      this.$emit("skuNoSearch")
    },
    //搜索会员手机号
    listSearch(){
      var rep = /^[a-zA-Z\d\u4e00-\u9fa5]+$/
      this.goodInfoTel = this.goodInfoTel.trim();
      if(!this.goodInfoTel.length){
        this.popMessage('搜索内容不能为空')
        return
      }
      if(!rep.test(this.goodInfoTel) && this.goodInfoTel.length){
        this.popMessage('请输入正确的' + this.orderTip)
        return
      }
      if(this.goodInfoTel.length>20) {
        this.popMessage('搜索内容超出长度限制')
        this.goodInfoTel = this.goodInfoTel.substring(0,20);
      }
      this.currentPage = 1;
      this.queryCustomerCards()
    },
    //切换近期加购物车会员时间段
   /*  handleClick(tab, event) {
      this.queryCustomerCards()
    }, */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryCustomerCards();
    },

    queryCustomerCards(){
      //判断哪个时间段
      let _this = this
      this.headerListData.list = []
      this.headerListData.nodata = ""
      var rep = /[\u4e00-\u9fa5]+/
      let fuse = '';
      if(this.goodInfoTel) {
        fuse = rep.test(this.goodInfoTel) ? encodeURI(this.goodInfoTel) : this.goodInfoTel
      }
      
      let params = {
        perNum: this.size,
        next: this.currentPage,
        sort: 0,//默认为0（0为时间降序，1为升序）
        fuse: fuse //会员手机号临时卡
      }
      this.orderListTelShow = (!this.goodInfoTel.length ? true : false)
      API.queryCustomerCards(params).then((res)=>{
        this.orderListShow = true
        let loadingInstance = Loading.service({
            text: '加载中',
            target: document.querySelector(".order-list-res-tab")
        })
        let timer = null
        clearTimeout(timer)
        if(res.success){
          loadingInstance.close()
          timer = setTimeout(()=>{
            if(res.response){
              _this.headerListData.list = res.response.memberCards
              if(res.response.pagination) {
                
                this.totalNum = res.response.pagination.totalNum || 0;
              }else {
                this.totalNum = 0;
              }
              if(!_this.headerListData.list.length){
                _this.headerListData.nodata = "抱歉，没有找到相关内容"
              }else{
                _this.headerListData.nodata = ""
              }
            }else{
              _this.headerListData.nodata = "抱歉，没有找到相关内容"
            }
          },500)
        }else{
          loadingInstance.close()
          this.totalNum = 0;
          timer = setTimeout(()=>{
            _this.headerListData.nodata = res.respMsg || "抱歉，没有找到相关内容"
          },500)
        }
      })
    },
    //弹窗
    popMessage(message){
      this.$message({
        message:message,
        type: 'warning'
      })
    },
    //导购单点击空白关闭
    handleOrderClose(e) {
      this.orderListShow = false
      this.goodInfoTel = ""//清空手机号
      this.currentPage = 1;
    },
    //点击展示导购单
    orderBtnClick(){
      this.goodInfoTel = ""//清空手机号
      this.currentPage = 1;
      API.searchType().then((res)=>{
        if(res.success) {
          this.orderTip = '会员/商品编码'
          if(res.response) {
            if(res.response.searchType == 0) {
              this.orderTip = '会员/商品编码/导购员编号'
            }
          }
          this.queryCustomerCards()
        }else {
          this.$message({
            showClose: true,
            message: res.respMsg + '（' + res.linkId + '）',
            type: 'warning'
          });
        }
      })
      
    }
  }
}
</script>
<style>
.bill-search-box .order-pagination-box {margin-top: 5px;}
.bill-search-box .order-pagination-box .el-pagination { text-align: right;}
</style>


<style lang="stylus" scoped>
.el-input-group__append button
  border-radius 0px 3px 3px 0px
.el-row
  margin-bottom 5px
.row-bg
  padding 10px 0
  background-color #f9fafc
.center
  text-align center

.bill-header
  font-size 12px
  min-width 900px
  margin 0 auto
  padding 10px 20px
  border 1px solid #ccc
  border-bottom 1px solid #f2f2f2
  margin-bottom -1px
  box-sizing border-box
  .operator-switch
    height 16px
    .operator-info
      display flex
      align-items center
      font-size 12px
      .operatorCode
         max-width 500px
         overflow hidden
         text-overflow ellipsis
         white-space nowrap
         display inline-block
.bill-search-box
  position relative
  .logo
    width 204px
    height 64px
  .search-box
    display flex
    align-items center
    height 64px
    padding-left 100px

  .bill-order-box
    position relative
    .order-btn
      position absolute
      right 0px
      top 22px
      cursor pointer

    .order-list
      position absolute
      z-index 99
      right 0px
      top 50px
      width 100%
      background #ffffff
      border 1px solid #ccc
      padding 15px 15px 10px
      .order-list-search
        margin 10px 0
        button
          background #409EFF
          color #fff
      .el-icon-star-on
        color #409EFF
        margin-right 5px
      .order-list-res
        .order-list-res-tit
          margin 5px 0 0
          font-weight bold

.order-btn-ico
  display inline-block
  width 0
  height 0
  border-left 4px solid transparent
  border-right 4px solid transparent
  border-top 8px solid #333
</style>
<style lang="stylus">
.el-header
  height auto !important
.operator-info .el-input-group__append,.search-box .el-input-group__append
  background-color #409eff
  color #fff
</style>

