import React from "react";
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Constants from 'expo-constants';
import apiWs from "../apiWs";
import { connect } from "react-redux";
import { getAddPosting, addPickup } from "../../actions/pickup";
import { Icon, TopNavigation, TopNavigationAction, Spinner, ListItem, Button, CheckBox } from '@ui-kitten/components';
import { omit } from 'lodash';
import Dialog from "react-native-dialog";
import Loader from "../Loader";
import { Backdrop } from "react-native-backdrop";
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

const RenderListData = ({ list, onCheckedChange, checked, showDetail }) => (
	<View>
		{ list.map((x, i) => 
			<ListItem 
				key={i} 
				title={x.externalId} 
				description={x.orderDate.substring(0, 10)}
				titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
				style={{borderBottomWidth: 0.3, borderBottomColor: '#3366ff'}}
				onPress={() => showDetail(x.externalId)}
				accessory={(e) => renderItemAccessory(e, x.externalId, onCheckedChange, checked)}
			/>
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

const DataDetail = ({ item }) => (
	<View>
		<View style={styles.listDetail}>
			<Text style={styles.titleDetail}>Isi Kiriman</Text>
			<Text style={styles.subtitleDetail}>{item.contentDesc}</Text>
		</View>
		<View style={styles.listDetail}>
			<Text style={styles.titleDetail}>Nilai Barang</Text>
			<Text style={styles.subtitleDetail}>Rp {numberWithCommas(item.itemValue)}</Text>
		</View>
		<View style={styles.listDetail}>
			<Text style={styles.titleDetail}>Berat Kiriman</Text>
			<Text style={styles.subtitleDetail}>{numberWithCommas(item.weight)} gram</Text>
		</View>
		<View style={styles.listDetailLast}>
			<Text style={styles.titleDetail}>Data Penerima</Text>
			<Text style={styles.subtitleDetail}>{item.receiverName}</Text>
			<Text style={styles.subtitleDetail}>{item.receiverAddr}, {item.receiverVill}, {item.receiverSubDist}, {item.receiverCity}, {item.receiverProv}</Text>
		</View>
	</View>
);

class RequestPickupScreen extends React.Component{
	state = {
		errors: {},
		checked: {},
		showModal: false,
		loading: false,
		openDetail: {
			status: false,
			data: {}
		},
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

	onCheckedChange = (id) => {
		const checkedId = this.state.checked[id] ? this.state.checked[id] : false;
		if (checkedId) {
			const { checked } = this.state;
			this.setState({
				checked: omit(checked, id)
			})
		}else{
			this.setState({
				checked: {
					...this.state.checked,
					[id]: true
				}
			})
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
						this.setState({ loading: false });
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
				console.log(err.response);
				alert("WHoooooppps terdapat kesalahan");	
				this.setState({ loading: false });
			})
	}

	onShowDetail = (extid) => {
		const { listPickup } = this.props;
		const findListByExtid = listPickup.find(x => x.externalId === extid);

		this.setState({ openDetail: { status: true, data: findListByExtid }})
	} 

	render(){
		const { listPickup } = this.props;
		const { errors, detail, showModal, loading, openDetail, location, isLoading } = this.state;
		console.log(this.state.location);
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
										// onPickup={this.onPickup}
										showDetail={this.onShowDetail}
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
				<Backdrop
			        visible={openDetail.status}
			        // handleOpen={handleOpen}
			        handleClose={() => this.setState({ openDetail: { status: false, data: ''}})}
			        onClose={() => this.setState({ openDetail: { status: false, data: ''}})}
			        swipeConfig={{
			          velocityThreshold: 0.3,
			          directionalOffsetThreshold: 80,
			        }}
			        animationConfig={{
			          speed: 14,
			          bounciness: 4,
			        }}
			        overlayColor="rgba(0,0,0,0.32)"
			        backdropStyle={{
			          backgroundColor: '#fff',
			          margin: 7
			        }}>
			          	{ Object.keys(openDetail.data).length > 0 ? <DataDetail item={openDetail.data} /> : <Text>Not found</Text> }
			    </Backdrop>
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
		fontSize: 16,
		fontFamily: 'open-sans-reg',
		color: '#4a4949'
	},
	subtitleDetail: {
		fontSize: 13,
		fontFamily: 'open-sans-reg',
		color: '#a19f9f'
	},
	listDetail: {
		borderBottomWidth: 0.3, 
		borderBottomColor: '#a1a1a1', 
		paddingBottom: 7,
		paddingTop: 5
	},
	listDetailLast: {
		paddingBottom: 7,
		paddingTop: 5
	}
})

export default connect(mapStateToProps, { getAddPosting, addPickup })(RequestPickupScreen);