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
        const phoneRules = this.$u.deepClone([
            {required: true,message: '选择输入手机号', trigger: 'blur'},
            {
                validator: (rule, value) => this.$u.test.mobile(value),
                message: '请输入正确的手机号',
                trigger: ['change','blur'],
            }
        ])
        return{
            rules: {
                [CONS.CERT_NO]: cardRules,
                [CONS.REAL_NAME]: [{required: true, message: '请输入姓名', trigger: ['change', 'blur']}],
                [CONS.ADDRESS]: [{required: true, message: '请输入地址', trigger: ['change', 'blur']}],
                [CONS.MOBILE]: phoneRules
            }
        }
    }
}
