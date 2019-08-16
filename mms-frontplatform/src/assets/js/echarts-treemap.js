/**
 * from echarts treemap-obama modify
 * be used for effect-statis-single page
 * author: wanghonglan
 * time: 2018-1-19
 * dataJson例子
 */
export default function treemap (diskData, deep) {
  var option = {
    tooltip: {
      formatter: function (params) {
        return params.name + '<br />' + '商品数量：' + params.value
      }
    },
    series: [
      {
        name: '全部',
        type: 'treemap',
        visualDimension: null,
        levels: [{
          color: [
            '#76a9e3', '#e25fc2', '#ff9549', '#c689e3',
            '#8191ef', '#66c843', '#4cd2d4', '#ff8989',
            '#d69e46', '#f7cd09'
          ],
          olorMappingBy: 'id',
          itemStyle: {
            normal: {
              borderWidth: 2,
              gapWidth: 2
            }
          }
        }],
        label: {
          normal: {
            position: 'insideTopLeft',
            formatter: function (params) {
              var arr = deep !== 1 ? [
                '{budget| ' + params.treePathInfo[1].name + '}'
              ] : []
              arr.push(
                '{name| ' + params.name + '：' + params.value + '}'
              )
              return arr.join('\n')
            },
            rich: {
              budget: {
                fontSize: 16,
                lineHeight: 30,
                color: 'yellow'
              },
              household: {
                fontSize: 14,
                color: '#fff'
              },
              label: {
                fontSize: 9,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fff',
                borderRadius: 2
              },
              name: {
                fontSize: 12,
                color: '#fff'
              },
              hr: {
                width: '100%',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 0.5,
                height: 0,
                lineHeight: 10
              }
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#fff'
          }
        },
        data: diskData.map(function (mode, idx) {
          var seriesOpt = {}
          if (deep === 1) {
            seriesOpt.name = mode.brandName
            seriesOpt.value = mode.orderNum
          } else if (deep === 2) {
            seriesOpt.name = mode.categoryOne
            seriesOpt.value = mode.categoryOneNum
            seriesOpt.children = []
            mode.twoCategoryRDTOS.map(function (twoMode, twoIdx) {
              seriesOpt.children.push({name: twoMode.categoryTwo, value: twoMode.categoryTwoNum})
            })
          }
          return seriesOpt
        })
      }
    ]
  }
  return option
}
