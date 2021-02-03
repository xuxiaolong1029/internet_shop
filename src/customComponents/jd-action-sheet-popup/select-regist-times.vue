<template>
    <jd-action-sheet-popup v-model="show"
                        mode="bottom"
                        borderRadius="20"
                        :showConfirmBtn="false"
                        :btnBorder="true"
                        btnBorder z-index="998">
        <template v-slot:top>
            <view class="srt-header">
            	<view class="title">{{title}}</view>
            	<view class="schedule-type">{{scheduleType}}</view>
            </view>
        </template>
        <template v-slot:middle>
			<view class="srt-body" :style="{'height':scrollHeight}">
				<scroll-view class="scroll-view" scroll-y="true">
					<view class="srt-item" v-for="(item,index) in list" :key="index" @click="changeTime(item)">
						<view class="srt-left">
							<view class="time">{{item.startTime + '-' + item.endTime}}</view>
							<view class="number" v-if="item.surplusNum!=null">还剩{{item.surplusNum}}个号</view>
							<view class="number" v-else>{{item.numId}}号</view>
						</view>
						<view class="srt-right">
							<text>预约</text>
							<u-icon name="arrow-right" color="#3071EA" size="20"></u-icon>
						</view>
					</view>
				</scroll-view>
			</view>
        </template>
    </jd-action-sheet-popup>
</template>

<script>
    import jdActionSheetPopup from '@/customComponents/jd-action-sheet-popup'
    export default {
        name: 'jdSelectRegistTimes',
        components: {
            jdActionSheetPopup
        },
        props:{
			title: {
			    type: String,
			    default: '选择'
			},
			scheduleType: {
			    type: String,
			    default: ''
			},
            list: {
                type: Array,
                default: () => []
            },
        },
        data(){
            return{
				show:false,
        		scrollHeight: 'auto'
            }
        },
        watch: {
        	list: {
        		handler (val) {
        			if(val && val.length > 6){
        				this.scrollHeight = '572rpx'
        			}else{
        				this.scrollHeight = 'auto'
        			}
        		},
        		immediate: true
        	}
        },
        methods:{
            changeTime(item) {
                this.$emit('changeTime', item)
            },
			_toggleShow(){
			    this.show = !this.show
			}
        }
    }
</script>

<style scoped lang="scss">
	.srt-header{
		background-color: #FFFFFF;
		flex-grow: 0;
		flex-shrink: 0;
		height: 88rpx;
		line-height: 88rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title{
			font-size:$font-s-lg;
			color: $text-color-grey;
		}
		.schedule-type{
			font-size:$font-s-base;
			color: $text-color;
		}
	}

	.srt-body{
		background-color: #FFFFFF;
		flex: 1;
		overflow: hidden;
		border-top: 1rpx solid $line;
		padding-left: 30rpx;
		margin-bottom: 20rpx;
		.scroll-view{
			height: 100%;
		}
		.srt-item{
			height: 88rpx;
			display: flex;
			align-items: center;
			padding-right: 30rpx;
			& + .srt-item{
				border-top: 1rpx solid $line;
			}
		}
		.srt-left{
			flex: 1;
			overflow: hidden;
			font-size:$font-s-base;
			display: flex;
			.time{
				width: 190rpx;
				font-size:$font-s-lg;
				white-space: nowrap;
			}
			.number{
				margin-left: 80rpx;
				font-size:$font-s-lg;
			}
		}
		.srt-right{
			width: 100rpx;
			flex-grow: 0;
			flex-shrink: 0;
			display: flex;
			justify-content: flex-end;
			text{
				font-size:$font-s-lg;
				color: $primary;
			}
			.u-icon{
				margin-top: 2rpx;
			}
		}
	}

</style>
