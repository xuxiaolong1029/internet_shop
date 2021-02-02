<template>
    <view class="jd-s-p-l">
        <view class="flex-r-sb-center jd-s-p-l-head">
            <text>或是否要选择其他就诊人？</text>
            <jd-link-icon-btn @onClick="onHead">添加就诊人</jd-link-icon-btn>
        </view>
        <view class="jd-s-p-l-wrapper">
            <slot></slot>
        </view>
    </view>
</template>

<script>
    import jdLinkIconBtn from '@/customComponents/jd-button/link-icon-btn'
    export default {
        name: 'jd-select-patients-list-wrapper',
        components:{jdLinkIconBtn},
        props:{

        },
        methods:{
            onHead(){
                this.$emit('onHead')
            }
        }
    }
</script>

<style scoped lang="scss">
    .jd-s-p-l{
        margin-top: 60px;
        &-wrapper{
             background: $white;
             padding-left:30rpx;
             margin-top: 10px;
         }
        &-head{
             padding: 0 30rpx;
             font-family: $font-family-M;
         }
    }
</style>
