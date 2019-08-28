export function formatIdNumber(str,frontLen,endLen){ // str：字符串，frontLen：前面保留位数，endLen：后面保留位数。
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
        xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
};