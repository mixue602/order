<template>
  <div class="ug-input-wrap clearfix" :style="{height: iptHeight + 'px'}">
    <input class="el-input__inner ug-placeholder" :style="{height: iptHeight + 'px!important'}" :placeholder="choseArr.length > 0 ? '' : userPlaceholder" readonly v-if="!isDisable" @click="initUser()" />
    <input class="el-input__inner ug-placeholder" :style="{height: iptHeight + 'px!important'}" :placeholder="userPlaceholder" readonly v-if="isDisable" />
    <div class="ug-input clearfix" v-if="choseArr.length" ref="ugIpt">
      <span class="ug-chose-item" v-for="(item, key, index) in choseArr" :key="index" @click.stop="deleteUser(key)">
        {{copyUserData[item]}}<i class="ug-chose-btn el-icon-close"></i>
      </span>
    </div>
    <div class="ug-list clearfix" :style="{top: iptHeight + 'px'}" v-show="isSelectShow">
      <div class="mod-search search-mg">
        <el-input v-on:input="isSearch" v-model.trim="searchIpt" suffix-icon="el-icon-search" :placeholder="userPlaceholder"></el-input>
      </div>
      <div v-if="isradio == true || isradio == 'true'">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar">
          <el-radio-group v-model="radioChose" v-on:change="radioCheck">
            <el-radio class="ug-radio" v-for="(item, index) in usersArr" :key="index" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
          <slot></slot>
        </el-scrollbar>
      </div>
      <div v-else>
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar">
          <el-checkbox-group v-model="choseArr">
            <el-checkbox class="ug-checkbox" v-for="(item, index) in usersArr" :key="index" :label="item.id" :disabled="isSelectNo">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <slot></slot>
        </el-scrollbar>
      </div>
    </div>
    <!-- <div class="" ref="originGroupOption">{{msgoriginGroup}}</div> -->
    <!-- <div class="el-form-item__error" v-show="isSelectNo">请先选择目标群组</div> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { getMsgUserGroup, getMsgTestGroup } from 'api/msgService'
