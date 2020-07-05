import React from "react";
import { View, Text, StyleSheet, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView } from "react-native";
import { TopNavigation, TopNavigationAction, Icon, ListItem } from "@ui-kitten/components";
import Constants from "expo-constants";
import { FormTarif } from "./components";
import { ApiOrder as api, ApiYuyus as api2 } from "../../api";
import Loader from "../Loader";

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)'
	},
	statusbar: {
		height: Constants.statusBarHeight,
	  	backgroundColor: 'rgb(240, 132, 0)'
	},
	list: {
		borderWidth: 0.3,
		margin: 7,
		backgroundColor: 'white',
		elevation: 5,
		borderColor: '#b0afae'
	},
	message: {
		margin: 7,
		padding: 10,
		elevation: 5,
		backgroundColor: '#ff5917',
		borderRadius: 3
	},
	text: {
		fontFamily: 'Roboto_medium',
		color: 'white'
	}
})

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Message = props => {
	return(
		<View style={styles.message}>
			<Text style={styles.text}>{props.text}</Text>
		</View>
	);
}

const ListTarif = ({ list }) => {
	return(
		<View style={styles.list}>
			{list.map((x, i) => {
				const parsing = x.split('*');
				let produk = parsing[0];
				if (x.length > 0) {
					const tarif = x.split('|');
					let totalTarif = Math.floor(tarif[4]);
					return(
						<ListItem
							key={i}
						    title={`Rp. ${numberWithCommas(totalTarif)}`}
						    description={`${produk}`}
						    disabled={true}
						    style={{backgroundColor: 'transparant'}}
						/>
					);
				}
			})}
		</View>
	)
} 

const CekTarif = props => {
	const [state, setState] = React.useState({
		isKeyboardVisible: false,
		loading: false,
		list: [],
		errors: {}
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

	const onSearchTarif = (data) => {
		const { jenisKiriman, senderPostalCode, receiverPostalCode } = data;
		const param1 = `#1#${jenisKiriman}#${senderPostalCode}#${receiverPostalCode}#${data.berat}#${data.panjang}#${data.lebar}#${data.tinggi}#0#${data.nilai}`;
		setState(prevState => ({
			...prevState,
			loading: true,
			errors: {}
		}))
		api2.getTarif(param1)
			.then(res => {
				const response = res.split('#');
				setState(prevState => ({
					...prevState,
					loading: false,
					list: response
				}))
			})
			.catch(err => {
				console.log(err);
				if (err.global) {
					setState(prevState => ({
						...prevState,
						loading: false,
						errors: err,
						list: []
					}))
				}else{
					setState(prevState => ({
						...prevState,
						loading: false,
						errors: {
							global: 'Terdapat kesalahan, mohon coba beberapa saat lagi'
						},
						list: []
					}))
				}
			})
	}

	const onReset = () => setState(prevState => ({
		...prevState,
		list: []
	}))

	const { errors } = state;

	return(
		<View style={styles.root}>
			<Loader loading={state.loading} />
			<View style={styles.statusbar}>
				<StatusBar translucent barStyle="light-content" />
			</View>
			<TopNavigation
			    leftControl={BackAction()}
			    title='Cek Tarif'
			    alignment='start'
			    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
			    style={styles.navigation}
			/>
			<KeyboardAvoidingView
				style={{flex:1}} 
				behavior="padding" 
				enabled={state.isKeyboardVisible}
			>
				<ScrollView keyboardShouldPersistTaps='always'>	
					{ errors.global && <Message text={errors.global} />}
					<FormTarif 
						getAddres={(addres) => api.getKodePos(addres)}
						onSubmit={onSearchTarif}
						listLength={state.list.length}
						removeList={onReset}
					/>
					{ state.list.length > 0 && <ListTarif list={state.list} /> }
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

export default CekTarif;