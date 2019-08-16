/**
 * be used for active-deploy page
 * time: 2018-07-04
 */
export default function barV (initData) {
  var option = {
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b} : {c}'
    // },
    legend: {
      bottom: '15',
      data: ['领券', '核销', '下单']
    },
    calculable: true,
    series: [
      {
        name: '数量',
        type: 'funnel',
        x: '10%',
        y: '20%',
        // x2: 80,
        y2: 10,
        width: '80%',
        height: '50%',
        min: 0,
        // max: 100,
        minSize: '0%',
        // maxSize: '100%',
        sort: 'descending', // 'ascending', 'descending'
        gap: 5,
        itemStyle: {
          normal: {
            // color: 各异,
            borderColor: '#fff',
            borderWidth: 1,
            label: {
              show: true,
              position: 'inside'
              // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
            },
            labelLine: {
              show: false,
              length: 10,
              lineStyle: {
                // color: 各异,
                width: 1,
                type: 'solid'
              }
            }
          },
          emphasis: {
            // color: 各异,
            borderColor: 'red',
            borderWidth: 5,
            label: {
              show: true,
              formatter: '{b}',
              textStyle: {
                fontSize: 20
              }
            },
            labelLine: {
              show: true
            }
          }
        },
        data: [
          {
            value: initData.data1,
            name: '领券' + initData.data1,
            itemStyle: {normal: {color: '#76a9e3'}}
          },
          {
            value: initData.data2,
            name: '核销' + initData.data2,
            itemStyle: {normal: {color: '#ff9549'}}
          },
          {
            value: initData.data3,
            name: '下单' + initData.data3,
            itemStyle: {normal: {color: '#e376c8'}}
          }
        ]
      }
    ]
  }
  return option
}
