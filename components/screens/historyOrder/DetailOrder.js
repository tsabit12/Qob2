import React from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, ListItem, CheckBox, Button } from '@ui-kitten/components';
import { omit } from 'lodash';
import * as Location from 'expo-location';
import Loader from "../../Loader";
import { addPickupBaru } from "../../../actions/order";
import DataOrder from "./DataOrder";
import apiBaru from "../../apiBaru";

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const renderItemAccessory = (style, id, checked, onCheckedChange) => {
	return(
		<CheckBox
	      checked={checked[id]}
	      onChange={() => onCheckedChange(id)}
	    />
	)
} 


const PickupView = ({ data, visible, showDetail, checked, onCheckedChange, onPickup, location }) => {
	// console.log(data);
	const scrollRef = React.useRef();
	const [loc, setLoc] = React.useState({});

	const onPressItem = (x) => {
		showDetail(x);
		setTimeout(() => {
			scrollRef.current.scrollTo({
		        x: 0,
		        y: loc[x] - 300
		    });
		}, 100)
	} 

	const onLayout = (layout, id_order) => {
		updateWidth(layout, id_order);
	}

	const updateWidth = (layout, id) => {		
			setLoc({...loc, [id]: layout });
	}

	return(
		<React.Fragment>
			{ data.length > 0 ? 
				<ScrollView ref={scrollRef}>
				{ data.map((x, i) => 
					<React.Fragment key={i}>
						<ListItem 
							title={x.extid} 
							// description={x.orderDate.substring(0, 10)}
							titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
							onPress={() => onPressItem(x.extid)}
							description={x.desctrans}
							accessory={(e) => renderItemAccessory(e, x.extid, checked, onCheckedChange )}
							descriptionStyle={{fontFamily: 'open-sans-reg', fontSize: 10}}
						/> 
						<View
							onLayout={event => {
						        const layout = event.nativeEvent.layout;
						        onLayout(layout.y, x.extid);
						}}>
							{ visible[x.extid] &&  <View style={{marginLeft: 15, paddingBottom: 5}}>
					    		<View>
					    			<Text style={styles.detailTitle}>Nama Pengirim</Text>
					    			<Text style={styles.subTitleText}>{capitalize(x.shippername)}</Text>
					    		</View>
					    		<View>
					    			<Text style={styles.detailTitle}>Nama Penerima</Text>
					    			<Text style={styles.subTitleText}>{capitalize(x.receivername)}</Text>
					    		</View>
					    		<View>
					    			<Text style={styles.detailTitle}>Alamat Pengirim</Text>
					    			<Text style={styles.subTitleText}>{capitalize(x.shipperfulladdress)}</Text>
					    		</View>
					    		<View>
					    			<Text style={styles.detailTitle}>Alamat Penerima</Text>
					    			<Text style={styles.subTitleText}>{capitalize(x.receiverfulladdress)}</Text>
					    		</View>
					    		<View>
					    			<Text style={styles.detailTitle}>Berat</Text>
					    			<Text style={styles.subTitleText}>{x.weight} gram</Text>
					    		</View>
					    		<View>
					    			<Text style={styles.detailTitle}>Diametrik</Text>
					    			<Text style={styles.subTitleText}>P = {x.length}, L = {x.width}, T = {x.height} </Text>
					    		</View>
							</View> }
						</View>
						<View style={{borderBottomWidth: 0.5, borderBottomColor: '#cbccc4'}}/>
					</React.Fragment>
				)}
				<Button style={{margin: 10}} onPress={onPickup}>
					{ location ? 'GET LOCATION' : 'PICKUP' }
				</Button>
			</ScrollView> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text style={{fontSize: 16, color: '#cbccc4'}}>Data tidak ditemukan</Text>
			</View>}
		</React.Fragment>
	);
} 

class DetailOrder extends React.Component{
	state = {
		tab1: { color: 'blue' },
		tab2: { color: 'black'},
		activePage: 1,
		visible: {},
		checked: {},
		location: {},
		rejectLocation: false,
		loading: false,
		history: [],
		bounce: new Animated.Value(-50),
		fadeAnim: new Animated.Value(0)
	}

