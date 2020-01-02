import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from '@ui-kitten/components';
import Loader from "../../Loader";

const Judul = () => (
	<Text style={styles.header}>Summary Order</Text>
)

class ResultOrder extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul/>
	}) 

	state = {
		loading: false,
		success: false
	}

	// componentDidMount(){
	// 	console.log(this.props.navigation.state.params);
	// }

	convertTarif = (tarif) => {
		var result = '';
		if (tarif === 1) result = "Rp 100.000/PAKET KILAT KHUSUS (2-4 Hari)";
		if (tarif === 2) result = "Rp 240.000/EXPRESS NEXT DAY BARANG (1 Hari)";
		if (tarif === 3) result = "Rp 120.000/PAKETPOS VALUABLE GOODS (3 Hari)";
		if (tarif === 4) result = "Rp 120.000/PAKETPOS DANGEROUS GOODS (3 Hari)";
		return result;
	}

	onSubmit = () => {
		this.setState({ loading: true, success: false });
		setTimeout(() => this.setState({loading: false, success: true }), 1000);	
	}

	backHome = () => {
		this.props.navigation.navigate({
			routeName: 'IndexSearch',
			params: {}
		})
	}

	numberWithCommas = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render(){
		const { params } = this.props.navigation.state;
		const { selectedTarif } = this.props.navigation.state.params;
		// const deskripsiTarif = this.convertTarif(selectedTarif);
		return(
			<View style={{margin: 15}}>
				<Loader loading={this.state.loading} />
				{ !this.state.success ? <React.Fragment>
						<Text style={{
							fontFamily: 'open-sans-reg', 
							fontWeight: '700',
							paddingBottom: 12
						}}>{params.selectedTarif.description}</Text>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Text>Pengirim            :</Text>
							<Text>{params.deskripsiPengirim.nama}</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Text>Penerima           :</Text>
							<Text>{params.deskripsiPenerima.nama}</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Text>Jenis Kiriman   :</Text>
							<Text>{params.deskripsiOrder.jenis}</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Text>Nilai Barang 	    :</Text>
							<Text>Rp {this.numberWithCommas(params.deskripsiOrder.nilai)}</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Text>Estimasi Tarif	  :</Text>
							<Text>Rp {this.numberWithCommas(params.selectedTarif.tarif)}</Text>
						</View>

						{ /* <Text style={styles.labelResult}>Jenis Kiriman : { params.deskripsiOrder.jenis }</Text>
						<Text style={styles.labelResult}>Nilai Barang : { params.deskripsiOrder.nilai }</Text>
						<Text style={styles.labelResult}>Pengirim : { params.deskripsiPengirim.nama }</Text>
						<Text style={styles.labelResult}>Penerima : { params.deskripsiPenerima.nama }</Text> */ }
						
						<Button status='info' style={{marginTop: 10}} onPress={this.onSubmit}>Simpan</Button>
					</React.Fragment> : <React.Fragment>
						<Text style={{textAlign: 'center'}}>Proses order sukses. Id order = PSQ000182828261ZXC</Text>
						<Button status='info' style={{marginTop: 10}} onPress={this.backHome}>Ke halaman utama</Button>
					</React.Fragment>}
			</View>
		);
	}
}

export default ResultOrder;