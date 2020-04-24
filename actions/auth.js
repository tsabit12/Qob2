import { USER_LOGGED_IN, GET_DETAIL_USER, USER_LOGGED_OUT, ADD_COD } from "../types"; 
import api from "../components/api";
import apiWs from "../components/apiWs";
import apiBaru from "../components/apiBaru";
import {AsyncStorage} from 'react-native';

export const setLoggedIn = (userid, response, pin) => dispatch => {
	dispatch({
		type: USER_LOGGED_IN,
		userid,
		response,
		pin
	})
}

export const detailFetched = (user) => ({
	type: GET_DETAIL_USER,
	user
})

export const completingDetailBykodepos = (newPayload) => ({
	type: 'GET_KEL_KEC_BYKODEPOS',
	newPayload
})

export const getDetailUser = (userid) => dispatch =>
	api.user.getDetail(userid)
		.then(res => {
			const { response_data1, response_data2, response_data3 } = res;
			const x = response_data1.split('|');
			const y = response_data2.split('|');
			const z = response_data3.split('|');
			const resUserid = x[0];
			let payload = {};
			if (resUserid.substring(0, 3) === '540') {
				payload = {
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
					detailUsaha: y[6],
					kel: z[0],
					kec: z[1]
				};
				apiWs.qob.getKodePos(y[3])
					.then(resKodepos => {
						const valuesKodepos = {
							kel: resKodepos.result[0].kelurahan,
							kec: resKodepos.result[0].kecamatan
						};
						dispatch(completingDetailBykodepos(valuesKodepos))
					})
			}else{
				payload = {
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
					detailUsaha: y[6],
					kel: z[0],
					kec: z[1]
				};
			}
			dispatch(detailFetched(payload));
		})

export const loggedOut = () => dispatch => {
	dispatch({
		type: USER_LOGGED_OUT
	})
}

export const updateLoginSes = (noRek, saldo) => dispatch => {
	dispatch({
		type: 'UPDATE_REK_GIRO',
		noRek,
		saldo
	})
}

export const setCodeToTrue = () => dispatch => dispatch(codFeatures());

export const codFeatures = () => ({
	type: ADD_COD
})

export const synchronizeWebGiro = (payload) => dispatch => 
	apiBaru.user.syncronizeCod(payload).then(res => {
		//1 success
		saveToStorage()
			.then(() => dispatch(codFeatures()))
	})	


export const saveToStorage = async () => {
	try{
		await AsyncStorage.setItem('isCod', '1');
		return Promise.resolve('oke');
	}catch(errors){
		return Promise.reject(errors);
	}
}