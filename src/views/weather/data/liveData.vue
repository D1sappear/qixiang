<template>
  <div class="app-container">

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="数据编号" align="center" type="index"/>
      <el-table-column label="自动站名称" align="center" prop="name"/>
      <el-table-column label="温度" align="center" prop="temp"/>
      <el-table-column label="气压" align="center" prop="pressure"/>
      <el-table-column label="相对湿度" align="center" prop="humidity"/>
      <el-table-column label="风向" align="center" prop="windDirection"/>
      <el-table-column label="风速" align="center" prop="windSpeed"/>
      <el-table-column label="降雨量" align="center" prop="rainfall"/>
      <el-table-column label="时间" align="center" prop="dataTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dataTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { all } from '@/api/weather/allData'

  export default {
    name: 'LiveData',
    data() {
      return {
        siteOptions: [],
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
        postList: undefined,
        // 遮罩层
        loading: true,
        SelectParamList: [{
          value: '温度',
          label: '温度'
        }, {
          value: '气压',
          label: '气压'
        }, {
          value: '相对湿度',
          label: '相对湿度'
        }, {
          value: '风向',
          label: '风向'
        }, {
          value: '风速',
          label: '风速'
        }, {
          value: '降雨量',
          label: '降雨量'
        }],
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getList()
      this.getDicts('weather_site').then(response => {
        this.siteOptions = response.data
      })

    },
    methods: {
      getList() {
        all(this.queryParams).then(response => {
          this.postList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      handleSelectionChange(){

      }
    }
  }
</script>
