<template>
<div class="m_fl select_components">
  <el-select v-model="select1.type" placeholder="请选择" name="type">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <span class="one_time" v-if="select1.type == 0"><i class="mr5">近</i>
    <el-select v-model="select1.valuerelative"  name="valuerelative">
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </span>
  <span class="qujian_input qujian_input_time" v-if="select1.type == 1">
    <el-date-picker
          v-model="select1.value1"
          type="date"
          size="small"
          :editable="false"
          :clearable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerStart" name="value1" >
    </el-date-picker>
    <el-date-picker
          v-model="select1.value2"
          type="date"
          size="small"
          :editable="false"
          :clearable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerEnd" name="value2">
    </el-date-picker>
  </span>
  <div class="clear"></div>
  <!-- <div class="error_on nopdleft" v-show="errors.has('type')">请完善用户信息</div>
  <div class="error_on nopdleft" v-show="sigledata">请填写相对时间</div>
  <div class="error_on nopdleft" v-show="errors.has('value1') || errors.has('value2')">请填写绝对时间</div> -->
  <!-- <div class="error_on nopdleft" v-show="smalldata">请填写绝对时间</div> -->
</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: [ 'selecttype', 'Vrelative', 'intime1', 'intime2' ],
  data () {
    return {
      sigledata: false,
      bigdata: false,
      smalldata: false,
      select1: { // 时间select
        type: '0',
        valuerelative: '3', // 相对时间
        value1: '', // 绝对时间
        value2: ''
      },
      options: [{
        value: '0',
        label: '相对时间'
      }, {
        value: '1',
        label: '绝对时间'
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
      }],
      pickerStart: {
        disabledDate: (time) => { // 判断前一个日历的日期不能大于后面的日历日期  且没有到的日期  不能选择
          if (this.select1.value2 !== '') {
            return time.getTime() > Date.now() || time.getTime() > this.select1.value2
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerEnd: { // 没有到的日期  不能选择
        disabledDate: (time) => {
          if (this.select1.value1 !== '') {
            var d = new Date(this.select1.value1).getTime() - 86400000
            d = d > 0 ? d : 0
            return time.getTime() < d || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  created: function () {
    this.$emit('changetypedata', this.select1)
  },
  watch: {
    selecttype: {
      immediate: true,
      handler: function () {
        if (this.selecttype !== '') {
          this.select1.type = this.selecttype
        }
      }
    },
    Vrelative: {
      immediate: true,
      handler: function () {
        if (this.Vrelative !== '') {
          this.select1.valuerelative = this.Vrelative
        }
      }
    },
    intime1: {
      immediate: true,
      handler: function () {
        if (this.intime1 !== '') {
          this.select1.value1 = this.intime1
        }
      }
    },
    intime2: {
      immediate: true,
      handler: function () {
        if (this.intime2 !== '') {
          this.select1.value2 = this.intime2
        }
      }
    },
    select1: {
      handler (Type) {
        // console.log(Type, 565656)
        this.$emit('changetypedata', this.select1)
        if (parseInt(Type.type) === 0) {
          this.select1.value1 = ''
          this.select1.value2 = ''
        } else if (parseInt(Type.type) === 1) {
          this.select1.valuerelative = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style>
.clear{ clear: both}
.error_on{ color: red;}
.select_components .mr5{ margin-left: 5px;}
.select_components .el-select>.el-input .el-input__inner{ width: 100px !important; height: 30px;}
.qujian_input_time{ margin-left: 10px;}
.qujian_input .el-date-editor.el-input, .el-date-editor.el-input__inner { width: 160px;}
</style>
