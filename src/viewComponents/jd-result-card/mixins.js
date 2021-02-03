import config from '@/config'

const {common} = config
export default {
    data(){
        return{
            cardInfoList:[],
            outpatientList:[],
            patientsIndex:0,
            userInfo:uni.getStorageSync('userInfo')||{},
            orgName:'',
        }
    },
    created(){
        this.getHospitalData()
    },
    computed:{
        getPatient(){
            let outpatientItem = this.outpatientList[this.patientsIndex]
            return outpatientItem ? outpatientItem.outpatientName :
              (this.outpatientList.length ? this.outpatientList[0].outpatientName : '')
        },
        // 当前选择的卡是否有卡号
        isNotCardNo(){
            return this.outpatientList[this.patientsIndex] ? !!(this.outpatientList[this.patientsIndex].cardNo) : false
        },
        getPatientsTypeAndNo(){
            if(this.outpatientList.length){
                let item = this.outpatientList[this.patientsIndex]
                return `${common.CARD_TYPE_NAME[item.cardType] || ''} ${item.cardNo || ''}`
            }else {
                return  ''
            }
        }
    },
    methods:{
        togglePatientsPopup(){
            this.$refs.selectPatientsPopup._toggleShow()
        },
        async getMyPatientCard(orgCode){
            try {
                let {cardInfoList} = await this.$api.ihosp_my_patient_card({
                    orgCode:orgCode,
                    userId:this.userInfo.userId,
                });
                if(Array.isArray(cardInfoList)&&cardInfoList.length>0){
                    return Promise.resolve(cardInfoList)
                }else {
                    return Promise.resolve([])
                }
            }catch (e) {
                return Promise.reject(e)
            }
        },
        async getOutPatientList(cardInfoList){
            const data = await this.$api.outpatient_user_query({
                userId:this.userInfo.userId,
                sensitiveEncFlag: 0
            })
            if(Number(data.code)===200&&data.outpatientList){
                this.outpatientList=[]
                this.outpatientList = [...cardInfoList];
                for(let item of data.outpatientList){
                    //如果没用就诊卡
                    if(!item.hasCard){
                        this.outpatientList.push({
                            certNo:item.certNo,
                            certType:item.certType,
                            outpatientId:item.outpatientId,
                            outpatientName:item.name,
                        });
                    }
                }
            }
        },
        getHospitalData () {
            uni.getStorage({
                key: 'hospital_info',
                success: (res) => {
                    if (res.data) this.orgName = res.data.orgName
                }
            })
        },
        onPatientsHead(){
            console.log(333)
            this.$refs.selectPatientsPopup._toggleShow()
            this.$u.route({
                url: `/pages/archives/patients/add/index?backParams=outpatientId`
            })
        },
        resultBtn(){
            let item = this.outpatientList[this.patientsIndex]
            let params = {
                name:item.outpatientName,
                outpatientId:item.outpatientId,
            }
            if(this.isNotCardNo){

            Object.assign(params,{
                type:'edit',
                cardNo:item.cardNo,
                cardId:item.cardId,
                cardType:item.cardType,
            })
            } else {
                Object.assign(params,{
                    type:'add',
                })
            }
            this.$u.route({
                url:'/pages/archives/patients/bind/index',
                params
            })
        },
    }
}
