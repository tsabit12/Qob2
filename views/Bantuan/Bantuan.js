import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, AsyncStorage } from "react-native";
import Constants from 'expo-constants';
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import Loader from "../Loader";
import {
	ApiYuyus as api
} from "../../api";

import {
	FormRequest,
	VerificationForm
} from "./components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setLocalUser } from "../../actions/user";

const getCurdate = () => {
	var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   

    var dateTime = year+''+month+''+day; //+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

const phoneNumber = (number) => {
	return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	statusbar: {
		height: Constants.statusBarHeight,
	  	backgroundColor: '#FFF'
	},
	form: {
		margin: 5,
		marginTop: 10,
		borderWidth: 0.3,
		padding: 10,
		borderColor: '#bfbcbb',
		borderRadius: 3,
		backgroundColor: 'white',
		elevation: 5
	},
	navigation: {
		backgroundColor: '#FFF', 
		borderBottomWidth: 0.9, 
		borderBottomColor: '#e6e6e6',
		elevation: 5
	},
	message: {
		margin: 5,
		backgroundColor: '#f73e00',
		padding: 10,
		borderRadius: 3,
		elevation: 5,
		height: 60,
		justifyContent: 'center'
	},
	whiteText: {
		fontSize: 14,
		color: 'white'
	}
})

const Message = props => (
	<View style={styles.message}>
		<Text style={styles.whiteText}>{props.text}</Text>
	</View>
);


