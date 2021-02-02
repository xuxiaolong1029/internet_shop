<template>
    <view class="wrapper">
        <view v-for="(item,index) in list" :key="index">
            <jd-card :iconType="item.cardNo ?'':'arrow-right'" :cardBorder="(index+1)===list.length?'1rpx solid #fff':'1rpx solid #D9D9D9'" :iconColor="iconColor" @click="chooseList(index)">
                <view slot="prefix">
                    {{item.outpatientName}} <u-icon v-if="current===index" name="checkmark" color="#3071EA"></u-icon>
                </view>
                <view slot="suffix">
                    <text v-if="item.cardNo">
                        {{getCardTypeName(item.cardType)}}
                        <text style="margin-left: 4px">{{item.cardNo}}</text>
                    </text>
                    <text v-else :style="{color:notCardNoColor}">未绑定登记号/电子健康卡</text>
                </view>
            </jd-card>
            <!--<u-gap height="1" :bg-color="(index+1)===list.length?'#fff':'#D9D9D9'"></u-gap>-->
        </view>
    </view>
</template>

<script>
    import config from '@/config'
    import jdCard from '@/customComponents/jd-card/index.vue';

    export default {
        name: 'select-patients-list',
        components:{jdCard},
        props:{
            current: {
                type: [String,Number],
                default: ''
            },
            list: {
                type: Array,
                default: () => []
            },
            iconColor:{
                type: String,
                default: '#999999'
            },
            notCardNoColor:{
                type: String,
                default: '#FF9C00'
            }
        },
        methods:{
            getCardTypeName(type){
                return config.common.CARD_TYPE_NAME[type]
            },
            chooseList(index){
                this.$emit('chooseList',index)
            }
        }
    }
</script>

<style scoped lang="scss">
.wrapper{
    background: $white;padding-right: 30rpx;
}
</style>
