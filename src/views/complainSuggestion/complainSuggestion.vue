<template>
  <div class="container complain-sus pre jiupi-center">

    <div class="sus-top">
      <div>投诉建议</div>
      <div @click="addNewComplain"><img src="../../assets/images/woyaozhaohuo.png" alt="" srcset=""><span>我要投诉</span></div>
    </div>
    <div class="susUs"><img src="../../assets/images/gouwuche_tishi.png" alt=""> 请对我们的服务进行评价</div>
    <div class="inner-container" v-for="item in complainList" :key="item.id">
      <div class="susHeader">
        <div>
          <p>投诉：{{item.complaintType}}</p>
          <p>{{item.createTimestr}}</p>
        </div>
        <div>{{item.state==0 ? '待客服处理' : item.state==1 ? '待城市经理处理': item.state==2 ? '待客服审核': item.state==3 ? '不予处理': item.state==4 ? '处理中': item.state==5 ?'处理中' : ''}}</div>
      </div>
      <div class="sus-question">
        <p v-if="item.orderNo">订单号：{{item.orderNo}}</p>
        <img src="../../assets/images/ic_mayizhangzi.png" alt="" v-if="item.handleResultEvaluate==0">  
        <img src="../../assets/images/ic_yibanzhangzi.png" alt="" v-if="item.handleResultEvaluate==1">  
        <img src="../../assets/images/ic_bumanyizhangzi.png" alt="" v-if="item.handleResultEvaluate==2">  
        <p>备注：<span>{{item.complaintRemarks}}</span></p>
        <div class="susContent" v-if="item.picUrl.length||item.handleResultEvaluate||item.handleResultEvaluate === 0">
          <div>
            <img :src="itemImg" alt="" v-for="itemImg in item.picUrl">
          </div>
        </div>
      </div>
      <div class="sus-reply" v-if="item.replyContent">
        <p>回复：{{item.replyContent}}</p>
        <p>{{item.replyTimeStr}}</p>
      </div>
      <div class="evaluate" v-if="item.canEvaluate">
          <div  @click="evaluateDialog(item.complaintId)">评价</div>
      </div>
      <div class="sus-reply" v-if="item.unSatisfiedReason">
        <p v-if="item.unSatisfiedReason">不满意原因：</p>
        <p v-if="item.unSatisfiedReason">{{item.unSatisfiedReason}}</p>
        <p v-if="item.handleEvaluateRemarks">{{item.handleEvaluateRemarks}}</p>
        <p>{{item.evaluateTime}}</p>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
    <el-pagination
        class="com-pagination"
        v-if="totalCount"
        background
        layout="prev, pager, next,total, jumper"
        :page-size="pageSize"
        :total="totalCount"
        prev-text="<上一页"
        next-text="下一页>"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 分页 -->
    <el-dialog title="投诉评价" :visible.sync="dialogVisible" width="480px" class="evaluateBody" center>
      <p class="complainEvaluate"><span>*</span><span>服务评价</span></p>
      <div class="evaluateResuit">
         <div @click="showReason(index,item)" v-for="(item,index) in evaluateList" :class="{selectDivs:index==currentIndex}">{{item}}</div>
      </div>
      <div v-if="reason">
        <p class="complainEvaluate"><span>*</span><span>不满意原因</span></p>
        <div class="evaluateResuit-el" v-if="reason">
          <div v-for="(item, index) in checkboxGroups" :key="item.reason" :class="{'evaluateResuit-el-select': item.select}" @click="selectReason(index)">{{item.reason}} <img src="@/assets/images/choose.png" v-show="item.select"> </div>
        </div>
      </div>
      <p>备注 (备选)</p>
      <el-input type="textarea" :rows="2" placeholder="请输入" v-model="textarea" class="textareaTxt">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit">提 交</el-button>
        <el-button @click="dialogVisible = false;">取 消</el-button>
      </span>
    </el-dialog>
     <div class="showGoodToast">感谢您的评价! 我们会继续努力提供更好的服务!</div>
     <div class="showBadToast">感谢您的评价! 我们会继续努力提供更好的服务!</div>
     <empty v-if="!complainList.length" :iconUrl="emptyImg" txt="您还没有投诉记录"></empty>
  </div>
</template>

