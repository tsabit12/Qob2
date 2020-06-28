import React from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler, Alert } from "react-native";
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
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

import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigationView: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)',
        elevation: 5
    },
    navigation: {
        backgroundColor: 'transparent'
    }
})

const ProfileIcon = (style) => {
	return(
		<Ionicons
	        style={{ backgroundColor: 'transparent' }}
	        name='md-person'
	        size={25}
	        color="white"
	    />
	);
}

const ProfileAction = (props) => (
  <TopNavigationAction {...props} icon={ProfileIcon}/>
);

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
		    				console.log(err);
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

	const renderRightControls = () => (
		<ProfileAction onPress={() => 
			props.navigation.navigate({ 
				routeName: 'Account'
			})} 
		/>
	);

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
				<TopNavigation
				    title='QPOSin AJA'
				    alignment='start'
				    titleStyle={{fontSize: 19, fontWeight: '700', color: '#FFF'}}
				    style={styles.navigation}
				    rightControls={renderRightControls()}
				/>
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

Menu.propTypes = {
	dataLogin: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { loggedOut })(Menu);