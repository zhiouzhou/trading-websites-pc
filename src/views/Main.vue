<template>
  <div>
    <app-header/>
    <Navi/>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
import Navi from "./Navi.vue";
import AppFooter from "./AppFooter.vue";
export default {
  components: {
    AppHeader,
    Navi,
    AppFooter
  }
};
</script>
