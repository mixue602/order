<template>
  <div class="ess-wrapper clearfix" :style="{ width: essWidth }" v-show="authorizedPage">
    <div class="form-group mt20 mb0 clearfix">
      <el-form>
        <el-form-item label="任务主题：">
          <el-input :style="'width:200px'" v-model.trim="name" placeholder="请输入任务ID"></el-input>
          <el-button class="btn btn-primary ml10"  v-if="authorizedData.mms_chart_query_note" @click="queryEffect">查询</el-button>
          <el-button class="btn btn-white" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="cdata-wrapper clearfix">
      <div class="cdata-tit">短信发送效果</div>
      <el-row class="cdata-list cdata-table">
        <el-col :span="4" class="cdata-item">
          <span class="c-count">目标人次
            <el-popover ref="s-pop11" placement="top" trigger="hover"
              content="目标人次：计划发送短信的用户ID数量">
            </el-popover>
            <el-button v-popover:s-pop11 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.sendNumber || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">实发人次
            <el-popover ref="s-pop12" placement="top" trigger="hover"
              content="实发人次：实际发送短信的用户ID已激活手机的数量">
            </el-popover>
            <el-button v-popover:s-pop12 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.successNumber || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">短信发送量
            <el-popover ref="s-pop13" placement="top" trigger="hover"
              content="短信发送量：实际计划发送短信的数量">
            </el-popover>
            <el-button v-popover:s-pop13 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.smsQuantity || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">发送成功量
            <el-popover ref="s-pop14" placement="top" trigger="hover"
              content="发送成功量：实际发送成功的短信的数量">
            </el-popover>
            <el-button v-popover:s-pop14 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.smsSuccessQuantity || 0}}</span>
        </el-col>
        <el-col :span="5" class="cdata-item">
          <span class="c-count">发送成功率
            <el-popover ref="s-pop15" placement="top" trigger="hover"
              content="发送成功率：发送成功率=发送成功量/短信发送量*100%">
            </el-popover>
            <el-button v-popover:s-pop15 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.smsSuccessRate || 0}}</span>
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
          <span class="c-num">{{topData.uv || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">有效UV
            <el-popover ref="s-pop22" placement="top" trigger="hover"
              content="有效UV：页面浏览量大于1的独特访客数">
            </el-popover>
            <el-button v-popover:s-pop22 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.validUv || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">UV有效率
            <el-popover ref="s-pop23" placement="top" trigger="hover"
              content="UV有效率：有效UV占总UV的百分比，UV有效率=有效UV/UV">
            </el-popover>
            <el-button v-popover:s-pop23 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.validUvRate || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">UV打开率
            <el-popover ref="s-pop24" placement="top" trigger="hover"
              content="UV打开率：UV占实发人数的百分比，UV打开率=UV数/实发人次*100%">
            </el-popover>
            <el-button v-popover:s-pop24 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.uvRate || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">加入购物车次数
            <el-popover ref="s-pop25" placement="top" trigger="hover"
              content="加入购物车次数：用户在商品详情页点击加入购物车按钮并跳转到加入购物车成功页的次数（包含PC\WAP\APP）">
            </el-popover>
            <el-button v-popover:s-pop25 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.addCartQuantity || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">跳出率
            <el-popover ref="s-pop26" placement="top" trigger="hover"
              content="跳出率：用户只访问了一个页面便直接离开网站的访问占比，跳出率=跳出次数/访问">
            </el-popover>
            <el-button v-popover:s-pop26 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.jumpRate || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">下单人数
            <el-popover ref="s-pop27" placement="top" trigger="hover"
              content="下单人数：实发人数中产生的订单人数（产生订单号的主订单数量的人数）">
            </el-popover>
            <el-button v-popover:s-pop27 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.paymentNumber || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">订单量
            <el-popover ref="s-pop28" placement="top" trigger="hover"
              content="订单量：产生订单号的订单数量（毛订单量）">
            </el-popover>
            <el-button v-popover:s-pop28 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.orderQuantity || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单转化率
            <el-popover ref="s-pop29" placement="top" trigger="hover"
              content="订单转化率：订单转化率=订单量/UV数*100%">
            </el-popover>
            <el-button v-popover:s-pop29 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.orderRate || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">销售额
            <el-popover ref="s-pop210" placement="top" trigger="hover"
              content="销售额：产生订单号的订单销售额（毛销售额）">
            </el-popover>
            <el-button v-popover:s-pop210 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.salesVolume || 0}}</span>
        </el-col>
        <el-col :span="2" class="cdata-item">
          <span class="c-count">客单价
            <el-popover ref="s-pop211" placement="top" trigger="hover"
              content="客单价：客单价=销售额/订单量">
            </el-popover>
            <el-button v-popover:s-pop211 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.customerPrice || 0}}</span>
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
          <span class="c-num">{{topData.responseNumberIE || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">响应率
            <el-popover ref="s-pop32" placement="top" trigger="hover"
              content="响应率：近3天发送过营销短信并活跃的会员人数占比，响应率=响应人数/短信实发人数">
            </el-popover>
            <el-button v-popover:s-pop32 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.responseRate || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">下单人数
            <el-popover ref="s-pop33" placement="top" trigger="hover"
              content="下单人数：近3天发送过营销短信的所有用户，有效订单的总人数">
            </el-popover>
            <el-button v-popover:s-pop33 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.paymentNumberIE || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">发送转化率
            <el-popover ref="s-pop34" placement="top" trigger="hover"
              content="发送转化率：近3天发送过营销短信的所有用户，有效订单会员人数占比，发送转化率=下单人数/短信实发人次">
            </el-popover>
            <el-button v-popover:s-pop34 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.paymentNumberIERate || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单量
            <el-popover ref="s-pop35" placement="top" trigger="hover"
              content="订单量：近3天发送过营销短信的所有用户，有效订单的总订单量">
            </el-popover>
            <el-button v-popover:s-pop35 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.orderQuantityIE || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">订单转化率
            <el-popover ref="s-pop36" placement="top" trigger="hover"
              content="订单转化率：近3天发送过营销短信的响应用户，有效订单会员人数占比，订单转化率=订单量/响应人数">
            </el-popover>
            <el-button v-popover:s-pop36 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.orderIERate || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">销售额
            <el-popover ref="s-pop37" placement="top" trigger="hover"
              content="销售额：近3天发送过营销短信的所有用户，有效订单的总金额">
            </el-popover>
            <el-button v-popover:s-pop37 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.salesVolumeIE || 0}}</span>
        </el-col>
        <el-col :span="3" class="cdata-item">
          <span class="c-count">客单价
            <el-popover ref="s-pop38" placement="top" trigger="hover"
              content="客单价：近3天发送过营销短信的响应用户，有效订单平均客单价，客单价=销售额/订单量">
            </el-popover>
            <el-button v-popover:s-pop38 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{topData.customerPriceIE || 0}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="chart-wrapper clearfix">
      <el-row :gutter="20">
        <el-col :span="12" v-show="chartShow.brand">
          <div class="chart-area" :style="{width: chartWidth, height:'500px'}">
            <el-row class="treechart-tit clearfix">
              <el-col :span="12" :style="'margin-top:15px'" class="t-label">下单品牌/品类TOP10</el-col>
              <el-col :span="12" :style="'margin-top:15px'" class="text-right">
                <el-select v-model="ordertype" @change="treeSelect" :style="'margin-right:12px'">
                  <el-option value="taskBrands" label="品牌"></el-option>
                  <el-option value="taskOneCategorys" label="品类"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <div ref="treemap" :style="{width: chartWidth, height:'450px'}"></div>
          </div>
        </el-col>
        <el-col :span="12" v-show="chartShow.columny">
          <div class="chart-area" ref="columnychart" :style="{width: chartWidth, height:'500px'}"></div>
        </el-col>
        <el-col :span="12" v-show="chartShow.map">
          <div class="chart-area" ref="mapchart" :style="{width: chartWidth, height:'500px'}"></div>
        </el-col>
        <el-col :span="12" v-show="chartShow.category">
          <div class="chart-area" ref="categorychart" :style="{width: chartWidth, height:'500px'}"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