	async componentDidMount(){
		this.runAnimated();
		this._getLocationAsync();
		console.log(this.props.pickup);
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.push('RiwayatPickup') }/>
	)

	runAnimated = (jenis) => {
		Animated.spring(
			this.state.bounce, 
			{
				toValue: 0,
				velocity: 3,
		        tension: 2,
		        friction: 8,
			}
		).start();

		Animated.timing(
	      this.state.fadeAnim,
	      {
	        toValue: 1,
	        duration: 800
	      }
	    ).start();
	}

	onPressTab2 = () => {
		this.state.fadeAnim.setValue(0);
		this.state.bounce.setValue(-50);
		this.runAnimated();
		this.setState({
			tab1: { color: 'black' },
			tab2: { color: 'blue'},
			activePage: 2,
			visible: {}
		});
	}

	onPressTab1 = () => {
		this.runAnimated();
		this.setState({
			tab1: { color: 'blue' },
			tab2: { color: 'black'},
			activePage: 1
		})
	}

	onShowDetail = (externalId) => {
		this.setState({
			visible: {
				...this.state.visible,
				[externalId]: !this.state.visible[externalId]
			}
		})
	}

	removeSpace = (text) => {
		return text.replace(/\s+/g, '').toLowerCase();
	}

	onChecked = (id) => {
		const checkedId = this.state.checked[id] ? this.state.checked[id] : false;
		if (checkedId) {
			this.setState({
				checked: omit(this.state.checked, id)
			})
		}else{
			const firstArr = Object.keys(this.state.checked)[0];
			if (firstArr) {
				const firstData = this.props.pickup.find(x => x.extid === firstArr);
				const nextData 	= this.props.pickup.find(x => x.extid === id);
				const alamat1 	= this.removeSpace(firstData.shipperfulladdress);
				const alamat2 	= this.removeSpace(nextData.shipperfulladdress);
				if (alamat1 !== alamat2) {
					Alert.alert(
					  'Alamat pengirim tidak sama!',
					  'Dalam satu kali pickup hanya bisa dilakukan jika alamat pengirim sama. Harap pastikan kembali bahwa kodepos dan alamat pengirim sudah sama',
					  [
					    {text: 'Tutup', onPress: () => console.log('OK Pressed')},
					  ],
					  {cancelable: false},
					);
				}else{ //same sender addres
					this.setState({
						checked: {
							...this.state.checked,
							[id]: true
						}
					})
				}
			}else{ //when first checked
				this.setState({
					checked: {
						...this.state.checked,
						[id]: true
					}
				})
			}
		}
	}

	onPickup = () => {
		if (this.state.rejectLocation) {
			this._getLocationAsync();
		}else{
			const total = Object.keys(this.state.checked).length;
			if (total > 0) {
				if (Object.keys(this.state.location).length > 0) {
					this.setState({ loading: true });
					/*JOIN ALL CHECKED IN ARRAY*/
					var keys = [];
					const { checked } 		= this.state;
					for (var k in checked) keys.push(k);
					/*END*/
					const filterState 	= this.props.pickup.filter(x => keys.includes(x.extid));
					const unFilterState = this.props.pickup.filter(x => !keys.includes(x.extid));
					const { dateReal } 	= this.props.navigation.state.params;
					const { location }  = this.state; 
					var payloadItem 	= [];
					var payloadExtid 	= [];

					filterState.forEach(x => {
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
							userId: this.props.dataLogin.userid,
							name: filterState[0].shippername,
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
					        phone: filterState[0].shipperphone,
					        address: filterState[0].shipperaddress,
					        city: filterState[0].shippersubdistrict,
					        subdistrict: filterState[0].shippersubsubdistrict,
					        zipcode: filterState[0].shipperzipcode,
					        country: "Indonesia"
						},
						item: payloadItem
					} 

					this.props.addPickupBaru(allPayload, dateReal, unFilterState)
						.then(() => {
							const payloadStatus = {
								pickupNumber: this.props.pickupNumber,
								extid: payloadExtid, //array object key extid
								shipperLatlong: `${location.coords.latitude}|${location.coords.longitude}`
							};
							this.updateStatusPickup(payloadStatus);
						})
						.catch(err => {
							console.log(err);
							this.setState({ loading: false });
							if (!err.text) {
								Alert.alert(
								  'Whopps',
								  'Pickup Gagal',
								  [
								  	{
								      text: 'Tutup',
								      style: 'cancel',
								    }
								  ],
								  {cancelable: false},
								);
							}else{
								this.setState({ loading: false });
								Alert.alert(
								  'Whopps',
								  `${err.text}`,
								  [
								  	{
								      text: 'Tutup',
								      style: 'cancel',
								    }
								  ],
								  {cancelable: false},
								);
							}
						})
				}else{
					Alert.alert(
					  'Notifikasi',
					  'Kami belum mendapatkan lokasi anda saat ini. Harap pastikan bahwa GPS anda sudah aktif terlebih dahulu',
					  [
					  	{ text: 'Batal', style: 'cancel'},
					  	{ text: 'Get Lokasi', onPress: () => this._getLocationAsync()}
					  ],
					  {cancelable: false},
					);
				}
			}else{
				Alert.alert(
				  'Notifikasi',
				  'Harap centang salah satu kiriman yang akan dipickup terlebih dahulu',
				  [
				  	{
				      text: 'Tutup',
				      style: 'cancel',
				    }
				  ],
				  {cancelable: false},
				);
			}
		}
	}

	_getLocationAsync = async () => {
	    await Location.getCurrentPositionAsync({})
	    .then(res => {
	    	this.setState({ rejectLocation: false, location: res });
	    })
	    .catch(() => this.setState({ rejectLocation: true }));
	}

	updateStatusPickup = (payload) => {
		apiBaru.qob.updateStatus(payload)
			.then(res => {
				this.setState({ loading: false, checked: {} });

				setTimeout(() => {
					Alert.alert(
					  'Notifikasi',
					  `${res.length} item berhasil dipickup dengan nomor pickup : ${this.props.pickupNumber}`,
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    }
					  ],
					  {cancelable: false},
					);
				}, 30);
			})
			.catch(err => {
				this.setState({ loading: false, checked: {} });

				setTimeout(() => {
					Alert.alert(
					  'Notifikasi',
					  `Gagal insert pickup`,
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    }
					  ],
					  {cancelable: false},
					);
				}, 30);
			})
	}	

	getHistoryStatus = (payload) => {
		this.setState({ loading: true, history: [] });
		apiBaru.qob.getHistoryStatus(payload)
			.then(res => {
				//sorting
				const datanya = res.data.sort(this.dynamicSort("-insertdate"));
				
				this.setState({ loading: false, history: datanya });
			})
			.catch(err => {
				this.setState({ loading: false });
				setTimeout(() => {
					Alert.alert(
					  'Terdapat kesalahan',
					  `Harap cobalagi nanti`,
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    }
					  ],
					  {cancelable: false},
					);
				}, 30)
			})
	}

	dynamicSort = (property) => {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }

	    return function (a,b) {
	        /* next line works with strings and numbers, 
	         * and you may want to customize it to your needs
	         */
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	onMoveMap = (payload) => {
		this.props.navigation.navigate({
			routeName: 'Maps',
			params: {
				pickupNumber: payload.pickupNumber,
				detail: {
					productname: payload.productname,
					desctrans: payload.desctrans,
					extid: payload.extid,
					receiverfulladdress: payload.receiverfulladdress,
					shipperfulladdress: payload.shipperfulladdress,
					receivername: payload.receivername,
					shippername: payload.shippername
				}
			}
		})
	}

	render(){
		const { tab1, tab2, activePage, bounce } = this.state;
		
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Hasil Pencarian'
				    subtitle={this.props.navigation.state.params.dateReal}
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<Loader loading={this.state.loading} />
				<View style={styles.tab}>
					<View style={styles.tabLeft}>
						<TouchableOpacity style={{alignItems: 'center'}} onPress={this.onPressTab1}>
							<Icon name='shopping-cart-outline' width={28} height={28} fill={tab1.color} />
							<Text style={{color: tab1.color}}>Request Pickup</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.tabRight}>
						<TouchableOpacity style={{alignItems: 'center'}} onPress={this.onPressTab2}>
							<Icon name='bookmark-outline' width={28} height={28} fill={tab2.color} />
							<Text style={{color: tab2.color}}>Data Order</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{marginBottom: 70, flex: 1}}>
					<Animated.View
						style={{
							transform: [{translateX: bounce}],
							opacity: this.state.fadeAnim,
							flex: 1
						}}
					>
						{ activePage === 1 ? <PickupView 
									data={this.props.pickup} 
									visible={this.state.visible}
									showDetail={this.onShowDetail}
									checked={this.state.checked}
									onCheckedChange={this.onChecked}
									onPickup={this.onPickup}
									location={this.state.rejectLocation}/> 
							 : <DataOrder 
							 	data={this.props.other} 
							 	email={this.props.dataLogin.detail.email} 
							 	getStatus={this.getHistoryStatus}
							 	history={this.state.history}
							 	removeHistory={() => this.setState({ history: [] })}
							 	movToMapView={this.onMoveMap}
							 />  }
					
					</Animated.View>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state, props) {
	const { dateReal } = props.navigation.state.params;
	return{
		pickup: state.order.detailOrder.pickup[dateReal],
		other: state.order.detailOrder.other[dateReal],
		dataLogin: state.auth.dataLogin,
		pickupNumber: state.order.pickupNumber
	}
}

export default connect(mapStateToProps, { addPickupBaru })(DetailOrder);