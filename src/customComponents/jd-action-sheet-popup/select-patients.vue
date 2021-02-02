<template>
    <jd-action-sheet-popup v-model="show"
                        mode="bottom"
                        borderRadius="20"
                        :showConfirmBtn="false"
                        :btnBorder="true"
                        btnBorder z-index="998">
        <template v-slot:top>
			<view class="wrapper-title flex-r-sb-center">
				<text>{{title}}</text>
				<jd-link-icon-btn @onClick="titleRightClick">{{headRightTitle}}</jd-link-icon-btn>
			</view>
		</template>
        <template v-slot:middle>
			<view class="srt-body" :style="{'height':scrollHeight}">
				<scroll-view class="scroll-view" scroll-y="true">
					<jd-select-patients-list :list="list" :current="current" @chooseList="chooseList" />
				</scroll-view>
			</view>
        </template>
    </jd-action-sheet-popup>
</template>

<script>
    import jdActionSheetPopup from '@/customComponents/jd-action-sheet-popup'
	import jdCellItem from '@/customComponents/jd-cell-item/index.vue';
	import jdCard from '@/customComponents/jd-card/index.vue';
	import jdLinkIconBtn from '@/customComponents/jd-button/link-icon-btn';
	import jdSelectPatientsList from '@/viewComponents/jd-select-patients-list/index';
    export default {
        name: 'jdSelectCard',
        components: {
            jdActionSheetPopup,jdCellItem,jdCard,jdLinkIconBtn,jdSelectPatientsList
        },
        props:{
			title: {
			    type: String,
			    default: '我的就诊卡'
			},
			headRightTitle:{
				type: String,
				default: '添加就诊人'
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

			_toggleShow(){
			    this.show = !this.show
			},
			titleRightClick(){
				this.$emit('titleRightClick')
			},
			chooseList(index){
				this.$emit('chooseList',index)
			}
        }
    }
</script>

<style scoped lang="scss">

	.srt-body{
		background-color: #FFFFFF;
		flex: 1;
		overflow: hidden;
		padding-left:15px;
		margin-bottom: 20rpx;
		.scroll-view{
			height: 100%;
		}
	}
	.wrapper-title {
		height: 44px;
		padding:0 15px;
		border-bottom: 1px solid #d9d9d9;
		font-size: $font-s-lg;
		color: $text-color-grey;
		background: $white;
	}
</style>
