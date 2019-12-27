import React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import styles from "./styles";
import { Header } from 'react-navigation-stack';
import { Layout, Text, Input } from '@ui-kitten/components';
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
			prov: ''
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

	render(){
		const { loadingProv } = this.state;
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
						    />
						</View>
						<View>
							<View style={{flexDirection: 'row'}}>
								<Text style={{paddingLeft: 5, fontFamily: 'open-sans-reg'}}>Provinsi </Text>
								{ loadingProv && <Text style={{fontSize: 12, color: 'red'}}>(loading..)</Text>}
							</View>
							<SearchableDropdown
					            onItemSelect={(item) => {
					              const items = this.state.selectedItems;
					              items.push(item)
					              this.setState({ selectedItems: items });
					            }}
					            containerStyle={{ padding: 5 }}
					            // onRemoveItem={(item, index) => {
					            //   const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
					            //   this.setState({ selectedItems: items });
					            // }}
					            itemStyle={{
					              padding: 10,
					              marginTop: 2,
					              backgroundColor: '#ddd',
					              borderColor: '#bbb',
					              borderWidth: 1,
					              borderRadius: 5,
					            }}
					            itemTextStyle={{ color: '#222' }}
					            itemsContainerStyle={{ maxHeight: 140 }}
					            items={this.state.items}
					            // defaultIndex={2}
					            resetValue={false}
					            textInputProps={
					              {
					                placeholder: "Cari provinsi",
					                underlineColorAndroid: "transparent",
					                style: {
					                    padding: 8,
					                    borderWidth: 1,
					                    borderColor: '#ccc',
					                    borderRadius: 5,
					                },
					                onTextChange: text => this.onChangeProv(text)
					              }
					            }
					            listProps={
					              {
					                nestedScrollEnabled: true,
					              }
					            }
					        />
						</View>
					</Layout>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default Pengirim;