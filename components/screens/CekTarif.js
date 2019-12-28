import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from "react-native";
import { Layout, Input, Button, ListItem } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import Loader from "../Loader";

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>Cek Tarif</Text>
	</View>
);

const ListTarif = () => (
	<View style={{paddingBottom: 10}}>
		<ListItem
		    title='Rp 100.000'
		    description='PAKET KILAT KHUSUS (2-4 Hari)'
		/>
		<ListItem
		    title='Rp 240.000'
		    description='EXPRESS NEXT DAY BARANG (1 Hari)'
		/>
		<ListItem
		    title='Rp 120.000'
		    description='PAKETPOS VALUABLE GOODS (3 Hari)'
		/>
		<ListItem
		    title='Rp 120.000'
		    description='PAKETPOS DANGEROUS GOODS (3 Hari)'
		/>
	</View>
);

class CekTarif extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	state = {
		loading: false,
		success: false
	}

	onClick = () => {
		this.setState({ loading: true, success: false });
		setTimeout(() => this.setState({loading: false, success: true }), 1000);	
	}

	onReset = () => this.setState({ success: false });

	render(){
		const { loading, success } = this.state;
		return(
			<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					keyboardVerticalOffset = {Header.HEIGHT + 40}
					enabled
				>
				<Loader loading={loading} />
				<ScrollView keyboardShouldPersistTaps='always'>
					<Layout style={styles.container}>
						<View style={{padding: 4}}>
							<Input
						      placeholder='Masukan kota asal'
						      name='nilai'
						      label='Kota Asal'
						      labelStyle={styles.label}
						      style={styles.input}
						    />
						</View>
						<View style={{padding: 4}}>
							<Input
						      placeholder='Masukan kota tujuan'
						      name='nilai'
						      label='Kota Tujuan'
						      labelStyle={styles.label}
						      style={styles.input}
						    />
						</View>
						<View style={styles.hitung}>
						    <Input
						      placeholder='XX (CM)'
						      label='Panjang'
						      name='panjang'
						      labelStyle={styles.label}
						      style={styles.inputHitung}
						      keyboardType='numeric'
						    />
						    <Input
						      placeholder='XX (CM)'
						      label='Lebar'
						      name='lebar'
						      labelStyle={styles.label}
						      style={styles.inputHitung}
						      keyboardType='numeric'
						      style={styles.inputHitung}
						    />
						    <Input
						      placeholder='XX (CM)'
						      label='Tinggi'
						      name='tinggi'
						      labelStyle={styles.label}
						      keyboardType='numeric'
						      style={styles.inputHitung}
						    />
						</View>
						<View style={styles.button}>
							<Button style={{margin: 2, flex: 1}} status='info' onPress={this.onClick}>Cek Tarif</Button>
							{ success && <Button style={{margin: 2, flex: 1}} status='danger' onPress={this.onReset}>Reset</Button>}
						</View>
					</Layout>
					{ success && <ListTarif /> }
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	header: {
	  	fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	hitung: {
	  	flexDirection: 'row',
		alignSelf: 'stretch',
		paddingBottom: 7
	},
	label: {
	  	color: 'black',
	  	fontSize: 15,
	  	fontFamily: 'open-sans-reg'
	},
	container: {
	    padding: 10,
	},
	inputHitung: {
	  	paddingRight: 4,
	  	padding: 3,
	  	flex: 1
	},
	button: {
		flexDirection: 'row',
		alignSelf: 'stretch'
	}
});

export default CekTarif;