<template>
<div class="w-100">
        <div class="userinfo jiupi-center">
            <p class="info-title">个人信息</p>
            <form class="info-content">
                <div class="info-group">
                    <label>店铺名称：</label>
                    <p>{{userInfo.companyName}}</p>
                </div>
                <div class="info-group">
                    <label>会员类型：</label>
                    <p>{{userInfo.userDisplayClassName}}</p>
                </div>
                <div class="info-group">
                    <label>手机号码：</label>
                    <p>{{userInfo.mobileNo}}</p>
                </div>
                <div class="info-group">
                    <label>真实姓名：</label>
                    <p>{{userInfo.userName}}</p>
                </div>
                <div class="info-group">
                    <label>性别：</label>
                    <p>{{userInfo.gender}}</p>
                </div>
                <div class="info-group">
                    <label>出生日期：</label>
                    <p>{{userInfo.birthday}}</p>
                </div>
                <div class="info-group">
                    <label>地址：</label>
                    <p>{{userInfo.address}}{{userInfo.detailAddress}}</p>
                </div>
                <!-- <div class="info-group">
                    <label>详细地址：</label>
                    <p>{{userInfo.detailAddress}}</p>
                </div> -->
                <div class="info-group">
                    <label>营业执照号码：</label>
                    <div class="business">
                        <p class="fz14">{{userInfo.businessLicense}}</p>
                        <img :src="userInfo.businessLicenseUrl" v-if="userInfo.businessLicenseUrl">
                    </div>
                </div>
                <div class="info-group">
                    <label></label>
                    <router-link to="/myOrderEntry/editUserinfo" class="info-change">修改个人信息</router-link>
                </div>
            </form>
        </div>
</div>
</template>
<script>
import * as usercenter from "@/api/usercenter/usercenter";
export default {
    name: "userinfo",
    data(){
        return {
            userInfo: {
                userName: ""
            },
            editSuccess: false,
        }
    },
    components: {
    },
    created(){
        usercenter.getUserInfo().then(res => {
            let data = res.data;
            this.userInfo.userName = data.userName;
            this.userInfo.mobileNo = data.mobileNo;
            if(!data.gender){
                this.userInfo.gender = "保密";
            }else{
                this.userInfo.gender = data.gender;
            }
            this.userInfo.birthday = data.birthday;
            this.userInfo.companyName = data.companyName;
            this.userInfo.address = data.province + data.city + data.county + data.street;
            this.userInfo.detailAddress = data.detailAddress;
            this.userInfo.userDisplayClassName = data.userDisplayClassName;
            this.userInfo.businessLicense = data.businessLicense;
            this.userInfo.businessLicenseUrl = data.businessLicenseUrl;
        })
    },
    mounted(){
        if(this.$route.params.editSuccess){
            this.$toast({text:'个人信息修改成功'});
        }else if(this.$route.params.changeMobileSuccess){
            this.$refs.toast.show('恭喜您，您的手机号已修改成功！');
        }
    }
}
</script>
<style lang="stylus" scoped>
.w-100 {
    width 100%
}

.userinfo{
    bg(#fff)
    mb(38)
}
.info-title{
    width: 100%;
    height: 84px;
    ft(28);
    c(#333);
    lh(84);
    pl(20)
}
.info-content{
    margin: 20px 0;
    ft(12);
    c(#666)
}
.info-group{
    mb(32)
    >label{
        inline()
        width: 124px;
        text-align: right;
        vertical-align top
    }
    >p{
        inline()
        padding: 0 20px;
        c(#333)
        ft(14)
    }

    .business {
        inline()
        pl(20)
        c(#333)

        img {
            block()
            width: 120px;
            height: 120px;
            mt(16)
        }
    }
}
.info-change{
    inline()
    mt(-8)
    ml(20)
    ft(18)
    c(#fff)
    bg(#e43834)
    border: 1px solid #e43834
    padding: 13px 12px;

    &:hover{
        bg(#ef5350);
        border-color: #ef5350;
    }
}
</style>

