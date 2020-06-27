import axios from "axios";

const url = 'https://order.posindonesia.co.id/api/Qposinaja';
const config = {
	headers: {
		'content-type': 'application/json'
	}
}

export default{
	qob: {
		booking: (payload) => axios.post(`${url}/addorder`, {
			...payload
		}, config).then(res => {
			if (res.data.respcode === '000') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		getDetailOrder: (payload) => axios.post(`${url}/detailOrder`, {
			...payload
		}).then(res => {
			if (!res.data.result.data) {
				return Promise.reject(res.data);
			}else{
				return res.data.result;
			}
		}),
		syncronizeUser: (payload) => axios.post(`${url}/sync`, {
			...payload
		}).then(res => {
			const { result } = res.data;
			console.log(result);
			if (result.respcode === '00') {
				return result;
			}else{
				return Promise.reject(result);
			}
		}),
		//sync saat generate web
		syncronizeUserPwd: (payload) => axios.post(`${url}/sync`, {
			...payload
		}).then(res => {
			const { result } = res.data;
			if (result.respcode === '00' || result.respcode === '21') {
				return result;
			}else{
				return Promise.reject(result);
			}
		}),
		updateStatus: (payload) => axios.post(`${url}/confirmPickup`, {
			...payload
		}).then(res => {
			if (!res.data) {
				return Promise.reject(res);
			}else{
				return res.data;
			}
		}),
		getHistoryStatus: (payload) => axios.post(`${url}/history`, {
			...payload
		}).then(res => {
			const { result } = res.data;
			if (!result.data) {
				return Promise.reject(result);
			}else{
				return result;
			}
		}),
		pushToken: (payload) => axios.post(`${url}/pushToken`, {
			...payload
		}).then(res => res.data)
	},
	user:{
		syncronizeCod: (payload) => axios.post(`${url}/syncGiro`, {
			...payload
		}).then(res => {
			const { result } = res.data;
			if (result.respcode === '00') {
				return result;
			//alerdy sync
			//case user was uninstall apps 
			}else if(result.respcode === '21'){
				return result;
			}else{
				return Promise.reject(result);
			}
		})
	},
	updatePhoneFaster: (payload) => 
		axios.post(`${url}/updatePhone`, {
			...payload
		}).then(res => res.data)
}