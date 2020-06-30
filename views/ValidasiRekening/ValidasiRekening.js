import React from "react";
import { View, Text, StyleSheet, StatusBar, AsyncStorage } from "react-native";
import PropTypes from "prop-types";
import { 
	Icon, 
	TopNavigation, 
	TopNavigationAction,
	//Input, 
	Button 
} from '@ui-kitten/components';
import { connect } from "react-redux";
import Constants from 'expo-constants';
import {
	RekeningForm,
	ConfirmationForm
} from "./components";
import Loader from "../Loader";
import {
	ApiYuyus as api
} from "../../api";
import { updateLoginSes } from "../../actions/auth";

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

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)',
		elevation: 6,
		paddingTop: Constants.statusBarHeight + 3
	},
	message: {
		margin: 6,
		padding: 10,
		backgroundColor: '#fc0324',
		borderRadius: 3,
		elevation: 5
	},
	text: {
		color: 'white',
		textAlign: 'center'
	}
})

const Message = props => (
	<View style={styles.message}>
		<Text style={styles.text}>{props.text}</Text>
	</View>
);


const ValidasiRekening = props => {
	const [state, setState] = React.useState({
		isConfirm: false,
		errors: {},
		loading: false,
		pin: '',
		norek: ''
	});

	const { userid } = props.dataLogin;

	React.useEffect(() => {
		(async () => {
			const value = await AsyncStorage.getItem("CONFIRMATION_GIRO");
			if (value !== null) {
				const toObj 	= JSON.parse(value); //object
				if (toObj.curdate === getCurdate()) { //only run when curdate is now
					setState(prevState => ({
						...prevState,
						isConfirm: true,
						message: `Kode verifikasi telah dikirim ke nomor ${toObj.pgmPhone} melalui WhatsApp. (Berlaku sampai pukul 00:00)`,
						pin: toObj.pin,
						norek: toObj.norek
					}));
				}
			}
		})();
	}, [])

	const BackAction = () => (
		<TopNavigationAction 
			icon={(style) =>  <Icon {...style} name='arrow-back' fill='#FFF'/> }
			onPress={() => props.navigation.goBack()}
		/>
	);

	const saveSession = async (payload) => {
		try {
			await AsyncStorage.setItem('CONFIRMATION_GIRO', JSON.stringify(payload));
			return true;
		} catch (err) {
			return false;
		}
	}

	const onChangeRek = (value) => setState(prevState => ({
		...prevState,
		norek: value,
		errors: {
			'norek': undefined
		}
	}))

	const onConnectGiro = () => {
		if (!state.norek) {
			setState(prevState => ({
				...prevState,
				errors: {
					norek: 'Nomor rekening harap diisi'
				}
			}));
		}else{
			setState(prevState => ({
				...prevState,
				errors: {},
				loading: true
			}));

			api.connectToGiro(state.norek, userid)
				.then(res => {
					const resValue 		= res.response_data1.split("|");
					const pgmPhone  	= res.response_data3;
					const kodeVerify 	= resValue[2];
					const curdate 		= getCurdate();

					const payload 	= {
						pin: kodeVerify,
						pgmPhone,
						curdate,
						norek: state.norek
					}

					const saving = saveSession(payload);
					if (saving) {
						setState(prevState => ({
							...prevState,
							loading: false,
							isConfirm: true,
							pin: kodeVerify,
							norek: state.norek
						}));	
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: {
								global: 'Gagal menyimpan data, silahkan cobalagi'
							}
						}));	
					}
				})
				.catch(err => {
					//we have response from server
					if (err.global) {
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: err
						}));	
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							errors: {
								global: 'Mohon maaf, untuk sementara server sedang dalam perbaikan. Mohon coba beberapa saat lagi'
							}
						}));
					}
				});
		}
	}

	const handleConfrimation = (code) => {
		if (code !== state.pin) {
			setState(prevState => ({
				...prevState,
				message: 'Kode verifikasi tidak valid'
			}))
		}else{
			setState(prevState => ({
				...prevState,
				loading: true
			}));

			const param1 = `${userid}|${state.norek}|${state.pin}`;
			api.validateGiro(param1)
				.then(res => {
					
					const { response_data5 } = res;
					setState(prevState => ({
						...prevState,
						loading: false,
						isConfirm: false
					}));
					props.updateLoginSes(state.norek, response_data5);
					setTimeout(() => {
						props.navigation.push('IndexMenu');
					}, 100);	
				})
				.catch(err => {
					console.log(err);
					if (err.global) {
						setState(prevState => ({
							...prevState,
							loading: false,
							message: err.global
						}));
					}else{
						setState(prevState => ({
							...prevState,
							loading: false,
							message: 'Mohon maaf, untuk sementara server sedang dalam perbaikan. Mohon coba beberapa saat lagi'
						}));
					}
				})
		}
	}

	const { errors } = state;

	return(
		<View style={styles.root}>
			<Loader loading={state.loading} />
			<TopNavigation
			    leftControl={BackAction()}
			    title='Hubungkan Akun Giro'
			    subtitle='Validasi rekening'
			    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
			    subtitleStyle={{color: '#FFF'}}
			    style={styles.navigation}
			/>

			{ state.message && <Message text={state.message} />}

			{ state.isConfirm ? 
				<ConfirmationForm 
					onSubmit={handleConfrimation}
				/> : 
				<RekeningForm 
					rekening={state.norek} 
					handleChange={onChangeRek}
					onSubmit={onConnectGiro}
					error={state.errors.norek}
				/> }

			{ errors.global && <Message text={errors.global} /> }
		</View>
	);
}

ValidasiRekening.propTypes = {
	dataLogin: PropTypes.object.isRequired,
	updateLoginSes: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { updateLoginSes })(ValidasiRekening);