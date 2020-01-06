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

const fuckingResponse = '440000370|09755027ff7ac792bba13fe05ac69472|YUYUS NURKAMAL|087736967892|tsabit830@gmail.com|-|-';


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
		const value = await AsyncStorage.getItem('qobUserPrivasi');
		const toObje = JSON.parse(value);
		// console.log(toObje);
		if (!value) { //handle null
			this.setState({
				localUser: {
					email: '-',
					nama: '-',
					nohp: '-',
					pin: '-',
					userid: '-',
					imei: '-',
					norek: '-'
				}
			});
		}else{
			this.setState({
				localUser: {
					email: toObje.email,
					nama: toObje.nama,
					nohp: toObje.nohp,
					pin: toObje.pin,
					userid: toObje.userid,
					imei: toObje.imei,
					norek: toObje.norek
				}
			});
		}
		// const gob = fuckingResponse.split('|');
		// const payload = {
		// 	email: gob[4],
		// 	nohp: gob[3],
		// 	nama: gob[2],
		// 	pin: gob[1],
		// 	userid: gob[0],
		// 	imei: gob[5],
		// 	norek: gob[6]
		// }

		// // console.log(payload);
		// this.saveToStorage(payload)
		// 	.then(() => console.log("oke"));
	}

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
	}


	onComplete = (val, clear) => {
		this.setState({ loading: true });

		const { userid, nohp, email, imei, norek, pin  } = this.state.localUser;
		//val --> pin input
		//pin --> response register (local storage)
		const pinMd5 = md5.hex_md5(userid+val+nohp+email+email+pin);
		// console.log(pinMd5);
		
		const payload = {
			param1: `${userid}|${pinMd5}|${nohp}|${email}|${Constants.deviceId}|0000000042`
		};
		console.log(payload);
		api.auth.login(payload)
			// .then(res => {
			// 	this.setState({ loading: false });
			// 	this.props.navigation.navigate({
			// 		routeName: 'IndexSearch'
			// 	});
			// })
			// .catch(err => {
			// 	clear();
			// 	if (Object.keys(err).length === 10) { //handle undefined
			// 		this.setState({ loading: false, errors: {global: err.desk_mess } });
			// 	}else{
			// 		this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, harap cobalagi nanti'}});
			// 	}
			// 	this.props.navigation.navigate({
			// 		routeName: 'IndexSearch'
			// 	});
			// });
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
  