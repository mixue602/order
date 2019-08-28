<template>
  <div class="form-container">
    <div class="form-box" ref="formBox">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

        <!-- 选择仓库 -->
        <el-row>
          <el-col :span="12" class="input-box">
            <el-form-item label="选择仓库"  prop="storeType"  class="is-required">
              <el-radio-group v-model="storeType"  @change="handleStoreType">
                <el-radio label="1">门店仓</el-radio>
                <el-radio label="2">配送仓</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
				
        <el-form-item label="选择门店" class="is-required" v-show="storeType==1">
          <g-stores 
          v-model="storeCodes" 
          :treeIsEdit="treeIsEdit" 
          :isMutex="isMutex"
          partUrl="/queryread/store"
          v-if="treeIsEdit"></g-stores>

          <div class="gray" v-else>{{storeInfo.storeName || ''}}</div>
        </el-form-item>

        <template v-if="getWarehouse">
          <el-form-item :label="staffLevel != 4 ? '物理配送仓' : '选择门店'" class="is-required" v-show="storeType==2">
            <g-stores 
            v-model="warehouseCodes" 
            :treeIsEdit="treeIsEdit" 
            :isMutex="isMutex"
            partUrl="/queryread/dist"
            v-if="treeIsEdit"></g-stores>

            <div class="gray" v-else>{{storeInfo.storeName || ''}}</div>
          </el-form-item>
        </template>

        <!-- 选择商品 -->
        <el-row>
          <el-col :span="12" class="input-box" v-clickoutside="handleSkuClose">
            <el-form-item label="商　　品" prop="inputName" class="inputName">

              <el-input v-model.trim="ruleForm.inputName" @keyup.native="outputGoodListEnter($event,{searchBy:'inputName'},ruleForm.inputName)" placeholder="输入4位以上商品sku 或 商品名称">

                <i slot="suffix" v-if="!ruleForm.skuDisabled" class="el-input__icon icon iconfont" @click="outputGoodList({searchBy:'inputName'})">&#xe61c;</i>
                <i slot="suffix" v-else class="cl-reset" @click="clearInput('inputName')"><span class="el-icon-circle-close"></span></i>
              </el-input>

              <div class="el-form-item__error" v-show="ruleForm.inputNameErrorShow">* 输入后，点击“回车”，请在列表中选择商品</div>
            </el-form-item>
            <div
              class="search-list-name search-list"
              v-show="searchSkuShow"
            >
              <SearchList
                :querySellData="querySellData"
                @outputGoodListByPage="outputGoodListByPage"
                @returnText="returnText"
              />
            </div>
          </el-col>
        </el-row>

        <!-- 选择品牌和品类 -->
        <el-row>
          <el-col :span="12" class="input-box" v-clickoutside="handleBrandClose">

            <el-form-item label="品　　牌" prop="inputBrand" class="inputBrand">
              <el-input v-model="ruleForm.inputBrand" @keyup.native="outputGoodListEnter($event,{searchBy:'inputBrand'},ruleForm.inputBrand)" placeholder="输入品牌名称 或者 4位以上品牌代码">
                <i slot="suffix" v-if="!ruleForm.brandDisabled" class="el-input__icon icon iconfont" @click="outputGoodList({searchBy:'inputBrand'})">&#xe61c;</i>
                <i slot="suffix" v-else class="cl-reset" @click="clearInput('inputBrand')"><span class="el-icon-circle-close"></span></i>
              </el-input>
              <div class="el-form-item__error" v-show="ruleForm.inputBrandErrorShow">* 输入后，点击“回车”，请在列表中选择品牌</div>
            </el-form-item>
            <div
              class="search-list-brand search-list"
              v-show="searchBrandShow"
            >
              <SearchList
                :querySellData="querySellData"
                @outputGoodListByPage="outputGoodListByPage"
                @returnText="returnText"
              />
            </div>
          </el-col>

          <el-col :span="12">
            <el-form-item class="inputCategory" :class="{'is-required': categoryIsRequired}" label="品　　类" prop="inputCategory">
              <el-select
                v-model="ruleForm.inputCategory"
                filterable
                clearable
                :multiple-limit="1"
                @click.native="handlerPanelClose"
                placeholder="请输入品类名称或下拉选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.classCode"
                  :label="item.classDesc + '(' + item.classCode + ')'"
                  :value="item.classCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        
        
        <el-row>
          <el-col :span="12" class="input-box">
            <el-form-item label="选择细分仓" prop="subStoreCodes" class="checkedStores is-required">
              <el-select v-model="ruleForm.subStoreCodes" 
              @click.native="handlerPanelClose">
                <el-option
                  v-for="store in stores"
                  :key="store.repositoryCode"
                  :label="store.repositoryName"
                  :value="store.repositoryCode"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="input-box">
            <el-form-item label="选择机型" prop="modelCodes" class="checkedModels is-required">
              <el-select v-model="ruleForm.modelCodes" 
              @click.native="handlerPanelClose">
                <el-option
                  v-for="model in models"
                  :key="model.serviceTypeCode"
                  :label="model.serviceTypeName"
                  :value="model.serviceTypeCode"
                 >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12" class="input-box" v-clickoutside="handleSupplierClose">
            <el-form-item label="选择供应商" prop="inputSupplier" class="inputSupplier">
              <el-input
                v-model.trim="ruleForm.inputSupplier"
                @keyup.native="outputGoodListEnter($event,{searchBy:'inputSupplier'},ruleForm.inputSupplier)"
                placeholder="输入供应商名称 或 4位以上供应商数字代码"
              >
                <i slot="suffix" v-if="!ruleForm.inputSupplierDisabled" class="el-input__icon icon iconfont" @click="outputGoodList({searchBy:'inputSupplier'})">&#xe61c;</i>
                <i slot="suffix" v-else class="cl-reset" @click="clearInput('inputSupplier')"><span class="el-icon-circle-close"></span></i>
              </el-input>
              <div class="el-form-item__error" v-show="ruleForm.inputSupplierErrorShow">* 输入后，点击“回车”，请在列表中选择供应商</div>
            </el-form-item>
            <div
              class="search-list-supplier search-list"
              v-show="searchSupplierShow"
            >
              <SearchList
                :querySellData="querySellData"
                @outputGoodListByPage="outputGoodListByPage"
                @returnText="returnText"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="center searchbtnbox">
            <el-form-item>
              <el-button @click="resetForm(ruleFormName)" class="inquiry-btn inquiry-reset">重置</el-button>
              <el-button type="primary" class="inquiry-btn inquiry-search" @click="submitForm">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="inquery-tab-box" v-if="ruleForm.isShowTab && totalShow">
      <p :class="{active: ruleForm.tabActive == 1}" @click="handleTab(1)">查询结果明细</p>
      <p :class="{active: ruleForm.tabActive == 2}" @click="handleTab(2)">查询结果汇总</p>
      <div class="el-tabs__active-bar" :class="{activeBar2: ruleForm.tabActive == 2}"></div>
    </div>

    <div class="inquiry-result" v-if="totalShow">

      <InquiryResult 
      v-show="ruleForm.tabActive == 1"
      :resultData="resultData" 
      @totalSearchByPage="totalSearchByPage"
      @bindSortChange="bindSortChange"
      :storeType="storeType"
      ></InquiryResult>
    </div>

    <div class="inquiry-result-collect" v-if="ruleForm.tabActive == 2">
      <inquirySummary
      :summary="summary"
      :storeType="storeType"
      ></inquirySummary>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from  'vuex'
