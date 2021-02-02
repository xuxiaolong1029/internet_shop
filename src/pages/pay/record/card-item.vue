<template>
    <view class="card-item">
        <view class="pay-record-item-top">
            <view class="top1">
                <view>{{item.feeTypeName||item.feeType}}</view>
                <view>
                    <u-loading v-if="item.status&&item.status.includes('PROCESSING')" color="#3071EA" size="24"></u-loading>
                    <text style="margin-left:6rpx" :class="item.status">{{getCardTypeName(item.status)}}</text>
                </view>
            </view>
            <view class="price">￥{{item.orderAmt||''}}</view>
        </view>
        <view class="pay-record-item-middle">
            <slot name="middle"></slot>
        </view>
    </view>
</template>

<script>
    import config from '@/config'
    import jdButton from '@/customComponents/jd-button/index';
    export default {
        name: "card-item",
        components:{
            jdButton
        },
        props:{
            item:{
                type:Object,
                default:()=>{}
            }
        },
        methods:{
            getCardTypeName(type){
                return config.common.PAY_STATUS[type].label
            }
        }
    }
</script>

<style scoped lang="scss">
    .card-item{
        margin-top:20rpx;background-color: #fff;padding: 30rpx;box-sizing: border-box;border-radius:20rpx;
        .pay-record-item-top{
            font-size: $font-s-base;width: 100%;
            .price{
                padding: 10rpx 0 20rpx;
            }
            .top1{
                display: flex;justify-content: space-between;
                .PAY_INIT,.REFUND_PROCESSING,.FEE_PROCESSING,.PAY_PROCESSING{
                    color:$primary;
                }
                .FEE_SUCCEED,.REFUND_SUCCEED{
                    color:$success;
                }
                .FEE_FAILED,.REFUND_FAILED{
                    color:$danger;
                }
                .REFUND_UNKNOWN,.PAY_UNKNOWN,.FEE_UNKNOWN{
                    color:$warning;
                }
            }
            .price{
                color:$warning;
            }
        }
        .pay-record-item-middle{
            background: #F3F7FF;border-radius: 10px;padding:30rpx 20rpx;box-sizing: border-box;
        }
        .pay-record-item-bottom{
            display: flex;align-items: center;justify-content: flex-end;margin-top: 30rpx;
            .time{
                flex: 1;text-align: left;color:#999999;
            }
        }
    }
</style>