<template>
    <view class="hospital-item" @click="onChange">
    	<view class="logo">
    		<image v-bind:src="itemData.img" class="logo-img"></image>
    	</view>
    	<view class="info">
    		<view class="title-container">
    			<text class="title">{{itemData.title}}</text>
    			<text class="distance">{{itemData.distance}}km</text>
    		</view>
    		<view class="label-container">
    			<view class="label-level" v-if="itemData.level">{{itemData.level}}</view>
    			<view class="label-type" v-if="itemData.hospitalType">
    				<view class="icon-add"></view>
    				<view>{{itemData.hospitalType}}</view>
    			</view>
    		</view>
    		<view class="addr">{{itemData.addr}}</view>
    	</view>
    </view>
</template>

<script>
    export default {
		name: "hospitalItem",
        props:{
            itemData:{
              type: [Object,Array],
              default: null,
			}
        },
        data(){
            return{

            }
        },
        methods: {
            onChange() {
                this.$emit('changeHospital',this.itemData)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hospital-item{
    	padding: 30rpx 0rpx;
    	display: flex;
    	& + .hospital-item{
    		border-top: 1rpx solid $line;
    	}
    	.logo{
    		width: 180rpx;
    		height: 132rpx;
    		background-color: $bg-color;
    		.logo-img{
    			width: 100%;
    			height: 100%;
    			border-radius: 4rpx;
    		}
    	}
    	.info{
    		margin-left: 20rpx;
    		flex: 1;
    		overflow: hidden;
    	}
    	.title-container{
    		display: flex;
    		justify-content: space-between;
    		align-items: center;
    		.title{
    			flex: 1;
    			font-size:$font-s-lg;
    			line-height: 32rpx;
    			color: $text-color;
    			white-space: nowrap;
    			overflow: hidden;
    			text-overflow: ellipsis;
    		}
    		.distance{
    			width: 120rpx;
    			text-align: right;
    			font-size:$font-s-base;
    			line-height: 28rpx;
    			color: $text-color-grey;
    			white-space: nowrap;
    			overflow: hidden;
    			text-overflow: ellipsis;
    		}
    	}
    	.label-container{
    		margin-top: 16rpx;
    		display: flex;
			height: 36rpx;
			font-size:$font-s-sm;
    		.label-level{
    			height: 36rpx;
    			line-height: 36rpx;
    			padding: 0rpx 10rpx;
    			margin-right: 12rpx;
    			background-color: rgba(48, 113, 234, 0.1);
    			border-radius: 4rpx;
    			color: $primary;
    		}
    		.label-type{
    			height: 36rpx;
    			line-height: 36rpx;
    			padding: 0rpx 10rpx;
    			background-color: rgba(18, 206, 138, 0.1);;
    			border-radius: 4rpx;
    			color: $success;
    			display: flex;
    			align-items: center;
    			.icon-add{
    				width: 22rpx;
    				height: 22rpx;
    				margin-right: 8rpx;
    				@include bg-image('img/icon-add-g');
    			}
    		}
    	}
    	.addr{
    		font-size:$font-s-base;
    		line-height: 28rpx;
    		color: #999999;
    		margin-top: 22rpx;
    		white-space: nowrap;
    		overflow: hidden;
    		text-overflow: ellipsis;
    	}
    }
</style>
