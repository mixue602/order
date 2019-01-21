<template>
  <div class="waper">
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="item in swiperList" :key="item.id">
        <img class="swiper-img" :src="item.imgUrl">
    </swiper-slide>
    <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
  </div>
</template>
<script>
export default {
    name: 'homeSwiper',
    data () {
        return {
            swiperOption: {
                pagination: '.swiper-pagination',
            },
                swiperList: [
                {
                    id: '0001',
                    imgUrl: '//img1.qunarzz.com/qs/1809/f6/18a4edd3d78d1102.jpg'
                }, {
                    id: '0002',
                    imgUrl: '//img1.qunarzz.com/qs/1809/64/62160a38d119c202.jpg'
                }, {
                    id: '0003',
                    imgUrl: '//img1.qunarzz.com/qs/1809/cb/25012195ae916f02.jpg'
                }
            ]
        }
    }
}
</script>
<style lang="stylus" scoped>
    .waper >>> .swiper-pagination-bullet-active
        background: #fff;
    .waper
        overflow:hidden
        width:100%
        height:0
        padding-bottom:28%
        .swiper-img
            width:100%
</style>