import store from '@/store/index'
import SearchList from "./searchList.vue"
import InquiryResult from "./inquiryResult"
import inquirySummary from "./inquirySummary"
import gStores from "./g-stores"
import { Loading } from "element-ui"
import API from '@/api/service_inquiry/service_inquiry'
import APIUser from '@/api/pushed_list/pushed_list'

export default {
  store,
  components:{
    InquiryResult,
    SearchList,
    inquirySummary,
    gStores
  },
  created:function(){

    this.getUsertDefaultInfo();//获取用户信息以及细分仓机型数据,获取登录角色也在这个函数里，因为获取登录角色需要门店的信息
    this.getCategoryList();//获取品类信息
    this.getUserOfflineInfo();//获取登录角色信息
  },
  data() {
    let  ruleForm = {
          inputName: '',//商品名称
          inputNameStored: '',//商品名称暂存
          inputNameErrorShow:false,//是否显示商品名处的error
          skuDisabled:false,//商品名回车是否显示
          sku: '',//商品编码

          inputBrand :'',//品牌名称
          inputBrandStored :'',//品牌名称暂存
          inputBrandErrorShow:false,//是否显示品牌名处的error
          brandDisabled:false,//品牌名回车是否显示
          brand :'',//品牌编码

          
          inputCategory :'',//选中的品类名code

          inputSupplier:'',//供应商model
          inputSupplierCode:'',//供应商code
          inputSupplierStored:'',//供应商显示的value暂存
          inputSupplierErrorShow:false,//是否显示供应商名处的error
          inputSupplierDisabled:false,//供应商回车是否显示

          subStoreCodes: 'ALL',//仓库编码
          modelCodes:'ALL',//机型编码

          sortField: 'SKU_NO',//排序字段 SKU_NO: 商品编码,QTY: 现货库存,AB_QTY:在途库存
          sort: 'ASC',//ASC:正序,DESC:倒序
        
          tabActive: '1',//当前tab
          isShowTab: false//是否显示tab
        }
    
    return {
      storeCodes:{//门店编码
        storeCodes:"",
      },
      warehouseCodes: {//仓库编码
        storeCodes: ""
      },

      userOfflineInfo: {},//用户信息
      storeType: '1',//1:门店仓 , 2:配送仓,3:门店卖配送仓
      searchSkuShow: false,//商品名列表下拉框是否显示
      searchBrandShow: false,//品牌名列表下拉框是否显示
      searchSupplierShow: false,//供应商列表下拉框是否显示

      totalShow:false,//查询结果是否显示


      ruleFormName:"ruleForm",//提交的form表单名称<string>

      repository:{repositoryCode:"ALL",repositoryName:"全部细分仓"},//“全部”仓库
      serviceType:{serviceTypeCode:"ALL",serviceTypeName:"全部细分机型"},//“全部”机型
      
      categoryIsRequired: false,//false表示不必选，true表示必选
      stores:[],//仓库
      storeRepositoryList: [],//门店仓
      deliveryRepositoryList: [],//配送仓
      models:[],//机型
      categoryList: [],//品类
      ruleFormData: ruleForm,
      ruleForm: {...ruleForm},//因为表格重置的功能，并不能把里面的数据都重置
      rules: {
        
        inputName: [
          { required: false, message: '输入4位以上sku 或 商品名称查询', trigger: 'blur' }
        ],
        inputBrand: [
          { required: false, message: 'serviceType', trigger: 'blur' }
        ],
        inputCategory: [
          { required: false, message: '请选择品类', trigger: 'blur' }
        ],
        inputSupplier: [
          { required: false, message: '请选择供应商', trigger: 'blur' }
        ],
       
        subStoreCodes: [
          { required: false, message: '选择细分仓', trigger: 'blur' }
        ],
        modelCodes: [
          { required: false, message: '请至少选择一个机型', trigger: 'change' }
        ]
      },

      searchBy:"",
      tmpParams:{},//查询参数暂存值
      querySellData:{},//向下拉列表中传递的数据
      pageSize:10,//设置每页的页数为10
      currentPage:1,//设置当前页为1
      pageRullFormSize:50, //设置最终搜索结果每页的页数为50
      resultData:{},//最终结果
      summary: [],//汇总结果
      treeIsEdit: false,//树结构是否可编辑
      staffLevel: 0,//级别，门店级别是4
      storeInfo: {
        storeName: '',
        storeCode: ''
      },//门店信息
      getWarehouse: false,//是否调用仓库的树结构，因为如果页面一进来就调用部门和仓库的树接口，数据量庞大
      isMutex: false,//树结构1级列表是否互斥
    }
  },
  computed:{
    ...mapState({

    })
  },
  directives:{
    clickoutside:{
      // 点击空白下拉列表消失事件
      bind(el, binding, vnode) {
        function documentHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
              return false;
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
              // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
              binding.value(e);
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
      },
      update() {},
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      }
    },
    onfocus:{
      inserted:function(el){
        el.focus()
      }
    }
  },
  watch:{
    ruleForm:{
      handler:function(val,oldval){
          
          if(val.inputName.length){
            if(val.sku.length){
              val.skuDisabled = true
            }else{
              val.skuDisabled = false
            }
          }else if(val.inputBrand.length){
            if(val.brand.length){
              val.brandDisabled = true
            }else{
              val.brandDisabled = false
            }
          }else if(val.inputSupplier.length){
            if(val.inputSupplierCode.length){
              val.inputSupplierDisabled = true
            }else{
              val.inputSupplierDisabled = false
            }
          }
          if(val.sku.length){
            val.inputNameErrorShow = false
          }else{
            if(val.inputName.length){
              val.inputNameErrorShow = true
            }else{
              val.inputNameErrorShow = false
            }
          }
          if(val.brand.length){
            val.inputBrandErrorShow = false
          }else{
            if(val.inputBrand.length){
              val.inputBrandErrorShow = true
            }else{
              val.inputBrandErrorShow = false
            }
          }

          if(val.inputSupplierCode.length){
            val.inputSupplierErrorShow = false
          }else{
            if(val.inputSupplier.length){
              val.inputSupplierErrorShow = true
            }else{
              val.inputSupplierErrorShow = false
            }
          }
          
      },
      deep:true
    }
    
  },
  methods: {
    ...mapMutations([
      "SET_STORE_NAME"
    ]),

    //选择类型的类型，同时初始化另一种的初始状态
    handleStoreType(){
      //切换时要重置所选的数据
      this.getWarehouse = true;
      this.resetForm(this.ruleFormName, true);

    },
   
    //搜索商品点击空白关闭
    handleSkuClose(e) {
      this.searchSkuShow = false
      if(!this.ruleForm.sku){
        this.ruleForm.inputName = ""
      }
    },
    //搜索商品点击空白关闭
    handleBrandClose(e) {
      this.searchBrandShow = false
      if(!this.ruleForm.brand){
        this.ruleForm.inputBrand = ""
      }
    },
    //搜索供应商点击空白关闭
    handleSupplierClose(e) {
      this.searchSupplierShow = false
      if(!this.ruleForm.inputSupplierCode){
        this.ruleForm.inputSupplier = ''
      }
    },
    //因为下拉选择有阻止冒泡，所以没有触发指令
    handlerPanelClose() {
      this.handleSkuClose();
      this.handleBrandClose();
      this.handleSupplierClose();
    },
    //清空单个小搜索框
    clearInput(input){
      
      this.ruleForm[input] = ""
      if(input == "inputName")this.ruleForm.sku = ""
      if(input == "inputBrand")this.ruleForm.brand = ""
      if(input == "inputSupplier")this.ruleForm.inputSupplierCode = ''
      this.searchSkuShow = false
      this.searchBrandShow = false
      this.searchSupplierShow = false
    },

    //切换tab事件
    handleTab(val) {
      if(this.ruleForm.tabActive == val) { return false;}
      this.ruleForm.tabActive = val;
      if(this.ruleForm.tabActive == 2) {
        this.querySellSummary();
      }
    },  
    //toast提示
    popBlankMessage(data){
			let message = '';
      if(!data) {
        message = '系统繁忙，请稍后再试';
      }else if(typeof data == 'string') {
				message = data;
			}else {
				message = data.errMsg || data.respMsg || '系统繁忙，请稍后再试';
				if(data.errCode == 502) {
					message = '用户登录的信息已经过期了， 您需要重新登录';
				}
			}
      this.$message({
        message:message,
        type: 'warning'
      })
    },
    
    //获取用户信息以及细分仓机型数据
    getUsertDefaultInfo() {
      API.usertDefaultInfo().then(data => {
        
        if(data.success){
          
          this.storeRepositoryList = data.response.storeRepositoryList;//门店仓数据
          this.deliveryRepositoryList = data.response.deliveryRepositoryList;//配送仓数据
          this.storeRepositoryList.unshift(this.repository)
          this.deliveryRepositoryList.unshift(this.repository)
          this.stores = (this.storeRepositoryList && this.storeRepositoryList.length>0 ? [...this.storeRepositoryList] : []) ;
          
          this.models = data.response.serviceTypeList//机型
          this.models.unshift(this.serviceType)

        }else{
          this.$alert('当天岗位不能查询可卖数', {
            showConfirmButton: false,
            showClose: false,
            closeOnClickModal:false,
            center: true,
            callback: action => {
              
            }
         });
          return
        }
      })
    },


    //获取品类
    getCategoryList() {
      
      API.getCategory().then((data) => {
        
        if(data.success){ 
          this.categoryList = data.response//品类
        }else{
          this.popBlankMessage(data)
        }
      })
    },

    //获取用户登录信息
    getUserOfflineInfo() {
      API.getUserOfflineInfo().then((data) => {
        if(data.success){ 
          let response = data.response;
          this.userOfflineInfo = response;
          this.treeIsEdit = true;
          //是判断树型结构是否可编辑，如果staffLevel是4，表示是门店且roleGroup里不包含10，则表示不是主任
          //门店店长默认显示所在门店，且不可编辑，门店品类主任默认显示所在门店，且支持编辑
          if(response) {
            let isHead = false;
            this.staffLevel = response.staffLevel;
            if(response.roleGroup && response.roleGroup.length) {
              let roleGroup = response.roleGroup;
              for(let i = 0; i<roleGroup.length; i++) {
                if(roleGroup[i] == '10') {//登录角色组 10=门店主任 11=店长 20=品类必选组
                  isHead = true;
                }
                if(roleGroup[i] == 20) {
                  this.categoryIsRequired = true;//品类必选选择
                }
              }
            }
            if(!isHead && response.staffLevel == 4) {
              this.getOffLineStoreInfo();
              this.treeIsEdit = false;
              return false;
            }
              

            if(response.roleIds && response.roleIds.length) {
              let roleIds = response.roleIds;
              for(let i = 0; i<roleIds.length; i++) {
                if(roleIds[i] == 'er326') { 
                  this.isMutex = true;
                  break;
                }
              }
            }


          }

        }else{
          this.popBlankMessage(data)
        }
      })
    },

    //获取用户门店信息
    getOffLineStoreInfo() {
      API.getOffLineStoreInfo().then((res) => {
        
        if(res.success){ 
          this.SET_STORE_NAME(res.data.storeName)//保存门店到vuex
          this.storeInfo.storeName = res.data.storeName//门店名称
          this.storeInfo.storeCode = res.data.storeId//门店编码
          this.storeCodes.storeCodes = [res.data.storeId];
          this.warehouseCodes.storeCodes = [res.data.storeId];
        }else{
          this.popBlankMessage(res)
        }
      })
    },
    
    //点击搜索axios
    searchAxios(method,params,fnSearch){
      let clazz = null
      if(method == "querySkuList"){
        clazz = ".search-list-name"
      }else if(method == "queryBrandList"){
        clazz = ".search-list-brand"
      }else if(method == "querySupplierList"){
        clazz = ".search-list-supplier"
      }
      this.querySellData.nodata = ""
      fnSearch()
      let loadingInstance = Loading.service({
          text: '加载中',
          target: document.querySelector(clazz)
      })
      API[method](params).then(res => {
        var timer = null
        clearTimeout(timer)
        if(res.success){
          timer = setTimeout(()=>{
            loadingInstance.close()
            this.querySellData = res.response
            if(!res.response.list || res.response.list.length == 0){
              this.querySellData.nodata = "抱歉，没有查到相关数据！"
              return
            }
            if(method == "querySkuList"){
              this.querySellData.skuList = res.response.list
            }else if(method == "queryBrandList"){
              this.querySellData.brandList = res.response.list
            }else if(method == "querySupplierList"){
              this.querySellData.supplierList = res.response.list
            }
          },500)

        }else{
          timer = setTimeout(()=>{
            loadingInstance.close()
            this.popBlankMessage(res)
            this.querySellData.nodata = "抱歉，" + res.respMsg + "，请重试！"
          },500)
        }
      })
    },
    //回车出现结果  不是回车的话说明进行了编辑改变了原来的值，这时候删除编码
    outputGoodListEnter(ev,json,text){
      if(json.searchBy == "inputName"){
        if(text !== this.ruleForm.inputNameStored){
          this.ruleForm.sku = ""
        }
      }
      if(json.searchBy == "inputBrand"){
        if(text !== this.ruleForm.inputBrandStored){
          this.ruleForm.brand = ""
        }
      }
      if(json.searchBy == "inputSupplier"){
        if(text !== this.ruleForm.inputSupplierStored){
          this.ruleForm.inputSupplierCode = ""
        }
      }
      if(ev.keyCode == 13){
        this.outputGoodList(json)
      }
    },
    //点击出现搜索结果
    outputGoodList(json){
      //定义参数{}
      let params = {}
      //初始化数据库
      this.querySellData = {}
      //点击搜索的时候默认设置当前页为第一页，如果存在json.currentPage说明是点击了分页导致了当前页的改变，如果不是点击了分页的话只能是第一页
      this.currentPage = 1
      //设置每页条数（10）
      params.pageSize = this.pageSize
      //不是点击分页搜索的时候当前页为第一页，如果是的话从json中拿出来
      params.currentPage = json.currentPage || this.currentPage
      //搜索的依据存起来（从json里拿出来）
      this.searchBy = json.searchBy
      //将参数里的当前页码存起来
      this.currentPage = params.currentPage
      //按照商品名称/skuid查询
      if(json.searchBy == "inputName"){
        params.skuNoOrName = this.ruleForm.inputName
        if(this.ruleForm.inputName !== ""){
          this.searchAxios("querySkuList",params,() => {
            this.searchSkuShow = true
            this.searchBrandShow = false
            this.searchSupplierShow = false
          })
        }else{
          this.searchSkuShow = false
          this.popBlankMessage("商品名不能为空")
        }
      }else if(json.searchBy == "inputBrand"){
        params.brandCodeOrName = this.ruleForm.inputBrand
        if(this.ruleForm.inputBrand !== ""){
          this.searchAxios("queryBrandList",params,() => {
            this.searchSkuShow = false
            this.searchBrandShow = true
            this.searchSupplierShow = false
          })
        }else{
          this.searchBrandShow = false
          this.popBlankMessage("品牌名不能为空")
        }
      }else if(json.searchBy == "inputSupplier"){
        params.supplierCodeOrName = this.ruleForm.inputSupplier
        if(this.ruleForm.inputSupplier !== ""){
          this.searchAxios("querySupplierList",params,() => {
            this.searchSkuShow = false
            this.searchBrandShow = false
            this.searchSupplierShow = true
          })
        }else{
          this.searchSupplierShow = false
          this.popBlankMessage("供应商不能为空")
        }
      }else{
        return
      }
    },
    //根据页数查询搜索结果
    outputGoodListByPage(currentPage){
      let json = {
        skuNoOrName:this.ruleForm.inputName,
        brandCodeOrName:this.ruleForm.inputBrand,
        supplierCodeOrName:this.ruleForm.inputSupplier,
        currentPage:currentPage,//从arg中获得当前页
        searchBy:this.searchBy
      }
      this.outputGoodList(json)
    },
    //点击搜索项将内容赋予input框
    returnText(json){
      for(let i in json){
        this.ruleForm[i] = json[i]
        if(i == "inputName") {
          this.ruleForm.inputNameStored = this.ruleForm.inputName
        }else if(i == "inputBrand"){
          this.ruleForm.inputBrandStored = this.ruleForm.inputBrand
        }else if(i == "inputSupplier") {
          this.ruleForm.inputSupplierStored = this.ruleForm.inputSupplier
        }
      }

      this.searchSkuShow = false
      this.searchBrandShow = false
      this.searchSupplierShow = false
    },
    //根据页数查询搜索结果
    totalSearchByPage(currentFormPage){
      let params = this.tmpParams
      params.pageNum = currentFormPage
      this.querySellNumListSearch(params)
    },

    //更新排序字段
    bindSortChange(sorts) {
      this.tmpParams.sortField = this.ruleForm.sortField = sorts.sortField,
      this.tmpParams.sort = this.ruleForm.sort = sorts.sort;
      this.tmpParams.pageNum = 1
      this.querySellNumListSearch(this.tmpParams)
    },

    //提交表单参数
    submitFormParams(){
      let masLocs;
      if(this.storeCodes.checkedAll) {//门店或仓库编码,如果角色是er326则全选是传null
        masLocs = null;
      }else {
        if(this.storeType == 1 && this.storeCodes.storeCodes) {
          masLocs = this.storeCodes.storeCodes.join(',');
        }
        if(this.storeType == 2 && this.warehouseCodes.storeCodes) {
          masLocs = this.warehouseCodes.storeCodes.join(',');
        }
      }
      return {
        type: this.storeType,//仓库类型
        skuNo:this.ruleForm.sku,//商品编码
        brand:this.ruleForm.brand,//品牌
        category:this.ruleForm.inputCategory,//品类
        masLocs: masLocs,
        supplier:this.ruleForm.inputSupplierCode,//供应商编码
        logicMasLocType: (this.ruleForm.subStoreCodes == 'ALL' ? '' : this.ruleForm.subStoreCodes),//逻辑仓库类型(细分库类型)
        itemType:  (this.ruleForm.modelCodes == 'ALL' ? '' : this.ruleForm.modelCodes),//机型编码
        pageNum:1,//当前页
        pageSize:this.pageRullFormSize,//每页条数
        //点击查询时不排序，只有点击排序按钮的时候才排序，因为排序查询数量大
        // sortField: this.ruleForm.sortField,//排序字段 SKU_NO: 商品编码,QTY: 现货库存,AB_QTY:在途库存
        // sort: this.ruleForm.sort,//ASC:正序,DESC:倒序
      }
    },
    //提交表单
    submitForm() {
      // this.totalShow = false
      let params = this.submitFormParams()
      
      this.tmpParams = params//暂存一下查询条件
      this.queryEmptyCheck(params)
    },
    //品类为必选，则商品和品牌、供应商可以不选，如果品类为不必须，则四者需选其一
    queryEmptyCheck(params){
      let len = this.ruleForm.sku +  this.ruleForm.brand + this.ruleForm.inputCategory + '' + this.ruleForm.inputSupplierCode;
      
      if(this.storeType == 1 && !this.storeCodes.storeCodes.length) {
        this.popBlankMessage("门店不能为空，请选择后进行查询")
        return  false;
      }
      if(this.storeType == 2 && !this.warehouseCodes.storeCodes.length) {
        this.popBlankMessage("配送物理仓不能为空，请选择后进行查询")
        return  false;
      }
      if(this.categoryIsRequired && !this.ruleForm.inputCategory) {
        this.popBlankMessage("品类不能为空，请选择品类后进行查询")
        return  false;
      }else if(!len) {
        this.popBlankMessage("商品、品牌、品类、供应商四项里面至少选一项，请选择后进行查询")
        return  false;
      }
      this.ruleForm.tabActive = '1';
      this.isFirstSort = true;
      this.querySellNumListSearch(params)
    },
    //查询ajax + ruleFormName校验
    querySellNumListSearch(params){
      let formName = this.ruleFormName
      let loadingInstance = Loading.service({
          text: '加载中',
          target: document.querySelector(".inquiry-result")
      })
      this.summary = [];
      this.ruleForm.isShowTab = this.ruleForm.sku ? true : false;
      this.$refs[formName].validate(valid => {
        if (valid) {
         API.getSaleList(params).then(res => {
           
            var timer = null
            clearTimeout(timer)
            this.totalShow = true
            if(res.success){
              
              timer = setTimeout(()=>{
               
                loadingInstance.close()
                this.resultData = res.response;
                if(!res.response.dataList) {
                  this.resultData.dataList = [];
                }
                this.resultData.dataList.forEach((item,index) => {
                  if(this.storeType == 1) {
                    item.storeName = this.storeInfo.storeName || '';
                  }
                  item.sortId = index + 1;
                })
                this.resultData.currentPage = params.pageNum;
                this.resultData.pageSize = params.pageSize;
                
                this.$nextTick(()=>{
                  this.scrollToZero()
                })
              },500)
              return false;
            }else{
              
              timer = setTimeout(()=>{
                loadingInstance.close()
                this.totalShow = false
                if(res.respCode == "logic.params.isAllEmpty"){
                  this.popBlankMessage("请完善输入条件")
                }else{
                  this.popBlankMessage(res)
                }
              },500)
              this.resultData = {}
            }

         })
        } else {
          this.totalShow = false
          loadingInstance.close()
          this.popBlankMessage("提交失败，请完善查询条件~")
          this.resultData = {}
        }
        
      })
    },
    //查询success返回顶部
    scrollToZero(){
      let formBox = this.$refs.formBox
        ,formBoxH = formBox.offsetHeight
      window.scrollTo(0,formBoxH + 100)
    },

    //查询汇总
    querySellSummary() {
      if(this.summary.length) {
        return false;
      }
      let tmpParams = this.tmpParams;
      let params = {
        level: 1,//1:全部汇总 2:物理仓/门店汇总 3: 逻辑仓汇总
        type: tmpParams.type,//仓库类型
        skuNo:tmpParams.skuNo,//商品编码
        masLocs: tmpParams.masLocs,//门店或仓库编码
        supplier:tmpParams.supplier,//供应商编码
        logicMasLocType: tmpParams.logicMasLocType,//逻辑仓库类型(细分库类型)
        itemType:  tmpParams.itemType,//机型编码
      };
      
      let loadingInstance = Loading.service({
          text: '加载中',
          target: document.querySelector(".inquiry-result-collect")
      })

      API.getSummaryQtyData(params).then((data) => {
       
        loadingInstance.close()
        this.summary = [];
        if(data.success){ 
          if(data.response && data.response.dataList && data.response.dataList.length) {
            
            this.summary = data.response.dataList;
            this.summary.forEach(item => {
              item.storeName = this.storeType == 1 ? '门店仓' : '配送仓';
            })
          }

        }else{
          this.popBlankMessage(data)
        }
      })
    },
    
    //重置表单 isRestOther是否全部重置，true部分重置，false全部重置
    resetForm(formName, isRestOther) {
      this.$refs[formName].resetFields()
      this.ruleForm = {...this.ruleFormData};
      this.searchBy = ""

      if(!isRestOther) {//isRestOther之所以用这个是因为重置需要把选择仓库重置为门店仓
        this.storeType = '1'
      }

      //切换不同的仓库对应的细分仓也是不一样的，需要对数据进行切换
      if(this.storeType == 1) {
        this.stores = (this.storeRepositoryList.length>0 ? [...this.storeRepositoryList] : []) ;
      }else {
         this.stores = (this.storeRepositoryList.length>0 ? [...this.deliveryRepositoryList] : []) ;
      }
      this.resultData = {},//最终结果
      this.summary = []//汇总结果
      this.totalShow = false;

      if(this.treeIsEdit) {
        this.storeCodes.storeCodes = 'reset';
        this.warehouseCodes.storeCodes = 'reset';
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.hide
  display none
.show
  display table-cell
.center
  text-align center

.gray 
  color: #ccc

.im-icon
  color red
  font-size 16px
  margin-top 5px
  margin-right 5px
  font-style normal

.form-box
  border-bottom 1px solid #e3e3e3
  margin-bottom 15px

  input[type="text"]
    font-size 14px

.el-search
  background #409eff !important
  color #fff !important
  border-radius 0
  border-color: #3a8ee6;

.el-reset
  background #ccc
  margin-left 13px

.el-row {
  margin-bottom: 0px
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.check-all-label
  /*margin-left 20px*/

.inquiry-btn
  width 100px

.searchbtnbox
  margin 20px 0px 5px 0
  padding-right 140px

.input-box
  position relative

  .search-list
    position absolute
    left 140px
    top 32px
    width calc(100% - 150px)
    max-height 364px
    min-height 200px
    z-index 99
    overflow-y hidden
    overflow-x hidden
.form-box-show
  .input-box
    padding-right 10px
    .el-input__inner
      word-break break-all
      // word-wrap break-word
      // white-space nowrap
      span
        margin-right 5px
        float left
</style>
<style lang="stylus">
body
.inputName,.inputBrand,.inputSupplier
  .el-input__suffix
    padding-left 10px
    .cl-reset
      cursor pointer
      .el-icon-circle-close
        color #c0c4cc
        font-size 15px
        margin-top 10px
        font-family element-icons !important
.inputBrand,.inputName,.storeType,.checkedStores,.checkedModels,.inputSupplier
  padding-right 10px
.storeType,.checkedStores,.checkedModels
  .el-select
    width 100%
.inputError .el-input__inner
  border-color #f56c6c !important
.inputName ,.inputBrand,.inputSupplier
  .el-form-item__error
    color gray
.inputCategory
  padding-right 10px
  .el-form-item__label
    /*width 100px !important*/
  .el-form-item__content
    /*margin-left 100px !important*/
  .el-select
    width 100%
    height 32px
    line-height 32px
    .el-select__tags
      .el-select__input
        //width auto !important
      span
        width auto
    .el-input__inner
      height auto !important
    .el-select__input
      width 100px

.input-box-supplier
  padding-right 10px
  .input-span
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
    margin: 4px 0 2px 6px;
    // background-color: #f0f2f5;
    height: 20px;
    padding: 0 5px;
    padding-right:15px
    line-height: 19px;
    color: #909399;
    font-size: 12px;
    // border-radius: 4px;
    // border: 1px solid #eee;
    display: inline-block;
    position relative
    text-overflow: ellipsis;
    overflow: hidden;
    // min-width: 80px;
    // max-width: 150px;

    .input-span-close
      background-color: #c0c4cc;
      right: -1px;
      top: 3px;
      color: #fff;
      margin-left: -3px;
      -webkit-transform: scale(.7);
      transform: scale(.7);
      border-radius: 50%;
      text-align: center;
      position: absolute;
      cursor: pointer;
      font-size: 16px;
      height: 16px;
      width: 16px;
      line-height: 16px;
      vertical-align: middle;
      margin-top: -2px;
      font-family: element-icons!important;
      font-style: normal;
      font-weight: 400;
      // display: inline-block;
      display none
      &:before
        display: block;
        -webkit-transform: translate(0,.5px);
        transform: translate(0,.5px);
        content: "\E60F";

  .label-supplier
    color:#606266;
    width:140px;
    text-align:right;
    display:inline-block;
    font-size:14px;
    float:left;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 32px;
  .prop-supplier
    margin-left:140px;
    margin-bottom 18px
    .el-input-group__prepend
      cursor not-allowed
      border-right 1px solid #f5f7fa
      margin-right -1px
      background #f5f7fa
      padding 0 5px
.prop-supplier .el-input.is-disabled .el-input__inner
  border-left none

.input-span-close:hover{
  background-color: #909399;
  color :red
}
.inquiry-result
  position relative
  .sortBtn
    margin-bottom 15px
    position absolute
    display inline-block
    left 9%
    font-size 20px
    top 6px
    z-index 99
    color black
    .caret-wrapper
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 24px;
      vertical-align: middle;
      cursor: pointer;
      overflow: initial;
      position: relative;
      padding 0 15px
      .sort-caret
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 22px;
      .ascending
        border-bottom-color: #c0c4cc;
        top: 5px;
      .descending
        border-top-color: #c0c4cc;
        bottom: 7px;
    .sort-asc
      .ascending
        border-bottom-color: #409eff;
    .sort-desc
      .descending
        border-top-color: #409eff;
@media screen and (max-width:1067px){
  .inquiry-result .sortBtn{
    top :16px
  }
}
.el-checkbox+.el-checkbox
  margin-right 10px
  margin-left 0
.el-checkbox
  margin-right 10px
.check-all-label
  /*margin-left 0 !important*/

.el-input--small .el-input__icon
  font-size 32px
  cursor pointer
.inquery-tab-box {
  position: relative;
  height: 40px;
  margin-bottom: 20px;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #e4e7ed;
    z-index: 1;
  }

  p {
    float: left;
      padding: 0 20px;
      height: 40px;
      box-sizing: border-box;
      line-height: 40px;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      position: relative;
      cursor: pointer;
  }
  
  p:nth-child(1) {
    padding-left: 0;
  }
  p.active {
    color: #409eff;
  }
  .el-tabs__active-bar{
    width: 84px;
    transform: translateX(0);
    z-index: 10;
  }
  .el-tabs__active-bar.activeBar2 {
    transform: translateX(124px);
  }
}


</style>



