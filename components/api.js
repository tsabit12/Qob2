import axios from "axios";
import md5 from "react-native-md5";
import { curdate } from "./utils/helper";

const url = 'https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb';
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

const getHasing = (messtype, nik) => {
	const key1 = 'c67536e59042f4f7049d441a3a5f71e1';
	const key2 = 'cd187b9bff4a84415908698f9793098d';
	const hash = md5.hex_md5(key1+curdate()+messtype+nik+key2);
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
				}else{
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
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data)
				}
			}),
		registrasiGiro: (payload) =>
			axios.post(url, {
				messtype: '203',
				param1: payload.params1,
				userid: '',
				param2: payload.params2,
				param3: payload.params3,
				param4: '',
				param5: '',
				hashing: getHasing('203', payload.params1)
			}, config).then(res => {
				if (res.data.rc_mess === '00') {
					return res.data;
				}else{
					return Promise.reject(res.data)
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
				hashing: getHasing('206', rek)
			}, config).then(res => {
				if (res.data.rc_mess === '000') {
					return res.data;
				}else{
					return Promise.reject(res);
				}
			}),
		provinsi: (provName) => 
			axios.post('https://order.posindonesia.co.id/api/Provinsi/getProv', {
				provinceName: provName
			}, {
				headers: {
					'content-type': 'application/json'
				}
			}).then(res => res.data.result)		
	}
}