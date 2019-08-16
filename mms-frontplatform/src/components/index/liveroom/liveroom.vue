<template>
  <div class="lr-wrapper" :style="{ width: lrWidth }" v-if="authorizedPage">
    <div class="form-group mt20 clearfix">
      <label class="control-label fl col-left">关键KPI指标：</label>
      <div class="col-xs-3 col-sm-3">
        <el-date-picker
          v-model="datamonth"
          type="month"
          value-format="yyyy-MM"
          :picker-options="pickerEnd">
        </el-date-picker>
      </div>
    </div>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
    </el-row>
    <el-row class="cdata-list cdata-table clearfix">
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          新增注册会员
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="新增注册会员数量">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.registerQuantity || 0 }}</span>
      </el-col>
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          新增可营销会员
          <el-popover ref="s-pop2" placement="top" trigger="hover"
            content="可营销会员，包含：激活手机、激活邮箱、有token的用户数量">
          </el-popover>
          <el-button v-popover:s-pop2 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.marketingQuantity || 0 }}</span>
      </el-col>
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          新客转化率
          <el-popover ref="s-pop3" placement="top" trigger="hover"
            content="新客转化率=新增注册且购买的会员人数/新增注册会员人数*100%">
          </el-popover>
          <el-button v-popover:s-pop3 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.conversionRate || 0 }}</span>
      </el-col>
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          新增会员次日留存率
          <el-popover ref="s-pop4" placement="top" trigger="hover"
            content="新增会员次日留存率=前一天新增注册的会员且次日在网站上有行为的人数/前一天的新增注册会员人数*100%">
          </el-popover>
          <el-button v-popover:s-pop4 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.newNextRetainedRate || 0 }}</span>
      </el-col>
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          活跃会员次日留存率
          <el-popover ref="s-pop5" placement="top" trigger="hover"
            content="活跃会员次日留存率=前一天的活跃会员第二天在网站上有行为的人数/前一天的活跃会员人数*100%">
          </el-popover>
          <el-button v-popover:s-pop5 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.activeNextRetainedRate || 0 }}</span>
      </el-col>
      <el-col :span="4" class="cdata-item">
        <span class="c-count">
          月活数
          <el-popover ref="s-pop6" placement="top" trigger="hover"
            content="在一个月中访问过国美网站的独立用户数量（会员）">
          </el-popover>
          <el-button v-popover:s-pop6 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{ initData.monthLively || 0 }}</span>
      </el-col>
    </el-row>
    <div class="mt30 clearfix">
      <el-menu :default-active="activeIndex" class="el-menu-demo lr-menu" mode="horizontal" @select="handleSelect">
        <el-menu-item index="ALL">全部</el-menu-item>
        <el-menu-item index="PC">PC</el-menu-item>
        <el-menu-item index="WAP">WAP</el-menu-item>
        <el-menu-item index="APP">APP</el-menu-item>
        <el-menu-item index="STORE">门店</el-menu-item>
        <el-menu-item index="WCSP">小程序</el-menu-item>
      </el-menu>
    </div>
    <div class="chart-wrapper clearfix">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, key, index) in lineDataAll" :key="index" v-if="index > 0">
          <linechart v-bind:lineData="item" v-bind:name="key"></linechart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
.linechart-tit label{ font-size:13px; font-weight:bold; color:#333;}
.sub-tit{ display:block; margin-top:10px; color:#999; font-size:12px; font-family:'Arial';}
.tit-l{ display:inline; float:left; margin-left:12px; font-size:13px; font-weight:bold;}
.tit-r{ display:inline; float:right; margin-right:12px; text-align:center; font-size:20px; color:#ff0027;}
.sub-rate i{ font-size:16px;}
.el-main .lr-menu.el-menu .el-menu-item{ color:#000;}
.el-main .lr-menu.el-menu .el-menu-item:hover{ color:#2875cc;}
.el-main .lr-menu.el-menu .el-menu-item.is-active{ color: #2875cc!important;}
.el-main .lr-wrapper .el-input__inner{ height:30px;}
</style>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { queryDateKpis, pageAuthorized } from 'api/msgService'
import linechart from 'common/linechart'

export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      activeIndex: 'ALL',
      lrWidth: '',
      curIndex: 'ALL',
      datamonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      initData: {},
      lineDataAll: {},
      /** 今日后面月份不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          return new Date('2018-1-1').getTime() > time.getTime() || time.getTime() > Date.now()
        }
      }
    }
  },
  components: {
    'linechart': linechart
  },
  created () {
    this.lrWidth = parseInt(document.body.offsetWidth - 40) + 'px'
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_liveroom'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_liveroom
          if (_this.authorizedPage) {
            _this.init()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    init: function () {
      var _this = this
      queryDateKpis({
        selectDate: _this.datamonth
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          var allData = data.data
          _this.initData = allData
          allData.platformRDTOS.forEach(element => {
            _this.initData[element.platFormType] = element
          })
          _this.lineDataAll = _this.initData[_this.curIndex]
        } else {
          _this.initData = {}
          _this.lineDataAll = {}
        }
      })
    },
    handleSelect: function (key) {
      this.curIndex = key
      this.lineDataAll = this.initData[key]
    }
  },
  watch: {
    datamonth: function () {
      this.init()
    }
  }
}
</script>
