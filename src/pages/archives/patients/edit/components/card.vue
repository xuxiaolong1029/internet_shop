<template>
    <view class="card-wrapper">
        <view class="card-i-w" v-for="(item,index) in cardInfoList" :key="item.cardNo">
            <jd-card-item type="patients" :item="item" :height="240"/>
            <view class="flex-r-sb-center btn-wrapper" style="width: 75px">
                <jd-icon-btn @onClick="deleteAction(index)" name="trash" type="info"/>
                <jd-icon-btn @onClick="editAction(index)" name="edit-pen" type="info"/>
            </view>
        </view>
        <view class="link-w">
            <link-icon-btn @onClick="addCard">添加</link-icon-btn>
        </view>
    </view>
</template>

<script>
    import jdCardItem from '@/customComponents/jd-card-item'
    import jdIconBtn from '@/customComponents/jd-button/icon-btn'
    import linkIconBtn from '@/customComponents/jd-button/link-icon-btn'
    import config from '@/config'
    const {common} = config
    export default {
        name: 'card',
        components: {
            jdCardItem,
            jdIconBtn,
            linkIconBtn
        },
        props:{
            cardInfoList:{
                type:Array,
                default:()=>[]
            },
            name:{
                type:String,
                default:''
            },
            outpatientId:{
                type:String | Number,
                default:''
            }
        },
        data () {
            return {
            }
        },
        computed:{

        },
        methods: {
            addCard(){
                this.$u.route({
                    url:'/pages/archives/patients/bind/index',
                    params:{
                        outpatientId:this.outpatientId,
                        name:this.name,
                        type:'add'
                    }
                })
            },
            deleteAction(index){
                const item = this.cardInfoList[index]
                const {orgCode,outpatientId,cardId,cardType} = item
                const cardTypeLabel = common.CARD_TYPE_NAME[cardType]
                uni.showModal({
                    title:`确定要删除此${cardTypeLabel}吗？`,
                    content:'相关的挂号与缴费记录不会删除',
                    confirmText:'删除',
                    success:async(res)=>{
                        if (res.confirm) {
                            await this.$api.user_card_delete({
                                orgCode,
                                outpatientId,
                                cardId
                            })
                            uni.showToast({title:'删除成功'})
                            this.$emit('updateCard')
                        }
                    }
                })
            },
            editAction(index){
                const item = this.cardInfoList[index]
                this.$u.route({
                    url:'/pages/archives/patients/bind/index',
                    params:{
                        type:'edit',
                        name:item.outpatientName,
                        outpatientId:item.outpatientId,
                        cardNo:item.certNo,
                        cardType:item.cardType,
                        cardId:item.cardId
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .card-wrapper {
        padding: 10px 20rpx;
        .card-i-w {
            width: 100%;
            margin-bottom: 10px;
            position: relative;

            .btn-wrapper {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .link-w{
            margin-top: 20px;
        }
    }
</style>
