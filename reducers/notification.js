import {
	GET_NOTIFICATION,
	REMOVE_NOTIF
} from '../types';

const initialState = {
	total: 0,
	data: []
}

// const newData = data.map((row, i) => ({ 
// 	key: `${i}`, 
// 	text: row.body, 
// 	date: row.create_time, 
// 	nomor: row.title,
// 	id: row.key
// }));

export default function notification(state=initialState, action={}){
	switch(action.type){
		case GET_NOTIFICATION:
			return{
				...state,
				//total: action.notifications.filter(row => row.status === '01').length,
				data: action.notifications.map((row, index) => ({
					key: `${index}`,
					text: row.body,
					date: row.create_time,
					nomor: row.title,
					id: row.key
				}))
			}
		case REMOVE_NOTIF: 
			return{
				...state,
				//total: state.total - 1,
				data: state.data.filter(row => row.id !== action.id)
			}
		case 'ADD_NEW_NOTIF':
			return{
				...state,
				total: state.total + 1
			}
		default: 
			return state;
	}
}