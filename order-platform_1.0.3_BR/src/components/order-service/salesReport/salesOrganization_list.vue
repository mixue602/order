<template>
  <el-container class="salesOrganization_list">
    <el-form class="so-list__form"
             ref="so-list__form"
             :rules="rules"
             :inline="true"
             :model="form"
             size="mini"
             @submit.native.prevent
             data-before="查询条件">
      <!--表单查询 start-->
      <el-row class="input-group-wrapper" ref="inputGroupWrapper">
        <!--销售部门 start-->
        <commonSalesReportTree @getSaleDepartmentsId="getSaleDepartmentsId" ref="salesReportTree"></commonSalesReportTree>
        <!--销售部门 end-->
        <!--品类 start-->
        <commonSalesReportCategoryTree @getSaleDepartmentsId="getSaleDepartmentsId" ref="salesReportTree"></commonSalesReportCategoryTree>
        <!--品类 end-->
        <el-row data-before="渠道：" class="el-channels-wrapper">
          <el-checkbox-group v-model="form.channel" class="el-channels-checkbox">
            <el-checkbox v-for="(channel, index) in channelList"
                         :label="channel.label" :value="channel.value"
                         :key="index">
            </el-checkbox>
          </el-checkbox-group>
        </el-row>

        <el-row class="input-group">
          <el-form-item label="品牌编码/名称：">
            <el-input placeholder="请输入品牌编码/名称" v-model="form.brandInfo"></el-input>
          </el-form-item>

          <el-form-item label="商品编码/名称：">
            <el-input placeholder="请输入商品编码/名称" v-model="form.productInfo"></el-input>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="changeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerStart"
              :default-value="defaultDate">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="零售单状态：">
            <el-select v-model="form.sellRetailStatus" placeholder="请选择">
              <el-option v-for="(item, index) in sellRetailStatusList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row data-before="展示层级：" class="el-levels-wrapper">
            <el-select size="mini"
                       v-model="form.firstDepartment"
                       class="el-levels-select"
                       data-before="一级"
                       placeholder="请选择"
                       @change="changeFirstDepartment">
              <el-option v-for="(item, index) in firstDepartmentList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
            <el-select size="mini"
                       v-model="form.secondStore"
                       :disabled = "secondStoreFlag"
                       class="el-levels-select"
                       data-before="二级"
                       placeholder="请选择"
                       @change="changeSecondStore">
              <el-option v-for="(item, index) in secondStoreList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
            <el-select size="mini"
                       v-model="form.thirdCategory"
                       :disabled = "thirdCategoryFlag"
                       class="el-levels-select"
                       data-before="三级"
                       placeholder="请选择"
                       @change="changeThirdCategory">
              <el-option v-for="(item, index) in thirdCategoryList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
            <el-select size="mini"
                       v-model="form.forthBrand"
                       :disabled = "forthBrandFlag"
                       class="el-levels-select"
                       data-before="四级"
                       placeholder="请选择"
                       @change="changeForthBrand">
              <el-option v-for="(item, index) in forthBrandList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
          </el-row>

          <el-form-item label="促销编码/名称：">
            <el-input placeholder="请输入促销编码/名称" v-model="form.sellerInfo"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码：">
            <el-input placeholder="请输入供应商编码" v-model="form.supplierCode"></el-input>
          </el-form-item>
          <el-form-item label="业务机型：">
            <el-select v-model="form.businessModels" placeholder="请选择">
              <el-option v-for="(item, index) in businessModelsList"
                         :label="item.label" :value="item.value"
                         :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送单号：">
            <el-input placeholder="请输入配送单号" v-model="form.deliveryId"></el-input>
          </el-form-item>
        </el-row>
      </el-row>
      <el-row class="btn-group">
        <el-button size="mini" @click="resetForm()">重置</el-button>
        <el-button size="mini" type="primary" native-type="submit" :loading="loading" @click="query()">查询</el-button>
        <a href="javascript:;" class="btn-show-more" v-show="showMoreFlag" @click="bindShowMoreEvent">{{showMoreText}}&nbsp;>></a>
      </el-row>
      <!--表单查询 end-->

    </el-form>

    <el-row class="so-charts-wrapper">
      <el-row class="so-charts-header">
        <span class="total-price" data-before="销售额：" data-after="万元">1111.23</span>
        <span class="total-quantities" data-before="销售数量：" data-after="台">12</span>
      </el-row>
      <el-row class="so-charts-content" v-if="chartData && chartData.length > 0">
        <span class="legend-color">销售额</span>
        <el-row class="so-charts-list">
          <ul>
            <li v-for="(item, index) in chartData" :key="index">
              <span class="txt-name">{{item.name}}</span>
              <div class="progress-wrapper">
                <!--<span class="progress" :style="{ width: item.percent + '%', opacity: (1/(index+1)).toFixed(2) }"></span>-->
                <span class="progress" :style=item._style></span>
                <span class="txt-price">{{item.price}}万</span>
              </div>
            </li>
          </ul>
        </el-row>
      </el-row>
    </el-row>

    <el-row class="so-tree-list" data-before="注：以下为金力、来购、美店分享实时数据">
      <el-row class="tree-header">
        <ul>
          <li>展示层级</li>
          <li>销售额</li>
          <li>销售数量</li>
          <li>销售额同比</li>
          <li>销售数量同比</li>
          <li>操作</li>
        </ul>
      </el-row>
      <el-row class="tree-content">
        <el-tree :data="data5" node-key="id" accordion :indent="10">
            <el-row :class="'tree-node-row tree-node-row'+node.level" slot-scope="{ node, data }">
              <span class="tree-node-cell" :class="'treeNode'+node.level">{{ node.label }}、{{node.level}}</span>
              <span class="tree-node-cell">{{ data.price ? data.price : '--' }}</span>
              <span class="tree-node-cell">{{ data.number ? data.number : '--' }}</span>
              <span class="tree-node-cell">{{ data.xiaoshou ? 'data.xiaoshou' : '--' }}</span>
              <span class="tree-node-cell">{{ data.baifenbi ? 'data.baifenbi' : '--' }}</span>
              <span class="tree-node-cell" v-if="data.caozuo ==1">
                <a href="/order/serviceList_detail?returnRequestId=6600087155" class="btn-normal" target="_blank">查看详情</a>
              </span>
              <span v-else  class="tree-node-cell">--</span>
            </el-row>
        </el-tree>
        <el-tree :data="data5"  :load="loadNode1" lazy  node-key="id" accordion :indent="10">
            <el-row :class="'tree-node-row tree-node-row'+node.level" slot-scope="{ node, data }">
              <span class="tree-node-cell" :class="'treeNode'+node.level">{{ node.label }}、{{node.level}}</span>
              <span class="tree-node-cell">{{ data.price ? data.price : '--' }}</span>
              <span class="tree-node-cell">{{ data.number ? data.number : '--' }}</span>
              <span class="tree-node-cell">{{ data.xiaoshou ? 'data.xiaoshoulazy' : '--' }}</span>
              <span class="tree-node-cell">{{ data.baifenbi ? 'data.baifenbilazy' : '--' }}</span>
              <span class="tree-node-cell" v-if="data.caozuo ==1">
                <a href="/order/serviceList_detail?returnRequestId=6600087155" class="btn-normal" target="_blank">查看详情</a>
              </span>
              <span v-else  class="tree-node-cell">--</span>
            </el-row>
        </el-tree>
      </el-row>
    </el-row>

  </el-container>

