import { USER_LOGGED_IN, GET_DETAIL_USER, USER_LOGGED_OUT, SAVE_STORAGE_REQUEST, CLEARE_STORAGE_REQUEST } from "../types";
//5870
//250
const initialState = {
	logged: false,
	user: {},
	// dataLogin: {
	// 	userid: '540000032',
	// 	norek: '-'
	// },
	dataLogin: {
		userid: '',
		norek: ''
	},
	request: []
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
		case USER_LOGGED_OUT:
			return{
				...state,
				logged: false,
				dataLogin: {
					userid: null,
					norek: null
				},
				user: {}
			}
		case SAVE_STORAGE_REQUEST:
			return{
				...state,
				request: action.storage
			}
		case CLEARE_STORAGE_REQUEST:
			return{
				...state,
				request: []
			}
		default: return state;
	}
}