<template>
    <view class="card-item">
        <view class="card-item-title" :style="{fontSize:fontSize+'rpx',color:titleColor}">{{title}}</view>
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: "card-item",
        props:{
            title:{
                type:String,
                default:""
            },
            fontSize:{
                type:String|Number,
                default:32
            },
            titleColor:{
                type:String,
                default:"#3071EA"
            }
        }
    }
</script>

<style scoped lang="scss">
    .card-item{
        background-color: #fff;padding:30rpx;box-sizing: border-box;
        .card-item-title{
            padding-bottom: 20rpx;
        }
    }
</style>