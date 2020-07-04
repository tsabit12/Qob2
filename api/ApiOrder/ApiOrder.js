import axios from "axios";
const url = 'https://order.posindonesia.co.id/api/Qposinaja';

export default  {
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
	pushToken: (payload) => axios.post(`${url}/pushToken`, {
		...payload
	}).then(res => res.data),
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
	getKodePos: (kodepos) => axios.post('https://order.posindonesia.co.id/api/qoblive/getPostalCodeBaru', {
		kodepos: kodepos
	}).then(res => {
		if (!res.data.result) {
			const errors = {
				response: {
					data: {
						errors: {
							global: 'Data tidak ditemukan'
						}
					}
				}
			}
			return Promise.reject(errors);
		}else{
			return Promise.resolve(res.data);
		}
	})
}