<template>
  <div class="number-input">
    <div class="reduce" @click="handleReduce">
      <span v-bind:class="{ disabled: currentValue<=min }"></span>
    </div>
    <div class="input">
      <input :value="currentValue" @change="handleChange" />
    </div>
    <div class="add" @click="handleAdd">
      <span v-bind:class="{ disabled: currentValue>=max }"></span>
    </div>
  </div>
</template>

<script>
  function isValueNumber(value){
    return (/^(0|[1-9][0-9]*)$/).test(value);
  }
  export default{
    props:{
      max:{
        type:Number,
        default:Infinity
      },
      min:{
        type:Number,
        default:-Infinity
      },
      value:{
        type:Number,
        default:0
      },
      xs:{
        type:Number,
        default:1
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data:function(){
      var currentValue = 0 ;
      if(this.value > this.max){
        currentValue = this.max ;
      } else if(this.value < this.min){
        currentValue = this.min ;
      } else{
        currentValue = this.value ;
      }
      return {
        currentValue :currentValue
      }
    },
    methods:{
      handleChange:function(event){
        var val = event.target.value.trim() ;
        if(isValueNumber(val)){
          var max = this.max ;
          var min = this.min ;
          val = Number(val);
          this.currentValue = val ;
          if(val>max) this.currentValue = max ;
          if(val<min) this.currentValue = min ;
        }else{
          // 如果输入的非数字，则保留之前的数据
          event.target.value = this.currentValue ;
        }
      },
      // 绑定键盘事件
      handleKeydown:function(event){
        if(event.keyCode==38){
          this.handleAdd();
        }
        if(event.keyCode==40){
          this.handleReduce() ;
        }
      },
      handleAdd:function(){
        if(this.currentValue>=this.max){
          this.$parent.isToastShow = true
          this.$parent.toastMessage = `不能超过限购数量`
          return ;
        }
        this.currentValue += this.xs ;
      },handleReduce:function(){
        if(this.currentValue<=this.min){
          this.$parent.isToastShow = true
          this.$parent.toastMessage = `不能低于起购数量`
          return ;
        }
        this.currentValue -= this.xs;
      },
      updateVal:function(val){
        if(val>this.max) val = this.max ;
        if(val<this.min) val = this.min ;
        this.currentValue = val ;
      }
    },
    watch:{
      // 增加监听
      currentValue:function(val){
        this.$emit('input',val);
        this.$emit('on-change',val);
        this.$emit('on-input',{val,index: this.index})
      },
      value:function(val){
        this.updateVal(val);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .number-input{
    inline()
    font-size 10px
    color #333333
    width 94px
    height 28px
    border-radius 1px
    border 1px solid rgba(189,189,189,1)
    box-sizing border-box
    // display flex
    background #fff;
    .reduce{
      pos(relative)
      flt()
      box()
      width 26px
      border-right 1px solid #bdbdbd
      inline()
      height 27px
      // display flex
      // justify-content center
      // align-items center
      cursor pointer;
      span{
        pos(absolute)
        top 50%
        left 50%
        transform translate(-50%,-50%)
        display block
        width 10px
        height 10px
        background-image url(../../assets/images/jian_kedian@2x.png)
        background-size contain
        background-repeat no-repeat
        background-position center
      }
      .disabled{
        opacity 0.4
      }
    }
    .reduce:hover{
      background #f2f2f2;
    }
    .add{
      pos(relative)
      frt()
      box()
      width 26px
      height 27px
      border-left 1px solid #bdbdbd
      inline()
      // display flex
      // justify-content center
      // align-items center
      cursor pointer
      span{
        pos(absolute)
        top 50%
        left 50%
        transform translate(-50%,-50%)
        display block
        width 10px
        height 10px
        background-image url(../../assets/images/jia_kedian@2x.png)
        background-size contain
        background-repeat no-repeat
        background-position center
      }
      .disabled{
        opacity 0.4
      }
    }
    .add:hover{
      background #f2f2f2;
    }
    .input{
      pos(relative)
      flt()
      inline()
      height 28px
      // flex 1
      // display flex
      // align-items center
      input{
        pos(absolute)
        top 50%
        transform translateY(-50%)
        width 40px
        border 0
        padding 0
        text-align center
        -webkit-appearance none
        outline none
        border-radius 0
      }
    }
  }

</style>
