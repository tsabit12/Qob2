import React from "react";
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import { Button, Icon, TopNavigation, TopNavigationAction, CheckBox } from '@ui-kitten/components';
import Loader from "../../Loader";
import { curdateTime } from "../../utils/helper";
import api from "../../apiBaru";
import apiWs from "../../apiWs";
import apiYuyus from "../../api";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import SyaratKetentuan from "./SyaratKetentuan";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const rumusCod = (params) => {
	const result = {
		beaAdmin: 0,
		totalAll: 0
	}

	const defaultVal  = Number(params.deskripsiOrder.nilai) * 0.01;

	if (params.deskripsiOrder.cod) {
		if (!params.selectedTarif.freeOngkir) { //uncheck free ongkir

			if (params.selectedTarif.freeBea) {
				result.beaAdmin = 0;
				result.totalAll = Number(params.deskripsiOrder.nilai) + Number(params.selectedTarif.tarif);  
			}else{
				var getCodVal 	= defaultVal <= 1500 ? 1500 : defaultVal;
			
				result.beaAdmin = getCodVal;
				result.totalAll = Number(getCodVal) + Number(params.deskripsiOrder.nilai) + Number(params.selectedTarif.tarif); 
			}
		}else{
			if (params.selectedTarif.freeBea) {
				result.beaAdmin = 0;
				result.totalAll = Number(params.deskripsiOrder.nilai); 
			}else{
				var getCodVal 	= defaultVal <= 1500 ? 1500 : defaultVal;

				result.beaAdmin = getCodVal;
				result.totalAll = getCodVal + Number(params.deskripsiOrder.nilai);
			}
		}
	}

	return result;
}

const RenderInfo = ({ params, onSimpan, checked, onCheckedChange, userid, onPressSyarat }) => {
	const { totalAll, beaAdmin } = rumusCod(params); 

	return(
		<View style={{margin: 10, borderWidth: 0.4, borderColor: '#cbccc4', flex: 1}}>
			<View style={styles.labelTarif}>
				<Text style={{
					fontWeight: '700',
					textAlign: 'center',
					fontSize: 16,
					paddingBottom: 12,
					paddingTop: 12
				}}>{params.selectedTarif.description}</Text>
			</View>
			<View style={{padding: 10, flex: 1}}>
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Pengirim</Text>
					<Text style={styles.subTitle}>{capitalize(params.pengirimnya.nama)}</Text>
				</View>
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Alamat Pengirim</Text>
					<Text style={styles.subTitle}>
						{params.pengirimnya.alamat}, 
						{params.pengirimnya.kec}, 
						{params.pengirimnya.kota}, 
						{params.pengirimnya.provinsi} ({params.pengirimnya.kodepos})
					</Text>
				</View>
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Penerima</Text>
					<Text style={styles.subTitle}>{capitalize(params.deskripsiPenerima.nama)}</Text>
				</View>
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Alamat Penerima</Text>
					<Text style={styles.subTitle}>
						{params.deskripsiPenerima.alamatUtama}, 
						{params.deskripsiPenerima.kecamatan},  
						{params.deskripsiPenerima.kabupaten},  
						{params.deskripsiPenerima.provinsi} ({params.deskripsiPenerima.kodepos})
					</Text>
				</View>
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Isi Kiriman</Text>
					<Text style={styles.subTitle}>{params.deskripsiOrder.isiKiriman}</Text>
				</View>
				{ params.deskripsiOrder.cod && <View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Nilai Barang</Text>
					<Text style={styles.subTitle}>
							{`Rp ${numberWithCommas(Number(params.deskripsiOrder.nilai))}`}
					</Text>
				</View> }
				<View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Estimasi Ongkos Kirim</Text>
					<Text style={styles.subTitle}>
						{params.selectedTarif.freeOngkir ? 'Free Ongkir' : `Rp ${numberWithCommas(params.selectedTarif.tarif)}`}
					</Text>
				</View>
				{ params.deskripsiOrder.cod && <View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Fee COD</Text>
					<Text style={styles.subTitle}>
						{ numberWithCommas(beaAdmin) }
					</Text>
				</View> }
				{ params.deskripsiOrder.cod && <View style={styles.viewResult}>
					<Text style={styles.labelInformasi}>Total</Text>
					<Text style={styles.subTitle}>
						{ numberWithCommas(totalAll) }
					</Text>
				</View> }
				<View 
					style={{
						flex: 1, 
						flexDirection: 'row', 
						marginBottom: 5, 
						marginTop: 5, 
						borderWidth: 0.8,
						borderColor: '#9e9d9d',
						borderRadius: 5,
						backgroundColor: '#dbdad7',
						padding: 6}}>
					<CheckBox
				      status='warning'
				      style={{marginRight: 6}}
				      checked={checked}
				      onChange={onCheckedChange}
				    />
				    <Text style={{alignItems: 'flex-end', flex: 1}}>
					    <Text>Saya menyetujui</Text>
						<Text style={{color: '#0000FF'}} onPress={() => onPressSyarat()}> Syarat dan ketentuan </Text>
						<Text>yang berlaku di PT.POS INDONESIA</Text>
					</Text>
			    </View>
			    <View style={{width: '40%'}}>
					<Button status='warning' onPress={() => onSimpan()}>Simpan</Button>
				</View>
			</View>
		</View>	
	);
}

