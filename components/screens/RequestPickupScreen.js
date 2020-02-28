import React from "react";
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import Constants from 'expo-constants';
import apiWs from "../apiWs";
import { connect } from "react-redux";
import { getAddPosting, addPickup } from "../../actions/pickup";
import { Icon, TopNavigation, TopNavigationAction, Spinner, ListItem, Button, CheckBox } from '@ui-kitten/components';
import { omit } from 'lodash';
import Dialog from "react-native-dialog";
import Loader from "../Loader";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const MyStatusBar = () => (
	<View style={{
		height: Constants.statusBarHeight,
  		backgroundColor: 'rgb(240, 132, 0)'
	}}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const Loading = () => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Spinner size='medium' />
	</View>
);

const renderItemAccessory = (style, id, onCheckedChange, checked) => {
	return(
		<CheckBox
	      checked={checked[id]}
	      onChange={() => onCheckedChange(id)}
	    />
	)
} 

const RenderListData = ({ list, onCheckedChange, checked, showDetail, detail }) => (
	<View>
		{ list.map((x, i) => 
			<View key={i} style={{borderBottomWidth: 0.3, borderBottomColor: '#3366ff'}}>
				<ListItem 
					title={x.externalId} 
					description={x.orderDate.substring(0, 10)}
					titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
					onPress={() => showDetail(x.externalId)}
					accessory={(e) => renderItemAccessory(e, x.externalId, onCheckedChange, checked)}
				/>
				{ detail[x.externalId] && <View style={{marginLeft: 15}}>
						<View style={styles.listDetail}>
							<Text style={styles.titleDetail}>Isi Kiriman</Text>
							<Text style={styles.subtitleDetail}>{x.contentDesc}</Text>
						</View>
						<View style={styles.listDetail}>
							<Text style={styles.titleDetail}>Nilai Barang</Text>
							<Text style={styles.subtitleDetail}>Rp {numberWithCommas(x.itemValue)}</Text>
						</View>
						<View style={styles.listDetail}>
							<Text style={styles.titleDetail}>Berat Kiriman</Text>
							<Text style={styles.subtitleDetail}>{numberWithCommas(x.weight)} gram</Text>
						</View>
						<View style={styles.listDetail}>
							<Text style={styles.titleDetail}>Data Pengirim</Text>
							<Text style={styles.subtitleDetail}>{x.senderName}</Text>
							<Text style={styles.subtitleDetail}>{x.senderAddr}, {x.senderVill}, {x.senderSubDist}, {x.senderCity}, {x.senderProv}</Text>
						</View>
						<View style={styles.listDetail}>
							<Text style={styles.titleDetail}>Data Penerima</Text>
							<Text style={styles.subtitleDetail}>{x.receiverName}</Text>
							<Text style={styles.subtitleDetail}>{x.receiverAddr}, {x.receiverVill}, {x.receiverSubDist}, {x.receiverCity}, {x.receiverProv}</Text>
						</View>
					</View> }
			</View>
		)}
	</View>
);

const ViewModalDialog = ({ handleClose, total, submitPikcup }) => (
	<View>
		{ total === 0 ? <Dialog.Container visible={true}>
        	<Dialog.Title>NOTIFIKASI</Dialog.Title>
        	<Dialog.Description>
        		<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>
        			Harap centang terlebih dahulu salah satu nomor order diatas
        		</Text>
        	</Dialog.Description>
          <Dialog.Button label="Tutup" onPress={() => handleClose()} />
        </Dialog.Container> : 
    	<Dialog.Container visible={true}>
        	<Dialog.Title>NOTIFIKASI</Dialog.Title>
        	<Dialog.Description>
        		<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>
        			Apakah anda yakin untuk melakukan request pickup dengan total item yang dipilih adalah ({total} item) ?
        		</Text>
        	</Dialog.Description>
          <Dialog.Button label="Tutup" onPress={() => handleClose()} />
          <Dialog.Button label="Pickup" onPress={() => submitPikcup()} />
        </Dialog.Container> }
    </View>
);

const EmptyOrErrorMessage = ({ message }) => (
	<View style={{margin: 10, flex: 1}}>
		<View style={{borderWidth: 0.3, height: 50, justifyContent: 'center', alignItems: 'center'}}>
			<Text>{message}</Text>
		</View>
	</View>
); 

