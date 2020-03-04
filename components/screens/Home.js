import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, AsyncStorage, ImageBackground, StatusBar, Image } from 'react-native';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import Modal from "../Modal";
import PinView from 'react-native-pin-view';
import md5 from "react-native-md5";
import Constants from 'expo-constants';
import { setLoggedIn } from "../../actions/auth";
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

const slides = [
  {
    key: 'somethun',
    title: 'Apa itu QPOSin AJA?',
    text:
      'Aplikasi resmi PT Pos Indonesia (Persero) untuk melakukan pemesanan pengiriman surat atau paket yang akan dijemput oleh petugas pickup atau menyerahkan kirimannya ke loket kantor pos terdekat',
    icon: 'ios-help-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
  {
    key: 'somethun1',
    title: 'Apa Saja Kelebihannya?',
    text:
      'Pelanggan dapat melakukan sendiri entri data pengirimannya dan melakukan permintaan penjemputan kiriman dilokasi pelanggan.',
    icon: 'ios-information-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
  {
    key: 'somethun2',
    title: 'Selamat Datang',
    text: 'Jadilah pengguna QPOSin AJA sekarang juga',
    icon: 'ios-checkmark-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
];

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const RenderLoading = () => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
		<Text style={{fontFamily: 'open-sans-reg', textAlign: 'center'}}>Memuat...</Text>
	</View>
);

const TutorialView = () => (
	<View>
		<Text>Hello world</Text>
	</View>
);

const RenderPinView = ({ loading, errors, onCompletePin, onDaftar, onHelp }) => (
	<React.Fragment>
		<MyStatusBar />
		<ImageBackground source={require('../../assets/HomeScreen.png')} style={styles.backgroundImage}>
		<Loader loading={loading} />
				<PinView
		            onComplete={(val, clear) => onCompletePin(val, clear) }
		            pinLength={6}
		            buttonActiveOpacity={0.4}
		        />
				<Text 
					style={{color: 'blue', textAlign: 'center', fontFamily: 'open-sans-bold'}}
					onPress={() => onHelp()}
				>LUPA PIN</Text>
	   	</ImageBackground>
   	</React.Fragment>
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
		},
		mount: false,
		loadingMount: true
	}

	async UNSAFE_componentWillMount(){
		const value = await AsyncStorage.getItem("qobUserPrivasi");
		if (value !== null) {
			const toObje 	= JSON.parse(value);
			this.setState({ 
				mount: true, 
				loadingMount: false,
				localUser: {
					email: toObje.email,
					nama: toObje.nama,
					nohp: toObje.nohp,
					pin: toObje.pinMd5,
					userid: toObje.userid,
					username: toObje.username
				}
			});
		}else{//user not installed
			this.setState({ loadingMount: false });
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
		
		api.auth.login(payload, userid)
			.then(res => {
				const { response_data1, response_data4, response_data5 } = res;
				const x 	= response_data4.split('|');
				const x2 	= response_data1.split('|'); 

				const payload2 = {
					nama: x2[0],
					email: x2[1],
					nohp: x2[2],
					norek: x2[3],
					saldo: response_data5,
					namaOl: x[0],
					jenisOl: x[1],
					alamatOl: x[2],
					provinsi: x[3],
					kota: x[4],
					kecamatan: x[5],
					kelurahan: x[6],
					kodepos: x[7]
				};

				this.setState({ loading: false });
				this.props.setLoggedIn(userid, payload2);
			})
			.catch(err => {
				clear();
				if (err.desk_mess) { //handle undefined
					this.setState({ loading: false, errors: {global: err.desk_mess } });
				}else{
					this.setState({ loading: false, errors: {global: 'Terdapat kesalahan saat menghubungkan ke server, harap cobalagi nanti'} });
				}
			});
	}

	_renderItem = ({ item, dimensions }) => (
	    <LinearGradient
	      style={[
	        styles.mainContent,
	        {
	          flex: 1,
	          paddingTop: item.topSpacer,
	          paddingBottom: item.bottomSpacer,
	          width: dimensions.width,
	        },
	      ]}
	      colors={item.colors}
	      start={{ x: 0, y: 0.1 }}
	      end={{ x: 0.1, y: 1 }}
	    >
	      <Ionicons
	        style={{ backgroundColor: 'transparent' }}
	        name={item.icon}
	        size={200}
	        color="white"
	      />
	      <View>
	        <Text style={styles.title}>{item.title}</Text>
	        <Text style={styles.text}>{item.text}</Text>
	      </View>
	    </LinearGradient>
	);

	async removeItemValue() {
	    try {
	        await AsyncStorage.removeItem('qobUserPrivasi');
	        return true;
	    }
	    catch(exception) {
	        return false;
	    }
	}

	_onDone = () => {
		// this.setState({ mount: true });
		this.props.navigation.navigate({
			routeName: 'HomePage2'
		})	
	} 

	onLupaPin = () => {
		this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Lupa PIN',
				jenis: 1
			}
		})
	}

	onResetSession = () => {
		const test = this.removeItemValue();
		if (test) {
			alert("Oke");
			this.props.navigation.push('Home');
		}else{
			alert("Failed");
		}
	}



	render() {
    	const { errors, loading, localUser, loadingMount } = this.state;
    	// console.log(localUser);
    	
		return (
			<React.Fragment>
				{ loadingMount ? 
					<RenderLoading /> : <React.Fragment>
						{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> }
						{ this.state.mount ? 
							<View style={styles.container}>
								<RenderPinView 
									loading={loading} 
									errors={errors}
									onCompletePin={this.onComplete} 
									onDaftar={() => this.props.navigation.navigate({
						        		routeName: 'IndexRegister'
						        	})}
						        	onHelp={this.onLupaPin}
								/> 
								{ /* <Button onPress={this.onResetSession}>Reset</Button> */ }
							</View> : <AppIntroSlider
								        slides={slides}
								        renderItem={this._renderItem}
								        // bottomButton
								        showPrevButton
								        showSkipButton
								        onDone={this._onDone}
								        // hideNextButton
								        // hideDoneButton
								        // onSkip={() => console.log("skipped")}
								      /> }
					</React.Fragment>}
		   	</React.Fragment>
		);
	}
}

export default connect(null, { setLoggedIn })(Home);

const styles = StyleSheet.create({
	input: {
		paddingBottom: 5,
		paddingTop: 5
	},
	link: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	backgroundImage: {
	    flex: 1,
	    width: null,
    	height: null,
	    justifyContent : 'center',
	},
	StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: '#fca903'
    },
    container: {
    	flex: 1
    },
    mainContent: {
	    flex: 1,
	    alignItems: 'center',
	    justifyContent: 'space-around',
	  },
	image: {
	    width: 320,
	    height: 320,
	},
	text: {
	    color: 'rgba(255, 255, 255, 0.8)',
	    backgroundColor: 'transparent',
	    textAlign: 'center',
	    paddingHorizontal: 16,
	},
	title: {
	    fontSize: 20,
	    color: 'white',
	    backgroundColor: 'transparent',
	    textAlign: 'center',
	    marginBottom: 16,
	},

  });
  