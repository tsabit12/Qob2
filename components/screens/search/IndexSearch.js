import React from "react";
import { Button, Text, StyleSheet, View, ScrollView, StatusBar, Image, AsyncStorage, Dimensions, TouchableOpacity, Alert } from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import Menu from "../Menu";
import { SliderBox } from "react-native-image-slider-box";
import Dialog from "react-native-dialog";
import api from "../../api";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { connect } from "react-redux";
import MenuNotMember from "../MenuNotMember";
import { Notifications } from 'expo';

import registerForPushNotificationsAsync from "../../../registerForPushNotificationsAsync";

var device = Dimensions.get('window').width;

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const CameraIcon = (style) => (
	<Icon {...style} name='camera-outline' fill='#FFF'/>	
);

const ProfileIcon = (style) => (
	<Icon {...style} name='person' fill='#FFF'/>
);

const SearchIcon = (style) => (
	<Icon {...style} name='search-outline' fill='#FFF'/>
);

const CameraBarcodeAction = (props) => (
  <TopNavigationAction {...props} icon={CameraIcon}/>
);

const ProfileAction = (props) => (
  <TopNavigationAction {...props} icon={ProfileIcon}/>
);

const SearchAction = (props) => (
  <TopNavigationAction {...props} icon={SearchIcon}/>
);

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}


const RenderSaldo = ({ saldo }) => (
	<View 
		style={{
			marginLeft: 10, 
			marginRight: 10, 
			padding: 5, 
			marginTop: 10, 
			flexDirection: 'row', 
			borderWidth: 0.8, 
			alignItems: 'center', 
			justifyContent: 'center',
			borderRadius: 5,
			borderColor: '#b5b0b0'
		}}
	>
		<Image source={require('../../../assets/giro.png')} style={{width: 25, height: 25}} />
		<Text style={{marginLeft: 5, fontFamily: 'open-sans-bold', color: '#8c8c8c'}}>Rp {numberWithCommas(saldo)}</Text>
	</View>
);

class IndexSearch extends React.Component{
	state = {
		loading: false,
		show: false,
		userid: '',
		msgModal: '',
		titleModal: '',
		success: '00',
		user: {
			nama: '',
			sisaSaldo: ''
		},
		notification: {}
	}

	async componentDidMount(){
		const { userid } = this.props.dataLogin;
		// console.log(this.props.dataLogin);
		registerForPushNotificationsAsync(userid);

		const value = await AsyncStorage.getItem('sessionLogin');
		const toObj = JSON.parse(value);
	    const nama  = toObj.nama.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	    const saldo = toObj.saldo;
	    
	    this.setState({
	    	user: {
		    	nama: nama,
		    	sisaSaldo: saldo
	    	}
	    });
	}

	// _handleNotification = notification => {
	//     // do whatever you want to do with the notification
	//     this.setState({ notification: notification });
	// }

	onGeneratePwd = () => {
		const { userid } = this.state;
		if (userid) {
			this.setState({ loading: true, show: false });
			api.auth.genpwdweb(userid)
				.then(res => this.setState({
					loading: false, 
					show: true, 
					titleModal: 'Berhasil', 
					success: '200',
					msgModal: `Harap diingat, password web anda adalah ${res.response_data1}`
				}))
				.catch(err => {
					console.log(err);
					this.setState({
						loading: false,
						show: true,
						titleModal: 'Gagal',
						success: '500',
						msgModal: 'Terdapat kesalahan'
					})
				})
		}
	}

	onCameraPress = () => {
		this.props.navigation.navigate({
			routeName: 'Barcode'
		})
	}

	renderLeftControl = () => (
		<CameraBarcodeAction onPress={this.onCameraPress}/>
	)

	renderRightControls = () => {
		const { userid } = this.props.dataLogin;
		// if (userid.substring(0, 3) === '540') {
			return(
					<ProfileAction onPress={() => 
						this.props.navigation.navigate({ 
							routeName: 'Account', 
							params: {
								namaLengkap:  this.state.user.nama,
								saldo: this.state.user.sisaSaldo
							} 
						})} 
					/>
			);
		// }else{
		// 	return(
		// 		[
		// 			<SearchAction onPress={() => this.props.navigation.navigate({ routeName: 'DetailSearch'})} />,
		// 			<ProfileAction onPress={() => 
		// 				this.props.navigation.navigate({ 
		// 					routeName: 'Account', 
		// 					params: {
		// 						namaLengkap:  this.state.user.nama,
		// 						saldo: this.state.user.sisaSaldo
		// 					} 
		// 				})} 
		// 			/>
		// 		]
		// 	)
		// }
	}

