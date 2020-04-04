import React from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert, Animated } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, ListItem, CheckBox, Button } from '@ui-kitten/components';
import { omit } from 'lodash';
import * as Location from 'expo-location';
import Loader from "../../Loader";

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

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

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

//loop component
const DetailComponent = ({ x }) => {
	const [bounceValue] = React.useState(new Animated.Value(100));
	var toValue 	= 100;
	var isHidden 	= true;
	if (isHidden) {
		toValue = 0
	}
	
	React.useEffect(() => {
	    Animated.spring(
	      bounceValue,
	      {
	        toValue: toValue,
	        velocity: 3,
	        tension: 2,
	        friction: 8,
	      }
	    ).start();
	}, []);

	return(
		<Animated.View style={{ transform: [{translateY: bounceValue}] }}>
			<View style={{marginLeft: 15, paddingBottom: 5}}>
				<View>
	    			<Text style={styles.detailTitle}>Isi Kiriman</Text>
	    			<Text style={styles.subTitleText}>{capitalize(x.isi_kiriman)}</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Nama Pengirim</Text>
	    			<Text style={styles.subTitleText}>{capitalize(x.nm_pengirim)}</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Nama Penerima</Text>
	    			<Text style={styles.subTitleText}>{capitalize(x.nm_penerima)}</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Alamat Pengirim</Text>
	    			<Text style={styles.subTitleText}>{capitalize(x.alamat_asal)}</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Alamat Penerima</Text>
	    			<Text style={styles.subTitleText}>{capitalize(x.alamat_tujuan)}</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Berat</Text>
	    			<Text style={styles.subTitleText}>{x.berat} gram</Text>
	    		</View>
	    		<View>
	    			<Text style={styles.detailTitle}>Diametrik</Text>
	    			<Text style={styles.subTitleText}>P = {x.dimensi_p}, L = {x.dimensi_l}, T = {x.dimensi_t} </Text>
	    		</View>
			</View>
		</Animated.View>
	);
}

const PickupView = ({ data, visible, showDetail, checked, onCheckedChange, onPickup, location }) => {
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

	// console.log(loc);


	const addLoc = (layout, id_order) => setLoc({...loc, [id_order]: layout })
	return(
		<ScrollView ref={scrollRef}>
			{ data.map((x, i) => 
				<React.Fragment key={i}>
					<ListItem 
						title={x.id_order} 
						// description={x.orderDate.substring(0, 10)}
						titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
						onPress={() => onPressItem(x.id_order)}
						description={x.insert_date}
						accessory={(e) => renderItemAccessory(e, x.id_order, checked, onCheckedChange )}
					/> 
					<View
						onLayout={event => {
					        const layout = event.nativeEvent.layout;
					        addLoc(layout.y, x.id_order);
					}}>
						{ visible[x.id_order] &&  <DetailComponent x={x} /> }
					</View>
					<View style={{borderBottomWidth: 0.5, borderBottomColor: '#cbccc4'}}/>
				</React.Fragment>
			)}
			<Button style={{margin: 10}} onPress={onPickup}>
				{ location ? 'AKTIFKAN LOKASI' : 'PICKUP' }
			</Button>
		</ScrollView>
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
		loading: false
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onPressTab2 = () => this.setState({
		tab1: { color: 'black' },
		tab2: { color: 'blue'},
		activePage: 2,
		visible: {}
	})

	onPressTab1 = () => this.setState({
		tab1: { color: 'blue' },
		tab2: { color: 'black'},
		activePage: 1
	})

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
				const firstData = this.props.pickup.find(x => x.id_order === firstArr);
				const nextData 	= this.props.pickup.find(x => x.id_order === id);
				const alamat1 	= this.removeSpace(firstData.alamat_asal);
				const alamat2 	= this.removeSpace(nextData.alamat_asal);
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
					const filterState 	= this.props.pickup.filter(x => keys.includes(x.id_order));
					const unFilterState = this.props.pickup.filter(x => !keys.includes(x.id_order));

					var payloadItem = [];
					filterState.forEach(x => {
						payloadItem.push({
							extid: x.id_order,
							itemtypeid: 1,
				            productid: 'ID BUKAN NAMA',
				            valuegoods: 'KOSONG',
				            uomload: 5,
				            weight: x.berat,
				            uomvolumetric: 2,
				            length: x.dimensi_p,
				            width: x.dimensi_l,
				            height: x.dimensi_t,
				            codvalue: x.status_cod === 'BUKAN' ? '0' : '1',
				            fee: x.total_harga,
				            feetax: 'KOSONG',
				            insurance: 'KOSONG',
				            insurancetax: 'KOSONG',
				            discount: 0,
				            desctrans: x.isi_kiriman,
				            receiverzipcode: 'DI PISAH DARI ALAMAT'
						});
					});

					console.log(payloadItem);
				}else{
					Alert.alert(
					  'Notifikasi',
					  'Kami belum mendapatkan lokasi anda saat ini. Harap aktifkan terlebih dahulu GPS anda',
					  [
					  	{ text: 'Batal', style: 'cancel'},
					  	{ text: 'Aktifkan Lokasi', onPress: () => this._getLocationAsync()}
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

	render(){
		const { tab1, tab2, activePage } = this.state;
		
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Hasil Pencarian'
				    subtitle={this.props.navigation.state.params.dateranges}
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
				{ activePage === 1 ? <PickupView 
						data={this.props.pickup} 
						visible={this.state.visible}
						showDetail={this.onShowDetail}
						checked={this.state.checked}
						onCheckedChange={this.onChecked}
						onPickup={this.onPickup}
						location={this.state.rejectLocation}
					/> : <Text>Oke</Text> }
			</View>
		);
	}
}

function mapStateToProps(state, props) {
	const { dateranges } = props.navigation.state.params;
	return{
		pickup: state.order.detailOrder.pickup[dateranges],
		other: state.order.detailOrder.other[dateranges]
	}
}

export default connect(mapStateToProps, null)(DetailOrder);