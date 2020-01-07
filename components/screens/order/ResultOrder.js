import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import Modal from "../../Modal";
import { curdateTime } from "../../utils/helper";
import api from "../../api";
import Dialog from "react-native-dialog";

const Judul = () => (
	<Text style={styles.header}>Summary Order</Text>
)

class ResultOrder extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul/>
	}) 

	state = {
		loading: false,
		success: false,
		payload: {},
		errors: {},
		idOrder: '',
		visible: true
	}

	componentDidMount(){
		const { params } = this.props.navigation.state;
		// console.log(this.props.navigation.state.params);
		const { selectedTarif } = params;
		const { deskripsiOrder } = params;
		const { deskripsiPengirim } = params;
		const { deskripsiPenerima } = params;
		var idOrder = this.getRandomInt(10000000000, 99999999999);
		idOrder 	= `QOB${idOrder}`;
		let param1 = `${curdateTime()}|${idOrder}|440000347|001`;
		let param2 = `${selectedTarif.id}|0000000099|-|${deskripsiOrder.berat}|${selectedTarif.beadasar}|${selectedTarif.htnb}|${selectedTarif.ppn}|${selectedTarif.ppnhtnb}|${deskripsiOrder.jenis}|${deskripsiOrder.nilai}|-|-`;
		let param3 = `${deskripsiPengirim.nama}|${deskripsiPengirim.alamat2}|${deskripsiPengirim.alamat}|-|${deskripsiPengirim.kota}|Jawa Barat|Indonesia|${deskripsiPengirim.kodepos}|${deskripsiPengirim.nohp}|${deskripsiPengirim.email}`;
		let param4 = `-|${deskripsiPenerima.nama}|${deskripsiPenerima.alamat2}|-|-|${deskripsiPenerima.alamat}|-|${deskripsiPenerima.kota}|Jawa Barat|-|Indonesia|${deskripsiPenerima.kodepos}|${deskripsiPenerima.nohp}|${deskripsiPenerima.email}|-|-`;
		let param5 = `1|0|-|0`;
		const payload = {
			param1: param1,
			param2: param2,
			param3: param3,
			param4: param4,
			param5: param5
		};
		this.setState({ payload, idOrder: idOrder });
	}

	getRandomInt = (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onSubmit = () => {
		this.setState({ loading: true, success: false });
			api.qob.booking(this.state.payload)
				.then(res => {
					this.setState({ loading: false, success: true });
				})
				.catch(err => {
					// console.log(err);
					if (Object.keys(err).length === 10) {
						this.setState({ loading: false, errors: {global: err.desk_mess }});	
					}else{
						this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
					}
				})
		// setTimeout(() => this.setState({loading: false, success: true }), 1000);	
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
		const { errors } = this.state;

		return(
			<React.Fragment>
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> } 
				<Loader loading={this.state.loading} />
				{ !this.state.success ? <View style={{margin: 15}}>
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
						
						<Button status='info' style={{marginTop: 10}} onPress={this.onSubmit}>Simpan</Button>
					</View> : <React.Fragment>
						<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
							<Text style={{fontFamily: 'open-sans-reg', fontSize: 20, textAlign: 'center' }}>SUKSES!</Text>
							<Button status='info' onPress={() => this.backHome()}>Kembali ke home</Button>
						</View>
						<View>
							<Dialog.Container visible={this.state.visible}>
								<Dialog.Title>BERHASIL/SUKSES</Dialog.Title>
						        <Dialog.Description>
						          	<Text>Nomor order   : {this.state.idOrder} {'\n'}</Text>
						          	<Text>Jenis Kiriman : {params.deskripsiOrder.jenis}</Text>
						        </Dialog.Description>
					          <Dialog.Button label="Tutup" onPress={() => this.setState({ visible: false })} />
					        </Dialog.Container>
						</View>
					</React.Fragment>}
			</React.Fragment>
		);
	}
}

export default ResultOrder;