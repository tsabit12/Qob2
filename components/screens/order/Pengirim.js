import React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import styles from "./styles";
import { Header } from 'react-navigation-stack';
import { Layout, Text, Input } from '@ui-kitten/components';

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>{navigation.deskripsiOrder.jenis}</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>Kelola data pengirim</Text>
	</View>
)


class Pengirim extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	// componentDidMount(){
	// 	console.log(this.props.navigation.state.params);
	// }
	render(){
		return(
			<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					keyboardVerticalOffset = {Header.HEIGHT + 40}
					enabled
				>
				<ScrollView keyboardShouldPersistTaps='always'>
					<Layout style={styles.container}>
						<View style={{padding: 4}}>
							<Input
						      placeholder='Nama pengirim'
						      label='Name Pengirim'
						      labelStyle={styles.label}
						    />
						</View>
					</Layout>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default Pengirim;