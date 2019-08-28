<template>
  <div>
    <el-row class="queryHeader">
      <div class="queryHeaderTle">会员地址管理</div>
      <div class="addressHead">
        <el-button size="mini" @click="goBack">返回</el-button>
        <el-button size="mini" v-if="LOGINDATA.membermanage_memberAddress_increase" @click="addAddress">新增</el-button>
      </div>
    </el-row>
    <div class="batchDelete">
      <el-button size="mini" v-if="LOGINDATA.membermanage_memberAddress_batchDelet" @click="batchRemove">批量删除</el-button>
      <span>勾下方的复选框，进行批量删除，每次最多选择5条</span>
    </div>
    <el-table
      :data="tableData"
      align="center"
      header-row-class-name = "tabelTab"
      @selection-change="selsChange"
      border>
      <el-table-column
      align="center"
      width="80"
      type="selection"
      label="多选">
      </el-table-column>
      <el-table-column
        type="index"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        property="firstName"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        property="mobiles"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        property="addressDetails"
        align="center"
        label="地址">
      </el-table-column>
      <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          v-if="LOGINDATA.membermanage_memberAddress_edit"
          type="primary" plain
          @click="theEditor(scope)">编辑</el-button>
        <el-button
          size="mini"
          v-if="LOGINDATA.membermanage_memberAddress_remove"
          type="primary" plain
          @click="removeAddress(scope)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-dialog v-if="isDialog" :visible.sync="dialogType" :before-close="dialogEvt">
      <el-form :model="ruleList" ref="ruleList" :rules="rules2" label-position="right" label-width="100px">
        <el-form-item label="姓名：" prop="name" style=" width:50%;" class="is-required">
          <el-input size="small" v-model="ruleList.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone" style=" width:50%;" class="is-required">
          <el-input size="small" v-model="ruleList.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在区域：" class="is-required">
          <!-- <el-input size="small"></el-input> -->
          <g-city @changeend="changeend" v-model="codeobj"></g-city>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address" class="is-required">
          <el-input size="small" v-model="ruleList.address" maxLength="80"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEvt">取 消</el-button>
        <el-button type="primary" @click="confirmChange('ruleList')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api/api_address/memberAddress'
