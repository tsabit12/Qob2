import React from "react";
import { View, Text } from "react-native";
import CodeInput from 'react-native-confirmation-code-input';
import api from "../../../api";

const VerificationForm = ({ setLoading, data, imei, setLocal, showAlert, jenis }) => {
	const confirmRef = React.useRef();

	const onComplete = (code) => {
		setLoading(true);

		const payload = {
			param1: `${data.userid}|${data.nama}|${data.nohp}|${data.email}|${imei}|${code}|${jenis}`
		};

		api.auth.verifikasi(payload, data.userid)
			.then(res => {
				// console.log(res);
				confirmRef.current.clear();
				// setLoading(false);
				const { response_data2, response_data1 } = res;
				let parsing 	 = response_data2.split('|');
				const payloadRes = {
					userid: parsing[0],
					username: parsing[1],
					pinMd5: parsing[2],
					nama: parsing[3],
					nohp: parsing[4],
					email: parsing[5]
				};

				setLocal(payloadRes, response_data1);
			})
			.catch(err => {
				confirmRef.current.clear();
				setLoading(false);
				if (err.desk_mess) {
					showAlert('Notifikasi', err.desk_mess);
				}else{
					showAlert('Terdapat kesalahan', 'Untuk sementara kami mengalami masalah saat menghubungkan ke server, harap cobalagi nanti')
				}

			})		
	}

	return(
		<View style={{ flex: 1, margin: 10}}>
		    <View style={{ backgroundColor: 'red', borderRadius: 3, padding: 10}}>
		    	<Text style={{textAlign: 'center', color: '#FFF'}}>Silahkan isi KODE VERIFIKASI yang diterima, melalui WhatsApp dan/atau Email</Text>
		    </View>
		    <CodeInput
		      ref={confirmRef}
		      keyboardType="numeric"
		      codeLength={6}
		      space={15}
		      size={50}
		      className={'border-b'}
		      autoFocus={true}
		      codeInputStyle={{ fontWeight: '800' }}
		      onFulfill={(code) => onComplete(code)}
		      //containerStyle={{backgroundColor: 'black'}}
		      codeInputStyle={{color: '#0f0f0f'}}
		      cellBorderWidth={2.0}
		      inactiveColor='#6e6c6b'
		      activeColor='#fc8b00'
		    />
		</View>
	)
}

export default VerificationForm;