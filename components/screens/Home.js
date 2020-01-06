import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, AsyncStorage, ImageBackground } from 'react-native';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import Modal from "../Modal";
import PinView from 'react-native-pin-view';
import md5 from "react-native-md5";
import Constants from 'expo-constants';

class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};


	pinRef = React.createRef();
	state = {
		pin: '',
		loading: false,
		errors: {},
		localUser: {}
	}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObje 	= JSON.parse(value);
		if (!value) { //handle null
			this.setState({
				localUser: {
					email: '-',
					nama: '-',
					nohp: '-',
					pin: '-',
					userid: '-',
					username: '-'
				}
			});
		}else{
			this.setState({
				localUser: {
					email: toObje.email,
					nama: toObje.nama,
					nohp: toObje.nohp,
					pin: toObje.pinMd5,
					userid: toObje.userid,
					username: toObje.username
				}
			});
		}
	}

	// async componentDidMount(){
	// 	const payload = '440000396|malangdistro|e10adc3949ba59abbe56e057f20f883e|MARTIN NUGROHO PARAPAT|082234224784|mr.mnp007@gmail.com';
	// 	const x = payload.split('|');
	// 	const toSave = {
	// 		userid: x[0],
	// 		username: x[1],
	// 		pinMd5: x[2],
	// 		nama: x[3],
	// 		nohp: x[4],
	// 		email: x[5]
	// 	};

	// 	this.saveToStorage(toSave)
	// 		.then(() => console.log("oke"))
	// 		.catch(err => console.log(err));
	// }

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('sessionLogin', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
	}


	onComplete = (val, clear) => {
		this.setState({ loading: true });

		const { userid, nohp, email } = this.state.localUser;
		let 	imei = Constants.deviceId;
		const pinMd5 = md5.hex_md5(userid+val+nohp+email+imei+'8b321770897ac2d5bfc26965d9bf64a1');
		
		const payload = {
			param1: `${userid}|${pinMd5}|${nohp}|${email}|${imei}`
		};
		
		api.auth.login(payload)
			.then(res => {
				const { response_data4 } = res;
				const x = response_data4.split('|');
				const payload2 = {
					namaOl: x[0],
					alamatOl: x[1],
					tempatLahir: x[2],
					kodepos: x[3]
				};

				this.saveToStorage(payload2)
					.then(() => {
						this.setState({ loading: false });
						this.props.navigation.navigate({
							routeName: 'IndexSearch'
						});
					}).catch(err => {
						this.setState({ loading: false });	
						alert("Failed save data to storage");
					});
			})
			.catch(err => {
				clear();
				if (Object.keys(err).length === 10) { //handle undefined
					this.setState({ loading: false, errors: {global: err.desk_mess } });
				}else{
					this.setState({ loading: false });
				}
			});
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 
    	const { errors, loading, localUser } = this.state;
    	
		return (
			<React.Fragment>
				<ImageBackground source={require('../../assets/backgroundHome.png')} style={styles.backgroundImage}>
						<Loader loading={loading} />
						{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
						<PinView
				            onComplete={(val, clear) => this.onComplete(val, clear) }
				            pinLength={6}
				        />
						<View style={styles.link}>
							<Text>Belum memiliki akun ? daftar </Text>
							<Text 
								style={{color: 'blue'}}
								onPress={() => this.props.navigation.navigate({
					        		routeName: 'IndexRegister'
					        	})}	
							>disini</Text>
						</View>
						<Text 
							style={{color: 'blue', textAlign: 'center'}}
							onPress={() => this.props.navigation.navigate({
								routeName: 'LupaPin'
							})}
						>Lupa pin saya</Text>
			   	</ImageBackground>
		   	</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
	input: {
		paddingBottom: 5,
		paddingTop: 5
	},
	link: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	title: {
		paddingBottom: 20,
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 20
	},
	backgroundImage: {
	    flex: 1,
	    width: null,
    	height: null,
	    justifyContent : 'center',
	}
  });
  