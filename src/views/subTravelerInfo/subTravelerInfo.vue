<!-- 下属向导查询 页面 subTravelerInfo-->
<template>
<div class="pad_5">
  <!-- M1 查询区域 -->
  <div class="query_fields pad_b_no">
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
      <!-- 向导ID -->
      <el-form-item label="向导ID" prop="customid" label-width>
        <el-input v-model="queryForm.customid" placeholder="请输入向导ID" class="wid_140"></el-input>
      </el-form-item>
      <!-- 向导姓名 -->
      <el-form-item label="向导姓名" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入向导姓名" class="wid_140"></el-input>
      </el-form-item>
      <!-- 向导状态 -->
      <el-form-item label="向导状态" label-width="68px" prop="traveler_status">
        <el-select v-model="queryForm.traveler_status" class="wid_140" placeholder="选选择向导状态" @change="changeOption_traveler_status($event)">
          <el-option v-for="(item, index) in queryForm.traveler_statuss" :key="index" :label=" item.txt " :value=" item.id "></el-option>
        </el-select>
      </el-form-item>

      <!-- 查询 -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="queryData">查询</el-button>
        <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
        <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- M2 主列表 -->
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
      <el-table-column prop="customid" label="向导ID" fixed="left" width=""></el-table-column>
      <el-table-column prop="name" label="姓名" width=""></el-table-column>

      <el-table-column prop label="性别" width="">
        <template slot-scope="scope">
            <span v-if="scope.row.sex == '01'">男</span>
            <span v-else-if="scope.row.sex == '02'">女</span>
        </template>
        </el-table-column>
        <el-table-column prop label="贝壳分成" width="">
          <template slot-scope="scope">
          {{ scope.row.virtual_rate +'%'}}
          </template>
        </el-table-column>
        <el-table-column prop label="出行分成" width="">
          <template slot-scope="scope">
          {{ scope.row.account_rate +'%'}}
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="出生日期" show-overflow-tooltip width></el-table-column>
        <el-table-column prop="address" label="居住地" show-overflow-tooltip width>
        </el-table-column>
        <el-table-column prop label="状态" width="">
          <template slot-scope="scope">
          <span v-if="scope.row.traveler_status == 0">待审核</span>
          <span v-else-if="scope.row.traveler_status == 1">可用</span>
          <span v-else-if="scope.row.traveler_status == 2">审批拒绝</span>
          <span v-else-if="scope.row.traveler_status == 3">不可用</span>
          </template>
        </el-table-column>
        <!-- 关注人数 -->
        <el-table-column prop="countFocus" label="关注人数" width></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="pageTotal" background
          layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import {
  isvalidPhone,
  validNum100,
  validNum15,
  validDyNum
} from "../../utils/validate";

