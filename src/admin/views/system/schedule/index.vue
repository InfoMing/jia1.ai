<template>
  <div class="app-container base-page app-container-backgroup" v-loading="loadingContainer">
    <div class="app-container-padding background-fff" :style="{ 'height': clientHeight }">
      <base-table :columns="tableColumn" header-title-icon="schedule"
        headerTitle="定时任务配置" search-field="jobName,classFullPath@按名称或者类路径搜索" showHeightSearch
        :heightSearchObj="heightSearchObj" heightSearchWidth="300px" :show-header-button="{ showColumn: true }"
        :column-button="{ delete: true, query: true, edit: true }" :set-obj="setObj" :main-obj="mainObj" :api="api"
        :paramValidated="paramValidated" showColumnIndex columnButtonWidth="200" ref="tableRef">

        <!-- 头部按钮 -->
        <template #buttonSlot>
        </template>

        <!-- 每个列表的内容 -->
        <template slot="columnButton" slot-scope="scope">
          <el-button v-show="'schedule_start'" v-if="scope.row.status == 3 || scope.row.status == 0"
            title="开启定时任务" type="text" @click.stop="startJob(scope.row)">
            启动
          </el-button>
          <el-button v-show="'schedule_stop'" v-if="scope.row.status == 1" title="关闭定时任务" type="text"
            @click.stop="stopJob(scope.row)">
            停止
          </el-button>
        </template>

        <!-- 高级搜索 -->
        <template #heightSearchSlot>
          <div class="flex search-input-wrap">
            <span class="tip">任务名称</span>
            <el-input class="value" size="small" placeholder="按名称模糊搜索" v-model="heightSearchObj.jobName" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">所属分组</span>
            <el-select class="value" size="small" clearable v-model="heightSearchObj.jobGroup" placeholder="请选择">
              <el-option v-for="(item, key) in $code.get('my_schedule_job@job_group,not_name')" :key="key" :label="item"
                :value="key">
              </el-option>
            </el-select>
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">Job类路径</span>
            <el-input class="value" size="small" placeholder="按路径模糊搜索" v-model="heightSearchObj.classFullPath" />
          </div>
          <div class="flex search-input-wrap">
            <span class="tip">状态</span>
            <el-select class="value" size="small" clearable v-model="heightSearchObj.status" placeholder="请选择">
              <el-option v-for="(item, key) in $code.get('my_schedule_job@status,not_name')" :key="key" :label="item"
                :value="key">
              </el-option>
            </el-select>
          </div>

        </template>

        <!-- 编辑框 -->
        <template #editOrAddInputSlot>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">任务名称</div>
            <div class="value">
              <el-input v-myfocus v-model="mainObj.jobName" placeholder="不允许为空" />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label not-null">所属分组</div>
            <div class="value">
              <el-select class="value" size="small" clearable v-model="mainObj.jobGroup" placeholder="请选择">
                <el-option v-for="(item, key) in $code.get('my_schedule_job@job_group,not_name')" :key="key"
                  :label="item" :value="key">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="my-edit-itew-wrap" style="width:100%;">
            <div class="label not-null">执行频率</div>
            <div class="value flex flex-x-between">
              <el-input style="display:inline-block;width:calc(100% - 170px)" v-model="mainObj.cronTime" disabled
                placeholder="请选择" />
              <el-button style="display:inline-block;" plain type="primary" size="small"
                @click="showCronWindow = true">选择
              </el-button>
              <el-button style="display:inline-block;" plain type="primary" size="small"
                @click="showRunTimeWindow = true; getLatelyRunTime();">最近10次运行</el-button>
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">开始时间</div>
            <div class="value">
              <el-input v-model="mainObj.startTime" placeholder="请输入内容" />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">结束时间</div>
            <div class="value">
              <el-input v-model="mainObj.endTime" placeholder="请输入内容" />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label">状态</div>
            <div class="value">
              <el-input disabled v-model="mainObj.status" placeholder="空" />
            </div>
          </div>
          <div class="my-edit-itew-wrap">
            <div class="label ">顺序</div>
            <div class="value">
              <el-input v-model="mainObj.sort" placeholder="0-1000之间的整数" />
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;">
            <div class="label">Job类路径</div>
            <div class="value">
              <el-input disabled v-model="mainObj.classFullPath" placeholder="请输入内容" />
            </div>
          </div>
          <div class="my-edit-itew-wrap" style="width: 100%;height:70px;line-height:70px;">
            <div class="label ">任务描述</div>
            <div class="value">
              <el-input type="textarea" v-model="mainObj.description" placeholder="" />
            </div>
          </div>
        </template>

      </base-table>
    </div>

    <!-- Cron表达式选择器 -->
    <el-dialog title="Cron表达式选择器" :visible.sync="showCronWindow" width="800px" :close-on-click-modal="false">
      <cron ref="cronRef" :value="mainObj.cronTime"></cron>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="getCronFormula">确 定</el-button>
        <el-button size="small" @click="showCronWindow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 最近运行次数 -->
    <el-dialog title="最近运行时间查询" :visible.sync="showRunTimeWindow" width="600px" :close-on-click-modal="false">
      <div class="run-time-wrap">
        <div class="item" v-for="(v, i) in latelyRunTime">
          <span class="tip">第{{ i + 1 }}次执行:</span>
          <span class="time"> {{ v }}</span>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="showRunTimeWindow = false">取 消</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { copyValue, clearValue, copySourceValueToTargetAttribute } from '@/common/utils';
