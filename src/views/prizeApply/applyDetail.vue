<template>
  <div class="apply-detail jiupi-center">
    <div class="apply-detail-jiupi-title">
      <span>兑奖申请详情</span>
      <span @click="cancel" class="cs">返回<<</span>
    </div>
    <div class="apply-detail-userinfo">
      <h5>收货人信息</h5>
      <p>申请人：{{changeAddress.contact}}</p>
      <p
        v-if="changeAddress.addressId"
      >取券地址：{{changeAddress.province+changeAddress.city+changeAddress.county+changeAddress.detailAddress}}</p>
      <p v-if="applyInfo.remark">备注：{{applyInfo.remark}}</p>
    </div>
    <h5 class="apply-detail-list-title">兑奖券列表</h5>
    <div class="apply-list">
      <div class="apply-list-no">
        <p>{{applyInfo.applyTime}}</p>
        <p>申请单号：{{applyInfo.orderNo}}</p>
        <p
          :class="{'apply-state-reject':applyInfo.stateValue == 4||applyInfo.stateValue == 5,'apply-state-success':applyInfo.stateValue == 3}"
        >{{applyInfo.stateValue == 1?'待收取':applyInfo.stateValue == 2?'待兑奖':applyInfo.stateValue == 3?'已兑奖':applyInfo.stateValue == 4?'已取消':applyInfo.stateValue == 5?'已拒绝':''}}</p>
        <p v-if="applyInfo.stateValue == 3">兑奖红包总金额：{{applyInfo.totalBonusAmount}}元</p>
      </div>
      <div
        class="apply-list-title"
        :class="{'apply-list-title-reject':applyInfo.stateValue == 5,'apply-list-title-success':applyInfo.stateValue == 3}"
      >
        <p>序号</p>
        <p>兑奖券名称</p>
        <p>申请数量</p>
        <p v-if="applyInfo.stateValue == 3||applyInfo.stateValue == 5">可兑换数量</p>
        <p v-if="applyInfo.stateValue == 3">兑奖红包金额（元）</p>
        <p v-if="applyInfo.stateValue == 3||applyInfo.stateValue == 5">审核留言</p>
      </div>
      <div>
        <div
          class="apply-list-item"
          :class="{'apply-list-title-reject':applyInfo.stateValue == 5,'apply-list-title-success':applyInfo.stateValue == 3}"
          v-for="(itemList,indexList) in applyInfo.itemList"
          :key="itemList.itemId"
        >
          <p>{{indexList+1}}</p>
          <p>{{itemList.awardName}}</p>
          <p>{{itemList.awardNum}}</p>
          <p
            v-if="applyInfo.stateValue == 3||applyInfo.stateValue == 5"
            :class="{'c-red':itemList.canAwardNum<itemList.awardNum}"
          >{{itemList.canAwardNum}}</p>
          <p v-if="applyInfo.stateValue == 3">{{itemList.bonusAmount}}</p>
          <p v-if="applyInfo.stateValue == 3||applyInfo.stateValue == 5">{{itemList.auditRemark}}</p>
        </div>
      </div>
      <div
        class="apply-list-button"
        v-if="applyInfo.canDelete||applyInfo.canModify||applyInfo.canCancel"
      >
        <div class="inline pre" v-if="applyInfo.canDelete">
          <confirm
            style="top:-117px;width:236px;"
            ref="delete"
            text="您确定要删除该兑奖申请吗？"
            @determine="deleteApply(applyInfo.orderId)"
          ></confirm>
          <div class="apply-btn" @click="showDelete()">删除</div>
        </div>
        <div
          class="apply-btn"
          v-if="applyInfo.canModify"
          @click="changeApply(applyInfo.orderId)"
        >修改兑奖</div>
        <div class="inline pre" v-if="applyInfo.canCancel">
          <confirm
            style="top:-117px;width:236px;"
            ref="confirm"
            text="您确定要取消该兑奖申请吗？"
            @determine="cancelApply()"
          ></confirm>
          <div class="apply-btn" @click="showCancel()">取消申请</div>
        </div>
      </div>
    </div>
    <!-- 审核图片 -->
    <div class="apply-detail-img" v-if="applyInfo.rejectImgs.length>0">
      <p>不可兑奖券图片</p>
      <ul class="cash-img-wrapper">
        <li v-for="(item,index) in applyInfo.rejectImgs" :key="index">
          <img v-lazy="item">
        </li>
      </ul>
    </div>
    <!-- 修改数量 -->
    <el-dialog title="修改数量" :visible.sync="showChange" width="840px" :close-on-click-modal="false">
      <div class="add-apply-content" style="margin-right:-20px;">
        <div class="add-apply-address">
          <h5>收货地址</h5>
          <div class="cs" v-if="changeAddress.contact">
            <div class="selectAddress"></div>
            <span>{{changeAddress.contact}}</span>
            <span>{{changeAddress.mobileNo}}</span>
            <span>{{changeAddress.province+changeAddress.city+changeAddress.county+changeAddress.detailAddress}}</span>
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
  </div>
