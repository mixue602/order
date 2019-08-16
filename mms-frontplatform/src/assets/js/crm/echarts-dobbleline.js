/**
 * be used for active-deploy page
 * time: 2018-07-04
 */
export default function dobbleLine (initData) {
  var xTime = initData.time
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
      }
    },
    legend: {
      bottom: '15',
      data: ['PV', 'UV']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xTime.map(function (item, index) {
        return item ? (index === 0 ? item : item.replace(/^\d{4}-/, '')) : ''
      })
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: 'PV',
        type: 'line',
        data: initData.data1,
        itemStyle: {
          normal: {
            color: '#ff9549',
            lineStyle: {
              color: '#ff9549'
            }
          }
        },
        markPoint: {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        }
      },
      {
        name: 'UV',
        type: 'line',
        data: initData.data2,
        itemStyle: {
          normal: {
            color: '#76a9e3',
            lineStyle: {
              color: '#76a9e3'
            }
          }
        },
        markPoint: {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        }
      }
    ]
  }
  return option
}
