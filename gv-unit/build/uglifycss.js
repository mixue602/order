
var   path=require('path');
const fs = require('fs'),
   UglifyCSS = require('uglifycss');
var   cssfile = [];
var   pathUrl = './packages/theme-default/lib/css';




function geFileList(path)
{
   var filesList = [];
   readFile(path,filesList);
   return filesList;
}

//遍历读取文件
function readFile(path,filesList)
{
   files = fs.readdirSync(path);//需要用到同步读取
   files.forEach(walk);
   function walk(file)
   {  
        states = fs.statSync(path+'/'+file);    
        cssfile.push(path+'/'+file);     
        if(states.isDirectory())
        {
            readFile(path+'/'+file,filesList);
        }
        else
        {   

            //创建一个对象保存信息
            var obj = new Object();

            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = path+'/'+file; //文件绝对路径
            filesList.push(obj);
        }     
    }
}

geFileList(pathUrl)



let uglifyCode = UglifyCSS.processFiles(
	cssfile
	,{  maxLineLen :500 ,  expandVars:true });
 
function getCurrentDate(format) {	  var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";	 //精确到天
    if(format==1){
        time = year + "-" + month + "-" + date;
    }	  //精确到分
    else if(format==2){
        time = year +  month +  date+ "_" + hour + minu +sec;
    }
    return time;
}
var time=getCurrentDate(2)

fs.writeFileSync("./static/gv-unit.css", uglifyCode, 'utf-8');
console.log(geFileList("./static"));