export default {
  name: "subTravelerInfo",
  data() {
    return {
      customid: localStorage.getItem("pp_userId"),
      handle_width: "170px",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 0,
      currentPage: 1,
      // 查询参数
      queryForm: {

        // 向导ID
        customid: '',
        // 向导姓名
        name: '',
        // 向导状态
        traveler_statuss: [{
            id: 0,
            txt: "待审核"
          },
          {
            id: 1,
            txt: "可用 "
          },
          {
            id: 2,
            txt: '审批拒绝'
          },
          {
            id: 3,
            txt: "不可用"
          }
        ],
        traveler_status: "",
      }
    };
  },
  created() {
    // 初始化小细节
    this.initSomeData();

    // 初始化 主列表
    this.getTableDataList(1);
  },
  methods: {
    initSomeData() {
      // 表头操作列的宽度问题  区域代理时小，其他的大
      if (this.roleId == 10) {
        this.handle_width = "";
      }
    },

    // 获取主列表
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          up_customid: this.customid,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          // 向导ID
          customid: this.queryForm.customid,
          name: this.queryForm.name,
          traveler_status: this.queryForm.traveler_status,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/traveler/getSupTraveler`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            // debugger;
            this.tableData = res.data.data.travelerList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },

    // 向导与咨询职业互转 2全职向导 3咨询
    handle_transformTraveler_type(row) {
      // console.log(row)
      // debugger
      let confirmText = [];

      if (row.traveler_type == 2) {
        confirmText = ["请确认是否转换为旅游咨询?"];
      } else {
        confirmText = [
          "请确认是否转换为向导",
          "转换之后咨询人员需要在客户端申请成为向导?"
        ];
      }
      const newDatas = [];
      const h = this.$createElement;
      for (const i in confirmText) {
        newDatas.push(h("p", null, confirmText[i]));
      }
      let param = {
        data: {
          travelerid: row.travelerid,
          customid: row.customid,
          traveler_type: row.traveler_type
        }
      };
      this.$confirm("转换职业类型", {
        title: "转换职业类型",
        message: h("div", null, newDatas),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
        size: "mini",
        center: true
      }).then(() => {
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/updateType`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 调整分成 操作
    handle_check(row) {
      if (row.traveler_type == 3) {
        //旅游咨询
        this.modi_rate_form2.customid = row.customid;
        this.modi_rate_form2.traveler_type = row.traveler_type;
        this.modi_rate_form2.travelerid = row.travelerid;
        // 打开弹框
        this.modi_rate_dialogVisible2 = true;
        // 清空数据
        this.resetData("modi_rate_form");
        this.modi_rate_loading2 = true;
        let _param1 = {
          data: {
            // 公有
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            customid: row.customid
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/selectTravelerInfo`, _param1)
          .then(res => {
            console.log(res);

            if (res.data.code == "0000") {
              let result = res.data.data.travelerInfo;
              // 判断 区代 的贝壳 出行分成是不是空,空则取市代否则取区代
              if (
                result.area_account_rate == null &&
                result.area_virtual_rate == null
              ) {
                this.limit_virtual_rate = result.city_virtual_rate;
                this.limit_account_rate = result.city_account_rate;
              } else {
                this.limit_virtual_rate = result.area_virtual_rate;
                this.limit_account_rate = result.area_account_rate;
              }
              // 贝壳分成
              this.modi_rate_form2.virtual_rate = result.virtual_rate;
              this.modi_rate_form2.profit_virtual_rate =
                result.profit_virtual_rate;
              this.modi_rate_form2.profit_account_rate =
                result.profit_account_rate;
              this.modi_rate_loading2 = false;
            }
          })
          .catch(err => {});
      } else if (row.traveler_type == 2 || row.traveler_type == 1) {
        //兼职和全职
        this.modi_rate_form.customid = row.customid;
        this.modi_rate_form.traveler_type = row.traveler_type;
        this.modi_rate_form.travelerid = row.travelerid;
        // 打开弹框
        this.modi_rate_dialogVisible = true;
        // 清空数据
        this.resetData("modi_rate_form");

        this.modi_rate_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/selectTravelerInfo`, {
            data: {
              customid: row.customid
            }
          })
          .then(res => {
            console.log(res);
            // debugger
            if (res.data.code == "0000") {
              let result = res.data.data.travelerInfo;
              // 判断 区代 的贝壳 出行分成是不是空,空则取市代否则取区代
              if (
                result.area_account_rate == null &&
                result.area_virtual_rate == null
              ) {
                this.limit_virtual_rate = result.city_virtual_rate;
                this.limit_account_rate = result.city_account_rate;
              } else {
                this.limit_virtual_rate = result.area_virtual_rate;
                this.limit_account_rate = result.area_account_rate;
              }
              // 贝壳分成
              this.modi_rate_form.virtual_rate = result.virtual_rate;
              // 出行分成
              this.modi_rate_form.account_rate = result.account_rate;
              // 提成分成
              this.modi_rate_form.profit_account_rate =
                result.profit_account_rate;
              this.modi_rate_form.profit_virtual_rate =
                result.profit_virtual_rate;
              this.modi_rate_loading = false;
            }
          })
          .catch(err => {});
      }
    },
    // 保存调整分成(针对兼职和全职)
    save_check_ok() {
      // 确保必填
      if (this.m_valid_addForm("modi_rate_form")) {
        let param = {
          data: {
            account_rate: this.modi_rate_form.account_rate,
            virtual_rate: this.modi_rate_form.virtual_rate,
            profit_account_rate: this.modi_rate_form.profit_account_rate,
            profit_virtual_rate: this.modi_rate_form.profit_virtual_rate,

            travelerid: this.modi_rate_form.travelerid
            // customid:this.modi_rate_form.customid,
            // traveler_status:1,
            // traveler_type:this.modi_rate_form.traveler_type,
          }
        };
        this.modi_rate_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/updateTravelerRate`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.modi_rate_loading = false;
              this.modi_rate_dialogVisible = false;
              // 提示
              this.m_message(res.data.msg, "success");
              // 刷新主页面
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      }
    },

    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      // 根据参数进行查询
      this.getTableDataList(1);
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },



    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },
    // 新增 校验规则
    m_valid_addForm(formName) {
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
        } else {
          flag = false;
          return false;
        }
      });
      return flag;
    },

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },

  }
};
</script>

<style lang="scss">
.modi_rate .el-form-item {
  display: flex;
  justify-content: center;
}

.cell .el-button--small,
.cell .el-button--small.is-round {
  padding: 1px 0px;
}
</style>
