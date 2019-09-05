<template>
  <div class="dashboard-container">
    <p class="title">
      <span>{{agent_name}}</span>
      ，欢迎登陆角落管理系统，您的机构代码为
      <span>{{agentid}}</span>
    </p>
    <div class="main_content">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple box_shadow ">
            <p class="jl_layout_center">上月收益</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple box_shadow">
            <p class="jl_layout_center">昨日收益</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple box_shadow">
            <p class="jl_layout_center">本月收益</p>
          </div>
        </el-col>
      </el-row>
    </div>
   
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common';
import qs from 'qs';
export default {
  name: 'Dashboard',
  data(){
    return{
      agent_name:'',
      agentid:'',
    }
  },
  created(){
    
    // 初始化数据
    this.getData();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    // 初始化数据
    getData(){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,                    
        }
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, param).then(res=>{
        if(res.data.code == '0000'){
          let result = res.data.data.userAgent
          this.agent_name = result.agent_name
          this.agentid = result.agentid
          loading.close()
        }else{
          
          this.m_message(res.data.msg, 'warning')
          loading.close()
        }
      }).catch(err=>{})
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
.main_content{
  margin-top:40px;
}
.title{
  color:#666;
  text-align: center;
}
.title span{
  color:#000;
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
