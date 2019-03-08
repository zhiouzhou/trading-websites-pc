<template>
  <div id="order-entry">
    <app-header/>
    <myjiupi-nav/>
    <div class="container">
      <div class="nav-footer clearfix">
        <div v-if="routerName=='memberDetail'||routerName=='ruleMember'"></div>
        <MyOrderNavSet
          v-else-if="routerName=='receiveAddress'||routerName=='userinfo'||routerName=='changepwd'||routerName=='changeMobile'||routerName=='changeMobileCode'||routerName=='editUserinfo'">
        </MyOrderNavSet>
        <myorder-nav v-else :pathName="pathName"></myorder-nav>
        <router-view/>
      </div>
    </div>
    <app-footer/>
  </div>
</template>

<script>
  import AppHeader from './../AppHeader'
  import MyorderNav from './myOrderLeftNav.vue'
  import MyOrderNavSet from './myOrderLeftNav_1.vue'
  import MyjiupiNav from './../assetCenter/myJiupiNav'
  import AppFooter from './../AppFooter'

  export default {
    data() {
      return {
        pathName: '',
        routerName: '',
      }
    },
    beforeMount() {
        this.routerName = this.$router.history.current.name
    },
    components: {
      AppFooter,
      MyorderNav,
      MyOrderNavSet,
      MyjiupiNav,
      AppHeader
    },
    watch: {
      "$route": function (to, from) {
        this.routerName = to.name
        console.log(`to`, to)
      }
    }
  }
</script>

<style lang='stylus' scoped>
  #order-entry {
    background: #f6f6f6
  }

  .nav-footer {
    // display: flex;
  }
</style>
