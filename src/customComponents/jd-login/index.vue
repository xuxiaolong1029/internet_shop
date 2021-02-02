<template>
    <jd-alert-container :show="showMask" @close="close" height="510rpx">
        <view class="warp-from">
            <view class="title">请验证手机号</view>
            <view class="des">该业务需要，请您先验证手机号</view>
            <view class="input-item">
                <view class="form-input form-input1">
                    <input class="input" type="number" maxlength="11" @blur="blurPhone" autocomplete="off" v-model="checkForm.mobile" placeholder-style="color:#bbb;font-size:28rpx;" name="mobile" placeholder="请输入手机号" />
                </view>
                <view class="error" v-if="mobileErrTip">{{mobileErrTip}}</view>
            </view>
            <view class="input-item" style="margin-bottom:60rpx">
                <view  class="form-input form-input2">
                    <input class="input" type="number" maxlength="6" autocomplete="off" v-model="checkForm.verifyCode" placeholder-style="color:#bbb;font-size:28rpx;" name="verifyCode" placeholder="请输入短信验证码" />
                </view>
                <view class="code-bottom" @click="getCode">
                    <text :style="{color:isSmsDisabled?'#999':'#3071EA'}">{{smsButtonText}}</text>
                </view>
                <view class="error" v-if="verifyCodeErrTip">{{verifyCodeErrTip}}</view>
            </view>
            <jd-button :disabled="submitDisabled" @submit="submit" type="primary">确定</jd-button>
        </view>
    </jd-alert-container>
</template>

