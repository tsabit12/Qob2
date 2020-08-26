import React from "react";
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, ScrollView, ToastAndroid } from "react-native";
import { ListItem, CheckBox, Icon } from '@ui-kitten/components';
import { omit } from 'lodash';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import ModalContent from "./ModalContent";
import ModalContentHistory from "./ModalContentHistory";
import * as Location from 'expo-location';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

shortToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
}

const convertDate = (date) => {
	var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day 	= '0' + day;
    
    return [year, month, day].join('/');
}

const removeSpace = (text) => {
	return text.replace(/\s+/g, '').toLowerCase();
}

const styles = StyleSheet.create({
	rootEmpty: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textEmpty: {
		textAlign: 'center',
		color: "#B5B5B4"
	},
	detailTitle: {
		fontSize: 12,
		fontFamily: 'open-sans-reg',
	},
	iconClose: {
		position: 'absolute',
		right: 0,
		margin: 6,
		width: deviceWidth / 10,
		justifyContent: 'center',
		alignItems: 'center',
		height: deviceHeight / 19,
		zIndex: 1
	},
	btnPickup: {
		position: 'absolute',
		bottom: 15,
		right: 15,
		backgroundColor: 'rgb(240, 132, 0)',
		width: deviceWidth / 6.6,
		height: deviceWidth / 6.6,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: deviceWidth / 6.6 / 2,
		elevation: 5
	},
	textBtnPickup: {
		textAlign: 'center', 
		color: "white", 
		fontSize: 13
	},
	textMenu: {
		paddingLeft: 10, 
		paddingBottom: 6, 
		paddingTop: 6
	}
})

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const RenderEmpty = ({ status }) => (
	<View style={styles.rootEmpty}>
		<Text style={styles.textEmpty}>Data order dengan status ({status}) kosong</Text>
	</View>
);

