<template>
	<view class="date-filter">
		<view class="df-all">
			<view class="df-all-item" :class="{'active': active=='all'}" @click="changeDate('all')">
				<view class="df-text">全部</view>
				<view class="df-text">日期</view>
			</view>
		</view>
		<view class="date-list">
			<scroll-view class="scroll-view" scroll-x="true">
				<view class="date-list-content">
					<view class="date-item" v-for="(item,index) in dateList" :key="index" :class="{'active':item.date==active}"  @click="changeDate(item)">
						<view class="describe">{{item.text}}</view>
						<view class="date">{{item.date}}</view>
						<view class="status" :class="{'colorful': item.status=='有号'}">{{item.status}}</view>
					</view>
					<view class="di-fill"></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
    export default {
		name: "dateFilter",
        props:{
			dateList: {
				type:[Array],
				default:()=>[]
			},
			activeKey: {
				type: String,
				default: 'all'
			},
        },
        data(){
            return{
				active: ''
            }
        },
		created() {
			this.active = this.activeKey;
		},
        methods: {
            changeDate(item) {
				if(item && typeof item == "object"){
					this.active = item.date
				}else{
					this.active = item
				}
                this.$emit('changeDate',item)
            }
        }
    }
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	} 
    .date-filter{
		background-color: #FFFFFF;
		padding: 30rpx 0rpx;
		display: flex;
		.df-all{
			width: 156rpx;
			height: 100%;
			padding-left: 30rpx;
			padding-right: 20rpx;
		}
		.df-all-item, .date-item {
			width: 106rpx;
			height: 132rpx;
			background-color: #F4F4F4;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			color: $text-color;
			font-size:$font-s-base;
		}
		.df-text{
			height: 42rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.date-item {
			padding: 0;
			margin-right: 20rpx;
			flex-shrink: 0;
			justify-content: center;
		}
		.date-list{
			flex: 1;
			overflow: hidden;
		}
		.date-list-content{
			display: flex;
		}
		.describe, .status{
			color: $text-color-grey;
		}
		.date, .status{
			margin-top: 5rpx;
		}
		.status.colorful{
			color: $primary;
		}
		.date{
			color: $text-color;
		}
		.active{
			&.df-all-item, &.date-item {
				background-color: $primary;
				color: #FFFFFF;
			}
			.describe, .status, .date {
				color: #FFFFFF;
			}
		}
		.di-fill{
			width: 1rpx;
			flex-shrink: 0;
		}
	}
</style>
