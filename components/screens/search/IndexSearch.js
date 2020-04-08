import React from "react";
import { Button, Text, StyleSheet, View, ScrollView, StatusBar, Image, AsyncStorage, Dimensions, TouchableOpacity, Alert } from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import { SliderBox } from "react-native-image-slider-box";
import Dialog from "react-native-dialog";
import api from "../../api";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { connect } from "react-redux";
import Menu from "../Menu";
import { Notifications } from 'expo';
import Loader from "../../Loader";
import * as Permissions from 'expo-permissions';
import apiBaru from "../../apiBaru";

var device = Dimensions.get('window').width;
const heightDevice = Dimensions.get('window').height;

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

	async UNSAFE_componentWillMount(){
		const { userid } = this.props.dataLogin;
		const { email } = this.props.dataLogin.detail;
		const { status: existingStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;
		
		if (existingStatus !== 'granted') {
	        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	        finalStatus = status;
	    }

	    if (finalStatus !== 'granted') {
	        alert('Failed to get push token for push notification!');
	        return;
	    }

	    await Notifications.getExpoPushTokenAsync()
	    	.then(token => {
	    		const payload = {
	    			token,
	    			email: email,
	    			userid: userid
	    		};
	    		apiBaru.qob.pushToken(payload)
	    			.then(res => console.log(res))
	    			.catch(err => console.log(err))
	    	}).catch(err => console.log(err))
      	
	}

	// _handleNotification = notification => {
	//     // do whatever you want to do with the notification
	//     this.setState({ notification: notification });
	// }

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
	}

	onAlert = (message) => {
		Alert.alert(
		  'Apakah anda yakin?',
		  `${message}`,
		  [
		  	{
		      text: 'Batal',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Ya', onPress: () => this.generateToken()},
		  ],
		  {cancelable: false},
		);
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

	generateToken = () => {
		const { userid } = this.props.dataLogin;
		this.setState({ loading: true });
		api.auth.genpwdweb(userid)
			.then(res => {
				this.setState({ loading: false });
				setTimeout(() => {
					Alert.alert(
					  'Sukses',
					  `${res.desk_mess}`,
					  [
					  	{ text: 'Tutup', style: 'cancel' },
					  ],
					  {cancelable: false},
					);
				}, 200);
			})
			.catch(err => {
				this.setState({ loading: false });
				setTimeout(() => {
					Alert.alert(
					  'Oppps',
					  `${err.desk_mess}`,
					  [
					  	{ text: 'Tutup', style: 'cancel' },
					  ],
					  {cancelable: false},
					);
				}, 200);
			})
	}

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
				<Loader loading={this.state.loading} />
				<ScrollView>
					<SliderBox images={[
						require('../../../assets/slider/qob.jpg'),
						require('../../../assets/slider/qob2.jpg'),
						require('../../../assets/slider/qob3.png'),
						require('../../../assets/slider/qob4.jpg'),
						require('../../../assets/slider/qob5.jpg'),
					]} 
					sliderBoxHeight={heightDevice / 2.5}
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
							<Menu 
								navigation={this.props.navigation}
								showAlert={this.onAlert}
							/>  
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