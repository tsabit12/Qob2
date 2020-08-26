import api from "../components/api";
import { UPDATE_PROFILE, UPDATE_PIN, SET_LOCAL_USER } from "../types";
import { AsyncStorage } from "react-native";

export const profileUpdated = (alamat) => ({
	type: UPDATE_PROFILE,
	alamat
})

export const updateProfil = (string, object) => dispatch =>
	api.user.updateProfil(string)
		.then(res => {
			dispatch(profileUpdated(object));
			// console.log(res);
		})

export const pinUpdated = (pin, rumusPin) => dispatch => ({
	type: UPDATE_PIN,
	pin,
	rumusPin
})

//1c874c6e20a313f29031d4fcb82ee8

export const updatePin = (payload, pin, toSaveProps, rumusPin) => dispatch =>
	api.user.updatePin(payload)
		.then(res => {
			// console.log(res);
			const { response_data1 } = res;
			const x 		= response_data1.split('|');
			const pinMd5 	= x[1];
			const toSave = {
				userid: toSaveProps.userid,
				username: '-',
				pinMd5: rumusPin,
				nama: toSaveProps.nama,
				nohp: toSaveProps.nohp,
				email: toSaveProps.email
			};	
			saveToStorage(toSave)
				.then(() => dispatch(pinUpdated(pin, rumusPin)))
		})

export const saveToStorage = async (payload) => {
	try{
		await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
		return Promise.resolve(payload);
	}catch(errors){
		console.log(errors);
		return Promise.reject(errors);
	}
}

export const setLocalUser = (userData) => dispatch => {
	dispatch({
		type: SET_LOCAL_USER,
		userData
	})
}

export const calculateSaldo = (nominal, calculateType) => dispatch => dispatch({
	type: 'CALCULATE_SALDO',
	calculateType,
	nominal
})