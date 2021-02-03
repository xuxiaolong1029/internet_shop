<template>
    <view class="search-page page-top-border">
        <view class="nav-search">
            <view class="search-wrapper">
                <u-search shape="square" focus search-icon-color="#BBBBBB" placeholder-color="#BBBBBB" :show-action="false" placeholder="请输入科室/医生/疾病/症状" :inputStyle="{marginLeft:-2}" v-model="searchKey" @search="searchResult" @clear="clear" />
            </view>
            <view class="gap-wrapper">
                <u-gap height="20" bg-color="#f4f4f4" />
            </view>
        </view>
        <view class="content-wrapper" :style="{opacity:isShowContent ? 1 : 0}">
            <view class="jd-tabs-wrapper">
                <u-tabs
                        ref="tabs"
                        active-color="#3071EA"
                        inactive-color="#333"
                        bar-height="4"
                        :bar-style="{backgroundColor:'#3071ea'}"
                        :list="tabList"
                        :is-scroll="false"
                        :current="tabsValue"
                        @change="tabsChange" />
            </view>
            <view v-show="tabsValue===0">
                <view style="margin-top: 20rpx" v-show="deptList.length">
                    <u-cell-group >
                        <u-cell-item @click="cellClick(item)" arrow
                                     :title="item.deptName" v-for="item in deptList"
                                     :key="item.id" :title-style="{
                                 color:'#333'
						}">
                        </u-cell-item>
                    </u-cell-group >
                </view>
                <jd-result v-if="!deptList.length" :marginTop="resultMarginTop" :text="holderText" :subtext="subtext" />
            </view>
             <view v-show="tabsValue===1 && isShowContent">
                <mescroll-body
                        ref="mescrollRef"
                        top="195"
                        @init="mescrollInit"
                        :up="upOption"
                        :down="downOption"
                        @up="getDoctorList">
                    <view class="doctor-wrapper" v-for="(item,index) in doctorList" :key="item.id">
                            <jd-register-doctor
                                    :doctorObj="item"
                                    @changeContent="appointment"
                                    @clickAppointment="appointment"
                            ></jd-register-doctor>
                    </view>
                </mescroll-body>
                 <jd-result v-if="!doctorList.length" :marginTop="resultMarginTop" :text="holderText" :subtext="subtext" />
            </view>
        </view>
        <jd-result v-if="!isShowContent && isSearch" :marginTop="resultMarginTop" :text="holderText" :subtext="subtext" />
    </view>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import jdRegisterDoctor from '@/viewComponents/jd-register-doctor'
    import jdResult from '@/customComponents/jd-result'
    import { mapState } from 'vuex'
    import config from '@/config'
    import { debounce } from '@/utils'
    const { common} = config
    export default {
        name: 'search-wrapper',
        mixins:[MescrollMixin],
        components:{
            jdRegisterDoctor,
            jdResult,
        },
        data(){
            return{
                searchKey:'',
                tabsValue:1,
                tabList: [{ name: '科室' }, { name: '医生'}],
                doctorList:[],
                isSearch:false,
                downOption:{
                    use:false // 是否下拉刷新
                },
                upOption:{
                    auto:false,
                    empty:{
                        use:false,
                    },
                    page:{
                        num:0,
                        size:10
                    },
                },
                holderText:'找不到匹配的结果',
                subtext:'请检查搜索关键词',
                deptList:[],
                resultMarginTop:'400',
            }
        },
        computed:{
            ...mapState(['orgCode']),
            isShowContent(){
                return !!this.deptList.length || !!this.doctorList.length
            },
        },
        onReady(){
            /*
            const query = uni.createSelectorQuery().in(this);
            query.select('.nav-search').boundingClientRect(data => {
                this.top = data.height + 44 + 'px'
            }).exec();*/
        },
        watch:{
            searchKey:{
                handler:debounce(function (val) {
                    if(val){
                        this.searchResult()
                    }else {
                        this.initData()
                    }
                },800)
            }
        },
        methods:{
            /*下拉刷新的回调 */
            downCallback() {
                //联网加载数据
                console.log('downCallback')
            },
            clear(){
                this.initData()
            },
            initData(){
                this.doctorList = []
                this.deptList = []
                this.isSearch = false
            },
            async searchResult(){
                if(!this.searchKey) return uni.showToast({title:'请输入内容'})
                Promise.all([this.getDeptData(),this.mescroll.resetUpScroll()]).then(res=>{
                    if(this.deptList.length) {
                        this.tabsValue =0
                    }else if(this.doctorList.length){
                        this.tabsValue =1
                    }
                    this.$nextTick(()=>{
                        this.isSearch = true
                        // this.$refs.tabs.init()
                    })
                })
            },
            async getDeptData(){
                try {
                    const {result} = await this.$api.basedata_orgdept_list({
                        orgcode:this.orgcode,
                        searchKey:this.searchKey,
                        level:2
                    })
                    this.deptList = [...result] || []
                }catch (e) {
                    console.log(e)
                }

            },
            async getDoctorList(page){
                if(!this.searchKey) return
                try {
                    const {result={}} = await this.$api.basedata_orgemp_page_list({
                        orgCode:this.orgCode,
                        searchKey:this.searchKey,
                        deptCode:this.deptValue, // 部门
                        isExpert:1, // 员工类型（1.医生）
                        pageNo:page.num,
                        pageSize:page.size,
                    })
                    let records= result.records || []
                    this.doctorCodeList = records.map(item => item.empCode)
                    const doctorList = await this.getOrderDateList()

                    let list = this._filterDoctorData(records,doctorList)

                    this.mescroll.endSuccess(list.length,page.size === list.length);
                    if(page.num === 1){
                        this.doctorList = []
                    }
                    this.doctorList = this.doctorList.concat(list)


                }catch (e) {
                    this.mescroll.endErr();
                }

            },
            _filterDoctorData(records=[],doctorList=[]){
                return records.map(item=>{
                    for(let doctorItem of doctorList){
                        if(doctorItem.doctorCode === item.empCode){
                            return {
                                id:item.id,
                                orgCode:item.orgCode,
                                deptCode:item.deptCode,
                                deptName:item.deptName,
                                empCode:item.empCode,
                                doctorName:item.name,
                                titleName:item.titleName,
                                registeredFee:item.registeredFee,
                                doctorStar:item.doctorStar,
                                acceptsAmount:item.acceptsAmount,
                                specialSkill:item.specialSkill || '',
                                doctorntroduce:item.doctorntroduce || '',
                                hasList:doctorItem.hasList || []
                            }
                        }
                    }
                })
            },
            async getOrderDateList(){
                const {doctorList=[]} = await this.$api.ihosp_doctor_sch_date_list({
                    orgCode:this.orgCode,
                    doctorCodeList:this.doctorCodeList,
                })
                return doctorList
            },
            tabsChange(val){
                this.tabsValue = val
            },
            appointment(item){
                const {orgCode,empCode,deptCode,deptName} = item
                this.$u.route({
                    url:'/pages/register/doctorPage/index',
                    params:{
                        orgCode:orgCode,
                        doctorCode:empCode,
                        deptCode:deptCode,
                        deptName:deptName,
                        deptLast:common.DEPT_LAST.yes
                    }
                })
            },
            cellClick(item){
                this.$u.route({
                    url:'/pages/register/selectDoctor/index',
                    params:{
                        deptId:item.id,
                        orgCode:item.orgCode,
                        deptCode:item.deptCode,
                        deptName:item.deptName,
                        deptLast:common.DEPT_LAST.yes
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @mixin fixed($top:0rpx){
        position: fixed;
        left: 0;
        right: 0;
        top: $top;
    }
    .nav-search{
        @include fixed;
        z-index: 10000;
    }
    .search-wrapper{
        padding:16rpx 16rpx;
        background: $white;
    }
    .jd-tabs-wrapper{
        @include fixed(116rpx);
        /*margin-top: 80rpx;*/
        margin-top: 0;
        z-index: 10000;
    }
    .content-wrapper{
        /*margin-top: 10px;*/
    }

    .doctor-wrapper{
        padding: 30rpx;
        background: $white;
        border-top: 1px solid $u-border-color;
    }
</style>
