import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, AsyncStorage, ImageBackground, StatusBar } from 'react-native';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import Modal from "../Modal";
import PinView from 'react-native-pin-view';
import md5 from "react-native-md5";
import Constants from 'expo-constants';
import { setLoggedIn } from "../../actions/auth";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

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
		localUser: {
			email: '-',
			nama: '-',
			nohp: '-',
			pin: '-',
			userid: '-',
			username: '-'
		}
	}

	async componentDidMount(){
		const { session } = this.props;
		//handle after register
		//user can login without close app first
		if (Object.keys(session).length === 0) { //if session is null then call from storage
			const value 	= await AsyncStorage.getItem('qobUserPrivasi');
			const toObje 	= JSON.parse(value);
			console.log(toObje);
			if (value) { //only storage not empty
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
		}else{
			this.setState({
				localUser: {
					email: session.email,
					nama: session.nama,
					nohp: session.nohp,
					pin: session.pinMd5,
					userid: session.userid,
					username: session.username
				}
			})
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		if (nextProps.session) {
			const { session } = nextProps;
			this.setState({
				localUser: {
					email: session.email,
					nama: session.nama,
					nohp: session.nohp,
					pin: session.pinMd5,
					userid: session.userid,
					username: session.username
				}
			})
		}
	}

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
				const { response_data4, response_data1, response_data5 } = res;
				const x 	= response_data4.split('|');
				const x2 	= response_data1.split('|'); 
				// const x3 	= response_data5.split('|'); 
				const payload2 = {
					norek: x2[0],
					nama: x2[1],
					namaOl: x[0],
					alamatOl: x[1],
					kota: x[2],
					kodepos: x[3],
					saldo: response_data5
				};

				this.saveToStorage(payload2)
					.then(() => {
						this.setState({ loading: false });
						this.props.setLoggedIn(userid, x2[0]);
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
					this.setState({ loading: false, errors: {global: 'Terdapat kesalahan saat menghubungkan ke server, harap cobalagi nanti'} });
				}
			});
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 
    	const { errors, loading, localUser } = this.state;
    	// console.log(localUser);
    	
		return (
			<View style={styles.container}>
				<MyStatusBar />
				<ImageBackground source={require('../../assets/backgroundGradient.jpeg')} style={styles.backgroundImage}>
						<Loader loading={loading} />
						{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
						<PinView
				            onComplete={(val, clear) => this.onComplete(val, clear) }
				            pinLength={6}
				            buttonActiveOpacity={0.4}
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
								// routeName: 'LupaPin'
								routeName: 'Bantuan'
							})}
						>Bantuan</Text>
			   	</ImageBackground>
		   	</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		session: state.register.session
	}
}

export default connect(mapStateToProps, { setLoggedIn })(Home);

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
	},
	StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: '#ed5007'
    },
    container: {
    	flex: 1
    }
  });
  