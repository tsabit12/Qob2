import { USER_LOGGED_IN, GET_DETAIL_USER } from "../types"; 
import api from "../components/api";

export const setLoggedIn = () => dispatch => {
	dispatch({
		type: USER_LOGGED_IN
	})
}

export const detailFetched = (user) => ({
	type: GET_DETAIL_USER,
	user
})

export const getDetailUser = (userid) => dispatch =>
	api.user.getDetail(userid)
		.then(res => {
			const { response_data1, response_data2 } = res;
			const x = response_data1.split('|');
			const y = response_data2.split('|');
			let payload = {
				userid: x[0],
				namaLengkap: x[1],
				namaPanggilan: x[2],
				noHp: x[3],
				email: x[4],
				imei: x[5],
				noRek: x[6],
				status: x[7],
				createTime: x[8],
				lastLogin: x[9],
				userupdate: x[10],
				lastUpdate: x[11],
				nik: y[0],
				npwp: y[1],
				kota: y[2],
				kodepos: y[3],
				kprk: y[4],
				alamat: y[5],
				detailUsaha: y[6]
			};
			dispatch(detailFetched(payload));
		})