.treechart-tit .t-label{ padding-left:10px; height:30px; line-height:30px; font-size:13px; font-weight:bold; color:#333;}
.ess-wrapper .el-input__inner{ height:30px; background: #fff!important;}
</style>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import mapChart from '@/assets/js/echarts-map'
import columnYChart from '@/assets/js/echarts-columnY'
import treemap from '@/assets/js/echarts-treemap'
import { queryMarketingDetaile, pageAuthorized } from 'api/msgService'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      essWidth: '',
      name: '',
      chartWidth: 0,
      ordertype: 'taskBrands',
      allData: {},
      topData: {},
      chartShow: {
        brand: false,
        map: false,
        columny: false,
        category: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'tId'
    ])
  },
  created () {
    this.essWidth = parseInt(document.body.offsetWidth - 40) + 'px'
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_report_effect_detail'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_report_effect_detail
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.name = _this.tId ? _this.tId : ''
            _this.chartWidth = parseInt((document.body.offsetWidth - 60) / 2) + 'px'
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
      queryMarketingDetaile({
        'tId': _this.name
      }, function (data) {
        if (data.success === true && data.errCode === '0') {
          var dataResult = data.data
          var treeData = dataResult.taskBrands ? dataResult.taskBrands : []
          var mapData = dataResult.taskRegions ? dataResult.taskRegions : []
          var columnyData = dataResult.taskTargets ? dataResult.taskTargets : []
          var categoryData = dataResult.taskCitys ? dataResult.taskCitys : []

          _this.allData = dataResult
          _this.topData = dataResult.marketingEffect ? dataResult.marketingEffect : {}

          _this.chartShow.brand = treeData.length > 0
          _this.treemapInit(treeData, 1)

          _this.chartShow.map = mapData.length > 0
          _this.mapChartInit(mapData)

          _this.chartShow.columny = columnyData.length > 0
          _this.columnychartInit(columnyData, 'crowd')

          _this.chartShow.category = categoryData.length > 0
          _this.categorychartInit(categoryData, 'city')
        } else {
          _this.$message(data.errMsg)
          _this.topData = {}
          _this.chartShow.brand = false
          _this.chartShow.map = false
          _this.chartShow.columny = false
          _this.chartShow.category = false
        }
      })
    },
    mapChartInit: function (data) {
      var myChart = this.$echarts.init(this.$refs.mapchart)
      myChart.clear()
      myChart.setOption(mapChart(data))
    },
    columnychartInit: function (data, diff) {
      var myChart3 = this.$echarts.init(this.$refs.columnychart)
      myChart3.clear()
      myChart3.setOption(columnYChart(data, diff))
    },
    treemapInit: function (data, deep) {
      var treemapChart = this.$echarts.init(this.$refs.treemap)
      treemapChart.clear()
      treemapChart.setOption(treemap(data, deep))
    },
    categorychartInit: function (data, diff) {
      var myChart2 = this.$echarts.init(this.$refs.categorychart)
      myChart2.clear()
      myChart2.setOption(columnYChart(data, diff))
    },
    queryEffect: function () {
      this.ordertype = 'taskBrands'
      this.init()
    },
    treeSelect: function () {
      this.treemapInit(this.allData[this.ordertype], this.ordertype === 'taskBrands' ? 1 : 2)
    },
    goBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>
