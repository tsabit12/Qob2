import { USER_LOGGED_IN, GET_DETAIL_USER } from "../types";

const initialState = {
	logged: false,
	user: {},
	dataLogin: {
		userid: null,
		norek: null
	}
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case USER_LOGGED_IN:
			return{
				...state,
				logged: true,
				dataLogin: {
					userid: action.userid,
					norek: action.noRek
				}
			}
		case GET_DETAIL_USER:
			return{
				...state,
				user: action.user
			}
		default: return state;
	}
}