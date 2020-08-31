import { ApiQposin } from '../api';
import { 
	GET_NOTIFICATION,
	REMOVE_NOTIF
} from '../types';

export const getNotification = (payload) => dispatch => 
	ApiQposin.getNotification(payload)
		.then(notifications => dispatch({
			type: GET_NOTIFICATION,
			notifications
		}))

export const removeNotif = (id) => dispatch => 
	ApiQposin.removeNotif(id)
		.then(() => dispatch({
		type: REMOVE_NOTIF,
		id
	}))

export const addNewNotif = () => dispatch => 
	dispatch({
		type: 'ADD_NEW_NOTIF'
	})