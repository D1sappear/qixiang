<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      style="margin-top:15px;"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <el-table :data="dataList" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" width="150" align="center" label="日期" fixed></el-table-column>
            <template v-for="(col,i) in timeList">
              <el-table-column :label="col" :key="col" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.name != '图标'">{{scope.row.data[i]}}</span>
                  <span v-else>
                    <img :src="scope.row.data[i]" min-width="50" height="50" />
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>





<script>
import { forecastList } from "@/api/weather/forecast";
import Editor from "@/components/Editor";

export default {
  name: "forecast",
  components: {
    Editor
  },
  data() {
    return {
      //遮罩层
      loading: true,
      dataList: [],
      timeList: [],
      tabMapOptions: [
        { label: "未来十二小时天气预报", key: "Twe" },
        { label: "未来十天天气预报", key: "Ten" }
      ],
      activeName: "Twe"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      forecastList(this.activeName).then(response => {
        console.log(this.activeName);
        this.dataList = response.data.dataList;
        this.timeList = response.data.timeList;
        this.loading = false;
      });
    },
    handleClick(tab, event) {
      this.loading = true;
      forecastList(tab.name).then(response => {
        this.dataList = response.data.dataList;
        this.timeList = response.data.timeList;
        this.loading = false;
      });
    }
  }
};
</script>


