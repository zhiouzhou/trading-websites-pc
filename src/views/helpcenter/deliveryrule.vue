<template>
  <div class="help-content">
    <div class="title">配送细则</div>
    <p>配送时间：</p>
    <p>当天下午15点前下单，会于第2天送货上门</p>
    <p>当天下午15点后下单，会于第3天送货上门</p>
  </div>
</template>
<script>
export default {
  name: "deliveryrule"
};
</script>
<style lang="stylus" scoped>
.help-content {
  ml(220);

  p {
    ft(14);
    c(#666);
    line-height: 2em;
    mb(12);
  }
}

.title {
  box();
  width: 100%;
  height: 52px;
  lh(52);
  pl(12);
  mb(8);
  ft(16);
  bg(#f5f5f5);
  c(#333);
}
</style>