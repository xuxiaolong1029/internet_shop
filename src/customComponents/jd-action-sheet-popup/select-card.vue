<template>
    <jd-action-sheet-popup v-model="show"
                        mode="bottom"
                        borderRadius="20"
                        :showConfirmBtn="false"
                        :btnBorder="true"
                        btnBorder z-index="998">
        <template v-slot:top>
			<jd-cell-item
				:title="title"
				value="管理就诊卡"
				:itemStyle="{'background-color':'#ffffff'}"
				:titleStyle="{'font-size':'32rpx'}"
				:valueStyle="{color:'#3071EA'}"
				arrowColor="#3071EA" index="0"
				@clickItem="manageCard">
			</jd-cell-item>
        </template>
        <template v-slot:middle>
			<view class="srt-body" :style="{'height':scrollHeight}">
				<scroll-view class="scroll-view" scroll-y="true">
					<view class="srt-item" v-for="(item,index) in list" :key="index" @click="changeCard(item)">
						<view class="srt-left">
							<view class="type">{{ getCardTypeName(item.cardType) }}</view>
							<view class="current-icon" v-show="current == item.cardNo">
								<u-icon name="checkbox-mark" color="#3071EA" size="28"></u-icon>
							</view>
						</view>
						<view class="srt-right">
							<jd-tag text="医保" mode="light" type="primary" v-if="item.isInsuCard"/>
							<text style="margin-left: 8rpx;">{{item.cardNo}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
        </template>
    </jd-action-sheet-popup>
</template>

<script>
    import jdActionSheetPopup from '@/customComponents/jd-action-sheet-popup'
	import jdCellItem from '@/customComponents/jd-cell-item/index.vue';
	import jdTag from '@/customComponents/jd-tag/index'
	import config from '@/config'
    export default {
        name: 'jdSelectCard',
        components: {
            jdActionSheetPopup,jdCellItem,jdTag
        },
        props:{
			title: {
			    type: String,
			    default: '选择就诊卡'
			},
			current: {
			    type: [String,Number],
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
			getCardTypeName(type){
				return config.common.CARD_TYPE_NAME[type]
			},
            changeCard(item) {
                this.$emit('changeCard', item)
            },
			_toggleShow(){
			    this.show = !this.show
			},
			manageCard(){
				this.$emit('manageCard')
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
			overflow: hidden;
			font-size:$font-s-base;
			display: flex;
			width: 220rpx;
			flex-wrap: 0;
			flex-shrink: 0;
			padding-right: 20rpx;
			.type{
				color: $text-color;
			}
			.current-icon{
				margin-left: 10rpx;
			}
		}
		.srt-right{
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			overflow: hidden;
			text{
				font-size:$font-s-base;
				line-height: 28rpx;
				color: $text-color-grey;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>
