<template>
  <div class="brand_select">
      <div class="brand_toggle" @click="togglePanel" id="toggle-btn">
          <input class="placeholder" placeholder="请选择品牌名称" readonly="value" v-show="selectedShow">
          <div>
              <span class="selected-label" v-for="(item, index) in selectedList" :key="index"><span>{{item}}</span><i class="el-icon-close" @click.stop="removeSelect(index, PanelIndex)"></i></span>
          </div>
      </div>
      <div class="brand_all" v-if="brand_toggle" ref="main">
          <div class="brand_search">
              <el-input v-model='brand_search' @keyup.enter.native="change_search" placeholder="请输入内容"></el-input>
              <ul class="scroll-option">
                  <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                      <li class="checkItem" v-for="(item, index) in brandList" :key="index"><el-checkbox :label="item.adcode">{{item.name}}</el-checkbox></li>
                  </el-checkbox-group>
                  <li class="tips" v-if="brandList.length === 0">暂无数据,请输入关键字点击回车搜索</li>
              </ul>
              <div class="picker-opertaions">
                  <div class="place-checkbox-all">
                      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部/取消</el-checkbox>
                  </div>
                  <div><el-button @click="brand_toggle = false">取消</el-button><el-button type="primary" @click="confirm(PanelIndex)">确定</el-button></div>
              </div>
          </div>
      </div>
  </div>
</template>

<style src="assets/css/brand_select/brand_select.css"></style>
<style scoped>
.el-form-item__content{
  display: inline-block;
}
</style>

<script>
import { brandList } from 'api/serviceuser'
export default {
  props: ['brandId', 'brandPanelIndex', 'brandEdit'],
  data () {
    return {
      brand_search: '', // 搜索的值
      brandList: '', // 品牌返回结果
      checkAll: false, // 全选
      checkData: [],
      checkList: [],
      checkId: [], // 下拉选中的id
      isIndeterminate: true,
      selectedList: [],
      selectedId: [], // input 选中 id
      PanelIndex: '',
      edit: '',
      selectedShow: true, // 请选择品牌名称 input 是否显示
      brand_toggle: false // 判断搜索登录框是显示
    }
  },
  watch: {
    'selectedList': {
      handler: function (val) {
        val.length > 0 ? this.selectedShow = false : this.selectedShow = true
      },
      deep: true
    },
    'brandEdit': {
      immediate: true,
      handler: function (val) {
        this.edit = val
      }
    },
    'brandId': {
      immediate: true,
      handler: function (val, oldval) {
        var _this = this
        if (val !== '' && val !== oldval && this.edit !== '') {
          brandList({
            'id': val.join(',')
          }, (data) => {
            if (data.districts && data.districts.length > 0) {
              for (var i = 0; i < data.districts.length; i++) {
                _this.selectedList.push(data.districts[i].name)
                _this.selectedId.push(data.districts[i].adcode)
              }
            }
          })
        }
      }
    },
    'brandPanelIndex': {
      handler: function (index) {
        this.PanelIndex = index
      },
      immediate: true
    }
  },
  beforeDestroy () {
    this.hide()
  },
  methods: {
    togglePanel: function () {
      this.brand_toggle ? this.hide() : this.show()
    },
    show: function () {
      this.brand_toggle = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide: function () {
      this.brand_toggle = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel: function (e) {
      if (this.$refs.main && !this.$refs.main.contains(e.target)) { // 点击除弹出层外的空白区域
        this.hide()
      }
    },
    change_search: function () {
      let _this = this
      if (_this.brand_search !== '') {
        brandList({
          'name': _this.brand_search
        }, (data) => {
          if (data.districts) {
            _this.brandList = data.districts
          }
        })
      } else {
        _this.brandList = []
      }
    },
    handleCheckAllChange: function (val) {
      if (val === true) {
        for (var i = 0; i < this.brandList.length; i++) {
          this.checkList.push(this.brandList[i].adcode)
        }
      } else {
        this.checkList = []
      }
      this.isIndeterminate = false
    },
    confirm: function (PanelIndex) {
      for (var i = 0; i < this.checkList.length; i++) {
        this.selectedId.push(this.checkList[i])
      }
      this.selectedId = [...new Set(this.selectedId)] // 数组去重
      this.brand_toggle = false
      this.brand_search = ''
      this.brandList = []
      this.isIndeterminate = true
      if (this.selectedId.length > 0) {
        brandList({
          'id': this.selectedId.join(',')
        }, (data) => {
          if (data.districts && data.districts.length > 0) {
            for (var i = 0; i < data.districts.length; i++) {
              this.selectedList.push(data.districts[i].name)
            }
          }
          this.$emit('brandIdArr', {'brandId': this.selectedId, 'index': PanelIndex})
        })
      }
    },
    handleCheckedCitiesChange: function (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.brandList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.brandList.length
    },
    removeSelect: function (index, PanelIndex) {
      this.selectedList.splice(index, 1)
      this.selectedId.splice(index, 1)
      this.$emit('brandIdArr', {'brandId': this.selectedId, 'index': PanelIndex})
    }
  }
}
</script>
