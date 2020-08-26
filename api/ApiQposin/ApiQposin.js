import axios from "axios";

const url = 'https://order.posindonesia.co.id/api/Qposinaja';

export default {
	getNotification: (payload) => axios.post(`${url}/logNotif`, {
		...payload
	}).then(res => res.data.result),
	removeNotif: (id) => axios.post(`${url}/readNotif`, {
		id
	}).then(res => res.data)
}