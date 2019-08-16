/**
 * be used for active-deploy page
 * time: 2018-07-04
 */
export default function barV (initData) {
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: initData.data1
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        itemStyle: {
          normal: {color: '#76a9e3'}
        },
        data: initData.data2
      }
    ]
  }
  return option
}
