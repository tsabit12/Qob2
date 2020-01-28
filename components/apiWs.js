import axios from "axios";
import { curdateTime } from "./utils/helper";

let url = 'https://order.posindonesia.co.id/api';
let configFast = {
	headers: { 
  		'content-type': 'application/json',
  		'accept': 'application/json'
  	}
}

export default{
	qob: {
		booking: (payload) => axios.post(`${url}/qob`, {
			userid: payload.userid,
			fee: payload.fee,
			feeTax: payload.feeTax,
			insurance: payload.insurance,
			insuranceTax: payload.insuranceTax,
			itemValue: payload.itemValue,
			contentDesc: payload.contentDesc,
			berat: payload.berat,
			serviceCode: payload.serviceId,
			senderName: payload.senderName,
			senderAddres: payload.senderAddress,
			senderKec: payload.senderKec,
			senderCity: payload.senderCity,
			senderProv: payload.senderProv,
			senderPos: payload.senderPos,
			senderMail: payload.senderMail,
			senderPhone: payload.senderPhone,
			receiverName: payload.receiverName,
			receiverAddress: payload.receiverAddress,
			receiverKec: payload.receiverKec,
			receiverKab: payload.receiverCity,
			receiverProv: payload.receiverProv,
			receiverPos: payload.receiverPos,
			receiverMail: payload.receiverMail,
			receiverPhone: payload.receiverPhone
		}).then(res => res.data),
		addPickup: (payload) => axios.post('https://fasterv2.fastkurir.com/api/customer/bidding_v2', {
			payload
		}, configFast).then(res => res)
	},
	fetch: {
		getAddPosting: (userid) => axios.post(`${url}/qob/getAddPosting`, {
			userid: userid
		}).then(res => res.data)
	}
}