import React from "react";
import { View, Text, Keyboard, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { TopNavigation, TopNavigationAction, Icon, Toggle } from "@ui-kitten/components";
import Constants from "expo-constants";
import {
	ApiOrder as api
} from "../../api";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
	SenderForm
} from "./components";

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)', 
		elevation: 10, 
		paddingTop: Constants.statusBarHeight + 5
	},
	toggleView: {
		margin: 5,
		padding: 7,
		elevation: 5,
		marginTop: 10,
		backgroundColor: 'white',
		borderWidth: 0.2,
		borderColor: '#bdbdbd',
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		marginLeft: 10,
		fontSize: 15,
		fontFamily: 'Roboto_medium'
	}
})

const Sender = props => {
	const [state, setState] = React.useState({
		isKeyboardVisible: false,
		checked: true
	});

	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
	      'keyboardDidShow',
	      () => {
	        setState(prevState => ({
	        	...prevState,
	        	isKeyboardVisible: true,
	        	placement: 'top'
	        }))
	      }
	    );

	    const keyboardDidHideListener = Keyboard.addListener(
	      'keyboardDidHide',
	      () => {
	        setState(prevState => ({
	        	...prevState,
	        	isKeyboardVisible: false,
	        	placement: 'bottom'
	        }))
	      }
	    );

	    return () => {
	      keyboardDidHideListener.remove();
	      keyboardDidShowListener.remove();
	    };
	}, []);

	const BackAction = () => (
		<TopNavigationAction 
			icon={(style) =>  <Icon {...style} name='arrow-back' fill='#FFF'/> }
			onPress={() => props.navigation.goBack()}
		/>
	);

	const handleSubmit = (data) => {
		const pengirimnya = {
			nama: data.nama,
			alamat: data.alamatUtama,
			kota: data.kabupaten,
			kodepos: data.kodepos,
			nohp: data.phone,
			alamatDet: '-',
			kel: data.kelurahan,
			kec: data.kecamatan,
			email: data.email,
			provinsi: data.provinsi
		};

		props.navigation.push('OrderPenerimaNonMember',{
			...props.navigation.state.params,
			pengirimnya
		});
	}

	return(
		<View style={styles.root}>
			<TopNavigation
			    leftControl={BackAction()}
			    subtitle='Kelola Pengirim'
			    title='Order'
			    alignment='start'
			    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
			    style={styles.navigation}
			    subtitleStyle={{color: '#FFF'}}
			/>
			<KeyboardAvoidingView
				style={{flex:1}} 
				behavior="padding" 
				enabled={state.isKeyboardVisible}
			>
				<ScrollView keyboardShouldPersistTaps='always'>	
					<View style={styles.toggleView}>
						<Toggle
					        status='primary'
					        onChange={() => setState(prevState => ({ ...prevState, checked: !prevState.checked }))}
					        checked={state.checked}
					    />
					    <Text style={styles.text}>Gunakan data saya</Text>
					</View>
					<SenderForm 
						onSearch={(kodepos) => api.getKodePos(kodepos)}
						user={props.dataLogin}
						checked={state.checked}
						onSubmit={handleSubmit}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

Sender.propTypes = {
	dataLogin: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(Sender);