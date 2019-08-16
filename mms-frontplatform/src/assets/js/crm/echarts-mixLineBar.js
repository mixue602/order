/**
 * from echarts mix-line-bar modify
 * be used for effect-statis-single page
 * author: wanghonglan
 * time: 2018-6-27
 */
export default function mixLineBar (mixData) {
  var initData = mixData.data
  var firstData = initData[0]
  var year = firstData.createDate.replace(/-\d{1,2}-\d{1,2}$/, '')
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: function (valueData) {
        var poiont1 = valueData[0]
        var poiont2 = valueData[1]
        var time = /\d{4}-\d{1,2}-\d{1,2}$/.test(poiont1.name) ? poiont1.name : (year + '-' + poiont1.name)
        return time + '<br/>' + mixData.legend[0] + '：' + poiont1.data + (poiont1.data > 0 ? '万' : '') + '<br/>' + mixData.legend[1] + '：' + poiont2.data
      }
    },
    legend: {
      y: 'bottom',
      data: mixData.legend
    },
    grid: {
      top: '9%',
      left: '3%',
      right: '3%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        data: initData.map(function (item, index) {
          return item.createDate ? (index === 0 ? item.createDate : item.createDate.replace(/^\d{4}-/, '')) : ''
        })
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: mixData.legend.length > 0 ? mixData.legend[0] : '',
        axisLabel: {
          formatter: '{value} 万'
        }
      },
      {
        type: 'value',
        name: mixData.legend.length > 1 ? mixData.legend[1] : '',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: mixData.legend.length > 0 ? mixData.legend[0] : '',
        type: 'bar',
        data: initData.map(function (item, index) {
          return (item.salesAmount / 10000).toFixed(2)
        }),
        itemStyle: {
          normal: {
            color: '#76a9e3'
          }
        }
      },
      {
        name: mixData.legend.length > 1 ? mixData.legend[1] : '',
        type: 'line',
        yAxisIndex: 1,
        data: initData.map(function (item, index) {
          return item.salesQuantity
        }),
        itemStyle: {
          normal: {
            color: '#ff9549'
          }
        }
      }
    ]
  }
  return option
}
