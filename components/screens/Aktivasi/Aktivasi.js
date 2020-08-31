import React from "react";
import { View, Text, StatusBar, Image, KeyboardAvoidingView, ScrollView, AsyncStorage, Keyboard } from "react-native";
import styles from "./styles";
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../../Loader";
import api from "../../api";
import getHashing from "../../utils/hashing";
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { setLocalUser } from "../../../actions/user";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  	<Icon {...style} name='arrow-back' fill='black' />
);

const BackAction = (navigation) => {
	return(
		<TopNavigationAction 
			icon={() => <BackIcon/>}
			onPress={() => navigation.goBack()}
		/>
	)
}

const MessageSuccess = ({ message, onPress }) => (
	<React.Fragment>
		<View style={{backgroundColor: 'rgba(48, 247, 230, 0.99)', padding: 20, borderRadius: 4}}>
			<Text style={{textAlign: 'center'}}>{message}</Text>
		</View>
		<Button style={{marginTop: 10}} onPress={() => onPress()}>LOGIN</Button>
	</React.Fragment>
)

const MessageError = ({ message }) => (
	<Text style={{textAlign: 'center', color: 'red'}}>{message}</Text>
)

const Aktivasi = props => {
	const [data, setData] = React.useState({
		form: {
			email: '',
			password: ''
		},
		errors: {},
		loading: false
	})

	const emailRef = React.useRef();
	const passwordRef = React.useRef();

	const onChange = (e, { name }) => setData(prevData => ({
		...prevData,
		form: {
			...prevData.form,
			[name]: e
		},
		errors: {
			...prevData.errors,
			[name]: undefined
		}
	}))

	const onSubmit = () => {
		const errors = validateForm(data.form);
		setData(prevData => ({
			...prevData,
			errors
		}))
		if (Object.keys(errors).length === 0) {
			setData(prevData => ({
				...prevData,
				loading: true
			}))

			const payload = {
				messtype: '225',
				param1: data.form.email,
				param2: data.form.password,
				hashing: getHashing('225',data.form.email)
			};

			api.aktifasi(payload)
				.then(res => {//move to next function
					sendRegister(res);
				})
				.catch(err => {
					if (err.desk_mess) {
						setData(prevData => ({
							...prevData,
							loading: false,
							errors: {
								global: err.desk_mess
							}
						}))
					}else{
						setData(prevData => ({
							...prevData,
							loading: false,
							errors: {
								global: 'Tidak dapat menghubungkan ke server, mohon coba beberapa saat lagi'
							}
						}))
					}
				})
		}
	}

	const validateForm = (field) => {
		const errorsField = {};
		if (!field.email) {
			errorsField.email = "Email harap diisi";
		}else{
			const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(field.email)) errorsField.email = "Email tidak valid";
		}

		if (!field.password) errorsField.password = "Password harap diisi";

		return errorsField;
	}

	const sendRegister = (response) => {
		const { response_data1, response_data2 } = response;
		const explodeR1 = response_data1.split('|');
		const payload = {
			param1: `00|${explodeR1[1]}|${explodeR1[2]}|${explodeR1[3]}|${Constants.deviceId}`,
			param2: `${explodeR1[4]}|${explodeR1[8]}|${explodeR1[7]}|${explodeR1[6]}|${explodeR1[5]}|${explodeR1[9]}`,
			param3: `-|${response_data2}|${explodeR1[4]}|${explodeR1[8]}|${explodeR1[7]}|${explodeR1[6]}|${explodeR1[5]}|${explodeR1[9]}`
		}

		api.registrasi.registrasiUserPebisol(payload)
			.then(res => {
				const { new_res_1: response_data1 } = res;
				const x = new_res_1.split('|');
				const toSave = {
					userid: x[0],
					username: x[1],
					pinMd5: x[2],
					nama: x[3],
					nohp: x[4],
					email: x[5]
				};

				saveToStorage(toSave, res.desk_mess);

			}).catch(err => {
				if (err.desk_mess) {
					setData(prevData => ({
						...prevData,
						loading: false,
						errors:{
							global: err.desk_mess
						}
					}))
				}else{
					setData(prevData => ({
						...prevData,
						loading: false,
						errors:{
							global: 'Tidak dapat menghubungkan ke server, mohon coba beberapa saat lagi'
						}
					}))
				}
			})
	}

	const saveToStorage = async (payload, message) => {
	  	try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			 //set value to redux
			 //for handle user login without close app
			props.setLocalUser(payload);
			setData(prevData => ({
				...prevData,
				loading: false,
				errors: { //dont need state again just use existing
					success: message
				}
			}))
		}catch(errors){
			setData(prevData => ({
				...prevData,
				loading: false,
				errors: {
					global: 'Saving data failed'
				}
			}))
		}
	}

	return(
		<View style={styles.root}>
			<TopNavigation
			    leftControl={BackAction(props.navigation)}
			    title='Aktifasi QPOSin web'
			    alignment='start'
			    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
			    style={styles.navigation}
			/>
			<Loader loading={data.loading} />
			<KeyboardAvoidingView
				style={{flex:1}} 
				behavior="padding" 
				enabled={false}
			>
				<ScrollView>
				<Image 
					source={require('../../../assets/BANNERWEB.png')}
					style={styles.image}
					resizeMode='contain'
				/>
	    		<View style={styles.title}>
	    			{ data.errors.global ? <MessageError message={data.errors.global} /> : <React.Fragment>
	    				<Text style={styles.info}>
		    				Untuk anda yang memiliki akun web QPOSin anda perlu melakukan aktifasi terlebih dahulu agar bisa login di QPOSin mobile. 
		    			</Text>
		    			<Text style={[styles.info, {marginTop: 10}]}>
		    				Silahkan isi email dan password akun QPOSin web anda dibawah ini
		    			</Text>
	    			</React.Fragment>}
	    		</View>
		    	<View style={styles.form}>
		    		{ data.errors.success ? <MessageSuccess 
		    				message={data.errors.success} 
		    				onPress={() => props.navigation.push('Home')}
		    			/> : <React.Fragment>
		    				<Input 
				    			name='email'
				    			label='Email'
				    			ref={emailRef}
				    			labelStyle={{color: 'black', fontSize: 14}}
				    			placeholder='Masukkan email anda'
				    			style={styles.input}
				    			value={data.form.email}
				    			onChangeText={(e) => onChange(e, emailRef.current.props)}
				    			keyboardType='email-address'
				    			autoCapitalize='none'
				    			returnKeyType='next'
				    			status={data.errors.email && 'danger'}
				    			caption={data.errors.email && `${data.errors.email}`}
				    		/>
				    		<Input 
				    			name='password'
				    			label='Password'
				    			labelStyle={{color: 'black', fontSize: 14}}
				    			placeholder='Masukkan password web'
				    			style={styles.input}
				    			value={data.form.password}
				    			ref={passwordRef}
				    			onChangeText={(e) => onChange(e, passwordRef.current.props)}
				    			secureTextEntry={true}
				    			status={data.errors.password && 'danger'}
				    			caption={data.errors.password && `${data.errors.password}`}
				    		/>
							<Button onPress={onSubmit}>Aktifasi</Button>
		    			</React.Fragment> }
				</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

export default connect(null, { setLocalUser })(Aktivasi);