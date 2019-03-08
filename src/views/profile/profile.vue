<template>
  <div id="profile">
    <app-header/>
    <profile-nav/>
    <!-- <div class="w">
      <div class="nav-footer">
        <MyOrderNavSet
          v-if="routerName=='receiveAddress'||routerName=='userinfo'||routerName=='changepwd'||routerName=='changeMobile'||routerName=='changeMobileCode'||routerName=='editUserinfo'">
        </MyOrderNavSet>
        <myorder-nav v-else></myorder-nav>
        <router-view/>
      </div>
    </div>-->
    <div class="w clearfix">
        <section class="profile-side">
            <profile-side/>
        </section>
        <section class="profile-main">
            <router-view/>
        </section>
    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "views/AppHeader.vue";
import profileNavi from "./profileNavi.vue";
import profileSide from "./profileSide.vue";
import AppFooter from "views/AppFooter.vue";

export default {
  //   data() {
  //     return {
  //       pathName: "",
  //       routerName: ""
  //     };
  //   },
  //   beforeMount() {
  //     this.routerName = this.$router.history.current.name;
  //   },
  components: {
    AppFooter,
    'profile-side': profileSide,
    "profile-nav": profileNavi,
    AppHeader
  }
};
</script>

<style lang='stylus'>
#profile {
  background: #f6f6f6;
}
.profile-side{
    flt()   
    w(200)
}
.profile-main{
    ml(220)
}
</style>
