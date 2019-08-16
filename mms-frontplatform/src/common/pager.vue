<template>
<div class="pager fr" v-show="pages>1">
  <div class="fr">
      <!-- <div class="pager-num fl" v-if="!isTotalTxt">共{{total}}条记录</div> -->
      <ul class="fl">
        <li v-if="current>1" @click="setpage(1)">«</li>
        <li :class="{disabled: current==1}" @click="setpage(current-1)">&lt;</li>
        <li v-for="index in pageList" :key="index" :class="{active:index===current}" @click="setpage(index)">{{index}}</li>
        <li :class="{disabled: current == pages}" @click="setpage(current+1)">&gt;</li>
        <li v-if="current<pages" v-on:click="setpage(pages)">»</li>
      </ul>
      <div class="pager-group fl">
        <select class="fl" v-model="count" :style="'width:50px'">
          <option v-for="item in countList" :key="item" :value="item">{{item}}</option>
        </select>
        <div class="page-input fl">
          <span>跳转</span>
          <input type="text" v-model.trim="inputval" v-on:keyup.enter="setinput"/>
          <span>页</span>
          <button @click="setinput" type="button">GO</button>
        </div>
      </div>
    </div>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  /* total总条数，pageSize每页条数，pageNum第几页，pages页数 */
  props: ['total', 'pages', 'pageNum', 'isTotalTxt'],
  data () {
    return {
      /* 展示页信息 */
      pageList: [],
      /* 跳转到文本框值 */
      inputval: '',
      /* 当前页 */
      current: 1,
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
      this.$emit('pageinfo', {'pageindex': this.current, 'pagecount': this.count})
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
    pageNum: {
      immediate: true,
      handler: function () {
        this.current = this.pageNum
      }
    },
    pages: {
      immediate: true,
      handler: function () {
        this.initPage()
      }
    },
    current: function () {
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