import { originGroupList } from 'api/serviceuser'
export default {
  props: ['type', 'choses', 'isradio', 'userPlaceholder', 'msgoriginGroup', 'isDisable'],
  data () {
    return {
      iptHeight: '',
      isSelectNo: false,
      isSelectShow: false,
      copyUserData: {},
      usersArr: {},
      choseArr: [],
      radioChose: '',
      searchIpt: ''
    }
  },
  mounted () {
    var _this = this
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target) && this.isSelectShow && (this.isradio !== 'true' || this.isradio === true)) {
        _this.isSelectShow = false
        _this.searchIpt = ''
        this.$emit('choseUsers', {data: this.choseArr, type: this.type})
      }
    })
  },
  methods: {
    initUser: function () {
      if (this.isradio === 'true' || this.isradio === true) {
        if (this.choseArr.length <= 0) {
          this.radioChose = ''
        }
      }
      this.dataInit()
      this.isSelectShow = true
    },
    dataInit: function (isSearch) {
      var _this = this
      switch (_this.type) {
        case '0':
          getMsgUserGroup({
            'groupType': _this.type,
            'groupNameOrId': _this.searchIpt
          }, function (data) { // 用户群组
            _this.usersArr = data.data
            if (isSearch !== 'true') {
              _this.usersArr.forEach(element => {
                _this.copyUserData[element.id] = element.name
              })
            }
          })
          break
        case '1':
          getMsgTestGroup({
            'groupNameOrId': _this.searchIpt
          }, function (data) { // 测试群组
            _this.usersArr = data.data
            if (isSearch !== 'true') {
              _this.usersArr.forEach(element => {
                _this.copyUserData[element.id] = element.name
              })
            }
          })
          break
        case '2':
          getMsgUserGroup({
            'groupType': _this.type,
            'groupNameOrId': _this.searchIpt
          }, function (data) { // 导入用户群组
            _this.usersArr = data.data
            if (isSearch !== 'true') {
              _this.usersArr.forEach(element => {
                _this.copyUserData[element.id] = element.name
              })
            }
          })
          break
        case '3':
          _this.isSelectNo = true
          if (_this.msgoriginGroup !== '') {
            _this.isSelectNo = false
            originGroupList({
              'groupIds': _this.msgoriginGroup,
              'name': _this.searchIpt
            }, function (data) { // 用户群管理-新建复合群-源群组
              _this.usersArr = data.data
              if (isSearch !== 'true') {
                _this.usersArr.forEach(element => {
                  _this.copyUserData[element.id] = element.name
                })
              }
            })
          } else {
            _this.isSelectNo = false
            originGroupList({
              'groupIds': _this.msgoriginGroup ? _this.msgoriginGroup : '',
              'name': _this.searchIpt
            }, function (data) { // 用户群管理-新建复合群-源群组
              _this.usersArr = data.data
              if (isSearch !== 'true') {
                _this.usersArr.forEach(element => {
                  _this.copyUserData[element.id] = element.name
                })
              }
            })
          }
          break
      }
    },
    isSearch: function () {
      this.dataInit('true')
    },
    deleteUser: function (index) {
      this.choseArr.splice(index, 1)
    },
    radioCheck: function () {
      this.isSelectShow = false
      this.$emit('choseUsers', {data: this.choseArr, type: this.type, show: false})
    }
  },
  watch: {
    'type': {
      immediate: true,
      handler: function () {
        this.dataInit()
      }
    },
    'choses': {
      immediate: true,
      handler: function () {
        if (JSON.stringify(this.copyUserData) === '{}') {
          this.dataInit()
        }
        this.choseArr = this.choses
      }
    },
    'choseArr': {
      immediate: true,
      handler: function () {
        if (this.choseArr.length > 10) {
          this.isSelectNo = true
          this.choseArr.pop()
        } else {
          this.isSelectNo = false
        }
        if (!this.isSelectShow && (this.isradio !== 'true' || this.isradio === true)) {
          this.$emit('choseUsers', {data: this.choseArr, type: this.type})
        }
        if (this.$refs.ugIpt) {
          this.iptHeight = this.$refs.ugIpt ? (this.$refs.ugIpt.offsetHeight) : '30'
        }
      }
    },
    'radioChose': function () {
      if (this.isradio === 'true' || this.isradio === true) {
        if (this.radioChose !== '') {
          this.choseArr[0] = this.radioChose
        } else {
          this.choseArr = []
        }
      }
    }
  }
}
</script>

<style>
.ug-input-wrap{ position:relative;}
.ug-input-wrap .ug-placeholder{ position:absolute; top:0; left:0; z-index:1;}
.ug-input-wrap .ug-input{ position:absolute; top:0; left:5px; z-index:5; width:auto; line-height: 30px;}
.ug-input-wrap .ug-input span{ background:#fff;}
.ug-list{ position:absolute; top:30px; z-index:10; padding-bottom:10px; background:#fff; width:100%; border:1px solid #ccc;}
.ug-list .ug-checkbox.el-checkbox,
.ug-list .ug-radio.el-radio{ display:block; margin-left:10px; margin-bottom:3px; line-height: 24px;}
.ug-list .ug-checkbox+.ug-checkbox,
.ug-list .ug-radio+.ug-radio{ margin-left:10px;}
.ug-chose-item{ display:inline-block; position:relative; margin-right:5px; padding:0 3px; line-height:20px; border:1px solid #ccc; cursor: pointer; font-size:13px;}
.ug-chose-btn{ margin-left:3px; font-size:12px; width:16px; height:16px; line-height:16px; color: #333;}
.ug-chose-btn:hover{ color:#76a9e3;}
.none{ display: none}
.ug-input-wrap .el-input__inner{ border-radius:0; cursor:pointer;}
.mm-user-group{ height:300px;}
.easy-scrollbar__wrap--hidden-default{ overflow:hidden;}
.el-icon-close:before {content: "\E60F";}
.ug-input-wrap .el-input__inner{ background: #fff!important;}
.ug-input-wrap .el-input__inner:disabled{ background: #eee!important;}

.el-main .el-form-item.is-error .search-mg .el-input__inner,
.el-main .el-form-item.is-error .search-mg .el-input__inner:focus,
.el-form-item.is-error .ug-placeholder.el-input__inner{ border:1px solid #ccc;}
</style>
