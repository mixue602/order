<template>
<div class="m_fl qujian_out">
  <el-select v-model="select2.type" placeholder="请选择">
    <el-option
      v-for="item in options2"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <span class="one_time" v-if="select2.type == 'gt' || select2.type == 'lt' || select2.type == 'eq'">
    <i class="mr5"></i>
    <el-input type="text" class="changeinput" v-model="select2.value1"></el-input>
  </span>
  <span class="qujian_input" v-if="select2.type == 'eq'">
    <i>一</i>
    <el-input type="text" class="changeinput" v-model="select2.value2" @blur="checkValue"></el-input>
  </span>
  <div class="clear"></div>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: [ 'qujian', 'data1', 'data2' ],
  data () {
    return {
      valueCheckState: false,
      select2: { // 区间选择框
        type: 'eq',
        value1: '',
        value2: ''
      },
      options2: [{
        value: 'gt',
        label: '大于等于'
      }, {
        value: 'lt',
        label: '小于等于'
      }, {
        value: 'eq',
        label: '区间'
      }]
    }
  },
  created: function () {
    this.$emit('qujiandata', this.select2)
  },
  methods: {
    checkValue: function () {
      if (this.select2.value1 && this.select2.value2 && this.select2.type === 'eq') {
        if (this.select2.value2 < this.select2.value1) {
          this.valueCheckState = true
        } else {
          this.valueCheckState = false
        }
      } else if (this.select2.type === 'gt' || this.select2.type === 'lt') {
        this.valueCheckState = false
      }
    }
  },
  watch: {
    qujian: {
      immediate: true,
      handler: function () {
        if (this.qujian !== '') {
          this.select2.type = this.qujian
        }
      }
    },
    data1: {
      immediate: true,
      handler: function () {
        if (this.data1 !== '') {
          this.select2.value1 = this.data1
        }
      }
    },
    data2: {
      immediate: true,
      handler: function () {
        if (this.data2 !== '') {
          this.select2.value2 = this.data2
        }
      }
    },
    select2: {
      handler (Type) {
        this.$emit('qujiandata', this.select2)
        if (Type.type === 'gt' || Type.type === 'lt') {
          this.select2.value2 = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style>
.qujian_out .changeinput{ width: 160px;}
.one_time{ margin-left: 10px;}
.form-group .qujian_out .el-select input[readonly][type=text]{ width: 100px !important;}
</style>
