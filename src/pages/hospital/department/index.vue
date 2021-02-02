<template>
    <view class="department set-bg-com" :style="{backgroundImage: `url(${bgUrl})`}" >
        <u-card :show-head="false" :head-border-bottom="false" border-radius="20" :border="false" :body-style="bodyStyle">
            <view slot="body">
                <view class="search-wrapper">
                    <u-search shape="square" @clear="getDeptData" search-icon-color="#BBBBBB" placeholder-color="#BBBBBB" :show-action="false" placeholder="搜索科室" :inputStyle="{marginLeft:-2}" v-model="searchKey" @search="getDeptData"/>
                </view>
                <view class="dep-card-list">
                    <view @tap.stop="goDetail(item)" class="dep-card-list-i flex-c-center" v-for="(item,index) in deptList" :key="index">
                        <u-image width="60" height="60" :src="item.deptIcon || '/static/img/default-dept.png'" />
                        <text class="title">{{item.deptName}}</text>
                    </view>
                </view>
            </view>
        </u-card>

    </view>
</template>

<script>
    import doctorItem from '../components/doctor-item'
    import jdResult from '@/customComponents/jd-result'
    import mixinsBgUrl from '../mixins/bgUrl'
    import { mapState } from 'vuex'
    export default {
        name: 'department',
        mixins:[mixinsBgUrl],
        components:{doctorItem,jdResult},
        data() {
            return {
                searchKey: '',
                subTitle: '2020-05-15',
                shadowStyle:{
                    backgroundImage: "none",
                    paddingTop: 0,
                    marginTop: "20rpx"
                },
                bodyStyle:{padding:'20rpx'},
                closeText:'展开',
                openText:'收缩',
                src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
                deptList:[]
            };
        },
        onLoad(){
            this.getDeptData()
        },
        computed:{
            ...mapState(['orgCode'])
        },
        methods:{
            async getDeptData(){
                const {result=[]} = await this.$api.basedata_orgdept_list({
                    orgCode:this.orgCode,
                    searchKey:this.searchKey,
                    recommend:1
                })
                result.forEach(item=>{
                    if(item.deptName.length > 4){
                        item.deptName = item.deptName.substring(0,4) + '...'
                    }
                })
                this.deptList = result
            },
            goDetail(item){
                uni.navigateTo({
                    url:`./detail?id=${item.id}&deptCode=${item.deptCode}`,
                    success:()=>{
                        // uni.setStorage({
                        //     key:'deptInfo',
                        //     data:item
                        // })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .department{
        ::v-deep.u-cell{
            /*padding-left: 0;*/
            /*padding-right: 0;*/
        }
        .cont-text{
            line-height: 40rpx;
            /*margin-top: 10px;*/
        }

        .btn-wrapper{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .dep-card-list{
            box-sizing: border-box;
            margin-top: 10px;
            display:grid;
            grid-column-gap:19rpx;
            grid-row-gap:20rpx;
            grid-template-columns:1fr 1fr 1fr 1fr;
            .dep-card-list-i{
                width: 147rpx;
                height: 180rpx;
                background: #F5F7F9;
                border-radius: 5px;
                .title{
                    margin-top:15px;
                    color: $text-color-grey;
                }
            }
        }
    }
</style>
