<template>
	<view class='jd-tag'>
		<u-tag @click="tagClick" :customStyle="tagStyle" :size="size" :mode="mode" :shape="shape" :text="text" :type="type" :border-color="borderColor" :bg-color="bgColor" />
	</view>
</template>

<script>
	export default{
		props:{
			size:{
				type:String,
				default:'mini' // default mini
			},
			shape:{
				type:String,
				default:'circle'
			},
			text:{
				type:String,
				default:''
			},
			type:{
				type:String,
				default:'primary'
			},
			borderColor:{
				type:String,
				default:''
			},
			mode:{
				type:String,
				default:'light'
			},
			fontSize:{
				type:[Number | String],
				default:''
			},
			customStyle:{
				type:Object,
				default:()=>{}
			},
			bgColor: {
				type: String,
				default: ''
			},
		},
		computed:{

		},
		methods:{
			tagClick(){
				this.$emit('onClick')
			}
		}
	}
</script>

<style lang="scss">
</style>
