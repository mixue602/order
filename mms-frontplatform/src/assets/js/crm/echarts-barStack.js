/**
 * from echarts bar-y-category modify
 * be used for statis page
 * author: wanghonglan
 * time: 2018-6-27
 */
export default function barStack (barData) {
  var initData = barData.data
  var bartype = barData.type
  var firstData = initData[0]
  var year = firstData.createDate.replace(/-\d{1,2}-\d{1,2}$/, '')
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (valueData) {
        var poiont1 = valueData[0]
        var poiont2 = valueData[1]
        var time = /\d{4}-\d{1,2}-\d{1,2}$/.test(poiont1.name) ? poiont1.name : (year + '-' + poiont1.name)
        return time + '<br/>' + barData.legend[0] + '：' + poiont1.data + '<br/>' + barData.legend[1] + '：' + poiont2.data
      }
    },
    legend: {
      y: 'bottom',
      data: barData.legend
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '3%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: initData.map(function (item, index) {
          return item.createDate ? (index === 0 ? item.createDate : item.createDate.replace(/^\d{4}-/, '')) : ''
        })
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: barData.legend.length > 0 ? barData.legend[0] : '',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            color: '#76a9e3'
          }
        },
        data: initData.map(function (item) {
          var data = bartype === 'customer' ? item.potentialUser : bartype === 'newCustomer' ? item.newPotentialUser : ''
          return data
        })
      },
      {
        name: barData.legend.length > 1 ? barData.legend[1] : '',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            color: '#ff9549'
          }
        },
        data: initData.map(function (item) {
          var data = bartype === 'customer' ? item.registerUser : bartype === 'newCustomer' ? item.newRegisterUser : ''
          return data
        })
      }
    ]
  }
  return option
}
