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
import HomePage2 from "./HomePage2";

const slides = [
  {
    key: '1',
    title: 'Apakah  QPOSin AJA itu',
    text:'QPOSin AJA merupakan aplikasi resmi PT Pos Indonesia (Persero) yang dapat digunakan oleh para pebisol maupun seluruh masyarakat untuk '+
    	 'melakukan order pengiriman surat atau paket. Dengan aplikasi ini pelanggan dapat melakukan sendiri entri data pengirimannya '+
    	 'dan melakukan permintaan penjemputan kiriman dilokasi pengiriman/pelanggan. Kiriman langsung dijemput oleh petugas pickup ' +
    	 '(Oranger & Faster) ke lokasi pengirim yang melakukan order.',
    icon: 'ios-help-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
  {
    key: '2',
    title: 'Apa keuntungan \n penggunaan QPOSin AJA',
    text:
      '1. Pebisol atau masyarakat pengguna jasa Pos dapat melalukan permintaan penjemputan kiriman ke lokasi dimana kiriman akan dikirimkan tanpa harus datang ke kantor pos/agenpos. \n' +
      '2. Tidak ada biaya tambahan untuk penjemputan kiriman ke lokasi pengirim. \n' +
      '3. Kiriman dapat dilacak setiap saat oleh pengirim. \n'+
      '4. Kiriman cepat sampai di alamat penerima karena waktu pengiriman maksimal 2 (dua) hari.',
    icon: 'ios-information-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
  {
    key: '3',
    title: 'Variasi produk apa saja \n yang dimiliki oleh QPOSin AJA',
    text: 
    	'• Produk Paket Pos Kilat Khusus \n'+
    	'• Produk Q9 \n'+
    	'• Produk Q-Comm Barang \n' +
    	'• Produk Q-Comm Dokumen',
    icon: 'ios-checkmark-circle-outline',
    colors: ['#e8c61e', '#ff781f'],
  },
  {
    key: '4',
    title: 'Fasilitas dan Fitur apa saja \n yang ada di QPOSin AJA',
    text: 
    	'1. Fasilitas order booking kiriman dan permintaan penjemputan kiriman \n'+
    	'2. Fasilitas Monitoring riwayat penjemputan yang dilengkapi dengan Map. \n'+
    	'3. Fasilitas jejak lacak kiriman \n' +
    	'4. Fasilitas chek tarif kiriman',
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
		loadingMount: true,
		done: false
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
		
		console.log(payload);
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
				this.props.setLoggedIn(userid, payload2, val);
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
		this.setState({ done: true });
		// this.props.navigation.navigate({
		// 	routeName: 'HomePage2'
		// })	
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
    	const { errors, loading, localUser, loadingMount, done } = this.state;
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
							</View> : 
								<React.Fragment>
									{ done ? <HomePage2 navigation={this.props.navigation} /> :
										<AppIntroSlider
									        slides={slides}
									        renderItem={this._renderItem}
									        showPrevButton
									        showSkipButton
									        onDone={this._onDone}
									        // onSkip={() => console.log("skipped")}
									      /> }
								</React.Fragment> }
					</React.Fragment> }
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
  