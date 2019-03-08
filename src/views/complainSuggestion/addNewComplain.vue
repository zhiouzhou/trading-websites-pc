<template>
	<div class="container add-new-complain jiupi-center">
		<div class="sus-top">新增投诉</div>
		<div class="form-container">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<!-- <el-form-item label="联系人" prop="name" class="h-40">
					<el-input v-model="form.name" placeholder="请输入联系人名称"></el-input>
				</el-form-item> -->
				<div class="info-group">
          <label><span class="c-red">*</span> 联系人</label>
          <div class="w-52 inline pre">
            <input class="input" :class="{'input-error': error.name}" type="text" placeholder="请输入联系人名称" v-model="form.name" @focus="inputError('name')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.name">
          </div>
          <div class="error">
            <span>{{error.name}}</span>
          </div>
        </div>
				<div class="info-group">
          <label><span class="c-red">*</span> 联系电话</label>
          <div class="w-52 inline pre">
            <input class="input" :class="{'input-error': error.phoneNo}" type="text" placeholder="请输入联系人名称" v-model="form.phoneNo" @focus="inputError('phoneNo')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.phoneNo">
          </div>
          <div class="error">
            <span>{{error.phoneNo}}</span>
          </div>
        </div>
				<!-- <el-form-item label="联系电话" prop="phoneNo" class="h-40">
					<el-input v-model="form.phoneNo" placeholder="请输入联系电话"></el-input>
				</el-form-item> -->
				<el-form-item label="订单号" class="h-40">
					<!-- <el-input v-model="form.orderNo" placeholder="本次投诉对应订单（非必填）" style="width: 100%;" @focus ="orderDialogVisible=true"></el-input> -->
					<div style="width: 100%;height:40px;" @click="getComplainOrders" class="choose-order">
						<el-input v-model="form.orderNo" placeholder="本次投诉对应订单（非必填）" style="width: 100%;"></el-input>
						<span class="el-icon-arrow-down"></span>
					</div>
				</el-form-item>
				<el-form-item label="投诉类型" prop="complainType" style="height: 80px;">
					<div class="complainType">
						<div @click="changeType(index)" v-for="(item,index) in evaluateList" :class="{selectdiv:index===currentIndex}">{{item}}
							<img v-if="index===currentIndex" src="@/assets/images/choose.png">
						</div>
					</div>
					<div class="error" style="margin-left: 0;">
            <span>{{error.complainType}}</span>
          </div>
				</el-form-item>
				<!-- <el-form-item label="投诉内容" prop="desc" class="h-96">
					<el-input type="textarea" v-model="form.desc" :rows="4" placeholder="请输入您要投诉的内容"></el-input>
				</el-form-item> -->
				<div class="info-group">
          <label><span class="c-red">*</span> 投诉内容</label>
          <div class="w-52 inline pre">
            <textarea class="input textarea" :class="{'input-error': error.desc}" placeholder="请输入您要投诉的内容" rows="4" v-model="form.desc" @focus="inputError('desc')"></textarea>
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" style="top: 12%;" v-if="error.desc">
          </div>
          <div class="error">
            <span>{{error.desc}}</span>
          </div>
        </div>
				<el-form-item label="上传照片" class="h-168">
					<el-upload ref="upload"
					:class="{disabled:fileList.length>0}"
        		action=""
        		 :auto-upload="false" list-type="picture-card" :before-upload="beforeupload" :on-change = "fileChange">
						<div> <img src="./../../assets/images/tianjiatupian.png" alt=""></div>
						<div slot="tip" class="el-upload__tip">非必需，最多上传1张</div>
						<div slot="tip" class="el-upload__tip">温馨提示: 上传图片的大小请限制在1M以内,图片的格式为JPG,PNG或GIF</div>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt>
					</el-dialog>
				</el-form-item>
				<el-form-item label="">
					<div class="submit-complain" @click="debounceSubmit">提交</div>
				</el-form-item>
			</el-form>
		</div>
		<!-- 选中订单弹窗 -->
		<el-dialog title="选择订单" width="570px" class="" :visible.sync="orderDialogVisible" center :close-on-click-modal="false">
			<div class="orderContainer" v-for="(item,index) in orderList" :key="index">
				<div class="chooseOrder">
					<div class="cheackOrder">
						<div @click="changeChecked(index,item.orderNO)">
							<!-- <img v-if="checkIndex!=index" src="../../assets/images/weigouxuanyouhuo_ic@3x.png" alt=""> -->
							<div v-if="checkIndex!=index"></div>
							<img v-if="checkIndex==index" src="../../assets/images/yigouxuan.png" alt="">
						</div>
						<div>
							<p class="fz14 c-3">{{item.companyName}}<span class="jdh fz14">({{item.state==1?'待发货':item.state==2?'已发货':item.state==3?'已完成':item.state==4?'审核拒绝':item.state==5?'已取消':item.state==6?'已删除':item.state==7?'配送失败':item.state==8?'待支付':item.state==9?'待评价':''}})</span></p>
							<p class="c-9"><span>{{item.createTime}}</span> </p>
						</div>
					</div>
					<div class="c-3">
						<p class="goodsCount"> 共{{item.totalProductCount}}商品 <span v-if="item.discountAmount>0">,优惠:￥{{item.discountAmount.toFixed(2)}}</span> </p>
						<p class="t-r">实付款：<span>￥{{item.payableAmount.toFixed(2)}}</span></p>
					</div>
				</div>
				<div class="complain-line"></div>
				<!-- 单个商品 -->
				<div class="goodsDetail-single" v-if="item.items.length==1">
					<img v-lazy='item.items[0].product.imgUrl' alt="" v-if="item.items[0].product.imgUrl">
					<div>
						<p class="fz14 fw-500">{{item.items[0].product.productName}}</p>
						<p>￥{{item.items[0].product.price}}/{{item.items[0].product.priceunit}}</p>
						<p>规格:{{item.items[0].product.specName}}
							<span v-if="item.items[0].product.price&&item.items[0].product.productSkuId ==item.items[0].product.productSaleSpecId">X{{item.items[0].count}}{{item.items[0].product.saleUnit}}</span>
							<span v-else>X{{item.items[0].count*(item.items[0].product.saleSpecQuantity||1)}}{{item.items[0].product.minUnit}}</span>
						</p>
					</div>
				</div>
				<!-- 多个商品 -->
				<div class="goodsDetail-multiple pre" v-if="item.items.length>1">
					<img src="../../assets/images/zuo@2x.png" alt="" @click="_pre(item.ref)" v-if="item.canScroll">
					<scroll
					:probeType="1"
					:scrollX="true"
					:data="item.items"
					class="scroll_menu_dom"
					:ref="item.ref"
					>
						<ul class="goodsDetail-multiple-list clearfix pre" :style="{'width':item.orderWidth+'px'}">
							<li v-for="products in item.items" :key="products.itemsId">
								<img v-lazy="products.product.imgUrl" alt="">
								<p v-if="products.product.price&&products.product.productSkuId ==products.product.productSaleSpecId"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
								<p v-if="products.product.price&&products.product.productSkuId !=products.product.productSaleSpecId"><span>{{products.count*(products.product.saleSpecQuantity||1)}}{{products.product.minUnit}}</span></p>
								<p v-if="products.giftProduct"><span>{{products.count}}{{products.product.saleUnit}}</span></p>
							</li>
						</ul>
					</scroll>
					<img src="../../assets/images/you@2x.png" alt="" @click="_next(item.ref)" v-if="item.canScroll">
				</div>
			</div>
			<el-pagination v-if="totalCount" background layout="prev, pager, next" :total="totalCount" prev-text="<上一页" next-text="下一页>" @current-change="handleCurrentChange">
			</el-pagination>
			<span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button @click="ensureChoose">确认选择</el-button>
      </span>
		</el-dialog>
		<!-- 选中订单弹窗 -->
	</div>
