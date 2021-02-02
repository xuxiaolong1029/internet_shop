import CONS from './config'

export default {

    data(){
        const cardRules = this.$u.deepClone([
            {required: true,message: '请输入证件号码', trigger: 'blur'},
            {
                validator: (rule, value) =>{
                    if(this.isIdCardType) return this.$u.test.idCard(value)
                    else return true
                },
                message: '证件号不正确',
                trigger: ['change','blur'],
            }
        ])
        return{
            rules: {
                [CONS.PATIENT_CERT_NO]: cardRules,
                [CONS.NAME]: [{required: true, message: '请输入姓名', trigger: ['change', 'blur']}],
            }
        }
    }
}
