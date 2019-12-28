import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import { Layout, Input, Button } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import styles from "./styles";

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>{navigation.deskripsiPengirim.nama} (Pengirim)</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>Kelola data penerima</Text>
	</View>
)

class Penerima extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	state = {
		data: {
			nama: ''
		}
	}

	onChange = (e) => this.setState({ data: { ...this.state.data, nama: e }})

	onSubmit = () => {
		this.props.navigation.navigate({
			routeName: 'PilihTarif',
			params: {
				...this.props.navigation.state.params,
				deskripsiPenerima: this.state.data
			}
		})
	}

	render(){
		const { data } = this.state;
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
						      placeholder='Nama'
						      label='Name Penerima'
						      labelStyle={styles.label}
						      value={data.nama}
						      onChangeText={this.onChange}
						    />
						</View>
						<View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingTop: 10}}/>
						<Text style={{color: 'red', fontSize: 12}}>Detail Penerima (menunggu parameter yang dibutuhkan)</Text>
						<Button style={{margin: 2}} onPress={this.onSubmit}>Selanjutnya</Button>
					</Layout>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default Penerima;