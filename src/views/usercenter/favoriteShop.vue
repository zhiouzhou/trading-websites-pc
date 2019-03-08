<template>
<div class="jiupi-center">
    <div class="changepwd pre">
      <p class="info-title clearfix">
        经销商关注
      </p>
      <div class="clearfix" v-if="shopList.length!=0">
        <div class="clearfix">
        <div v-for="(item,index) in shopList" :key="item.shopId" class="shopList flt" @click="goToDealerShop(item.shopId)">
          <div
            v-if="item.state == 1 || !item.openDealerShop"
            :data-index="index"
          >
            <div
              class="cancel"
              @click="cancel"
              :data-id="item.shopId"
            >取消关注</div>
            <img :src="item.logoImgUrl" v-if="item.logoImgUrl">
            <img src="../../assets/images/propic_default.gif" v-if="!item.logoImgUrl">
            <h5>{{item.shopName}}</h5>
            <p v-if="item.openDealerShop">{{item.userFavoriteCount}}人关注</p>
            <p v-if="!item.openDealerShop " class="stop">该经销商已关店</p>
          </div>
          <div v-if="item.state == 0 & item.openDealerShop">
            <img v-bind:src="item.logoImgUrl">
            <h5>{{item.shopName}}</h5>
            <p class="stop">该经销商已停用</p>
          </div>
        </div>
        </div>
      </div>
      <div class="empty-list clearfix" v-if="shopList.length==0&&!firstShow">
        <div class="empty-img flt">
          <img src="../../assets/images/no-dealershop.png">
        </div>
        <p class="flt">您还没有关注过任何经销商~</p>
      </div>
      <div class="pagination">
        <el-pagination
          class="frt"
          background
          @current-change = "handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next,total, jumper"
          :total="totalCount"
          prev-text="<上一页"
          next-text="下一页>"
          v-if="totalCount"
        ></el-pagination>
        </div>
    </div>
</div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter";
export default {
  name: "favoriteShop",
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
      shopList: [],
      totalCount: 1,
      selectIndex: "",
      firstShow: true
    };
  },
  created() {
    this.getShop();
  },
  methods: {
    //获取经销商列表
    getShop() {
      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      usercenter.getFavoriteShop(data).then(res => {
        this.shopList = res.data;
        this.totalCount = res.totalCount;
        this.firstShow = false;
      });
    },
    //取消关注
    cancel(e) {
      let id = e.target.dataset.id;
      let currentPage = this.currentPage;
      if((this.totalCount%this.pageSize==1)&&currentPage!=1){
        currentPage--;
      }
      usercenter.cancelShop(id).then(res => {
        if (res.success) {
          this.currentPage = currentPage;
          this.getShop();
        }
      });
    },
    //改变分页
    handleCurrentChange(e){
      this.currentPage = e;
      let data = {
        currentPage: e,
        pageSize: this.pageSize
      }
      usercenter.getFavoriteShop(data).then(res => {
        this.shopList = res.data;
        this.totalCount = res.totalCount;
      });
    },
    //跳转到经销商店铺
    goToDealerShop(shopId){
      let routeData = this.$router.resolve({
        path: "/dealer/dealerProductList",
        query: this.encodeUrlQuery({ shopId })
      })
      window.open(routeData.href, "_self");
    },
  }
};
</script>
<style lang="stylus" scoped>
.w-100 {
    width 100%
}

.changepwd {
  box()
  mb(38)
  pl(20);
  pr(20)
  pb(60)
  bg(#fff)
  min-height: 682px;
}

.info-title {
  box();
  width: 100%;
  height: 84px;
  ft(28);
  c(#333);
  lh(84);
  mb(20);
  span{
    display inline-block
    float right
    h(84)
    line-height 84px
    ft(16)
    c(#666)
    cursor pointer
  }
}

.shopList {
  position: relative;
  mb(26);
  margin-right: 3.5%;
  box();
  width: 31%;
  height: 214px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  transition: all 0.2s ease;

  img {
    block();
    width: 236px;
    height: 120px;
    margin: 0 auto;
    pt(20);
  }

  h5 {
    padding: 16px 20px 0;
    ft(16);
    c(#333);
  }

  p {
    padding: 8px 20px 0;
    ft(14);
    c(#666);
  }

  .stop {
    c(#da1f30);
  }

  &:nth-of-type(3n) {
    margin-right: 0;
  }

  &:hover {
    -webkit-box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);
    cursor: pointer;

    .cancel {
      opacity 0.7
    }
  }
}

.empty-list {
  margin: 100px auto;
  height: 150px;
  padding-left: 50%;

  p {
    pt(70);
    padding-left: 5%;
    ft(18);
    c(#757575);
  }
}

.empty-img {
  width: 150px;
  height: 150px;
  ml(-150);
  position: relative;

  img {
    inline();
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.cancel {
  position: absolute;
  top: 0;
  right: 0;
  width: 64px;
  height: 22px;
  bg(#000000);
  opacity: 0;
  ft(12);
  c(#ffffff);
  text-align: center;
  lh(22);
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
</style>

