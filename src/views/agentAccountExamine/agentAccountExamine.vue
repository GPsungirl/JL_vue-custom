<template>
 <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields">
        <el-form :inline="true" :model="queryForm" size="mini" class="demo-form-inline">
          <!-- 名称 -->
          <el-form-item label="机构名称">
              <el-input v-model="queryForm.name" placeholder="请输入机构名称" class="wid_140"></el-input>
          </el-form-item>
          <!-- 周期 -->
          <el-form-item label="收益周期" >
            <el-date-picker
              class="wid_140"
              v-model="queryForm.profitTime"
              type="month"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>         
          <!-- 查询 -->
          <el-form-item>
              <el-button type="primary" size='mini' @click="queryData">查询</el-button>                  
          </el-form-item>
        </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
          <el-table-column prop="agentName" label="机构名称" width="" >
          </el-table-column>
          <el-table-column prop="account_total" label="收益金额" width="">
          </el-table-column>
          <el-table-column prop="shell_profit" label="贝壳收益" width="">
          </el-table-column>
          <el-table-column prop="other_profit" label="其他收益" width="">
          </el-table-column>
          <el-table-column prop="profit_time" label="收益周期" width="">
          </el-table-column>
          <el-table-column prop="" label="操作" width="">
          <template slot-scope="scope">              
              <el-button @click="handle_invoiceInfo(scope.row)" type="text" size="small">发票信息</el-button>
              <el-button @click="handle_review(scope.row)" type="text" size="small">审核</el-button>
          </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">  
          <el-pagination                
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"                      
          background
          layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
      </div>
    </div>
    <!-- M3 dialog 上传发票-->
    <el-dialog
      title="新增业务人员"
      :visible.sync="add_dialog"  
      width="30%"          
      center           
      > 
      <!-- body -->
      <div class="wid_b75">
          
      </div>   
        <!-- footer  -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
      <el-button type="primary"  size='mini'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- M4 dialog 发票详情 -->
 </div>
 
</template>

<script>
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
export default {
  name: 'agentAccountExamine',
  data(){
      return {
          // ***主列表数据
          tableLoading: false,
          tableData: [
            {
              agentName: 'xx', 
              account_total: 'xx',
              month:'xx',
              revenue_status:'xx',
              state: 'xx'
            }
          ],
          // ***查询区
          queryForm: {
            name:'',
            profitTime:'',

          },
          // 分页          
          pageTotal: 100,
          currentPage:1,
          // 弹框
          add_dialog:false,
            
      }
  },
  created(){
    //  获取所有数据    
    //this.getDataList();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    async getDataList(){
      let userId = this.$store.getters.userId;
      
      let  obj = {
        signInUserId: userId,
        signInRole: 'admin',
        pageNum:1,
        pageSize:10
      }
      const res = await this.$http.post(`${ commonUrl.baseUrl }/agentAccount/getAgentAccount`,{data:obj});
      console.log(res.data.data.agentAccountList);
      this.tableData = res.data.data.agentAccountList;
    },
    // 查询按钮
    queryData(){

    },
    // 收益状态 change事件
    changeProfitState(e){
      console.log
    },
    // 分页
    handleCurrentChange(val){
      this.currentPage = val       
      // 获取主页列表数据(loading状态)           
      //console.log(`当前页: ${val}`);
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