</template>
<style lang="scss">
  @import "@/assets/styles/order-service/variable.scss";
  @import "@/assets/styles/order-service/salesOrganization_list.scss";
  @import "@/assets/styles/order-service/common.scss";
</style>
<script>
  import {mapState} from "vuex";
  import API from "@/api/order-service/salesReport";
  import commonSalesReportTree from "@/components/order-service/common/commonSalesReportTree";
  import commonSalesReportCategoryTree from "@/components/order-service/common/commonSalesReportCategoryTree";
  import commonSalesReportColumnSetting from '@/components/order-service/common/commonSalesReportColumnSetting'
  import Env from '@/api/env'
  /**
   * 对日期处理
   * return type 参数展示格式
   */
  function getParseTime(times) {
    if (!times) {
      return {
        type: {
          start: "",
          end: ""
        }
      };
    }
    let start = new Date(times[0]),
      end = new Date(times[1]);

    function _formatByGe(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    }

    function format(date) {
      return (
        date.getFullYear() +
        "-" +
        _formatByGe(date.getMonth() + 1) +
        "-" +
        _formatByGe(date.getDate()) +
        " " +
        _formatByGe(date.getHours()) +
        ":" +
        _formatByGe(date.getSeconds()) +
        ":" +
        _formatByGe(date.getMinutes())
      );
    }

    return {
      type: {
        start: format(start),
        end: format(end)
      }
    };
  }

  function getQueryParams(content) {
    const date = getParseTime(content.changeDate).type;
    return {
      department: content.form.department, //销售部门
      store: content.form.store, //品类
      channel: content.form.channel,//渠道
      brandInfo: content.form.brandInfo, //品牌编码/名称
      productInfo: content.form.productInfo, //商品编码/名称
      startDate: date.start,//开始日期
      endDate: date.end,//结束日期
      sellRetailStatus: content.form.sellRetailStatus, //零售单状态
      firstDepartment: content.form.firstDepartment, //一级分部
      secondStore: content.form.secondStore, //二级门店
      thirdCategory: content.form.thirdCategory, //三级品类
      forthBrand: content.form.forthBrand, //四级品牌
      sellerInfo: content.form.sellerInfo,//促销编码/名称
      supplierCode: content.form.supplierCode, //供货商代码
      businessModels: content.form.businessModels, //供货商代码
      deliveryId: content.form.deliveryId,//配送单号
      userId: content.form.userId,//登录门店id
    }
  }

  export default {
    data() {
      const data = [
        {
          id: 1,
          price:"111",
          number:'1111',
          xiaoshou:'1111',
          baifenbi:'1111',
          zengzhang:'1111',
          caozuo:'1',
          label: '一级 1',
          children: [{
            id: 4,
            price:"111-1",
            number:'1111-1',
            label: '二级 1-1',
            xiaoshou:'1111',
            baifenbi:'1111',
            zengzhang:'1111',
            children: [{
              id: 9,
              label: '三级 1-1-1',
              price:"111-1-1",
              number:'1111-1-1',
              xiaoshou:'1111',
              baifenbi:'1111',
              zengzhang:'1111',
              children: [{
                id: 11,
                label: '四级 1-1-1-1',
                price:"111-1-1-1",
                number:'1111-1-1-1',
              }, {
                id: 12,
                label: '三级 1-1-2'
              }]
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }];
      return {
        loading: false,
        expand: 'expand',
        header: {
          content: "查询条件" // tit名字
        },
        show: {
          showTime: {start: "", end: ""},
          totalSalesAmount: "--", //销售金额总计
          totalSalesQty: "--", //销售数量总计
          totalPayAmount: "--"
        },
        page: {
          currentPage: 1,
          pageSize: 10,
          totalPage: 1
        },
        form: {
          department: "", //销售部门
          store: "", //品类
          channel: [],//渠道
          brandInfo: "", //品牌编码/名称
          productInfo: "", //商品编码/名称
          startDate: '',//开始日期
          endDate: '',//结束日期
          sellRetailStatus: "", //零售单状态
          firstDepartment: "", //一级分部
          secondStore: "", //二级门店
          thirdCategory: "", //三级品类
          forthBrand: "", //四级品牌
          sellerInfo: "",//促销编码/名称
          supplierCode: "", //供货商代码
          businessModels: "", //供货商代码
          deliveryId: "",//配送单号
          userId: "",//登录门店id
        },
        pickerStart: {
          disabledDate: time => {
            return time.getTime() < new Date("2019-01-01").getTime();
          }
        },
        defaultDate: [new Date(), new Date()],
        changeDate: [new Date(), new Date()],
        //零售单状态
        sellRetailStatusList: [
          {value: 0, label: "全部"},
          {value: 1, label: "支付"},
          {value: 2, label: "取消"}
        ],
        //渠道
        channelList: [
          {value: 0, label: "全部"},
          {value: 16, label: "来购"},
          {value: 13, label: "美店分享"},
          {value: 10, label: "金力"},
        ],
        configItmesAll: [
          {label: "分部代码", prop: "salesOrgCode", className: 'hide', width: 100, disabled: false},
          {label: "分部名称", prop: "salesOrgName", className: 'show', width: 150, disabled: false},
          {label: "销售门店代码", prop: "storeCode", className: 'hide', width: 120, disabled: false},
          {label: "销售门店", prop: "storeName", className: 'show', width: 150, disabled: false}
        ],
        rules: {},
        chartData: [
          {
          name: '东北大区',
          percent: '100',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '90',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '80',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '70',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '60',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '50',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '40',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '30',
          price: '12345.45'
        }, {
          name: '东北大区',
          percent: '20',
          price: '12345.45'
        }],
        //一级分部
        firstDepartmentList: [
          {value: 0, label: "分部"},
          {value: 1, label: "门店"},
          {value: 2, label: "品类"},
          {value: 3, label: "品牌"},
          {value: 4, label: "不选"},
        ],
        secondStoreList: [],//二级门店
        thirdCategoryList: [],//三级品类
        forthBrandList: [],//四级品牌
        firstDepartmentFlag: true,//一级分部
        secondStoreFlag: true,//二级门店
        thirdCategoryFlag: true,//三级品类
        forthBrandFlag: true,//四级品牌
        //业务机型
        businessModelsList: [
          {value: 0, label: "分部"},
          {value: 1, label: "门店"},
          {value: 2, label: "品类"},
          {value: 3, label: "品牌"},
          {value: 4, label: "不选"},
        ],
        showMoreFlag: false,
        showMoreText: '点击查看更多',
        data5: JSON.parse(JSON.stringify(data))
      };
    },
    //vuex取值
    computed: mapState({
      LOGINDATA: "LOGINDATA"
    }),
    components: {
      commonSalesReportTree,
      commonSalesReportCategoryTree,
      commonSalesReportColumnSetting
    },
    created () {
    },
    mounted() {
      this.setInputGroupWrapperHeight();
      this.setProcessBarStyle();
      const that = this
      window.onresize = () => {
        that.setInputGroupWrapperHeight();
      }
    },
    methods: {
      //设置输入框外框高度
      setInputGroupWrapperHeight (){
        const height = this.$refs.inputGroupWrapper.$el.offsetHeight;
        if (height > 175) {
          this.showMoreFlag = true;
          this.$refs.inputGroupWrapper.$el.style.height = 175 + 'px';
          this.$refs.inputGroupWrapper.$el.style.overflow = 'hidden';
        }
      },
      //点击更多事件
      bindShowMoreEvent () {
        const height = this.$refs.inputGroupWrapper.$el.style.height;
        if (height == '175px') {
          this.$refs.inputGroupWrapper.$el.style.height = 'auto';
          this.showMoreText = '点击收起更多';
        } else {
          this.$refs.inputGroupWrapper.$el.style.height = 175 + 'px';
          this.showMoreText = '点击查看更多';
        }
      },
      //设置进度条样式
      setProcessBarStyle () {
        this.chartData.map((item, index) => {
          item._style = {
            width: item.percent + '%',
            opacity: (1 / (index + 1)).toFixed(2)
          }
        })
      },
      //调用子组件的方法获得id值
      getSaleDepartmentsId (data) {
        this.form.department = data.storeCodes;
      },
      query(){
        getQueryParams(this);
        console.log(getQueryParams(this))
      },
      /**
       * 一级分部选择事件
       * 1.将一级列表数据中被选中的过滤掉剩下的值赋值给二级列表
       * 2.如果一级选择不选，二级置灰不可选
       * 3.将三级四级数据清空，并且置灰以防来回切换数据不能正确显示
       */
      changeFirstDepartment() {
        let _this = this;
        this.secondStoreList = this.firstDepartmentList.filter(item => item.value != _this.form.firstDepartment);
        this.form.firstDepartment == 4 ? this.secondStoreFlag = true : this.secondStoreFlag = false;
        this.form.secondStore = '';

        //置灰三级
        this.thirdCategoryList = [];
        this.thirdCategoryFlag = true;
        this.form.thirdCategory = '';

        //置灰四级
        this.forthBrandList = [];
        this.forthBrandFlag = true;
        this.form.forthBrand = '';
      },
      /**
       * 二级门店选择事件
       * 1.将二级列表数据中被选中的过滤掉剩下的值赋值给三级列表
       * 2.如果二级选择不选，三级置灰不可选
       * 3.将四级数据清空，并且置灰以防来回切换数据不能正确显示
       */
      changeSecondStore() {
        let _this = this;
        this.thirdCategoryList = this.secondStoreList.filter(item => item.value != _this.form.secondStore);
        this.form.secondStore == 4 ? this.thirdCategoryFlag = true : this.thirdCategoryFlag = false;
        this.form.thirdCategory = '';

        //置灰四级
        this.forthBrandList = [];
        this.forthBrandFlag = true;
        this.form.forthBrand = '';
      },
      /**
       * 三级品类选择事件
       * 1.将三级列表数据中被选中的过滤掉剩下的值赋值给四级列表
       * 2.如果三级选择不选，四级置灰不可选
       */
      changeThirdCategory() {
        let _this = this;
        this.forthBrandList = this.thirdCategoryList.filter(item => item.value != _this.form.thirdCategory);
        this.form.thirdCategory == 4 ? this.forthBrandFlag = true : this.forthBrandFlag = false;
        this.form.forthBrand = '';
      },
      /**
       * 四级品牌选择事件
       */
      changeForthBrand() {

      },
      resetForm () {
        this.secondStoreFlag = true;
        this.thirdCategoryFlag = true;
        this.forthBrandFlag = true;
        this.secondStoreList = [];
        this.thirdCategoryList = [];
        this.forthBrandList = [];
        this.form.firstDepartment = '';
        this.form.secondStore = '';
        this.form.thirdCategory = '';
        this.form.forthBrand = '';
        this.form.department = '';
        this.form.store = '';
        this.form.brandInfo = '';
        this.form.productInfo = '';
        this.form.sellRetailStatus = '';
        this.form.sellerInfo = '';
        this.form.supplierCode = '';
        this.form.businessModels = '';
        this.form.deliveryId = '';
        this.form.userId = '';
        this. changeDate = [new Date(), new Date()];
      },
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      handcallback(data,node,el){
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      loadNode1(node, resolve) {
        if (node.level === 0) {
          return resolve([{
            price:"111",
            number:'1111',
            xiaoshou:'1111',
            baifenbi:'1111',
            zengzhang:'1111',
            caozuo:'1',
            label: '一级 1',
          },{
            price:"222",
            number:'2222',
            xiaoshou:'2222',
            baifenbi:'2222',
            zengzhang:'2222',
            caozuo:'1',
            label: '一级 2',
          }]);
        }
        //if (node.level > 1) return resolve([]);
        // if (node.level > 1) {
        //   alert('s')
        // }
        setTimeout(() => {
          var data = [];
          API.getTwoData().then(function(data){
              data = data.data.children;
              
              resolve(data);
          })
        }, 500);
      }
    }
  };
</script>
