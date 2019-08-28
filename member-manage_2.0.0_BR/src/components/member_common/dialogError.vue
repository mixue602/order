<template>
    <el-dialog title="提示" width="500px" :visible.sync="newBuildDialog" :before-close="handleClose">
      <p class="logText">{{markedWords}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="phoneStatus == 3 || phoneStatus == 2 || phoneStatus == 4 || phoneStatus == 5" class="buildBtn" @click="handleClose">取 消</el-button>
        <a v-if="phoneStatus == 2 && LOGINDATAErr.see" :href="['//mpf'+Env.cookieDomain+'/member/memberQuery?phone='+phone]" target="_blank"><el-button class="buildBtn" type="primary">查看会员</el-button></a>
        <a v-else-if="phoneStatus == 4 && LOGINDATAErr.upgradeSee" :href="['//mpf'+Env.cookieDomain+'/member/memberDetails?userId='+newlyUserId]" target="_blank"><el-button class="buildBtn" type="primary">查看线上会员</el-button></a>
        <a v-else-if="phoneStatus == 5 && LOGINDATAErr.tosetup" :href="['//omscsc'+Env.cookieDomain+'/csc/user/search.action']" target="_blank"><el-button class="buildBtn" type="primary">去操作</el-button></a>
        <a v-else-if="phoneStatus == 3 && LOGINDATAErr.tosetup" :href="['//omscsc'+Env.cookieDomain+'/csc/user/detail.action?userId='+newlyUserId]" target="_blank"><el-button class="buildBtn" type="primary">去操作</el-button></a>
        <el-button v-else class="buildBtn" @click="handleClose" type="primary">确定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import {mapState,mapActions} from  'vuex';
import Env from '@/api/env';
export default{
    props:{
        markedWords: String,
        phoneStatus: String,
        phone: String,
        newlyUserId: String,
        LOGINDATAErr: Object
    },
    data(){
        return {
            Env,
            newBuildDialog: true
        }
    },
    computed:mapState({
      LOGINDATA:'LOGINDATA'
    }),
    methods:{
        handleClose(){
            this.$emit('isErrLog',false);
            this.$message.warning('联系IT运维服务台解决');
        }
    }
}
</script>