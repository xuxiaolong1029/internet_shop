<template>
	<!-- 选择医院 -->
	<view class="select-hospital page-top-border">
		<view class="search-default">
			<u-search v-model="searchValue" @change="change" @custom="custom" @search="search" shape="square" :clearabled="true"
			:show-action="false" placeholder="请输入科室/医生/疾病/症状" @clear="clear"></u-search>
		</view>
		<view class="link">
			<u-cell-item center :is-link="true" title="就诊记录" value="快速预约复诊" index="就诊记录" @click="clickLink" :arrow="true" >
			</u-cell-item>
		</view>
		<view class="hospital-container page-top-border">
			<hospital-item v-for="(item,index) in hispitalList" :key='index' :itemData="item" @changeHospital="changeHospital"></hospital-item>
		</view>
	</view>
</template>

<script>
	import hospitalItem from '../components/hospital-item/index.vue';
	
	export default {
		name: 'selectHospital',
		components: {
			hospitalItem
		},
		data() {
			return {
				searchValue: '',
				hispitalList:[
					{ img:'',title:'深圳大学总医院',distance: 82,level: '三甲',hospitalType: '儿童医院',addr: '深圳市南山区西丽街道深圳市南山区西丽街道'},
					{ img:'',title:'深圳市龙华医院',distance: 204,level: '三级',hospitalType: '综合医院',addr: '深圳市南山区西丽街道'},
					{ img:'',title:'深圳市南山医院协和深圳医院',distance: 237,level: '三甲',hospitalType: '妇幼医院',addr: '深圳市南山区西丽街道'},
					{ img:'',title:'深圳市第二人民医院',distance: 670,level: '三甲',hospitalType: '儿童医院',addr: '深圳市南山区西丽街道'},
				]
			};
		},
		methods: {
			change(value) {
				// 搜索框内容变化时，会触发此事件
				console.log(value);
			},
			custom(value) {
				console.log('输入值为：' + value);
			},
			search(value) {
				console.log('搜索内容为：' + value);
				this.$u.toast('搜索内容为：' + value)
			},
			clear() {
				console.log(this.searchValue);
			},
			clickLink(index) {
				//跳转到就诊记录
			},
			changeHospital(item){
				console.log('医院：',item)
				uni.navigateTo({
					url: '/pages/register/selectDepartment/index'
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.select-hospital{
		.link{
			background: #FFFFFF;
			margin-top: 20rpx;
			/deep/ {
				.u-cell{
					padding: 16rpx 30rpx;
					line-height: 56rpx;
				}
				.u-border-bottom:after{
					border: none;
				}
				.u-cell_title{
					color: $text-color;
					font-size: $font-s-lg;
				}
				.u-cell__value {
					color:$primary;
					font-size: $font-s-base;
				}
				.u-cell__right-icon-wrap{
					margin-left: 2rpx;
				}
				.u-cell__right-icon-wrap .u-icon__icon{
					color: #d9d9d9;
				}
			}
		}
		.hospital-container{
			background-color: #FFFFFF;
			padding: 0rpx 30rpx;
		}
	}
</style>
