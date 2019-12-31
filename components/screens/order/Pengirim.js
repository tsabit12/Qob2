import React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import styles from "./styles";
import { Header } from 'react-navigation-stack';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import SearchableDropdown from 'react-native-searchable-dropdown';
import api from "../../api";

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

	state = {
		data:{
			nama: ''
		},
		items: [],
		selectedItems: [],
	    loadingProv: false
	}

	// componentDidMount(){
	// 	console.log(this.props.navigation.state.params);
	// }
	onChangeProv = (text) => {
		clearTimeout(this.timer);
		this.setState({ data: { ...this.state.data, prov: text}});
		this.timer = setTimeout(this.getProv, 500);
	} 

	getProv = () => {
		if (!this.state.data.prov) return;
		this.setState({ loadingProv: true });
		api.search.provinsi(this.state.data.prov)
			.then(list => {
				const items = [];
				list.forEach(x => {
					items.push({
						id: x.Kode_Propinsi,
						name: x.Nama_Propinsi
					});
				})
				this.setState({ loadingProv: false, items });
			})
			.catch(err => {
				this.setState({ loadingProv: false })
			})
	}

	onSubmit = () => {
		this.props.navigation.navigate({
			routeName: 'OrderPenerima',
			params: {
				...this.props.navigation.state.params,
				deskripsiPengirim: this.state.data
			}
		})
	}

	onChange = (e) => this.setState({ data: { ...this.state.data, nama: e }})

	render(){
		const { loadingProv, data } = this.state;
		// console.log(this.state.items);
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
						      label='Name Pengirim'
						      labelStyle={styles.label}
						      value={data.nama}
						      onChangeText={this.onChange}
						    />
						</View>
						<View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingTop: 10}}/>
						<Text style={{color: 'red', fontSize: 12}}>Detail Pengirim (menunggu parameter yang dibutuhkan)</Text>
						<Button style={{margin: 2}} onPress={this.onSubmit}>Selanjutnya</Button>
					</Layout>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default Pengirim;