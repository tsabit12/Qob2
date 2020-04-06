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
		updateStatus: (extid, pickupNumber) => axios.post(`${url}/confirmPickup`, {
			pickupid: pickupNumber,
			extid: extid
		}).then(res => {
			return res.data.result;
		})
	}
}