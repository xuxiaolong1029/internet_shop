<template>
	<view class="register-categorys" @click.native.stop="changeContent">
		<view class="rd-type-left">
			<view class="rd-types-header">
				<text class="time-interval">{{formatAmp(categorys.apm)}}</text>
				<text class="dept">{{categorys.deptName}}</text>
			</view>
			<view class="rd-types-body">
				<text class="type" v-if="categorys.numType">{{formatNumType(categorys.numType)}}</text>
				<text class="price">￥{{categorys.registFee || 0}}</text>
				<view class="number-count" v-if="showSurplusNum && categorys.surplusNum">还有 <text class="count">{{categorys.surplusNum}}</text> 个号</view>
			</view>
		</view>
		<view class="rd-type-right">
			<u-button type="primary" shape="circle" size="mini" class="primary-btn" :disabled="!isAppointment(categorys.surplusNum)" @click="clickAppointment(categorys)">{{appointmentText(categorys.surplusNum)}}</u-button>
		</view>
	</view>
</template>

<script>
	import config from '@/config';
	import { dateFormat } from '@/utils'
	const {APM, NUM_TYPE, REGIST_TYPE} = config.common
    export default {
		name: "registerCategorys",
        props:{
			showSurplusNum: {
			    type: Boolean,
			    default: false
			},
			categorys: {
			    type: Object,
			    default: {}
			},
			params: {
				type: Object,
				default: {}
			},
			date:{
				type: String,
				default: ''
			}
        },
        data(){
            return{
				APM,
				NUM_TYPE,
				REGIST_TYPE,
				registTypeCode: 'REGIST_PRE'
            }
        },
        methods: {
			isAppointment(surplusNum){
				return surplusNum && surplusNum > 0
			},
			appointmentText(surplusNum){
				let text = '约满'
				if(this.isAppointment(surplusNum)){
					text = REGIST_TYPE['REGIST_PRE']
					this.registTypeCode = 'REGIST_PRE'
					// 当日显示挂号
					if(this.isNowDate()){
						text = REGIST_TYPE['REGIST_DAY']
						this.registTypeCode = 'REGIST_DAY'
					}
				}
				return text
			},
			isNowDate(){
				let bl = false
				if(this.date!=null && this.date!=''){
					let dtText = dateFormat('YYYY-mm-dd', new Date())
					bl = this.date == dtText
				}
				return bl
			},
			formatAmp(apm){
				return this.APM[apm]
			},
			formatNumType(type){
				return NUM_TYPE[type]
			},
            clickAppointment(item) {
				if(!this.isAppointment(this.categorys.surplusNum)){
					return
				}
                this.$emit('clickAppointment',this.categorys, this.params, this.registTypeCode)
            },
			changeContent() {
				if(!this.isAppointment(this.categorys.surplusNum)){
					return
				}
				this.$emit('changeContent',this.categorys, this.params, this.registTypeCode)
			}
        }
    }
</script>

<style lang="scss" scoped>
    .register-categorys{
    	font-size: $font-s-base;
    	line-height: font-s-base;
    	color: $text-color;
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	padding: 30rpx 0rpx;
		& + .register-categorys{
			// margin-top: 30rpx;
			border-top: 1rpx solid $line;
		}
    	.rd-type-left{
    		overflow: hidden;
    		.rd-types-header{
    			overflow: hidden;
    			line-height: $font-s-base;
				display: flex;
    		}
    		.rd-types-body{
    			margin-top: 12rpx;
    			display: flex;
    			font-size: $font-s-base;
    			line-height: $font-s-base;
    			color: $text-color-grey;
    		}
    		.type{
    			font-size: $font-s-base;
    			line-height: $font-s-base;
    			color: $primary;
    			margin-right: 20rpx;
    		}
    		.dept{
				flex: 1;
    			line-height: 30rpx;
    			color: $text-color-grey;
    			margin-left: 20rpx;
				white-space: nowrap;
				overflow: hidden;
			  text-overflow: ellipsis;
    		}
    		.rd-position{
    			margin-left: 20rpx;
    			font-size: $font-s-base;
    			line-height: $font-s-base;
    			color: $text-color-grey;
    		}
    	}
    	.rd-type-right{
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
    	.price{
    		color: $text-color-money;
    	}
		.number-count{
			color: $text-color-grey;
			font-size: $font-s-base;
			line-height: $font-s-base;
			margin-left: 12rpx;
			.count{
				font-size: $font-s-base;
				line-height: $font-s-base;
				color: $primary;
			}
		}
    	.u-btn{
    		line-height: 48rpx;
    		height: 48rpx;
    		font-size:$font-s-sm;
    	}
    }
</style>
