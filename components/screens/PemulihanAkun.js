import React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, AsyncStorage, StatusBar, Alert } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Button, Input, TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import Loader from "../Loader";
import api from "../api";
import Modal from "../Modal";
import Dialog from "react-native-dialog";
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { saveRegister, saveRequest, clearRequestStore } from "../../actions/register";
import { setLocalUser } from "../../actions/user";
import { Header } from 'react-navigation-stack';
import { curdate } from "../utils/helper";

// const Judul = ({ navigation }) => (
// 	<View>
// 		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, fontWeight: '700'}}>{navigation.state.params.titlePemulihan}</Text>
// 	</View>
// );

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
}

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='black' />
);

const MessageSucces = ({ message, visible, backHome }) => (
	<View>
        <Dialog.Container visible={true}>
          <Dialog.Description>
          	{ message }
          </Dialog.Description>
          <Dialog.Button label="Tutup" onPress={() => onPress()} />
          <Dialog.Button 
          	label="Login" 
          	onPress={() => backHome() } />
        </Dialog.Container>
    </View>
);

class PemulihanAkun extends React.Component{
	useridRef = React.createRef();
	namaRef = React.createRef();
	nohpRef = React.createRef();
	emailRef = React.createRef();
	kodeRef = React.createRef();

	state = {
		data: {
			userid: '',
			nama: '',
			nohp: '',
			email: '',
			imei: Constants.deviceId
		},
		errors: {},
		loading: false,
		success: {
			status: false,
			message: ''
		},
		visible: false,
		kode: '',
		jenis: this.props.navigation.state.params.jenis
	}

	async componentDidMount(){
		const curdateVal 			= curdate();
		const { jenis, titlePemulihan } = this.props.navigation.state.params;
		let requestValueStore 		= [];
		const { historyReqStore } 	= this.props;
		if (historyReqStore.length > 0) {
			requestValueStore = historyReqStore;
		}else{ //then call from storage
			const value 		= await AsyncStorage.getItem('historyRequest');
			const toJson 		= JSON.parse(value); 
			if (toJson !== null) {
				requestValueStore = toJson;
			}else{
				requestValueStore = [];
			}
		}

		if (requestValueStore.length > 0) { 
			//make sure we only get the latest data
			const getOnlyCurdate = requestValueStore.filter(x => x.curdate === curdateVal);
			if (getOnlyCurdate.length > 0) {
				//i think it's must be one array
				//so we get only first array
				//dont need map here
				const firstDataInStorage = getOnlyCurdate[0]; 
				const jenisStorage 		 = firstDataInStorage.jenis;
				if (jenisStorage === jenis) { //cause this page divided by 3 action so handle it by type
					let valueStorage = firstDataInStorage.value;
					this.setState({
						data: {
							...this.state.data,
							userid: valueStorage.userid,
							email: valueStorage.email,
							nama: valueStorage.nama,
							nohp: valueStorage.nohp
						},
						success: {
							...this.state.success,
							status: true,
							message: `Kami mendeteksi bahwa anda sudah melakukan request ${titlePemulihan} sebelumnya. Silahkan masukan kode verifikasi dibawah ini`
						},
					})
				}
			}
		}
	}


	onChange = (e, { name }) => {
		if (name === 'nohp') {
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = numberWithCommas(x);

			this.setState({ 
				data: { ...this.state.data, [name]: value },
				errors: { ...this.state.errors, [name]: undefined }
			})
		}else{
			this.setState({ 
				data: { ...this.state.data, [name]: e },
				errors: { ...this.state.errors, [name]: undefined }
			})
		}
	}

