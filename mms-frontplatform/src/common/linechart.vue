<template>
  <div class="chart-area">
    <div class="linechart-tit mt15 clearfix">
      <div class="tit-l">
        {{ lineTitle }}
        <el-popover ref="s-pop1" placement="top" trigger="hover"
          :content="lineSubTitle">
        </el-popover>
        <el-button v-popover:s-pop1 class="c-more">?</el-button>
        <span class="sub-tit">{{ lineData.dateInterval }}</span>
      </div>
      <!-- <div class="tit-r">
        <span class="sub-rate">↓ {{ rate }}<i>%</i></span>
        <span class="sub-tit">月环比</span>
      </div> -->
    </div>
    <div class="line-chart" ref="lineArea" :style="{width:'100%', height:'443px'}"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import lineChart from '@/assets/js/echarts-line'
export default {
  props: {
    'name': '',
    'lineData': {}
  },
  data () {
    return {
      'lineTitle': '',
      'lineSubTitle': '',
      'rate': '',
      'titleData': {
        'registTrendRDTO': {
          'title': '新注册会员趋势',
          'subTit': '新增注册会员数量'
        },
        'marketingTrendRDTO': {
          'title': '新增可营销会员趋势',
          'subTit': '可营销会员，包含：激活手机、激活邮箱、有token的用户数量'
        },
        'conversionRateTrendRDTO': {
          'title': '新客转化率趋势',
          'subTit': '新客转化率 = 新增注册且购买的会员人数 / 新增注册会员人数*100%'
        },
        'newNextRetainedRateTrendRDTO': {
          'title': '新增会员次日留存率趋势',
          'subTit': '新增会员次日留存率 = 前一天新增注册的会员且次日在网站上有行为的人数 / 前一天的新增注册会员人数*100%'
        },
        'dayLivelyTrendRDTO': {
          'title': '日活趋势',
          'subTit': '在当天访问过国美网站的独立用户数量（会员）'
        },
        'activeNextRetainedRateTrendRDTO': {
          'title': '活跃会员次日留存率趋势',
          'subTit': '活跃会员次日留存率=前一天的活跃会员第二天在网站上有行为的人数/前一天的活跃会员人数*100%'
        }
      }
    }
  },
  methods: {
    initChart: function () {
      var myChart = this.$echarts.init(this.$refs.lineArea)
      var line1 = this.lineData.cmTrendDetailRDTOS ? this.lineData.cmTrendDetailRDTOS : []
      var line2 = this.lineData.hmTrendDetailRDTOS ? this.lineData.hmTrendDetailRDTOS : []
      var length1 = line1.length
      var length2 = line2.length
      if (line1.length > line2.length && line2.length > 0) {
        line1.forEach((element, index) => {
          if (index > length2 - 1) {
            line2[index] = {
              'currentDate': line2[0].currentDate.replace(/-\d{1,2}$/, '') + '-' + (index + 1)
            }
          }
        })
      } else {
        line2.forEach((element, index) => {
          if (index > length1 - 1) {
            line1[index] = {
              'currentDate': line1[0].currentDate.replace(/-\d{1,2}$/, '') + '-' + (index + 1)
            }
          }
        })
      }
      var options = lineChart({
        data1: line1,
        data2: line2,
        lineTit: this.lineTitle
      })
      myChart.setOption(options)
    }
  },
  watch: {
    'lineData': function () {
      this.initChart()
    }
  },
  mounted () {
    this.lineTitle = this.titleData[this.name].title
    this.lineSubTitle = this.titleData[this.name].subTit
    this.rate = parseFloat(this.lineData.monthAnnularRatio)
    this.initChart()
  }
}
</script>

<style>
.chart-item{ float:left; margin-top:20px; width:50%; height:500px; border:1px solid #ccc;}
</style>