class ResultOrder extends React.Component{
	state = {
		loading: false,
		success: false,
		// payload: {},
		errors: {},
		idOrder: '',
		visible: true,
		checked: false,
		showSyarat: false,
		location: {},
		loadingMessage: 'Loading...'
	}

	getRandomInt = (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveOrder = () => {
		this.setState({ loading: true, success: false, loadingMessage: 'Loading...' });
		const { dataLogin } = this.props;
		const { params }	= this.props.navigation.state;
		const { selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima } = params;
		const { totalAll, beaAdmin } 	= rumusCod(params); 

		const payloadWsdl = {
			"email": dataLogin.detail.email,
		    "receivercustomertype":"1",
		    "itemtype":"1",
		    "type": deskripsiOrder.cod ? 'COD' : '',
		    "shipperzipcode": pengirimnya.kodepos,
		    "receiverzipcode": deskripsiPenerima.kodepos,
		    "customerid": dataLogin.userid,
		    "serviceid": selectedTarif.id,
		    "shippername": pengirimnya.nama,
		    "shipperaddress": pengirimnya.alamat,
		    "shippersubsubdistrict": "0",
		    "shippersubdistrict": pengirimnya.kec,
		    "shippercity": pengirimnya.kota,
		    "shipperprovince": pengirimnya.provinsi,
		    "shippercountry":"INDONESIA",
		    "shipperemail": pengirimnya.email ? pengirimnya.email : '-',
		    "shipperphone": pengirimnya.nohp,
		    "receivername": deskripsiPenerima.nama,
		    "receiveraddress": deskripsiPenerima.alamatUtama,
		    "receiversubsubdistrict": "0",
		    "receiversubdistrict": deskripsiPenerima.kecamatan,
		    "receivercity": deskripsiPenerima.kabupaten,
		    "receiverprovince": deskripsiPenerima.provinsi,
		    "receivercountry":"INDONESIA",
		    "receiveremail": deskripsiPenerima.email ? deskripsiPenerima.email : '-',
		    "receiverphone": deskripsiPenerima.nohp,
		    "weight": deskripsiOrder.berat,
		    "fee": selectedTarif.beadasar,
		    "feetax": selectedTarif.ppn,
		    "insurance": selectedTarif.htnb,
		    "insurancetax": selectedTarif.ppnhtnb,
		    "valuegoods": deskripsiOrder.nilai,
		    "desctrans": deskripsiOrder.isiKiriman,
		    "codvalue": totalAll,
		    "width": deskripsiOrder.lebar,
		    "length": deskripsiOrder.panjang,
		    "height": deskripsiOrder.tinggi,
		    "diagonal": 0,
		    "feeCod": beaAdmin
		};

		console.log(payloadWsdl);

		api.qob.booking(payloadWsdl)
			.then(res => {
				if (Object.keys(res.transref).length > 0) {
					const { extid } = res.transref;
					this.setState({ loading: false, success: true, idOrder: extid });
					Alert.alert(
					  `Notifikasi`,
					  `Order berhasil/sukses dengan ID ordernya adalah ${extid}. Klik tombol pickup dibawah jika anda ingin melakukan pickup kiriman tersebut sekarang atau lakukan pickup nanti pada menu riwayat order`,
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    },
					    {text: 'Pickup', onPress: () => this.pickupKiriman(selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima)},
					  ],
					  {cancelable: false},
					);
				}else{
					this.setState({ loading: false });
					this.showAlert('Id order tidak ditemukan', 'Notifikasi');
				}
			})
			.catch(err => {
				if (!err.respmsg) {
					this.setState({ loading: false });
					const msg = 'untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti';
					setTimeout(() => {
						this.showAlert(msg, 'Terdapat kesalahan');
					}, 30);
				}else{
					const { respmsg } = err;
					//auto syncronizeuser
					if (this.removeSpace(respmsg) === 'CLIENTISNOTFOUND') {
						this.autoSync();
						this.setState({ loadingMessage: 'Generate token...'});
					}else{
						this.setState({ loading: false });
						setTimeout(() => {
							this.showAlert(respmsg, 'Whooppps');
						}, 30);
					}
				}
			});
	}

	removeSpace = (text) => {
		return text.replace(/\s+/g, '');
	}

	autoSync = () => {
		//service yuyus dulu
		//buat generate token nya
		const { dataLogin } = this.props;
		apiYuyus.auth.genpwdweb(dataLogin.userid)
			.then(res => {
				const payload = {
					email: dataLogin.detail.email,
					pin: res.response_data1
				}
				this.setState({ loadingMessage: 'Sinkronisasi...'});
				api.qob.syncronizeUser(payload)
					.then(res => {
						//try to order again
						this.saveOrder();
					})
					.catch(err => {
						console.log(err);
						this.setState({ loading: false });
						if (!err.respmsg) {
							this.showAlert('Untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti','Terdapat kesalahan');
						}else{
							this.showAlert(err.respmsg, 'Whooppps');
						}
					})
			})
			.catch(err => { //yuyus error
				this.setState({ loading: false });
				if (!err.desk_mess) {
					this.showAlert('Untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti','Terdapat kesalahan');
				}else{
					this.showAlert(err.desk_mess, 'Whooppps');
				}
			})
	}

	pickupKiriman = (tarif, order, pengirim, penerima) => {
		const { totalAll } = rumusCod(this.props.navigation.state.params);

		if (Object.keys(this.state.location).length > 0 ) {
			this.setState({ loading: true });
			const payload = {
				shipper: {
					userId: this.props.dataLogin.userid,
					name: pengirim.nama,
					latitude: this.state.location.coords.latitude,
					longitude: this.state.location.coords.longitude,
			        phone: pengirim.nohp,
			        address: pengirim.alamat,
			        city: pengirim.kota,
			        subdistrict: pengirim.kec,
			        zipcode: pengirim.kodepos,
			        country: "Indonesia"
				},
				item: [{
					extid: this.state.idOrder,
					itemtypeid: 1,
		            productid: tarif.id,
		            valuegoods: nilaiCod,
		            uomload: 5,
		            weight: order.berat,
		            uomvolumetric: 2,
		            length: order.panjang,
		            width: order.lebar,
		            height: order.tinggi,
		            codvalue: nilaiCod,
		            fee: tarif.beadasar,
		            feetax: tarif.ppn,
		            insurance: tarif.htnb,
		            insurancetax: tarif.ppnhtnb,
		            discount: 0,
		            desctrans: order.isiKiriman,
		            receiverzipcode: penerima.kodepos
				}]
			}
			apiWs.qob.addPickup(payload)
				.then(res => {
					const { pickup_number } = res;
					const { location } = this.state;
					const payloadExtid = [{ extid: this.state.idOrder }];
					
					const payloadStatus = {
						pickupNumber: pickup_number,
						extid: payloadExtid, 
						shipperLatlong: `${location.coords.latitude}|${location.coords.longitude}`
					};

					api.qob.updateStatus(payloadStatus)
						.then(resStatus => {
							this.setState({ loading: false });
							this.showAlert(`${resStatus.length} item berhasil dipickup dengan nomor pickup : ${pickup_number}`, 'Notifikasi');
						}).catch(err => {
							this.setState({ loading: false });
							this.showAlert(`Terdapat kesalahan`,'Whooppps');
						})
				})
				.catch(err => {
					this.setState({ loading: false });
					if (err.text) {
						this.showAlert(`Kodepos pengirim saat ini belum tercover`,'Notifikasi')
					}else{
						this.showAlert(`Terdapat kesalahan`,'Whooppps')
					}
				})
		}else{
			Alert.alert(
			  `Notifikasi`,
			  `Kami belum mendapatkan lokasi anda saat ini`,
			  [
			  	{
			      text: 'Batal',
			      style: 'cancel',
			    },
			    {text: 'GET LOCATION', onPress: () => this._getLocationAsync(tarif, order, pengirim, penerima)},
			  ],
			  {cancelable: false},
			);
		}

	}

	_getLocationAsync = async (tarif, order, pengirim, penerima) => {
	    await Location.getCurrentPositionAsync({})
	    .then(res => {
	    	this.setState({ location: res });
	    	this.pickupKiriman(tarif, order,pengirim, penerima);
	    })
	}

	showAlert = (msg, title) => {
		Alert.alert(
		  `${title}`,
		  `${msg}`,
		  [
		  	{
		      text: 'Tutup',
		      style: 'cancel',
		    },
		  ],
		  {cancelable: false},
		);
	}

	onSubmit = () => {
		const { checked } = this.state;
		if (!checked) {
			alert("Harap centang persyaratan dan ketentuan terlebih dahulu");
		}else{
			this.saveOrder();
		}
	}

	backHome = () => {
		this.props.navigation.navigate({
			routeName: 'IndexMenu',
			params: {}
		})
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		const { params } = this.props.navigation.state;
		const { selectedTarif } = this.props.navigation.state.params;
		const { errors } = this.state;

		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Order'
				    subtitle='Summary'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<Loader loading={this.state.loading} messagenya={this.state.loadingMessage} />
				<React.Fragment>
					{ !this.state.success ? 
						<ScrollView>
							<RenderInfo 
								params={params} 
								onSimpan={this.onSubmit} 
								checked={this.state.checked} 
								onCheckedChange={() => this.setState({ checked: !this.state.checked})}
								userid={this.props.dataLogin.userid} 
								onPressSyarat={() => this.setState({ showSyarat: true })}
							/>
						</ScrollView> : <React.Fragment>
							<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center'}}>
								<Button status='warning' onPress={() => this.backHome()}>Kembali ke menu utama</Button>
							</View>
						</React.Fragment> }
				</React.Fragment>
				<SyaratKetentuan 
					visible={this.state.showSyarat} 
					handleClose={() => this.setState({ showSyarat: false })}
				/>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(ResultOrder);