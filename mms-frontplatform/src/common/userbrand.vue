<template>
<div>
  <div>{{list}}</div>
  <div>{{listeample}}</div>
  <div class="form-group" > <!-- v-for="(list, index) in list" :key="index" -->
    <!-- <div><input v-model="brands" /></div> -->
    <span class="attr_left">用户行为</span><i class="mr5">近</i>
    <el-select v-model="listeample.days">
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="select_action clearfix">
      <div class="m_fl">行为：</div>
      <div class="m_fl select_action_list">
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="0" v-model="listeample.userAction">
          <span class="lbl"></span>
          浏览
      </label>
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="1" v-model="listeample.userAction">
          <span class="lbl"></span>
          搜索
      </label>
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="2" v-model="listeample.userAction">
          <span class="lbl"></span>
          加购
      </label>
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="3" v-model="listeample.userAction">
          <span class="lbl"></span>
          购买
      </label>
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="4" v-model="listeample.userAction">
          <span class="lbl"></span>
          活跃
      </label>
      <label class="pos-rel mr15">
          <input type="checkbox" class="ace" value="5" v-model="listeample.userAction">
          <span class="lbl"></span>
          过滤已购买
      </label>
      </div>
    </div>
    <div class="brad_out clearfix">
      <span class="m_fl brand">品类</span>
      <region-picker multiple :data="datalist"></region-picker>
    </div>
    <span class="m_fr mr10 del_btn">×</span>
  </div>
  <!-- <span class="add_btn_attr">+</span><span class="text_c" @click="addcomponent">添加</span>
  <span class="del_btn_attr">-</span><span class="text_c" @click="delcomponent">删除</span> -->
</div>
</template>

<script type="text/ecmascript-6">
import data from 'region-picker/src/components/data.json'
export default {
  props: [],
  data () {
    return {
      datalist: '',
      listeample: [{
        days: '',
        userAction: [],
        cat1Id: '',
        cat2Id: '',
        cat3Id: '',
        brandId: '',
        relative: ''
      }],
      list: [{
        days: '30天',
        userAction: [],
        cat1Id: '',
        cat2Id: '',
        cat3Id: '',
        brandId: '',
        relative: ''
      }],
      options1: [{
        value: '3',
        label: '3天'
      }, {
        value: '7',
        label: '7天'
      }, {
        value: '15',
        label: '15天'
      }, {
        value: '30',
        label: '30天'
      }, {
        value: '60',
        label: '60天'
      }, {
        value: '90',
        label: '90天'
      }]
    }
  },
  mounted () {
    this.datalist = data
  },
  methods: {
    addcomponent: function () { // 增加品类
      // this.baseinfo.list += this.brandCur++
      this.list.push(this.listeample)
    },
    delcomponent: function () {
      for (var i = 0; i < this.list.length; i++) {
        this.list.splice(i, 1)
        break
      }
    }
  },
  watch: {
    listeample: {
      handler (Type) {
        this.$emit('brandData', this.listeample)
        console.log(this.listeample)
      },
      deep: true
    }
  }
}
</script>
