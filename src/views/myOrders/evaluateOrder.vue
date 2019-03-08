<template>
  <div>
    <el-dialog title="评价" :visible.sync="dialogVisible" width="30%" class="evaluateBody" center>
      <div class="headerEvaliate"><span>感谢您选择易久批，请对我们的服务进行评价。您的评价将帮助我们为您提供更优质的服务</span></div>
      <p class="complainEvaluate"><span>*</span><span>服务评价</span></p>
      <div class="evaluateResuit">
        <div @click="showReason(index)" v-for="(item,index) in evaluateList" :class="{selectDivs:index==currentIndex}">{{item}}</div>
      </div>
      <p>备注 (选填)</p>
      <el-input type="textarea" :rows="2" placeholder="请输入" v-model="textarea" class="textareaTxt">
      </el-input>
      <div class="checkIndex">
          <!-- <el-checkbox label=""></el-checkbox> -->
          <div @click="hideName=!hideName">
              <img v-if="!hideName" src="../../assets/images/weigouxuanyouhuo_ic@3x.png" alt="">
              <img v-if="hideName" src="../../assets/images/yigouxuan.png" alt="">
          </div>
          <span>匿名</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEvaluate">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as FindService from "api/myOrders/myOrders";

  export default {
    data() {
      return {
        dialogVisible: false,
        reason: false,
        textarea: '',
        evaluateList:['满意','一般','不满意'],
        currentIndex:4,//选择的
        hideName:false,
      }
    },
    props: ['showDialog'],
    components: {

    },
    created(){
      console.log(this.$parent)
    },
    methods:{
      showReason(index){
        this.currentIndex=index;
      },
      evaluateOrder(){
        let params={
          orderNo:this.$parent.orderNo,
          content:this.textarea,
          anonymous:this.hideName,
          deliverySpeedScore:this.currentIndex
        }
        FindService.orderEvaluate(params).then(res=>{
          this.orderList=res.data;
        })
      },
      submitEvaluate(){
        this.dialogVisible=false;
        this.evaluateOrder();
      }
    },
    watch:{
      showDialog(val){
        this.dialogVisible=true
      }
    }
  }

</script>

<style lang='stylus' scoped>
   .headerEvaliate{
        padding : 14px;
        background-color : #F1DCB9;   
    }
  .evaluateBody .el-dialog__header {
    border-bottom: 1px solid #F1F1F1;
  }

  .evaluateBody {
    .dialog-footer {
      justify-content: space-around;
      display: flex;

      >button {
        width: 160px;
        height: 36px;
      }
    }
  }

  .evaluateResuit {
    margin: 16px 0;
    display : flex;
    >div{
      width : 70px;
      height :26px;
      line-height: 26px;
      margin-right: 16px;
      border: 1px solid #BDBDBD;
      text-align :center;
    }
  }

  .complainEvaluate {
    margin: 12px 0;
    span:first-child {
      color: #E53539;
    }
  }

  .textareaTxt {
    margin-top: 12px;
  }

   .el-checkbox__inner {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .el-checkbox__inner::after {
        height: 7px;
        left: 4px;
        width: 3px;
    }

    .anonymous{
        margin-top : 12px;    
    }

    .selectDivs{
      width : 70px;
      height :26px;
      background-color : #E53935;
      color : #fff;
    }

    .checkIndex{
      align-items: center;
      display: flex;
      margin-top: 16px;
    }
    .checkIndex>div {
      img{
        border-radius: 50%;
        width 16px;
        height : 16px;
        margin-right :16px;
      }
    }
</style>
