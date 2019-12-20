import { GET_KTP, KTP_404, REG_KTP_GAGAL, REMOVE_ERROR } from "../types";

const initialState = {
	ktp: {},
	errors: {
		ktp: {},
		register: {}
	}
};

export default function register(state=initialState, action={}){
	switch(action.type){
		case GET_KTP:
			return{
				ktp: action.ktp,
				errors: {
					ktp: {},
					register: {}
				}
			}
		case KTP_404:
			return{
				ktp: {},
				errors: {
					ktp: {
						message: 'Data tidak ditemukan'
					},
					register: {}
				}
			}
		case REG_KTP_GAGAL: 
			return{
				...state,
				errors: {
					ktp:{},
					register: {
						message: 'Terdapat kesalahan saat registrasi, mohon cobalagi nanti yaa. '
					}
				}
			}
		case REMOVE_ERROR:
			return{
				...state,
				errors: {
					ktp: {},
					register: {}
				}
			}
		default: return state;
	}
}