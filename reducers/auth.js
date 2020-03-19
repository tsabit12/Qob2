import { 
	USER_LOGGED_IN, 
	GET_DETAIL_USER, 
	USER_LOGGED_OUT, 
	SAVE_STORAGE_REQUEST, 
	CLEARE_STORAGE_REQUEST, 
	UPDATE_PROFILE,
	UPDATE_PIN 
} from "../types";
const initialState = {
	logged: true,
	user: {},
	dataLogin: {
		userid: '440000859',
		norek: '-',
		detail: {
			email: 'usilfer19@gmail.com',
			nohp: '0895343775002',
			norek: '-'
		}
	},
	request: [],
	pin: null
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case USER_LOGGED_IN:
			return{
				...state,
				logged: true,
				dataLogin: {
					userid: action.userid,
					norek: action.response.norek,
					detail: action.response
				},
				pin: action.pin
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
					norek: null,
					detail: {}
				},
				user: {},
				pin: null
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
		case 'GET_KEL_KEC_BYKODEPOS':
			return{
				...state,
				user: {
					...state.user,
					kel: action.newPayload.kel,
					kec: action.newPayload.kec
				}
			}
		case 'UPDATE_REK_GIRO':
			return{
				...state,
				dataLogin: {
					...state.dataLogin,
					norek: action.noRek,
					detail: {
						...state.dataLogin.detail,
						saldo: action.saldo
					}
				}
			}
		case UPDATE_PROFILE:
			return{
				...state,
				dataLogin: {
					...state.dataLogin,
					detail: {
						...state.dataLogin.detail,
						kecamatan: action.alamat.kec,
						kelurahan: action.alamat.kel,
						kodepos: action.alamat.kodepos,
						kota: action.alamat.kab,
						provinsi: action.alamat.prov,
						alamatOl: action.alamat.alamatUtama
					}	
				}
			}
		case UPDATE_PIN: {
			return{
				...state,
				pin: action.pin
			}
		}
		default: return state;
	}
}