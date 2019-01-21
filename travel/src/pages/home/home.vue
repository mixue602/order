<template>
  <div>
    <home-header></home-header>
    <home-swiper></home-swiper>
    <home-icons></home-icons>
    <home-city></home-city>
  </div>
</template>
<script>
import HomeHeader from './components/header'
import HomeSwiper from './components/swiper'
import HomeIcons from './components/icons'
import HomeCity from './components/city'
export default {
    name: 'home',
    components: {
        HomeHeader,
        HomeSwiper,
        HomeIcons,
        HomeCity
    }
}
</script>
