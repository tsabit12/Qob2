import { GET_KTP, KTP_404 } from "../types";

const initialState = {
	ktp: {},
	errors: {}
};

export default function register(state=initialState, action={}){
	switch(action.type){
		case GET_KTP:
			return{
				ktp: action.ktp,
				errors: {}
			}
		case KTP_404:
			return{
				ktp: {},
				errors: {
					ktp: 'Data tidak ditemukan'
				}
			}
		default: return state;
	}
}