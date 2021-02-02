export default {
	state:{
		registerInfo: null,
		confirmInfo: null,
	},
	mutations:{
		setRegisterInfo: function (state, data) {
			state.registerInfo = data;
		},
		setConfirmInfo: function (state, data) {
			state.confirmInfo = data;
		},
	},
	actions:{
		
	}
}