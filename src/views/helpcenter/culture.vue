<template>
  <div class="help-content">
    <div class="title">久批文化</div>
    <p>易久批致力于为用户提供质保价优的产品以及完善的配套服务。</p>
    <p class="c-3">【多】</p>
    <p>品项齐全——白酒饮料红酒啤酒茶叶等全品项一站式采购</p>
    <br>
    <p class="c-3">【快】</p>
    <p>快速送达——当日/次日送达，不用等待</p>
    <br>
    <p class="c-3">【好】</p>
    <p>一件起送——1件起免费送货上门，不占库存占资金</p>
    <p>货到付款——收货、验货后，放心再付款</p>
    <br>
    <p class="c-3">【省】</p>
    <p>价格便宜——进货价更低，让您赚得更多</p>
    <p>查价比价——比比你的采购价，看看当天批发行情</p>
    <br>
    <p class="c-3">【真】</p>
    <p>产品保真——假一赔十，贴标销售，产品溯源</p>
  </div>
</template>
<script>
export default {
  name: "culture"
};
</script>
<style lang="stylus" scoped>
.help-content {
  ml(220);
}

p {
  ft(14);
  c(#666);
  line-height: 2em;
  mb(12);
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

br {
    ft(14)
    line-height: 2em;
}
</style>