<script>
    import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
    import JdButton from "../jd-button/index";
    import { mapState } from 'vuex'
    import {goAuthAndTarget} from '@/utils'
    export default {
        name: "auth-login",
        components:{JdButton,jdAlertContainer},
        data(){
            return{
                showMask:false,
                fromUrl:'',
                checkForm: {
                    mobile: '',
                    verifyCode: ''
                },
                mobileErrTip:'',
                verifyCodeErrTip:'',
                smsButtonText:'获取验证码',
                timer:null,
                isSmsDisabled:false,
                userId:'',
                openId:''
            }
        },
        computed:{
            ...mapState(['appId','oauth']),
            submitDisabled(){
                if(this.smsButtonText!=='获取验证码'&&this.checkForm.verifyCode.length===6){
                    return false
                }else{
                    return true
                }
            }
        },
        methods:{
            //获取是否授权过
            getAuthSetting(url,userInfo){
                uni.getSetting({
                    success:res=>{
                        if(res.authSetting.userInfo) {
                            if(Object.keys(userInfo).length>0){
                                uni.navigateTo({url: url});
                            }else{
                                this.getUserInfo();
                                this.fromUrl = url;
                            }
                        }else{
                            goAuthAndTarget(url)
                        }
                    },
                    fail:err=>{
                        goAuthAndTarget(url)
                    }
                });
            },

            // 授权成功回调
            getUserInfo(url){
                if(url){
                    this.fromUrl = url;
                }
                uni.login({
                    provider:this.oauth,
                    success:(loginRes)=>{
                        let authCode = loginRes.authCode;
                        console.log("authCode:"+authCode)
                        uni.getOpenUserInfo({
                            success: res => {
                                let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
                                if(authCode){
                                    this.registLogin(userInfo,authCode);
                                }
                            },
                            fail: res => {
                                console.log(res);
                            }
                        });
                    }
                });
            },
            async registLogin(userInfo,authCode){
                let data = await this.$api.user_register_Login(
                    {
                        authCode:authCode,
                        thdAppId:this.appId,
                        nickName:userInfo.nickName,
                        sex:userInfo.gender.toUpperCase(),
                        nationality:userInfo.countryCode,
                        location:userInfo.province,
                        detailAddress:userInfo.city,
                        headImgUrl:userInfo.avatar
                    });
                if(data.accessToken){
                    uni.setStorage({
                        key: 'accessToken',
                        data: {
                            accessToken:data.accessToken
                        }
                    });
                }
                this.openId = data.openId;
                if(Number(data.code)===200){
                    const userInfo = {
                        headImgUrl:data.headImgUrl,
                        location:data.location,
                        mobileNo:data.mobileNo,
                        nickName:data.nickName,
                        name:data.name,
                        userId:data.userId,
                        openId:data.openId,
                        sex:data.sex,
                        thdAppId:this.appId,
                        refreshToken:data.refreshToken
                    };
                    uni.setStorage({
                        key: 'userInfo',
                        data:userInfo,
                        success: () => {
                            this.goBackFrom();
                        }
                    });
                }else{
                    if(data.userId){
                        this.userId = data.userId;
                        this.showMask = true
                    }else{
                        uni.showToast({
                            title: data.message||data.msg,
                            mask: true,
                            duration:2000
                        });
                    }
                }
            },
            blurPhone(){
                if(this.checkForm.mobile){
                    if(!(/^1[3456789]\d{9}$/.test(this.checkForm.mobile))){
                        this.mobileErrTip = '手机号格式错误';
                    }else{
                        this.mobileErrTip = '';
                    }
                }else{
                    this.mobileErrTip = '请输入手机号码';
                }
            },
            async getCode(){
                if(this.checkForm.mobile){
                    if(this.isSmsDisabled||this.mobileErrTip){
                        return
                    }
                    let count = 60;
                    let that = this;
                    this.isSmsDisabled =true;
                    this.smsButtonText = count + "s后重新获取";
                    that.timer = setInterval(() => {
                        count--;
                        if (count <= 0) {
                            clearInterval(that.timer);
                            that.smsButtonText = "重新获取";
                            that.isSmsDisabled = false;
                            return;
                        }
                        that.smsButtonText = count + "s后重新获取";
                    }, 1000);
                    await this.$api.sms_code_send(
                        {
                            mobile: this.checkForm.mobile,
                            thdAppId:this.appId,
                            mobileEncFlag:0,
                            timeoutMinutes:5
                        });
                }else{
                    this.mobileErrTip = '请输入手机号码';
                }
            },
            async submit(){
                let {code,succeed,msg,...data} = await this.$api.sms_verify_code_check(
                    {
                        mobile: this.checkForm.mobile,
                        verifyCode:this.checkForm.verifyCode,
                        userId:this.userId,
                        mobileEncFlag:0
                    });
                uni.setStorage({
                    key: 'userInfo',
                    data: {
                        ...data,
                        openId:this.openId
                    },
                    success: () => {
                        this.goBackFrom();
                    }
                });
            },
            goBackFrom(){
                if(this.fromUrl){
                    if(this.fromUrl.includes('/pages/tabBar')){
                        uni.switchTab({
                            url:this.fromUrl,
                            success:(suc)=>{
                                this.close()
                            },
                            fail:(fail)=>{
                                console.log(fail)
                            }
                        });
                    }else{
                        let pages = getCurrentPages();    //获取加载的页面
                        let currentPage = pages[pages.length - 1].route;  //获取当前页面
                        if(currentPage==='pages/auth/index'){
                            uni.redirectTo({
                                url:this.fromUrl,
                                success:(suc)=>{
                                    this.close()
                                },
                            });
                        }else{
                            uni.navigateTo({
                                url:this.fromUrl,
                                success:(suc)=>{
                                    this.close()
                                },
                            });
                        }

                    }
                }
            },
            close(){
                this.showMask = false;
                this.$emit('close')
            }
        }
    }
</script>

<style scoped lang="scss">
    .warp-from{
        width:100%;text-align: left;padding:40rpx 60rpx;
        background-color: #fff;box-sizing: border-box;border-radius: 10rpx;
        .title{
            text-align: center;font-size:$font-s-lg;
        }
        .des{
            text-align: center;font-size:$font-s-base;color: #999;margin-top: 10rpx;margin-bottom: 40rpx;
        }
        .input-item{
            height: 88rpx;line-height: 88rpx;margin-bottom:30rpx;position: relative;width: 100%;
            .form-input{
                border-bottom: 1rpx solid #D9D9D9;padding-left:50rpx;width: 100%;height: 88rpx;line-height: 88rpx;
                .input{
                    caret-color:#3071EA;height:60rpx;line-height:60rpx;padding: 13rpx 0rpx 13rpx 5rpx;
                    width: 100%;
                }
            }
            .code-bottom{
                position: absolute;right: 0;top: 0;
            }
            .error{
                position: absolute;left:2rpx;top:94rpx;width: 100%;z-index: 10;font-size:$font-s-sm;color: $danger;
                height: 30rpx;line-height: 34rpx;
            }
            .form-input1{
                background: url("../../static/img/auth/mobile.png") no-repeat left center;
                background-size: 36rpx 36rpx;
            }
            .form-input2{
                background: url("../../static/img/auth/code.png") no-repeat left center;
                background-size: 32rpx 36rpx;
            }
        }
    }
</style>
