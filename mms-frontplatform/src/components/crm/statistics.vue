<template>
  <div class="cs-wrapper" v-show="userPower.page">
    <div class="mt20 clearfix">
      <el-date-picker class="w160" v-model="queryData.selectDate" type="month" value-format="yyyy-MM"></el-date-picker>
      <label style="padding:0 6px 0 16px">区域</label>
      <el-select class="w160 mr6" v-model="queryData.rid" v-show="userPower.area" :placeholder="queryHolder.area">
        <el-option class="cs-select-opt" v-for="(item, key) in selectData.area" :key="key" :value="item.regionalId" :label="item.regionalName"></el-option>
      </el-select>
      <el-select class="w160 mr6" v-model="queryData.did" v-show="userPower.city" :placeholder="queryHolder.city">
        <el-option class="cs-select-opt" v-for="(item, key) in selectData.city" :key="key" :value="item.divisionId" :label="item.divisionName"></el-option>
      </el-select>
      <el-select class="w160 mr6" v-model="queryData.sid" v-show="userPower.employ" :disabled="!userPower.store" :placeholder="queryHolder.store">
        <el-option class="cs-select-opt" v-for="(item, key) in selectData.store" :key="key" :value="item.storeId" :label="item.storeName"></el-option>
      </el-select>
      <el-select class="w160 mr6" v-model="queryData.eid" v-show="userPower.employ" :disabled="!userPower.employ" :placeholder="queryHolder.employ">
        <el-option class="cs-select-opt" v-for="(item, key) in selectData.employ" :key="key" :value="item.employId" :label="item.employName + '(' + item.employId + ')'"></el-option>
      </el-select>
      <el-button class="btn-gray" v-show="!selectBtn && userPower.search">查询{{selectBtn}}</el-button>
      <el-button class="btn-primary" v-show="selectBtn && userPower.search" @click="statisticsSearch">查询</el-button>
    </div>
    <div class="cdata-wrapper clearfix">
      <div class="cdata-tit">统计概览</div>
      <el-row class="cdata-list cdata-table clearfix" :style="{width: pageWidth - 20 + 'px'}">
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            客户总量
            <el-popover ref="s-pop1" placement="top" trigger="hover"
              content="截止当前时间，该区域集客客户总量">
            </el-popover>
            <el-button v-popover:s-pop1 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.totalUser || 0}}</span>
        </el-col>
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            新增客户总量
            <el-popover ref="s-pop2" placement="top" trigger="hover"
              content="当月新增客户总量">
            </el-popover>
            <el-button v-popover:s-pop2 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.newTotalUser || 0}}</span>
        </el-col>
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            下单人数
            <el-popover ref="s-pop3" placement="top" trigger="hover"
              content="产生订单的人数">
            </el-popover>
            <el-button v-popover:s-pop3 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.poQuantityAll || 0}}</span>
        </el-col>
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            销售额
            <el-popover ref="s-pop4" placement="top" trigger="hover"
              content="当月集客客户下单后产生的订单销售额">
            </el-popover>
            <el-button v-popover:s-pop4 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.salesAmount || 0}}</span>
        </el-col>
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            销售件数
            <el-popover ref="s-pop5" placement="top" trigger="hover"
              content="当月集客客户下单后产生的订单中商品的数量（不含赠品及延保商品）">
            </el-popover>
            <el-button v-popover:s-pop5 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.salesQuantity || 0}}</span>
        </el-col>
        <el-col :span="4" class="cdata-item">
          <span class="c-count">
            件单价
            <el-popover ref="s-pop6" placement="top" trigger="hover"
              content="件单价=销售额/销售件数">
            </el-popover>
            <el-button v-popover:s-pop6 class="c-more">?</el-button>
          </span>
          <span class="c-num">{{listData.unitPrice || 0}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="chart-wrapper clearfix" v-show="chartShow.customer&&chartShow.newCustomer&&chartShow.sale&&chartShow.pieceSale">
      <div class="cdata-tit">数据直播间</div>
      <el-row :gutter="20" class="pb-chart" :style="{width: pageWidth + 'px'}">
        <el-col :span="12" v-show="chartShow.customer">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.customer.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.customer.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
              <div class="subtit">{{titData.customer.subtit}}</div>
            </div>
            <div class="line-chart" ref="customerTotalChart" :style="{width: chartWidth, height:'433px'}"></div>
          </div>
        </el-col>
        <el-col :span="12" v-show="chartShow.newCustomer">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.newCustomer.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.newCustomer.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
              <div class="subtit">{{titData.newCustomer.subtit}}</div>
            </div>
            <div class="line-chart" ref="newCustomerTotalChart" :style="{width: chartWidth, height:'433px'}"></div>
          </div>
        </el-col>
        <el-col :span="12" v-show="chartShow.sale">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.sale.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover">
                <span v-html="titData.sale.describe"></span>
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
              <div class="subtit">{{titData.sale.subtit}}</div>
            </div>
            <div class="line-chart" ref="saleChart" :style="{width: chartWidth, height:'433px'}"></div>
          </div>
        </el-col>
        <el-col :span="12" v-show="chartShow.pieceSale">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.pie.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.pie.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
              <div class="subtit">&nbsp;</div>
            </div>
            <div class="line-chart" ref="pieDoughnut" :style="{width: chartWidth, height:'433px'}"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chart-wrapper clearfix" v-show="rankData.customer.length&&rankData.newCustomer.length&&rankData.sale.length&&rankData.pieceSale.length">
      <div class="cdata-tit">{{topTitle}}</div>
      <el-row :gutter="20" class="pb-chart" :style="{width: pageWidth + 'px'}">
        <el-col :span="12" style="height:480px" v-show="rankData.customer.length">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.totalT10.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.totalT10.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
            </div>
            <table class="table mt15 chart-table">
              <thead>
                <tr>
                  <th width="25%">名次</th>
                  <th>门店名称</th>
                  <th style="text-align:right; padding-right:80px;">客户总量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rankData.customer" :key="index" :class="item.currentStore ? 'red' : ''">
                  <td>{{item.ranking}}</td>
                  <td>{{item.storeName}}</td>
                  <td style="text-align:right; padding-right:80px;">{{item.totalUser}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :span="12" style="height:480px" v-show="rankData.newCustomer.length">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.newCustomerT10.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.newCustomerT10.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
            </div>
            <table class="table mt15 chart-table">
              <thead>
                <tr>
                  <th width="25%">名次</th>
                  <th>门店名称</th>
                  <th style="text-align:right; padding-right:80px;">新增客户总量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rankData.newCustomer" :key="index" :class="item.currentStore ? 'red' : ''">
                  <td>{{item.ranking}}</td>
                  <td>{{item.storeName}}</td>
                  <td style="text-align:right; padding-right:80px;">{{item.newUserQuantity}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :span="12" style="height:480px" v-show="rankData.sale.length">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.saleT10.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.saleT10.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
            </div>
            <table class="table mt15 chart-table">
              <thead>
                <tr>
                  <th width="25%">名次</th>
                  <th>门店名称</th>
                  <th style="text-align:right; padding-right:80px;">销售额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rankData.sale" :key="index" :class="item.currentStore ? 'red' : ''">
                  <td>{{item.ranking}}</td>
                  <td>{{item.storeName}}</td>
                  <td style="text-align:right; padding-right:80px;">{{item.salesAmount}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col :span="12" style="height:480px" v-show="rankData.pieceSale.length">
          <div class="chart-area">
            <div class="cs-chart-tit clearfix">
              {{titData.pieceSaleT10.title}}
              <el-popover ref="s-pop1" placement="top" trigger="hover"
                :content="titData.pieceSaleT10.describe">
              </el-popover>
              <el-button v-popover:s-pop1 class="c-more">?</el-button>
            </div>
            <table class="table mt15 chart-table">
              <thead>
                <tr>
                  <th width="25%">名次</th>
                  <th>门店名称</th>
                  <th style="text-align:right; padding-right:80px;">销售件数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rankData.pieceSale" :key="index" :class="item.currentStore ? 'red' : ''">
                  <td>{{item.ranking}}</td>
                  <td>{{item.storeName}}</td>
                  <td style="text-align:right; padding-right:80px;">{{item.salesQuantity}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
.cs-wrapper .chart-wrapper{ margin-bottom:-20px;}
.cs-wrapper .chart-wrapper .pb-chart .el-col{ margin-top:0; margin-bottom:20px;}
.cs-wrapper .el-input__inner{ height:30px!important;}
.cs-wrapper .w160 .el-input__inner,
.cs-wrapper .w160.el-date-editor.el-input{ width:160px;}
.cs-wrapper .el-input__icon{ line-height:30px;}
.cs-wrapper .mr6{ margin-right:6px;}
.cs-wrapper .cdata-tit{ font-size: 14px; color:#000;}
.cs-wrapper .chart-area{ padding:15px;}
.cs-wrapper .chart-area .cs-chart-tit{ font-size: 13px; font-weight: bold; }
.cs-wrapper .chart-area .subtit{ display:block; color:#999; margin-top:10px; font-weight:normal;}
.cs-wrapper .chart-table.table,
.cs-wrapper .chart-table.table thead{ border:none}
.cs-wrapper .chart-table.table tr:nth-of-type(even){ background-color:#f6f6f6;}
.cs-wrapper .table .red td{ color:#ff0027;}
.cs-wrapper .el-select input[readonly][type=text]:hover{ border-color: #76a9e3!important;}
.cs-wrapper .btn-gray,
.cs-wrapper .btn-primary,
.cs-wrapper .btn-primary:active,
.cs-wrapper .btn-primary:hover,
.cs-wrapper .btn-primary:focus{ margin-left:0; vertical-align: middle; background:#4990e2; color:#fff;}
.cs-wrapper .el-button+.el-button{ margin-left:0;}
.cs-wrapper .btn-gray,
.cs-wrapper .btn-gray:hover,
.cs-wrapper .btn-gray:focus,
.cs-wrapper .btn-gray:active,
.cs-wrapper .btn-gray span{ background:#ccc!important; color:#fff;}
.chart-area .c-more:hover{ color:#73a3d9; border-color:#73a3d9;}
.cs-select-opt.el-select-dropdown__item.selected{ color:#2875cc; font-weight:normal;}
.cs-select-opt.hover, .el-select-dropdown__item.cs-select-opt:hover{ background-color:#eef6ff;}
</style>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { queryStatisticalList, queryArea, queryCity, queryStore, queryEmploy, jurisdiction } from 'api/jkService'
import barStackOption from '@/assets/js/crm/echarts-barStack'
import saleOption from '@/assets/js/crm/echarts-mixLineBar'
import pieDoughnutOption from '@/assets/js/crm/echarts-pieDoughnut'

export default {
  data () {
    return {
      pageWidth: document.body.offsetWidth - 20, // 页面宽度
      chartWidth: 0, // 图表宽度
      powerNum: 0, // 1区域2地区3门店4员工
      userPower: {
        page: false,
        area: false,
        city: false,
        store: false,
        employ: false,
        search: false
      },
      queryHolder: {
        area: '请选择',
        city: '请选择',
        store: '请选择',
        employ: '请选择'
      },
      queryData: {
        selectDate: '',
        rid: '',
        did: '',
        sid: '',
        eid: ''
      },
      cityData: {}, // 用于排行榜名称显示
      titData: {
        customer: {
          title: '客户总量',
          subtit: '',
          describe: '该区域集客客户总量'
        },
        newCustomer: {
          title: '新增客户总量',
          subtit: '',
          describe: '新增集客客户总量'
        },
        sale: {
          title: '销售数据统计',
          subtit: '',
          describe: '销售额：产生订单号的订单销售额（同一个订单中的每个导购员独立核算）</br>销售件数：订单中商品的件数（同一个订单中的每个导购员独立核算）'
        },
        pie: {
          title: '客户总量占比',
          describe: '潜在用户和注册会员在客户总量中的占比'
        },
        totalT10: {
          title: '客户总量TOP10',
          describe: '门店所属一级分部范围内客户总量排名前十的门店'
        },
        newCustomerT10: {
          title: '新增客户总量TOP10',
          describe: '门店所属一级分部范围内新增客户总量排名前十的门店'
        },
        saleT10: {
          title: '销售额TOP10',
          describe: '门店所属一级分部范围内销售额排名前十的门店'
        },
        pieceSaleT10: {
          title: '销售件数TOP10',
          describe: '门店所属一级分部范围内销售件数总量排名前十的门店'
        }
      },
      chartShow: {
        customer: false,
        newCustomer: false,
        sale: false,
        pieceSale: false
      },
      rankData: {
        customer: [],
        newCustomer: [],
        sale: [],
        pieceSale: []
      },
      selectData: {
        area: [],
        city: [],
        store: [],
        employ: []
      },
      listData: {},
      topTitle: '',
      selectBtn: false
    }
  },
  mounted () {
    var _this = this
    jurisdiction({
      pcode: 'mccr_statistical_page'
    }, function (data) {
      if (data.success === true || data.success === 'true') {
        if (data.login) {
          _this.userPower.page = data.data.mccr_statistical_page
          if (_this.userPower.page) {
            var date = new Date()
            _this.queryData.selectDate = date.getFullYear() + '-' + (date.getMonth() + 1)
            _this.chartWidth = parseInt((document.body.offsetWidth - 60) / 2 - 30) + 'px'

            _this.userPower.area = data.data.mccr_statistical_regional_button
            _this.userPower.city = data.data.mccr_statistical_division_button
            _this.userPower.store = data.data.mccr_statistical_store_button
            _this.userPower.employ = data.data.mccr_statistical_employ_button
            _this.userPower.search = data.data.mccr_statistical_search_button
            _this.initSelect()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    initSelect: function () {
      var _this = this
      this.powerNum = this.userPower.area ? 1 : this.userPower.city ? 2 : this.userPower.store ? 3 : this.userPower.employ ? 4 : 0
      switch (this.powerNum) {
        case 1:
          _this.selectArea()
          break
        case 2:
          _this.selectCity()
          break
        case 3:
          _this.selectStore()
          break
        case 4:
          _this.selectEmploy()
          break
      }
    },
    selectArea: function () {
      var _this = this
      queryArea({}, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.selectData.area = data.data
        }
      })
    },
    selectCity: function () {
      var _this = this
      queryCity({
        rid: _this.queryData.rid
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.selectData.city = data.data
          if (data && data.data && data.data.length > 0) {
            data.data.forEach(element => {
              _this.cityData[element.divisionId] = element.divisionName
            })
          }
        }
      })
    },
    selectStore: function () {
      var _this = this
      queryStore({
        did: _this.queryData.did
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.selectData.store = data.data
        }
      })
    },
    selectEmploy: function () {
      var _this = this
      queryEmploy({
        sid: _this.queryData.sid
      }, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.selectData.employ = data.data.employDetails
          if (_this.powerNum === 4) {
            _this.selectData.store = [{
              storeId: data.data.currentStoreId,
              storeName: data.data.currentStoreName
            }]
            _this.cityData[data.data.currentDivisionId] = data.data.currentDivisionName
            _this.queryData.sid = data.data.currentStoreId
            _this.queryData.did = data.data.currentDivisionId
          }
        }
      })
    },
    chartInit: function () {
      this.saleChartInit()
      this.pieDoughnutInit()
      this.customerTotalChartInit()
      this.newCustomerTotalChartInit()
    },
    statisticsSearch: function () {
      var _this = this
      this.pageWidth = document.body.offsetWidth - 40
      this.topTitle = this.cityData[this.queryData.did] + '排行榜'
      queryStatisticalList(this.queryData, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.listData = data.data ? data.data : {}
          var chartListData = data.data.statisticalChart

          _this.customerTotalChartInit(chartListData.totalUserChart, chartListData.totalUserTime)
          _this.newCustomerTotalChartInit(chartListData.newUserChart, chartListData.newUserChartTime)
          _this.saleChartInit(chartListData.saleChart, chartListData.saleTime)
          _this.pieDoughnutInit(chartListData.totalUserRatioChart)
          _this.rankData.customer = chartListData.totalUserRanking
          _this.rankData.newCustomer = chartListData.newUserRanking
          _this.rankData.sale = chartListData.saleAmountRanking
          _this.rankData.pieceSale = chartListData.salesQuantityRanking
        } else {
          _this.listData = {}
          _this.chartShow.customer = false
          _this.chartShow.newCustomer = false
          _this.chartShow.sale = false
          _this.chartShow.pie = false
          _this.rankData.customer = []
          _this.rankData.newCustomer = []
          _this.rankData.sale = []
          _this.rankData.pie = []
          let eroMessageBox = _this.$message(data.errMsg)
          setTimeout(() => {
            eroMessageBox.close()
          }, 1000)
        }
      })
    },
    customerTotalChartInit: function (data, subtime) {
      var myChart1 = this.$echarts.init(this.$refs.customerTotalChart)
      myChart1.clear()
      if (data) {
        var customerData = {
          legend: ['潜在客户量', '注册客户量'],
          type: 'customer',
          data: data
        }
        this.titData.customer.subtit = subtime
        this.chartShow.customer = true
        myChart1.setOption(barStackOption(customerData))
      } else {
        this.chartShow.customer = false
      }
    },
    newCustomerTotalChartInit: function (data, subtime) {
      var myChart2 = this.$echarts.init(this.$refs.newCustomerTotalChart)
      myChart2.clear()
      if (data) {
        var newCustomerData = {
          legend: ['新增潜在客户量', '新增注册客户量'],
          type: 'newCustomer',
          data: data
        }
        this.chartShow.newCustomer = true
        this.titData.newCustomer.subtit = subtime
        myChart2.setOption(barStackOption(newCustomerData))
      } else {
        this.chartShow.newCustomer = false
      }
    },
    saleChartInit: function (data, subtime) {
      var myChart3 = this.$echarts.init(this.$refs.saleChart)
      myChart3.clear()
      if (data) {
        var saleChartData = {
          legend: ['销售额', '销售件数'],
          data: data
        }
        this.chartShow.sale = true
        this.titData.sale.subtit = subtime
        myChart3.setOption(saleOption(saleChartData))
      } else {
        this.chartShow.sale = false
      }
    },
    pieDoughnutInit: function (data) {
      var myChart4 = this.$echarts.init(this.$refs.pieDoughnut)
      myChart4.clear()
      if (data) {
        var pieChartData = {
          title: '客户总量占比',
          legend: ['潜在用户', '注册会员'],
          data: data
        }
        this.chartShow.pieceSale = true
        myChart4.setOption(pieDoughnutOption(pieChartData))
      } else {
        this.chartShow.pieceSale = false
      }
    },
    isSelect: function () {
      if (this.powerNum === 4) {
        this.selectBtn = this.queryData.selectDate
      } else {
        this.selectBtn = (this.queryData.sid || this.queryData.eid) && this.queryData.selectDate
      }
    }
  },
  watch: {
    'queryData.selectDate': function () {
      this.isSelect()
    },
    'queryData.rid': function () {
      this.selectCity()
      this.queryData.did = ''
      this.queryData.sid = ''
      this.queryData.eid = ''
    },
    'queryData.did': function () {
      if (!(this.powerNum === 4 || this.powerNum === 0)) {
        this.selectStore()
        this.queryData.sid = ''
        this.queryData.eid = ''
      }
    },
    'queryData.sid': function () {
      this.selectEmploy()
      this.isSelect()
      this.queryData.eid = ''
    },
    'queryData.eid': function () {
      this.isSelect()
    }
  }
}
</script>
