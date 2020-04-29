import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Dimensions, BackHandler, ToastAndroid } from "react-native";
import Menu from "./MenuOld";
import styles, { colors } from './styles/index.style';
//import Carousel, { Pagination } from 'react-native-snap-carousel';
//import SliderEntry from './components/SliderEntry';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { connect } from "react-redux";
import Loader from "../../Loader";
import api from "../../api";
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import apiBaru from "../../apiBaru";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from '@expo/vector-icons';
import {  StackActions } from 'react-navigation';
import { loggedOut } from "../../../actions/auth";

const heightDevice = Dimensions.get('window').height;

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

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const RenderButtonGiro = ({ norek, detail, onPressGiro }) => (
	<View style={{marginTop: 5}}>
		<Text 
			style={{fontWeight: '700', marginLeft: 5, marginRight: 5, textAlign: 'center', fontSize: 16}}
			numberOfLines={1}
		>{detail.nama}</Text>
		{ norek === '-' ? <TouchableOpacity 
				style={styles.labelGiro}
				activeOpacity={0.5}
				onPress={onPressGiro}
			>
			<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
				<Image source={require('../../../assets/giro.png')} style={{width: 20, height: 20}} />
				<Text style={styles.textLabel}>Hubungkan ke akun giro</Text>
			</View>
		</TouchableOpacity> : <View 
			style={styles.labelGiro}>
			<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
				<Image source={require('../../../assets/giro.png')} style={{width: 20, height: 20}} />
				<Text style={styles.textLabel}>Rp {numberWithCommas(detail.saldo)}</Text>
			</View>
		</View>}
	</View>
);

let backHandlerClickCount = 0;

class Index extends React.Component{
	state = {
		loading: false,
		mount: false,
		clickedPosition: 0
	}


	UNSAFE_componentWillMount(){
		this.unsubscribe = this.props.navigation.addListener('didFocus', payload =>
			BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload)));
		this.setState({ mount: true });
	}


	async componentDidMount(){
		if (this.state.mount) {
			const { userid } = this.props.dataLogin;
			const { email, nohp } = this.props.dataLogin.detail;
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
		    			userid: userid,
		    			phone: nohp
		    		};
		    		apiBaru.qob.pushToken(payload)
		    			.then(res => console.log(res))
		    			.catch(err => console.log(err))
		    	}).catch(err => console.log(err))			
		}
	}

	shortToast = message => {
        ToastAndroid.showWithGravityAndOffset(
          message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
    }

	onBackButtonPressAndroid = () => {
        // const { clickedPosition } = this.state;

        if (this.props.navigation.isFocused()) {
          Alert.alert(
            'Exit Application',
            'Do you want to quit application?', [{
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }, {
              text: 'OK',
              onPress: () => this.onBackPress()
            }], {
              cancelable: false
            }
          );
        } else {
          this.props.navigation.dispatch(StackActions.pop({
            n: 1
          }));
        }
        return true;
  	}

    onBackPress = () => {
    	BackHandler.exitApp();
    	this.props.loggedOut();
    	this.unsubscribe.remove();
    }
	
	_renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    renderRightControls = () => {
		const { userid } = this.props.dataLogin;
		return(
				<ProfileAction onPress={() => 
					this.props.navigation.navigate({ 
						routeName: 'Account'
					})} 
				/>
		);
	}

	onAlert = (message) => {
		Alert.alert(
		  'Notifikasi',
		  `${message}`,
		  [
		  	{
		      text: 'Batal',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Konfirmasi', onPress: () => this.generateToken()},
		  ],
		  {cancelable: false},
		);
	}

	generateToken = () => {
		const { userid, detail } = this.props.dataLogin;
		this.setState({ loading: true });
		api.auth.genpwdweb(userid)
			.then(res => {
				const payload = {
					email: detail.email,
					pin: res.response_data1
				}
				apiBaru.qob.syncronizeUserPwd(payload)
					.then(res2 => {
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
					.catch(err2 => {
						this.setState({ loading: false });
						setTimeout(() => {
							Alert.alert(
							  'Oppps',
							  `Terdapat kesalahan, harap cobalagi`,
							  [
							  	{ text: 'Tutup', style: 'cancel' },
							  ],
							  {cancelable: false},
							);
						}, 200);
					})
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

	render(){
		const { slider1ActiveSlide, loading } = this.state;
		const { userid, norek, detail } = this.props.dataLogin;

		return(
			<View style={{flex: 1}}>
				<Loader loading={loading} />
				<View style={styles.navigationView}>
					<TopNavigation
					    //leftControl={this.renderLeftControl()}
					    title='QPOSin AJA'
					    alignment='start'
					    titleStyle={{fontSize: 19, fontWeight: '700', color: '#FFF'}}
					    style={styles.navigation}
					    rightControls={this.renderRightControls()}
					/>
				</View>
				<ScrollView>
					<View style={{marginBottom: 5}}>
						<SliderBox images={[
								require('../../../assets/slider/qob.jpg'),
								require('../../../assets/slider/qob2.jpg'),
								require('../../../assets/slider/qob3.png'),
								require('../../../assets/slider/qob4.jpg'),
								require('../../../assets/slider/qob5.jpg'),
								require('../../../assets/slider/qob6.jpg'),
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
					</View>
					{ /* RENDER BUTTON GIRO*/}
					<RenderButtonGiro 
						norek={norek} 
						detail={detail} 
						onPressGiro={() => this.props.navigation.navigate({
							routeName: 'ValidasiRekening'
						})}
					/>
					
					{ /* MENU WILL BE HERE */ }
					<Menu 
						navigation={this.props.navigation}
						showAlert={this.onAlert}
					/>
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

export default connect(mapStateToProps, { loggedOut })(Index);