<template>
    <!-- 贝壳收益 页面 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no handle_timerange">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
                <!-- 收益类型 -->
                <el-form-item label="收益类型" prop="virtual_class" label-width="68px">
                    <el-select v-model="queryForm.virtual_class" placeholder="请选择收益类型" class="wid_140">
                    <el-option
                        v-for="(item, index) of queryForm.virtual_classs"
                        :key="index"
                        :label="item.value"
                        :value="item.id"
                        >
                    </el-option>
                    </el-select>
                </el-form-item>
                <!-- 用户ID virtualSourceCustomid-->
                <el-form-item label="用户ID" prop="virtualSourceCustomid" label-width="68px">
                    <el-input v-model="queryForm.virtualSourceCustomid" placeholder="请输入用户ID" class="wid_140"></el-input>
                </el-form-item>
                <!-- 用户昵称 -->
                <el-form-item label="用户昵称" prop="nickName" label-width="68px">
                  <el-input v-model="queryForm.nickName" placeholder="请输入用户昵称" class="wid_140"></el-input>
                </el-form-item>


                <!-- 出行时间 -->
                <el-form-item label="收益时间" prop="allTime">
                    <el-date-picker
                        v-model="queryForm.allTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <!-- 查询 -->
                <el-form-item>
                    <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                    <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
                    <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>

                </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="" label="收益类型" width="" >
                    <!-- 收益类型1礼物 2红包 -->
                    <template slot-scope="scope">
                        <span v-if="scope.row.virtual_class == 1">礼物</span>
                        <span v-else-if="scope.row.virtual_class == 2">红包</span>
                    </template>
                </el-table-column>
                <el-table-column prop="virtual_name" label="订单信息" width="">
                </el-table-column>
                <el-table-column prop="virtual_gift_price" label="礼物单价(贝壳)" width="">
                </el-table-column>
                <el-table-column prop="virtual_gift_num" label="礼物数量" width="">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价(贝壳)" width="">
                </el-table-column>
                <el-table-column prop="virtualSourceCustomid" label="用户ID" width="">
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称" width="">
                </el-table-column>
                <el-table-column prop="customAmount" label="自身收益" width="">
                </el-table-column>
                <el-table-column prop="createtime" show-overflow-tooltip label="订单时间" width="">
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
    </div>
</template>
<script>
import commonUrl from '../../utils/common';

export default {
    name: 'virtualProfit',
    data(){
        return {

            //name:localStorage.getItem('pp_real_name'),
            customid:localStorage.getItem('pp_userId'),
            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {
                virtual_classs:[
                    {
                        id:1,
                        value:'礼物'
                    },
                    {
                        id:2,
                        value:'红包'
                    }
                ],
                // 收益类型
                virtual_class:'',

                // 用户ID
                virtualSourceCustomid:'',
                // 用户昵称
                nickName:'',

                // 所有时间
                allTime:'',
                // 结束时间
                endTime:'',
                // 开始时间
                startTime:'',

            },
        }
    },
    created(){

        // 初始化主列表
        this.getTabelDataList(1)
    },
    methods:{
        // 初始化主列表
        getTabelDataList(pageNum){
            // 参数
            let param = {
                data: {
                    // 公有
                    customid: this.customid,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 收益类型
                    virtual_class:this.queryForm.virtual_class,

                    // 用户昵称
                    nickName:this.queryForm.nickName,
                    // 用户ID
                    virtualSourceCustomid:this.queryForm.virtualSourceCustomid,

                    // 出行开始时间
                    startTime:this.queryForm.startTime,
                    // 出行结束时间
                    endTime:this.queryForm.endTime,

                }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/virtualProfit/selectVirtualProfit`, param).then(res=>{

                if(res.data.code == '0000'){

                    console.log(res)
                    debugger

                    this.tableData =  res.data.data.virtualProfitList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    // 关闭加载
                    this.tableLoading = false
                }
            }).catch(err=>{})
        },
        // 刷新
        handle_refresh(){
            this.getTabelDataList(1)
            this.currentPage = 1
        },
        // 查询按钮
        queryData(){

            if(this.queryForm.allTime.length > 0){
                // 修正 开始 和结束 时间
                this.queryForm.startTime = this.queryForm.allTime[0]
                this.queryForm.endTime = this.queryForm.allTime[1]
            }

            this.getTabelDataList(1);
        },
        // 重置按钮
        resetData(formName){
            this.$refs[formName].resetFields();
            // 对于queryForm 下拉
            this.queryForm.startTime = ''
            this.queryForm.endTime = ''
        },
        // 分页
        handleCurrentChange(val){
             this.currentPage = val
            // 获取单前页数据列表
            this.getTabelDataList(val);
            //console.log(`当前页: ${val}`);
        },
         // 提示信息 message:提示信息   type 提示类型
        m_message(message,type){
            this.$message({
                message,
                type
            })
        },

    }
}
</script>
