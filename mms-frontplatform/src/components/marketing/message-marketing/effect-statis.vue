<template>
  <div class="es-wrapper pb50 clearfix"  :style="{ width: esWidth }" v-if="authorizedPage">
    <div class="mt20 clearfix">
      <el-select class="w160 mm-select-time" v-model="queryData.fixedTime">
        <el-option value="0" label="昨天"></el-option>
        <el-option value="1" label="近3天"></el-option>
        <el-option value="2" label="近7天"></el-option>
        <el-option value="3" label="近30天"></el-option>
        <el-option value="4" label="自定义时间"></el-option>
      </el-select>
      <el-date-picker :style="'width:160px'"
        v-show="queryData.fixedTime == 4"
        v-model="queryData.startTime"
        type="date"
        size="small"
        :editable="false"
        :clearable="false"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerStart">
      </el-date-picker>
      <el-date-picker :style="'width:160px'"
        v-show="queryData.fixedTime == 4"
        v-model="queryData.endTime"
        type="date"
        size="small"
        :editable="false"
        :clearable="false"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerEnd">
      </el-date-picker>
      <el-button class="btn btn-primary ml10" v-if="authorizedData.mms_marketing_query_note" @click="effectSearch">查询</el-button>
    </div>
    <div class="mt15 clearfix">
      <a class="btn btn-primary" :style="'padding:8px 12px; line-height:1'" v-if="authorizedData.mms_marketing_importfrom_note" @click="effectDown">导出报表</a>
    </div>
    <div class="cdata-wrapper clearfix">
      <div class="cdata-tit">短信发送效果</div>
      <el-row class="cdata-list cdata-table">
        <el-col :span="4" class="cdata-item">
          <span class="c-count">目标人次
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="目标人次：计划发送短信的用户ID数量">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.sendNumber || 0 }}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">实发人次
            <el-popover ref="s-pop2" placement="top" trigger="hover"
              content="实发人次：实际发送短信的用户ID已激活手机的数量">
            </el-popover>
            <el-button v-popover:s-pop2 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.successNumber || 0 }}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">短信发送量
            <el-popover ref="s-pop3" placement="top" trigger="hover"
              content="短信发送量：实际计划发送短信的数量">
            </el-popover>
            <el-button v-popover:s-pop3 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.smsQuantity || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">发送成功量
            <el-popover ref="s-pop4" placement="top" trigger="hover"
              content="发送成功量：实际发送成功的短信的数量">
            </el-popover>
            <el-button v-popover:s-pop4 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.smsSuccessQuantity || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">发送成功率
            <el-popover ref="s-pop5" placement="top" trigger="hover"
              content="发送成功率：发送成功率=发送成功量/短信发送量*100%">
            </el-popover>
            <el-button v-popover:s-pop5 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.smsSuccessRate || 0 }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="cdata-wrapper clearfix">
      <div class="cdata-tit">直接效果</div>
      <el-row class="cdata-list cdata-table">
        <el-col :span="2" class="cdata-item">
          <span class="c-count">UV
            <el-popover ref="s-pop21" placement="top" trigger="hover"
              content="UV：按日去重癿独特访客数，PC、WAP端一般通过使用癿浏览器cookie来标识，APP端通过设备IMEI或MAC地址来标识">
            </el-popover>
            <el-button v-popover:s-pop21 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.uv || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">有效UV
            <el-popover ref="s-pop22" placement="top" trigger="hover"
              content="有效UV：页面浏览量大于1的独特访客数">
            </el-popover>
            <el-button v-popover:s-pop22 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.validUv || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">UV有效率
            <el-popover ref="s-pop23" placement="top" trigger="hover"
              content="UV有效率：有效UV占总UV的百分比，UV有效率=有效UV/UV">
            </el-popover>
            <el-button v-popover:s-pop23 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.validUvRate || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">UV打开率
            <el-popover ref="s-pop24" placement="top" trigger="hover"
              content="UV打开率：UV占实发人数的百分比，UV打开率=UV数/实发人次*100%">
            </el-popover>
            <el-button v-popover:s-pop24 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.uvRate || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">加入购物车次数
            <el-popover ref="s-pop25" placement="top" trigger="hover"
              content="加入购物车次数：用户在商品详情页点击加入购物车按钮并跳转到加入购物车成功页的次数（包含PC\WAP\APP）">
            </el-popover>
            <el-button v-popover:s-pop25 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.addCartQuantity || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">跳出率
            <el-popover ref="s-pop211" placement="top" trigger="hover"
              content="跳出率：用户只访问了一个页面便直接离开网站的访问占比，跳出率=跳出次数/访问">
            </el-popover>
            <el-button v-popover:s-pop211 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.jumpRate || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">下单人数
            <el-popover ref="s-pop26" placement="top" trigger="hover"
              content="下单人数：实发人数中产生的订单人数（产生订单号的主订单数量的人数）">
            </el-popover>
            <el-button v-popover:s-pop26 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.paymentNumber || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">订单量
            <el-popover ref="s-pop27" placement="top" trigger="hover"
              content="订单量：产生订单号的订单数量（毛订单量）">
            </el-popover>
            <el-button v-popover:s-pop27 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.orderQuantity || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单转化率
            <el-popover ref="s-pop28" placement="top" trigger="hover"
              content="订单转化率：订单转化率=订单量/UV数*100%">
            </el-popover>
            <el-button v-popover:s-pop28 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.orderRate || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">销售额
            <el-popover ref="s-pop29" placement="top" trigger="hover"
              content="销售额：产生订单号的订单销售额（毛销售额）">
            </el-popover>
            <el-button v-popover:s-pop29 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.salesVolume || 0 }}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">客单价
            <el-popover ref="s-pop210" placement="top" trigger="hover"
              content="客单价：客单价=销售额/订单量">
            </el-popover>
            <el-button v-popover:s-pop210 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.customerPrice || 0 }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="cdata-wrapper clearfix">
      <div class="cdata-tit">近3天间接效果</div>
      <el-row class="cdata-list cdata-table">
        <el-col :span="3" class="cdata-item">
          <span class="c-count">响应人数
            <el-popover ref="s-pop31" placement="top" trigger="hover"
              content="响应人数：近3天发送过营销短信并活跃的会员人数">
            </el-popover>
            <el-button v-popover:s-pop31 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.responseNumberIE || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">响应率
            <el-popover ref="s-pop32" placement="top" trigger="hover"
              content="响应率：近3天发送过营销短信并活跃的会员人数占比，响应率=响应人数/短信实发人数">
            </el-popover>
            <el-button v-popover:s-pop32 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.responseRate || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">下单人数
            <el-popover ref="s-pop33" placement="top" trigger="hover"
              content="下单人数：近3天发送过营销短信的所有用户，有效订单的总人数">
            </el-popover>
            <el-button v-popover:s-pop33 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.paymentNumberIE || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">发送转化率
            <el-popover ref="s-pop34" placement="top" trigger="hover"
              content="发送转化率：近3天发送过营销短信的所有用户，有效订单会员人数占比，发送转化率=下单人数/短信实发人次">
            </el-popover>
            <el-button v-popover:s-pop34 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.paymentNumberIERate || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单量
            <el-popover ref="s-pop35" placement="top" trigger="hover"
              content="订单量：近3天发送过营销短信的所有用户，有效订单的总订单量">
            </el-popover>
            <el-button v-popover:s-pop35 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.orderQuantityIE || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单转化率
            <el-popover ref="s-pop36" placement="top" trigger="hover"
              content="订单转化率：近3天发送过营销短信的响应用户，有效订单会员人数占比，订单转化率=订单量/响应人数">
            </el-popover>
            <el-button v-popover:s-pop36 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.orderIERate || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">销售额
            <el-popover ref="s-pop37" placement="top" trigger="hover"
              content="销售额：近3天发送过营销短信的所有用户，有效订单的总金额">
            </el-popover>
            <el-button v-popover:s-pop37 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.salesVolumeIE || 0 }}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">客单价
            <el-popover ref="s-pop38" placement="top" trigger="hover"
              content="客单价：近3天发送过营销短信的响应用户，有效订单平均客单价，客单价=销售额/订单量">
            </el-popover>
            <el-button v-popover:s-pop38 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{ initTopData.customerPriceIE || 0 }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="mt10 clearfix">
      <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar"
          class="effect-table">
        <table class="table mm-effect-table">
          <thead>
            <tr>
              <th colspan="4">任务信息</th>
              <th colspan="5">短信发送效果</th>
              <th colspan="11">直接效果</th>
              <th colspan="9">间接效果（3天内用户行为）</th>
            </tr>
            <tr class="gray-head">
              <th width="80">任务ID</th>
              <th width="100">任务主题</th>
              <th width="100">发送人群</th>
              <th width="90">发送时间</th>
              <th width="80">目标人次</th>
              <th width="80">实发人次</th>
              <th width="100">短信发送量</th>
              <th width="100">发送成功量</th>
              <th width="70">成功率</th>
              <th width="50">UV</th>
              <th width="80">有效UV</th>
              <th width="90">UV有效率</th>
              <th width="90">UV打开率</th>
              <th width="130">加入购物车次数</th>
              <th width="80">跳出率</th>
              <th width="80">下单人数</th>
              <th width="80">订单量</th>
              <th width="100">订单转化率</th>
              <th width="80">销售额</th>
              <th width="80">客单价</th>
              <th width="90">响应人数</th>
              <th width="80">响应率</th>
              <th width="90">下单人数</th>
              <th width="100">发送转化率</th>
              <th width="80">订单量</th>
              <th width="90">订单转化率</th>
              <th width="80">销售额</th>
              <th width="80">客单价</th>
              <th width="80">操作</th>
            </tr>
          </thead>
          <tbody v-if="initListData.length > 0">
            <tr v-for="(trItem, index) in initListData" :key="index">
              <td>{{trItem.tId}}</td>
              <td>{{trItem.tName}}</td>
              <td>{{trItem.groupName}}</td>
              <td>{{trItem.sendDate}}</td>
              <td>{{trItem.sendNumber}}</td>
              <td>{{trItem.successNumber}}</td>
              <td>{{trItem.smsQuantity}}</td>
              <td>{{trItem.smsSuccessQuantity}}</td>
              <td>{{trItem.smsSuccessRate}}</td>
              <td>{{trItem.uv}}</td>
              <td>{{trItem.validUv}}</td>
              <td>{{trItem.validUvRate}}</td>
              <td>{{trItem.uvRate}}</td>
              <td>{{trItem.addCartQuantity}}</td>
              <td>{{trItem.jumpRate}}</td>
              <td>{{trItem.paymentNumber}}</td>
              <td>{{trItem.orderQuantity}}</td>
              <td>{{trItem.orderRate}}</td>
              <td>{{trItem.salesVolume}}</td>
              <td>{{trItem.customerPrice}}</td>
              <td>{{trItem.responseNumberIE}}</td>
              <td>{{trItem.responseRate}}</td>
              <td>{{trItem.paymentNumberIE}}</td>
              <td>{{trItem.paymentNumberIERate}}</td>
              <td>{{trItem.orderQuantityIE}}</td>
              <td>{{trItem.orderIERate}}</td>
              <td>{{trItem.salesVolumeIE}}</td>
              <td>{{trItem.customerPriceIE}}</td>
              <td>
                <a class="mm-btn" v-if="authorizedData.mms_marketing_details_note" @click="toSingle(trItem.tId)">查看</a>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="28" class="text-center">{{errorTxt}}</td>
            </tr>
          </tbody>
        </table>
        <slot></slot>
      </el-scrollbar>
      <pager :total="total" :pages="pages" :pageNum="pageNum" v-on:pageinfo="pageInit"></pager>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { countMarketings, queryMarketings, exportReport, pageAuthorized } from 'api/msgService'
