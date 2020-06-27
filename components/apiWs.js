import axios from "axios";
import { curdateTime } from "./utils/helper";

let url = 'https://order.posindonesia.co.id/api/qoblive';
let configFast = {
	headers: { 
  		'content-type': 'application/json',
  		'accept': 'application/json'
  	}
}

const url2 = 'https://magenpos.posindonesia.co.id:5870/a767e8eec95442bda80c4e35e0660dbb'

export default{
	qob: {
		booking: (payload) => axios.post(`${url}`, {
			userId: payload.userid,
			fee: payload.fee,
			length: payload.length,
			width: payload.width,
			height: payload.height,
			cod: payload.cod,
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
			senderVill: payload.senderVill,
			senderProv: payload.senderProv,
			senderPhone: payload.senderPhone,
			receiverName: payload.receiverName,
			receiverAddress: payload.receiverAddress,
			receiverKec: payload.receiverKec,
			receiverKab: payload.receiverCity,
			receiverProv: payload.receiverProv,
			receiverPos: payload.receiverPos,
			receiverMail: payload.receiverMail,
			receiverVill: payload.receiverVill,
			receiverPhone: payload.receiverPhone
		}).then(res => res.data),
		addPickup: (payload) => axios.post('https://fasterv2.fastkurir.com/api/customer/bidding_v2', {
			shipper: payload.shipper,
			item: payload.item
		}, configFast).then(res => {
			if (res.data.status === true) {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		updateStatus: (arrayExtId, pickupNumber, coords) => axios.post(`${url}/updatePickup`, {
			externalId: arrayExtId,
			pickup_number: pickupNumber,
			shipper_latlong: `${coords.latitude}|${coords.longitude}`
		}).then(res => res.data),
		getKodePos: (kodepos) => axios.post(`${url}/getPostalCodeBaru`, {
			kodepos: kodepos
		}, configFast).then(res => res.data)
	},
	fetch: {
		getAddPosting: (userid) => axios.post(`${url}/getAddPosting`, {
			userid: userid
		}).then(res => res.data),
		getHistoryPickup: (userid) => axios.post(`${url}/getRequestPickup`, {
			userid: userid
		}).then(res => res.data),
		getMaps: (pickupNumber) => axios.post(`${url}/getDirection`, {
			noPickup: pickupNumber	
		}).then(res => res.data.result),
		getDetailPickup: (pickupNumber) => axios.post(`${url}/getDetailPickup`, {
			noPickup: pickupNumber
		}).then(res => res.data.result)	
	}
}