import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, Image } from 'react-native';
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
<<<<<<< HEAD
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
=======
		  <View style={styles.container}>
		  {/* <View style={styles.inputView} >
			<TextInput  
			  style={styles.inputText}
			  placeholder="Username..." 
			  onChangeText={text => this.setState({username:text})}/>
		  </View>
		  <View style={styles.inputView} >
			<TextInput  
			  secureTextEntry
			  style={styles.inputText}
			  placeholder="Password..." 
			  onChangeText={text => this.setState({password:text})}/>
		  </View> */}
		  <TouchableOpacity style={styles.loginBtn}>
			<Text style={styles.loginText}
			onPress= {() => this.props.navigation.navigate({
				routeName: 'Dashboard'
			})}>Masuk</Text>
		  </TouchableOpacity>
		  <TouchableOpacity style={styles.daftarBtn}>
			<Text style={styles.loginText}
			onPress= {() => this.props.navigation.navigate({
				    		routeName: 'IndexRegister'
				    	})}>Daftar </Text>
		  </TouchableOpacity>
		  <TouchableOpacity>
		  <Text 
				style={{color: 'blue'}}
				onPress={() => this.props.navigation.navigate({
					routeName: 'IndexSearch'
				})}
			>
				Search
			</Text>
		  </TouchableOpacity>
		</View>
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
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
		flexDirection: 'row',
		paddingTop: 7
	},
	title: {
		paddingBottom: 20,
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 20
	}
  });
  