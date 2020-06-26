import React from "react";
import { View, Text, StatusBar, KeyboardAvoidingView, ScrollView, Alert, AsyncStorage } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, Input, Button } from '@ui-kitten/components';
import OrderForm from "./forms/OrderForm";
import { connect } from "react-redux";
import Dialog from "react-native-dialog";
import Loader from "../../Loader";
import { synchronizeWebGiro, setCodeToTrue } from "../../../actions/auth";
import api from "../../api";
import apiBaru from "../../apiBaru";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


class Order extends React.Component{
	state = {
		visible: false,
		loading: false,
		textLoading: 'Loading...',
		errors: {},
		update: false
	}

	async componentDidMount(){
		//only run when codAkitf is false
		const { isCod } = this.props;
		if (!isCod) {
			//get from storage
			//I sure this is will having issue when user clear data app
			try{
				const value = await AsyncStorage.getItem('isCod');
				if (value !== null) {
					this.props.setCodeToTrue();
					//handle validasi when cod not yet fetched
					this.validasiCod(this.props.dataLogin.norek);
				}
			}catch(error){
				console.log("ok");
			}
		}else{ 
			this.validasiCod(this.props.dataLogin.norek);
		}
	}

	// //this will run on user first open app
	// UNSAFE_componentWillReceiveProps(nextProps){
	// 	console.log(nextProps.cod);
	// 	if (nextProps.cod) {
	// 		console.log("oke runnnnn");
	// 	}
	// }

	validasiCod = (norek) => {
		this.setState({
			loading: true
		});

		api.search.rekeningType(norek)
			.then(res => {
				this.setState({ loading: false });	
			})
			.catch(err => {
				if (!err.global) {
					this.setState({ 
						loading: false,
						errors: {
							global: 'Terdapat kesalahan saat mengambil data rekening anda, fitur COD di nonaktifkan'
						}
					});
				}else{
					this.setState({ 
						loading: false,
						errors: err
					});
				}
			})
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (data) => {
		const deskripsiOrder = {
			berat: data.berat.replace(/\D/g, ''),
			panjang: data.panjang.replace(/\D/g, ''),
			tinggi: data.tinggi.replace(/\D/g, ''),
			lebar: data.lebar.replace(/\D/g, ''),
			isiKiriman: data.jenis,
			nilai: data.nilaiVal.replace(/\D/g, ''),
			codvalue: data.codvalue.replace(/\D/g, ''),
			cod: data.checked,
			itemtype: data.itemtype
		};
			
		this.props.navigation.push('KelolaPengirim', {
			deskripsiOrder
		})
	}

	// keyboardDidShow = (event) => {
	// 	//only set when backdrop is open
	// 	if (this.state.visible) {
	// 		this.setState({ keyboard: { open: true, height: event.endCoordinates.height } })
	// 	}
	// }

	// keyboardDidHide = () => {
	// 	if (this.state.visible) {
	// 		this.setState({ keyboard: { open: false, height: 0 } })
	// 	}
	// }

	onSynchronize = () => {
		this.setState({ loading: true, visible: false, textLoading: 'Getting token...' });
		const { norek, detail, userid } = this.props.dataLogin;
		const payload = {
			email: detail.email,
			account: norek
		}
		//jancuk
		//generate pin dulu
		api.auth.genpwdweb(userid)
			.then(res => {
				const payload2 = {
					email: detail.email,
					pin: res.response_data1
				};
				this.setState({ textLoading: 'Synchronizing user...'})
				apiBaru.qob.syncronizeUser(payload2)
					.then(res => { //response = 00 artinya user baru create
						this.syncGiro(payload);
					})
					.catch(err => {
						if (!err.respcode) {
							this.setState({ loading: false });
							//lebih ke internal server
							this.showAlert('Sync user gagal, silahkan cobalagi', 'Failed');
						}else{
							if(err.respcode === '21'){ //alerdy
								this.syncGiro(payload);
							}else{//error on sync user
								this.setState({ loading: false });
								this.showAlert('Sync user gagal, silahkan cobalagi', 'Failed');
							}
						}
					})
			})
			.catch(err => { //generate pin error
				this.setState({ loading: false, textLoading: 'Loading...'});
				if (!err.desk_mess) {
					this.showAlert('Untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti','Terdapat kesalahan');
				}else{
					this.showAlert(err.desk_mess, 'Whooppps');
				}
			})
	}

	syncGiro = (payload) => {
		this.setState({ textLoading: 'Menyiapkan...'});
		this.props.synchronizeWebGiro(payload)
			.then(() => {
				//cek rekening (without test) :p
				api.search.rekeningType(this.props.dataLogin.norek)
					.then(res => {
						this.setState({ loading: false });	
						this.showAlert('Untuk order kiriman dengan fitur cod silahkan centang kolom COD', 'Sukses/Berhasil');
					})
					.catch(err => {
						if (!err.global) {
							this.setState({ 
								loading: false,
								errors: {
									global: 'Terdapat kesalahan saat mengambil data rekening anda, fitur COD di nonaktifkan'
								}
							});
						}else{
							this.setState({ 
								loading: false,
								errors: err
							});
						}
					})
				
			})
			.catch(err => {
				this.setState({ loading: false });
				if (!err.respmsg) {
					this.showAlert('Internal Server Error', 'Failed');
				}else{
					this.showAlert(err.respmsg, 'Failed');
				}
			})
	}

	showAlert = (msg, title) => {
		Alert.alert(
		  `${title}`,
		  `${msg}`,
		  [
		  	{
		      text: 'Tutup',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	render(){
		const { visible, loading, textLoading } = this.state;
		const { norek } = this.props.dataLogin;

		return(
			<View style={{flex: 1}}>
				{ /* this view for hide status bar color */ }
				<Loader loading={loading} messagenya={textLoading} /> 
				<View style={{backgroundColor: 'rgb(240, 132, 0)'}}>
					<TopNavigation
					    leftControl={this.BackAction()}
					    subtitle='Kelola deskripsi kiriman'
					    title='Order'
					    alignment='start'
					    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
					    style={styles.navigation}
					    subtitleStyle={{color: '#FFF'}}
					/>
				</View>
				{ norek !== '-' && !this.props.isCod && <View style={styles.notif}>
					<Text>
						<Text>Untuk mengaktifkan kiriman COD anda harus melakukan synchronize akun giro dahulu</Text>
						<Text style={{color: 'blue'}} onPress={() => this.setState({ visible: true })}> disini</Text>
					</Text>
				</View> }
				<KeyboardAvoidingView
					style={{flex:1}} 
					behavior="padding" 
					enabled
				>
					<ScrollView keyboardShouldPersistTaps='always'>	
						<OrderForm 
							onSubmit={this.onSubmit} 
							isCod={this.props.isCod} 
							invalid={this.state.errors}
						/>
					</ScrollView>
				</KeyboardAvoidingView>
				<View>
				<Dialog.Container visible={visible}>
		          <Dialog.Title>Notifikasi</Dialog.Title>
		          <Dialog.Description>
		            {`Proses synchronize akun ini hanya sekali saja, yaitu untuk membuka fitur baru COD pada aplikasi QPOSin AJA`}
		          </Dialog.Description>
		          <Dialog.Button label="Batal" onPress={() => this.setState({ visible: false })} />
		          <Dialog.Button label="Lanjutkan" onPress={this.onSynchronize} />
		        </Dialog.Container>
		        </View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin,
		isCod: state.auth.codAktif //bool
	}
}

export default connect(mapStateToProps, { synchronizeWebGiro, setCodeToTrue })(Order);