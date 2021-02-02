<template>
	<view :style="listStyle" class="list-wrapper">
		<view v-if="title" class="title" :class="[titleBorder&& 'title-border','size-'+titleSize]">{{title}}</view>
		<slot />
	</view>
</template>

<script>
	export default {
		props:{
			listStyle:{
				type:String,
				default:''
			},
			title:{
				type:String,
				default:''
			},
			titleBorder:{
				type:Boolean,
				default:true
			},
      titleSize:{
        type:String,
        default:''
      }
		},
		data() {
			return {

			}
		},
		created() {
		},
		methods: {
      submit(){

      }
		}
	}
</script>

<style lang="scss" scoped>
	.list-wrapper{
		background-color: #ffffff;
		padding: 30rpx;
		.title{
			font-family: $font-family-B;
			font-size: $font-s-lg;
			line-height: 3;
			color: $text-color;
			padding-left: 40rpx;
      &.size-md{
        font-size: $font-s-base;
        line-height: 2.5;
      }
			&.title-border{
				border-bottom: 1rpx solid #ebebeb;
			}
		}
	}
</style>
