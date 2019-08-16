/**
 * from echarts map-china-dataRange modify
 * be used for effect-statis-single page
 * author: wanghonglan
 * time: 2018-1-18
 * dataJson格式例子：
 * [
      { name: '北京', value: this.randomData() },
      { name: '天津', value: this.randomData() }
    ]
 */
import 'echarts/map/js/china'
export default function mapChina (dataJson) {
  var mapArr = []
  dataJson.map(function (mode, idx) {
    var tempJson = {}
    tempJson.name = mode.state.replace(/省/g, '')
    tempJson.value = mode.orderNum
    mapArr.push(tempJson)
  })
  var option = {
    title: {
      text: '下单省份分布',
      textStyle: {
        fontSize: '13'
      },
      top: '10',
      left: '10'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        if (params.name) {
          var orderValue = isNaN(params.value) ? '0' : params.value
          return params.name + '</br>订单量: ' + orderValue
        }
      }
    },
    visualMap: {
      min: 0,
      max: 1000,
      left: '3%',
      top: 'bottom',
      text: ['高', '低'],
      calculable: false,
      /* 控制渲染数据颜色 */
      inRange: {
        color: ['#eef6ff', '#2875cc']
      }
    },
    series: [{
      name: '234234',
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      data: mapArr
    }]
  }
  return option
}
