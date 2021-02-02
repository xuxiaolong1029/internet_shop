<template>
	<view class="uni-numbox">
		<template v-if="inputValue > 0">
			<view  @click.stop="_calcValue('minus')" class="uni-numbox__minus">
				<!-- <text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }">-</text> -->
				<uni-icons type="minus" color="#3071ea" size="25"></uni-icons>
			</view>
<!--			 <input style="display: none" :disabled="disabled" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" />-->
			<text class="uni-numbox__value">{{inputValue}}</text>
		</template>

		<view @click.stop="_calcValue('plus')" class="uni-numbox__plus">
			<!-- <text class="uni-numbox--text" :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }">+</text> -->
			<uni-icons ref="plus" type="plus-filled" color="#3071ea" size="25"></uni-icons>
		</view>
	</view>
</template>
<script>
	/**
	 * NumberBox 数字输入框
	 * @description 带加减按钮的数字输入框
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=31
	 * @property {Number} value 输入框当前值
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 每次点击改变的间隔大小
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
	 */
	import {throttle} from '@/utils/util'
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			isCallBack:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			_calcValue:throttle(function(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					value -= step;
					if (value < (this.min * scale)) {
						return;
					}
					if (value > (this.max * scale)) {
						value = this.max * scale
					}
					if(this.isCallBack) return this.$emit('minus')
				} else if (type === "plus") {
					value += step;
					if (value > (this.max * scale)) {
						return;
					}
					if (value < (this.min * scale)) {
						value = this.min * scale
					}
					if(this.isCallBack) return this.$emit('plus')
				}
				this.inputValue = String(value / scale);
			},1000),
			// _calcValue(type) {
			// 	if (this.disabled) {
			// 		return;
			// 	}
			// 	const scale = this._getDecimalScale();
			// 	let value = this.inputValue * scale;
			// 	let step = this.step * scale;
			// 	if (type === "minus") {
			// 		value -= step;
			// 		if (value < (this.min * scale)) {
			// 			return;
			// 		}
			// 		if (value > (this.max * scale)) {
			// 			value = this.max * scale
			// 		}
			// 	} else if (type === "plus") {
			// 		value += step;
			// 		if (value > (this.max * scale)) {
			// 			return;
			// 		}
			// 		if (value < (this.min * scale)) {
			// 			value = this.min * scale
			// 		}
			// 	}
			// 	this.inputValue = String(value / scale);
			// },
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}
		}
	};
</script>
<style scoped lang="scss">
	/* #ifdef APP-NVUE */
	/* #endif */

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: flex-end;
		height: 35px;
		line-height: 35px;
		width: 100px;
	}

	.uni-numbox__value {
		display: inline-block;
		min-width: 50rpx;
		text-align: center;
			font-size: $font-s-lg;
			font-weight: bold;
			color: $text-color;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 35px;
		height: 35px;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 35px;
		height: 35px;
	}

	.uni-numbox--text {
		font-size: 40rpx;
		color: #333;
	}

	.uni-numbox--disabled {
		color: #c0c0c0;
	}
</style>