<script>
  import * as FindService from "api/complainSuggestion/complainSuggestion";
  import empty from "components/common/empty.vue";
  import emptyImg from "assets/images/empty/noComplainsRecords.png";
  export default {
    data() {
      return {
        dialogVisible: false,
        textarea: '',//文本域内容
        reason: false,//不满意显示及隐藏
        complainList:[],//投诉列表
        serviceEvaluate:'',//服务评价
        unsatisfy:'',//不满意原因
        focus:false,
        checkboxGroups:[{
          reason: '没有解决问题',
          select: false
        },{
          reason: '处理不及时',
          select: false
        },{
          reason: '服务态度差',
          select: false
        }],
        checkboxGroup:[],
        complaintId:'',//投诉id
        evaluateList:['满意','一般','不满意'],
        currentIndex:4,
        totalCount:0,
        currentPage:1,
        pageSize:3,
        emptyImg: emptyImg
      }
    },
    components: {
      empty
    },
    mounted(){
      this.getcomplainSuggestion();
      //this.getComplainOrdersDetail();
    },
    methods: {
      //选择不满意原因
      selectReason(index){
        this.checkboxGroups[index].select = !this.checkboxGroups[index].select;
        let thisIndex = 0;
        let result = this.checkboxGroup.some((item,i) => {
          if(item === this.checkboxGroups[index].reason){
            thisIndex = i;
            return true;
          }
        })
        if(result){
          this.checkboxGroup.splice(thisIndex,1);
        }else {
          this.checkboxGroup.push(this.checkboxGroups[index].reason);
        }
      },
      getcomplainSuggestion(){//获取投诉建议列表
        let params={
          currentPage:this.currentPage,
          pageSize:this.pageSize
        }
        FindService.getComplainList(params).then(res=>{
          this.complainList=res.data;
          this.totalCount=res.totalCount;
        })
      },
      getComplainOrdersDetail(){
        FindService.getComplainOrdersDetail({data:this.complaintId}).then(res=>{
          if(res.success){
            this.complainList=res.data;
          }
        })
      },
      handleCurrentChange(val) {//分页
        console.log(`当前页: ${val}`);
        this.currentPage=val;
        this.getcomplainSuggestion();
      },
      evaluateDialog(id){//评价弹框
        this.serviceEvaluate = '';
        this.currentIndex = 4;
        this.reason = false;
        this.textarea = '';
        this.checkboxGroup = [];
        this.checkboxGroups.forEach(i => {
            i.select = false
          })
        this.dialogVisible=true;
        this.complaintId=id;
      },
      showReason(index,item){
        this.currentIndex=index;
        this.serviceEvaluate=index;
        if(item=='不满意'){
          this.reason=true;
        }else{
          this.reason=false;
          this.checkboxGroup=[];
          this.checkboxGroups.forEach(i => {
            i.select = false
          })
        }
      },
      submit(){//提交
        let {complaintId,remark,serviceEvaluate}=this;
        let params={
            complaintId,
            dissatisfactionReason:this.checkboxGroup,
            remark: this.textarea,
            serviceEvaluate
        };
        FindService.evaluateComplain(params).then(res=>{
          if(res.success){
            this.dialogVisible=false;
            this.$toast({text: '感谢您的评价！我们会继续努力提供更好的服务！'});
            this.getcomplainSuggestion();
          }else{
            this.$toast({text: res.desc,type: 'fail'});
          }
          this.dialogVisible = false;
          this.serviceEvaluate = '';
          this.currentIndex = 4;
          this.reason = false;
          this.textarea = '';
          this.checkboxGroup = [];
          this.checkboxGroups.forEach(i => {
              i.select = false
            })
        })
      },
      addNewComplain(){
        this.$router.push({
            path: "addNewComplain",
            query: {
              
            }
        });
      },
    }
  }

</script>

