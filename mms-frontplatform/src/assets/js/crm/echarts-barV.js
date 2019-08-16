/**
 * be used for active-deploy page
 * time: 2018-07-04
 */
export default function barV (initData) {
  var xTime = initData.time
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        crossStyle: {
          color: '#999'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: xTime.map(function (item, index) {
        return item ? (index === 0 ? item : item.replace(/^\d{4}-/, '')) : ''
      })
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '新增客户量',
      data: initData.data1,
      type: 'bar',
      itemStyle: {
        normal: {
          color: '#76a9e3',
          lineStyle: {
            color: '#76a9e3'
          }
        }
      }
    }]
  }
  return option
}
