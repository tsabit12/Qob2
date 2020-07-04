import React from "react";
import { View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView } from "react-native";
import { TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import Constants from "expo-constants";
import { ReceiverForm } from "./components";
import { ApiOrder as api } from "../../api";

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)', 
		elevation: 10, 
		paddingTop: Constants.statusBarHeight + 5
	},
	card: {
		margin: 5,
		padding: 7,
		elevation: 5,
		marginTop: 10,
		backgroundColor: 'white',
		borderWidth: 0.2,
		borderColor: '#bdbdbd',
		borderRadius: 3
	}
})

const Receiver = props => {
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
	        	isKeyboardVisible: true
	        }))
	      }
	    );

	    const keyboardDidHideListener = Keyboard.addListener(
	      'keyboardDidHide',
	      () => {
	        setState(prevState => ({
	        	...prevState,
	        	isKeyboardVisible: false
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
		const deskripsiPenerima = {
			nama: data.nama,
			alamatUtama: data.alamat,
			kodepos: data.kodepos,
			email: data.email,
			nohp: data.phone,
			kabupaten: data.kabupaten,
			kecamatan: data.kecamatan,
			kelurahan: data.kelurahan,
			provinsi: data.provinsi
		}
		//console.log(deskripsiPenerima);
		props.navigation.navigate({
			routeName: 'PilihTarif',
			params: {
				...props.navigation.state.params,
				deskripsiPenerima
			}
		})
	}

	return(
		<View style={styles.root}>
			<TopNavigation
			    leftControl={BackAction()}
			    subtitle='Kelola Penerima'
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
					<ReceiverForm 
						style={styles.card}
						onSearch={(kodepos) => api.getKodePos(kodepos)}
						onSubmit={handleSubmit}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

export default Receiver;