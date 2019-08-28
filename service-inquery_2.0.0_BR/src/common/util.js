/**
 * Created by jerry on 2017/4/14.
 */
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding (s, len) {
  let l = len - (s + '').length
  for (var i = 0; i < l; i++) { s = '0' + s }
  return s
};

export default {
  getQueryStringByName: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) { context = r[2] }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },
  formatDate: {

    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y': return padding(date.getFullYear(), $0.length)
          case 'M': return padding(date.getMonth() + 1, $0.length)
          case 'd': return padding(date.getDate(), $0.length)
          case 'w': return date.getDay() + 1
          case 'h': return padding(date.getHours(), $0.length)
          case 'm': return padding(date.getMinutes(), $0.length)
          case 's': return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length === matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y': _date.setFullYear(_int); break
            case 'M': _date.setMonth(_int - 1); break
            case 'd': _date.setDate(_int); break
            case 'h': _date.setHours(_int); break
            case 'm': _date.setMinutes(_int); break
            case 's': _date.setSeconds(_int); break
          }
        }
        return _date
      }
      return null
    }

  },

  //位运算
  sameSign(a, b) {
    return(a ^ b) >= 0
  },

  //向量：Vab = Pb - Pa，终点的坐标-起点坐标
  vector(a, b) {
    return {
      x: b.x - a.x,
      y: b.y - a.y
    }
  },

  //二维向量叉乘公式：a(x1,y1)*b(x2,y2) = x1*y2 - x2*y1
  vectorProduct(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y
  },

  //用叉乘法判断点在三角形内，符号相同，表示鼠标当前位置在三角形内，不同表示不在
  isPointInTrangle(p, a, b, c) {
    var pa = this.vector(p, a)
    var pb = this.vector(p, b)
    var pc = this.vector(p, c)
  
    var t1 = this.vectorProduct(pa, pb)
    var t2 = this.vectorProduct(pb, pc)
    var t3 = this.vectorProduct(pc, pa)
  
    return this.sameSign(t1, t2) && this.sameSign(t2, t3)
  },

  needDelay(elem, leftCorner, currMousePos) {
    var rect = elem.getBoundingClientRect();
  
    var topLeft = {
      x: rect.left,
      y: rect.top
    }
  
    var bottomLeft = {
      x: rect.left,
      y: rect.top + (rect.right - rect.left)
    }
  
    return this.isPointInTrangle(currMousePos, leftCorner, topLeft, bottomLeft)
  }

}
