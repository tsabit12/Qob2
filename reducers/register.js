import { GET_KTP } from "../types";

const initialState = {
	ktp: {}
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
		default: return state;
	}
}