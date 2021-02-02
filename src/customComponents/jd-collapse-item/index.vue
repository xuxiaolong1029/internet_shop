<template>
	<view :class="{ 'uni-collapse-cell--disabled': disabled,'uni-collapse-cell--notdisabled': !disabled, 'uni-collapse-cell--open': isOpen,'uni-collapse-cell--hide':!isOpen }"
	 class="uni-collapse-cell" :style="customStyle">
		<view class="uni-collapse-cell__title" :style="contentStyle" @click="onClick">
			<image v-if="thumb" :src="thumb" class="uni-collapse-cell__title-img" />
			<view class="uni-collapse-cell__title-icons" v-if="iconsName">
				<u-icon :name="iconsName" :color="iconsColor" :size="iconsSize" ></u-icon>
			</view>
			<text class="uni-collapse-cell__title-text">{{ title }}</text>
			<view class="uni-collapse-cell__title-value" :style="valueStyle" v-if="value">{{ value }}</view>
			<!-- #ifdef MP-ALIPAY -->
			<view :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }"
			 class="uni-collapse-cell__title-arrow">
				<uni-icons color="#C4C4C4" size="14" type="arrowdown" />
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<u-icon name="arrow-down" color="#C4C4C4" size="24" :class="{ 'uni-collapse-cell__title-arrow-active': isOpen, 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__title-arrow"></u-icon>
			<!-- #endif -->
		</view>
		<view :class="{'uni-collapse-cell__content--hide':!isOpen}" class="uni-collapse-cell__content">
			<view :class="{ 'uni-collapse-cell--animation': showAnimation === true }" class="uni-collapse-cell__wrapper" :style="{'transform':isOpen?'translateY(0)':'translateY(-50%)','-webkit-transform':isOpen?'translateY(0)':'translateY(-50%)'}">
				<slot />
			</view>
		</view>
		<u-line :color="lineColor" v-if="showLine"></u-line>
	</view>
</template>

<script>
	export default {
		name: 'JdCollapseItem',
		props: {
			iconsName: {
				// 图标类型
				type: String,
				default: ''
			},
			iconsSize: {
				// 图标大小
				type: String,
				default: '32'
			},
			iconsColor: {
				// 图标颜色
				type: String,
				default: '#3071EA'
			},
			title: {
				// 列表标题
				type: String,
				default: ''
			},
			value: {
				// 列表值
				type: String,
				default: ''
			},
			name: {
				// 唯一标识符
				type: [Number, String],
				default: 0
			},
			disabled: {
				// 是否禁用
				type: Boolean,
				default: false
			},
			showAnimation: {
				// 是否显示动画
				type: Boolean,
				default: false
			},
			open: {
				// 是否展开
				type: Boolean,
				default: false
			},
			thumb: {
				// 缩略图
				type: String,
				default: ''
			},
			showLine: {
				// 是否显示底部边线
				type: Boolean,
				default: false
			},
			lineColor: {
				// 线条颜色
				type: String,
				default: '#D9D9D9'
			},
			customStyle:{
				type:Object,
				default:()=>{}
			},
			contentStyle:{
				type:Object,
				default:()=>{}
			},
			valueStyle:{
				type:Object,
				default:()=>{}
			},
		},
		data() {
			return {
				isOpen: false
			}
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (String(this.collapse.accordion) === 'true') {
				if (this.isOpen) {
					let lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
					if (lastEl) {
						this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
					}
				}
			}
		},
		methods: {
			onClick() {
				if (this.disabled) {
					return
				}
				if (String(this.collapse.accordion) === 'true') {
					this.collapse.childrens.forEach(vm => {
						if (vm === this) {
							return
						}
						vm.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
				this.collapse.onChange && this.collapse.onChange()
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';

	.uni-collapse-cell {
		flex-direction: column;
	}

	.uni-collapse-cell--hover {
		background-color: $uni-bg-color-hover;
	}

	.uni-collapse-cell--open {
		background-color: $white;
	}

	.uni-collapse-cell--disabled {
		background-color: $uni-bg-color-hover;
		// opacity: 0.3;
	}


	.uni-collapse-cell--hide {
		/* height: 48px; */
	}

	.uni-collapse-cell--animation {
		// transition: transform 0.3s ease;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.uni-collapse-cell__title {
		padding: 0 30rpx;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		height: 88rpx;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-collapse-cell__title:active {
		background-color: $uni-bg-color-hover;
	}

	.uni-collapse-cell__title-img {
		height: $uni-img-size-base;
		width: $uni-img-size-base;
		margin-right: 10rpx;
	}
	.uni-collapse-cell__title-icons{
		height: 28rpx;
		width: 28rpx;
		display: flex;
		justify-content: center;
		margin-right: 10rpx;
	}

	.uni-collapse-cell__title-arrow {
		// width: 20px;
		// height: 20px;
		transform: rotate(0deg);
		transform-origin: center center;
		margin-right: 4rpx;
		margin-left: 8rpx;
	}

	.uni-collapse-cell__title-arrow-active {
		transform: rotate(180deg);
	}

	.uni-collapse-cell__title-text {
		flex: 1;
		font-size: $uni-font-size-base;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		color: $text-color;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.uni-collapse-cell__title-value{
		width: 150rpx;
		flex-shrink: 0;
		flex-wrap: 0;
		font-size: $font-s-base;
		color: $text-color-grey;
		text-align: right;
	}

	.uni-collapse-cell__content {
		overflow: hidden;
	}

	.uni-collapse-cell__wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-collapse-cell__content--hide {
		height: 0px;
		line-height: 0px;
	}
</style>
