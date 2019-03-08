<template>
  <div class="prizeApply jiupi-center pre">
    <div class="apply-jiupi-title">
      <p>兑奖申请</p>
      <p @click="showExplain = true;explainText = '我知道了';">兑奖说明</p>
      <p class="cs" @click="showDialog=true">我要兑奖</p>
    </div>
    <!-- <div class="apply-message pre" v-if="applyMessage">
      <img src="../../assets/images/coupon_code_notice.png" alt>
      <p>{{applyMessage}}</p>
    </div>-->
    <empty v-if="isEmpty" :iconUrl="emptyImg" txt="您还没有申请兑奖，立即创建"></empty>
    <div v-if="!isEmpty">
      <div class="apply-list" v-for="(item,index) in applyList" :key="item.orderId">
        <div class="apply-list-no">
          <p>{{item.applyTime}}</p>
          <p>兑奖批次号：{{item.orderNo}}</p>
          <p
            :class="{'apply-state-reject':item.stateValue == 4||item.stateValue == 5,'apply-state-success':item.stateValue == 3}"
          >{{item.stateValue == 1?'待收取':item.stateValue == 2?'待兑奖':item.stateValue == 3?'已兑奖':item.stateValue == 4?'已取消':item.stateValue == 5?'已拒绝':''}}</p>
        </div>
        <div class="apply-list-title">
          <p>序号</p>
          <p>兑奖券名称</p>
          <p>申请数量</p>
        </div>
        <div>
          <div
            class="apply-list-item"
            v-for="(itemList,indexList) in item.itemList"
            :key="itemList.itemId"
          >
            <p>{{indexList+1}}</p>
            <p>{{itemList.awardName}}</p>
            <p>{{itemList.awardNum}}</p>
          </div>
        </div>
        <div class="apply-list-button">
          <div class="apply-btn" @click="goDetail(item.orderId)">查看详情</div>
          <div class="inline pre" v-if="item.canDelete">
            <confirm
              style="top:-117px;width:236px;"
              :ref="'delete'+index"
              text="您确定要删除该兑奖申请吗？"
              @determine="deleteApply(item.orderId)"
            ></confirm>
            <div class="apply-btn" @click="showDelete(index)">删除</div>
          </div>
          <div class="apply-btn" v-if="item.canModify" @click="changeApply(item.orderId)">修改兑奖</div>
          <div class="inline pre" v-if="item.canCancel">
            <confirm
              style="top:-117px;width:236px;"
              :ref="'confirm'+index"
              text="您确定要取消该兑奖申请吗？"
              @determine="cancelApply(index)"
            ></confirm>
            <div class="apply-btn" @click="showCancel(index)">取消申请</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 申请兑奖 -->
    <el-dialog
      title="我要兑奖"
      center
      :visible.sync="showDialog"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="add-apply-content">
        <div class="add-apply-address">
          <h5>请选择收货地址</h5>
          <div
            class="cs"
            v-for="item in addressList"
            :key="item.addressId"
            @click="selectAddress(item.addressId)"
          >
            <div :class="{'selectAddress':item.addressId == addressId}"></div>
            <span>{{item.contact}}</span>
            <span>{{item.mobileNo}}</span>
            <span>{{item.province+item.city+item.county+item.street+item.detailAddress}}</span>
            <p v-if="item.defaultAddress">默认地址</p>
          </div>
          <p class="cs" @click="moreAddress" v-if="userAddress.length>1">
            {{addressList.length>1?'收起地址':'更多地址'}}
            <img src alt :class="{'reverse': addressList.length>1}">
          </p>
        </div>
        <div class="add-apply-mark">
          <h5>备注</h5>
          <div>
            <input type="text" placeholder="选填，请输入备注信息（限40字以内）" v-model="remark" maxlength="40">
          </div>
        </div>
        <div>
          <div class="add-apply-title">
            <h5>兑奖券列表</h5>
            <p class="cs" @click="addApplyItem">
              <img src="../../assets/images/tianjia@2x.png" alt>添加新兑奖券
            </p>
            <span>{{errorName}}</span>
          </div>
          <div class="add-apply-list">
            <div class="add-apply-list-title">
              <p>序号</p>
              <p>兑奖券名称</p>
              <p>兑奖券数量</p>
            </div>
            <div class="add-apply-item" v-for="(item,index) in items">
              <p>{{index+1}}</p>
              <input
                type="text"
                placeholder="例如：康师傅乌龙茶300ml瓶盖"
                v-model="item.awardName"
                maxlength="40"
              >
              <div class="change-number pre">
                <number-input
                  :min="1"
                  :max="9999"
                  :value="item.awardNum"
                  :index="index"
                  @on-input="changeNum"
                ></number-input>
              </div>
              <div class="delete-apply-item cs" @click="deleteItem(index)" v-if="items.length>1">删除</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="add-apply-button cs"
        :class="{'add-apply-canSubmit':canSubmit}"
        @click="debounceSubmit"
      >提交申请</div>
    </el-dialog>
    <!-- 修改数量 -->
    <el-dialog
      title="修改兑奖"
      center
      :visible.sync="showChange"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="add-apply-content">
        <div>
          <div class="add-apply-title" style="margin-top: 0;">
            <h5>兑奖券列表</h5>
            <p class="cs" @click="addApplyItem">
              <img src="../../assets/images/tianjia@2x.png" alt>添加新兑奖券
            </p>
            <span>{{errorName}}</span>
          </div>
          <div class="add-apply-list">
            <div class="add-apply-list-title">
              <p>序号</p>
              <p>兑奖券名称</p>
              <p>兑奖券数量</p>
            </div>
            <div class="add-apply-item" v-for="(item,index) in items">
              <p>{{index+1}}</p>
              <p class="apply-change-name" v-if="item.itemId">{{item.awardName}}</p>
              <input
                type="text"
                placeholder="请输入，如：统一绿茶瓶盖"
                v-else
                v-model="item.awardName"
                maxlength="40"
              >
              <div class="change-number pre">
                <number-input
                  :min="1"
                  :max="9999"
                  :value="item.awardNum"
                  :index="index"
                  @on-input="changeNum"
                ></number-input>
              </div>
              <div
                class="delete-apply-item cs"
                @click="deleteChangeItem(index)"
                v-if="items.length>1"
              >删除</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="add-apply-button cs"
        :class="{'add-apply-canSubmit':canSubmit}"
        @click="changeSubmit"
      >保存</div>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        class="findgoods-pagination"
        v-if="totalCount"
        background
        layout="prev, pager, next,total, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        prev-text="<上一页"
        next-text="下一页>"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <apply-explain :show="showExplain" :text="explainText" @closeExplain="showExplain = false;"></apply-explain>
  </div>
