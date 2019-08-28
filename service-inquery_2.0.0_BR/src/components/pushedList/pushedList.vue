<template>
  <el-container class="billHeader">
    <el-header class="pushedList-el-header" v-if="!noStoreInfoShow">
      <BillHeader @skuNoSearch="skuNoSearch"></BillHeader>
    </el-header>
    <el-main class="search-box" v-if="!noStoreInfoShow">
      
      <div class="search-box-type" v-show="!hotTypeCheckedShow">
        <div class="sidecategory"  @mouseleave="bindCategorysClose">
            <h2 class="all-category-title" @mouseenter="bindCategorysShow"><span>全部商品分类</span></h2>
            <categorys
              :categoryIsShow="categoryIsShow"
              @allCategorySearch="allCategorySearch"
            ></categorys>
        </div>
        <el-button-group>
          
          <el-button type="" :class="searchRec == 1 ? 'selBtn' : ''" icon="el-icon-menu" @click="skuNoRecSearch(1)">推荐商品</el-button>
          <el-button type="" :class="searchRec == 2 ? 'selBtn' : ''" icon="el-icon-menu" @click="skuNoRecSearch(2)">品类热销</el-button>
          <el-button type="" :class="!searchRec ? 'selBtn' : ''" icon="el-icon-menu" @click="skuNoHotSearch">导购热销</el-button>
          <el-button type="" :class="searchRec == 3 ? 'selBtn' : ''" icon="el-icon-menu" @click="skuNoRecSearch(3)">带单提奖</el-button>
        </el-button-group>
      </div>
      <!-- 导购热销没有筛选 -->
      <div class="search-crumb clearfix" v-show="searchRec">
        <div class="search-clumb-keyword fl" :title="searchClumbKeyword">{{searchClumbKeyword}}</div>
        <div class="search-crumb-searchNum fl">共{{sData.totalSkuCount}}个商品</div>
        <div class="fl search-crumb-selItem-box" v-if="category.selItem.length || brand.selItem.length">
          <!-- 选中的品牌 -->
          <div class="search-crumb-selItem fl" v-if="brand.selItem.length">
            <div class="clearfix">
              <div class="search-crumb-arr fl" v-if="brand.selItem.length">></div>
              <div class="selItemItemsBox fl" @click="selDelete({keyBy:'brand'})" ref="selItemList">
                <span>品牌：</span>
                <span class="selItemItems" v-for="item in brand.selItem" :key="item.id">{{item}}、</span>
                <span class="sel-delete">x</span>
              </div>
            </div>
          </div>
          <!-- 选中的品类 -->
          <div class="search-crumb-selItem fl" v-if="category.selItem.length">
            <div class="clearfix">
              <div class="search-crumb-arr fl" v-if="category.selItem.length">></div>
              <div class="selItemItemsBox fl" @click="selDelete({keyBy:'category'})" ref="selItemList2">
                <span>品类：</span>
                <span class="selItemItems" v-for="item in category.selItem" :key="item.id">{{item}}、</span>
                <span class="sel-delete">x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="search-key-box search-key-box-brand" v-if="brand.keysShow && brand.searchKeys.length">
        <el-row class="facts-keys">
          <el-col :span="2" class="search-key center">
            <b>品牌</b>
          </el-col>
          <el-col :span="22" class="key-list">
            <div :class="['key-height',brand.heightOneline ? 'height-oneline' :'']">
              <div :class="['keys-bar','keys']" ref="keyList2">
                <div class="pinlinList" v-show="brand.pinlinListShow">
                  <span :class="['pinyinSpan',item.pinyinActive ? 'borderRed' : '']" v-on:mouseover="mouseoverPinyin(item)" v-on:mouseout="mouseoutPinyin(item)" v-for="item in brand.pinyins" :key="item.id">{{item.pinyin}}</span>
                </div>
                <ul v-if="brand.selItemSingle">
                  <li v-for="item in brand.searchKeys" :key="item.id" @click="addKey({keyBy:'brand',code:item.code,name:item.name})">
                    <span class="key-btn" :title="item.name">{{item.name}}</span>
                  </li>
                </ul>
                <div v-else>
                  <el-checkbox-group v-model="brand.selItems" @change="addBrandKeys">
                    <el-checkbox class="key-btn" :title="item.name" v-for="item in brand.searchKeys" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="keys-sort">
                <div class="keys-up-down" v-if="brand.lessDownShow">
                  <div class="inbl" v-if="brand.morekeysDownShow" @click="morekeysDown({keyBy:'brand'})">更多<span class="ico-up-down ico-down">></span></div>
                  <div class="inbl" v-if="brand.lesskeysUpShow" @click="lesskeysUp({keyBy:'brand'})">收起<span class="ico-up-down ico-up">></span></div>
                </div>
                <div class="inbl keys-multi" v-if="brand.keysMultiSelShow" @click="keysMultiSel({keyBy:'brand'})">+多选</div>
              </div>
            </div>
            <div class="keys-sel-btns" v-if="!brand.selItemSingle">
              <div class="hasSelItems">
                <div class="label">已选品牌：</div>
                <el-checkbox-group v-model="brand.selItems" @change="addBrandKeys">
                  <el-checkbox class="key-btn" :title="item" v-for="item in brand.selItems" :label="item" :key="item.id">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="btns">
                <el-button type="primary" class="" @click="keysMultiSelSubmit({keyBy:'brand'})">确定</el-button>
                <el-button @click="keysSingleSel({keyBy:'brand'})" class="">取消</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-key-box search-key-box-category" v-if="category.keysShow && category.searchKeys.length">
        <el-row class="facts-keys">
          <el-col :span="2" class="search-key center">
            <b>品类</b>
          </el-col>
          <el-col :span="22" class="key-list">
            <div :class="['key-height',category.heightOneline ? 'height-oneline' :'']">
              <div :class="['keys-bar','keys']" ref="keyList">
                <ul v-if="category.selItemSingle">
                  <li v-for="item in category.searchKeys" :key="item.id" @click="addKey({keyBy:'category',code:item.code,name:item.name})">
                    <span class="key-btn" :title="item.name">{{item.name}}</span>
                  </li>
                </ul>
                <div v-else>
                  <el-checkbox-group v-model="category.selItems" @change="addCategoryKeys">
                    <el-checkbox class="key-btn" :title="item.name" v-for="item in category.searchKeys" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="keys-sort">
                <div class="keys-up-down" v-if="category.lessDownShow">
                  <div class="inbl" v-if="category.morekeysDownShow" @click="morekeysDown({keyBy:'category'})">更多<span class="ico-up-down ico-down">></span></div>
                  <div class="inbl" v-if="category.lesskeysUpShow" @click="lesskeysUp({keyBy:'category'})">收起<span class="ico-up-down ico-up">></span></div>
                </div>
                <div class="inbl keys-multi" v-if="category.keysMultiSelShow" @click="keysMultiSel({keyBy:'category'})">+多选</div>
              </div>
            </div>
            <div class="keys-sel-btns" v-if="!category.selItemSingle">
              <div class="hasSelItems">
                <div class="label">已选品类：</div>
                <el-checkbox-group v-model="category.selItems" @change="addCategoryKeys">
                  <el-checkbox class="key-btn" :title="item" v-for="item in category.selItems" :label="item" :key="item.id">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="btns">
                <el-button type="primary" class="" @click="keysMultiSelSubmit({keyBy:'category'})">确定</el-button>
                <el-button @click="keysSingleSel({keyBy:'category'})" class="">取消</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="search-result">
        <div class="search-result-sort" v-if="listShow">
          <el-row :class="searchRec ? '' : 'search-crumb-hot-pa'">
            <el-col :span="24" v-show="searchRec">
              <el-button-group>
                <el-button type="" :class="selBtnsShow.selDefault ? 'selBtn' : ''" @click="listSortBy('selDefault')" v-if="searchRec == 1">默认</el-button>
                <el-button type="" :class="selBtnsShow.selSales ? 'selBtn' : ''" @click="listSortBy('selSales')"  v-if="searchRec == 2">销量</el-button>
                <el-button type="" :class="selBtnsShow.selPrideDownShow ? 'selBtn' : ''" @click="listSortBy('selPrideDown')">提奖</el-button>
                <el-button type="" class="" @click="listSortBy('selPrice')" v-show="selBtnsShow.selPriceShow">价格</el-button>
                <el-button type="" class="selBtn" @click="listSortBy('selPriceUp')" v-show="selBtnsShow.selPriceUpShow">价格<span class="el-icon-back tr90deg"></span></el-button>
                <el-button type="" class="selBtn" @click="listSortBy('selPriceDown')" v-show="selBtnsShow.selPriceDownShow">价格<span class="el-icon-back tr270deg"></span></el-button>
              </el-button-group>
              <el-checkbox v-show="hotTypeCheckedShow" v-model="hotTypeChecked" class="hotTypeCheckedBtn" @change="handlehotTypeChecked">店长推荐</el-checkbox>
              <el-checkbox v-show="hasStockShow" v-model="hasStockChecked" class="hotTypeCheckedBtn" @change="handleStockChecked">仅显示有货</el-checkbox>

              <el-checkbox v-show="takeOrderAllShow" v-model="takeOrderAllChecked" class="hotTypeCheckedBtn" @change="handleTakeOrderChecked(1)">带单提奖（全部）</el-checkbox>
              <el-checkbox v-show="takeOrderEffectShow"  v-model="takeOrderEffectChecked" class="hotTypeCheckedBtn" @change="handleTakeOrderChecked(2)">带单提奖(已生效)</el-checkbox>
            </el-col>
            <el-col :span="12" v-show="!searchRec" class="search-crumb search-crumb-hot clearfix">
              <div class="search-clumb-keyword fl" title="导购热销">导购热销</div>
              <div class="search-crumb-searchNum fl">共{{sData.totalSkuCount}}个商品</div>
            </el-col>
            <el-col :span="24">
              <div class="page"
                v-if="pager && pager.totalSkuCount && pager.totalSkuCount > 0"
              >
                <el-pagination
                  class="pager"
                  v-if="pager.totalSkuCount"
                  @current-change="handleCurrentChange"
                  background
                  small
                  :pager-count="5"
                  layout="prev, pager, next"
                  :current-page="pager.currentPage"
                  :page-sizes="[10,20,50]"
                  :page-size="pager.pageSize"
                  :total="pager.totalSkuCount">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="search-result-list">
          <div v-if="list.length">
            <ul>
              <li class="clearfix" v-for="item in list" :key="item.id">
                <div class="item-img fl" v-if="!item.noImg">
                  <img :src="item.imageUrl" :onerror="noImg" alt="国美在线">
                  <span class="stock-mark" v-if="item.stock == 0">无货</span>
                </div>
                <div class="item-img item-img-noImg fl" v-else>
                  <span class="stock-mark" v-if="item.stock == 0">无货</span>
                </div>
                <div class="item-info fl">
                  <div class="item-name"><span :title="item.skuName">{{item.skuName}}</span></div>
                  <div class="item-rec-suit">
                    <span class="item-rec" v-if="item.hotType == 1">店长推荐</span>
                    <span class="item-suit" v-if="item.suitFlag == 1">优惠套装</span>
                    <span class="item-suit" v-if="item.presellFlag == 1">预售</span>
                    <span class="item-suit" v-if="item.warrantyFlag == 1">延保</span>
                    <span class="item-suit green" v-if="item.allowanceFlag == 1">节能补贴</span>
                    <span class="item-suit" v-if="item.intermediaryDTO">带单提奖</span>
                  </div>
                  <div class="item-price">价签价：<span class="price">{{item.price}}</span><span class="price-ico" :title="item.priceLimitAmount"></span></div>
                  <div class="item-code">商品编码：<span class="code">{{item.skuNo}}</span></div>
                </div>
                <div class="fr item-btn">
                  <el-button type="primary" @click="goBilling(item.skuNo)">开单</el-button>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="nodata-box">
            <div class="nodata-img" v-if="noData.length && !backSelShow">
              <img src="../../assets/images/default1.png" alt="">
            </div>
            <div v-if="noData.length && !backSelShow">{{noData}}</div>
            <div v-if="backSelShow">
                <div class="nodata-img">
                  <img src="../../assets/images/default1.png" alt="">
                </div>
                <div>抱歉，没有找到相关的商品 建议您修改筛选条件，<span class="backSel" @click="backSel">返回上一步</span></div>
            </div>
          </div>
        </div>
        <div class="page"
          v-if="pager && pager.totalSkuCount && pager.totalSkuCount > 0 && list.length"
        >
          <el-pagination
            class="pager"
            v-if="pager.totalSkuCount"
            @current-change="handleCurrentChange"
            background
            small
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :current-page="pager.currentPage"
            :page-sizes="[10,20,50]"
            :page-size="pager.pageSize"
            :total="pager.totalSkuCount">
          </el-pagination>
        </div>
      </div>
    </el-main>
    <el-main class="search-box" v-else>
      <div class="center noStoreInfo">{{noStoreInfo}}</div>
    </el-main>

    
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from  'vuex'
import store from '@/store/index'
import Router from 'vue-router'
import BillHeader from '../billHeader/billHeader.vue'
import categorys from './categorys.vue'
import { Loading } from "element-ui"
import API from '@/api/pushed_list/pushed_list'

