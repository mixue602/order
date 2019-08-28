<template>
  <el-dialog width="80%" title="查看商品" :visible.sync="dialogTableVisible" :before-close="closeDialog">
    <el-table
    v-loading="loadingDetail"
    :data="unPaidGoodsInfoList"
    border
    max-height="360"
    :header-row-class-name="headerName"
    :header-cell-style="headerstyle"
    style="text-align:center;color:#606266"
    :empty-text="noGoodsInfo"
    >
      <el-table-column prop="skuNo" label="商品编号"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.fullDepositFlag ==1">全额订金</el-tag>
          {{scope.row.skuName}}
        </template>
      </el-table-column>
      <el-table-column prop="storageName" label="仓库" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" width="80" label="单价"></el-table-column>
      <el-table-column prop="quantity" label="商品数量"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="shoppingGuideName" label="导购员"></el-table-column>
      <el-table-column label="备注" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-show="!scope.row.editFlag" v-text="scope.row.memo"></span>
          <span v-show="scope.row.editFlag" class="cell-edit-input">
            <el-input v-model="scope.row.copyMemo" maxlength="100" @keyup.enter.native="switchSave(scope.row,'save')" placeholder="请输入"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="status" fixed="right" label="操作">
        <template v-if="LOGINDATA.orderplatform_agencyCounterDue_update" slot-scope="scope">
          <el-button v-show="scope.row.show" @click="switchSave(scope.row,'noSave')" type="text" size="small">修改备注</el-button>
          <el-button style="margin-left:0;" v-show="scope.row.operation" @click="switchSave(scope.row,'save')" type="text" size="small">保存</el-button>
          <el-button v-show="scope.row.operation" @click="switchSave(scope.row,'noSave')" type="text" size="small">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import API from '@/api/agency_counter_due/agency_counter_due';
import { mapState } from 'vuex';
export default {
  computed: mapState({
    LOGINDATA:"LOGINDATA"
  }),
  //父子组件直接传值
  props:{
    params: Object
  },
  created(){
    this.unPaidGoodsInfoList = [];
    this.loadingDetail = true;
    API.queryUnPaidGoodsItemInfoList(
      {
        storeCode: this.params.storeCode,
        orderId: this.params.orderId
      }
    ).then((data)=>{
      this.loadingDetail = false;
      if (data.success) {
        if (data.response != null) {
          //增加商品详情修改备注切换隐藏显示的参数
          let tempList = data.response;
          tempList.map(item => {
            item.show = true;
            item.operation = false;
            item.editFlag = false;
            item.copyMemo = "";
          });
          this.unPaidGoodsInfoList = tempList; 
        }
      }
      else {
        this.$message({
          showClose: true,
          message: data.respMsg,
          type: 'warning'
        });
      }
    });
  },
  data() {
    return {
      dialogTableVisible:true,
      //表格样式
      headerName:"headerName",//表格头部名称
      headerstyle:{           //表格头部样式
        "background":"#eef6ff"
      },
      //未付款商品详情信息列表
      loadingDetail: false,
      unPaidGoodsInfoList: [],
      noGoodsInfo:"暂无相关记录"
    }
  },
  methods: {
    //未付款商品列表是否修改备注事件
    switchSave(item,param) {
      if (param=='save') {
        if (item.copyMemo == null || item.copyMemo.trim().length <=0) {
          this.$message({
            showClose: true,
            message: '备注信息为空',
            type: 'warning'
          });
        }
        else {
          if (item.copyMemo.trim().length>0 && item.copyMemo.trim().length <=100) {
            //请求接口保存
            API.updateGoodsItemMemo(
              {
                storeCode: item.storeCode? item.storeCode:'',
                orderId: item.orderId? item.orderId:'',
                commerceItemId: item.commerceItemId? item.commerceItemId:'',
                memo: item.copyMemo
              }
            ).then((data)=>{
              if (data.success) {
                this.$message({
                  showClose: true,
                  message: '备注保存成功',
                  type: 'success'
                });
                item.show = !item.show;
                item.operation = !item.operation;
                item.editFlag = !item.editFlag;
                item.memo = item.copyMemo;
              }
              else {
                this.$message({
                  showClose: true,
                  message: data.respMsg,
                  type: 'warning'
                });
              }
            });
          }
        }
      }
      if (param == 'noSave') {
        item.show = !item.show;
        item.operation = !item.operation;
        item.editFlag = !item.editFlag;
        item.copyMemo = item.memo;
      }
    },
    //传递父组件关闭弹窗
    closeDialog() {
      this.$emit('IsClose',false);
    }
  }
};
</script>
<style>
.headerName div {
  text-align: center;
  font-size:14px;
  color:  #909399;
}
</style>
