// 自费支付类型
export const SELF_TYPE={
    "BARPAY":{"code":"BARPAY", "name":"付款码支付"},
    "WAVEPAY":{"code":"WAVEPAY", "name":"声波支付"},
    "FACEPAY":{"code":"FACEPAY", "name":"人脸支付"},
    "SCANPAY":{"code":"SCANPAY", "name":"扫码支付"},
    "APPPAY":{"code":"APPPAY", "name":"手机APP支付"},
    "H5PAY":{"code":"H5PAY", "name":"手机H5支付"},
    "OPENIDPAY":{"code":"OPENIDPAY", "name":"公众号支付"},
    "LIVEIDPAY":{"code":"LIVEIDPAY", "name":"生活号支付"},
    "APPLETPAY":{"code":"APPLETPAY", "name":"小程序支付"}
}
// 自费支付方式
export const SELF_OPTION={
    "AliPay":{"code":"AliPay", "name":"支付宝支付"},
    "WxPay":{"code":"WxPay", "name":"微信支付"},
    "UnionPay":{"code":"UnionPay", "name":"银联云闪付"},
    "AbcPay":{"code":"AbcPay", "name":"农行聚合支付"}
}

// 医保支付类型
export const INSU_TYPE={
    "CARDNO":{"code":"CARDNO", "name":"社保卡号"},
    "QRCODE":{"code":"QRCODE", "name":"社保二维码"}
}

// 医保支付方式
export const INSU_OPTION={
    "AliInsu":{"code":"AliInsu", "name":"支付宝医保凭证"},
    "WxInsu":{"code":"WxInsu", "name":"微信医保凭证"},
    "WxIess":{"code":"WxIess", "name":"微信电子社保卡"}
}

// 终端类型
export const TERMINAL_TYPE={
    "APP":{"code":"APP", "name":"手机APP"},
    "WX_MP":{"code":"WX_MP", "name":"微信公众号"},
    "WX_OP":{"code":"WX_OP", "name":"人脸支付"},
    "ALI_MP":{"code":"ALI_MP", "name":"支付宝小程序"},
    "ALI_OP":{"code":"ALI_OP", "name":"支付宝生活号"},
    "H5":{"code":"H5", "name":"网页"}
}

// 终端编号
export const TERMINAL_ID={
    "A_01":{"code":"a01", "name":"待定终端编号"}
}

// 来源方
export const SOURCE={
    "REGIST":{"code":"REGIST", "name":"挂号"},
	"FEE":{"code":"FEE", "name":"缴费"}
}