export default {
  store,
  components:{
    BillHeader,
    categorys
  },
  created:function(){
    //进入页面首先进行一次默认推荐列表查询
    this.skuNoSearch(1)
  },
  mounted:function(){
    window.onresize = () => {
      if(this.keyList){
        if(this.keyList.offsetHeight > 40){
          this.category.lessDownShow = true
        }else{
          this.category.lessDownShow = false
        }
      }
      if(this.keyList2){
        if(this.keyList2.offsetHeight > 40){
          this.brand.lessDownShow = true
        }else{
          this.brand.lessDownShow = false
        }
      }
    }
  },
  updated:function(){
    //不能dom操作的 都放在了这里
    if(this.$refs.selItemList){
      let len = this.$refs.selItemList.getElementsByTagName('span').length
      let el = this.$refs.selItemList.getElementsByTagName('span')[len - 2]
      if(el.innerHTML.indexOf("、") !== -1)el.innerHTML = el.innerHTML.replace("、","")
    }
    if(this.$refs.selItemList2){
      let len = this.$refs.selItemList2.getElementsByTagName('span').length
      let el = this.$refs.selItemList2.getElementsByTagName('span')[len - 2]
      if(el.innerHTML.indexOf("、") !== -1)el.innerHTML = el.innerHTML.replace("、","")
    }

    this.keyList = this.$refs.keyList
    this.keyList2 = this.$refs.keyList2

    let keyList = this.$refs.keyList
    let keyList2 = this.$refs.keyList2
    if(keyList){
      let H = keyList.offsetHeight
      if(H > 40){
        this.category.lessDownShow = true
      }else{
        this.category.lessDownShow = false
      }
    }
    if(keyList2){
      let H = keyList2.offsetHeight
      if(H > 40){
        this.brand.lessDownShow = true
      }else{
        this.brand.lessDownShow = false
      }
    }
  },
  data() {
    return {
      noStoreInfoShow:false,//是否有权限
      noStoreInfo:"此页面对有门店组织关系的人员开放；未查询到您从属于哪个门店，此页面暂不能访问",
      keyList:0,//监控品牌和品类的el高度
      keyList2:0,
      searchClumbKeyword:"店长推荐商品",
      sData:{},//查询到的信息total
      //operatorSwitchShow:false,//是否显示切换导购员
      /** 按什么方式查询 **/
      searchRec:1,//0表示按照导购热销查询 1表示按照推荐列表查询, 2表示按照品类热销查询
      /** 入参 **/
      hotType:"1",//0默认全部 1店长推荐
      hotTypeChecked:true,//默认选中店长推荐
      hotTypeCheckedShow:false,//默认店长推荐不展示 当有关键词搜索的时候才展示 2018-12-19 默认推荐商品/导购热销切换也不展示
      instock:"0",//（仅显示有货）0全部商品 1只展示有货
      hasStockChecked:false,//默认不选中，展示全部商品（仅显示有货）
      hasStockShow:true,//默认（仅显示有货）展示
      keyWord:"",//当搜索词为大于等于五位纯数字时，模糊匹配商品编码字段
      brandIdList:[],//品牌集合
      categoryIdList:[],//品类集合
      sortType:"00",//00：默认值  排序方式待定 20：价格desc 21：价格asc 80：提奖金额desc 81：提奖金额asc
      currentPage:1,//当前页 参数值范围：1-48
      pageSize:20,//每页显示条数 参数值范围：1-100
      takeOrder: '-1',//'-1'表示不需要传这个字段，'1'全部带单提奖 '2'日期生效的带单提奖
      takeOrderAllChecked:false,//带单提奖（全部）是否选中
      takeOrderAllShow:false,//带单提奖（全部）是否显示
      takeOrderEffectChecked:false,//带单提奖（已生效）是否选中
      takeOrderEffectShow:false,//带单提奖（已生效）是否显示
      /** **/
      category:{
        searchKeysAll:[],//将所有的保存下来
        searchKeys:[],
        keysShow:true,//是否展示品类
        selItem:[],//选中的品类
        selItems:[],//多选暂时选中的品类
        selItemCode:[],//选中的品类code
        lessDownShow:true,//是否显示更多、收起
        heightOneline:true,//是否一行展示
        morekeysDownShow:true,//显示更多
        lesskeysUpShow:false,//显示收起
        selItemSingle:true,//是否为单选模式
        keysMultiSelShow:true,//是否多选
        keysSingleSelShow:false,//是否单选
      },
      brand:{
        pinyins:[],
        searchKeysAll:[],//将所有的保存下来
        pinlinListShow:true,//是否展示拼音列表
        searchKeys:[],
        keysShow:true,//是否展示品牌
        selItem:[],//选中的品牌
        selItems:[],//多选暂时选中的品牌
        selItemCode:[],//选中的品牌code
        lessDownShow:true,//是否显示更多、收起
        heightOneline:true,//是否一行展示
        morekeysDownShow:true,//显示更多
        lesskeysUpShow:false,//显示收起
        selItemSingle:true,//是否为单选模式
        keysMultiSelShow:true,//是否多选
        keysSingleSelShow:false,//是否单选
      },
      list:[],
      noData:"",//没有数据
      listShow:false,//是否显示当前搜索列表
      noImg: 'this.src="' + require('../../assets/images/noImg.png') + '"',//没有图片的情况
      backSelShow:false,//是否显示返回上一步搜索
      pager:{
        currentPage:1,
        pageSize:20,
        totalSkuCount:0,
        totalPage:0
      },
      selBtnsShow:{
        selDefault:true,//默认排序
        selSales: false,//按销量降序
        selPrideDownShow:false,//提奖降序

        selPriceShow:true,
        selPriceUpShow:false,//价格升序（默认？待定）
        selPriceDownShow:false,//价格降序
      },
      categoryIsShow: false,//全部品类是否显示
      selectedAllCategoryId: ''//已选择的全品类的品类id
    }
  },
  computed:{
    ...mapState({
      sellerNum:state=>state.sellerNum,
      storeCode:state=>state.storeCode,
      sellerName:state=>state.sellerName,
      billingUsedParam: state => state.billingUsedParam
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
  methods: {
    ...mapActions([

    ]),
    //鼠标滑过拼音
    mouseoverPinyin(json){
      let arr = []
      this.brand.pinyins.map((item)=>{
        item.pinyinActive = false
      })
      json.pinyinActive = true
      this.brand.searchKeysAll.map((item) => {
        if(item.pinyin == json.pinyin){
          arr.push(item)
        }else if(json.pinyin == "所有品牌"){
          arr = this.brand.searchKeysAll
        }
      })
      this.brand.searchKeys = [... new Set(arr)]
    },
    //鼠标滑出拼音
    mouseoutPinyin(json){
      // this.brand.pinyins.map((item)=>{
      //   item.pinyinActive = false
      // })
      // json.pinyinActive = true
    },
    //searchRec如果传了，表示是初始化 或者点击推荐商品或者品类热销，如果没有值表示是 头部的搜索按钮
    skuNoSearch(searchRec){
    
      this.keyWord = this.$store.state.skuNoSearchKeyWord
      //初始化是否选中仅显示有货 -> 默认不选中
      this.hasStockChecked = false
      this.instock = "0"

      this.takeOrder = '-1';
      this.takeOrderAllChecked = false;
      this.takeOrderAllShow = false;
      this.takeOrderEffectChecked = false;
      this.takeOrderEffectShow = false;

      if(searchRec == 1) {//表示带单提奖
        this.takeOrderAllShow = true;
        this.takeOrderEffectShow = true;
      }
      if(searchRec == 3) {//表示带单提奖
        this.takeOrder = '1';
        this.takeOrderEffectShow = true;
      }


      if(this.keyWord.length || this.selectedAllCategoryId) {
        this.searchClumbKeyword = this.keyWord
        this.hotTypeCheckedShow = true//默认不显示店长推荐复选框 但是搜出来的是店长推荐
        this.hotType = "0"
        this.hotTypeChecked = false
        this.takeOrderAllShow = true;
        this.takeOrderEffectShow = true;
      }else{
        this.searchClumbKeyword = "店长推荐商品"
        this.hotTypeCheckedShow = false//默认不显示店长推荐复选框 但是搜出来的是店长推荐
        this.hotType = "1"
        this.hotTypeChecked = true
      }
      
      this.searchRec = (searchRec ? searchRec : 1);

      if(this.searchRec == 2) {
        this.searchClumbKeyword = "热销商品"
      }
      //初始化查询条件
      this.currentPage = 1
      this.brandIdList = []
      //全部品类搜索的处理
      if(this.selectedAllCategoryId) {
        this.categoryIdList = this.selectedAllCategoryId.split(',');
        this.selectedAllCategoryId = '';
      }else {
        this.categoryIdList = []
      }
      this.brand.selItem = this.brand.selItems =[]
      this.category.selItem = this.category.selItems =[]
      this.category.keysShow = this.brand.keysShow = true
      this.keysSingleSel({keyBy:"category"})
      this.keysSingleSel({keyBy:"brand"})
      let sort = (searchRec == 1 || searchRec == 3 ? 'selDefault' : 'selSales');
      this.listSortBy(sort)
    },
    //点击更多 显示更多key
    morekeysDown(json){
      if(json.keyBy == "brand"){
        this.brand.pinlinListShow = true //展示拼音
      }
      this[json.keyBy].heightOneline = false
      this[json.keyBy].morekeysDownShow = false
      if(this[json.keyBy].lessDownShow == true){
        this[json.keyBy].lesskeysUpShow = true
      }
    },
    //收起更多
    lesskeysUp(json){
      this[json.keyBy].heightOneline = true
      this[json.keyBy].morekeysDownShow = true
      this[json.keyBy].lesskeysUpShow = false
      let timer = null
      clearTimeout(timer)
      if(json.keyBy == "brand"){
        this.brand.pinlinListShow = false //收起拼音
        this.brand.pinyins.map((item)=>{
          item.pinyinActive = false
        })
        if(this.brand.pinyins.length)this.brand.pinyins[0].pinyinActive = true
      }
      this[json.keyBy].searchKeys = []
      timer = setTimeout(()=>{
        this[json.keyBy].searchKeys = this[json.keyBy].searchKeysAll
      },10)
    },
    //单选
    addKey(json){
      let set = new Set(this[json.keyBy].selItem)
      let setCode = new Set(this[json.keyBy].selItemCode)
      set.add(json.name)
      setCode.add(json.code)
      this[json.keyBy].selItem = [...set]
      if(json.keyBy == "category") this.categoryIdList = [...setCode]
      if(json.keyBy == "brand") this.brandIdList = [...setCode]
      this[json.keyBy].keysShow = false
      this.currentPage = 1
      this.searchSku()
    },
    //多选品牌   控件自带函数 参数只能带val 不能带json 所以单独写了
    addBrandKeys(item){
      this.brand.selItems = [...new Set(item)]
    },
    //多选品类 如上
    addCategoryKeys(item){
      this.category.selItems = [...new Set(item)]
    },
    //删除已选 初始化
    selDelete(json){
      this[json.keyBy].selItem = this[json.keyBy].selItems =[]
      if(json.keyBy == "category") this.categoryIdList = []
      if(json.keyBy == "brand") this.brandIdList = []
      this[json.keyBy].keysShow = true
      this[json.keyBy].selItemSingle = true
      this[json.keyBy].keysMultiSelShow = true
      this.lesskeysUp({keyBy:json.keyBy})
      this.searchSku()
    },
    //点击多选
    keysMultiSel(json){
      this[json.keyBy].selItemSingle = false
      this[json.keyBy].keysMultiSelShow = false
      this[json.keyBy].keysSingleSelShow = true
      this[json.keyBy].morekeysDownShow = false
      // if(json.keyBy == "category"){
      //   this.$refs.keyList.style.height = "auto"
      // }else{
      //   this.$refs.keyList2.style.height = "auto"
      // }
      this.morekeysDown({keyBy:json.keyBy})
    },
    //点击取消（单选）
    keysSingleSel(json){
      this[json.keyBy].selItemSingle = true
      this[json.keyBy].keysMultiSelShow = true
      this[json.keyBy].keysSingleSelShow = false
      this[json.keyBy].morekeysDownShow = true
      this[json.keyBy].selItems =[]
      if(json.keyBy == "brand") this.brand.searchKeys = this.brand.searchKeysAll//初始化滑动事件
      this.lesskeysUp({keyBy:json.keyBy})
    },
    //多选 确定
    keysMultiSelSubmit(json){
      if(this[json.keyBy].selItems.length){
        this[json.keyBy].selItem = this[json.keyBy].selItems
        let arr = this[json.keyBy].selItem
        let bList = this[json.keyBy].searchKeysAll
        let box = []
        bList.map((item)=>{
          arr.map((i)=>{
            if(i == item.name) box.push(item.code)
          })
        })
        if(json.keyBy == "brand"){
          this.brandIdList = [...new Set(box)]
        }else{
          this.categoryIdList = [...new Set(box)]
        }
        this.currentPage = 1
        this[json.keyBy].keysShow = false
        this.searchSku()
      }else{
        this.popBlankMessage("请选中至少一项！")
      }
    },
    //切换推荐商品列表排序方式
    listSortBy(a){
      switch(a){
        //默认排序  方向显示为↑表示当前显示的是向上排序  但是此时点击的时候会重新向下排序搜索，反之也是
        case "selDefault":
          this.selBtnsShow.selDefault = true
          this.selBtnsShow.selSales = false
          this.selBtnsShow.selPrideDownShow = false
          this.selBtnsShow.selPriceShow = true

          this.selBtnsShow.selPriceUpShow = false
          this.selBtnsShow.selPriceDownShow = false
          //按照新的排序方式重新进行搜索
          this.sortType = "00"
          break

         //按销量降序
        case "selSales":
          this.selBtnsShow.selDefault = false
          this.selBtnsShow.selSales = true
          this.selBtnsShow.selPrideDownShow = false
          this.selBtnsShow.selPriceShow = true

          this.selBtnsShow.selPriceUpShow = false
          this.selBtnsShow.selPriceDownShow = false
          //按照新的排序方式重新进行搜索
          this.sortType = "90"
          break

        //按提奖降序
        case "selPrideDown":
          this.selBtnsShow.selDefault = false
          this.selBtnsShow.selSales = false
          this.selBtnsShow.selPrideDownShow = true
          this.selBtnsShow.selPriceShow = true

          this.selBtnsShow.selPriceUpShow = false
          this.selBtnsShow.selPriceDownShow = false
          //按照新的排序方式重新进行搜索
          this.sortType = "80"
          break
        //价格默认按升序 ？待定
        case "selPrice":
          this.selBtnsShow.selDefault = false
          this.selBtnsShow.selSales = false
          this.selBtnsShow.selPrideDownShow = false
          this.selBtnsShow.selPriceShow = false

          this.selBtnsShow.selPriceUpShow = true
          this.selBtnsShow.selPriceDownShow = false
          //按照新的排序方式重新进行搜索  重新点击会取反方向
          this.sortType = "21"
          break
        //按价格升序
        case "selPriceUp":
          this.selBtnsShow.selDefault = false
          this.selBtnsShow.selSales = false
          this.selBtnsShow.selPrideDownShow = false
          this.selBtnsShow.selPriceShow = false

          this.selBtnsShow.selPriceUpShow = false
          this.selBtnsShow.selPriceDownShow = true
          //按照新的排序方式重新进行搜索
          this.sortType = "20"
          break
        //按价格降序
        case "selPriceDown":
          this.selBtnsShow.selDefault = false
          this.selBtnsShow.selSales = false
          this.selBtnsShow.selPrideDownShow = false
          this.selBtnsShow.selPriceShow = false

          this.selBtnsShow.selPriceUpShow = true
          this.selBtnsShow.selPriceDownShow = false
          //按照新的排序方式重新进行搜索
          this.sortType = "21"
          break
      }
      this.currentPage = 1
      this.searchSku()
    },
    //是否选择店长推荐（默认不选中）
    handlehotTypeChecked(value){
      if(value){
        this.hotType = "1"
      }else{
        this.hotType = "0"
      }
      this.currentPage = 1
      this.searchSku()
    },
    //是否选择仅显示有货（默认不选中）
    handleStockChecked(value){
      if(value){
        this.instock = "1"
      }else{
        this.instock = "0"
      }
      this.currentPage = 1
      this.searchSku()
    },

    //是否选择带单提奖(全部或者已生效)
    handleTakeOrderChecked(type){
      this.takeOrder = '-1';
      if(type == 1) {

        if(this.takeOrderAllChecked) {
          this.takeOrderEffectChecked = false;
          this.takeOrder = '1';
        }
      }else {

        if(this.takeOrderEffectChecked) {
          this.takeOrderAllChecked = false;
          this.takeOrder = '2';
        }else {
          if(this.searchRec == 3) {
            this.takeOrder = '1';
          }
        }
      }
      
      this.currentPage = 1
      this.searchSku()
    },

    //全部品类搜索
    allCategorySearch(data) {
      this.categoryIsShow = false;
      this.selectedAllCategoryId = data.categoryId
      this.skuNoSearch();
    },

    searchSku(){
      this.sData = {}
      this.sData.totalSkuCount = 0
      this.list = []
      this.pager = {}
      this.noData = ""
      let params = {}
      params.hotType = this.hotType //店长推荐
      params.instock = this.instock //是否仅显示有货
      params.keyWord = this.keyWord //关键词
      if(this.searchRec){
        params.brandIdList = this.brandIdList //品牌集合
        params.categoryIdList = this.categoryIdList //品类集合
      }

      if(this.searchRec !=1 ) {
        params.sellerNum = this.billingUsedParam.sellerNum;
      }
      params.sortType = this.sortType //排序
      params.currentPage = this.currentPage //当前页
      params.pageSize = this.pageSize //每页显示条数
      params.searchRec = this.searchRec //按推荐列表查询还是按导购热销查询
      if(this.takeOrder != '-1') {
        params.takeOrder = this.takeOrder;
      }
      API.searchSku(params).then(data => {
        let loadingInstance = Loading.service({
            text: '加载中',
            target: document.querySelector(".search-result-list")
        })
        let timer = null
        clearTimeout(timer)
        if(data.success){
          loadingInstance.close()
          this.noStoreInfoShow = false
          timer = setTimeout(()=>{
            this.sData = data.response
            this.searchSkuBCInit(data)
            this.searchSkuListInit(data,params)
          },200)
        }else{
          loadingInstance.close()
          if(data.respCode && data.respCode == "logic.user.positionInfo"){
            this.noStoreInfoShow = true
          }else{
            timer = setTimeout(()=>{
              this.noStoreInfoShow = false;
              this.noData = "非常抱歉，没有找到相关的商品~"
              this.listShow = false
              this.popBlankMessage(data.respMsg || "推荐信息出现错误")
            },200)
          }
        }
      })
    },
    //搜索时处理品牌、品类
    searchSkuBCInit(data){
      if(data.response.categoryList){
        this.category.searchKeys = this.category.searchKeysAll = data.response.categoryList//品类集合
      }else{
        this.category.searchKeys = this.category.searchKeysAll = []
      }
      if(data.response.brandList){
        this.brand.searchKeys = this.brand.searchKeysAll = data.response.brandList//品牌集合
      }else{
        this.brand.searchKeys = this.brand.searchKeysAll = []
      }
      let arr = [],arrJson = []
      this.brand.searchKeys.map((item) => {
        arr.push(item.pinyin)
      })
      arr = [... new Set(arr.sort())]
      arr.map((item)=>{
        let json = {}
        json.pinyin = item
        json.pinyinActive = false
        arrJson.push(json)
      })
      arrJson.unshift({pinyin:"所有品牌",pinyinActive:true})
      this.brand.pinyins = [... new Set(arrJson)]
    },
    //搜索时处理list数据
    searchSkuListInit(data,params){
      this.list = data.response.skuList//商品列表
      this.pager.currentPage = data.response.currentPage
      this.pager.pageSize = data.response.pageSize
      this.pager.totalPage = data.response.totalPage
      this.pager.totalSkuCount = data.response.totalSkuCount
      if(this.list.length){
        this.list.map((item)=>{
          if(!item.imageUrl || !item.imageUrl.length){
            item.noImg = true
          }else{
            item.noImg = false
          }

          let limitPrice = item.limitPrice ? "提奖限价：¥" + item.limitPrice.toFixed(2) : ""
          let reward = "提奖金额（参考）：¥" + (item.reward ? item.reward.toFixed(2) : '0.00')
          let intermediary = '';
          if(item.intermediaryDTO) {
            intermediary = '\n带单提奖金额：¥' +  (item.intermediaryDTO.briBillBonus ? item.intermediaryDTO.briBillBonus.toFixed(2) : '0.00');
            if(item.intermediaryDTO.intermediaryStart && item.intermediaryDTO.intermediaryEnd) {
              intermediary += ' 日期：' + item.intermediaryDTO.intermediaryStart + '-' + item.intermediaryDTO.intermediaryEnd;
            }
          }
          item.priceLimitAmount = limitPrice + "  " + reward + intermediary
          if(!item.price || item.price == undefined){
            item.price = "无定价"
          }else{
            item.price = "¥" + item.price.toFixed(2)
          }
        })
        this.listShow = true
      }else{
        if(this.keyWord.length){
          if(params.hotType == "1" || params.instock == "1"){
            this.backSelShow = true
            this.noData = ""
            this.listShow = true
          }else{
            if(this.keyWord.length > 35){
              this.keyWord = this.keyWord.substring(0,35) + "..."
            }
            this.backSelShow = false
            this.noData = "非常抱歉，没有找到与" + this.keyWord + "相关的商品~"
            this.listShow = false
          }
        }else{
          if(params.instock == "1"){
            this.backSelShow = true
            this.noData = ""
            this.listShow = true
          }else{
            this.noData = "非常抱歉，没有找到相关的商品~"
            this.listShow = false
          }
        }
      }
    },
    //按照主推列表页查询
    skuNoRecSearch(val){
      this.$store.state.skuNoSearchKeyWord = "";
      this.skuNoSearch(val)
    },
    //按照热销列表页查询
    skuNoHotSearch(){
      this.keyWord = ""
      this.searchRec = 0 //按照导购热销查询
      this.brand.keysShow = this.category.keysShow = false
      this.sData = {}
      this.currentPage = 1
      this.searchSku()
    },
    //搜索店长推荐无结果时显示
    backSel(){
      if(this.keyWord.length){
        this.hotType = "0"
        this.hotTypeChecked = false
      }else{
        this.hotType = "1"
        this.hotTypeChecked = true
      }
      this.instock = "0"
      this.hasStockChecked = false
      this.searchSku()
    },
    //为空时弹出message
    popBlankMessage(message){
      this.$message({
        message:message,
        type: 'warning'
      })
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.searchSku()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    goBilling(code){
      if(code == '540014457') {
        this.$router.push('/service/buyPoints')
      }else {

        this.$router.push('/service/billing/?skuno=' + code)
      }
      this.$store.state.skuNoSearchKeyWord = ""
    },
    //全品类显示
    bindCategorysShow(e) {
      this.categoryIsShow = true;
    },
     //全品类消失
    bindCategorysClose(e) {
      this.categoryIsShow = false;
    },
  }
}
</script>

<style lang="stylus" scoped>
.clearfix:after
  content "."
  display block
  height 0
  clear both
  visibility hidden
.clearfix
  zoom 1
.hide
  display none
.fl
  float left
.fr
  float right
.inbl
  display inline-block
.show
  display table-cell
.center
  text-align center
.noStoreInfo
  color red
.tr90deg
  transform rotate(90deg)
.tr270deg
  transform rotate(270deg)
.bgDisabled,.bgDisabled:hover
  background rgb(228, 228, 228)
  color #fff
  border-color rgb(228, 228, 228)
.selBtn
  color white
  background-color #409EFF
  border-color #409EFF
.hotTypeCheckedBtn
  margin-left 10px
.key-height
  line-height 40px
  overflow-y auto
  max-height 160px
.height-oneline
  height 40px
  overflow hidden
.height-auto
  height auto
  overflow auto
.pushedList-el-header
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
// .el-container
//   border 1px solid #ccc

.search-box
  border 1px solid #ccc
  box-sizing border-box
  min-height 600px
  .search-box-type
    margin-bottom:10px
  .search-crumb
    font-size 12px
    padding-bottom 10px
    border-bottom 1px solid #ccc
    .search-clumb-keyword
      height 21px
      line-height 21px
      color #ff0000
      max-width 300px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .search-crumb-searchNum
      padding-left 10px
      height 21px
      line-height 21px
    .search-crumb-arr
      font-family "黑体"
      height 21px
      line-height 21px
      margin 0 5px
    .search-crumb-selItem-box
      width calc(100% - 400px)
      overflow hidden
    .search-crumb-selItem
      .selItemItemsBox
        border 1px solid #ccc
        max-width 340px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        padding 0 5px
        position relative
        padding-right 30px
        cursor pointer
        .sel-delete
          color #f00
        &:hover
          border 1px solid #f00
          color #f00
          .sel-delete
            color #fff
            background #f00
        .selItemItems
          display inline-block
          padding-right 5px
          /*margin-right 5px*/
          color #f00
        .sel-delete
          position absolute
          top -1px
          right -1px
          width 17px
          height 18px
          text-align center
          font-family "黑体"
          font-size 14px

  .search-crumb-hot-pa
    margin-bottom -10px
  .search-crumb-hot
    border-bottom none
    padding-bottom 0
  /*.search-key-box-category
    margin-bottom -1px*/
  .search-key-box
    border 1px solid #ccc
    border-top none
    background rgba(242, 242, 242, 1)
    .search-key
      padding 10px 0
      height auto
    .key-list
      /*padding 10px 0*/
      padding-right 140px
      background #fff
      border-left 1px solid #ccc
      box-sizing border-box
      position relative
      .keys-bar::-webkit-scrollbar
        width 6px
        height 1px
      .keys-bar::-webkit-scrollbar-thumb
        border-radius 10px
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,0.1)
        background #535353
      .keys-bar::-webkit-scrollbar-track
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,0.2)
        border-radius 10px
        background #EDEDED
      .keys
        margin-left 10px
        li
          // float left
          display inline-block
          width 80px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          margin-bottom -15px
          margin-right 10px
          .key-btn
            cursor pointer
            color #069
            font-size 12px
            &:hover
              color red
        .el-checkbox
          width 100px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          display inline-block
          margin-bottom -20px
          margin-left 0
          .el-checkbox__label
            font-size 12px
        .pinlinList
          margin-bottom -10px
          .pinyinSpan
            cursor pointer
            border 1px solid #fff
            margin-right 10px
            display inline-block
            width 20px
            height 20px
            line-height 20px
            text-align center
            font-size 12px
            color #069
            &:first-child
              width 60px
          .borderRed
              border 1px solid red
      .keys-sort
        position absolute
        right 15px
        top 10px
        width 120px
        .inbl
          cursor pointer
          float left
          margin-right 5px
          line-height 18px
          font-size 12px
          .ico-up-down
            border 1px solid #ccc
            text-align center
            width 18px
            height 18px
            line-height 18px
            margin-left 5px
            display inline-block
            font-family "黑体"
          .ico-down
            transform rotate(90deg)
          .ico-up
            transform rotate(-90deg)
          &:hover
            color red
            .ico-down
              border 1px solid red
        .keys-multi
          border 1px solid #ccc
          cursor pointer
          padding 0 5px
          float right
          &:hover
            border 1px solid red
      .keys-sel-btns
        /*padding-top 20px*/
        .hasSelItems
          display inline-block
          margin-left 10px
          margin-bottom 10px
          font-size 12px
          color #069
          .el-checkbox
            margin-left 0
            margin-right 10px
          .label
            display inline-block
          .el-checkbox-group
            display inline-block
        .btns
          text-align center
          margin-bottom 5px
        button
          padding 6px 10px
.search-result
  margin-top 20px
  .search-result-sort
    margin-bottom 20px
  .search-result-list
    li
      border 1px solid #ccc
      padding 20px
      margin-bottom 10px
      min-width 800px
      .item-img
        position relative
        .stock-mark
          font-size 12px
          background rgba(51,51,51,0.8)
          color #fff
          width 94px
          text-align center
          position absolute
          right 0px
          top 76px
          padding 0px 3px
          height 24px
          line-height 24px
        img
          width 100px
          height 100px
      .item-img-noImg
        width 100px
        height 100px
        background url(../../assets/images/noImg.png)
        background-repeat no-repeat
        background-size cover
      .item-info
        width calc(100% - 214px)
        line-height 1.5em
        padding-left 20px
        box-sizing border-box
        .item-name
          min-height 1.5em
          padding-bottom 5px
          width 100%
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .item-rec-suit
          padding-bottom 5px
          .item-rec,.item-suit
            color #ff0000
            border 1px solid #ff0000
            padding 0 3px
            font-size 12px
            border-radius 2px
          .green 
            color #0bb887
            border 1px solid #0bb887
        .item-price
          padding-bottom 5px
          .price
            color #ff0000
            font-weight bold
          .price-ico
            vertical-align -15%
            width 20px
            height 20px
            display inline-block
            color #fff
            margin-left 40px
            background url(../../assets/images/priceIcon.png)
            background-repeat no-repeat
            background-size cover
      .item-btn
        text-align center
        padding-top 50px
        button
          width 100px
          height 30px
.pager
  text-align right
.nodata-box
  font-size 16px
  text-align center
  background-repeat no-repeat
  background-size cover
  .backSel
    color red
    cursor pointer

.sidecategory {

  position: relative;
  display: inline-block;
  float: left;
  margin-right: 20px;
  .all-category-title {
    cursor: pointer;
    width: 200px;
    height:32px;
    line-height: 32px;
    background:#f1f1f1;
    opacity:0.9;
    filter:Alpha(opacity=90);
    span {
      display: block;
      color:#585858;
      font-family:'Microsoft YaHei';
      font-weight:bold;
      font-size:15px;
      padding-left:15px;
    }
  }
}
</style>
<style lang="stylus">
.search-box .el-checkbox .el-checkbox__label
  font-size 12px
  color #069
.bill-search-box .search-box
  .el-input--small
    font-size 12px
  .el-input--small .el-input__inner
    height 30px
    line-height 30px
  input
    font-size 12px
</style>




