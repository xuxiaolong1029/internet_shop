<template>
	<view class="register-doctor" :style="customStyle" @click.native.stop="changeContent">
		<view class="rd-left">
			<view class="rd-img">
				<image v-if="doctorObj.doctorImgUrl" :src="doctorObj.doctorImgUrl" mode="scaleToFill" alt=""></image>
			</view>
		</view>
		<view class="rd-right">
			<view class="rd-info">
				<view class="rd-info-left">
					<view class="rd-info-header">
						<text class="rd-name">{{doctorObj.doctorName}}</text>
						<text class="rd-position" v-if="showProperty">{{doctorObj.titleName}}</text>
					</view>
					<view class="rd-info-body">
						<text class="price" v-if="showPrice">￥{{doctorObj.registeredFee || 0}}{{ isMultiplePrices() }}</text>
						<view class="evaluate" v-if="doctorObj.doctorStar">
							<view class="rd-icon"></view>
							<text>{{doctorObj.doctorStar}}</text>
						</view>
						<view class="user" v-if="doctorObj.acceptsAmount">
							<view class="rd-icon"></view>
							<text>{{ fmoney(doctorObj.acceptsAmount)}}</text>
						</view>
					</view>
				</view>
				<view class="rd-info-right" v-if="showOption">
					<u-button type="primary" shape="circle" size="mini" class="primary-btn" :disabled="!isAppointment()" @click="clickAppointment">{{appointmentText()}}</u-button>
				</view>
			</view>
			<view class="introduction" v-if="showIntroduce && doctorObj.specialSkill">
				<text>{{ doctorObj.specialSkill }}</text>
			</view>
			<view class="rd-numbers" v-if="showNumberDate">
				<text class="rdn-label">最近有号</text>
				<view class="rdn-val">
					<template v-if="isAppointment()">
						<view class="rdn-number" v-for="(item,index) in doctorObj.hasList" :key="index">{{ formateNumbers(item) }}</view>
					</template>
					<view class="rdn-nothing" v-else>无</view>
				</view>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import { fmoney } from '@/utils/util'
    export default {
		name: "registerDoctor",
        props:{
			showOption: {
			    type: Boolean,
			    default: true
			},
			showProperty: {
			    type: Boolean,
			    default: true
			},
			showPrice: {
			    type: Boolean,
			    default: true
			},
			showIntroduce: {
			    type: Boolean,
			    default: true
			},
			showNumberDate: {
			    type: Boolean,
			    default: true
			},
			doctorObj: {
			    type: Object,
			    default: {}
			},
			customStyle:{
				type:Object,
				default:()=>{}
			},
        },
        data(){
            return{
            }
        },
        methods: {
			fmoney,
			isMultiplePrices(){
				return (this.doctorObj.isMultiplePrices && this.doctorObj.isMultiplePrices=='Y')?'起':''
			},
			isAppointment(){
				return this.doctorObj.hasList && this.doctorObj.hasList.length>0
			},
			appointmentText(){
				let text = '约满'
				if(this.isAppointment()){
					text = '预约'
				}
				return text
			},
			formateNumbers(item){
				let numbersStr = ''
				if(item && item.schDate!=null){
					let dt = new Date(item.schDate)
					let month = dt.getMonth()+1
					numbersStr = month+'/'+dt.getDate()
				}
				return numbersStr
			},
            clickAppointment() {
                this.$emit('clickAppointment',this.doctorObj)
            },
			changeContent() {
				this.$emit('changeContent',this.doctorObj)
			}
        }
    }
</script>

<style lang="scss" scoped>
    .register-doctor{
    	display: flex;
    	padding: 30rpx 0;
    	& + .register-doctor{
    		border-top: 1rpx solid $line;
    	}
    	.rd-left{
    		width: 80rpx;
    		flex-grow: 0;
    		flex-shrink: 0;
    		margin-right: 20rpx;
    		.rd-img{
    			width: 100%;
    			height: 80rpx;
    			box-sizing: border-box;
				border-radius: 50%;
    			@include bg-image('img/doctor-def');
				border: 1rpx solid $line;
    			image{
    				width: 100%;
    				height: 100%;
					border-radius: 50%;
    			}
    		}
    	}
    	.rd-right{
    		flex: 1;
    		overflow: hidden;
    	}
    	.rd-info{
    		display: flex;
    		justify-content: space-between;
    		align-items: center;
    		.rd-info-left{
    			overflow: hidden;
    		}
    		.rd-name{
    			font-size: $font-s-lg;
    			line-height: 34rpx;
    			color: $text-color;
    		}
    		.rd-position{
    			margin-left: 20rpx;
    			font-size: $font-s-base;
    			line-height: $font-s-base;
    			color: $text-color-grey;
    		}
    	}
    	.rd-info-right{
    		width: 88rpx;
    		flex-grow: 0;
    		flex-shrink: 0;
			/deep/{
				.u-btn{
					line-height: 48rpx;
					height: 48rpx;
					font-size: $font-s-sm !important;
				}
				.u-btn--primary--disabled{
					color: $text-color-grey!important;
					background-color: #F5F6F7!important;
					border: 1rpx solid #D9D9D9!important;
					box-sizing: border-box;
					width: 88rpx;
				}
			}
    	}
    	.rd-info-header{
    		overflow: hidden;
			display: flex;
			align-items: center;
    	}
    	.introduction{
    		margin-top: 16rpx;
    		text{
    			font-size: $font-s-base;
    			line-height: 42rpx;
    			color: $text-color;
    			@include morelineEllipsis(2);
    		}
    	}
    	.rd-numbers{
    		margin-top: 12rpx;
    		font-size: $font-s-base;
    		line-height: 42rpx;
    		display: flex;
    		.rdn-label{
    			width: 112rpx;
    			flex-grow: 0;
    			flex-shrink: 0;
    			color: $text-color-grey;
    		}
    		.rdn-val{
    			margin-left: 20rpx;
    			color: $primary;
				display: flex;
				flex-wrap: wrap;
    		}
			.rdn-number{
				display: flex;
				margin-right: 14rpx;
			}
			.rdn-nothing{
				color: $text-color-grey;
			}
    	}
    	.rd-info-body{
    		margin-top: 20rpx;
    		display: flex;
    		font-size: $font-s-base;
    		line-height: $font-s-base;
    		color: $text-color-grey;
			align-items: center;
    		.price{
    			color: $text-color-money;
				margin-right: 40rpx;
    		}
    		.evaluate, .user{
    			margin-right: 40rpx;
    			display: flex;
    			.rd-icon{
    				width: 24rpx;
    				height: 24rpx;
    				margin-right: 12rpx;
    				@include bg-image('img/star');
    			}
    		}
    		.user .rd-icon{
    			@include bg-image('img/users1');
    		}
    	}
    }
</style>
