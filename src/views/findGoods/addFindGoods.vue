<template>
  <div class="container add-find-goods jiupi-center clearfix">
    <div class="sus-top">
      <div>新增找货</div>
    </div>
    <div class="findGoods-body">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <!-- <el-form-item label="产品名称" prop="name" class="h-40">
          <el-input v-model="form.name" placeholder="请输入产品名称"></el-input>
        </el-form-item> -->
        <div class="info-group">
          <label><span class="c-red">*</span> 产品名称</label>
          <div class="w-52 inline pre">
            <input class="input" :class="{'input-error': error.name}" type="text" placeholder="请输入产品名称" v-model="form.name" @focus="inputError('name')">
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" v-if="error.name">
          </div>
          <div class="error">
            <span>{{error.name}}</span>
          </div>
        </div>
        <div class="info-group">
          <label><span class="c-red">*</span> 备注</label>
          <div class="w-52 inline pre">
            <textarea class="input textarea" :class="{'input-error': error.desc}" placeholder="请输入你的真实需求" rows="4" v-model="form.desc" @focus="inputError('desc')"></textarea>
            <img src="../../assets/images/cuowu@2x.png" alt="" class="icon-error" style="top: 12%;" v-if="error.desc">
          </div>
          <div class="error">
            <span>{{error.desc}}</span>
          </div>
        </div>
        <!-- <el-form-item label="备注" prop="desc" class="h-96">
          <el-input type="textarea" v-model="form.desc" :rows="4" placeholder="请输入你的真实需求"></el-input>
        </el-form-item> -->
        <el-form-item label="上传照片" class="h-168">
          <el-upload ref="upload"
            :class="{disabled:fileList.length>0}"
        		action=""
        		 :auto-upload="false"
        		 :before-upload="beforeupload"
            list-type="picture-card"
             :on-change = "fileChange"
          >
            <div> <img src="./../../assets/images/tianjiatupian.png" alt=""></div>
            <div slot="tip" class="el-upload__tip">非必需，最多上传1张</div>
            <div slot="tip" class="el-upload__tip">温馨提示: 上传图片的大小请限制在1M以内,图片的格式为JPG,PNG或GIF</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item label="" class="addFind-button">
          <el-button type="danger" size="medium" @click="debounceSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as FindService from "api/findGoods/findGoods";
  import * as complainSuggestionService from "api/complainSuggestion/complainSuggestion";
  import {debounce} from "common/lodash";
export default {
  data() {
    return {
      form: {
        name: "",
        desc: ""
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      goNextRoute: false,
      error: {
        name: '',
        desc: ''
      },
      rules: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 1, message: '请输入产品名称+', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写产品的备注信息', trigger: 'blur' },
            {min: 1, message: '请填写产品的备注信息 ', trigger: 'blur' }
          ]
       },
       uploadData:{
       	picCategory:'jpg'
       }
    };
  },
  mounted(){
    this.debounceSubmit = debounce(this.submitForm, 300,false)
  },
  beforeRouteLeave(to,from,next){
      if(this.goNextRoute){
        next(true)
      }else {
        let {form, fileList} = this;
        if(form.desc||form.name||fileList.length){
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
				complainSuggestionService.getAuthorization(params).then(res => {
					if(res.success) {
						res.data.contentMd5 = md5File
						res.data.file = file
						complainSuggestionService.upLoadImg(res.data)
						//图片信息
						this.imgUrls = [res.data.fileUrl]
						this.addFoods()
					}
				})
      },
      //新增找货防抖动
			debounceSubmit(){
				 this.debounceSubmit()
      },
      //表单验证
      formCheck(){
        let result = true;
        if(!this.form.name){
          this.error.name = '请输入产品名称';
          result = false;
        }else {
          this.error.name= '';
        }
        if(!this.form.desc){
          this.error.desc = '请填写产品的备注信息';
          result = false;
        }else {
          this.error.desc = '';
        }
        return result;
      },
      submitForm() {
        let result = this.formCheck();
        if(!result){
          return false;
        }
        let formName = 'form';
        if(!this.fileList.length) {
						this.addFoods();
						return
				}
        this.$refs[formName].validate((valid) => {
          if (valid) {
           //上传图片同时新增
						this.$refs.upload.submit()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addFoods(){
      	 let params={
              findGoodsRemarks:this.form.desc,
              productName:this.form.name,
              imgUrls:this.imgUrls
            }
            FindService.AddFindGoods(params).then(res=>{
              if(res.success){
                this.form.desc='';
                this.form.name='';
                this.$toast({text: '新增找货提交成功',noRoute: false});
                this.goNextRoute = true;
                this.$router.push("/myOrderEntry/findGoods");                
              }else{
                this.$toast({text: res.desc,type: 'fail'});
              }
            })
      },
      inputError(e){
      this.error[e] = '';
    }
 },
  components: {}
};
</script>

<style lang="stylus">
.add-find-goods{
  background-color #fff;
  mb(30)
  .sus-top {
    display: flex;
    justify-content: space-between;
    padding: 20px 28px;

    >div {
      color: #414141;
      font-size: 28px;
    }
  }

  .addFind-button button{
    background-color: #e53935;
    width: 120px;
    height: 40px;
    border-radius:0;
    mt(10)
    >span{
      font-size:18px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
    }
  }

  .el-form-item{
    font-size : 14px;
  }

  .findGoods-body{
    padding 20px;  
    .el-form-item__label{
      font-size:14px;
      font-family:PingFang-SC-Medium;
      font-weight:500;  
      color #414141;
    }
    .el-textarea__inner,.el-input__inner {
      border-color:#EDEDED;  
    }
    .el-form-item.is-success .el-input__inner,.el-form-item.is-success .el-textarea__inner{
      border-color:#EDEDED;  
      c(#333)
    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-textarea__inner {
      border-color:#EDEDED; 
  }
  .el-textarea__inner:focus,.el-textarea__inner:hover, .el-input__inner:focus, .el-input__inner:hover {
    border-color: #EDEDED;
}
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      font-family:PingFang-SC-Medium;
      font-weight:500;
      c(#999999)
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-family:PingFang-SC-Medium;
       font-weight:500;
       c(#999999)
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      font-family:PingFang-SC-Medium;
        font-weight:500;
        c(#999999)
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-family:PingFang-SC-Medium;
        font-weight:500;
        c(#999999)
    }
  }

  .el-upload--picture-card{
    height 120px;
    width 120px;
    border: none;  
  }
  .el-upload-list--picture-card .el-upload-list__item{
    height 120px;
    width 120px;
  }
  .el-upload__tip{
    font-family:PingFangSC-Regular;
    color #999999;
    line-height 12px;
    margin 12px 0;
  }
  .el-form-item__error {
    position static
  }
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

  .textarea {
    height 90px
    pt(6)
    resize none
  }

  .error {
    c(#e43834);
    margin-left: 81px;
    height: 14px;
}
}

.disabled .el-upload--picture-card {
    display: none;
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
