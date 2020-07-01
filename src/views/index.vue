<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="alarmList"
      @selection-change="handleSelectionChange"
      border="true"
      empty-text="暂无预警信息"
    >
      <el-table-column label="序号" align="center" type="index" width="100" />
      <el-table-column label="预警区域" align="center" prop="area" />

      <el-table-column label="预警图标" align="center" prop="alarmImgUrl" width="100">
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <img :src="scope.row.alarmImgUrl" min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column label="预警类别" align="center" prop="alarmType" width="100" />
      <el-table-column label="预警名称" align="center" prop="single" width="150" />
      <el-table-column label="预警内容" align="center" prop="signalContent" />
      <el-table-column label="发布时间" align="center" prop="pubTime" width="100"></el-table-column>
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
import { alarmList } from "@/api/weather/alarm";
import Editor from "@/components/Editor";

export default {
  name: "Index",
  components: {
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 公告表格数据
      alarmList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      alarmList(this.queryParams).then(response => {
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>