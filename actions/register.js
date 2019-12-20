import api from "../components/api";
import { GET_KTP, KTP_404, REG_KTP_GAGAL, REMOVE_ERROR } from "../types";

export const ktpFound = (ktp) => ({
	type: GET_KTP,
	ktp
})

export const ktpNotFound = () => ({
	type: KTP_404
})

export const searchKtp = (nik) => dispatch =>
	api.registrasi.cekKtp(nik)
		.then(res => {
			if (res.rc_mess === '00') {
				const { response_data1 } = res;
				const values = response_data1.split('|');
				const convert = convertNik(values);
				dispatch(ktpFound(convert))
			}else{
				dispatch(ktpNotFound());
			}
		})
		// .catch(err => console.log(err))


export const convertNik = (parsing) => {
	const data = {
		nik: parsing[0],
		fullname: parsing[1],
		alamat: parsing[8],
		city: parsing[10],
		prov: parsing[13],
		kec: parsing[4],
		motherName: parsing[12],
		gender: parsing[16],
		birthPlace: parsing[10],
		birtDate: parsing[17],
		rt: parsing[3],
		rw: parsing[6],
		desa: parsing[15]
	}
	return data;
}

export const registerGagal = () => ({
	type: REG_KTP_GAGAL
})

export const registerKtp = (payload) => dispatch =>
	api.registrasi.registrasiNoGiro(payload)
		.then(res => {
			console.log(res);
			if (res.rc_mess === '00') {

			}else{//error response
				dispatch(registerGagal())
			}
		})

export const errorRemoved = () => ({
	type: REMOVE_ERROR
})
export const removeError = () => dispatch => dispatch(errorRemoved())