</template>
<script>
import {
  getApplyList,
  deleteApply,
  cancelApply,
  addApply,
  getApplyDetail,
  changeApply,
  getSettingValue
} from "api/prizeApply/prizeApply.js";
import confirm from "components/common/confirm";
import numberInput from "components/common/NumberInput.vue";
import { debounce } from "common/lodash";
import applyExplain from "./applyExplain.vue";
import empty from "components/common/empty.vue";
import emptyImg from "@/assets/images/empty/duijiang_kong@2x.png";
export default {
  name: "prizeApply",
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      applyList: [],
      userAddress: [],
      addressList: [],
      addressId: "",
      remark: "",
      items: [
        {
          awardName: "",
          awardNum: 1,
          handleType: 0
        }
      ],
      canSubmit: false,
      showDialog: false,
      errorName: "",
      showChange: false,
      changeAddress: {
        contact: ""
      }, //修改订单的地址
      deleteItems: [], //删除的订单数组
      orderId: "",
      applyMessage: "",
      showExplain: false,
      isEmpty: false,
      emptyImg: emptyImg,
      explainText: ''
    };
  },
  components: {
    confirm,
    numberInput,
    applyExplain,
    empty
  },
  created() {
    //只显示一次弹框
    if (!localStorage.getItem("firstApplyExplain")) {
      this.explainText = '查看我的兑奖';
      this.showExplain = true;
      localStorage.setItem("firstApplyExplain", false);
    }
    this.getList();
    this.getAddress();
    // getSettingValue().then(res => {
    //   if (res.success) {
    //     this.applyMessage = res.data.AwardOrderServiceRemark;
    //   }
    // });
  },
  beforeRouteLeave(to,from,next){
    if(this.showExplain){
      let bodyTag = document.getElementsByTagName('body')[0];
      bodyTag.classList.remove('com-mask-background')
    }
    next()
  },
  mounted() {
    this.debounceSubmit = debounce(this.submit, 300, false);
  },
  methods: {
    getList() {
      //获取兑奖订单列表
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      getApplyList(params)
        .then(res => {
          if (res.success) {
            this.applyList = res.data;
            this.totalCount = res.totalCount;
            this.isEmpty = false;
            if (!res.data.length) {
              this.isEmpty = true;
            }
          } else {
            this.isEmpty = true;
          }
        })
        .catch(error => {
          this.isEmpty = true;
        });
    },
    getAddress() {
      this.userAddress = JSON.parse(localStorage.getItem("USER_ADDRESS"));
      let showAddress = this.userAddress.filter(function(item) {
        return item.state == 1;
      });
      //默认地址放第一
      this.userAddress = showAddress.sort(this.ascend("defaultAddress"));
      this.addressList.push(this.userAddress[0]);
      this.addressId = this.userAddress[0].addressId;
    },
    ascend(defaultAddress) {
      return function(a, b) {
        let value1 = a[defaultAddress];
        let value2 = b[defaultAddress];
        return value2 - value1;
      };
    },
    handleCurrentChange(page) {
      window.scrollTo(0, 0);
      this.currentPage = page;
      this.getList();
    },
    deleteApply(id) {
      //删除
      if(this.totalCount == this.pageSize+1){
          this.currentPage = 1;
      }
      deleteApply(id).then(res => {
        if (res.success) {
          this.$toast({ text: "删除成功" });
          this.getList();
        }
      });
    },
    cancelApply(index) {
      //取消
      cancelApply(this.applyList[index].orderId).then(res => {
        if (res.success) {
          this.$toast({ text: "取消成功" });
          this.applyList[index].canModify = false;
          this.applyList[index].canCancel = false;
          this.applyList[index].canDelete = true;
          this.applyList[index].stateValue = 4;
        }
      });
    },
    changeApply(id) {
      //修改数量
      this.showChange = true;
      getApplyDetail(id).then(res => {
        if (res.success) {
          this.changeAddress = res.data.addressVO;
          this.addressId = res.data.addressVO.addressId;
          this.orderId = res.data.orderId;
          let items = [];
          res.data.itemList.forEach(item => {
            items.push({
              awardName: item.awardName,
              awardNum: item.awardNum,
              itemId: item.itemId,
              handleType: 1
            });
          });
          this.items = items;
        }
      });
    },
    showCancel(index) {
      let ref = "confirm" + index;
      this.$refs[ref][0].showConfirm();
    },
    showDelete(index) {
      let ref = "delete" + index;
      this.$refs[ref][0].showConfirm();
    },
    goDetail(id) {
      this.$router.push({ name: "applyDetail", query: { orderId: id } });
    },
    moreAddress() {
      //收起地址
      if (this.addressList.length == 1) {
        this.addressList = this.userAddress;
      } else {
        this.addressList = [];
        this.addressList.push(this.userAddress[0]);
      }
    },
    selectAddress(id) {
      //选择地址
      this.addressId = id;
    },
    changeNum(e) {
      this.items[e.index].awardNum = e.val;
    },
    addApplyItem() {
      //添加新兑奖券
      this.items.push({
        awardName: "",
        awardNum: 1,
        handleType: 0
      });
    },
    deleteItem(index) {
      //删除兑奖券
      this.items.splice(index, 1);
    },
    deleteChangeItem(index) {
      //删除兑奖券
      let item = this.items[index];
      let handleType = item.handleType;
      if (handleType == 0) {
        this.items.splice(index, 1);
      } else if (handleType == 1) {
        item.handleType = 2;
        this.items.splice(index, 1);
        this.deleteItems.push(item);
      }
    },
    checkSubmit() {
      let submit = true;
      this.items.forEach(item => {
        if (!item.awardName) {
          submit = false;
        }
      });
      if (!this.addressId) {
        submit = false;
      }
      this.canSubmit = submit;
    },
    checkForm() {
      var reg = /^\S*([\u4e00-\u9fa5]+)\S*([\u4e00-\u9fa5]+)\S*([\u4e00-\u9fa5]+)\S*$/;
      this.errorName = "";
      for (var i = 0; i < this.items.length; i++) {
        if (!reg.test(this.items[i].awardName)) {
          this.errorName =
            "【" +
            this.items[i].awardName +
            "】兑奖券名称必须要有三个以上汉字，请修改后提交!";
          return;
        }
      }
    },
    //新增兑奖防抖动
    debounceSubmit() {
      this.debounceSubmit();
    },
    submit() {
      if (!this.canSubmit) {
        return;
      }
      this.checkForm();
      if (this.errorName) {
        return;
      }
      let { addressId, items, remark } = this;
      addApply({ addressId, items, remark }).then(res => {
        if (res.success) {
          this.$toast({
            text: "兑奖申请已提交成功，会和最近的订单一并由司机上门处理"
          });
          this.showDialog = false;
          this.getList();
        }
      });
    },
    changeSubmit() {
      if (!this.canSubmit) {
        return;
      }
      this.checkForm();
      if (this.errorName) {
        return;
      }
      let { addressId, items, deleteItems, remark, orderId } = this;
      let params = items.concat(deleteItems);
      changeApply({ addressId, items: params, remark, orderId }).then(res => {
        if (res.success) {
          this.$toast({
            text: "数量修改成功，等待司机确认"
          });
          this.showChange = false;
          this.getList();
        }
      });
    }
  },
  watch: {
    items: {
      handler(to, from) {
        this.checkSubmit();
      },
      deep: true
    },
    showDialog: function(to, from) {
      if (!to) {
        this.addressId = this.userAddress[0].addressId;
        this.remark = "";
        this.items = [
          {
            awardName: "",
            awardNum: 1,
            handleType: 0
          }
        ];
        this.addressList = [];
        this.addressList.push(this.userAddress[0]);
        this.errorName = "";
      }
    },
    showChange: function(to, from) {
      if (!to) {
        this.addressId = this.userAddress[0].addressId;
        this.remark = "";
        this.items = [
          {
            awardName: "",
            awardNum: 1,
            handleType: 0
          }
        ];
        this.changeAddress = [];
        this.deleteItems = [];
        this.errorName = "";
      }
    },
    showExplain: function(to, from) {
      const bodyTag = window.document.getElementsByTagName('body')[0]
      to ? bodyTag.classList.add('com-mask-background') : bodyTag.classList.remove('com-mask-background')
    }
  }
};
</script>
<style lang="stylus">
@import './prizeApply.styl';
</style>
