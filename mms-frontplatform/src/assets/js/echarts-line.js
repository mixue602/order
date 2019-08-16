/**
 * from echarts confidence-band modify
 * be used for liveroom page
 * author: wanghonglan
 * time: 2018-1-18
 * dataJson格式例子：
 * {
    lineX: ['2018-1-1', '2018-1-5', '2018-1-10', '2018-1-15', '2018-1-20', '2018-1-25', '2018-1-30'],
    data1: [{
      'value': 345,
      'date': '2012-08-28'
    }],
    data2:  [{
      'value': 345,
      'date': '2012-08-28'
    }]
  }
 */
export default function confidenceBand (dataJson) {
  /* X轴日期时间传，格式['2018-1-1', 2018-1-2'] */
  var lineData1 = dataJson.data1
  var lineData2 = dataJson.data2
  var lineTit = dataJson.lineTit
  var lengendArr = []
  var percent = ''
  if (lineData1.length > 0) {
    lengendArr.push('本月趋势')
    percent = /%$/.test(lineData1[0].currentDateMsg) ? '%' : ''
  }
  if (lineData2.length > 0) {
    lengendArr.push('上月趋势')
  }
  var option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (valueData) {
        var valueObj = {}
        var todyData = {}
        var yesterday = ''
        var yesterdayRate = ''
        var yesterdayData = ''
        var rate = ''
        var isPercent = ''
        for (var i = 0; i < valueData.length; i++) {
          var name = valueData[i].seriesName === '本月趋势' ? 'tMonth' : (valueData[i].seriesName === '上月趋势' ? 'lMonth' : valueData[i].seriesName)
          valueObj[name] = valueData[i]
        }
        if (valueData && valueData.length > 0) {
          if ((valueObj.tMonth && valueObj.lMonth) || valueObj.tMonth) {
            todyData = valueObj.tMonth
            isPercent = /%$/.test(lineData1[0].currentDateMsg) ? '%' : ''
            todyData.axisValue = /^\d{4}-/.test(todyData.axisValue) ? todyData.axisValue : (lineData1[0].currentDate.replace(/\d{1,2}-\d{1,2}$/, '') + todyData.axisValue)
            yesterdayData = valueObj.data1.value * 100000000 + ''
            yesterdayRate = valueObj.yesData1.value
            rate = valueObj.rate1.value
          } else {
            if (!(valueObj.lMonth.value === undefined)) {
              todyData = valueObj.lMonth
              todyData.axisValue = lineData2[0].currentDate.replace(/-\d{1,2}$/, '') + (todyData.name.length > 8 ? (todyData.name.replace(/\d{4}-\d{1,2}/, '')) : (todyData.name.replace(/^\d{1,2}/, '')))
            }
            isPercent = /%$/.test(lineData2[0].currentDateMsg) ? '%' : ''
            yesterdayData = valueObj.data2.value * 100000000 + ''
            yesterdayRate = valueObj.yesData2.value
            rate = valueObj.rate2.value
          }
        }
        if (!(valueData[0].value === undefined)) {
          if (yesterdayData.length > 7) {
            yesterday = yesterdayData.substring(0, 4) + '-' + yesterdayData.substring(4, 6) + '-' + yesterdayData.substring(6)
          }
          var tipsTxt = lineTit + '<br />' + todyData.axisValue + ': ' + (isNaN(todyData.value) ? '0' : todyData.value) + isPercent + '<br />' +
             yesterday + ': ' + yesterdayRate + '<br />天环比: ' + (/^-/.test(rate) ? '<i class="green">↓</i>' : '<i class="red">↑</i>') + rate
        }
        return tipsTxt
      }
    },
    grid: {
      top: '3%',
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: lineData1.map(function (item, index) {
        return item.currentDate ? (index === 0 ? item.currentDate : item.currentDate.replace(/^\d{4}-/, '')) : ''
      })
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}' + percent
      }
    },
    series: [{
      name: '本月趋势',
      type: 'line',
      itemStyle: {
        normal: {
          color: '#76a9e3'
        }
      },
      data: lineData1.map(function (item) {
        var msg = /%$/.test(item.currentDateMsg) ? parseFloat(item.currentDateMsg) : item.currentDateMsg
        return msg
      })
    },
    {
      name: '上月趋势',
      type: 'line',
      itemStyle: {
        normal: {
          color: '#66c843'
        }
      },
      data: lineData2.map(function (item) {
        var msg = /%$/.test(item.currentDateMsg) ? parseFloat(item.currentDateMsg) : item.currentDateMsg
        return msg
      })
    },
    {
      name: 'rate1',
      type: 'line',
      data: lineData1.map(function (item) {
        return item.dayAnnularRatio ? item.dayAnnularRatio : 0
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    },
    {
      name: 'data1',
      type: 'line',
      data: lineData1.map(function (item) {
        var yesterdayData = parseInt(item.yesterday !== undefined ? item.yesterday.split('-').join('') : '') / 100000000
        return yesterdayData
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    },
    {
      name: 'yesData1',
      type: 'line',
      data: lineData1.map(function (item) {
        return item.yesterdayMsg ? item.yesterdayMsg : 0
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    },
    {
      name: 'rate2',
      type: 'line',
      data: lineData2.map(function (item) {
        return item.dayAnnularRatio ? item.dayAnnularRatio : 0
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    },
    {
      name: 'data2',
      type: 'line',
      data: lineData2.map(function (item) {
        var yesterdayData = parseInt(item.yesterday !== undefined ? item.yesterday.split('-').join('') : '') / 100000000
        return yesterdayData
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    },
    {
      name: 'yesData2',
      type: 'line',
      data: lineData2.map(function (item) {
        return item.yesterdayMsg ? item.yesterdayMsg : 0
      }),
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      stack: 'confidence-band',
      symbol: 'none'
    }]
  }
  if (lengendArr.length > 1) {
    option.legend = {
      bottom: '2%',
      data: lengendArr
    }
  }
  return option
}
