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
			if (res.data.result === 400) {
				return Promise.reject(res.data);
			}else{
				return res.data.result;
			}
		})
	}
}