<template>
    <view class="doc-info-wrapper" v-if="docList.length">
        <view @click="goDetail(item)" class="doc-info-i flex-c-center" v-for="(item,index) in docList" :key="index">
            <image class="avatar" :src="item.photoUrl || '/static/img/doctor-def_2x.png'" />
            <text class="name">{{item.name}}</text>
            <text class="rank">{{item.titleName}}</text>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'doctor-item',
        props:{
            docList:{
                type:[Array],
                default:()=>[]
            }
        },
        data(){
            return{
            }
        },
        methods:{
            goDetail(item){
                uni.setStorage({key:'doctor-item-data',data:item})
                uni.navigateTo({
                    url:`/pages/hospital/doctor/detail?id=${item.id}`
                })

            }
        }
    }
</script>

<style scoped lang="scss">
    .doc-info-wrapper{
        display:grid;
        grid-column-gap:40rpx;
        grid-row-gap:15px;
        grid-template-columns:1fr 1fr 1fr;
    .name{
        margin:5px 0;
    }
        .avatar{
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
        }
    .rank{
        color: $text-color-grey;
    }
    }
</style>