const ResultOrder = props => {
	const [state, setState] = React.useState({
		checked: {},
		visible: {},
		location: {}
	});

	const { data, filterByStatus, historyStatus } = props;

	//handle reset checked
	React.useEffect(() => {
		if (data.length > 0) {
			setState(prevState => ({
				...prevState,
				checked: {}
			}))
		}
	}, [data])

	const list = [];
	if (filterByStatus.value === 0) {
		list.push(...data);
	}else{
		const filter = data.filter(x => x.laststatusid === filterByStatus.value);
		list.push(...filter);
	}


	const renderItemIcon = (index) => (
		<Text>{index+1}</Text>
	);

	const onCheckedChange = (id) => {
		const checkedId = state.checked[id] ? state.checked[id] : false;
		if (checkedId) {
			setState(prevState => ({
				...prevState,
				checked: omit(state.checked, id)
			}))
		}else{
			const firstArr = Object.keys(state.checked)[0];
			if (firstArr) {
				const firstDataChecked 	= data.find(x => x.extid === firstArr);
				const nextDataChecked 	= data.find(x => x.extid === id);
				const alamat1 	= removeSpace(firstDataChecked.shipperfulladdress);
				const alamat2 	= removeSpace(nextDataChecked.shipperfulladdress);
				if (alamat1 !== alamat2) {
					Alert.alert(
					  'Alamat pengirim tidak sama!',
					  'Dalam satu kali pickup hanya bisa dilakukan jika alamat pengirim sama. Harap pastikan kembali bahwa kodepos dan alamat pengirim sudah sama',
					  [
					    {text: 'Tutup', onPress: () => console.log('OK Pressed')},
					  ],
					  {cancelable: false},
					);
				}else{
					setState(prevState => ({
						...prevState,
						checked: {
							...prevState.checked,
							[id]: true
						}
					}))
				}
			}else{
				setState(prevState => ({
					...prevState,
					checked: {
						...prevState.checked,
						[id]: true
					}
				}))
			}
		}
	}

	const openDetail = (id) => {
		const newState = data.find(x => x.extid === id);
		setState(prevState => ({
			...prevState,
			visible: newState
		}))
	}

	const cekStatus = (id, pickupNumber) => props.getHistoryStatus(id, pickupNumber);

	const handelTracking = (pickupNumber) => {
		const findByPickupnumber = data.filter(x => x.pickupnumber === pickupNumber);
		const payload = {
			pickupNumber: pickupNumber,
			detail: {
				productname: findByPickupnumber[0].productname,
				desctrans: findByPickupnumber[0].desctrans,
				extid: findByPickupnumber[0].extid,
				receiverfulladdress: findByPickupnumber[0].receiverfulladdress,
				shipperfulladdress: findByPickupnumber[0].shipperfulladdress,
				receivername: findByPickupnumber[0].receivername,
				shippername: findByPickupnumber[0].shippername
			}
		};
		props.goMaps(payload);
	}

	const renderAccessory = (style, id, laststatus, pickupNumber) => (
		<React.Fragment>
			{ pickupNumber === null ? <React.Fragment>
				<CheckBox
			      checked={state.checked[id]}
			      onChange={() => onCheckedChange(id)}			      
			    />
			    <Menu>
					<MenuTrigger>
						<Ionicons name="md-more" size={24} color="black" style={{marginRight: 10, marginLeft: 20}} />
					</MenuTrigger>
					<MenuOptions>
						<MenuOption onSelect={() => openDetail(id)}>
				        	<View style={styles.textMenu}>
				          		<Text>Lihat Detail</Text>
				          	</View>
						</MenuOption>
						<MenuOption onSelect={() => cekStatus(id, pickupNumber)}>
				        	<View style={styles.textMenu}>
				          		<Text>Cek Riwayat Status</Text>
				          	</View>
				        </MenuOption>
				        <MenuOption onSelect={() => props.goLacak(id)}>
				        	<View style={styles.textMenu}>
				          		<Text>Lacak Kiriman</Text>
				          	</View>
				        </MenuOption>
				        <MenuOption onSelect={() => handelTracking('1583580146_440001352')}>
				        	<View style={styles.textMenu}>
				          		<Text>Tracking Pickup</Text>
				          	</View>
				        </MenuOption>
					</MenuOptions>
				</Menu> 
		    </React.Fragment> : <React.Fragment> 
		    		<Menu>
						<MenuTrigger>
							<Ionicons name="md-more" size={24} color="black" style={{marginRight: 10}} />
						</MenuTrigger>
						<MenuOptions>
							<MenuOption onSelect={() => openDetail(id)}>
					        	<View style={styles.textMenu}>
					          		<Text>Lihat Detail</Text>
					          	</View>
							</MenuOption>
							<MenuOption onSelect={() => cekStatus(id, pickupNumber)}>
					        	<View style={styles.textMenu}>
					          		<Text>Cek Riwayat Status</Text>
					          	</View>
					        </MenuOption>
					        <MenuOption onSelect={() => handelTracking(pickupNumber)}>
					        	<View style={styles.textMenu}>
					          		<Text>Tracking Pickup</Text>
					          	</View>
					        </MenuOption>
					        <MenuOption onSelect={() => props.goLacak(id)}>
				        	<View style={styles.textMenu}>
				          		<Text>Lacak Kiriman</Text>
				          	</View>
				        </MenuOption>
						</MenuOptions>
					</Menu> 
			</React.Fragment> }
	    </React.Fragment>
	);

	const handlePickup = async () => {
		//get current location
		let { status } = await Location.requestPermissionsAsync();
		if (status !== 'granted') {
			shortToast("Tidak dapat mengambil lokasi anda");
		}else{
			await Location.getCurrentPositionAsync({})
				.then(res => {
					// console.log(res);
					const { latitude, longitude } = res.coords;
					//CONVERT OBJECT KEYS TO ARRAY
					var keys = [];
					const { checked } 		= state;
					for (var k in checked) keys.push(k);
					const filterData 	= data.filter(x => keys.includes(x.extid));	
					const payloadItem 	= [];
					const payloadExtid 	= [];
					filterData.forEach(x => {
						payloadItem.push({
							extid: x.extid,
							itemtypeid: 1,
				            productid: x.productid,
				            valuegoods: x.valuegoods,
				            uomload: 5,
				            weight: x.weight,
				            uomvolumetric: 2,
				            length: x.length,
				            width: x.width,
				            height: x.height,
				            codvalue: x.codvalue,
				            fee: x.fee,
				            feetax: x.feetax,
				            insurance: x.insurance,
				            insurancetax: x.insurancetax,
				            discount: 0,
				            desctrans: x.desctrans,
				            receiverzipcode: x.receiverzipcode
						});

						payloadExtid.push({
							extid: x.extid 
						});
					});
					const allPayload = {
						shipper: {
							userId: props.user.userid,
							name: filterData[0].shippername,
							latitude: latitude,
							longitude: longitude,
					        phone: filterData[0].shipperphone,
					        address: filterData[0].shipperaddress,
					        city: filterData[0].shippersubdistrict,
					        subdistrict: filterData[0].shippersubsubdistrict,
					        zipcode: filterData[0].shipperzipcode,
					        country: "Indonesia"
						},
						item: payloadItem,
						status: {
							extid: payloadExtid,
							shipperLatlong: `${latitude}|${longitude}`
						}
					};
					props.onPickup(allPayload);
				})
				.catch(err => {
					console.log(err);
					shortToast("Lokasi anda belum kami dapatkan, silahkan klik pickup kembali");
				})
		}
		// var keys = [];
		// const { checked } 		= state;
		// for (var k in checked) keys.push(k);
		
		// const filterData 	= data.filter(x => keys.includes(x.extid));	
		
	}

	return(
		<React.Fragment>
			{ list.length === 0 ? <RenderEmpty status={filterByStatus.text} /> : <View>
				{list.map((row, index) => <React.Fragment key={index}>
					<ListItem 
						title={row.extid} 
						disabled
						titleStyle={{color: row.va === null ? '#3366ff' : 'red', fontFamily: 'open-sans-reg'}}
						description={`${row.insertdate.substring(0, 10)} - ${row.desctrans} ${row.va !== null ? '(COD)' : '' } - ${row.laststatus}`}
						accessory={(e) => renderAccessory(e, row.extid, row.laststatusid, row.pickupnumber)}
						descriptionStyle={{fontFamily: 'open-sans-reg', fontSize: 10}}
						icon={() => renderItemIcon(index)}
					/> 
			    	<View style={{borderBottomWidth: 0.5, borderBottomColor: '#cbccc4'}}/>
				</React.Fragment>)}
			</View> }

		{/*MODAL DETAIL*/}
		<Modal isVisible={Object.keys(state.visible).length > 0 ? true : false }>
		    <View style={{ backgroundColor: '#FFF', minHeight: deviceHeight / 2, borderRadius: 10 }}>
		    	<TouchableOpacity 
		    		style={styles.iconClose} 
		    		onPress={() => setState(prevState => ({ 
		    			...prevState, 
		    			visible: {}
		    		}))}
		    	>
		    		<Icon name='close' width={25} height={25} />
		    	</TouchableOpacity>
		    	<ScrollView>
		      		<ModalContent data={state.visible} />
		      	</ScrollView>
		    </View>
		</Modal>

		{/*MODAL HISTORY*/}
		<Modal isVisible={historyStatus.length > 0 ? true : false }>
			<View style={{ backgroundColor: '#FFF', borderRadius: 10 }}>
				<TouchableOpacity 
					style={styles.iconClose} 
					onPress={props.closeModalHistory}
				>
		    		<Icon name='close' width={25} height={25} />
		    	</TouchableOpacity>
				<ScrollView>
					{ historyStatus.length > 0 && <ModalContentHistory 
						data={historyStatus} 
						allOrder={data}
					/> }
		    	</ScrollView>
			</View>
		</Modal>

		{ Object.keys(state.checked).length > 0 && 
			<TouchableOpacity 
				style={styles.btnPickup}
				onPress={handlePickup}
			>
				<Text style={styles.textBtnPickup}>Pickup</Text>
			</TouchableOpacity> }
		</React.Fragment>
	);
}

export default ResultOrder;