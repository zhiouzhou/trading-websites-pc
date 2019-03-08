<template>
  <div class="img-show-box">
    <!--商品大图-->
    <div class="big-img" ref="bigBg">
      <img class="img-adapt" :src="imgs[currentIdx]" />
    </div>
    <!--商品小图-->
    <div class="breviary">
      <div class="pre swtich-icon" @click="breviaryPre()"></div>
      <ul class="list">
        <li class="item" :class="{ active: currentIdx == index}" v-for="(item,index) in imgs" @mouseover="breviaryOver(index)">
          <img class="img-adapt" :src="item" />
        </li>
      </ul>
      <div class="next swtich-icon" @click="breviaryNext()"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgs: {
        type: Array
      },
    },
    data() {
      return {
        currentIdx: 0,
      }
    },
    components:{

    },
    beforeCreate(){

    },
    created(){

    },
    methods:{
      breviaryOver(idx){
        this.currentIdx = idx
      },
      breviaryPre(){
        let idx = this.currentIdx
        this.currentIdx = idx <= 0 ? this.imgs.length-1 : idx - 1
      },
      breviaryNext(){
        let idx = this.currentIdx
        this.currentIdx = idx >= this.imgs.length-1 ? 0 : idx + 1
      },
    }
  }
</script>

<style lang="stylus" scoped>
.img-show-box{
  border 1px solid #E5E5E5;
  w(314)
  box-sizing border-box
}
  .big-img{
    width 100%
    h(314)
    bg(#fff)
  }
  .breviary{
    border-top 1px solid #E5E5E5;
    flex()
    flex-center()
    padding 18px 0
    .swtich-icon{
      w(16)
      h(16)
      background-image url(../../assets/images/bankMore-down.png)
      background-size contain
      background-repeat no-repeat
      background-position center
      cp()
      ml(8)
      mr(8)
    }
    .pre{
      transform rotate(90deg)
    }
    .next{
      transform rotate(270deg)
    }
    .list{
      flex-1()
      flex()
      align-items center
      flex-flow: row nowrap;
      overflow-x: auto;
      .item{
        w(60)
        h(60)
        border 1px solid #E5E5E5;
        box-sizing border-box;
        bg(#F4F4F4)
        mr(6)
        cp()
        bg(#fff)
        min-width 50px
      }
      .active{
        border 1px solid #E53935;
      }
    }
  }

</style>
