import axios from "axios";
import md5 from "react-native-md5";
import {
	getCurdate,
	getHashing
} from "./utils";

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
	})
}