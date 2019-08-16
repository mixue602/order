<template>
<div class="Voucher-wrap" v-show="allData.activityName && allData.stores" :style="{width: pageWidth -20 + 'px'}">
  <div>
    <!-- <h2>集客活动统计明细</h2> -->
    <div class="tittle-wrap">
      <p class="tittle-v"><span>活动名称：</span><span>{{allData.activityName}}({{allData.activityId}})</span></p>
      <p class="pd" v-show="tittleData.activityState = true"><span class="mr10">活动状态：</span><span>{{allData.activityType}}</span></p>
      <p class=""><span class="mr10">活动时间：</span><span>{{allData.activityTime}}</span></p>
      <p class="pd clearfix">
        <span class="mr10 mt7 fl">活动门店：</span>
        <el-select class="fl"  v-model="tittleData.stores" :disabled="!userPermission.store">
          <el-option
            v-for="item in storeOptions"
            :key="item.storeId"
            :label="item.storeName"
            :value="item.storeId" class="select-font">
          </el-option>
        </el-select>
      </p>
      <p class="pd clearfix">
        <span class="mr10 mt7 fl">统计范围：</span>
        <el-select class="fl" v-model="tittleData.employs" >
          <el-option
            v-for="item in employOptions"
            :key="item.employId"
            :label="item.employName + '(' + item.employId + ')'"
            :value="item.employId" class="select-font">
          </el-option>
        </el-select>
      </p>
    </div>
  </div>
  <div>
    <h2>集客活动效果</h2>
    <el-row class="cdata-list cdata-table clearfix">
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          PV
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="即用户浏览或点击分享的活动页面的数量，在统计周期内用户每打开或刷新一次页面就记录1次">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.pv || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          UV
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="按日去重的独特访客数">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.uv || 0}}</span>
      </el-col>
      <el-col :span="3" class="cdata-item">
        <span class="c-count">
          新增客户量
          <el-popover ref="s-pop1" placement="top" trigger="hover">
            <slot>
              <div class="font-pd">
                在活动有效期内，新增集客客户数量
              </div>
            </slot>
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.newTotalUser || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          领券量
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="通过活动分享页面领取的优惠券的数量">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.couponQuantity || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          激活量
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="领取优惠券后激活优惠券的数量">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.activateCouponQuantity || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          核销券量
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="已领取优惠券并到店使用的优惠券数量">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.usedCouponQuantity || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          核销比例
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="核销比例=核销券量/领券量*100%">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.usedCouponRatio || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          下单人数
          <el-popover ref="s-pop1" placement="top" trigger="hover">
            <slot>
              <div class="font-pd">
              活动期间内，集客客户中产生订单的人数（去重）
              </div>
            </slot>
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.poQuantityActive || 0}}</span>
      </el-col>
      <el-col :span="3" class="cdata-item">
        <span class="c-count">
          销售额
          <el-popover ref="s-pop1" placement="top" trigger="hover">
            <slot>
              <div class="font-pd">
              活动期间内，集客客户下单后产生的订单销售额
              </div>
            </slot>
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.salesAmount || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          销售件数
          <el-popover ref="s-pop1" placement="top" trigger="hover" content="">
            <slot>
              <div class="font-pd">
              订单中商品的件数（不含赠品及延保商品）<br/>
              </div>
            </slot>
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.salesQuantity || 0}}</span>
      </el-col>
      <el-col :span="2" class="cdata-item">
        <span class="c-count">
          件单价
          <el-popover ref="s-pop1" placement="top" trigger="hover"
            content="件单价=销售额/销售件数">
          </el-popover>
          <el-button v-popover:s-pop1 class="c-more">?</el-button>
        </span>
        <span class="c-num">{{allData.unitPrice || 0}}</span>
      </el-col>
    </el-row>
  </div>
  <!-- echart -->
  <div class="chart-wrapper clearfix">
    <el-row :gutter="20" class="pb-chart cdata-item" v-show="chartShow.pvuvChart || chartShow.newUserChart || chartShow.saleChart || chartShow.collectCustomerChart || chartShow.saleRankingChart || chartShow.categoryChart" :style="{width: pageWidth + 'px'}">
      <el-col :span="12" v-show="chartShow.pvuvChart">
        <div class="chart-area">
          <div class="tit-left">
            PV/UV
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="PV:即页面浏览量或点击量，在统计周期内用户每打开或刷新一个页面就记录1次 UV：按日去重的独特访客数">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.pvuvTime}}</p>
          </div>
          <div class="line-chart" ref="dobbleLine" :style="{width: chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
      <el-col :span="12" v-show="chartShow.newUserChart">
        <div class="chart-area">
          <div class="tit-left">
            新增客户量
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="新增客户量：在活动有效期内，新增集客客户数量">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.newUserTime}}</p>
          </div>
          <div class="line-chart" ref="barchart" :style="{width:chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
      <el-col :span="12" v-show="chartShow.saleChart">
        <div class="chart-area">
          <div class="tit-left">
            销售数据分析
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="销售额：产生订单号的订单销售额（同一个订单中的每个导购员独立核算）销售件数：订单中商品的件数（同一个订单中的每个导购员独立核算）">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.saleTime}}</p>
          </div>
          <div class="line-chart" ref="linebarchart" :style="{width: chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
      <el-col :span="12" v-show="chartShow.collectCustomerChart">
        <div class="chart-area">
          <div class="tit-left">
            集客效果漏斗
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="集客效果漏斗：展示从集客领取优惠券到订单成交的转化过程">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.collectCustomerTime}}</p>
          </div>
          <div class="line-chart" ref="funnelchart" :style="{width: chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
      <el-col :span="12" v-show="chartShow.saleRankingChart">
        <div class="chart-area">
          <div class="tit-left">
            销售排行TOP10
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="销售排行TOP10：活动期间，各员工产生的销售额">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.saleRankingTime}}</p>
          </div>
          <div class="line-chart" ref="hChart1" :style="{width: chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
      <el-col :span="12" v-show="chartShow.categoryChart">
        <div class="chart-area">
          <div class="tit-left">
            品类排行
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="品类排行：活动期间，各品类产生的销售额">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
            <p class="sub-tit">{{couponChart.categoryTime}}</p>
          </div>
          <div class="line-chart" ref="hChart2" :style="{width: chartWidth, height:'443px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="clearfix" v-if="tableData">
    <h2>集客活动明细</h2>
      <table class="table dataTable table-striped no-margin">
        <thead>
          <tr class="gray-head">
            <th width="70">时间</th>
            <th width="80">PV</th>
            <th width="80">UV</th>
            <th width="50" class="text-right">新增客户量</th>
            <th width="80" class="text-right">领券量</th>
            <th width="80" class="text-right">激活量</th>
            <th width="80" class="text-right">核销券量</th>
            <th width="80" class="text-right">核销比例</th>
            <th width="80" class="text-right">下单人数</th>
            <th width="80" class="text-right">销售额</th>
            <th width="80" class="text-right">销售件数</th>
            <th width="80" class="text-right">件单价</th>
          </tr>
        </thead>
        <tbody v-if="tableData.length">
          <tr v-for="(item) in tableData" :key="item.id">
            <td>{{item.dataTime}}</td>
            <td>{{item.pv}}</td>
            <td>{{item.uv}}</td>
            <td class="text-right">{{item.newTotalUser}}</td>
            <td class="text-right">{{item.couponQuantity}}</td>
            <td class="text-right">{{item.activateCouponQuantity}}</td>
            <td class="text-right">{{item.usedCouponQuantity}}</td>
            <td class="text-right">{{item.usedCouponRatio}}</td>
            <td class="text-right">{{item.poQuantityActive}}</td>
            <td class="text-right">{{item.salesAmount}}</td>
            <td class="text-right">{{item.salesQuantity}}</td>
            <td class="text-right">{{item.unitPrice}}</td>
          </tr>
        </tbody>
        <tbody v-else>
            <tr class="bgf">
              <td class="text-center no-search" colspan="12">暂无数据</td>
            </tr>
          </tbody>
      </table>
      <pager :total="total" :pages="pages" v-on:pageinfo="pageInit" :pageNum="pageNum"></pager>
    </div>
