<template>
  <div class="w">
      <div class="notice-tit">通知公告 <span class="arrow">&gt;</span></div>
      <site-frame :url="url" v-if="url" class="site-frame"></site-frame>
  </div>
</template>
<script>
import siteFrame from "components/common/siteFrame.vue";
export default {
  name: "notice",
  data() {
    return {
      url: ""
    };
  },
  created() {
    const { skipUrl } = this.$route.query;
    this.url = skipUrl ? skipUrl : "";
  },
  components: {
    "site-frame": siteFrame
  },
  mounted() {}
};
</script>
<style lang="stylus">
.notice-tit{
   margin 12px 
   ft(14) 
   c(#333)
}
.site-frame{
    width 100%
    pl(40) 
    box()
}
</style>


