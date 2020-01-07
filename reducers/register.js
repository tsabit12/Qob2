import { GET_KTP, GET_REKENING_REG, SAVE_RES_REGISTER } from "../types";

const initialState = {
	ktp: {},
	giro: {},
	session: {}
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
		case SAVE_RES_REGISTER: 
			return{
				...state,
				session: action.response
			}
		default: return state;
	}
}