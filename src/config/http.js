//#ifdef H5
export const API_URL = {
    production: '',
    test: '',
	development: ''
}
//#endif

//#ifndef H5
export const API_URL = {
	production: '',
	test: 'https://dmp-pc.clear-sz.com',
	development:'http://192.168.50.129:3002',// 'http://192.168.50.129:3002'
}
//#endif

export const IMG_HOST = {
	production: '',
	test:'https://dmp-pc.clear-sz.com',
	development:'http://192.168.50.129:3001', //'http://192.168.50.129:3001'
}
