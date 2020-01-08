import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import styles from "./styles";
import { ListItem, Button } from '@ui-kitten/components';
import api from "../../api";
import Loader from "../../Loader";

const renderItemAccessory = (style, payload, accept) => (
	<Button style={style} size='small' status='info' onPress={() => accept(payload)}>Pilih</Button>
);

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ListTarif = ({ onAccept, list }) => (
	<View style={{paddingBottom: 10}}>
		{ list.length > 0 && <View>
			{ list.map((x, i) => {
				const parsing = x.split('-');
				//I Hate STRING!
				if (x.length > 0) { //handle tarif last index cause parsing (#)
					var tarif 	= parsing[2];
					tarif = tarif.split('*');
					tarif = tarif[1];
					tarif = tarif.split('|');
					// console.log(tarif[4]);
					let totalTarif = tarif[4];
					const payload = {
						id: parsing[0],
						description: parsing[1],
						tarif: totalTarif,
						beadasar: tarif[0],
						ppn: tarif[1],
						htnb: tarif[2],
						ppnhtnb: tarif[3]
					};
					return(
						<ListItem
							key={i}
						    title={`Rp. ${numberWithCommas(totalTarif)}`}
						    description={parsing[1]}
							accessory={(e) => renderItemAccessory(e, payload, onAccept)}
							onPress={() => onAccept(payload)}
						/>
					)
				}
			})}
		</View> }
	</View>
);



const Judul = () => (
	<Text style={styles.header}>Pilih Tarif</Text>
)

class PilihTarif extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul/>
	}) 

	state = {
		loading: true,
		tarif: [],
		deskripsiPengirim: {}
	}
	
	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('sessionLogin');
		const toObje 	= JSON.parse(value);
		
		this.setState({
			deskripsiPengirim: {
				nama: toObje.nama,
				namaOl: toObje.namaOl,
				kodepos: toObje.kodepos,
				alamat: toObje.alamatOl,
				kota: toObje.kota
			}
		});

		const { params } = this.props.navigation.state;
		if (Object.keys(params).length > 0) {
			const payload = {
				kodePosA: toObje.kodepos,
				kodePosB: params.deskripsiPenerima.kodepos,
				berat: params.deskripsiOrder.berat
			}
			api.qob.getTarif(payload)
				.then(res => {
					this.setState({ loading: false });
					// console.log(res);
					const response = res.split('#');
					this.setState({ tarif: response });
					// console.log(response);
				}).catch(err => this.setState({ loading: false }))
		}
		//console.log(this.props.navigation.state.params);
	}

	onSelectTarif = (payload) => {
		this.props.navigation.navigate({
			routeName: 'ResultOrder',
			params: {
				...this.props.navigation.state.params,
				selectedTarif: payload,
				deskripsiPengirim: this.state.deskripsiPengirim
			}
		})
	}

	render(){
		const { loading, tarif } = this.state;
		return(
			<View>
				<Loader loading={loading} />
				<ListTarif onAccept={this.onSelectTarif} list={tarif} />
			</View>
		);
	}
}

export default PilihTarif;