class RequestPickupScreen extends React.Component{
	state = {
		errors: {},
		checked: {},
		showModal: false,
		loading: false,
		// openDetail: {
		// 	status: false,
		// 	data: {}
		// },
		open: {},
		location: {},
		isLoading: true
	}

	async componentDidMount(){
		const { userid, norek } = this.props.dataLogin;
		const { status } = await Permissions.getAsync(Permissions.LOCATION);
	    if (status !== 'granted') {
	      const response = await Permissions.askAsync(Permissions.LOCATION);
	    }else{
	    	this._getLocationAsync()
	    		.then(() => this.setState({ isLoading: false }))
	    		.catch(() => this.setState({ isLoading: false }))
	    }

		this.props.getAddPosting(userid)
			.catch(err => {
				if (err.response.data.errors) {
					this.setState({ errors: err.response.data.errors })
				}else{
					this.setState({ 
						errors: { 
							global: 'Terdapat kesalahan'
						}
					});
				}
			});
	}

	_getLocationAsync = async () => {
	    let location = await Location.getCurrentPositionAsync({});
	    this.setState({ location });
	}

	getCurLocation = () => {
		this.setState({ isLoading: true });
		this._getLocationAsync()
    		.then(() => this.setState({ isLoading: false }))
    		.catch(() => this.setState({ isLoading: false }))
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	removeSpace = (text) => {
		return text.replace(/\s+/g, '').toLowerCase();
	}

	onCheckedChange = (id) => {
		const checkedId = this.state.checked[id] ? this.state.checked[id] : false;
		const { checked } = this.state;
		if (checkedId) {
			this.setState({
				checked: omit(checked, id)
			})
		}else{
			//get first checked
			const firstArr = Object.keys(checked)[0];
			if (firstArr) {
				const getFirstDetail = this.props.listPickup.find(x => x.externalId === firstArr);
				const getNextDetail = this.props.listPickup.find(x => x.externalId === id);
				const firstData = {
					posCode: getFirstDetail.senderPosCode,
					addr: this.removeSpace(getFirstDetail.senderAddr),
					vill: this.removeSpace(getFirstDetail.senderVill),
					city: this.removeSpace(getFirstDetail.senderCity)
				};
				const nextData = {
					posCode: getNextDetail.senderPosCode,
					addr: this.removeSpace(getNextDetail.senderAddr),
					vill: this.removeSpace(getNextDetail.senderVill),
					city: this.removeSpace(getNextDetail.senderCity)
				};

				if (firstData.posCode !== nextData.posCode || firstData.addr !== nextData.addr || firstData.vill !== nextData.vill || firstData.city !== nextData.city) {
					Alert.alert(
					  'Alamat pengirim tidak sama!',
					  'Dalam satu kali pickup hanya bisa dilakukan jika alamat pengirim sama. Harap pastikan kembali bahwa kodepos dan alamat pengirim sudah sama',
					  [
					    {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  {cancelable: false},
					);
				}else{
					this.setState({
						checked: {
							...this.state.checked,
							[id]: true
						}
					})
				}
			}else{//handle undefined
				this.setState({
					checked: {
						...this.state.checked,
						[id]: true
					}
				})
			}
		}
	}

	onPickup = () => this.setState({ showModal: true })

	onSubmit = () => {
		this.setState({ showModal: false, loading: true });
		var keys = [];
		const { checked } 		= this.state;
		const { listPickup } 	= this.props;
		for (var k in checked) keys.push(k);
		//filter list by checked
		const filter = listPickup.filter(x => keys.includes(x.externalId));
		const unFilterState = listPickup.filter(x => !keys.includes(x.externalId));

		var payloadItem = [];
		filter.forEach(x => {
			payloadItem.push({
				extid: x.externalId,
				itemtypeid: 1,
	            productid: x.serviceId,
	            valuegoods: x.itemValue,
	            uomload: 5,
	            weight: x.weight,
	            uomvolumetric: 2,
	            length: x.panjang,
	            width: x.lebar,
	            height: x.tinggi,
	            codvalue: x.cod,
	            fee: x.fee,
	            feetax: x.feeTax,
	            insurance: x.insurance,
	            insurancetax: x.insuranceTax,
	            discount: 0,
	            desctrans: x.contentDesc,
	            receiverzipcode: x.receiverPosCode
			});
		})
		const allPayload = {
			shipper: {
				userId: this.props.dataLogin.userid,
				name: filter[0].senderName,
				latitude: this.state.location.coords.latitude,
				longitude: this.state.location.coords.longitude,
		        phone: filter[0].senderPhone,
		        address: filter[0].senderAddr,
		        city: filter[0].senderCity,
		        subdistrict: filter[0].senderSubDist,
		        zipcode: filter[0].senderPosCode,
		        country: "Indonesia"
			},
			item: payloadItem
		} 

		this.props.addPickup(allPayload, unFilterState)
			.then(() => {
				const { pickupNumber } = this.props;
				apiWs.qob.updateStatus(keys, pickupNumber, this.state.location.coords)
					.then(res => {
						alert(`Pickup sukses dengan nomor pickup : ${pickupNumber} `);
						if (unFilterState.length === 0) {
							this.setState({ loading: false, errors: {global: 'Data tidak ditemukan'} });
						}else{
							this.setState({ loading: false });
						}
					})
					.catch(err => {
						console.log(err.response);
						if (err.response.errors) {
							this.setState({ loading: false });
							alert(err.response.errors.global);
						}else{
							alert("Terdapat kesalahan");
							this.setState({ loading: false });
						}
					})
			})		
			.catch(err => {
				this.setState({ loading: false });
				if (err.text) {
					alert(`${err.text}. Silahkan datang ke kantor/agen pos terdekat`);
					// alert(err.text);
				}else{
					alert("Whoooooppps!! terdapat kesalahan");	
				}
			})
	}

	onShowDetail = (extid) => {
		this.setState({
			open: {
				...this.state.open,
				[extid]: !this.state.open[extid]
			}
		})
	}

	render(){
		const { listPickup } = this.props;
		const { errors, showModal, loading, openDetail, location, isLoading } = this.state;
		
		return(
			<View style={{flex: 1}}>
				{ showModal && 
					<ViewModalDialog 
						handleClose={() => this.setState({ showModal: false })} 
						total={Object.keys(this.state.checked).length}
						submitPikcup={this.onSubmit}
					/> }
				<Loader loading={loading} />
				<MyStatusBar/>
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Request Pickup'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    // subtitleStyle={{color: '#FFF'}}
				/>
				<React.Fragment>
					<ScrollView style={{flex: 1}}>
						{ errors.global ? <EmptyOrErrorMessage message={errors.global} /> :  
							<React.Fragment>
								{ listPickup.length > 0 ? 
									<RenderListData 
										list={listPickup} 
										onCheckedChange={(id) => this.onCheckedChange(id)}
										checked={this.state.checked}
										showDetail={this.onShowDetail}
										detail={this.state.open}
									/> : <Loading /> }
								<React.Fragment>
									{ isLoading ? 
										<Button status='warning' disabled style={{ margin: 7 }}>Getting your location...</Button> : 
										<React.Fragment>
											{ !!location.coords ? 
											<Button status='warning' style={{ margin: 7 }} onPress={this.onPickup}>Pickup</Button> :
											<Button 
												status='warning' 
												style={{ margin: 7 }} 
												onPress={this.getCurLocation}
											>Aktifkan Lokasi</Button> }
										</React.Fragment> }
								</React.Fragment>
							</React.Fragment> }
					</ScrollView>
				</React.Fragment>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin,
		listPickup: state.order.listPickup,
		pickupNumber: state.order.pickupNumber
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent', 
		flex: 1
	},
	titleDetail: {
		fontSize: 14,
		fontFamily: 'open-sans-reg',
		color: '#4a4949'
	},
	subtitleDetail: {
		fontSize: 13,
		fontFamily: 'open-sans-reg',
		color: '#a19f9f'
	},
	listDetail: {
		paddingBottom: 5
	}
})

export default connect(mapStateToProps, { getAddPosting, addPickup })(RequestPickupScreen);