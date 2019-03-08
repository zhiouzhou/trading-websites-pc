<style lang="stylus">
.yjp-fade-enter {
  opacity: 0;
}

.yjp-fade-enter-active, .yjp-fade-leave-active {
  transition: opacity 0.4s;
}

.yjp-fade-leave-active {
  opacity: 0;
}

.yjp-message-box__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 9999;
}

.yjp-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 9998;
}

.yjp-message-box {
  position: relative;
  margin: 35vh auto 0;
  width: 420px;
  padding-bottom: 20px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.message-box-cancel {
  cp();
  inline();
  squ(30);
  pos(absolute);
  top: 5px;
  right: 5px;
  background: url('../../assets/images/cha@2x.png') no-repeat center;
  background-size: 18px 18px;
}

.message-box-duration {
  mt(20);
  pl(16);
  c(#999);
  text-align: left;
}

.yjp-message-box__header {
  padding: 15px;
  padding-bottom: 10px;

  .title {
    padding-left: 0;
    margin-bottom: 0;
    font-size: 16px;
    color: #303133;
  }
}

.yjp-message-box_img {
  squ(50);
  mb(16);
}

.yjp-message-box__content {
  position: relative;
  margin: 10px;
  padding: 10px 15px;
  color: #606266;
  text-align: center;

  >P {
    font-size: 14px;
  }
}

.yjp-message-box__btns {
  padding: 5px 15px 0;
  text-align: center;

  a {
    &:nth-of-type(2) {
      ml(12);
    }
  }
}

.yjp-message-btn {
  inline();
  bg(#fff);
  b1(#dcdfe6);
  c(#606266);
  text-c();
  box();
  margin: 0;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 2px;
}

.yjp-message-primary {
  color: #fff;
  background-color: #E53935;
  border-color: #E53935;
}
</style>
<template>
  <transition name="yjp-fade">
    <div class="yjp-dialog">
      <div class="yjp-message-box__wrapper" v-if="show">
        <div class="yjp-message-box">
          <i class="message-box-cancel" @click.stop="fail"></i>
          <div class="yjp-message-box__header">
            <div class="title" v-if="!imgUrl">{{title || '提示'}}</div>
          </div>
          <div class="yjp-message-box__content">
            <img
              v-if="imgUrl"
              :src="imgUrl"
              alt
              class="yjp-message-box_img"
              v-bind:style="imgStyle"
            >
            <p>{{content}}</p>
          </div>
          <div class="yjp-message-box__btns">
            <a
              href="javascript:;"
              class="yjp-message-btn"
              :class="noCls"
              @click.stop="fail"
              v-if="noText || noText==''"
            >{{noText || '取消'}}</a>
            <a
              href="javascript:;"
              class="yjp-message-btn yjp-message-primary"
              :class="yesCls"
              @click.stop="success"
              v-if="yesText || yesText==''"
            >{{yesText|| '确定'}}</a>
          </div>
          <div class="message-box-duration" v-if="showDuration">{{duration}}秒后自动消失</div>
        </div>
      </div>
      <div class="yjp-modal" v-if="show"></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "yjp",
  data() {
    return {
      show: false,
      duration: 3,
      imgStyle: {},
      imgUrl: "",
      showDuration: false,
      title: "",
      content: "",
      yesText: "",
      noText: "",
      noCls: "",
      yesCls: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.showDuration) {
        this.reduceTime();
      }
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    success() {
      this.show = false;
    },
    fail() {
      this.show = false;
    },
    reduceTime() {
      this.timer = setInterval(() => {
        if (this.duration > 1) {
          this.duration--;
        } else if (this.duration == 1) {
          this.show = false;
        }
      }, 1000);
    }
  }
};
</script>