import Cron from "./cron/index.vue";
import thisApi from "@/admin/api/schedule";
export default {
  name: "Company",
  components: { Cron },
  data() {
    return {
      clientHeight: "100%", // 页面高度，必须填写，用于表格计算高度
      showCronWindow: false, // cron选择器弹框
      // 高级搜索数据====================================================
      heightSearchObj: {
        jobName: "",
        jobGroup: "",
        classFullPath: "",
        status: "",
      },
      // table表格数据==================================================
      tableColumn: [
        { prop: "jobName", label: "名称", show: true },
        { prop: "jobGroup", label: "所属分组", width: "150", show: true },
        { prop: "classFullPath", label: "全路径", show: true },
        { prop: "cronTime", label: "执行频率", width: "150", show: true },
        { prop: "status", label: "状态", width: "100", show: true },
        { prop: "startTime", label: "开始时间", width: "100", show: true },
        { prop: "endTime", label: "结束时间", width: "100", show: true },
        { prop: "description", label: "描述", show: true },
        { prop: "sort", label: "序号", show: true },
        { prop: "createTime", label: "创建时间", show: true },
      ],

      // 增删改查相关数据 ==========================================
      // 详情数据
      mainObj: {
        id: "",
        description: "",
        jobName: "",
        jobGroup: "",
        classFullPath: "",
        cronTime: "",
        startTime: "",
        endTime: "",
        status: "",
        sort: "",
        createUserId: "",
        createTime: "",
        updateUserId: "",
        updateTime: "",
      },

      // 其他 ==================================================
      api: thisApi, // 操作api接口对象
      latelyRunTime: null, // cron表达式最近运行时间
      showRunTimeWindow: false, // 是否展示最近运行时间窗口
      loadingContainer: false, // 加载框
      status: [
        { lable: "初始化", value: 3 },
        { lable: "运行中", value: 1 },
        { lable: "停止", value: 0 },
      ]
    };
  },
  computed: {},
  created() { },
  methods: {
    // 给查看、新增、编辑赋初始值数据
    setObj(data, type) {
      if (type == "query") {
        let item = new Array();
        const colums = this.tableColumn;
        colums.map((v, k) => {
          if (v.prop == "description") return;
          item.push({
            label: v.label,
            value: data[v.prop],
          });
        });
        let item2 = [
          { label: "顺序号", value: data.sort },
          {
            label: "创建时间",
            value: data.createTime,
            valueStyle: "width:40%;",
          },
          {
            label: "更新时间",
            value: data.updateTime,
            valueStyle: "width:40%;",
          },
          { label: "描述", value: data.description },
        ];
        item = item.concat(item2);
        let result = { title: "定时任务详情", column: 2, item: item };
        copyValue(result, this.mainObj);
      } else if (type == "add") {
        // 新增赋值
      } else if (type == "edit") {
        if (data.status == 1) return "启动中的定时任务不允许编辑";
        copySourceValueToTargetAttribute(data, this.mainObj);
        // 赋值
        if (!this.mainObj.sort) this.mainObj.sort = 99;
      } else if (type == "page") {
        debugger
        this.$code.forEach(data, {
          status: "my_schedule_job@status",
          jobGroup: "my_schedule_job@job_group",
        });
      }
    },
    // 校验参数
    paramValidated(type) {
      let data = this.mainObj;
      let errorInfo = "";
      // 新增
      if (type == "add") {
        if (!data.name) errorInfo = "企业名称不能为空";
        return errorInfo;
      }

      // 编辑
      if (!data.jobName) errorInfo = "任务名称不能为空";
      if (!data.jobGroup) errorInfo = "所属分组不能为空";
      if (!data.cronTime) errorInfo = "执行频率不能为空";
      return errorInfo;
    },

    // 获取表达式
    getCronFormula() {
      // 若是表达式返回值空，则不允许关闭
      let d = this.$refs.cronRef.getValue();
      if (!d) return;

      this.mainObj.cronTime = d;
      this.showCronWindow = false;
    },

    // 获取Cron最近运行时间
    getLatelyRunTime() {
      thisApi.getLatelyRunTime(this.mainObj.cronTime, 10).then((res) => {
        if (!res.success) return;
        const data = res.data;
        this.latelyRunTime = data;
      });
    },

    // 启动定时任务
    startJob(row) {
      if (!row || !row.id || !row.status) {
        this.$message.error("无法获取任务信息，请刷新后重试");
        return;
      }
      if (row.status == 0) {
        this.$message.error("任务为初始化状态，请补充完整信息后重试");
        return;
      }
      if (row.status != 2) {
        this.$message.error("只有停用状态才可以启动，当前状态无法启动");
        return;
      }

      this.$confirm(`确定启动"${row.jobName}"任务吗?`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false, // 显示关闭按钮
        closeOnClickModal: false, // 点击其他地方关闭
        center: true, // 居中
      })
        .then(() => {
          this.loadingContainer = true;
          thisApi
            .startJob(row.id)
            .then((res) => {
              this.loadingContainer = false;
              if (!res.success) return;
              this.$message.success("启动成功");
              this.$refs.tableRef.initData();
            })
            .catch((errror) => {
              this.loadingContainer = false;
            });
        })
        .catch((error) => { });
    },

    // 停止定时任务
    stopJob(row) {
      if (!row || !row.id || !row.status) {
        this.$message.error("无法获取任务信息，请刷新后重试");
        return;
      }
      if (row.status != 1) {
        this.$message.error("只有启用状态才可以停止，当前状态无法停止");
        return;
      }
      this.$confirm(`确定停止"${row.jobName}"任务吗?`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false, // 显示关闭按钮
        closeOnClickModal: false, // 点击其他地方关闭
        center: true, // 居中
      })
        .then(() => {
          this.loadingContainer = true;
          thisApi
            .stopJob(row.id)
            .then((res) => {
              this.loadingContainer = false;
              if (!res.success) return;
              this.$message.success("停止成功");
              this.$refs.tableRef.initData();
            })
            .catch((errror) => {
              this.loadingContainer = false;
            });
        })
        .catch((error) => { });
    },

    // 增删改查方法 ===========================
    // 增加
    // addObj(success) {
    //   thisApi.addOne(this.mainObj).then(success);
    // },
    // // 修改
    // editObj(success) {
    //   thisApi.updateById(this.mainObj).then(success);
    // },
    // // 分页查询
    // getListByObj(data, success, fail) {
    //   thisApi.getListByObj(data).then(success).catch(fail);
    // },
    // // 删除单项
    // deleteObj(data, success) {
    //   thisApi.deleteByIds(data).then(success);
    // },
    // // 删除多条数据
    // deleteObjArray(dataArray, success) {
    //   thisApi.deleteByIds(dataArray).then(success);
    // },
  },
};
</script>

<style scoped lang="scss">
.run-time-wrap {
  padding: 10px 0;
  text-align: center;

  .item {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;

    .tip {
      width: 100px;
      display: inline-block;
      text-align: right;
      padding-right: 10px;
    }
  }
}

.scan-all-tip {
  display: block;
  margin-top: 20px;
  font-size: 12px;
  line-height: 1;
  color: #909399;
  position: absolute;
}
</style>
