<template>
    <scroll-view class="scroll_view_doctor" scroll-x="true">
        <template v-for="(item, index) in doctorsList">
            <view :key="index" class="scroll_view_doctor_list" @click="goToDoctor(item)">
                <view class="top">
                    <view style="margin-right: 10rpx;">
                        <jd-avatar :src="item.photoUrl||'/static/img/doctor-def_3x.png'" size="80"></jd-avatar>
                    </view>
                    <view>
                        <view class="line1">
                            <text class="line1-name">{{ item.name }}</text>
                            <text>{{ item.titleName }}</text>
                        </view>
                        <view class="line2">
                            <!--<text>{{ item.orgName }}</text>-->
                            <text>{{ item.deptName }}</text>
                        </view>
                    </view>
                </view>
                <view class="line3">
                    <text class="text">{{ item.registType||'当日挂号' }}</text>
                    <text>{{filtersTime(item.registDate,10)}}</text>
                    <text v-if="item.patientName">({{ item.patientName }})</text>
                </view>
            </view>
        </template>
    </scroll-view>
</template>

<script>
    import JdAvatar from '@/customComponents/jd-avatar/index.vue';
    import { timestampToTime } from '@/utils/util'
    export default {
        name: "my-doctor",
        components:{JdAvatar},
        props:{
            doctorsList:{
                type:Array,
                default:()=>[]
            },
            orgCode:{
                type: String,
                default:()=>''
            }
        },
        methods:{
            goToDoctor(item){
                uni.navigateTo({
                    url: `/pages/register/doctorPage/index?orgCode=${this.orgCode}&doctorCode=${item.doctorCode}&deptId=${item.deptId}&deptCode=${item.deptCode}&deptName=${item.deptName}&deptLast=Y`
                });
            },
            filtersTime(val,length){
                return timestampToTime(val,length)
            }
        }
    }
</script>

<style scoped lang="scss">
    .scroll_view_doctor {
        white-space: nowrap;
        width: 100%;
        .scroll_view_doctor_list {
            display: inline-block;
            width: 434rpx;
            height: 182rpx;
            padding: 20rpx;
            border: 1rpx solid #e3e3e3;
            box-sizing: border-box;
            border-radius: 10rpx;
            margin-left: 30rpx;
            &:nth-last-of-type(1) {
                margin-right: 30rpx;
            }
            .top {
                box-sizing: border-box;width: 100%;height: 80rpx;display: flex;
                .line1 {
                    font-size: $font-s-base;
                    .line1-name {
                        display: inline-block;
                        font-size:$font-s-lg;
                        margin-right:20rpx;
                    }
                }
                .line2 {
                    margin-top: 6rpx;
                    text {
                        font-size:$font-s-base;
                        color: $text-color-grey;
                    }
                }
            }
            .line3 {
                font-size: $font-s-sm;
                margin-top: 10rpx;
                .text {
                    border: 1px solid $primary;
                    box-sizing: border-box;
                    font-size: $font-s-sm;
                    border-radius: 4px;
                    color: $primary;
                    display: inline-block;
                    padding: 4rpx;
                    margin-right: 10rpx;
                }
            }
        }
    }
</style>