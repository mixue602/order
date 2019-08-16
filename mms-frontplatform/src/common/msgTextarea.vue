<template>
<div class="msg-textarea">
  <textarea class="textarea-box" @focus="isArea = 'B'" v-model="msgData.shortMsgContentB" placeholder="退订回T"
    :class="{'error': errors.has('msgContentB')}" name="msgContentB" v-validate="'max:500'"></textarea>
  <span>已输入{{infoContentB.length}}字，预计发送{{infoContentB.size}}条短信，70字/条，最多500字。</span>
  <span v-show="errors.has('msgContentB')" class="error" :style="'display:inline; position:static;'">已超过最大字数限制</span>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  /* total总条数，pageSize每页条数，pageNum第几页，pages页数 */
  props: ['total', 'pageSize', 'pageNum', 'pages'],
  data () {
    return {
      /* 展示页信息 */
      pageList: [],
      /* 跳转到文本框值 */
      inputval: '',
      /* 当前页 */
      current: 0,
      /* 每页展示数 */
      count: 10,
      countList: [10, 20, 30, 50]
    }
  },
  methods: {
    /* 点击按钮换页，this.$parent是当前组件的父组件，即为 vm 对象 */
    setpage: function (index) {
      if (index > 0 && index <= this.pages) {
        this.current = index
        this.inputval = index
      }
    },
    /* 输入框跳转 */
    setinput: function () {
      this.inputval = parseInt(this.inputval)
      if (this.inputval > 0 && this.inputval <= this.pages) {
        this.setpage(this.inputval)
      }
    },
    initPage: function () {
      var pagesArr = []
      if (this.pages <= 5) {
        for (let i = 1; i <= this.pages; i++) {
          pagesArr.push(i)
        }
      } else {
        if (this.current <= 3) {
          for (let i = 1; i < 5; i++) {
            pagesArr = [1, 2, 3, 4, 5]
          }
        } else {
          if (this.pages - this.current > 2) {
            pagesArr = [this.current - 2, this.current - 1, this.current, this.current + 1, this.current + 2]
          } else {
            for (let i = this.pages - 4; i <= this.pages; i++) {
              pagesArr.push(i)
            }
          }
        }
      }
      this.pageList = pagesArr
    }
  },
  watch: {
    pageNum: function () {
      this.current = this.pageNum
      this.initPage()
    },
    current: function () {
      this.initPage()
      this.$emit('pageinfo', {'pageindex': this.current, 'pagecount': this.count})
    },
    pageSize: function () {
      this.count = this.pageSize
      this.initPage()
    },
    count: function () {
      this.$emit('pageinfo', {'pageindex': this.current, 'pagecount': this.count})
    }
  }
}
</script>

<style>
.fl{
  float: left;
}
.pager {
  text-align: center;
  overflow: hidden;
}
.pager .pager-num{
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 10px;
}
.pager ul {
  display: inline-block;
  list-style: none;
}
.pager ul li{
  width: 28px;
  height: 28px;
  line-height: 28px;
  background: #fff;
  border: 1px solid #ddd;
  display: block;
  float: left;
  margin-right: 5px;
}
.pager .pager-group{
  display: inline-block;
  overflow: auto;
  zoom: 1;
  color: #333;
  margin-left: 5px;
}
.pager .pager-group select{
  width: 38px;
  height: 28px;
  border: 1px solid #ddd;
}
.pager .pager-group .page-input span{
  display: inline-block;
  margin: 0 2px 0 5px;
  color: #333;
}
.pager .pager-group .page-input input{
  width: 28px;
  height: 28px;
  line-height: 28px;
  background: #fff;
  border: 1px solid #ddd;
}
.pager .pager-group .page-input button{
  background: #4990e2;
  width: 30px;
  height: 30px;
  border: none;
  text-align: center;
  line-height: 30px;
  color: #fff;
  font-size: 12px;
  border-radius: 5px;
}
.pager li:hover {
  background-color: #eee;
  border-color: #ddd;
  cursor: pointer;
}
.pager .pager-group button:hover{
  opacity: 0.9;
}
.pager .disabled {
  color: #ccc;
  background-color: #eee;
  cursor: not-allowed;
}
.pager .active,
.pager .active:hover {
  color: #fff;
  background-color: #4990e2;
  border-color: #4990e2;
}
</style>
