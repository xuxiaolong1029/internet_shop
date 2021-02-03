export const NODE_ENV=process.env.NODE_ENV
export const VUE_APP_ENV=process.env.VUE_APP_ENV

export const AL_PAY_APP_ID = 'wxa1660ef45d13c923';
export const TIME_TYPE_OBJ = {d:'天',h:'小时',m:'分钟'}

//卡类型
export const CARD_TYPE_NAME={
    '01':"就诊卡",
    '02':"社保卡",
    '03':"健康卡",
    '04':"市民卡",
    '05':"住院号",
    '06':"身份证",
    '07':"虚拟门诊卡",
    '08':"虚拟卡住院",
    '09':"患者号",
    '10':"医保卡",
    '11':"一卡通",
    '12':"电子健康卡",
}
//挂号状态
export const REGISTER_STATUS={
    "PAY_INIT":{value:"PAY_INIT",label:"待支付"},
    "PAY_PROCESSING":{value:"PAY_PROCESSING",label:"支付中"},
    "PAY_SUCCEED":{value:"PAY_SUCCEED",label:"已支付"},
    "PAY_FAILED":{value:"PAY_FAILED",label:"支付失败"},
    "PAY_UNKNOWN":{value:"PAY_UNKNOWN",label:"支付异常"},
    "REGIST_PROCESSING":{value:"REGIST_PROCESSING",label:"挂号处理中"},
    "REGIST_SUCCEED":{value:"REGIST_SUCCEED",label:"挂号成功"},
    "REGIST_FAILED":{value:"REGIST_FAILED",label:"挂号失败"},
    "REGIST_UNKNOWN":{value:"REGIST_UNKNOWN",label:"挂号异常"},
    "CANCEL_PROCESSING":{value:"CANCEL_PROCESSING",label:"取消中"},
    "CANCEL_SUCCEED":{value:"CANCEL_SUCCEED",label:"已取消"},
    "CANCEL_FAILED":{value:"CANCEL_FAILED",label:"取消失败"},
    "CANCEL_UNKNOWN":{value:"CANCEL_UNKNOWN",label:"取消异常"},
    "REFUND_INIT":{value:"REFUND_INIT",label:"待退款"},
    "REFUND_PROCESSING":{value:"REFUND_PROCESSING",label:"退款中"},
    "REFUND_SUCCEED":{value:"REFUND_SUCCEED",label:"取消中"},
    "REFUND_FAILED":{value:"REFUND_FAILED",label:"取消失败"},
    "REFUND_UNKNOWN":{value:"REFUND_UNKNOWN",label:"退款异常"},
    "CLOSE_PROCESSING":{value:"CLOSE_PROCESSING",label:"关闭中"},
    "CLOSE_SUCCEED":{value:"CLOSE_SUCCEED",label:"关闭成功"},
    "CLOSE_FAILED":{value:"CLOSE_FAILED",label:"关闭失败"},
    "CLOSE_UNKNOWN" :{value:"CLOSE_UNKNOWN",label:"关闭异常"},
    "FETCH_SUCCEED":{value:"FETCH_SUCCEED",label:"已取号"},
    "RETURN_SUCCEED":{value:"RETURN_SUCCEED",label:"已退号"},
    "COMPLETED":{value:"COMPLETED",label:"已完成"}
};

// 挂号支付状态
export const REGIST_PAY_STATUS={
    'PAY_INIT':{label:'待支付',value:'PAY_INIT'},
    'PAY_PROCESSING':{label:'支付中',value:'PAY_PROCESSING'},
    'PAY_SUCCEED':{label:'已支付',value:'PAY_SUCCEED'},
    'PAY_FAILED':{label:'支付失败',value:'PAY_FAILED'},
    'PAY_UNKNOWN':{label:'支付异常',value:'PAY_UNKNOWN'},
    'REFUND_SUCCEED':{label:'退款成功',value:'REFUND_SUCCEED'},
    'REFUND_FAILED':{label:'退款失败',value:'REFUND_FAILED'},
    'REFUND_UNKNOWN':{label:'退款异常',value:'REFUND_UNKNOWN'}
};

// 缴费支付状态
export const PAY_STATUS={
    'PAY_INIT':{label:'待支付',value:'PAY_INIT'},
    'PAY_PROCESSING':{label:'支付中',value:'PAY_PROCESSING'},
    'PAY_UNKNOWN':{label:'支付异常',value:'PAY_UNKNOWN'},
    'FEE_PROCESSING':{label:'缴费中',value:'FEE_PROCESSING'},
    'FEE_SUCCEED':{label:'缴费成功',value:'FEE_SUCCEED'},
    'FEE_UNKNOWN':{label:'缴费异常',value:'FEE_UNKNOWN'},
    'FEE_FAILED':{label:'缴费失败',value:'FEE_FAILED'},
    'REFUND_PROCESSING':{label:'退款中',value:'REFUND_PROCESSING'},
    'REFUND_SUCCEED':{label:'退款成功',value:'REFUND_SUCCEED'},
    'REFUND_FAILED':{label:'退款失败',value:'REFUND_FAILED'},
    'REFUND_UNKNOWN':{label:'退款异常',value:'REFUND_UNKNOWN'}
};

export const DEPT_LAST = { yes:'Y', no:'N' }
export const APM = { '1':'上午', '2':'下午' }
export const NUM_TYPE = { '1':'特诊','2':'副高' }
// 科室级别
export const DEPT_LEVEL={
    '1':{label:'国', level:'国家级'},
    '2':{label:'省', level:'省级'},
    '3':{label:'市', level:'市级'},
    '4':{label:'区', level:'区县级'},
    '5':{label:'院', level:'院级'}
}
export const REGIST_TYPE = {
    'REGIST_PRE':'预约',
    'REGIST_DAY':'挂号' ,
}

//证件类型
export const CARD_TYPE =[
    {label:'身份证',value:'01'},
    {label:'居民户口簿',value:'02'},
    {label:'护照',value:'03'},
    {label:'军官证',value:'04'},
    {label:'驾驶证',value:'05'},
    {label:'港澳通行证',value:'06'},
    {label:'台湾通行证',value:'07'},
    {label:'出生医学证明',value:'08'},
    {label:'其他有效证件',value:'99'}
]

// 建档类型
export const STAFF_TYPE =[
    {label:'在线建档',value:0},
    {label:'医保建档',value:1},
]
// 用户与就诊人关系
export const RELATION_TYPE ={
    1:'本人',
    2:'亲友',
    3:'配偶',
    4:'儿子',
    5:'女儿',
    6:'孙子女',
    7:'父母',
    8:'长辈',
    9:'兄弟姐妹',
    10:'朋友',
    11:'其他',
}

// 性别
export const SEX_MAN = 'M';
export const SEX_WOMAN = 'F';
