<template>
  <div class="chart-area">
    <div class="line-chart" ref="lineArea" :style="{width:'100%', height:'443px'}"></div>
  </div>
</template>

<script>
export default {
  props: {
    'name': '',
    'lineData': ""
  },
  data () {
    return {
      
    }
  },
  methods: {
    initChart: function () {
      var myChart = this.$echarts.init(this.$refs.lineArea)
      let regionName = [];
      let salesAmount = [];
      this.lineData.map(function (item, index) {
        if(item.regionName){
          regionName.push(item.regionName);
        };
        if(item.salesAmount){
          salesAmount.push(item.salesAmount);
        }
      });
      console.log(salesAmount)
      var options= {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['销售额']
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                boundaryGap : [0, 0.01]
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : regionName
            }
        ],
        series : [
          {
              name:'销售额(万)',
              type:'bar',
              data:salesAmount,
              barWidth : 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: 'right', //在上方显示
                    textStyle: { //数值样式
                        color: 'black',
                        fontSize: 16
                    }
                  },
                  color: function (params){
                      var colorList = ['rgb(102,177,255)','rgb(102,177,255)','rgb(102,177,255)','rgb(102,177,255)'];
                      return colorList[params.dataIndex];
                  }
                }
              }
          }
        ]
      };
      myChart.setOption(options)
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

