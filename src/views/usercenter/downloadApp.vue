<template>
  <div class="w">
    <div class="app-title clearfix">
      <h3>手机久批</h3>
      <div>随时随地，方便进货</div>
      <!-- <router-link to="/index/home">返回商城首页>></router-link> -->
    </div>
    <div class="app-content">
      <div class="app-list">
        <p class="app-list-title">Android安卓版本</p>
        <img src="../../assets/images/home/download.png" alt="易久批app下载">
        <p class="fz16 c-6">手机扫描二维码下载</p>
        <a href="http://dl.yijiupi.com/app/ejiupi.apk" class="app-download">直接下载</a>
        <p class="c-6 fz16">直接下载到您的电脑</p>
      </div>
      <div class="app-list">
        <p class="app-list-title">IOS苹果版本</p>
        <img src="../../assets/images/home/download.png" alt="易久批app下载">
        <p class="fz16 c-6">手机扫描二维码下载</p>
        <a
          href="http://itunes.apple.com/cn/app/id849615531"
          class="app-download"
          
        >直接下载</a>
        <p class="c-6 fz16">直接下载到您的电脑</p>
      </div>
      <!-- <div class="app-list">
        <p class="app-list-title">手机网页版</p>
        <img src="../../assets/images/qrcode-mobile.png">
        <p class="fz16 c-6">手机扫描二维码直接访问</p>
        <a href="http://m.yijiupi.com"  class="app-web">http://m.yijiupi.com</a>
        <p class="c-6 fz16">通过手机浏览器，直接输入上面网址便可访问</p>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "downloadApp"
};
</script>
<style lang="stylus">
.app-title {
  margin: 40px 0 26px;
  c(#333);

  h3 {
    float: left;
    ft(20);
    font-weight: 600;
  }

  div {
    float: left;
    ml(24);
    pt(6);
    ft(14);
  }

  a {
    float: right;
    pt(6);
    c(#e43834);
    ft(14);
  }
}

.app-content {
  border: 1px solid #ddd;
  padding: 56px 32px;
  mb(38);
}

.app-list {
  width: 50%;
  text-c();
  inline();

  .app-list-title {
    ft(20);
    c(#333);
    font-weight: 500;
  }

  img {
    block();
    margin: 24px auto;
    width: 154px;
    height: 154px;
    overflow: hidden;
  }

  .app-download {
    block();
    margin: 32px auto 16px;
    width: 200px;
    height: 48px;
    ft(20);
    bg(#e43834);
    border: 1px solid #e43834;
    radius(4);
    c(#fff);
    text-c();
    lh(48);

    &:hover {
      bg(#ef5350);
      border-color: #ef5350;
    }
  }

  .app-web {
    block();
    margin: 32px auto 16px;
    width: 220px;
    height: 48px;
    ft(16);
    border: 1px solid #56abe4;
    c(#666);
    text-align: left;
    text-indent: 40px;
    lh(48);
    background: url('../../assets/images/icon_weburl.png') no-repeat 8px center;
  }
}
</style>
