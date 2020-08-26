import React from "react";
import { 
	View, 
	Dimensions, 
	StyleSheet, 
	KeyboardAvoidingView, 
	Keyboard,
	Animated,
	TouchableOpacity,
	BackHandler,
	Modal
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { ApiOrder, ApiYuyus } from "../../api";
import { Toast, Icon, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import { calculateSaldo } from '../../actions/user';

import {
	InputView,
	AppLoading,
	MarkerLabel,
	ResultOrder,
	EditView,
	CartView
} from './components';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE = -6.9160014;
const LONGITUDE = 107.6571561;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

var currentView = 'map';

const ErrorPermissionView = props => {
	return(
		<View style={styles.error}>
			<View style={styles.box}>
				<Text style={styles.textError}>Anda harus mengaktifkan GPS terlebih dahulu untuk menggunakan fitur ini</Text>
				<Button size='small' style={{marginTop: 10}} onPress={props.getLocation}>AKTIFKAN LOKASI</Button>
			</View>
		</View>
	);
}

const CityCourier = props => {
	const [ region ] = React.useState(new AnimatedRegion({
		latitude: LATITUDE,
		longitude: LONGITUDE,
		latitudeDelta: 0,
    	longitudeDelta: 0,
	}))

	const [regionReceiver] = React.useState(new AnimatedRegion({
		latitude: LATITUDE,
		longitude: LONGITUDE,
		latitudeDelta: 0,
    	longitudeDelta: 0
	}))

	const [state, setState] = React.useState({
		location: {
			latitude: LATITUDE,
			longitude: LONGITUDE,
			latitudeDelta: LATITUDE_DELTA,
			longitudeDelta: LONGITUDE_DELTA
		},
		addres: {},
		loading: true,
		locationIsEnabled: false,
		mount: false,
		keyboardVisible: false,
		sender: {},
		receiver: {},
		kiriman: {},
		errors: {},
		moveMarker: 'sender',
		positionInput: new Animated.Value(200),
		opacityInput: new Animated.Value(1),
		modalVisible: false,
		routeForMap: [],
		jarak: 0,
		tarif: 0,
		update: false,
		cart: false,
		mountKeyboard: false,
		success: false,
		positionMessage: new Animated.Value(200)
	})

	const { location, addres, positionInput } = state;

	React.useEffect(() =>  {
		(async () => {
			setPositionInput();
			let { status } = await Location.requestPermissionsAsync();
			if (status === 'granted') {
				handleGetLocation();	
			}
		})();
	}, [])

	React.useEffect(() => {
		if (state.mount) {
			setState(state => ({
				...state,
				mountKeyboard: true
			}))

			const keyboardDidShowListener = Keyboard.addListener(
		      'keyboardDidShow',
		      () => {
		        setState(prevState => ({ 
		        	...prevState,
		        	keyboardVisible: true
		        }))
		      }
		    );

		    const keyboardDidHideListener = Keyboard.addListener(
		      'keyboardDidHide',
		      () => {
		        setState(prevState => ({
		        	...prevState,
		        	keyboardVisible: false
		        }))
		      }
		    );

		    return () => {
		      keyboardDidHideListener.remove();
		      keyboardDidShowListener.remove();
		    };
		}
	}, [state.mount])

	React.useEffect(() => {
		if (state.mountKeyboard) {
			BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
		    
		    return () => {
		      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
		    };
		}
	}, [state.mountKeyboard, handleBackButtonClick])

	//we have latlong sender before receiver latlong
	//so only passed receiver to get route
	React.useEffect(() => {
		if (Object.keys(state.receiver).length > 0) {
			const { sender, receiver } = state;
			ApiOrder.getRoute(sender, receiver)			
				.then(route => {
					const routeForMap = [];
					route.leg[0].shape.map(list => {
						const parseLat = list.split(','); 
						const latitude = parseFloat(parseLat[0]);
	            		const longitude = parseFloat(parseLat[1]);
	            		routeForMap.push({latitude: latitude, longitude: longitude});
					})

					setState(state => ({
						...state,
						routeForMap,
						jarak: route.summary.distance
					}))
				})
		}
	}, [state.receiver]);

	React.useEffect(() => {
		if (state.update) {
			currentView = 'update';
			Animated.timing(state.opacityInput, {
		        toValue: 0,
		        delay: 500,
		        duration: 200,
		        useNativeDriver: true
		    }).start();

		}else{
			currentView = 'map';
			Animated.timing(state.opacityInput, {
		        toValue: 1,
		        delay: 100,
		        duration: 200,
		        useNativeDriver: true
		    }).start();
		}
	}, [state.update])

	React.useEffect(() => {
		if (state.cart) {
			currentView = 'cart';
			Animated.timing(state.opacityInput, {
		        toValue: 0,
		        delay: 500,
		        duration: 200,
		        useNativeDriver: true
		    }).start();
		}else{
			currentView = 'map';
			Animated.timing(state.opacityInput, {
		        toValue: 1,
		        delay: 100,
		        duration: 200,
		        useNativeDriver: true
		    }).start();
		}
	}, [state.cart])

	React.useEffect(() => {
		if (state.modalVisible) {
			currentView = 'result';
			Animated.spring(positionInput, {
		      toValue: 300,
		      useNativeDriver: true,
		      velocity: 3,
		      tension: 2,
		      friction: 8
		    }).start();	
		}else{
			currentView = 'map';
		}
	}, [state.modalVisible])

	React.useEffect(() => {
		if (state.success) {
			Animated.spring(state.positionMessage, {
		      toValue: 0,
		      useNativeDriver: true
		    }).start();	

		    setState(state => ({
		    	...state,
		    	modalVisible: false
		    }))
		}
	}, [state.success]);


	const handleBackButtonClick = () => {
		if (currentView === 'update') {
			handleCloseEdit();
		}else if(currentView === 'cart'){
			handleCloseCart();
		}else{
			props.navigation.goBack();
		}

		return true;
	}

	const handleChangeRegion = (location) => {
		positionInput.setValue(200);

		const newCoordinate = {
	      latitude: location.latitude,
	      longitude: location.longitude
	    };
	    if (state.moveMarker === 'sender') {
	    	region.timing(newCoordinate).start();
	    }else if(state.moveMarker === 'receiver'){
	    	regionReceiver.timing(newCoordinate).start();
	    }
 
	}

 	const setPositionInput =  () => {
 		positionInput.setValue(200);
 		Animated.spring(positionInput, {
	      toValue: 0,
	      useNativeDriver: true,
	      velocity: 3,
	      tension: 2,
	      friction: 8
	    }).start();
 	}

	const handleCompleteRegion = (region) => {
		Animated.spring(positionInput, {
	      toValue: 0,
	      useNativeDriver: true
	    }).start();

		const payload = {
			latitude: region.latitude,
			longitude: region.longitude
		}
		
		if (state.moveMarker !== 'kosong') {

			ApiOrder.google.getAddres(payload)
				.then(addres => {
					setState(state => ({
							...state,
							addres,
							location: {
								...state.location,
								...payload
							}
						}))
					})
				.catch(() => {
					Toast.show({
		                text: "Tidak 	dapat menemukan alamat berdasarkan map",
		                type: "danger",
		                position: "top",
		                style: {marginTop: -6},
		                textStyle: {fontSize: 14}
					})

					setState(state => ({
						...state,
						errors: {
							global: 'Tidak dapat menemukan alamat di map'
						}
					}))
				})
		}
	}

	const onEditStreet = (location) => {
		handleCloseEdit();
		setTimeout(function() {
			const newCoordinate = {
		      latitude: location.lat,
		      longitude: location.lng
		    };

			setState(state => ({
				...state,
				loading: true,
				location: {
					...state.location,
					...newCoordinate
				}
			}))

			if (state.moveMarker === 'sender') {
		    	region.timing(newCoordinate).start();
		    }else if(state.moveMarker === 'receiver'){
		    	regionReceiver.timing(newCoordinate).start();
		    }

			//refresh map
			setTimeout(function() {
				setState(state => ({
					...state,
					loading: false
				}))
			}, 10);
		}, 10);
	}	

	const handleGetLocation = async () => {
		setState(state => ({
			...state,
			loading: true
		}))

		await Location.getCurrentPositionAsync({})
			.then(location => {
				const newCoordinate = {
			      latitude: location.coords.latitude,
			      longitude: location.coords.longitude
			    };

			    setState(state => ({
			    	...state,
			    	location: {
			    		...state.location,
			    		latitude: location.coords.latitude,
			      		longitude: location.coords.longitude,
			    	},
			    	loading: false,
					locationIsEnabled: true,
					mount: true
			    }))

			    region.timing(newCoordinate).start();
			})
			.catch(() => {
				props.navigation.goBack();
			})
	}

	const handleSubmit = (data) => {
		setPositionInput();
		const newCoordinate = {
			latitude: location.latitude,
			longitude: location.longitude
		}

		if (state.moveMarker === 'sender') {

			setState(state => ({
				...state,
				sender: {
					...data,
					...newCoordinate
				},
				moveMarker: 'receiver'
			}))

			regionReceiver.timing(newCoordinate).start();
		}else if(state.moveMarker === 'receiver'){
				setState(state => ({
					...state,
					moveMarker: 'kosong',
					receiver: {
						...data,
						...newCoordinate
					},
					loading: false
				}))
		}
	}

	const handleSubmitKiriman = (data) => {
		setState(state => ({
			...state,
			kiriman: data,
			modalVisible: true,
			tarif: 0,
			errors: {},
			success: false
		}))

		//kec, kota, prov
		const { sender, jarak } = state;

		const payload = {
			param1: props.user.userid,
			param2: `${props.detail.nopend}|${sender.kota.toUpperCase()}|${data.berat.replace(/\D/g, '')}|${sender.latitude}|${sender.longitude}|${Number(jarak / 1000).toFixed(1)}`
		}

		// console.log(payload);

		ApiYuyus.cityCourier.getTarif(payload)
			.then(res => {
				if (res.rc_mess === '00') {
					setState(state => ({
						...state,
						tarif: res.response_data1
					}))
				}else{
					setState(state => ({
						...state,
						errors: {
							tarif: res.desk_mess,
							code: res.rc_mess
						}
					}))
				}
			})
			.catch(err => {
				setState(state => ({
					...state,
					errors: {
						tarif: `Gagal mengambil tarif`,
						code: 500
					}
				}))
			})
	}

	const handleOrder = (jenisPembayaran) => {
		const { sender, receiver, kiriman } = state;

		const payload = {
			param1: props.user.userid,
			param2: {
				destination: {
					name: receiver.name,
					phone : receiver.nohp,
					address: `${receiver.kelurahan}, ${receiver.kecamatan}, ${receiver.kota.toUpperCase()}, ${receiver.kodepos}`,
					address_name : receiver.alamat,
					lon : receiver.longitude,
					lat : receiver.latitude,
					instruction: receiver.note
				},
				source: {
					name: sender.name,
					phone : sender.nohp,
					address: `${sender.kelurahan}, ${sender.kecamatan}, ${sender.kota.toUpperCase()}, ${sender.kodepos}`,
					address_name : sender.alamat,
					lon : sender.longitude,
					lat : sender.latitude,
					instruction: sender.note
				},
				customer: {
					id: props.user.userid,
					name: props.user.nama,
					email: props.user.email,
					phone: props.user.nohp,
				},
				order: {
					distance: (state.jarak / 1000).toFixed(1),
					weight: kiriman.berat,
					information: kiriman.isiKiriman,
					tariff: state.tarif,
					province: '-',
					payment_type: jenisPembayaran,
					code: '',
					id_services: '1'
				},
				nilai_kiriman: 0,
				nilai_cod: 0,
				dimensi: `${kiriman.panjang},${kiriman.lebar},${kiriman.tinggi}`,
				userid: props.user.userid,
			}
		}

		

		ApiYuyus.cityCourier.order(payload)
			.then(res => {
				if (res.rc_mess === '00') {
					if (jenisPembayaran === '2') {
						props.calculateSaldo(payload.param2.order.tariff, 'min');
					}
					setState(state => ({
						...state,
						success: true
					}))
				}else{
					setState(state => ({
						...state,
						errors: {
							order: 'Gagal Order',
							orderCode: res.rc_mess
						}
					}))
				}
			})
			.catch(err => {
				setState(state => ({
					...state,
					errors: {
						order: 'Internal Server Error',
						orderCode: 500	
					}
				}))
			})
	}

	const onUpdateAddress = () => {
		Animated.spring(positionInput, {
	      toValue: 300,
	      useNativeDriver: true,
	      velocity: 3,
	      tension: 2,
	      friction: 8
	    }).start();	

	    setState(state => ({
	    	...state,
	    	update: true
	    }))
	}

	const handleCloseEdit = () => {
		Animated.spring(positionInput, {
	      toValue: 0,
	      useNativeDriver: true,
	      velocity: 3,
	      tension: 2,
	      friction: 8
	    }).start();	

	    setState(state => ({
	    	...state,
	    	update: false
	    }))
	}

	const goToCart = () => {
		Animated.spring(positionInput, {
	      toValue: 300,
	      useNativeDriver: true,
	      velocity: 3,
	      tension: 2,
	      friction: 8
	    }).start();	

		setState(state => ({
			...state,
			cart: true
		}))
	}

	const handleCloseCart = () => {
		setPositionInput();
		setState(state => ({
			...state,
			cart: false
		}))
	}

	const handleCloseModal = () => {
		setPositionInput();
		setState(state => ({
			...state,
			modalVisible: false
		}))
	}

	const resetAllstate = () => {
		setState(state => ({
			...state,
			location: {
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			},
			addres: {},
			sender: {},
			receiver: {},
			kiriman: {},
			errors: {},
			moveMarker: 'sender',
			modalVisible: false,
			routeForMap: [],
			jarak: 0,
			tarif: 0,
			update: false,
			cart: false,
			success: false,
			positionMessage: new Animated.Value(200)
		}))
		setPositionInput();
	}

	return(
		<KeyboardAvoidingView
			style={{flex:1}} 
			behavior="padding" 
			enabled={state.keyboardVisible}
		>

			{ !state.cart && !state.update && <TouchableOpacity style={styles.chart} onPress={goToCart}>
				<Icon name="md-cart" iconStyle={{color: "blue"}} />
			</TouchableOpacity> }

			{ state.modalVisible && 
				<ResultOrder 
					sender={state.sender}
					receiver={state.receiver}
					kiriman={state.kiriman}
					tarif={state.tarif}
					jarak={state.jarak}
					onSubmit={handleOrder}
					closeModal={handleCloseModal}
					isSuccess={state.success}
					error={state.errors}
					user={props.detail}
				/> }
			
			{ state.loading ? <AppLoading /> : 
				<React.Fragment> 
					{ !state.locationIsEnabled ? <ErrorPermissionView getLocation={handleGetLocation} /> : <View style={{flex: 1}}>
						<MapView 
							initialRegion={{
								latitude: location.latitude,
					            longitude: location.longitude,
					            latitudeDelta: location.latitudeDelta,
					            longitudeDelta: location.longitudeDelta,
							}} 
							style={styles.map}
							showUserLocation={true}
							onRegionChangeComplete={handleCompleteRegion}
							onRegionChange={handleChangeRegion}
							zoomControlEnabled={false}
						>
							{ state.routeForMap.length > 0 &&  
								<Polyline 
									coordinates={state.routeForMap} 
									strokeWidth={3} 
									strokeColor="#f26522" 
									geodesic={true}/> }
							<Marker.Animated coordinate={region}>
								<MarkerLabel
									name='Pengirim'
								/>
							</Marker.Animated>
							{ state.moveMarker !== 'sender' && <Marker.Animated coordinate={regionReceiver}>
								<MarkerLabel
									name='Penerima'
								/>
							</Marker.Animated> }
						</MapView>
					</View> }  
			</React.Fragment> }

			{ state.update && 
				<EditView 
					values={state.addres} 
					close={handleCloseEdit} 
					markerType={state.moveMarker}
					handleChooseStreet={onEditStreet}
			/> }

			{ state.cart && <CartView 
					goBack={handleCloseCart}
					userid={props.user.userid}
					user={props.detail}
					calculateSaldo={props.calculateSaldo}
				/> }

			<View>
				<Animated.View 
					style={
						[{
							transform: [{translateY: positionInput }], 
							opacity: state.opacityInput
						}, 
						styles.backdrop
					]}
					pointerEvents={state.modalVisible ? 'none' : 'auto'}
				>
	        		<InputView 
	        			addres={addres}
	        			onSubmit={handleSubmit} 
	        			errors={state.errors}
	        			markerType={state.moveMarker}
	        			onSubmitKiriman={handleSubmitKiriman}
	        			jarak={state.jarak}
	        			handleEditAddress={onUpdateAddress}
	        			resetSenderAndReceiver={resetAllstate}
	        		/>
		        </Animated.View>
	        </View>

	        { state.success && 
	        <Modal
	        	transparent={true}
	        	visible={true}
	        	//onRequestClose={() => handleClose()}
	        	animationType="fade"
	        >
	        	<View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}>
		        <Animated.View 
		        	style={[
		        		styles.message, { 
		        			transform: [{translateX: state.positionMessage }],
		        		} 
		        	]}>
		        	<Text style={{color: '#FFFF', fontFamily: 'Roboto_medium'}}>ORDER SUKSES</Text>
		        	<Button style={{borderRadius: 0}} transparent onPress={resetAllstate}>
		        		<Text>Kembali Order</Text>
		        	</Button>
		        </Animated.View>
		        </View>
	        </Modal> }
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	map: {
    	...StyleSheet.absoluteFillObject,
    	flex: 1
  	},
  	backdrop: {
  		position: 'absolute', 
  		bottom: 0, 
  		left: 0, 
  		right: 0, 
  		minHeight: 100,  
  		backgroundColor: '#fafcfb',
  		elevation: 5,
  		padding: 5,
  	},
  	error: {
  		flex: 1,
  		justifyContent: 'center',
  		alignItems: 'center'
  	},
  	textError: {
  		textAlign: 'center',
  		fontFamily: 'Roboto-Regular'
  	},
  	box: {
  		borderWidth: 0.1, 
  		padding: 5, 
  		margin: 8, 
  		borderRadius: 4, 
  		backgroundColor: '#FFFF', 
  		elevation: 3 
  	},
  	chart: {
  		position: 'absolute',
  		top: 0,
  		backgroundColor: '#FFFF',
  		right: 0,
  		marginTop: Constants.statusBarHeight + 10,
  		zIndex: 1,
  		margin: 20,
  		width: 50,
  		height: 50,
  		borderRadius: 50 / 2,
  		justifyContent: 'center',
  		alignItems: 'center',
  		elevation: 2
  	},
  	message: {
  		position: 'absolute',
  		bottom: 0,
  		left: 0,
  		right: 0,
  		backgroundColor: '#ffae00',
  		height: 70,
  		justifyContent: 'space-between',
  		flexDirection: 'row',
  		alignItems: 'center',
  		padding: 10,
  		margin: 7,
  		borderRadius: 3,
  		elevation: 4
  	}
})

function mapStateToProps(state) {
	return{
		user: state.auth.localUser,
		detail: state.auth.dataLogin.detail
	}
}

export default connect(mapStateToProps, { calculateSaldo })(CityCourier);