import { mapMutations } from 'vuex'
import pager from 'common/pager'
export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      esWidth: '',
      activeIndex: '1',
      errorTxt: '',
      queryData: {
        fixedTime: '0',
        startTime: '',
        endTime: ''
      },
      initTopData: {},
      initListData: [],
      pages: 0,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.queryData.endTime !== '' && this.queryData.endTime) {
            var d = new Date(this.queryData.endTime).getTime()
            return time.getTime() > Date.now() || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.queryData.startTime !== '' && this.queryData.startTime) {
            var d = new Date(this.queryData.startTime).getTime()
            return time.getTime() < d - 86400000 || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  components: {
    'pager': pager
  },
  created () {
    this.esWidth = parseInt(document.body.offsetWidth - 40) + 'px'
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_report_effect'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_report_effect
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.initTop()
            _this.initBottom()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    initTop: function () {
      var _this = this
      var data = this.queryData.fixedTime === 4 || this.queryData.fixedTime === '4' ? this.queryData
        : { fixedTime: this.queryData.fixedTime }
      countMarketings(data, function (data) {
        if (data.success === true && data.errCode === '0') {
          _this.initTopData = data.data ? data.data : {}
        } else {
          _this.initTopData = {}
        }
      })
    },
    initBottom: function () {
      var _this = this
      var data = this.queryData.fixedTime === 4 || this.queryData.fixedTime === '4' ? this.queryData
        : { fixedTime: this.queryData.fixedTime }
      data.pageNum = this.pageNum
      data.pageSize = this.pageSize
      queryMarketings(data, function (data) {
        if (data.success === true && data.errCode === '0') {
          var allData = data.data ? data.data : {}
          _this.total = allData.total ? allData.total : 0
          _this.pageNum = allData.pageNum ? allData.pageNum : 1
          _this.pageSize = allData.pageSize ? allData.pageSize : 10
          _this.pages = allData.pages ? allData.pages : 0
          _this.initListData = allData.marketingEffectRDTOS ? allData.marketingEffectRDTOS : {}
        } else {
          _this.total = 0
          _this.pageNum = 1
          _this.pageSize = 10
          _this.pages = 0
          _this.initListData = []
          _this.errorTxt = data.errMsg
        }
      })
    },
    pageInit: function (data) {
      this.pageNum = data.pageindex
      this.pageSize = data.pagecount
      this.initBottom()
    },
    effectSearch: function () {
      this.pageNum = 1
      this.initTop()
      this.initBottom()
    },
    effectDown: function () {
      var data = this.queryData.fixedTime === 4 || this.queryData.fixedTime === '4' ? this.queryData
        : { fixedTime: this.queryData.fixedTime }
      exportReport(data)
    },
    toSingle: function (id) {
      this.singleTid(id)
      this.$router.push('/effectstatissingle')
    },
    ...mapMutations({
      singleTid: 'SET_TID'
    })
  }
}
</script>
<style>
select.mm-select-time,
select.mm-select-time:focus,
select.mm-select-time:hover{ border:1px solid #ccc;}
.effect-table{ padding-bottom:20px;}
.effect-table .el-scrollbar__bar.is-vertical{ display:none;}
.effect-table .el-select-dropdown__wrap{ max-height:none;}
.el-scrollbar__wrap{ width:100%;}
.mm-effect-table{ min-width:2300px;}
.mm-effect-table>thead>tr>th{ text-align:center}
.mm-effect-table>thead>tr.gray-head>th{ background:#f3f3f3;}
.mm-effect-table td,
.mm-effect-table.table>thead>tr>th{ border: 1px solid #ddd; text-align:center;}
.es-wrapper .el-input__inner{ height:30px; background: #fff!important;}
.effect-table .el-scrollbar__bar.is-horizontal{ height:10px; opacity:1;}
.es-wrapper.pb50{ padding-bottom:50px}
</style>
