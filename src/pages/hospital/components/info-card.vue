<template>
    <view class="info-wrapper" :style="[customStyle]">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: 'info-card',
        props:{
            title:{
                type:String,
                default:''
            },
            customStyle:{
                type:Object,
                default:()=>{}
            }
        }
    }
</script>

<style scoped lang="scss">
    .info-wrapper{
        background: $white;
        border-radius: 10px;
        padding: 30rpx;
        padding-bottom: 0;
        box-sizing: border-box;
    }
</style>