</template>

<script>
	import * as FindService from "api/complainSuggestion/complainSuggestion";
	import * as GetUserInfo from "api/author/author"
	import {debounce} from "common/lodash";
	import scroll from "components/common/scroll.vue";

	export default {
		data() {
			let checkPhone = (rule, value, callback) => {
				let reg = /^1[3|4|5|7|8][0-9]{9}$/;
				if(!value) {
					callback(new Error('请输入电话号码'));
				} else if(value.length != 11) {
					callback(new Error('电话号码必须是11位数字'));
				} else if(!reg.test(value)) {
					callback(new Error('请输入正确的电话号码'));
				} else {
					callback();
				}
			};
			let checkType = (rule, value, callback) => {
				if(!value && value!==0) {
					callback(new Error('请至少选择一个投诉类型'));
				} else {
					callback();
				}
			}
			return {
				userInfoDetail: "", //用户信息
				orderList: [],
				orderId: 1,
				isChecked: false,
				checkIndex: -1,
				orderNo: '',
				currentPage: 1,
				pageSize: 3,
				totalCount: 0,
				currentIndex: '', //选择的
				evaluateList: [],
				form: {
					name: "",
					orderNo: "",
					phoneNo: "",
					desc: "",
					complainType: '', //投诉类型
				},
				error: {
					name: '',
					phoneNo: '',
					desc: '',
					complainType: ''
				},
				dialogImageUrl: '',
				dialogVisible: false,
				orderDialogVisible: false,
				 fileList: [],
				 imgUrls: [],
				 imgLength: 0,
				 goNextRoute: false,
				rules: {
					name: [{
							required: true,
							message: '请输入联系人名称',
							trigger: 'blur'
						},
						{
							min: 1,
							message: '请输入联系人名称',
							trigger: 'blur'
						}
					],
					phoneNo: [{
						validator: checkPhone,
						trigger: 'blur',
						required: true
					}],
					complainType: [{
						validator: checkType,
						trigger: 'submit',
						required: true
					}],
					desc: [{
							required: true,
							message: '请填写您要投诉的内容',
							trigger: 'blur'
						},
						{
							min: 1,
							message: '请填写您要投诉的内容',
							trigger: 'blur'
						}
					]
				}
			};
		},
		components: {
			scroll
		},
		created() {
			this.form.orderNo = this.$route.query.No;
			FindService.getListComplaintType().then(res => {
				if(res.success) {
					let item = '';
					for(item in res.data) {
						this.evaluateList.push(res.data[item]);
					}
				}
			})
		},
		mounted() {
			this.getUserInfo();
			this.debounceSubmit = debounce(this.submitForm, 300,false)
		},
		//路由拦截
		beforeRouteLeave(to,from ,next){
			if(this.goNextRoute){
				next(true)
			}else {
				let {oldPhoneNo, oldName, form, fileList} = this;
				if(oldPhoneNo!=form.phoneNo||oldName!=form.name||form.orderNo||form.desc||form.complainType!==''||fileList.length){
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
				console.log('beforeupload')
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
						this.imgUrls.push(res.data.fileUrl)
						// if(this.imgUrls.length == this.imgLength){
							this.addComplain()
						// }
					}
				})
			},

			//上传文件到ucloud

			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.checkIndex = -1;
				this.orderNo = ''; //清楚上页选中的状态
				this.currentPage = val;
				this.getComplainOrders();
			},
			changeType(index) {
				this.error.complainType = '';
				this.currentIndex = index;
				this.$set(this.form, 'complainType', index)
				this.$forceUpdate();
			},
			getOrderNo(obj) {
				this.form.orderNo = obj.orderNo;
				this.orderDialogVisible = obj.orderDialogVisible;
			},
			//新增投诉防抖动
			debounceSubmit(){
				 this.debounceSubmit()
			},
			formCheck() {
				let result = true;
				if(!this.form.name){
					this.error.name = '请输入联系人名称';
					result = false;
				}else {
					this.error.name = '';
				}
				if(!this.form.phoneNo){
					this.error.phoneNo = '请输入联系人电话';
					result = false;
				}else {
					this.error.phoneNo = '';
				}
				console.log(this.form)
				if(!this.form.complainType&&this.form.complainType!==0){
					this.error.complainType = '请选择投诉类型';
					result = false;
				}else {
					this.error.complainType = '';
				}
				if(!this.form.desc){
					this.error.desc = '请输入投诉内容';
					result = false;
				}else {
					this.error.desc = '';
				}
				return result;
			},
			submitForm() { //提交投诉建议表单
			let result = this.formCheck();
			if(!result){
				return false;
			}
			let formName = 'form';
			this.imgLength = this.fileList.length;
				if(!this.fileList.length) {
						this.addComplain();
						return
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						//上传图片同时新增
						this.$refs.upload.submit()
					}else {
						console.log('error submit!!');
						this.$message(`${res.desc}`);
						return false;
					}
				});
			},
			addComplain(){
				let params = {
						complaintContent: this.form.desc, //投诉的内容
						linkman: this.form.name, //联系人
						orderNo: this.form.orderNo, //订单号
						telephoneNo: this.form.phoneNo, //联系人电话
						complaintType: this.form.complainType+1, //投诉类型
						imgUrls:this.imgUrls
					}
				FindService.addEvaluateComplain({data:params}).then(res => {
							this.dialogVisible = false;
//							this.$message({
//								type: 'success',
//								message: '新增投诉成功!'
//							});
							this.$toast({text: '新增投诉提交成功',noRoute: false});
							this.goNextRoute = true;
							this.$router.push("/myOrderEntry/complainSuggestion");
						})
			},
			//dialog方法
			changeChecked(index, orderNo) {
				this.checkIndex = index;
				this.orderNo = orderNo;
			},
			getComplainOrders() {
				this.orderDialogVisible = true;
				let params = {
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}
				FindService.getComplainOrders(params).then(res => {
					this.orderList = res.data;
					this.totalCount = res.totalCount;
					this.orderList.forEach((order,index) => {
						let totalProductCount = 0
						for(let ii of order.items){
							if(ii.product&&ii.product.productSkuId !=ii.product.productSaleSpecId){
								totalProductCount = totalProductCount+ ii.count*(ii.product.saleSpecQuantity||1)
							}else{
								totalProductCount = totalProductCount+ ii.count
							}
						}
						order.totalProductCount = totalProductCount
						order.orderWidth = 92*order.items.length;
						order.canScroll = order.items.length>5?true:false;
						order.ref = 'ref'+index;
					})
					
				})
			},
			ensureChoose() {
				this.orderDialogVisible = false;
				this.form.orderNo = this.orderNo;
			},
			getUserInfo() {
				GetUserInfo.GetUserDetail().then(res => {
					this.form.phoneNo = res.data.mobileNo;
					this.form.name = res.data.userName;
					this.oldPhoneNo = res.data.mobileNo;
					this.oldName = res.data.userName;
				})
			},
			_pre(ref) {
				this.$refs[ref][0].scrollTo(0, 0);
			},
			_next(ref) {
				const BS = this.$refs[ref][0].scroll;
				this.$refs[ref][0].scrollTo(BS.maxScrollX, 0);
			},
			inputError(e){
      this.error[e] = '';
    }
		}
	};