	//next
	// onGiroPress = () => {
	// 	Alert.alert(
	// 	  'Notifikasi',
	// 	  'Apakah anda sudah mempunyai rekening giro?',
	// 	  [
	// 	  	{
	// 	      text: 'Tutup',
	// 	      onPress: () => console.log('Cancel Pressed'),
	// 	      style: 'cancel',
	// 	    },
	// 	    {text: 'Daftar Baru', onPress: () => this.belumPunyaRek()},
	// 	    {text: 'Sudah', onPress: () => this.sudahPunyaRek()},
	// 	  ],
	// 	  {cancelable: false},
	// 	);
	// }

	onGiroPress = () => {
		Alert.alert(
		  'Notifikasi',
		  'Apakah anda yakin untuk menghubungkan ke rekening giro?',
		  [
		  	{
		      text: 'Batal',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Ya', onPress: () => this.sudahPunyaRek()},
		  ],
		  {cancelable: false},
		);
	}

	sudahPunyaRek = () => {
		this.props.navigation.navigate({
			routeName: 'ValidasiRekening'
		})
	}
 
	render(){
		const { show, msgModal, titleModal, success } = this.state;
		const { userid, norek } = this.props.dataLogin;

		return(
			<View style={{flex: 1, backgroundColor: '#f7f5f0'}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.renderLeftControl()}
				    title='QPOSin AJA'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', fontSize: 19, fontWeight: '700', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    rightControls={this.renderRightControls()}
				/>
				<React.Fragment>
					{ show && <Dialog.Container visible={true}>
						<Dialog.Title>{titleModal}</Dialog.Title>
						<Dialog.Description>
							{msgModal}
						</Dialog.Description>
						<Dialog.Button 
							label="Tutup" 
							onPress={() => this.setState({ 
								show: false, 
								userid: '',
								success: '00'
							})}
						/>
						{ success === '00' && <Dialog.Button 
							label="Ya" 
							onPress={this.onGeneratePwd} 
						/> }
					</Dialog.Container> }
				</React.Fragment>
				<ScrollView>
				<SliderBox images={[
					require('../../../assets/qob.jpg'),
					require('../../../assets/qob2.jpg'),
					require('../../../assets/qob3.jpg')
				]} 
				sliderBoxHeight={device*0.6}
				resizeMode={'stretch'}
				circleLoop
				autoplay={true}
				paginationBoxStyle={{
					alignItems: "center",
					alignSelf: "center",
					justifyContent: "center",
				  }}
				/>
					<View style={{flex: 1, justifyContent: 'flex-end'}}>

					{ norek === '-' ?  <TouchableOpacity 
						style={{
							marginLeft: 10, 
							marginRight: 10, 
							padding: 5, 
							marginTop: 10, 
							flexDirection: 'row', 
							borderWidth: 0.8, 
							alignItems: 'center', 
							justifyContent: 'center',
							borderRadius: 5,
							borderColor: '#b5b0b0'
						}}
						onPress={this.onGiroPress}
					>
						<Image source={require('../../../assets/giro.png')} style={{width: 25, height: 25}} />
						<Text style={{marginLeft: 5, fontFamily: 'open-sans-bold', color: '#8c8c8c'}}>Hubungkan ke akun giro</Text>
					</TouchableOpacity> : <RenderSaldo saldo={this.props.dataLogin.detail.saldo} /> }
					
						<MenuNotMember 
							navigation={this.props.navigation}
						/>  
						{ /* <Menu 
							navigation={this.props.navigation} 
							loading={this.state.loading}
							onShowModal={(userid) => this.setState({ 
								show: true, 
								userid: userid,
								msgModal: 'Apakah anda yakin untuk generate password web anda?',
								titleModal: 'Notifikasi'
							})}
						/> */ }
					</View>
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(IndexSearch);