import axios from "axios";
const url = 'https://order.posindonesia.co.id/api/Qposinaja';

const getLastStringAfterSpace = (words) => {
    var n = words.split(" ");
    return n[n.length - 1];

}

const GOOGLE_API_KEY = 'AIzaSyA8xP2eX_my7NBK-ysRHyg4QP-znaTxAsg';

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
	}),
	getRoute: (sender, receiver) => 
		axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!${sender.latitude},${sender.longitude}&waypoint1=geo!${receiver.latitude},${receiver.longitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
			.then(res => res.data.response.route[0]),
	google: {
		getAddres: (payload) => axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
			params: {
				latlng: `${payload.latitude},${payload.longitude}`,
				key: GOOGLE_API_KEY
			}
		}).then(res => {
			if (res.data.results.length > 0) {
				const { results } = res.data;
				const addressArr = results[0].formatted_address.split(',');
				var response = {};
				
				if (addressArr.length === 6) {
					const kodepos = getLastStringAfterSpace(addressArr[4]);
					response = {
						street: addressArr[0].trim(),
						kelurahan: addressArr[1].trim(),
						kecamatan: addressArr[2].trim(),
						kota: addressArr[3].trim(),
						kodepos: kodepos,
					}	
				}else if(addressArr.length === 7){
					const kodepos = getLastStringAfterSpace(addressArr[5]);
					response = {
						street: addressArr[1].trim(),
						kelurahan: addressArr[2].trim(),
						kecamatan: addressArr[3].trim(),
						kota: addressArr[4].trim(),
						kodepos: kodepos
					}	
				}else{
					const kodepos = getLastStringAfterSpace(addressArr[6]);
					response = {
						street: `${addressArr[0].trim()} ${addressArr[1].trim()}`,
						kelurahan: addressArr[3].trim(),
						kecamatan: addressArr[4].trim(),
						kota: addressArr[5].trim(),
						kodepos: kodepos,
					}	
				}

				return Promise.resolve(response);
			}else{
				const errors = {
					global: 'Address not found'
				}
				return Promise.reject(errors);
			}
		}),
		findLatlongbyAddres: (value) => axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
			params: {
				query: value,
				// components: 'country:indonesia',
				key: GOOGLE_API_KEY
			}
		}).then(res => {
			const { results } = res.data;
			if (results.length > 0) {
				const response = [];
				results.forEach(places => {
					response.push({
						label: places.formatted_address,
						location: places.geometry.location
					})
				})

				return Promise.resolve(response);
			}else{
				return Promise.reject(res);
			}
		})
	}
}