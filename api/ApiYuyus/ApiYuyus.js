import axios from "axios";
import md5 from "react-native-md5";
import {
	getCurdate,
	getHashing
} from "./utils";

//dev 10555
//live 10444

const urlCityCourier = 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb';
const getOrderUrl = 'https://qcomm.posindonesia.co.id:10444/getOrder';
const url = 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb'; //live
// const url = 'https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb'; //dev

const config = {	
	headers: { 
  		'content-type': 'application/x-www-form-urlencoded',
  		'accept': 'application/json'
  	},
  	auth: {
		username: 'ecom',
		password: '05144f4e12aaa402aeb51ef2c7dde527'
	}
} 

export default{
	login: (payload, userid) => axios.post(url, {
		messtype: '216',
		param1: payload,
		hashing: getHashing('216', payload)
	}, config)
		.then(res => res.data)
		.catch(err => {
			if (err.response) {
				const errors = {
					global: 'Terdapat kesalahan, mohon coba beberapa saat lagi',
					status: err.response.status
				}
				return Promise.reject(errors);
			}else{
				const errors = {
					global: 'Network error',
					status: 500
				}
				return Promise.reject(errors);
			}
		}),
	generateToken: (userid) => axios.post(url, {
		messtype: '213',
		param1: userid,
		hashing: getHashing('213', userid)
	}, config).then(res => {
		if (res.data.rc_mess === '00') {
			return Promise.resolve(res.data);
		}else{
			const errors = {
				global: res.data.desk_mess
			}
			return Promise.reject(errors);
		}
	}),
	connectToGiro: (rek, userid) => axios.post(url, {
		messtype: '217',
		param1: rek,
		param2: userid,
		hashing: getHashing('217', rek)
	}, config).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	validateGiro: (param1) => axios.post(url, {
		messtype: '218',
		param1,
		hashing: getHashing('218', param1)
	}, config).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	bantuan: (param1, userid) => axios.post(url, {
		messtype: '220',
		param1,
		hashing: getHashing('220', param1)
	}, config).then(res => {
		if (res.data.rc_mess === '00' || res.data.rc_mess === '02' || res.data.rc_mess === '01') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	verifikasiBantuan: (param1, userid) => axios.post(url, {
		messtype: '221',
		param1: param1,
		hashing: getHashing('221', param1)
	}, config).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	searchRekeningType: (rekening) => axios.post(url, {
		messtype: '226',
		param1: rekening,
		hashing: getHashing('226', rekening)
	}, config).then(res => {
		if (res.data.rc_mess === '99') {
			const { response_data2 } = res.data;
			const value = response_data2.split("|");
			if (value[5] === 'GIROPOS REGULER') {
				if (parseInt(value[2]) < 10000) {
					const errors = {
						global: 'Fitur COD dinonaktifkan. Saldo rekening minimal adalah 10.000 ribu, silahkan lakukan top up terlebih dahulu'
					};
					return Promise.reject(errors);
				}else{
					return Promise.resolve(res.data);
				}
			}else{//invalid rekening type
				const errors = {
					global: 'Fitur COD dinonaktifkan. Harap hubungi CS untuk mengubah tipe rekening menjadi reguler'
				};
				return Promise.reject(errors);
			}
		}else{
			const { desk_mess } = res.data;
			const errors = {
				global: `Fitur COD dinonaktifkan. ${desk_mess}`
			};
			return Promise.reject(errors);
		}
	}),
	getTarif: (param1) => axios.post(url, {
		messtype: '703',
		param1,
		param2: '',
		param3: '',
		param4: '',
		param5: '',
		hashing: getHashing('703', param1)
	}, config)
	.then(res => {
		const { rc_mess } = res.data;
		if (rc_mess === '00') {
			return res.data.response_data1.substring(2);
		}else{
			const errors = {
				global: 'Tarif tidak ditemukan'
			};
			return Promise.reject(errors);
		}
	}),
	cityCourier: {
		getTarif: (payload) => axios.post(urlCityCourier, {
			messtype: '401',
			...payload,
			hashing: getHashing('401', payload.param1)
		}, config)
			.then(res => res.data),
		order: (payload) => axios.post(urlCityCourier, {
			messtype: '402',
			...payload,
			hashing: getHashing('402', payload.param1)
		}, config).then(res => res.data),
		getOrder: (userid) => axios.post(getOrderUrl, {
			userid: userid
		}, config).then(res => res.data),
		pembayaran: (userid, param2) => axios.post(urlCityCourier, {
			messtype: '403',
			param1: userid,
			param2,
			hashing: getHashing('403', userid)
		}, config)
			.then(res => {
				const { rc_mess, desk_mess } = res.data;
				if (rc_mess === '00') {
					return Promise.resolve(res.data);
				}else{
					const errors = {
						code: rc_mess,
						msg: desk_mess
					};
					return Promise.reject(errors);
				}
			}),
		cancle: (payload) => axios.post(urlCityCourier, {
			messtype: '405',
			param1: payload.userid,
			param2: payload,
			userid: payload.userid,
			hashing: getHashing('405', payload.userid)
		}, config).then(res => {
			if (res.data.rc_mess === '00') {
				return Promise.resolve(res.data);
			}else{
				const errors = {
					msg: res.data.desk_mess,
					status: res.data.rc_mess
				};

				return Promise.reject(errors);
			}
		})
	}
}