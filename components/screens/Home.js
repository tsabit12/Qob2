import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, Image, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { Button, Input } from '@ui-kitten/components';


class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};

	state = {
		pin: ''
	}

	pinRef = React.createRef();

	async componentDidMount(){
		const value = await AsyncStorage.getItem('qobUserPrivasi');
		console.log(value);
	}

	onChange = (e, { name }) => this.setState({ [name]: e })

	onSubmit = () => {
		this.props.navigation.navigate({
			routeName: 'IndexSearch'
		})
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 

		return (
			<SafeAreaView style={styles.container}>
				<Image source={require('../../assets/logoQOB.png')} 
				style={{width: 125, height: 125, resizeMode: 'stretch', 
				alignSelf: 'center', marginBottom: 40}}/>
				
				<Input 
					placeholder='Masukan PIN'
					ref={this.pinRef}
					size='medium'
					style={styles.input}
					maxLength={6}
					name='pin'
					keyboardType='numeric'
					onChangeText={(e) => this.onChange(e, this.pinRef.current.props)}
					onSubmitEditing={this.onSubmit}
				/>
				<Button status='info' size='medium' onPress={this.onSubmit}>MASUK</Button>
				<Text 
					style={{color: 'blue', paddingTop: 5}}
					onPress={() => this.props.navigation.navigate({
						routeName: 'LupaPin'
					})}
				>Lupa pin saya</Text>
				<View style={styles.link}>
					<Text>Belum memiliki akun ? daftar </Text>
					<Text 
						style={{color: 'blue'}}
						onPress={() => this.props.navigation.navigate({
			        		routeName: 'IndexRegister'
			        	})}	
					>disini</Text>
				</View>
		   	</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  // marginTop: Expo.Constants.statusBarHeight
	  justifyContent: 'center',
	  padding: 20
	},
	input: {
		paddingBottom: 5,
		paddingTop: 5
	},
	link: {
		flexDirection: 'row'
	},
	title: {
		paddingBottom: 20,
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 20
	}
  });
  