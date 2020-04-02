import axios from "axios";

const url = 'https://api.posindonesia.co.id:8245/qposinaja/1.0.0';
const config = {
	headers: {
		'content-type': 'application/json',
		'X-POS-USER': 'pusat',
		'X-POS-PASSWORD': 'Po3S4T'
	}
}

export default{
	qob: {
		booking: (payload) => axios.post(`${url}/addorder`, {
			...payload
		}, config)
	}
}