</script>

<style lang="stylus">
	.add-new-complain {
		ml(220)
		background-color #fff
		min-height 652px
		mb(30)

		.sus-top {
			color: #414141;
			font-size: 28px;
			padding 28px 20px;
		}
		.complainType {
			// display: flex;
			>div {
				inline()
				cursor: pointer;
				width: 96px;
				text-align: center;
				margin-right: 10px;
				position: relative;
				border: 1px solid #DFDFDF;
				height: 34px;
				line-height: 34px;
				color: #666666;
				font-family: PingFangSC-Regular;
			}
			img {
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
		.form-container {
			padding 20px;
			.el-form-item__content {
				width 49.6%
			}
			.el-form-item__label {
				font-size: 14px;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
			}
			.el-upload__tip {
				line-height 12px;
				margin 12px 0;
				font-family: PingFangSC-Regular;
				color #999999;
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
			.el-form-item.is-success .el-input__inner,
			.el-form-item.is-success .el-textarea__inner {
				border-color: #dcdfe6;
			}
			.el-form-item.is-error .el-input__inner,
			.el-form-item.is-error .el-textarea__inner {
				border-color: #EDEDED;
			}
			.el-textarea__inner {
				border-color: #EDEDED;
			}
			.el-input__inner {
				border-color: #EDEDED;
			}
			.el-input__inner:focus {
				border-color: #EDEDED;
			}
			.el-input__inner:hover {
				border-color: #EDEDED;
			}
			 ::-webkit-input-placeholder {
				/* WebKit, Blink, Edge */
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			 :-moz-placeholder {
				/* Mozilla Firefox 4 to 18 */
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			 ::-moz-placeholder {
				/* Mozilla Firefox 19+ */
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			 :-ms-input-placeholder {
				/* Internet Explorer 10-11 */
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			.el-form-item__error {
				position static
			}
		}
		.selectdiv {
			border: 1px solid #E53539!important;
			color: #E53539;
			text-align: center!important;
		}
		//dialog样式
		.chooseOrder {
			padding: 8px 0;
			// display: flex;
			// justify-content: space-between;
			>div {
				inline()

				&:nth-child(2) {
					frt()
				}
			}
			.el-checkbox__inner {
				width: 20px;
				height: 20px;
				border-radius: 50%;
				margin-top: 20px;
				margin-right: 10px;
			}
			.el-checkbox__inner::after {
				height: 11px;
				left: 7px;
				width: 4px;
			}
			.cheackOrder {
				// align-items: center;
				// display: flex;
			}
			.cheackOrder>div {
				inline()
				vertical-align middle
				div {
					border-radius: 50%;
					width 14px;
					height: 14px;
					margin-right: 16px;
					border: 1px solid;
				}
				img {
					border-radius: 50%;
					width 16px;
					height: 16px;
					margin-right: 16px;
				}
			}
			p {
				margin: 4px 0;
			}
			.jdh {
				color: #e53935;
			}
			.goodsCount {
				text-align: right;
			}
		}
		.orderContainer {
			border: 1px solid #dfdfdf;
			padding: 0 12px;
			margin-bottom: 12px;
		}
		.choose-order {
			position: relative;
			>span {
				position: absolute;
				right: 9px;
				top: 13px;
			}
		}
		.goodsDetail-single {
			position relative
			padding 12px 0 12px 24px

			img {
				squ(80)
				margin 0 12px 0 0
				inline()
				vertical-align top
			}

			>div {
				inline()

				p {
					mb(12)
					c(#333)

					span {
						position absolute
						right 0
					}
				}

				.fw-500 {
					font-weight 500
				}
			}
		}
		.goodsDetail-multiple {
			padding 12px 24px

			>img {
				w(24)
				h(56)
				position absolute
				top 50%
				transform translateY(-50%)

				&:nth-of-type(1){
					left -12px
				}

				&:nth-of-type(2){
					right -12px
				}
			}
		}
		.scroll_menu_dom {
			overflow: hidden;
			pos(relative);
		}
		.goodsDetail-multiple-list {
			>li {
				mr(12)
				flt()

				>img {
					squ(80)
				}

				>p {
					position absolute
					bottom 0
					w(80)
					h(22)
					text-c()
					background rgba(0,0,0,0.5)
					lh(22)

					span {
						c(#fff)
					}
				}
			}
		}
		.dialog-footer {
			>button:first-child {
				padding: 10px 61px;
				border-radius: 2px;
				>span {
					color: #212121;
					font-size: 16px;
				}
			}
			>button:last-child {
				padding: 10px 47px 10px 49px;
				border-radius: 2px;
				background-color: #E53935;
				>span {
					color: #fff;
					font-size: 16px;
				}
			}
		}
		.submit-complain {
			font-size: 18px;
			line-height: 18px;
			height: 18px;
			width: 36px;
			padding: 13px 42px;
			background-color: #e53935;
			color: #fff;
			border-radius: 2px;
			cursor: pointer;
			mt(10)
		}
		.goodsImg {
			inline()
			text-align: center;
			>span {
				display: inline-block;
				margin-bottom: 10px;
			}
		}
		.goodsContainer {
			// display: flex;
		}
		.selectDiv {
			width: 70px;
			height: 26px;
			background-color: #E53539;
			color: #fff;
		}
	}
	.disabled {
		bg(#fff)
	}
	.disabled .el-upload--picture-card {
    display: none;
	}

	.complain-line {
		width 520px
		height 1px
		ml(-12)
		background #ededed
	}

	.h-40 {
		height 40px !important
	}

	.h-96 {
		height 96px !important
	}
	.h-168 {
		height 168px !important
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
    width: 68px;
    text-align: right;
    vertical-align top
    mt(10)
		c(#606266)
  }

  .input {
    width: 100%;
    box();
    padding: 0 12px;
    border: 1px solid #EDEDED;
    height: 34px;
    ft(14);
    c(#606266);

    &::-webkit-input-placeholder {
        c(#BDBDBD)
    }
  }

  .textarea {
    height 90px
		resize none
		pt(6)
  }
}
.error {
    c(#e43834);
    margin-left: 81px;
    height: 14px;
		lh(14)
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