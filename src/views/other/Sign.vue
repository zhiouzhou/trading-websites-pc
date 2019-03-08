\<style lang="stylus">
  .S-box {
    padding: 20px 0;
    text-c();
    c(#fff);
    background: url('../../assets/images/sign-bg.png') no-repeat center, radial-gradient(circle, #fc7c43 20%, #ff4c46);
    background-size: 80% 80%;

    .S-continuous {
      ft(14);
    }

    .S-days {
      mt(12);
      ft(14);

      >span {
        ft(60);
      }
    }

    .S-desc {
      mt(12);
      ft(16);
    }

    .S-sign-btn {
      mt(12);
      inline();
      w(120);
      h(40);
      lh(40);
      radius(25);
      ft(16);
      bg(#fff);
      c(#999);
    }
  }

  .S-today {
    ft(16);
    c($color-base-theme);
    padding: 12px;

    >i {
      mr(12);
      inline();
      squ(32);
      vm();
      background: url('../../assets/images/calendar-icon.png') no-repeat center;
      background-size: cover;
    }

    >span {
      ml(12);
      c(#333);
      ft(14);
    }
  }

  .calendar-header-btn {
    cp();
    inline();
    squ(16);
    background: url('../../assets/images/sign-arrow-icon.png') no-repeat center;
    background-size: contain;

    &:nth-of-type(2) {
      transform: rotate(180deg);
    }
  }

  .S-calendar-box {
    w(952);
    pl(12);
    min-height: 456px;
  }

  #calendar {
    flt();
    w(622);
    h(456);
    box();
    padding: 0 12px;
    border: 2px solid $color-base-theme;

    .calendar-header {
      padding: 16px 0;
      text-c();

      >b {
        margin: 0 48px;
        ft(16);
      }
    }

    .calendar-weeks {
      padding: 8px 0;
      text-c();

      li {
        flt();
        width: 14.28%;
      }
    }

    .calendar-days {
      text-c();
      padding: 8px 0;

      li {
        flt();
        pos(relative);
        width: 14.28%;
        h(60);
        lh(65);

        >span {
          c(#dcdcdc);

          &.current {
            c(#333);
          }
        }

        >b {
          line-height: 80px;
          color: #fff;
        }
      }

      .checked {
        &:after {
          content: '';
          inline();
          squ(12);
          pos(absolute);
          left: 50%;
          bottom: 3px;
          transform: translateX(-50%);
          background: url('../../assets/images/icon-dui.png') no-repeat center;
          background-size: contain;
        }
      }

      .targeted {
        background: url('../../assets/images/icon_qiandaosonglihe.png') no-repeat center;
        background-size: contain;
      }
    }
  }

  .S-gift-box {
    flt();
    w(328);
    box();
    height: 100%;
    border: 2px solid #e53935;
    border-left: 0;
    border-bottom: 0;
  }

  .S-gift {
    h(332);
    box();
    pt(66);

    >b {
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      ft(18);
      c(#fff);
      line-height: 55px;
      text-indent: 20px;
      background: linear-gradient(to bottom right, $color-base-theme 0%, $color-base-theme 50%, #fff 51%, #fff 100%);
    }

    >img {
      margin: 0 auto;
      squ(200);
      pos(relative);
      z-index: 1;
    }

    >span {
      font-family: MicrosoftYaHei;
      block();
      pt(90);
      ft(22);
      text-c();
      c(#e53935);

      strong {
        font-weight: 500;
        ft(44);
      }
    }
  }

  .S-gift-type {
    h(120);
    ft(34);
    c(#fff);
    text-c();
    lh(120);
    background: url('../../assets/images/sign-sawtooth-icon.png') no-repeat bottom, $color-base-theme;
    background-size: 100% 11px;
  }

  .s-gift-btn {
    cp();
    pos(absolute);
    top: 35%;
    block();
    squ(32);
    background: url('../../assets/images/sign-arrow-icon.png') no-repeat center;
    background-size: 16px 16px;
    z-index: 2;

    &:nth-of-type(1) {
      left: 12px;
    }

    &:nth-of-type(2) {
      right: 12px;
      transform: rotate(180deg);
    }
  }

  .s-gift-dots {
    text-c();
    pos(absolute);
    bottom: 145px;
    left: 50%;
    transform: translateX(-50%);

    >li {
      inline();
      squ(12);
      flt();
      mr(12);
      border-radius: 50%;
      bg(#ddd);

      &.active {
        bg($color-base-theme);
      }
    }
  }

  .rule-desc {
    mt(12);
    mb(12);
    pl(12);

    >h5 {
      mb(12);
      c(#666);
    }

    >p {
      line-height: 1.6;
    }
  }
</style>

<template>
  <div class="w" style="min-height:550px;">
    <div class="S-box" v-if="requestOk">
      <p class="S-continuous">已连续签到</p>
      <div class="S-days">
        <span>{{continualSignInDays}}</span>天
      </div>
      <div class="S-desc" v-if="canSignIn && continueWillDays">再签到{{continueWillDays}}天可获得更多免费商品</div>
      <div class="S-desc" v-if="!canSignIn && signInDescribe">{{signInDescribe}}</div>
      <a
        href="javascript:;"
        class="S-sign-btn"
        v-if="canSignIn"
        @click="_sign"
      >{{!isSign?"点击签到":"已签到"}}</a>
      <a href="javascript:;" class="S-sign-btn" v-if="!canSignIn">活动已结束</a>
    </div>
    <!--  -->
    <div class="S-today" v-if="canSignIn">
      <i></i>
      {{today}}
      <span v-if="endDays && endDays<= 6">
        签到活动还有
        <b class="c-red fz16">{{endDays}}</b>天结束
      </span>
    </div>
    <!--  -->
    <div class="S-calendar-box clearfix" v-if="requestOk">
      <div id="calendar">
        <div class="calendar-header">
          <span class="calendar-header-btn" @click="calendarPageTurn(0)"></span>
          <b>{{calendarYear}}年{{calendarMonth>=10 ? calendarMonth:'0' + calendarMonth}}月</b>
          <span class="calendar-header-btn" @click="calendarPageTurn(35)"></span>
        </div>
        <ul class="calendar-weeks clearfix">
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
        <ul class="calendar-days clearfix">
          <li
            v-for="item in calendarDays"
            :class="{'checked': item.checked, 'targeted':item.targetCount && item.current}"
          >
            <b class="S-gift-text" v-if="item.targetCount && item.current">{{item.targetCount}}天送</b>
            <span :class="{'current':item.current}" v-else>{{item.day}}</span>
          </li>
        </ul>
      </div>
      <div class="S-gift-box pre">
        <span class="s-gift-btn" @click="_giftPre"></span>
        <div
          class="S-gift-item"
          v-for="(item,index) in ruleList"
          :key="item.ruleId"
          v-if="currentIndex == index"
        >
          <div class="S-gift pre">
            <b>{{item.signInDay}}天</b>
            <span v-if="item.ruleType">
              &yen;
              <strong>{{item.giveBonusAmount || 10}}</strong>
            </span>
            <img :src="item.imgUrl" v-else>
          </div>
          <div class="S-gift-type">{{item.ruleType?"赠红包":"赠品券"}}</div>
        </div>
        <span class="s-gift-btn" @click="_giftNext"></span>
        <ul class="s-gift-dots">
          <li
            v-for="(item,index) in ruleList"
            :key="item.ruleId"
            :class="{'active': currentIndex == index}"
          ></li>
        </ul>
      </div>
    </div>
    <!--  -->
    <div class="rule-desc" v-if="signNode">
      <h5>温馨提示</h5>
      <p v-html="signNode"></p>
      <div v-if="!signInCycle">
        <p>即日起，签到活动有效期内，每个用户获赠最高奖励政策对应的奖品（如红包，优惠券）后，签到活动结束。</p>
        <p class="c-6">如连续签到15天送10元红包，在活动有效期内，用户获得10元红包后，不能再继续签到。</p>
      </div>
      <p>本活动最终解释权在法律允许范围内归易久批所有。一旦发现恶意盗刷行为，易久批有权收回已发放的奖励。</p>
    </div>
  </div>
</template>
<script>
  import * as $cache from "common/cache";
  import * as Calendar from "./calendar";
  import { UserSignInDetail, SignIn } from "api/author/author";
  import storage from "common/storage";
  export default {
    name: "sign",
    data() {
      return {
        continualSignInDays: 0, //已连续签到天数
        continueWillDays: 0, // 再连续签到多少天可获奖品 最近的一个天数
        isSign: false, // 是否已签到
        endDays: 0,
        calendarYear: "",
        calendarMonth: "",
        calendarDays: [],
        today: "",
        ruleList: [],
        currentIndex: 0,
        signNode: "",
        canSignIn: false, //   解决重复签到问题
        signInCycle: 0,
        signInDescribe: "",
        requestOk: false
      };
    },
    created() {
      this.today = new Date().getMonth() + 1 + "月" + new Date().getDate() + "日";
      this._getUserSignInDetail();
    },
    components: {},
    mounted() {},
    methods: {
      _getUserSignInDetail() {
        UserSignInDetail().then(res => {
          if (res.success && res.data) {
            this.requestOk = true;
            this.serviceTime = res.serviceTime;
            const signDetail = res.data;
            this.signInId = signDetail.signInId;
            this.signNode = signDetail.ruleDescribe;
            this.signInCycle = signDetail.signInCycle;
            this.signInDescribe = signDetail.signInDescribe;

            this.showPrompt(this.signInCycle);
            const { endTime, continualSignInDays } = signDetail;
            this.continualSignInDays = continualSignInDays;
            const timestamp = new Date(endTime) - new Date(res.serviceTime);
            this.endDays = Math.floor(timestamp / (60 * 60 * 1000 * 24));

            this.transformSignDetail(signDetail);
            const { giftTargetDays, alreadySignInTimes } = this;
            this.$initCalendar(null, alreadySignInTimes, giftTargetDays);
            this.canSignIn = signDetail.canSignIn; //后台返回是否可以签到
          }
        });
      },
      showPrompt(signInCycle) {
        const USERNAME = storage.get("USERNAME", "");
        if (signInCycle == 0) {
          const firstShowPrompt = storage.get(
            USERNAME + "firstShowPrompt",
            false
          );
          if (!firstShowPrompt) {
            setTimeout(
              this.$alert({
                content:
                  "即日起，签到活动有效期内，每个用户获赠最高奖励后，签到活动结束",
                title: "温馨提示",
                type: "warning",
                center: true,
                yesText: "我知道了"
              }),
              400
            );
          }
          storage.set(USERNAME + "firstShowPrompt", true);
        } else {
          storage.set(USERNAME + "firstShowPrompt", false);
        }
      },
      getCurrentTime(Time) {
        let now = new Date();
        if (Time) {
          now = new Date(Time);
        }
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        return { currentYear, currentMonth, currentDay };
      },
      transformSignDetail(signDetail) {
        if (!signDetail) {
          return false;
        }
        const { ruleList, alreadySignInTimes, continualSignInDays } = signDetail;
        //计算可以领取gift的days
        let firstSignDay = ""; //如果没有连续签到的天数
        if (continualSignInDays) {
          firstSignDay = alreadySignInTimes[continualSignInDays - 1]; // "2018-12-21 14:31:00"
        }
        let temporary = [];
        for (let item of ruleList) {
          var o = {};
          var d = new Date(this.serviceTime);
          if (firstSignDay) {
            d = new Date(firstSignDay);
          }
          d.setDate(d.getDate() + item.signInDay - 1); //Time
          o.date = d;
          o.signInDay = item.signInDay;
          o.ruleType = item.ruleType;
          temporary.push(o);
        }
        this.ruleList = ruleList;
        this.giftTargetDays = temporary;
        this.alreadySignInTimes = alreadySignInTimes.map(item => {
          return Calendar.formatDateyymmss(item);
        });

        const { currentDay } = this.getCurrentTime(this.serviceTime);
        //continueWillDays
        for (let item of this.giftTargetDays) {
          if (item.signInDay > this.continualSignInDays) {
            this.continueWillDays = item.signInDay - this.continualSignInDays;
            break;
          }
        }
        //isSign
        if (this.alreadySignInTimes && this.alreadySignInTimes.length) {
          const lastSignTime = this.alreadySignInTimes[0];
          if (new Date(lastSignTime).getDate() == currentDay) {
            this.isSign = true;
          }
        }
      },
      $initCalendar(cur, alreadySignInTimes, giftTargetDays) {
        const { currentYear, currentMonth } = this.getCurrentTime(cur);
        const calendarDays = Calendar.initCalendar(cur);
        for (let item of calendarDays) {
          //计算已经签到过的某一天
          const itemDateYYMMSS = Calendar.formatDateyymmss(item.date);
          if (alreadySignInTimes.indexOf(itemDateYYMMSS) != -1) {
            item.checked = true;
          }

          for (let gift of giftTargetDays) {
            if (Calendar.formatDateyymmss(gift.date) == itemDateYYMMSS) {
              item.targetCount = gift.signInDay;
            }
          }
        }
        this.calendarYear = currentYear;
        this.calendarMonth = currentMonth;
        this.calendarDays = calendarDays;
      },
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天
      calendarPageTurn(x) {
        const {
          calendarYear,
          calendarMonth,
          alreadySignInTimes,
          giftTargetDays
        } = this;
        var d = new Date(Calendar.formatDate(calendarYear, calendarMonth, 1));
        d.setDate(x);

        const cur = Calendar.formatDate(d.getFullYear(), d.getMonth() + 1, 1);
        this.$initCalendar(cur, alreadySignInTimes, giftTargetDays);
      },
      isMeetGift() {
        for (let item of this.giftTargetDays) {
          if (this.continualSignInDays == item.signInDay) {
            return item.ruleType ? "红包" : "赠品券";
          }
        }
        return false;
      },
      _sign() {
        if (this.isSign || !this.signInId) {
          return;
        }
        SignIn(this.signInId)
          .then(res => {
            if (res.success) {
              $cache.setCache("alreadySignIn", true);
              this.isSign = true;
              this.continualSignInDays++;
              const isMeetGift = this.isMeetGift();
              if (isMeetGift) {
                this.$confirm({
                  title: "签到成功",
                  content: `恭喜您获得${isMeetGift}`,
                  yesText: `查看${isMeetGift}`
                })
                  .then(() => {
                    if (isMeetGift == "红包") {
                      this.$router.push({ path: "/myOrderEntry/myBonus" });
                    } else {
                      this.$router.push({ path: "/myOrderEntry/myCoupon" });
                    }
                  })
                  .catch(() => {});
              } else {
                this.$message("签到成功");
              }
              this._getUserSignInDetail();
            }
          })
          .catch(res => {
            this.$message(res.desc);
          });
        this.$createTalkingData("Sign_Page", "Index_Sign_In", {});
      },
      _giftPre() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        } else {
          this.currentIndex = this.ruleList.length - 1;
        }
      },
      _giftNext() {
        if (this.currentIndex >= this.ruleList.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }
    }
  };
</script>
