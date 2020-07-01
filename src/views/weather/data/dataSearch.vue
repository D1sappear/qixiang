<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="站点选择" prop="stationName">
        <el-select v-model="queryParams.stationList" placeholder="站点选择" clearable size="small" multiple>
          <el-option
            v-for="dict in siteOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时段选择" prop="datePicker">
        <el-date-picker
          v-model="queryParams.timeRange"
          placeholder="选择时段"
          type="datetimerange" range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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
  import { liveData } from '@/api/weather/livedata'

  export default {
    name: 'LiveData',
    data() {
      return {
        siteOptions: [],
        // 遮罩层
        loading: true,
        postList: undefined,
        total: 0,
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
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          stationList: [],
          timeRange: []
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
      /** 查询岗位列表 */
      getList() {
        liveData(this.queryParams).then(response => {
          this.postList = response.rows
          this.total = response.total
          this.loading = false
        })
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.timeRange = []
        this.queryParams.stationList = []
        this.handleQuery()
      },
      handleSelectionChange() {

      }
    }
  }
</script>
