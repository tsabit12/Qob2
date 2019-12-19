import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import FormRegister from "./forms/FormRegister";
import { Button, ButtonGroup } from '@ui-kitten/components';
import { HeaderBackButton } from "react-navigation-stack";
import RegisterUsername from "./forms/RegisterUsername";

const Judul = ({ navigation }) => (
	<View> 
		<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
		{ navigation.state.params.form2 ? 
			<Text>Username & Password</Text> : 
			<Text style={{textTransform: 'capitalize'}}>{navigation.state.params.fullname}</Text>}
	</View>
)

class RegistrasiGiro extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	  headerTitle: <Judul navigation={navigation} />,
	  headerLeft: <HeaderBackButton onPress={() => 
	  	{ navigation.state.params.form2 ? 
	  		navigation.getParam('backToForm1')() : 
	  		navigation.navigate({
	  			routeName: 'Register'
	  		}) 
	  	} 
	  }/>
	});

	state = {
		submitform1: false,
		data1: {},
		selected: {}
	}
    	
	async componentDidMount(){
		this.props.navigation.setParams({
			myTitle: this.props.navigation.state.params.fullname,
			backToForm1: this.onBackForm1
		});
	}

	onSubmit = (value, selected) => {
		this.setState({ submitform1: true, data1: value, selected: selected });	
		this.props.navigation.setParams({
			form2: true
		})
	} 

	onBackForm1 = () => {
		this.setState({ submitform1: false });
		this.props.navigation.setParams({
			form2: false
		})
	}

	onSubmitUsername = (data) => {
		const { data1 } = this.state;
		this.setState({ data1: Object.assign(data1, data) });
	}

	render(){
		const { submitform1 } = this.state;
		console.log(this.state.data1);
		return(
			<SafeAreaView style={styles.safeContainer}>
				 <ScrollView keyboardShouldPersistTaps='handled'>
				    <View style={styles.containerForm}>
				    	{ !submitform1 ? 
				    		<FormRegister 
				    			ktp={this.props.navigation.state.params} 
				    			submit={this.onSubmit} 
				    			dataForm={this.state.data1}
				    			selected={this.state.selected}
				    		/> : 
				    		<RegisterUsername submit={this.onSubmitUsername} />
				    	}
				    </View>
			    </ScrollView>
		    </SafeAreaView>
		);
	}
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'flex-start'
  },
  containerForm: {
  	padding: 16,
  	marginTop: -15,
  	textTransform: 'capitalize'
  },
  safeContainer: {
    flex: 1,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 7
  },
});


export default RegistrasiGiro;