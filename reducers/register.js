import { GET_KTP, GET_REKENING_REG } from "../types";

const initialState = {
	ktp: {},
	giro: {}
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
		case GET_REKENING_REG:
			return{
				...state,
				giro: action.res
			}
		default: return state;
	}
}