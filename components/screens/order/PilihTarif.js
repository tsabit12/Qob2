import React from "react";
import { View, Text } from "react-native";
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
			{ list.map((x, i) => {
				const parsing = x.split('*');
				let produk = parsing[0];
				if (x.length > 0) { //handle tarif last index cause parsing (#)
					// console.log(parsing);
					let tarif = parsing[1];
					tarif = tarif.split('|');
					// console.log(tarif);
					let fee 		= Math.floor(tarif[0]);
					let ppn 		= Math.floor(tarif[1]);
					let htnb 		= Math.floor(tarif[2]);
					let ppnhtnb 	= Math.floor(tarif[3]);
					let totalTarif 	= Math.floor(tarif[4]);

					//get id serve
					let idService = produk.split('-');
					idService = idService[0];

					const payload = {
						id: idService,
						description: produk,
						tarif: totalTarif,
						beadasar: fee,
						ppn: ppn,
						htnb: htnb,
						ppnhtnb: ppnhtnb
					};

					return(
						<ListItem
							key={i}
						    title={`Rp. ${numberWithCommas(totalTarif)}`}
						    description={produk}
							accessory={(e) => renderItemAccessory(e, payload, onAccept)}
							onPress={() => onAccept(payload)}
						/>
					)
				}
			})}
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
		tarif: []
	}
	
	async componentDidMount(){
		const { params } = this.props.navigation.state;

		if (Object.keys(params).length > 0) {
			const payload = {
				kodePosA: params.pengirimnya.kodepos,
				kodePosB: params.deskripsiPenerima.kodepos,
				berat: params.deskripsiOrder.berat,
				nilai: params.deskripsiOrder.nilai
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
				selectedTarif: payload
			}
		})
	}

	render(){
		const { loading, tarif } = this.state;
		return(
			<View>
				<Loader loading={loading} />
				{ tarif.length > 0 ? <ListTarif onAccept={this.onSelectTarif} list={tarif} /> : 
					<React.Fragment>
						{ !loading && <Text style={{fontSize: 20, textAlign: 'center', fontFamily: 'open-sans-bold', marginTop: 10}}>
							Tarif tidak ditemukan
						</Text> }
					</React.Fragment> }
			</View>
		);
	}
}

export default PilihTarif;