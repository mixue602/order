<template>
  <div id="app">
    <el-container>
      <el-main>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
  </el-container>
  </div>
</template>

<style>
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,button,input,textarea,th,td{margin:0;padding:0}body,button,input,select,textarea{font:12px/1.5 arial,"\65b0\5b8b\4f53"}h1,h2,h3,h4,h5,h6{font-size:100%}address,cite,dfn,var,em,i,u{font-style:normal}ol,ul{list-style:none}a{text-decoration:none}a:hover{text-decoration:underline}img{border:none;vertical-align:middle}:focus{outline:0}button,input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}.wbox{width:1200px;margin:0 auto}body.w990 .wbox{width:990px}body.w1000 .wbox{width:1000px}.clearfix:after,.wbox:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clearfix,.wbox{*zoom:1}
@font-face{font-family:iconfont;src:url('/gmlib/ui/iconfont/1.0.0/iconfont.eot');src:url('/gmlib/ui/iconfont/1.0.0/iconfont.eot?#iefix') format('embedded-opentype'),url('/gmlib/ui/iconfont/1.0.0/iconfont.woff') format('woff'),url('/gmlib/ui/iconfont/1.0.0/iconfont.ttf') format('truetype'),url('/gmlib/ui/iconfont/1.0.0/iconfont.svg#iconfont') format('svg');}.gm-icon{font-family:'iconfont' !important;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:0.2px;-moz-osx-font-smoothing:grayscale;}
</style>


