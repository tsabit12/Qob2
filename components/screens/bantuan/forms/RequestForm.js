import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import styles from "../styles";
import api from "../../../api";

const phoneNumber = (number) => {
	return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
}

const RequestForm = ({ onRequest, jenis }) => {
	const useridRef = React.useRef();
	const nameRef 	= React.useRef();
	const emailRef 	= React.useRef();
	const phoneRef 	= React.useRef();
	const [data, setData] = React.useState({
		payload: {
			userid: '',
			nohp: '',
			email: '',
			nama: ''
		},
		errors: {}
	})

	const [errors, setErrors] = React.useState({});

	const onChange = (e, { name }) => {
		if (name === 'nohp') {
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = phoneNumber(x);
			setData({
				...data,
				payload:{
					...data.payload,
					nohp: value
				},
				errors: {
					...data.errors,
					nohp: undefined
				}
			})
		}else{
			setData({
				...data,
				payload:{
					...data.payload,
					[name]: e
				},
				errors: {
					...data.errors,
					[name]: undefined
				}
			})
		}
	}

	const onSubmit = () => {
		const validateErrors = validate(data.payload);
		setData({
			...data,
			errors: validateErrors
		})
		if (Object.keys(validateErrors).length === 0) {
			const payload = {
				...data.payload,
				nohp: `0${data.payload.nohp.replace(/\D/g, '')}`,
			};

			onRequest(payload);
			
		}
	}

	const validate = (payload) => {
		const errors = {};
		if (!payload.userid) errors.userid = "Userid harap diisi";
		if (!payload.nama) errors.nama = "Nama harap diisi";
		if (!payload.nohp) {
			errors.nohp = "Nomor handphone harap diisi";
		}else{
			var regex 			= /(\()?(\+62|62|0)(\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/;
  			const phoneValues 	= `+62-${payload.nohp}`;
  			if (!regex.test(phoneValues)) errors.nohp = "Nomor handphone tidak valid"; 
		}

		if (!payload.email){
			errors.email = "Email harap diisi";	
		}else{
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(payload.email)) errors.email = "Email tidak valid";
		}

		return errors;
	} 

	return(
		<KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
			<ScrollView>
				<View style={styles.container}>
					<Input 
						ref={useridRef}
						name='userid'
						label='Userid'
						labelStyle={styles.label}
						style={styles.input}
						placeholder='Masukkan userid anda'
						value={data.payload.userid}
						onChangeText={(e) => onChange(e, useridRef.current.props)}
						keyboardType='numeric'
						returnKeyType='next'
						onSubmitEditing={() => nameRef.current.focus() }
						status={data.errors.userid && 'danger'}
						caption={data.errors.userid && `${data.errors.userid}`}
					/>
					<Input 
						ref={nameRef}
						name='nama'
						label='Nama Lengkap'
						labelStyle={styles.label}
						style={styles.input}
						placeholder='Masukkan nama lengkap'
						value={data.payload.nama}
						onChangeText={(e) => onChange(e, nameRef.current.props)}
						returnKeyType='next'
						autoCapitalize='words'
						onSubmitEditing={() => phoneRef.current.focus() }
						status={data.errors.nama && 'danger'}
						caption={data.errors.nama && `${data.errors.nama}`}
					/>
					<View style={{marginBottom: 6}}>
						<Text style={[styles.label, {marginBottom: 3}]}>Nomor Handphone</Text>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={[styles.label, {fontSize: 15}]}>+62</Text>
							<Input 
								ref={phoneRef}
								name='nohp'
								style={{flex: 1, marginLeft: 6}}
								placeholder='8XX-XXXX-XXXX'
								value={data.payload.nohp}
								onChangeText={(e) => onChange(e, phoneRef.current.props)}
								returnKeyType='next'
								keyboardType='phone-pad'
								onSubmitEditing={() => emailRef.current.focus() }
								status={data.errors.nohp && 'danger'}
							/>
						</View>
						{ data.errors.nohp && <Text style={{fontSize: 12, color: 'red'}}>{data.errors.nohp}</Text>}
					</View>
					<Input 
						ref={emailRef}
						name='email'
						label='Email'
						labelStyle={styles.label}
						style={styles.input}
						placeholder='Masukkan email anda'
						value={data.payload.email}
						onChangeText={(e) => onChange(e, emailRef.current.props)}
						returnKeyType='done'
						keyboardType='email-address'
						autoCapitalize='none'
						status={data.errors.email && 'danger'}
						caption={data.errors.email && `${data.errors.email}`}
					/>
					<Button style={{marginTop: 5}} onPress={onSubmit}>
						{ jenis === 1 && 'Dapatkan PIN Baru' }
						{ jenis === 2 && 'Pulihkan' }
					</Button>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

export default RequestForm;