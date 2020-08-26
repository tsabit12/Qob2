import React from 'react';
import { 
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Animated,
	ScrollView,
	Alert
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; 
import { Text} from 'native-base';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import md5 from "react-native-md5";
import { updatePin } from '../../actions/user';
import { loggedOut } from '../../actions/auth';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
	PebisolInfo,
	UserInfo,
	PinForm
} from './components';

const { height } = Dimensions.get('window');

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return number; 
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const Profile = props => {
	const [state, setState] = React.useState({
		bounceValue: new Animated.Value(200),
		visiblePin: false,
		loading: false
	})

	React.useEffect(() => {
		Animated.spring(state.bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      velocity: 3,
	      tension: 2,
	      friction: 8
	    }).start();	
	}, []);


	const { detail, userid } = props.user;

	const handleChangePin = (pin) => {
		setState(state => ({
			visiblePin: false,
			loading: true
		}))

		const rumusPin  	= md5.hex_md5(userid+pin+detail.nohp+detail.email+Constants.deviceId+'8b321770897ac2d5bfc26965d9bf64a1');
		const payload 		= `${userid}|${rumusPin}`;

		const saveToLocal 	= {
			userid: userid,
			username: '-',
			nama: detail.nama,
			nohp: detail.nohp,
			email: detail.email
		};

		props.updatePin(payload, pin, saveToLocal, rumusPin)
			.then(() => {
				setState(state => ({
					...state,
					loading: false
				}));

				setTimeout(function() {
					Alert.alert(
				      `NOTIFIKASI`,
				      `PIN BERHASIL DIRUBAH`,
				      [
				        { text: "OK", onPress: () => console.log("OK Pressed") }
				      ]
				    );
				}, 10);
			})
			.catch(err => {
				if (err.desk_mess) {
					setError(err.desk_mess);
				}else{
					setError('Tidak dapat memproses permintaan anda, silahkan cobalagi');
				}
			})

	}

	const setError = (msg) => {
		setState(state => ({
			...state,
			loading: false
		}));

		setTimeout(function() {
			Alert.alert(
		      `NOTIFIKASI`,
		      `${msg}`,
		      [
		        { text: "OK", onPress: () => console.log("OK Pressed") }
		      ]
		    );
		}, 10);
	}

	const handleLogout = () => {
		props.loggedOut();
		props.navigation.navigate({
            routeName: 'Home'
        })
	}

	return(
		<LinearGradient
          colors={['#e8c61e', '#ff781f']}
          style={styles.root}
          start={{x: 0, y: 0.75}} 
          end={{x: 1, y: 0.25}}
        >
			<View style={styles.header}>
				<View style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}>
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<Ionicons name="md-arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<View style={styles.title}>
						<Text style={styles.headerText}>Profile</Text>
						<Text style={styles.subtitle}>{capitalize(detail.nama)}</Text>
					</View>
				</View>

				<Menu>
					<MenuTrigger style={{width: 30, alignItems: 'center'}}>
						<Ionicons name="md-more" size={27} color="white"/>
					</MenuTrigger>
					 <MenuOptions>
				        <MenuOption onSelect={() => setState(state => ({
				        	...state,
				        	visiblePin: true
				        }))}>
				        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
				          		<Text>Ubah PIN</Text>
				          	</View>
				        </MenuOption>
				 		<MenuOption onSelect={handleLogout}>
				        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
				          		<Text>Logout</Text>
				          	</View>
				        </MenuOption>
				    </MenuOptions>
				</Menu>
			</View>
			
			<View style={styles.infoRek}>
				<View style={styles.list}>
					<Text style={styles.label}>Nomor Rekening</Text>
					<Text style={styles.subLabel}>{props.user.norek}</Text>
				</View>
				<View style={styles.list}>
					<Text style={styles.label}>Saldo</Text>
					<Text style={styles.subLabel}>{numberWithCommas(props.user.detail.saldo)}</Text>
				</View>
			</View>

			<Animated.View style={[styles.content, {transform: [{translateY: state.bounceValue }]} ]}>
				<ScrollView showsVerticalScrollIndicator={false}>
					{ userid.substring(0, 3) === '440' ? <PebisolInfo 
							detail={detail}
							userid={userid}
						/> : 
						<UserInfo 
							detail={detail}
							userid={userid}
					/> }
				</ScrollView>
			</Animated.View>

			{ state.visiblePin && 
				<PinForm 
					closePin={() => setState(state => ({
						...state,
						visiblePin: false
					}))}
					onChangePin={handleChangePin}

				/> }
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: height / 9,
		backgroundColor: 'transparent',
		paddingTop: Constants.statusBarHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 6,
		paddingRight: 6
	},
	headerText: {
		color: 'white',
		fontFamily: 'Roboto_medium',
		fontWeight: 'bold',
		fontSize: 18
	},
	title: {
		marginLeft: 15
	},
	subtitle: {
		color: 'white',
		fontSize: 13
	},
	content: {
		flex: 1,
		backgroundColor: 'white',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	infoRek: {
		margin: 7,
		marginTop: 10
	},
	label: {
		color: 'white',
		fontFamily: 'Roboto_medium',
		fontWeight: 'bold',
		fontSize: 16
	},
	subLabel:{
		color: 'white',
		// fontFamily: 'Roboto_medium',
		fontSize: 14
	},
	list: {
		marginBottom: 5
	}
})

function mapStateToProps(state) {
	return{
		user: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { updatePin, loggedOut })(Profile);