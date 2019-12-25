import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';

class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};
    
	componentDidMount(){
		// api.laporan.rekKoran('0000000018')
		// 	.then(res => console.log(res))
		// 	.catch(err => console.log(err))
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 

		return (
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
	  backgroundColor: '#FF5000',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	logo:{
	  fontWeight:"bold",
	  fontSize:50,
	  color:"#fb5b5a",
	  marginBottom:40
	},
	inputView:{
	  width:"80%",
	  backgroundColor:"white",
	  borderRadius:25,
	  height:50,
	  marginBottom:20,
	  justifyContent:"center",
	  padding:20
	},
	inputText:{
	  height:50,
	  color:"white"
	},
	forgot:{
	  color:"white",
	  fontSize:11
	},
	loginBtn:{
	  width:"80%",
	  backgroundColor:"white",
	  borderRadius:25,
	  height:50,
	  alignItems:"center",
	  justifyContent:"center",
	  marginTop:40,
	  marginBottom:10
	},
	daftarBtn:{
		width:"80%",
		backgroundColor:"white",
		borderRadius:25,
		height:50,
		alignItems:"center",
		justifyContent:"center",
		marginTop:40,
		marginBottom:10
	},
	loginText:{
	  color:"black"
	}
  });
  