<template>
  <div class="container product">
    <div>
      <!--商品头部信息部分-->
      <div class="info">
        <!--左边商品图片-->
        <div class="left-box">
          <product-img :imgs="productInfo.imgsUrl || []"></product-img>
          <!--产品水印图片-->
          <div
            class="water-mark-logo"
            v-if="productInfo.enjoyPromotions&&productInfo.enjoyPromotions.length"
          >
            <img
              v-if="productInfo.enjoyPromotions[0].promotionWatermark"
              v-lazy="productInfo.enjoyPromotions[0].promotionWatermark"
            >
          </div>
          <!--产品收藏-->
          <!-- <div class="favorite-column" @click="toggleFavorite" v-if="!isVisitor">
            <i :class="{'favorited':productInfo.favorite}"></i>
            <span>{{productInfo.favorite?`取消关注`:`加入商品关注`}}</span>
          </div>-->
        </div>
        <!--右边商品信息-->
        <div class="right-box">
          <!--商品名称，活动信息-->
          <div class="p-name-column">
            <div class="p-n-c-title">
              <h5>
                <span>{{productInfo.productName}}</span>
              </h5>
            </div>
          </div>
          <!--商品价格-->
          <div class="p-price-column">
            <div v-if="isVisitor" class="c-red">
              ¥
              <span>?</span>
              {{productInfo.priceunit}}
            </div>
            <div v-else>
              <!--活动产品价格-->
              <div class="p-p-wrap" v-if="activityInfo.activityId">
                <div class="p-p-c-l">
                  <span v-if="showActivityPrice">活动价</span>
                  <span
                    v-else
                  >{{productInfo.productPrice.priceDisplayType==0?'批价':productInfo.productPrice.priceDisplayType==1?'会员价':'凑单价'}}</span>
                </div>
                <div class="p-p-c-r">
                  <div class="price">
                    <span class="priceunit">¥</span>
                    <span
                      class="num"
                    >{{productInfo.productPrice.priceDisplayType==0||productInfo.productPrice.priceDisplayType==1?productInfo.productPrice.price:productInfo.productPrice.gatherOrderPrice}}</span>
                    <span class="priceunit">/{{productInfo.priceunit}}</span>
                    <span
                      class="self-pick-column"
                      v-if="citySelfPickUp&&productInfo.productPrice.selfPickUpPrice"
                    >自提价 ¥{{productInfo.productPrice.selfPickUpPrice}}/{{productInfo.priceunit}}</span>
                    <span
                      v-if="productInfo.productPrice.reducePrice&&!productInfo.hiddenPriceText"
                      class="reduce"
                    >立减{{productInfo.productPrice.reducePrice}}元</span>
                  </div>
                  <div
                    class="tip"
                    v-if="productInfo.hiddenPriceText"
                  >{{productInfo.hiddenPriceText}}</div>
                  <!--显示划掉的价格-->
                  <div class="elide-price">
                    <!--凑单-->
                    <div
                      v-if="productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.gatherOrderPrice<productInfo.productPrice.price"
                    >¥{{productInfo.productPrice.price}}</div>
                    <!--非凑单-->
                    <div
                      v-if="!productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.price<productInfo.productPrice.sellPrice"
                    >¥{{productInfo.productPrice.sellPrice}}</div>
                  </div>
                </div>
              </div>
              <!--普通产品价格-->
              <div class="p-p-wrap" v-else>
                <div class="p-p-c-l">
                  <span v-if="showActivityPrice">活动价</span>
                  <span
                    v-else
                  >{{productInfo.productPrice.priceDisplayType==0?'批价':productInfo.productPrice.priceDisplayType==1?'会员价':'凑单价'}}</span>
                </div>
                <div class="p-p-c-r">
                  <div class="price">
                    ¥
                    <span class="num">
                      {{productInfo.hiddenPriceText?`？`:productInfo.productPrice.gatherOrderPrice?productInfo.productPrice.gatherOrderPrice:productInfo.productPrice.price}}
                      <span
                        class="priceunit"
                      >/{{productInfo.priceunit}}</span>
                    </span>
                    <span
                      class="self-pick-column"
                      v-if="citySelfPickUp&&productInfo.productPrice.selfPickUpPrice"
                    >自提价 ¥{{productInfo.productPrice.selfPickUpPrice}}/{{productInfo.priceunit}}</span>
                    <span
                      v-if="productInfo.productPrice.reducePrice&&!productInfo.hiddenPriceText"
                      class="reduce"
                    >立减{{productInfo.productPrice.reducePrice}}元</span>
                  </div>
                  <div
                    class="tip"
                    v-if="productInfo.hiddenPriceText"
                  >{{productInfo.hiddenPriceText}}</div>
                  <!--显示划掉的价格-->
                  <div class="elide-price">
                    <!--凑单-->
                    <div
                      v-if="productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.gatherOrderPrice<productInfo.productPrice.price"
                    >¥{{productInfo.productPrice.price}}</div>
                    <!--非凑单-->
                    <div
                      v-if="!productInfo.productPrice.gatherOrderPrice>0&&productInfo.productPrice.price<productInfo.productPrice.sellPrice"
                    >¥{{productInfo.productPrice.sellPrice}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="date">
              <span>
                建议零售价：
                <i>{{productInfo.productPrice.retailPrice}}</i>
              </span>
              <span>
                生产日期：
                <i>{{productInfo.productionDate?productInfo.productionDate:" - "}}</i>
              </span>
              <span>
                保质期：
                <i>{{productInfo.shelfLife?productInfo.shelfLife:" - "}}</i>
              </span>
              <span>
                条形码：
                <i>{{productInfo.barCode?productInfo.barCode:" - "}}</i>
              </span>
            </div>
          </div>
          <!-- 价格举报 -->
          <div>
            <p class="fz14 c-9 addPrice-title">
              <span class="c-red">*</span>如果您看到比我们更低的价格，请告诉我们，我们将认真对待，确保提供更优质的服务。
            </p>
            <form class="info-content">
              <div class="info-group">
                <label>举报价</label>
                <div class="w-52 inline pre">
                  <input class="input" :class="{'input-error': err.price}" type="text" placeholder="请填写您的举报价，如100元/件" v-model="reportInfo.price" @focus="inputError('price')">
                  <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="err.price">
                </div>
                <div class="error">
                  <span>{{this.err.price}}</span>
                </div>
              </div>
              <div class="info-group">
                <label>举报来源</label>
                <div class="w-52 inline pre">
                  <input class="input" :class="{'input-error': err.source}" type="text" placeholder="请填写您的举报价来源" v-model="reportInfo.source" @focus="inputError('source')">
                  <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="err.source">
                </div>
                <div class="error">
                  <span>{{this.err.source}}</span>
                </div>
              </div>
              <div class="info-group">
                <label>上传图片</label>
                <div class="report-img inline">
                  <el-upload ref="upload"
					:class="{disabled:fileList.length>0}"
        		action=""
        		 :auto-upload="false" list-type="picture-card" :before-upload="beforeupload" :on-change = "fileChange">
						<div> <img src="./../../assets/images/tianjiatupian.png" alt=""></div>
						<div slot="tip" class="el-upload__tip"><span>*</span>至少上传一张图片</div>
						<div slot="tip" class="el-upload__tip">温馨提示: 上传图片的大小请限制在1M以内,图片的格式为JPG,PNG或GIF</div>
					</el-upload>
					<!-- <el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt>
					</el-dialog> -->
                </div>
              </div>
              <div class="info-group">
                <label></label>
                <a href="javascript:;" class="info-change" @click="debounceSubmit">提交</a>
                <a href="javascript:;" class="info-change cancel" @click="cancel">取消</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {addPriceReport} from "api/priceReport/priceReport";
import * as FindService from "@/api/complainSuggestion/complainSuggestion";
import ProductImg from "../../components/productDetail/ProductImg.vue";
import * as $cache from "common/cache";
import {debounce} from "common/lodash";
export default {
  name: "addPriceReport",
  data() {
    return {
      productInfo: {},
      activityInfo: {},
      fileList: [],
      reportInfo: {
          price: '',
          source: ''
      },
      err: {
          price: '',
          source: ''
      },
      goNextRoute: false
    };
  },
  components: {
    ProductImg
  },
  created() {
    let {
      productInfo,
      activityInfo,
      showActivityPrice,
      citySelfPickUp
    } = $cache.getCache("reportProdcutInfo");
    this.productInfo = productInfo;
    this.activityInfo = activityInfo;
    this.showActivityPrice = showActivityPrice;
    this.citySelfPickUp = citySelfPickUp;
  },
  mounted() {
    this.debounceSubmit = debounce(this.submitForm, 300,false)
  },
  beforeRouteLeave(to,from,next){
    if(this.goNextRoute){
      next(true)
    }else {
      let {reportInfo,fileList} = this
      if(reportInfo.price||reportInfo.source||fileList.length){
        this.$confirm({content:'您填写的内容还没有提交，现在返回所填写内容将被清空'})
        .then(() => {
          next(true)
        })
        .catch(() => {
          next(false)
        });
      }else {
        next(true)
      }
    }
  },
  methods: {
    fileChange(file,fileList){
		this.fileList = fileList;
    },
    beforeupload(file) {
        // 如果file不是File对象的实例，则不需要处理Md5
        if(file.size == undefined) {
            success("");
            return;
        }

        var that = this;
        that.sliceSize = 1024 * 1024
        that.slice = File.prototype.slice
        var fileReader = new FileReader();
        var spark = new SparkMD5.ArrayBuffer();
        var chunks = Math.ceil(file.size / this.sliceSize);
        var currentChunk = 0;

        // 每块文件读取完毕之后的处理
        fileReader.onload = function(e) {
            // 每块交由sparkMD5进行计算
            spark.append(e.target.result);
            that.contentMd5 = spark.end();
            that.upLoadImg(that.contentMd5, file)

        };

        // 处理单片文件的上传
        function loadNext() {
            var start = currentChunk * that.sliceSize;
            var end = start + that.sliceSize >= file.size ? file.size : start + that.sliceSize;

            fileReader.readAsArrayBuffer(that.slice.call(file, start, end));
        }
        loadNext();
    },
    //上传文件
    upLoadImg(md5File, file) {
        let name = md5File + "." + file.name.split('.')[1]
        let params = {
            contentMd5: md5File,
            contentType: file.type,
            key: name,
            date: '',
            putPolicy: '',
            method: 'PUT',
            fileType: 0
        }
        FindService.getAuthorization(params).then(res => {
            if(res.success) {
                res.data.contentMd5 = md5File
                res.data.file = file
                FindService.upLoadImg(res.data)
                //图片信息
                this.imgUrls =[]
                this.imgUrls.push(res.data.fileUrl)
                this.addReport()
            }
        })
    },
    //新增价格举报防抖动
    debounceSubmit(){
        this.debounceSubmit()
    },
    //表单验证
    formCheck(){
      let result = true;
      if(!this.reportInfo.price){
          this.err.price = '举报价不能为空';
          result = false;
      }else {
          this.err.price = '';
      }
      if(!this.reportInfo.source){
          this.err.source = "举报来源不能为空";
          result = false;
      }else {
          this.err.source = '';
      }
      if(!this.fileList.length){
          this.err.img = '至少上传一张图片';
          result = false;
      }else {
          this.err.img = '';
      }
      return result;
    },
    //提交
    submitForm(){
        let result = this.formCheck();
        if(result){
          this.$refs.upload.submit();
        }
    },
    //添加举报
    addReport(){
        let params = {
            imgUrls: this.imgUrls,
            price: this.reportInfo.price,
            source: this.reportInfo.source,
            productName: this.productInfo.productName,
            productSkuId: this.productInfo.productSkuId,
            remark: ""
        }
        addPriceReport(params).then(res => {
            if(res.success){
                this.$toast({text: '您的价格举报已提交成功'})
                this.goNextRoute = true;
                this.$router.push('/myOrderEntry/priceReport');
            }else{
              this.$toast({text: res.desc,type: 'fail'});
            }
        }).catch(error => {
          this.$message(error.desc);
        })
    },
    //返回
    cancel(){
        this.$router.go(-1);
    },
    inputError(e){
      this.err[e] = '';
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../productDetail/stylus/productDetail.styl';
</style>
<style lang="stylus">
.addPrice-title {
    margin: 12px 0 24px;
}
.info-content {
  margin: 20px 0;
  margin-right: 5%;
  c(#333);
}
.info-group {
  mb(10);

  .inline {
    inline();
  }

  .w-52 {
    width: 52%;
    box();
    padding: 0 12px;
  }

  .report-img {
      padding: 0 12px;
      vertical-align top
    }

  label {
    inline();
    ft(14);
    width: 59px;
    text-align: right;
  }

  .input {
    width: 100%;
    box();
    padding: 0 12px;
    border: 1px solid #EDEDED;
    height: 34px;
    ft(14);
    c(#333);

    &::-webkit-input-placeholder {
        c(#BDBDBD)
    }
  }

  .error {
    c(#e43834);
    margin-left: 81px;
    height: 14px;
}

    .el-upload--picture-card {
        height 120px;
        width 120px;
        border: none;
    }
    .el-upload-list--picture-card .el-upload-list__item {
        height 120px;
        width 120px;
    }
    .el-upload__tip {
        line-height 12px;
        margin 12px 0;
        color #999999;
        ft(12)

        span {
            c(#E53935)
        }
    }
}
.disabled {
		bg(#fff)
	}
.disabled .el-upload--picture-card {
display: none;
}

.info-change {
  inline();
  ml(16);
  mr(24);
  ft(18);
  c(#fff);
  bg(#e43834);
  border: 1px solid #e43834;
  padding: 13px 42px;

  &:hover {
    bg(#ef5350);
    border-color: #ef5350;
  }
}

.cancel {
  ml(0);
  bg(#EDEDED);
  c(#333);
  border-color: #E5E5E5;

  &:hover {
    bg(#ddd);
    border-color: #ddd;
  }
}
.icon-error {
  inline()
  squ(14)
  position absolute
  right 22px
  lh(46)
  top 50%
  transform translateY(-50%)
}
.input-error {
  color #E53935!important
  border-color #E53935!important
}
</style>

