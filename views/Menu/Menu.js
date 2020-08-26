import React from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler, Alert, Dimensions, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; 
import {  StackActions } from 'react-navigation';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "../Loader";
import {
	ApiYuyus as api1,
	ApiOrder as api2
} from "../../api";

import { 
	ImageSlider,
	LabelGiro,
	Icon as IconView,
	Modal
} from "./components";
import { loggedOut } from "../../actions/auth";
import { getNotification } from '../../actions/notification';

import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import IconBadge from 'react-native-icon-badge';

const { width, height } = Dimensions.get('window');

const Menu = props => {
	const [state, setState] = React.useState({
		visible: false,
		loading: false,
		text: 'Anda akan melakukan generate token untuk login pada web qposin. Silahkan klik tombol konfirmasi dibawah',
		footerModal: true,
		mount: false
	})

	React.useEffect(() => {
		(async () => {
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

		    const { userid } = props.dataLogin;
			const { email, nohp } = props.dataLogin.detail;

		    await Notifications.getExpoPushTokenAsync()
		    	.then(token => {
		    		const payload = {
		    			token,
		    			email: email,
		    			userid: userid,
		    			phone: nohp
		    		};
		    		api2.pushToken(payload)
		    			.then(res => {
		    				console.log(res);
		    				setState(prevState => ({
								...prevState,
								mount: true
							}))
		    			})
		    			.catch(err => {
		    				console.log(err.request);
		    				setState(prevState => ({
								...prevState,
								mount: true
							}))
		    			})
		    	}).catch(err => {
		    		console.log(err);
		    		setState(prevState => ({
						...prevState,
						mount: true
					}))
		    	})
		})();
	}, []);

	React.useEffect(() => {
		if (state.mount) {

			BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
		    
		    return () => {
		      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
		    };
		}
	}, [state.mount]);

	React.useEffect(() => {
		if (props.dataLogin.userid) {
			const payload = {
				userid: props.dataLogin.userid
			};

			props.getNotification(payload);
		}
	}, [props.dataLogin.userid]);

	const handleBackButtonClick = () => {
		if (props.navigation.isFocused()) {
          Alert.alert(
            'Tutup Aplikasi',
            'Apakah Anda yakin ingin menutup Aplikasi?', [{
              text: 'Batal',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }, {
              text: 'Ya',
              onPress: () => {
              	BackHandler.exitApp();
              	props.loggedOut();
              }
            }], {
              cancelable: false
            }
          );
        } else {
          props.navigation.dispatch(StackActions.pop({
            n: 1
          }));
        }

        return true;
	}

	const goToConnectGiro = () => props.navigation.navigate({
		routeName: 'ValidasiRekening'
	});

	const showModal = () => setState(prevState => ({
		...prevState,
		visible: true,
		footerModal: true,
		text: 'Anda akan melakukan generate token untuk login pada web qposin. Silahkan klik tombol konfirmasi dibawah'
	}))

	const closeModal = () => setState(prevState => ({
		...prevState,
		visible: false
	}))

	const generateToken = () => {
		setState(prevState => ({
			...prevState,
			loading: true,
			visible: false
		}))

		const { userid, detail } = props.dataLogin;
		api1.generateToken(userid)
			.then(res => {
				const payload = {
					email: detail.email,
					pin: res.response_data1
				};
				api2.syncronizeUserPwd(payload)
					.then(res2 => {
						setState(prevState => ({
							...prevState,
							loading: false,
							visible: true,
							text: `${res.desk_mess}`,
							footerModal: false
						}))
					})
					.catch(err2 => {
						setState(prevState => ({
							...prevState,
							loading: false,
							visible: true,
							text: 'Terdapat kesalahan, harap cobalagi',
							footerModal: false
						}))
					})
			})
			.catch(err => {
				if (err.global) {
					setState(prevState => ({
						...prevState,
						loading: false,
						visible: true,
						text: `Generate token gagal. (${err.global})`,
						footerModal: false
					}));
				}else{
					setState(prevState => ({
						...prevState,
						loading: false,
						visible: true,
						text: 'Terdapat kesalahan, silahkan cobalagi',
						footerModal: false
					}));
				}
			})
	}

	return(
		<View style={styles.root}>
			<Loader loading={state.loading} messagenya='Loading..' />
			<View style={styles.navigationView}>
				<Text style={styles.title}>QPOSin AJA</Text>
				<View style={{marginRight: 7, flexDirection: 'row'}}>
					<TouchableOpacity 
						onPress={() => props.navigation.navigate({ 
							routeName: 'Notification'
						})}
						style={{padding: 7, marginRight: 3}}
					>
						<IconBadge
				            MainElement={
				            	<View style={{margin: 6}}>
				            		<Ionicons name="md-notifications" size={27} color="white"/>
				            	</View>
				            }
				            BadgeElement={
						      <Text style={{color:'#FFFFFF', fontSize: 9}}>{props.notification.total}</Text>
						    }
						    IconBadgeStyle={{width: 20, height: 20}}
						    Hidden={props.notification.total === 0}
				        />
			        </TouchableOpacity>

					<TouchableOpacity 
						onPress={() => props.navigation.navigate({ 
							routeName: 'Account'
						})}
						style={{padding: 7, margin:5}}
					>
						<Ionicons name="md-person" size={27} color="white" />
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView>
				<ImageSlider />
				<LabelGiro 
					user={props.dataLogin}
					onPressGiro={goToConnectGiro}
				/>
				<IconView 
					navigation={props.navigation}
					onGenerateToken={showModal}
				/>
				<Modal 
					visible={state.visible}
					text={state.text}
					title='Notifikasi'
					onCancle={closeModal}
					onSubmit={generateToken}
					showFooter={state.footerModal}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigationView: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)',
        height: height / 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 6,
		paddingRight: 6
    },
    navigation: {
        backgroundColor: 'transparent'
    },
    title: {
    	color: 'white',
    	fontFamily: 'Roboto_medium',
		fontWeight: 'bold',
		fontSize: 20
    }
})

Menu.propTypes = {
	dataLogin: PropTypes.object.isRequired,
	getNotification: PropTypes.func.isRequired,
	notification: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin,
		notification: state.notification
	}
}

export default connect(mapStateToProps, { loggedOut, getNotification })(Menu);