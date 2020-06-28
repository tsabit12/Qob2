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
	}).then(res => res.data)
}