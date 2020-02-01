import axios from "axios";
import md5 from "react-native-md5";
import { curdate } from "./utils/helper";
import querystring from "querystring";

// const url = 'https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb'; //dev
const url = 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb'; //live
const url2 = 'https://magenpos.posindonesia.co.id:5870/a767e8eec95442bda80c4e35e0660dbb'
let config = {	
	headers: { 
  		'content-type': 'application/x-www-form-urlencoded',
  		'accept': 'application/json'
  	},
  	auth: {
		username: 'ecom',
		password: '05144f4e12aaa402aeb51ef2c7dde527'
	}
} 

const getHasing = (messtype, param1) => {
	const key1 = 'c67536e59042f4f7049d441a3a5f71e1';
	const key2 = 'cd187b9bff4a84415908698f9793098d';
	const hash = md5.hex_md5(key1+curdate()+messtype+param1+key2);
	return hash;
}

export default{
	registrasi: {
		cekKtp: (nik) =>
			axios.post(url, {
				messtype: '201',
				param1: nik,
				userid: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				hashing: getHasing('201',nik)
			}, config).then(res => {
				if (res.data.rc_mess === '00') {
					return res.data;
					console.log(res.data);
				}else{
					console.log(res.data);
					return Promise.reject(res.data);
				}
			}),
		validasiRekening: (rek) => 
			axios.post(url, {
				messtype: '202',
				param1: rek,
				userid: '',
				hashing: getHasing('202', rek)
			}, config).then(res => {
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data);
				}
			}),
		registrasiNoGiro: (payload) =>
			axios.post(url, {
				messtype: '204',
				param1: payload.params1,
				userid: '',
				param2: payload.params2,
				param3: payload.params3,
				param4: '',
				param5: '',
				hashing: getHasing('204', payload.params1)
			}, config).then(res => {
				// console.log(res);
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data)
				}
			}),
		registrasiGiro: (payload) =>
			axios.post(url, {
				messtype: '203',
				param1: payload.param1,
				userid: '',
				param2: payload.param2,
				param3: payload.param3,
				param4: payload.param4,
				param5: '',
				hashing: getHasing('203', payload.param1)
			}, config).then(res => {
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data)
				}
			}),
		lupaPin: (payload) => axios.post(url, {
			messtype: '207',
			param1: payload.param1,
			hashing: getHasing('207', payload.param1)
		}, config).then(res => {
			console.log(res);
			if (res.data.rc_mess === '00' || res.data.rc_mess === '02' || res.data.rc_mess === '01') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		registrasiNonMember: (payload) => axios.post(url2, {
			messtype: '250',
			param1: payload.param1,
			param3: payload.param3,
			param4: payload.param4,
			hashing: getHasing('250', payload.param1)
		}, config).then(res => {
			if (res.data.rc_mess === '00') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		})
	},
	laporan: {
		rekKoran: (rek) =>
			axios.post(url, {
				messtype: '206',
				param1: rek,
				hashing: getHasing('206', rek)
			}, config).then(res => res.data)
	},
	search: {
		rekening: (rek) =>
			axios.post(url, {
				messtype: '206',
				param1: rek,
				param2: rek,
				hashing: getHasing('206', rek)
			}, config).then(res => {
				if (res.data.rc_mess === '000') {
					return res.data;
				}else{
					return Promise.reject(res);
				}
			})
	},
	qob: {
		getAlamat: (searchTerm) => 
			axios.post('https://profilagen.posindonesia.co.id/agen.com/index.php/getkodepos/kodepos_api', 
				querystring.stringify({ 
					searchTerm: searchTerm
				})
			).then(res => res.data),
		getTarif: (payload) => axios.post(url, {
			messtype: '703',
			param1: `#1#1#${payload.kodePosA}#${payload.kodePosB}#${payload.berat}#0#0#0#0#${payload.nilai}`,
			param2: '',
			param3: '',
			param4: '',
			param5: '',
			hashing: getHasing('703', `#1#1#${payload.kodePosA}#${payload.kodePosB}#${payload.berat}#0#0#0#0#${payload.nilai}`)
		}, config).then(res => {
			const { rc_mess } = res.data;
			if (rc_mess === '00') {
				return res.data.response_data1.substring(2);
			}else{
				return Promise.reject(res.data);
			}
		}),
		booking: (payload) => axios.post(url, {
				messtype: '302',
				param1: payload.param1,
				param2: payload.param2,
				param3: payload.param3,
				param4: payload.param4,
				param5: payload.param5,
				hashing: getHasing('302', payload.param1)
			}, config)
			.then(res => {
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					// const paramsss = {
					// 	messtype: '302',
					// 	param1: payload.param1,
					// 	param2: payload.param2,
					// 	param3: payload.param3,
					// 	param4: payload.param4,
					// 	param5: payload.param5,
					// 	hashing: getHasing('302', payload.param1)
					// };
					// console.log(res.data);
					// console.log(paramsss);
					return Promise.reject(res.data);
			}
		}),
		listOrder: (payload) => axios.post('https://qcomm.posindonesia.co.id:10444/getreport',{
				sp_nama: payload.sp_nama,
				par_data: payload.par_data,
				hashing: getHasing('ecom', payload.sp_nama , payload.par_data)
			},config).then(res => {
					if (res.data.jmldata > 0){
						return res.data;
					}else{
						return Promise.reject(res.data);
					}
			}),
		lacakKiriman: (extId) => 
			axios.post('https://order.posindonesia.co.id/api/lacak', 
				{ barcode: extId}, 
				{ headers: {'Content-Type': 'application/json'}}).then(res => res.data.result)
	},
	Pembayaran: {
		generate: (payload) =>
			axios.post(url, {
				messtype: '205',
				param1: payload.param1,
				hashing: getHasing('205', payload.param1)
			}, config).then(res => {
				// console.log(res.data);
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data);
				}
			})
	},
	auth: {
		login: (payload, userid) => axios.post(userid.substring(0, 3) === '540' ? url2 : url, {
			messtype: '200',
			param1: payload.param1,
			hashing: getHasing('200', payload.param1)
		}, config).then(res => {
			if (res.data.rc_mess === '00') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		verifikasi: (payload) => axios.post(url, {
			messtype: '211',
			param1: payload.param1,
			hashing: getHasing('211', payload.param1)
		}, config).then(res => {
			if (res.data.rc_mess === '00') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		genpwdweb: (userid) => axios.post(url,{
			messtype: '213',
			param1: userid,
			hashing: getHasing('213', userid)
		},config).then(res => {
			if (res.data.rc_mess === '00') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		})
	},
	user: {
		getDetail: (userid) => axios.post(url, {
			messtype: '210',
			param1: userid,
			hashing: getHasing('210', userid)
		}, config)
		.then(res => {
			const { rc_mess } = res.data;
			if (rc_mess === '00') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		})
	}
}