<style lang="stylus">
  .complain-sus{
    box()
    background-color #fff;  
    margin-bottom 39px;
    pb(60)

  .susHeader {
    background: #FAFAFB;
    // justify-content: space-between;
    // display: flex;
    // align-items: flex-start;
    border-bottom: 1px solid #EDEDED;
    padding 16px;

    >div {
      inline()
    }

    >div:last-child {
      frt()
      color: #E53935;
    }

    p:first-child {
      font-size: 14px;
      color :#414141;
      margin-bottom: 8px;
    }
    div,p{
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
  }

  .sus-question {
    pos(relative)
    padding 16px 16px 0
    >p {
      mb(16)
      color: #414141;
      word-wrap: break-word;

      // &:last-child {
      //   mb(0)
      // }
    }
    div,p{
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
    >img {
      pos(absolute)
      right 0
      top 50%
      transform translateY(-50%)
    }
  }
  
  .sus-reply {
    // height: 40px;
    margin-top: 20px;
    padding: 0 16px;

    >p:first-child  {
      margin-bottom 8px;
    }
    p{
      margin-bottom 8px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
  }

  .inner-container {
    border: 1px solid #EDEDED;
    margin: 20px;
  }

  .susUs {
    margin: 20px;
    margin-bottom -8px;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    >img{
      vertical-align: text-bottom;
      display: inline;
    }
  }

  .sus-top {
    // display: flex;
    // justify-content: space-between;
    padding: 28px 20px;
    // align-items: center;
    >div:first-child {
      inline()
      font-size:28px;
    }
    >div:last-child {
      inline()
      frt()
      lh(28)
      cursor :pointer;
      // display: flex;
      // align-items: center;
      color: #4A90E2;
      padding: 2px 8px;
      span{
       font-size : 16px;
       margin-left :8px;
      }
      img {
        inline()
        vertical-align text-bottom
      }
    }
  }

  .susContent {
    // display: flex;
    // justify-content: space-between;
    box()
    border-bottom: 1px solid #EDEDED;
    padding-bottom: 10px;
    height 92px

    >div {
      // display: flex;
      inline()
    }

    >div>img {
      inline()
      width: 84px;
      height: 84px;
      border: 1px solid #EDEDED;
      margin-right: 16px;
    }
    >img{
      frt()
      margin : 0 ;
    }
  }

  .evaluate {
    height: 30px;
    margin: 12px 16px;

    >div {
      cursor pointer;
      float: right;
      color: #E53935;
      padding: 9px 23px;
      border-color: #E53935;
      border-radius:2px;
      border:1px solid rgba(229,57,53,1);
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
  }

  .complainEvaluate {
    span:first-child {
      color: #E53539;
    }
  }

  .evaluateResuit {
    margin: 16px 0;
    // display : flex;
    >div{
      inline()
      cursor: pointer;
      width: 70px;
      height: 26px;
      border: 1px solid #BDBDBD;
      margin-right : 24px;
      text-align: center;
      line-height: 26px;
    }
  }

  .textareaTxt {
    margin-top: 12px;
  }

  .evaluateBody .el-dialog__header {
    border-bottom: 1px solid #F1F1F1;
  }

  .evaluateBody {
    .dialog-footer {
      // justify-content: space-around;
      // display: flex;

      >button {
        padding: 10px 46px 12px;
      }
      >button:first-child{
        background-color: #E53935;
        color: #fff;
      }
      >button:last-child{
        background-color: #EDEDED;
        color: #333333;
      }
      >button:last-child:hover{
        border-color: #E5E5E5;
      }
    }
  }

  .showGoodToast,.showBadToast{
    display :none;
    color : #FFFFFF;
    background-color : rgba(0,0,0,.5);
    width : 472px;
    height :64px;
    line-height : 64px;    
    text-align : center;
    position : absolute;
    top : 50%;
    left : 50%;
    margin-left : -236px;
  }

  .evaluateResuit-el{
    margin : 16px 0;
    // flex();
    
    div {
      inline()
      position relative
      width 84px
      height 26px
      c(#212121)
      font-weight 500
      text-c()
      lh(26)
      border 1px solid #BDBDBD
      box()
      mr(24)
      cursor pointer
    }

    img{
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .evaluateResuit-el-select {
      c(#E53539)
      border-color #E53539
    }
   }

  .evaluateResuit-el label>span:hover{
    border-color:#e53935;
  }

  .selectDivs{
     border :1px solid #E53539;
     background-color : #E53935;
     color : #fff;
     text-align :center!important;
  }

  .com-pagination{
    text-align right ;
  }

    .pagination {
  width 100%
  position absolute
  right 14px
  bottom 0
  display: flex;
  justify-content: flex-end;
  pt(24);
  pb(24);
}
 }
</style>
