/**
 * from echarts bar-y-category modify
 * be used for effect-statis-single page
 * author: wanghonglan
 * time: 2018-1-19
 */
export default function columnY (columnData, diff) {
  console.log(7877)
  /** Y轴标签, 必须数组格式 */
  var labelY = []
  var legendData = diff === 'crowd' ? ['下单人群', '目标人群'] : ['下单城市']
  var diffLength = diff === 'crowd' ? 2 : 1
  var seriesData = []
  var titleTxt = diff === 'crowd' ? '下单人群分析' : '下单城市TOP10'

  for (var i = 0; i < diffLength; i++) {
    seriesData.push({
      name: legendData[i],
      type: 'bar',
      data: [],
      itemStyle: {
        normal: {
          color: i === 0 ? '#76a9e3' : '#68b64c'
        }
      }
    })
  }
  columnData.map(function (mode, idx) {
    if (diff === 'crowd') {
      labelY.push(mode.memGrade)
      seriesData[0].data.push(mode.orderNum)
      seriesData[1].data.push(mode.targetNum)
    } else if (diff === 'city') {
      labelY.push(mode.city)
      seriesData[0].data.push(mode.orderNum)
    }
  })

  var option = {
    title: {
      text: titleTxt,
      textStyle: {
        fontSize: '13'
      },
      top: '10',
      left: '10'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        var tipText = ''
        params.map(function (item, index) {
          if (diff === 'crowd') {
            tipText += index === 0 ? (item.name + '订单量 ' + '<br />') : ''
            tipText += item.seriesName + ': ' + item.value
          } else {
            tipText += item.name + '<br />'
            tipText += '订单量: ' + item.value
          }
          tipText += index < params.length - 1 ? '</br>' : ''
        })
        return tipText
      }
    },
    grid: {
      top: '9%',
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: labelY
    },
    series: seriesData
  }
  if (diff === 'crowd') {
    option.legend = {
      data: legendData,
      bottom: '1%'
    }
  }
  return option
}
