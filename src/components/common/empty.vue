<template>
  <div class="empty-page">
    <div>
      <img :src="iconUrl" alt>
    </div>
    <p class="fz18 c-3">{{txt}}</p>
    <!-- <router-link v-if="hasBtn" tag="span" class="default-btn" to='/navi/home'>
			返回首页
    </router-link>-->
  </div>
</template>

<script>
import avatar from "@/assets/images/empty/noProduct.png";
export default {
  name: "empty-page",
  props: {
    iconUrl: {
      type: String,
      default: avatar
    },
    txt: {
      type: String,
      default: "暂无数据"
    },
    hasBtn: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang='stylus'>
.empty-page {
  width: 100%;
  padding-top: 100px;

  >div {
    width: 152px;
    height: 152px;
    margin: 0 auto;

    >img {
      width: 100%;
      height: 100%;
    }
  }

  >p {
    text-align: center;
    margin-top: 20px;
  }

  .default-btn {
    display: block;
    width: 192px;
    height: 72px;
    line-height: 72px;
    margin: 32px auto 0;
    border-radius: 4px;
    border: 1PX solid rgba(102, 102, 102, 1);
    font-size: 32px;
    color: rgba(102, 102, 102, 1);
    text-align: center;
  }
}
</style>