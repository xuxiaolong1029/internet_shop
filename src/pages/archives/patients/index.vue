<template>
    <view class="patients flex-c-center">
        <view class="wrapper flex-r-sb-center" v-for="(item,index) in outpatientList" :key="index">
            <view class="left flex-r">
                <u-avatar size="80" :src="item.headImgUrl" />
                <view class="sub-info flex-c-sb">
                    <text>{{item.name}}</text>
                    <jd-tag v-if="item.relation == 1"
                            :text="getRelation(item.relation)"
                            mode="light"
                            type="primary"
                    />
                    <text v-else class="sub-t">{{getRelation(item.relation)}}</text>
                </view>
            </view>
            <view class="right flex-r-sb-center">
                <jd-icon-btn @onClick="deleteItem(item,index)" name="trash" color="#333" />
                <jd-icon-btn @onClick="editItem(item)" name="edit-pen" color="#333" />
            </view>
        </view>
        <view class="bottom-control">
            <jd-button @submit="addPatients" highlightType="primary">添加就诊人</jd-button>
        </view>
        <jd-modal ref="jdModal"></jd-modal>
    </view>
</template>

<script>
    import jdIconBtn from '@/customComponents/jd-button/icon-btn'
    import jdButton from '@/customComponents/jd-button'
    import jdModal from '@/customComponents/jd-modal'
    import jdTag from '@/customComponents/jd-tag'
    import config from '@/config'
    const {common} = config
    export default {
        name: 'patients',
        components:{jdIconBtn,jdButton,jdModal,jdTag},

        data(){
            return{
                outpatientList:[],
            }
        },
        onLoad(){


        },
        onShow(){
            this.getList()
        },
        computed:{
            getRelation(){
                return function (val) {
                    if(!val) return ''
                    val = Number(val)
                    return common.RELATION_TYPE[val] || ''
                }
            }
        },
        methods:{
            async getList(){
                const userInfo = uni.getStorageSync('userInfo')
                const { outpatientList=[] } = await this.$api.outpatient_user_query({
                    userId:userInfo.userId,
                    sensitiveEncFlag: 0
                })
                this.outpatientList = outpatientList
            },
            addPatients(){
                this.$u.route({
                    url:'/pages/archives/patients/add/index',
                    params:{

                    }
                })

            },
            async deleteItem(item,index){
                this.$refs.jdModal._warning({
                    title:`删除就诊人`,
                    content:`删除<span class="primary">${item.name}</span>就诊人和卡信息`,
                    confirmText:'删除',
                    success:async(res)=>{
                        if (res.confirm) {
                            await this.$api.outpatient_info_remove({outpatientId:item.outpatientId})
                            this.outpatientList.splice(index,1)
                            uni.showToast({title:'删除成功'})
                        }
                    }
                })
            },
            async deleteAction(){

            },
            editItem(item){
                this.$u.route({
                    url:'/pages/archives/patients/edit/index',
                    params:item
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .patients{
        margin: 0 auto;
        padding-bottom: 50px;
        .wrapper{
            margin-top: 10px;
            padding: 30rpx;
            width: 94%;
            height:70px;
            background: $white;
            border-radius: 10px;
            .sub-info{
                margin-left: 20rpx;
                .sub-t{
                    color: $text-color-grey;
                }
                ::v-deep.u-size-mini {
                     font-size: 24rpx!important;
                     padding: 4rpx 8rpx!important;
                }
                ::v-deep.u-tag {
                     line-height: normal!important;
                }
            }
            .right{
                width: 120rpx;
            }
        }
        .bottom-control{
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
        }

    }

</style>
