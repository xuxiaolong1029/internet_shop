<template>
    <cover-view class="alert-tips" :class="{'fixed':isFixed}" :style="[customStyle]">
        <cover-view class="tip">温馨提示：</cover-view>
        <cover-view class="info">{{info}}</cover-view>
    </cover-view>
</template>

<script>
    export default {
        name: "jdAlertTips",
        props:{
            customStyle:{
                type:Object,
                default:()=>{}
            },
            info:{
                type:String,
                default:''
            },
            isFixed:{
                type:Boolean,
                default:true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .alert-tips{
        padding: 20rpx 40rpx;
        display: flex;
        color: rgba(255, 156, 0, 1);
        background: #ffebcc;
        font-size: $font-s-sm;
        &.fixed{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .tip{
            line-height: 1.5;
            width: 110rpx;
        }
        .info{
            flex: 1;
            line-height: 1.5;
            white-space: pre-wrap;
        }
    }
</style>
