<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "450px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    // 设置图表属性
    setOptions({ expectedData, elementName } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: this.elementNameFormat(elementName) + "图表"
          // textAlign:"center"
        },
        xAxis: {
          name: "数据时段（小时）",
          nameLocation: "center",
          nameGap: 30,
          nameTextStyle: {
            fontWeight: "bolder",
            fontSize: 15
          },
          data: [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00"
          ],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 30,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          axisLabel: {
            // formatter: "{value} °C"
            formatter: this.formatter(elementName)
          },
          axisTick: {
            show: false
          }
        },
        legend: {
          // data: [elementName]
          data: this.handleLegend(expectedData)
          // data: [
          //   {
          //     name: "龙华"
          //   },
          //   {
          //     name: "观澜"
          //   }
          // ]
        },
        series: this.handleSeries(expectedData, elementName)
        // series: [
        //   {
        //     name: elementName,
        //     connectNulls: true,
        //     itemStyle: {
        //       normal: {
        //         // color: "#FF005A",
        //         color: this.formatterColor(elementName),
        //         lineStyle: {
        //           color: this.formatterColor(elementName),
        //           width: 2
        //         },
        //         areaStyle: {
        //           color: "#fff1f0"
        //         },
        //         label: { show: true }
        //       }
        //     },
        //     smooth: true,
        //     type: "line",
        //     data: expectedData,
        //     // animationDuration: 2800,
        //     // animationEasing: "cubicInOut"
        //     animation: false
        //   }
        // ]
      });
    },
    elementNameFormat(elementName){
      if(!elementName){
        return "";
      }
      if (elementName == "temp") {
        return "温度（°C）";
      }
      if (elementName == "pressure") {
        return "气压（hPa）";
      }
      if (elementName == "humidity") {
        return "相对湿度（%）";
      }
      if (elementName == "visibility") {
        return "能见度（km）";
      }
      if (elementName == "rainfall") {
        return "降雨量（mm）";
      }
      if (elementName == "windSpeed") {
        return "风速（m/s）";
      }

    },
    formatter(elementName) {
      if (elementName == "temp") {
          return "{value} °C";
        }
      if (elementName == "pressure") {
        return "{value} hPa";
      }
      if (elementName == "humidity") {
        return "{value} %";
      }
      if (elementName == "visibility") {
        return "{value} km";
      }
      if (elementName == "rainfall") {
        return "{value} mm";
      }
      if (elementName == "windSpeed") {
        return "{value} m/s";
      }
    },
    formatterColor(elementName) {
      return "#FF005A";
    },
    handleSeries(expectedData, elementName) {
      const list = [];
      expectedData.filter((item, i) => {
        const series = {
          name: item.siteName,
          connectNulls: true,
          itemStyle: {
            normal: {
              // color: "#FF005A",
              // color: this.formatterColor(elementName),
              // lineStyle: {
              //   color: this.formatterColor(elementName),
              //   width: 2
              // },
              // areaStyle: {
              //   color: "#fff1f0"
              // },
              label: { show: true }
            }
          },
          smooth: true,
          type: "line",
          data: item.data,
          // animationDuration: 2800,
          // animationEasing: "cubicInOut"
          animation: false
        };
        list.push(series);
      });
      return list;
    },
    handleLegend(expectedData) {
      const list = [];

      expectedData.filter((item, i) => {
        list.push(
          {
            name:item.siteName
          }
        )
      });
      return list;
    }
  }
};
</script>
