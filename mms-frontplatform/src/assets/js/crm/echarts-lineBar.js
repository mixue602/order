/**
 * be used for active-deploy page
 * time: 2018-07-04
 */
export default function lineBar (initData) {
  var xTime = initData.time
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      bottom: '15px',
      data: ['销售额', '销售件数']
    },
    xAxis: [
      {
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        data: xTime.map(function (item, index) {
          return item ? (index === 0 ? item : item.replace(/^\d{4}-/, '')) : ''
        })
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        min: 0,
        // max: 200,
        interval: 100,
        axisLabel: {
          formatter: '{value}万'
        }
      },
      {
        type: 'value',
        name: '销售件数',
        min: 0,
        // max: 100,
        interval: 10,
        axisLabel: {
          formatter: '{value}件'
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        itemStyle: {
          normal: {color: '#76a9e3'}
        },
        barGap: '-10%',
        barCategoryGap: '10%', // 柱形图的粗细
        // data: dataShadow,
        data: initData.data1
      },
      {
        name: '销售件数',
        type: 'line',
        itemStyle: {
          normal: {color: '#ff9549'}
        },
        yAxisIndex: 1,
        data: initData.data2
      }
    ]
  }
  return option
}
