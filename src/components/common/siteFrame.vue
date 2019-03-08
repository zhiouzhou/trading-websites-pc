<template></template>
<script>
export default {
  name: "site-frame",
  props: {
    url: String
  },
  mounted() {
    this.$el.innerHTML =
      '<iframe src="' +
      this.url +
      '" frameborder="0" width="900" height="950" scrolling="auto"></iframe>';
  }
};
</script>
<style lang="stylus">
</style>


