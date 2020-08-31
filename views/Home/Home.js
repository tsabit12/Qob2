import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Constants from 'expo-constants';
import md5 from "react-native-md5";
import { setLoggedIn } from "../../actions/auth";
import { Toast, Icon } from 'native-base';
import PinView from 'react-native-pin-view';
import Loader from "../Loader";
import {
	ApiYuyus as api
} from "../../api";

import {
	Slider as slides,
	Registrasi
} from "./components";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
	root: {
		flex: 1
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
	mainContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
})

const Home = props => {
	const { localUser } = props;
	const pinView = React.useRef(null);

	const [state, setState] = React.useState({
		loading: false,
		errors: {},
		done: false,
		enteredPin: '',
		showRemoveButton: false
	});

	const { errors, enteredPin, showRemoveButton } = state;

	React.useEffect(() => {
	    if (enteredPin.length > 0) {
	      setState(state => ({
	      	...state,
	      	showRemoveButton: true
	      }))
	    } else {
	      setState(state => ({
	      	...state,
	      	showRemoveButton: false
	      }))
	    }

	    if (enteredPin.length === 6) {
	    	handleLogin();
	    }
	}, [enteredPin]);

	const handleLogin = () => {
		const val = enteredPin;
		setState(prevState => ({
			...prevState,
			loading: true,
			errors: {}
		}));

		const { userid, nohp, email } = localUser;

		const imei 		= Constants.deviceId;
		const pinMd5 	= md5.hex_md5(userid+val+nohp+email+imei+'8b321770897ac2d5bfc26965d9bf64a1');

		const payload 	= `${userid}|${pinMd5}|${nohp}|${email}|${imei}`;

		api.login(payload, userid)
			.then(res => {
				if (res.rc_mess === '00') {
					setState(prevState => ({
						...prevState,
						loading: false
					}));

					const { response_data1, response_data4, response_data5 } = res;
					const x 	= response_data4.split('|');
					const x2 	= response_data1.split('|'); 

					const session = {
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
						kodepos: x[7],
						nopend: res.response_data3
					};

					props.setLoggedIn(userid, session, val);

				}else{
					setState(prevState => ({
						...prevState,
						loading: false
					}));

					pinView.current.clearAll();
					Toast.show({
		              text: res.desk_mess,
		              duration: 3000,
		              textStyle: { textAlign: "center" }
		            })
				}
			}) 
			.catch(err => {
				// console.log(err);
				setState(prevState => ({
					...prevState,
					loading: false,
					errors: err
				}));
			})
	}
	
	const renderItem = ({ item, dimensions }) => (
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

	const onDoneSlider = () => setState(prevState => ({
		...prevState,
		done: true
	}))

	const hadleHelp = () => {
		props.navigation.navigate({
			routeName: 'Pemulihan',
			params: {
				title: 'Lupa PIN',
				jenis: 1
			}
		})
	}

	const handleChangePin = (value) => {
		setState(state => ({
			...state,
			enteredPin: value
		}))
	}

	return(
		<LinearGradient
          colors={['#ff781f', '#ff8e1c']}
          style={styles.root}
          start={{ x: 0, y: 0.1 }}
	      end={{ x: 0.1, y: 1 }}
        >
			<Loader loading={state.loading} />
				{Object.keys(localUser).length > 0 ? 
					<View style={{flex: 1, justifyContent: 'center'}}> 
						<PinView
							ref={pinView}
				            onValueChange={value => handleChangePin(value)}
				            pinLength={6}
				            buttonSize={75}
				            inputSize={32}
				            buttonAreaStyle={{
				              marginTop: 24,
				            }}
				            inputAreaStyle={{
				              marginBottom: 24,
				            }}
				            inputViewEmptyStyle={{
				              backgroundColor: "transparent",
				              borderWidth: 1,
				              borderColor: "#FFF",
				            }}
				            inputViewFilledStyle={{
				              backgroundColor: "#FFF",
				            }}
				            buttonViewStyle={{
				              //borderWidth: 1,
				              backgroundColor: "#FFF",
				              margin: 6
				            }}
				            buttonTextStyle={{
				              color: "black"
				            }}
				            onButtonPress={key => {
				              if (key === "custom_left") {
				                pinView.current.clear()
				              }
				            }}
				            customLeftButton={showRemoveButton ? 
					            	<Icon 
					            		name={"ios-backspace"} 
					            		// size={36} 
					            		style={{
					            			fontSize: 40,
					            			color: 'white'
					            		}}
					            	/> : undefined}
				        />
				        <Text 
							style={{
								color: 'blue', 
								textAlign: 'center', 
								fontFamily: 'open-sans-bold',
								marginTop: 20,
								fontSize: 16
							}}
							onPress={hadleHelp}
						>LUPA PIN</Text>
					</View> : <React.Fragment>
					{ state.done ? <Registrasi navigation={props.navigation} /> : <AppIntroSlider
				        slides={slides}
				        renderItem={renderItem}
				        showPrevButton
				        showSkipButton
				        onDone={onDoneSlider}
				        // onSkip={() => console.log("skipped")}
				    /> }
				</React.Fragment> }
		</LinearGradient>
	);
}

Home.propTypes = {
	localUser: PropTypes.object.isRequired
}

function mapStatToProps(state) {
	return{
		localUser: state.auth.localUser
	}
}

export default connect(mapStatToProps, { setLoggedIn })(Home);