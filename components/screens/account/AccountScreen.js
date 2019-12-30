import React from "react";
import {View, Text } from "react-native";
import styles from "./styles";

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>Profile</Text>
		<Text style={styles.text}>Jhon Doe</Text>
	</View>
);

class AccountScreen extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	render(){
		return(
			<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
				<Text>Information about your account here..</Text>
			</View>
		);
	}
}

export default AccountScreen;