<template>
    <view class="swipe-card-item" :style="{color:color,height:height+'rpx'}">
        <image v-if="item.cardType==='12'" :src="getImgUrl" mode="scaleToFill"/>
        <view class="swipe-card-item-top">
            <view>{{item.issuerName||orgName}}</view>
            <view class="logo" v-if="type=== 'home'">
                <image :src="icon" mode="scaleToFill"></image>
                {{getCardTypeName(item.cardType)}}
            </view>
        </view>
        <view class="swipe-card-item-content">
            <view class="swipe-card-item-info">
                <view class="info-name">
                    <view v-if="type=== 'home'">{{item.outpatientName||''}}</view>
                    <view v-else>{{getCardTypeName(item.cardType)}}</view>
                    <view class="card_id">{{item.cardNo||''}}</view>
                </view>
                <slot></slot>
            </view>
            <view class="swipe-card-item-bottom" v-if="type=== 'home'">
                {{item.cardType==='12'?'中华人民共和国国家卫生健康委员会监制':''}}
            </view>
        </view>
    </view>
</template>

<script>
    import config from '@/config'
    import {getImgHost} from '@/utils'
    export default {
        name: "jd-card-item",
        props:{
            item:{
                type:Object,
                default:()=>{}
            },
            height:{
                type:Number|String,
                default:''
            },
            // 展示类型 home:首页样式 patients：就诊人页面样式
            type:{
                type:String,
                default:'home'
            },
            color:{
                type:String,
                default:'#fff'
            },
            orgName:{
                type:String,
                default:''
            }
        },
        data(){
            return{
                icon:require('../../static/img/home/card_logo.png'),
            }
        },
        computed:{
            getImgUrl(){
                return getImgHost() + '/img/card-12' + (this.type === 'home' ?  '-lg' : '') + '.png'
            }
        },
        onShow(){
        },
        methods:{
            getCardTypeName(type){
                return config.common.CARD_TYPE_NAME[type]
            }
        }
    }
</script>

<style scoped lang="scss">
    .swipe-card-item{
        height: 100%;width: 100%;position: relative;
        padding: 30rpx;box-sizing: border-box;
        background: linear-gradient(90deg, #4785FF 0%, #0DAEFF 100%);
        border-radius: 20rpx;
        >image{
            position: absolute;
            top: 0;left: 0;
            z-index:0;
            width: 100%;height: 100%;
        }
        .swipe-card-item-top{
            display: flex;
            font-size:$font-s-sm;
            justify-content: space-between;
            align-items: center;position: relative;
            z-index: 10;
            .logo{
                font-size:$font-s-base;font-weight: bold;
                image{
                    width: 40rpx;height: 40rpx;margin-right: 10rpx;vertical-align:middle;
                }
            }
        }
        .swipe-card-item-content{
            position: absolute;bottom:20rpx;left: 30rpx;right:30rpx;
            .swipe-card-item-info{
                display: flex;z-index: 10;position: relative;
                justify-content: space-between;
                align-items:flex-end;
                .info-name{
                    font-weight: bold;font-size:$font-s-llg;
                    .card_id{
                        font-size: 30rpx;margin-top: 6rpx;
                    }
                }
            }
            .swipe-card-item-bottom{
                text-align: center;font-size:$font-s-sm;margin-top: 15rpx;
            }
        }
    }
</style>
