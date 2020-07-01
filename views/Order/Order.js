import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import Constants from 'expo-constants';
import { TopNavigation, Spinner, TopNavigationAction, Icon } from "@ui-kitten/components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	FormOrder
} from "./components";
import { setCodeToTrue, synchronizeWebGiro } from "../../actions/auth";
import {
	ApiYuyus as api,
	ApiOrder as api2
} from "../../api";

import Loader from "../Loader";

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const jenisOptions = [
  { text: 'Paket', value: 1},
  { text: 'Surat', value: 0}
];

const AppLoading = props => (
  <View style={styles.container}>
    <Spinner size='medium' />
    <Text style={{textAlign: 'center'}}>Loading</Text>
  </View>
)



const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)',
		marginTop: Constants.statusBarHeight,
		elevation: 5
	},
	form: {
		margin: 5,
		padding: 7,
		borderWidth: 0.2,
		borderColor: '#bdbdbd',
		borderRadius: 3,
		backgroundColor: 'white',
		elevation: 5,
		marginTop: 10
	},
	container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center', 
	}
})

const Order = props => {
	const [state, setState] = React.useState({
		mount: false,
		data: {
			isikiriman: '',
			berat: '0',
			jenisKiriman: jenisOptions[0],
			panjang: '0',
			lebar: '0',
			tinggi: '0',
			nilai: '0',
			checked: false
		},
		errors: {},
		loading: false,
		invalid: {}
	})

	React.useEffect(() => {
		(async () => {
			if (!props.isCod) {
				const value = await AsyncStorage.getItem('isCod');
				if (value !== null) {
					props.setCodeToTrue();
					api.searchRekeningType(props.dataLogin.norek)
						.then(res => {
							setState(prevState => ({
								...prevState,
								mount: true
							}))
						})
						.catch(err => {
							if (err.global) {
								setState(prevState => ({
									...prevState,
									invalid: err,
									mount: true
								}))
							}else{
								setState(prevState => ({
									...prevState,
									invalid: {
										global: 'Terdapat kesalahan saat mengambil data rekening anda, fitur COD di nonaktifkan'
									},
									mount: true
								}))
							}
						})
				}
			}else{
				api.searchRekeningType(props.dataLogin.norek)
					.then(res => {
						setState(prevState => ({
							...prevState,
							mount: true
						}))
					})
					.catch(err => {
						if (err.global) {
							setState(prevState => ({
								...prevState,
								invalid: err,
								mount: true
							}))
						}else{
							setState(prevState => ({
								...prevState,
								invalid: {
									global: 'Terdapat kesalahan saat mengambil data rekening anda, fitur COD di nonaktifkan'
								},
								mount: true
							}))
						}
					})
			}
		})();
	}, []);

	const handleChange = (value, { name })  => {
		if (name === 'isikiriman') {
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					isikiriman: value
				},
				errors: {
					...prevState.errors,
					isikiriman: undefined
				}
			}))
		}else if(name === 'jenisKiriman'){
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					jenisKiriman: value
				}
			}))
		}else{
			var val = value.replace(/\D/g, '');
			var x 	= Number(val);
			const newValue = numberWithCommas(x);
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					[name]: newValue
				},
				errors: {
					...prevState.errors,
					[name]: undefined
				}
			}))
		}
	}	

	const handleSubmit = () => {
		const { data } = state;
		const errors = validate(data);

		setState(prevState => ({
			...prevState,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			const deskripsiOrder = {
				berat: data.berat.replace(/\D/g, ''),
				panjang: data.panjang.replace(/\D/g, ''),
				tinggi: data.tinggi.replace(/\D/g, ''),
				lebar: data.lebar.replace(/\D/g, ''),
				isiKiriman: data.isikiriman,
				nilai: data.nilai.replace(/\D/g, ''),
				cod: data.checked,
				itemtype: data.jenisKiriman.value
			};

			props.navigation.push('KelolaPengirim', {
				deskripsiOrder
			})
		}
	}

	const validate = (data) => {
		const errors = {};
		if (!data.isikiriman) errors.isikiriman = "Isi kiriman harap dilengkapi";
		
		if (!data.nilai){
			errors.nilai = "Masukan nilai";		
		}else{
			var nilaiVal = data.nilai.replace(/\D/g, '');
			if (data.checked && parseInt(nilaiVal) < 1500) errors.nilai = "Nilai barang untuk COD minimal 1.500";
		}

		if (!data.berat) {
			errors.berat = "Masukan berat kiriman";			
		}else{
			if (data.berat <= 0)  errors.berat = "Harus lebih dari 0";
		}

		//only run when jenis kiriman = paket
		if (data.jenisKiriman === jenisOptions[0]) {
			if (!data.panjang){
				errors.panjang = "Masukan panjang kiriman";	
			}else{
				if (data.panjang <= 0){
					errors.panjang = "Harus lebih dari 0";		
				}else if (data.panjang > 50) {
					errors.panjang = "Maksimal 50";
				}
			}

			if (!data.lebar){
				errors.lebar = "Masukan lebar kiriman";	
			}else{
				if (data.lebar <= 0){
					errors.lebar = "Harus lebih dari 0";		
				}else if (data.lebar > 30) {
					errors.lebar = "Maksimal 30";
				}
			}

			if (!data.tinggi){
				errors.tinggi = "Masukan tinggi kiriman";
			}else{
				if (data.tinggi <= 0){
					errors.tinggi = "Harus lebih dari 0";		
				}else if (data.tinggi > 25) {
					errors.tinggi = "Maksimal 25";
				}
			}
		}

		return errors;
	}

	handleAsyncGiro = () => {
		setState(prevState => ({
			...prevState,
			loading: true
		}));

		const { detail, userid, norek } = props.dataLogin;

		const payload2 = {
			email: detail.email,
			account: norek
		};

		//get token
		api.generateToken(userid)
			.then(res => {
				const payload = {
					email: detail.email,
					pin: res.response_data1
				};
				api2.syncronizeUserPwd(payload)
					.then(() => { //user baru create
						completedSync(payload2);
					})
					.catch(err => {
						if (!err.respcode) {
							setState(prevState => ({
								...prevState,
								loading: false,
								invalid: {
									global: 'Sync user gagal, silahkan cobalagi'
								}
							}))
						}else{
							if(err.respcode === '21'){ //alerdy
								completedSync(payload2);
							}else{//error on sync user
								setState(prevState => ({
									...prevState,
									loading: false,
									invalid: {
										global: 'Sync user gagal, silahkan cobalagi'
									}
								}))
							}
						}
					})
			})
			.catch(err => {
				if (!err.global) {
					setState(prevState => ({
						...prevState,
						loading: false,
						invalid: {
							global: 'Untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti'
						}
					}))
				}else{
					setState(prevState => ({
						...prevState,
						loading: false,
						invalid: {
							global: err.global
						}
					}))
				}
			})
	}

	const completedSync = (payload) => {
		//add cod to web
		props.synchronizeWebGiro(payload) 
			.then(() => {
				api.searchRekeningType(props.dataLogin.norek)
					.then(res => {
						setState(prevState => ({
							...prevState,
							loading: false
						}))
					})
					.catch(err => {
						if (err.global) {
							setState(prevState => ({
								...prevState,
								invalid: {
									global: err.global
								},
								loading: false
							}))
						}else{
							setState(prevState => ({
								...prevState,
								invalid: {
									global: 'Terdapat kesalahan saat mengambil data rekening anda, fitur COD di nonaktifkan'
								},
								loading: false
							}))
						}
					})
			})
			.catch(err => {
				if (!err.respmsg) {
					setState(prevState => ({
						...prevState,
						loading: false,
						invalid: {
							global: 'Internal Server Error'
						}
					}))
				}else{
					setState(prevState => ({
						...prevState,
						loading: false,
						invalid: {
							global: err.respmsg
						}
					}))
				}
			})
	}

	const BackAction = () => (
		<TopNavigationAction 
			icon={(style) =>  <Icon {...style} name='arrow-back' fill='#FFF'/> }
			onPress={() => props.navigation.goBack()}
		/>
	);

	return(
		<View style={styles.root}>
			<Loader loading={state.loading} />
			<View style={{backgroundColor: 'rgb(240, 132, 0)'}}>
				<TopNavigation
				    leftControl={BackAction()}
				    subtitle='Kelola deskripsi kiriman'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={styles.navigation}
				    subtitleStyle={{color: '#FFF'}}
				/>
			</View>
			{ state.invalid.global && <View style={styles.form}>
				<Text>{state.invalid.global}</Text>
			</View> }
			{ state.mount ? <React.Fragment>
				{ props.dataLogin.norek !== '-' && !props.isCod && <View style={styles.form}>
					<Text>
						<Text style={styles.text}>Untuk mengaktifkan kiriman COD anda harus melakukan synchronize akun giro dahulu</Text>
						<Text style={{color: 'blue'}} onPress={handleAsyncGiro}> disini</Text>
					</Text>
				</View> }
				<View style={styles.form}>
					<FormOrder 
						value={state.data}
						onChange={handleChange}
						onSubmit={handleSubmit}
						errors={state.errors}
						options={jenisOptions}
						isCod={props.isCod}
						onChakedChange={() => setState(prevState => ({
							...prevState,
							data: {
								...prevState.data,
								checked: !prevState.data.checked
							}
						}))}
						invalid={state.invalid}
					/>
				</View>
			</React.Fragment> : <AppLoading /> }
		</View>
	);
}

Order.propTypes = {
	isCod: PropTypes.bool.isRequired,
	dataLogin: PropTypes.object.isRequired,
	setCodeToTrue: PropTypes.func.isRequired,
	synchronizeWebGiro: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		isCod: state.auth.codAktif,
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { setCodeToTrue, synchronizeWebGiro })(Order);