</template>
<script>
  import {
    getApplyDetail,
    cancelApply,
    deleteApply,
    changeApply
  } from "api/prizeApply/prizeApply.js";
  import confirm from "components/common/confirm";
  import numberInput from "components/common/NumberInput.vue";
  export default {
    name: "applyDetail",
    data() {
      return {
        list: [1],
        applyInfo: {
          rejectImgs: []
        },
        showChange: false,
        changeAddress: {},
        addressId: "",
        orderId: "",
        items: [],
        deleteItems: [],
        errorName: "",
        canSubmit: false
      };
    },
    components: {
      confirm,
      numberInput
    },
    created() {
      let orderId = this.$route.query.orderId;
      getApplyDetail(orderId).then(res => {
        if (res.success) {
          this.applyInfo = res.data;
          this.changeAddress = res.data.addressVO;
        }
      });
    },
    methods: {
      addApplyItem() {
        //添加新兑奖券
        this.items.push({
          awardName: "",
          awardNum: 1,
          handleType: 0
        });
      },
      changeNum(e) {
        this.items[e.index].awardNum = e.val;
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
      showCancel() {
        this.$refs.confirm.showConfirm();
      },
      showDelete() {
        this.$refs.delete.showConfirm();
      },
      cancelApply() {
        //取消
        cancelApply(this.applyInfo.orderId).then(res => {
          if (res.success) {
            this.$toast({ text: "取消成功" });
            this.applyInfo.canModify = false;
            this.applyInfo.canCancel = false;
            this.applyInfo.canDelete = true;
            this.applyInfo.stateValue = 4;
          }
        });
      },
      deleteApply(id) {
        //删除
        deleteApply(id).then(res => {
          if (res.success) {
            this.$toast({ text: "删除成功" });
            this.$router.go(-1);
          }
        });
      },
      changeApply(id) {
        //修改数量
        let applyInfo = this.applyInfo;
        this.showChange = true;
        this.addressId = applyInfo.addressVO.addressId;
        this.orderId = applyInfo.orderId;
        let items = [];
        applyInfo.itemList.forEach(item => {
          items.push({
            awardName: item.awardName,
            awardNum: item.awardNum,
            itemId: item.itemId,
            handleType: 1
          });
        });
        this.items = items;
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
      changeSubmit() {
        //保存修改数量
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
            getApplyDetail(orderId).then(res => {
              if (res.success) {
                this.applyInfo = res.data;
              }
            });
          }
        });
      },
      cancel() {
        this.$router.go(-1);
      }
    },
    watch: {
      items: {
        handler(to, from) {
          this.checkSubmit();
        },
        deep: true
      },
      showChange: function(to, from) {
        if (!to) {
          this.items = [
            {
              awardName: "",
              awardNum: 1,
              handleType: 0
            }
          ];
          this.deleteItems = [];
          this.errorName = "";
        }
      }
    }
  };
</script>
<style lang="stylus" scoped>
  @import './prizeApply.styl';

  .apply-detail {
    bg(#fff);
  }

  .apply-detail-jiupi-title {
    padding: 28px 20px;

    span {
      &:nth-of-type(1) {
        ft(28);
      }

      &:nth-of-type(2) {
        frt();
        c(#4A90E2);
        ft(16);
        lh(28);
      }
    }
  }

  .apply-detail-userinfo {
    padding: 0 20px 8px;
    border-bottom: 1px solid #ededed;

    h5 {
      ft(18);
      mb(12);
      c(#414141);
    }

    p {
      c(#414141);
      mb(12);
    }
  }

  .apply-detail-list-title {
    ft(18);
    c(#333);
    padding: 20px;
    pb(0);
  }

  .apply-detail-img {
    padding: 0 20px;

    p {
      ft(18);
      mb(20);
      c(#333);
    }

    .cash-img-wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    .cash-img-wrapper li {
      display: inline-block;
      width: 142px;
      height: 142px;
      mr(20);
    }

    .cash-img-wrapper li img {
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }
  }
</style>