const Bantuan = props => {
	const [state, setState] = React.useState({
		data: {
			userid: '',
			nama: '',
			nohp: '',
			email: ''
		},
		loading: false,
		jenis: props.navigation.state.params.jenis,
		errors: {},
		isConfirm: false,
		success: {},
		verifyCode: ''
	});

	React.useEffect(() => {
		(async () => {
			const value = await AsyncStorage.getItem("HISTORI_REQUST_PEMULIHAN");
			if (value !== null) {
				const toObj 	= JSON.parse(value); //object
				if (toObj.curdate === getCurdate()) { //only run when curdate is now
					setState(prevState => ({
						...prevState,
						isConfirm: true,
						data: {
							userid: toObj.userid,
							nama: toObj.nama,
							nohp: toObj.nohp,
							email: toObj.email
						},
						verifyCode: toObj.verifyCode,
						success: {
							global: `Kode verifikasi telah dikirim ke nomor ${toObj.nohp} melalui WhatsApp. (Berlaku sampai pukul 00:00)`
						}
					}))
				}
			}
		})();
	}, []);

	const BackAction = () => (
  		<TopNavigationAction 
  			icon={(style) => <TouchableOpacity onPress={() => props.navigation.goBack()}>
  					<Icon {...style} name='arrow-back' fill='black' />
  				</TouchableOpacity> }
  		/>
	)

	const handleChange = (e, { name }) => {
		if (name === 'nohp') {
			var val 	= e.replace(/\D/g, '');
			var x 		= Number(val);
			const value = phoneNumber(x);
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					nohp: value
				},
				errors: {
					...prevState.errors,
					nohp: undefined
				}
			}))
		}else{
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					[name]: e
				},
				errors: {
					...prevState.errors,
					[name]: undefined
				}
			}))
		}
	}

	const onRequest = () => {
		const { data } = state;
		const errors = validate(state.data);
		setState(prevState => ({
			...prevState,
			errors
		}));

		if (Object.keys(errors).length === 0) {
			setState(prevState => ({
				...prevState,
				loading: true
			}));

			const phone = data.userid === '440024297' ? '+628534822978' : `0${data.nohp.replace(/\D/g, '')}`;

			const param1 = `${data.userid}|${data.nama}|${phone}|${data.email}|${Constants.deviceId}|${state.jenis}`;

			api.bantuan(param1, data.userid)
				.then(res => {
					const { response_data2 } = res;

					const payload = {
						...state.data,
						curdate: getCurdate(),
						nohp: phone,
						verifyCode: response_data2
					};

					const saving = saveSessionRequest(payload);
					if (saving) {
						setState(prevState => ({
							...prevState,
							loading: false,
							isConfirm: true,
							success: {
								global: `Kode verifikasi telah dikirim ke nomor ${phone} melalui WhatsApp. (Berlaku sampai pukul 00:00)`
							},
							verifyCode: response_data2,
							data: {
								...prevState.data,
								nohp: phone //remove character
							}
						}))
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: {
								global: 'Gagal menyimpan data, silahkan cobalagi'
							}
						}))
					}		
				})
				.catch(err => {
					if (err.global) {
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: err
						}))
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: {
								global: 'Mohon maaf, untuk sementara server sedang dalam perbaikan. Mohon coba beberapa saat lagi'
							}
						}));
					}
				})
		}
	}

	const saveSessionRequest = async (payload) => {
		try {
			await AsyncStorage.setItem('HISTORI_REQUST_PEMULIHAN', JSON.stringify(payload));
			return true;
		}catch(err){
			return false
		}
	}

	const validate = (data) => {
		const errors = {};
		if (!data.nama) errors.nama = "Nama harap diisi";
		if (!data.userid) errors.userid = "Userid harap diisi";
		if (!data.nohp){
			errors.nohp = "Nomor handphone harap diisi";
		}else{
			var regex 			= /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/;
  			const phoneValues 	= `0${data.nohp.replace(/\D/g, '')}`;
  			if (!regex.test(phoneValues)) errors.nohp = "Nomor handphone tidak valid"; 
		}

		if (!data.email){
			errors.email = "Email harap diisi";	
		}else{
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(data.email)) errors.email = "Email tidak valid";
		}

		return errors;
	}

	const onVerification = (code) => {
		if (code !== state.verifyCode) {
			setState(prevState => ({
				...prevState,
				success: {
					global: 'Kode verifikasi tidak valid!'
				}
			}))
		}else{
			const { data } = state;
			setState(prevState => ({
				...prevState,
				loading: true,
				success: {}
			}));

			const param1 = `${data.userid}|${data.nama}|${data.nohp}|${data.email}|${Constants.deviceId}|${code}|${state.jenis}`;
			api.verifikasiBantuan(param1, data.userid)
				.then(res => {
					console.log(res);
					const { response_data2, response_data1 } = res;
					const parsing 	 = response_data2.split('|');

					const payloadRes = {
						userid: parsing[0],
						username: parsing[1],
						pinMd5: parsing[2],
						nama: parsing[3],
						nohp: parsing[4],
						email: parsing[5]
					};

					props.setLocalUser(payloadRes, response_data1);
					const savingUser = saveSessionUser(payloadRes);
					if (savingUser) {
						AsyncStorage.removeItem('HISTORI_REQUST_PEMULIHAN');
						setState(prevState => ({
							...prevState,
							loading: false,
							success: {
								global: response_data1
							},
							isConfirm: false,
							data: {
								userid: '',
								nama: '',
								nohp: '',
								email: ''
							}
						}));
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							success: {
								global: 'Gagal menyimpan data!'
							}
						}))
					}
				})
				.catch(err => {
					if (err.global) {
						setState(prevState => ({
							...prevState,
							loading: false,
							success: err.global
						}))
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							success: {
								global: 'Mohon maaf, untuk sementara server sedang dalam perbaikan. Mohon coba beberapa saat lagi'
							}
						}))
					}
				})

		}
	}

	const saveSessionUser = async (payload) => {
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return true;
		}catch(err){
			return false;
		}
	}

	return(
		<View style={styles.root}>
			<Loader loading={state.loading} />
			<View style={styles.statusbar}>
				<StatusBar translucent barStyle="light-content" />
			</View>
			<TopNavigation
			    leftControl={BackAction()}
			    title={props.navigation.state.params.title}
			    alignment='start'
			    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
			    style={styles.navigation}
			/>

			{ state.errors.global && <Message text={state.errors.global} /> }
			{ state.success.global && <Message text={state.success.global} /> }
			
			
				{ state.isConfirm ? <VerificationForm onSubmit={onVerification} /> : 
					<View style={styles.form}>
						<FormRequest 
							jenis={props.navigation.state.params.jenis}
							value={state.data}
							onChange={handleChange}
							onSubmit={onRequest}
							errors={state.errors}
						/> 
					</View>}
		</View>
	);
}

Bantuan.propTypes = {
	setLocalUser: PropTypes.func.isRequired
}

export default connect(null, { setLocalUser })(Bantuan);