	onSubmit = () => {
		let jenis		= this.state.jenis;
		const errors = this.validate(this.state.data, jenis);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });

			const { data } 	= this.state;
			const { titlePemulihan } = this.props.navigation.state.params;
			const phoneValues  = `0${data.nohp.replace(/\D/g, '')}`;

			const valueSession = {
				userid: data.userid,
				nama: data.nama,
				nohp: phoneValues,
				email: data.email,
				jenis: jenis
			};

			//need to detect if user
			//alerady submit request form 1 (request pemulihan)
			const payload = {
				param1: `${data.userid}|${data.nama}|${phoneValues}|${data.email}|${data.imei}|${jenis}`	
			};
			
			api.registrasi.lupaPin(payload, data.userid)
				.then(res => {
					this.saveSessionRequest(valueSession);
					this.setState({ 
						loading: false, 
						visible: true, 
						success: {
							...this.state.success,
							status: true,
							message: `Response status(${res.rc_mess}) \nRequest ${titlePemulihan} berhasil/sukses, anda hanya tinggal menunggu kode verifikasi`
						}
					});
				}).catch(err => {
					console.log(err);
					if (Object.keys(err).length === 10) {
						this.setState({ 
							loading: false, 
							errors: { 
								global: `Response status(${err.rc_mess}) \nHarap pastikan bahwa data yang dientri sudah sesuai`
							} 
						});
					}else{
						this.setState({ 
							loading: false, 
							errors: {
								global: 'Untuk sementara kami mengalami masalah saat menghubungkan ke server, harap cobalagi nanti'
							}
						});
					}
				})
		}
	}

	validate = (data, jenis) => {
		const errors = {};
		if (jenis === 0) errors.jenis = "Jenis belum dipilih";
		if (!data.userid) errors.userid = "Masukan userid";
		if (!data.nama) errors.nama = "Masukan nama";
		if (!data.email){
			errors.email = "Masukan email";	
		}else{
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(data.email)) errors.email = "Email tidak valid";
		}

		if (!data.nohp){
			errors.nohp = "Masukan nomor handphone";	
		}else{
			var regex 			= /(\()?(\+62|62|0)(\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/;
  			const phoneValues 	= `+62-${data.nohp}`;
  			if (!regex.test(phoneValues)) errors.nohp = "Nomor handphone tidak valid"; 
		}

		return errors;
	}

	onBackHome = () => {
		this.setState({ visible: false });
		setTimeout(() => {
			this.props.navigation.push('Home');
		}, 100);	
	}

	onChangeKode = (e) => this.setState({ kode: e })

	async saveSessionRequest(value){
		const { jenis } 	= this.state;
		const curdateVal 	= curdate();
		AsyncStorage.getItem('historyRequest')
			.then(res => {
				res = res == null ? [] : JSON.parse(res);
				res.push({
					jenis: jenis,
					status: true,
					curdate: curdateVal,
					value: value
				});
				//handle not closing app
				//after request by save to redux store
				this.props.saveRequest(res);
				return AsyncStorage.setItem('historyRequest', JSON.stringify(res))
			})
	}

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
	}

	async removeSession(){
		try{
			await AsyncStorage.removeItem('historyRequest')
			this.props.clearRequestStore();
      		return Promise.resolve(true);
		}catch(errors){
			return Promise.reject(errors);
		}
	}

	onVerfikasi = () => {		
		const errors = this.validateKode(this.state.kode);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			
			const { data, kode } 	= this.state;
			let jenis 				= this.state.jenis;

 			const payload = {
				param1: `${data.userid}|${data.nama}|${data.nohp}|${data.email}|${data.imei}|${kode}|${jenis}`
			};
			api.auth.verifikasi(payload, data.userid)
				.then(res => {
					const { response_data2 } = res;
					let parsing = response_data2.split('|');
					const payloadRes = {
						userid: parsing[0],
						username: parsing[1],
						pinMd5: parsing[2],
						nama: parsing[3],
						nohp: parsing[4],
						email: parsing[5]
					};

					//save to redux for handle 
					//user login after pemulihan
					//without close app
					this.props.setLocalUser(payloadRes);
					
					setTimeout(() => {
						this.saveToStorage(payloadRes)
						.then(() => {
							this.setState({ loading: false });
							this.showMessage(res.response_data1);
							this.props.saveRegister(payloadRes);
							this.removeSession();
						})
						.catch(() => alert("Kami mengalami masalah saat menyimpan data. harap cobalagi dalam 24 jam"));
					}, 100);

				}).catch(err => {
					this.setState({ loading: false });
					if (Object.keys(err).length === 10) {
						alert(err.desk_mess);
					}else{
						alert("Tidak dapat terhubung ke server, harap periksa koneksi internet anda");
					}
					
				});	
		}
	}

	showMessage = (message) => {
		Alert.alert(
		  'Notifikasi',
		  `${message}`,
		  [
		  	{
		      text: 'Tutup',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Login', onPress: () => this.props.navigation.push('Home')},
		  ],
		  {cancelable: false},
		);
	}

	validateKode = (kode) => {
		const errors = {};
		if (!kode) errors.kode = "Masukan kode verifikasi";
		return errors;
	}

	onsetSelectedOption = (e) => this.setState({ jenis: e.value })

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	);

	render(){
		const { data, errors, loading, success } = this.state;

		return(
			<KeyboardAvoidingView 
				behavior="padding" 
				enabled
				style={{flexGrow:1}} 
			>
				<View style={{flex: 1}}>
					<MyStatusBar />
					<TopNavigation
					    leftControl={this.BackAction()}
					    title={this.props.navigation.state.params.titlePemulihan}
					    alignment='start'
					    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
					    style={{backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}}
					/>
					<Loader loading={loading} />
					{ /* success.statusVer && <MessageSucces 
							message={success.messageVer} 
							visible={visible} 
							backHome={this.onBackHome}
						/> */ }
					{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
					<ScrollView>
							{ !success.status ? <React.Fragment>
								<View style={styles.form}>
									<Input 
										label='Userid'
										ref={this.useridRef}
										labelStyle={styles.label}
										placeholder='Masukan userid anda'
										onChangeText={(e) => this.onChange(e, this.useridRef.current.props)}
										style={styles.input}
										value={data.userid}
										name='userid'
										keyboardType='numeric'
										onSubmitEditing={() => this.namaRef.current.focus() }
										status={errors.userid && 'danger'}
									/>
									{ errors.userid && <Text style={styles.labelErr}>{errors.userid}</Text>}
									<Input 
										label='Nama Lengkap'
										ref={this.namaRef}
										labelStyle={styles.label}
										placeholder='Masukan nama lengkap'
										onChangeText={(e) => this.onChange(e, this.namaRef.current.props)}
										style={styles.input}
										value={data.nama}
										name='nama'
										onSubmitEditing={() => this.nohpRef.current.focus() }
										status={errors.nama && 'danger'}
									/>
									{ errors.nama && <Text style={styles.labelErr}>{errors.nama}</Text>}
									<View>
										<Text style={[styles.label, {paddingBottom: 4}]}>Nomor Handphone</Text>
										<View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 5}}>
											<Text style={{fontSize: 16}}>+62</Text>
											<Input 
												// label='Nomor Handphone'
												ref={this.nohpRef}
												// labelStyle={styles.label}
												placeholder='8XX-XXXX-XXXX'
												onChangeText={(e) => this.onChange(e, this.nohpRef.current.props)}
												style={{ flex: 1, marginLeft: 5 }}
												value={data.nohp}
												name='nohp'
												onSubmitEditing={() => this.emailRef.current.focus() }
												status={errors.nohp && 'danger'}
												keyboardType='numeric'
											/>
										</View>
										{ errors.nohp && <Text style={styles.labelErr}>{errors.nohp}</Text>}
									</View>
									
									<Input 
										label='Email'
										ref={this.emailRef}
										labelStyle={styles.label}
										placeholder='Masukan email anda'
										onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
										style={styles.input}
										value={data.email}
										name='email'
										onSubmitEditing={() => this.onSubmit() }
										status={errors.email && 'danger'}
										keyboardType='email-address'
										autoCapitalize='none'
									/>
									{ errors.email && <Text style={styles.labelErr}>{errors.email}</Text>}
								</View>
								<Button status='info' onPress={this.onSubmit} style={{margin: 5}}>
									{ this.state.jenis === 1 && 'Dapatkan PIN Baru' }
									{ this.state.jenis === 2 && 'Pulihkan' }
									{ this.state.jenis === 3 && 'Buka kembali akun saya' }
								</Button>
							</React.Fragment> : <View style={{margin: 10}}>
								<View style={{backgroundColor: '#c7e4eb', padding: 5, borderRadius: 3}}>
									<Text style={{fontFamily: 'open-sans-reg'}}>{success.message}</Text>
								</View>
								<Input 
									ref={this.kodeRef}
									labelStyle={styles.label}
									placeholder='Masukan kode verifikasi disini'
									style={{ marginTop: 20 }}
									value={this.state.kode}
									name='kode'
									keyboardType='numeric'
									maxLength={6}
									onChangeText={this.onChangeKode}
									status={errors.kode && 'danger'}
								/>
								{ errors.kode && <Text style={{fontSize: 12, color: 'red'}}>{errors.kode}</Text>}
								<Button status='info' style={{marginTop: 4}} onPress={this.onVerfikasi}>Verifikasi</Button>
							</View> }
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

function mapStateToProps(state) {
	return{
		historyReqStore: state.auth.request
	}
}

export default connect(mapStateToProps, { saveRegister, saveRequest, clearRequestStore, setLocalUser })(PemulihanAkun);

const styles = StyleSheet.create({
	label: {
		color: 'black',
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	input: {
		paddingBottom: 10
	},
	labelErr: {
		color: 'red',
		fontSize: 12,
		marginTop: -10,
		paddingBottom: 5
	},
	StatusBar: {
	  	height: Constants.statusBarHeight,
	  	backgroundColor: '#FFF'
	},
	form: {
		margin: 5,
		padding: 10,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#c9d1d1'
	}
});