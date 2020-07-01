<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="站点选择" prop="site">
        <el-select
          v-model="queryParams.stations"
          placeholder="请选择站点"
          clearable
          filterable
          size="small"
          style="width: 240px"
          multiple
        >
          <el-option
            v-for="dict in siteOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="要素选择" prop="element">
        <el-select
          v-model="queryParams.element"
          placeholder="请选择要素"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in elementOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期选择" prop="dateRange">
        <el-date-picker
          v-model="queryParams.dateTime"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script>
  import LineChart from './components/LineChart.vue'
  import { chart } from '@/api/weather/chart'

  export default {
    name: 'chart',
    components: {
      LineChart
    },
    data() {
      return {
        lineChartData:
          {
            expectedData: [],
            elementName: ''
          },
        // 遮罩层
        loading: true,
        // 自动站数据字典
        siteOptions: [],
        // 元素字典
        elementOptions: [
          {
            dictValue: 'temp',
            dictLabel: '温度（°C）'
          },
          {
            dictValue: 'pressure',
            dictLabel: '气压（hPa）'
          },
          {
            dictValue: 'humidity',
            dictLabel: '相对湿度（%）'
          },
          {
            dictValue: 'visibility',
            dictLabel: '能见度（km）'
          },
          {
            dictValue: 'rainfall',
            dictLabel: '降雨量（mm）'
          },
          {
            dictValue: 'windSpeed',
            dictLabel: '风速（m/s）'
          }
        ],
        // 时间选择器
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        // 查询参数
        queryParams: {
          stations: null,
          element: null,
          dateTime: null
        }
      }
    },
    created() {
      this.getDicts('weather_site').then(response => {
        this.siteOptions = response.data
      })
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        if(this.queryParams.dateTime===null||this.queryParams.dateTime.length == 0){
            this.$alert('时间不能为空', 'Alarm', {
              confirmButtonText: '确定'
          });
        }
        if(this.queryParams.stations===null||this.queryParams.stations.length == 0){
            this.$alert('站点不能为空', 'Alarm', {
              confirmButtonText: '确定'
            });
        }
        if(this.queryParams.element===null||this.queryParams.element.length == 0){
            this.$alert('要素不能为空', 'Alarm', {
              confirmButtonText: '确定'
            });
        }
        // 调用接口
        chart(this.queryParams).then(response => {
          this.lineChartData = response.data
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.stations=null;
        this.queryParams.element=null;
        this.queryParams.dateTime=null;
        // this.handleQuery()
      }
    }
  }
</script>
