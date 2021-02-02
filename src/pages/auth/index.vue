<template>
    <view class="auth-pages">
        <image src="../../static/img/auth/auth.png" mode="scaleToFill"></image>
        <view class="no-auth">尚未授权</view>
        <view>互联网医院小程序需要您的授权才能使用</view>
        <button class="auth-button" open-type="getAuthorize" scope="userInfo" @getAuthorize="onGetAuthorize" @error="onAuthError">确认授权</button>
        <jd-login ref="child"></jd-login>
    </view>
</template>

<script>
    import JdLogin from '../../customComponents/jd-login/index'
    export default {
        name: "auth-index",
        components:{JdLogin},
        data(){
            return{
                fromUrl:''
            }
        },
        computed:{

        },
        onLoad(param){
            this.fromUrl = decodeURIComponent(param.from)
        },
        methods:{
            // 授权成功回调
            onGetAuthorize(e){
                this.$refs.child.getUserInfo(this.fromUrl)
            },
            // 授权失败回调
            onAuthError(e) {
                uni.navigateBack({
                    delta: -1
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .auth-pages{
        width: 100%;text-align: center;background: #fff;
        height:100vh;font-size:$font-s-base;
        image{
            width: 160rpx;height: 160rpx;margin-top: 80rpx;
        }
        .no-auth{
            font-size:$font-s-llg;font-weight: bold;margin:40rpx auto 30rpx;
        }
        .auth-button{
            background: #3071EA;height: 88rpx;line-height: 88rpx;
            border-radius: 3rpx;color: #fff;width:calc(100% - 60rpx);
            font-size:$font-s-lg;margin: 60rpx 30rpx;
        }
    }
</style>