</div>
</template>

<style>
.Voucher-wrap .fl{ float: left;}
.Voucher-wrap .text-right{ text-align: right;}
.font-pd{ padding: 5px 5px; line-height: 1.6;}
.Voucher-wrap{ margin-top: 20px; font-family: Arial,"Microsoft Yahei";}
.Voucher-wrap h2{ font-size: 14px; padding: 20px 0 10px 0; color: #333;}
.Voucher-wrap .tittle-wrap{background: #f3f3f3; padding: 20px; font-size: 14px; color: #333;}
.tittle-v span{ font-size: 16px; font-weight:bold;}
.Voucher-wrap .tittle-wrap p{ margin-top: 10px;}
.Voucher-wrap .tittle-wrap .mt7{ margin-top: 7px;}
.Voucher-wrap .tittle-wrap .mr10{ margin-right: 10px;}
.Voucher-wrap .tittle-wrap p.tittle-v{ margin: 0 0 20px 0;}
.Voucher-wrap .el-input__inner{ height: 30px !important;}
.Voucher-wrap .el-select input[readonly][type=text]:hover{ border-color: #76a9e3!important;}
.Voucher-wrap .el-select .el-input.is-disabled input[readonly][type=text],.Voucher-wrap .el-select .el-input.is-disabled input[readonly][type=text]:hover{border-color: #ccc!important; background: #f3f3f3;}
.Voucher-wrap .el-select-dropdown__list{ padding: 0 0;}
.Voucher-wrap .chart-wrapper li{ position: relative;}
.select-font.selected{ font-weight: normal; color: #2875cc;}
.select-font.hover, .select-font:hover{ background: #eef6ff;}
.Voucher-wrap .chart-area{ padding: 15px;}
.Voucher-wrap .tit-left{ font-size: 13px; font-weight: bold; color: #333;}
.Voucher-wrap .tit-left p{font-size: 12px; color: #999; margin-top: 10px; font-weight: normal;}
</style>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { activeDeployList, activeDeployTableList, jurisdiction } from 'api/jkService'
import dobbleLine from '@/assets/js/crm/echarts-dobbleline'
import barV from '@/assets/js/crm/echarts-barV'
import lineBar from '@/assets/js/crm/echarts-lineBar'
import funnel from '@/assets/js/crm/echarts-funnel'
import hBar from '@/assets/js/crm/echarts-hBar'
import pager from 'common/pager'

export default {
  data () {
    return {
      pageWidth: document.body.offsetWidth - 20, // 页面宽度
      isFirstE: true,
      isFirstS: true,
      chartWidth: 0,
      activeId: '',
      // disabledState: true,
      userPermission: {
        page: false,
        employs: false,
        store: false
      },
      allData: {},
      couponChart: {},
      tittleData: {
        stores: '',
        employs: ''
      },
      storeOptions: [],
      employOptions: [],
      noData: [
        {
          'employId': 'ALL',
          'employName': '全部员工'
        }
      ],
      chartShow: {
        pvuvChart: false,
        newUserChart: false,
        saleChart: false,
        collectCustomerChart: false,
        saleRankingChart: false,
        categoryChart: false
      },
      tableData: '',
      pages: '',
      total: '',
      pageNum: '1',
      pageSize: '10'
    }
  },
  components: {
    'pager': pager
  },
  mounted: function () {
    var _this = this
    jurisdiction({
      pcode: 'mccr_coupon_activity_effect_page'
    }, function (data) {
      if (data.success === true || data.success === 'true') {
        if (data.login) {
          _this.userPermission.page = data.data.mccr_coupon_activity_effect_page
          _this.chartWidth = parseInt((document.body.offsetWidth - 60) / 2 - 30) + 'px' // 初始化echart自适应的宽度
          if (_this.userPermission.page) {
            _this.getUrlParams(window.location.href) // 获取当前域名的参数--活动id
            _this.userPermission.store = data.data.mccr_coupon_activity_store_button
            _this.getAllChartData()
            _this.getTableData()
          }
        }
      } else {
        // 跳转到REM首页
        window.location.href(mmsDomain.ermHome)
      }
    })
  },
  methods: {
    getUrlParams: function (url) {
      var _this = this
      if (url) {
        var urlS = url.toString()
        var arrUrl = urlS.split('?')
        var para = arrUrl[1].split('=')[1]
        _this.activeId = para
      }
    },
    getAllChartData: function () { // 头部数据
      var _this = this
      activeDeployList({
        aid: _this.activeId, // 活动id
        sid: _this.tittleData.stores,
        // sid: _this.tittleData.stores ? _this.tittleData.stores : 'A007', // 门店id
        eid: _this.tittleData.employs // 员工id
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.allData = data.data
          _this.couponChart = data.data.couponChart ? data.data.couponChart : {}
          var dataChartListAll = data.data
          _this.storeOptions = dataChartListAll.stores
          _this.employOptions = dataChartListAll.employs
          // select初始化
          if (_this.isFirstS === true) {
            _this.tittleData.stores = dataChartListAll.stores[0].storeId
          }
          if (_this.isFirstE === true) {
            _this.tittleData.employs = dataChartListAll.employs[0].employId
          }
          // echart渲染
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.pvuvChart) {
            _this.chartShow.pvuvChart = true
            _this.dobbleLineFn()
          } else {
            _this.chartShow.pvuvChart = false
          }
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.newUserChart) {
            _this.chartShow.newUserChart = true
            _this.barFn()
          } else {
            _this.chartShow.newUserChart = false
          }
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.saleChart) {
            _this.chartShow.saleChart = true
            _this.linebarFn()
          } else {
            _this.chartShow.saleChart = false
          }
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.collectCustomerChart) {
            _this.chartShow.collectCustomerChart = true
            _this.funnelFn()
          } else {
            _this.chartShow.collectCustomerChart = false
          }
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.saleRankingChart) {
            _this.chartShow.saleRankingChart = true
            _this.hBarFn1()
          } else {
            _this.chartShow.saleRankingChart = false
          }
          if (dataChartListAll.couponChart && dataChartListAll.couponChart.categoryChart) {
            _this.chartShow.categoryChart = true
            _this.hBarFn2()
          } else {
            _this.chartShow.categoryChart = false
          }
        } else {
          _this.$message({
            message: data.errMsg,
            type: 'error'
          })
          _this.allData.couponChart = ''
          _this.chartShow.pvuvChart = false
          _this.chartShow.newUserChart = false
          _this.chartShow.saleChart = false
          _this.chartShow.collectCustomerChart = false
          _this.chartShow.saleRankingChart = false
          _this.chartShow.categoryChart = false
          _this.tableData = ''
          _this.allData.pv = ''
          _this.allData.uv = ''
          _this.allData.newTotalUser = ''
          _this.allData.couponQuantity = ''
          _this.allData.activateCouponQuantity = ''
          _this.allData.usedCouponQuantity = ''
          _this.allData.usedCouponRatio = ''
          _this.allData.poQuantityActive = ''
          _this.allData.salesAmount = ''
          _this.allData.salesQuantity = ''
          _this.allData.unitPrice = ''
          if (!_this.isFirstS) {
            _this.employOptions = []
            console.log(_this.employOptions, 5777)
            // _this.employOptions = _this.noData
          }
        }
      })
    },
    // 基于准备好的dom，初始化echarts实例----------------
    dobbleLineFn: function () {
      var dobbleLineChart = this.$echarts.init(this.$refs.dobbleLine)
      dobbleLineChart.clear()
      var dobbleLineData = {
        time: this.allData.couponChart.pvuvChart.map(function (item, index) {
          return item.createDate
        }),
        data1: this.allData.couponChart.pvuvChart.map(function (item, index) {
          return item.pv
        }),
        data2: this.allData.couponChart.pvuvChart.map(function (item, index) {
          return item.uv
        })
      }
      dobbleLineChart.setOption(dobbleLine(dobbleLineData))
    },
    // 柱图-------------------------
    barFn: function () {
      var barchart = this.$echarts.init(this.$refs.barchart)
      barchart.clear()
      var barData = {
        time: this.allData.couponChart.newUserChart.map(function (item, index) {
          return item.createDate
        }),
        data1: this.allData.couponChart.newUserChart.map(function (item, index) {
          return item.newUserQuantity
        })
      }
      barchart.setOption(barV(barData))
    },
    // 折柱混合-----------------------
    linebarFn: function () {
      var linebarchart = this.$echarts.init(this.$refs.linebarchart)
      linebarchart.clear()
      var lineBarData = {
        time: this.allData.couponChart.saleChart.map(function (item, index) {
          return item.createDate
        }),
        data1: this.allData.couponChart.saleChart.map(function (item, index) {
          return ((item.salesAmount) / 10000).toFixed(2)
        }),
        data2: this.allData.couponChart.saleChart.map(function (item, index) {
          return item.salesQuantity
        })
      }
      linebarchart.setOption(lineBar(lineBarData))
    },
    // 漏斗图-------------------------
    funnelFn: function () {
      var funnelchart = this.$echarts.init(this.$refs.funnelchart)
      funnelchart.clear()
      var funnelData = {
        data1: this.allData.couponChart.collectCustomerChart.couponQuantity,
        data2: this.allData.couponChart.collectCustomerChart.usedCouponQuantity,
        data3: this.allData.couponChart.collectCustomerChart.poQuantityActive
      }
      funnelchart.setOption(funnel(funnelData))
    },
    // 横向柱状图---------------------
    hBarFn1: function () {
      var hChart1 = this.$echarts.init(this.$refs.hChart1)
      hChart1.clear()
      var hBarData1 = {
        data1: this.allData.couponChart.saleRankingChart.reverse().map(function (item, index) {
          return item.employName + '(' + item.employId + ')'
        }),
        data2: this.allData.couponChart.saleRankingChart.map(function (item, index) {
          return item.salesAmount
        })
      }
      hChart1.setOption(hBar(hBarData1))
    },
    hBarFn2: function () {
      var hChart2 = this.$echarts.init(this.$refs.hChart2)
      hChart2.clear()
      var hBarData2 = {
        data1: this.allData.couponChart.categoryChart.reverse().map(function (item, index) {
          return item.categoryName
        }),
        data2: this.allData.couponChart.categoryChart.map(function (item, index) {
          return item.salesAmount
        })
      }
      hChart2.setOption(hBar(hBarData2))
    },
    getTableData: function (data) { // 表格列表
      var _this = this
      activeDeployTableList({
        pageSize: _this.pageSize,
        pageNum: _this.pageNum,
        aid: _this.activeId, // 活动id
        sid: _this.tittleData.stores,
        // sid: _this.tittleData.stores ? _this.tittleData.stores : 'A003', // 门店id
        eid: _this.tittleData.employs // 员工id
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.tableData = data.data.couponEffect
          _this.pages = data.data.pages
          _this.total = data.data.total
          _this.pageNum = data.data.pageNum
          _this.pageSize = data.data.pageSize
        }
      })
    },
    pageInit: function (data) {
      var _this = this
      _this.pageSize = data.pagecount
      _this.pageNum = data.pageindex
      _this.getTableData()
    }
  },
  watch: {
    'tittleData.stores': {
      handler (value, oldValue) {
        if (!this.isFirstS) {
          // this.isFirstE = true
          this.getAllChartData()
          this.getTableData()
        }
        this.isFirstS = false
        this.tittleData.employs = 'ALL'
      },
      deep: true
    },
    'tittleData.employs': {
      handler (value, oldValue) {
        if (!this.isFirstE) {
          this.getAllChartData()
          this.getTableData()
        }
        this.isFirstE = false
      },
      deep: true
    }
  }
}
</script>
