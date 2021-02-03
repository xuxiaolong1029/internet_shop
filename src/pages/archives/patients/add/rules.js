import CONS from './config'

export default {

    data(){
        const cardRules =(type)=>{
            return [
                {required: true,message: '请输入证件号码', trigger: 'blur'},
                {
                    validator: (rule, value) =>{
                        if(type === 'patient' && this.isIdCardType){
                            return this.$u.test.idCard(value)
                        }else if(type === 'guardian' && this.isIdGuardianCertType){
                            return this.$u.test.idCard(value)
                        } else{
                            return true
                        }
                    },
                    message: '证件号不正确',
                    trigger: ['change','blur'],
                }
            ]
        }
        return{
            rules: {
                [CONS.PATIENT_CERT_NO]: cardRules('patient'),
                [CONS.GUARDIAN_CERT_NO]: cardRules('guardian'),
                [CONS.NAME]: [{required: true, message: '请输入姓名', trigger: ['change', 'blur']}],
            }
        }
    }
}
