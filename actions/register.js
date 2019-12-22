import api from "../components/api";
import { GET_KTP, GET_REKENING_REG } from "../types";
import { convertDataFromRek } from "../components/utils/helper";

export const ktpFound = (ktp) => ({
	type: GET_KTP,
	ktp
})

export const searchKtp = (nik) => dispatch =>
	api.registrasi.cekKtp(nik)
		.then(res => {
			const { response_data1 } = res;
			const values = response_data1.split('|');
			const convert = convertNik(values);
			dispatch(ktpFound(convert))
		})


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

export const registerKtp = (payload) => dispatch =>
	api.registrasi.registrasiNoGiro(payload)
		.then(res => console.log("oke"))
		// .then(res => console.log(res))

export const rekeningFetched = (res) => ({
	type: GET_REKENING_REG,
	res
})

export const getRek = (rek) => dispatch => 
	api.registrasi.validasiRekening(rek)
		.then(res => {
			const response = convertDataFromRek(res.response_data1);
			console.log(response);
		})