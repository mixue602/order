/**
 * from echarts pie-doughnut modify
 * be used for effect-statis-single page
 * author: wanghonglan
 * time: 2018-6-27
 */
export default function pieDoughnut (initData) {
  var value1 = parseFloat(initData.data.potentialUserRatio)
  var value2 = parseFloat(initData.data.registerUserRatio)
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      itemGap: 12,
      data: initData.legend
    },
    series: [
      {
        name: initData.title,
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
          value: value1,
          name: initData.legend[0],
          itemStyle: {
            normal: {
              color: '#76a9e3'
            }
          }
        },
        {
          value: value2,
          name: initData.legend[1],
          itemStyle: {
            normal: {
              color: '#ff9549'
            }
          }
        }]
      }
    ]
  }
  return option
}
