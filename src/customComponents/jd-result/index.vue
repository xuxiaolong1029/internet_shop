<template>
    <view class="result-page" :style="{
		    marginTop: marginTop + 'rpx'
	    }">
        <image class="result-page-image" :src="src" mode="aspectFit"></image>
        <view class="result-page-text" :style="textStyle">{{text}}</view>
        <view class="result-page-subtext">{{subtext}}</view>
        <slot />
    </view>
</template>

<script>
    /**
     * 占位图
     */
    export default {
        name: "jdResult",
        props:{
            /**
             * 图片资源地址，支持相对路径、绝对路径，支持 base64 码
             */
            src: {
                type: String,
                default: '/static/img/information_2x.png'
            },
            /**
             * 主文案
             */
            text: {
                type: String,
                default: ''
            },
            /**
             * 副文案
             */
            subtext: {
                type: String,
                default: ''
            },
            /**
             * 顶部边距
             */
            marginTop:{
                type: String,
                default: ''
            },
			textStyle:{
				type:Object,
				default:()=>{}
			},
        }
    }
</script>

<style lang="scss" scoped>
    .result-page {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        text-align: center;
    }

    .result-page-image {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 40rpx;
    }

    .result-page-text {
        line-height: 1;
        font-size: $font-s-base;
        color: $text-color-grey;

    }

    .result-page-subtext {
        margin-top: 16rpx;
        margin-bottom: 10px;
        color: $text-color-grey;
        font-size: $font-s-sm;
    }
</style>