import {mapState,mapActions} from  'vuex'
export default {
  data(){
    var addressName = (rule, value, callback) => {
      var len = 0;
      value?value=value:value="";
      for(var i=0; i<value.length; i++){
        var a = value .charAt(i);
        if(a.match(/[^\x00-\xff]/ig) != null){
          len += 2;
        }else{
          len += 1;
        }
      }
      if(len == 0){
        callback(new Error("姓名不能为空"));
      }else if(len > 60 || len < 4){
        callback(new Error("姓名长度在4-60个字符"));
      }else if(!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\·\_]+$/.test(value)){
        callback(new Error("不能输入特殊字符"));
      }else{
        callback();
      }
    }
    var addressPhone = (rule, value, callback) => {
      if(value == ""){
        callback(new Error('手机号不能为空'));
      }else if(!/^1[3456789]\d{9}$/.test(value)){
        callback(new Error('请输入正确的手机号'));
      }else{
        callback();
      }
    }
    var addressAddress = (rule, value, callback) => {
      if(value == "" || value.trim() == ""){
        callback(new Error('详细信息不能为空'));
      }else if(!/^[0-9a-zA-Z\u4e00-\u9fa5\.()（）\·\|#,.，。\-]+$/.test(value)){
        callback(new Error('输入格式不正确'));
      }else{
        callback();
      }
    }
    return{
      userId: this.$route.params.userId,      //用户Id
      dialogType: true,
      isDialog: false,      //判断弹框显示
      isBtnType: "1",        //判断是修改还是新增
      tableData: [],
      editorData: {},
      checkedCities:[],
      codeobj:{
        "aeracode1":{
          label: "北京",
          code: "11000000",
          disabel: true
        },
        "aeracode2":{
          label: "北京市",
          code: "11010000",
          disabel: true
        },
        "aeracode3":{
          label: "朝阳区",
          code: "11010200",
          disabel: true
        },
        "aeracode4":{
          label: "朝外街道",
          code: "110102002",
          disabel: true
        }
      },
      ruleList:{
        name: '',
        phone: '',
        address: ''
      },
      rules2: {
        name:[
          {validator:addressName, trigger: 'blur'}
        ],
        phone:[
          {validator:addressPhone, trigger: 'blur'}
        ],
        address:[
          {validator:addressAddress, trigger: 'blur'}
        ]
      }
    }
  },
  created(){
    this.addrQuerys();
  },
  computed:mapState(['LOGINDATA']),
  methods:{
    goBack: function () {
      this.$router.go(-1)
    },
    // 地址选择
    selsChange(checkedCities){
      if(checkedCities.length>5){
        this.$message.error('每次最多可选择5条'); 
        // checkedCities = checkedCities.slice(0,5);
      }
      this.checkedCities = checkedCities.map(function(elt){
        return elt.id;
      })
      console.log(this.checkedCities);
    },
    // 地址信息渲染、处理
    addrQuerys(){
      API.addrQuery({'uid':this.userId}).then(res => {
        if(res.success){
          this.tableData = res.data;
          if(this.tableData != null){
            this.tableData.forEach((item, idx) => {
              item.addressDetails = item.stateName+item.cityName+item.countyName+item.townName+'*****';
              item.mobiles = item.mobile.substring(0,3)+'****'+item.mobile.substring(7,11);
            });
          }
        }
      })
    },
    addAddress(){
      this.isDialog = true;
      this.isBtnType  = "1";
    },
    // 点击单个地址的详情
    theEditor(scope){
      this.isDialog = true;
      this.isBtnType = "2";
      API.addrQueryById({'uid':this.userId, 'aid':scope.row.id}).then(res => {
        if(res.success){
          this.editorData = res.data;
          this.ruleList.name = res.data.firstName;
          this.ruleList.phone = res.data.mobile;
          this.ruleList.address = res.data.address;
          this.codeobj.aeracode1.label = res.data.stateName;
          this.codeobj.aeracode1.code = res.data.state;
          this.codeobj.aeracode2.label = res.data.cityName;
          this.codeobj.aeracode2.code = res.data.city;
          this.codeobj.aeracode3.label = res.data.countyName;
          this.codeobj.aeracode3.code = res.data.county;
          this.codeobj.aeracode4.label = res.data.townName;
          this.codeobj.aeracode4.code = res.data.town;
        }
      })
    },
    // 删除地址
    removeAddress(scope){
      this.$confirm('是否删除该地址，删除后无法恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.addrDel({'uid':this.userId, 'aid':scope.row.id}).then(res => {
          if(res.data){
            this.$message.success('删除成功');
            this.addrQuerys();
          }else{
            this.$message.error(res.errMsg);
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    },
    // 批量删除
    batchRemove(){
      let citiesLen = this.checkedCities.length;
      if(citiesLen > 5){
        this.$message.error('每次最多可选择5条');
      }else if(citiesLen == 0){
        this.$message.error('请选择要删除的地址');
      }else{
        this.$confirm('已选择'+citiesLen+'条地址，是否全部删除，删除后无法恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.batchDelAddress({'uid':this.userId, 'addressIdList':this.checkedCities.toString()}).then(res => {
            if(res.success && res.data){
              this.$message.success('删除成功');
              this.addrQuerys();
            }else{
              this.$message.error(res.errMsg);
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
        
      }
    },
    // 确认修改
    confirmChange(ruleList){
      var obj = {};
      obj.userId = this.userId;
      obj.firstName = this.ruleList.name;
      obj.address = this.ruleList.address;
      obj.mobile = this.ruleList.phone;
      obj.state = this.codeobj.aeracode1.code;
      obj.city = this.codeobj.aeracode2.code;
      obj.county = this.codeobj.aeracode3.code;
      obj.town = this.codeobj.aeracode4.code;
      obj.stateName = this.codeobj.aeracode1.label;
      obj.cityName = this.codeobj.aeracode2.label;
      obj.countyName = this.codeobj.aeracode3.label;
      obj.townName = this.codeobj.aeracode4.label;
      if(this.isBtnType == '1'){
        this.$refs[ruleList].validate((valid) => {
          if(valid){
            API.addrAdd(obj).then(res => {
              if(res.data){
                this.$message.success('恭喜你添加地址成功');
                this.addrQuerys();
              }else{
                this.$message.error('服务器出现问题，请稍后提交');
              }
            })
            this.dialogEvt();
          }
        })
      }else{
        obj.id = this.editorData.id;
        this.$refs[ruleList].validate((valid) => {
          if(valid){
            API.addrEdit(obj).then(res => {
              if(res.data){
                this.$message.success('恭喜你修改地址成功');
                this.addrQuerys();
              }else{
                this.$message.error('服务器出现问题，请稍后提交');
              }
            })
            this.dialogEvt();
          }
        })
      }
      
    },
    changeend(str){ 
      //[{code:"一级区域码",label:"一级区域名称"},{code:"二级区域码",label:"二级区域名称"},{code:"三级区域码",label:"三级区域名称"},{code:"四级区域码",label:"四级区域名称"}]
      this.codeobj.aeracode1.label = str[0].label;
      this.codeobj.aeracode1.code = str[0].code;
      this.codeobj.aeracode2.label = str[1].label;
      this.codeobj.aeracode2.code = str[1].code;
      this.codeobj.aeracode3.label = str[2].label;
      this.codeobj.aeracode3.code = str[2].code;
      this.codeobj.aeracode4.label = str[3].label;
      this.codeobj.aeracode4.code = str[3].code;
    },
    // 弹框操作
    dialogEvt(){
      this.isDialog = false;
      this.ruleList.name = '';
      this.ruleList.phone = '';
      this.ruleList.address = '';
    }
  }
}
</script>
<style>
  .queryHeader{
    height: 36px;
    background: #409EFF;
    line-height: 36px;
    color: #fff;
    text-indent: 12px;
  }
  .queryHeaderTle{
    font-size: 14px;
    float: left;
  }
  .addressHead{
    float: right;
    margin-right: 10px;
  }
  .addressList{
    height: 56px;
    line-height: 56px;
    border:1px solid #797979;
    margin-top: 15px;
    font-size: 14px;
  }
  .tabelTab th{
    background:#EEF6FF;
  }
  .batchDelete{
    margin: 10px 0 10px 10px;
  }
  .tabelTab .el-table_1_column_1 .el-checkbox__inner{
    display: none;
  }
</style>

