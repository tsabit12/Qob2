import React from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import apiWs from "../../apiWs";
import { Spinner, Icon } from '@ui-kitten/components';
import MapView from 'react-native-maps';
import axios from "axios";
import { Polyline, Marker } from "react-native-maps";
import { Backdrop } from "react-native-backdrop";

const LoadingView = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Spinner size='medium' />
		<Text>Memuat...</Text>
	</View>
);

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const EmptyMessage = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Text>Lokasi Faster tidak ditemukan. Harap cobalagi nanti</Text>
	</View>
);

const RenderButtonView = ({ onPress }) => (
	<View style={{position: 'absolute', bottom: 0, width: '100%', left: 0, right: 0, alignItems: 'center'}}>
		<TouchableOpacity
			style={{
				width: '100%',
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
				elevation: 5, 
				alignItems: 'center',
				justifyContent: 'center', 
				backgroundColor: '#FFF',
			}}
			onPress={() => onPress()}
		>
			<View style={{height: 6, backgroundColor: '#a4a5a6', width: 41, margin: 10, borderRadius: 3 }} />
		</TouchableOpacity>
	</View>	
);

const RenderDetail = ({ list }) => {
	return(
		<React.Fragment>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Isi Kiriman</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.desctrans)}</Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Pengirim</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.shippername)}</Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Penerima</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.receivername)}</Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Alamat Pengirim</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.shipperfulladdress)}</Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Alamat Penerima</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.receiverfulladdress)}</Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Nama Produk</Text>
				<Text style={{color: '#9fa19f'}}>{capitalize(list.productname)}</Text>
			</View>
		</React.Fragment>
	);
}


class MapScreen extends React.Component{
	state = {
		pickupLocation: {
			latitude: null,
			longitude: null
		},
		fasterLocation: {
			latitude: null,
			longitude: null
		},
		routeForMap: [],
		success: false,
		visible: false,
		responseDetail: []
	}

	UNSAFE_componentWillMount(){
		StatusBar.setHidden(true);
	}

	componentDidMount(){
		this.setState({ success: true });
	}

	componentDidUpdate(prevProps, prevState){	
		//need condition 
		//to break this infinite loop
		if (this.state.success) {
			this.getDirection(this.props.navigation.state.params.pickupNumber);
		}
	}


	componentWillUnmount(){
		StatusBar.setHidden(false);
	}

	getDirection = (pickupNumber) => {
		apiWs.fetch.getMaps(pickupNumber)
		.then(res => {
			const { faster_latlong, shipper_latlong } = res;
			const valuesFaster = faster_latlong.split('|');
			const valuesShipper = shipper_latlong.split('|');
			if (valuesFaster[0] !== '0.0') {
				const newState = {
					pickupLocation: {
						latitude: parseFloat(valuesShipper[0]),
						longitude: parseFloat(valuesShipper[1]),
					},
					fasterLocation: {
						latitude: parseFloat(valuesFaster[0]),
						longitude: parseFloat(valuesFaster[1])
					}
				}
				this.getRoute(newState);
			}else{
				this.setState({ success: false });
			}
		})
		.catch(err => {
			this.setState({ success: false });
			StatusBar.setHidden(false);
		})
	}

	getRoute = (newState) => {
		const { pickupLocation, fasterLocation } = newState;
		axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!${fasterLocation.latitude},${fasterLocation.longitude}&waypoint1=geo!${pickupLocation.latitude},${pickupLocation.longitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
        .then(res => {
        	let routeCoordinates = [];
	          res.data.response.route[0].leg[0].shape.map(m => {
	            let latlong = m.split(',');
	            let latitude = parseFloat(latlong[0]);
	            let longitude = parseFloat(latlong[1]);
	            routeCoordinates.push({latitude: latitude, longitude: longitude});
	        });
	        this.setState({ 
	        	pickupLocation: newState.pickupLocation,
	        	fasterLocation: newState.fasterLocation,
	        	routeForMap: routeCoordinates
	        })
	    })
	    .catch(err => {
	    	this.setState({ success: false })
	    })
	}

	getDetail = () => {
		// const { pickupNumber } = this.props.navigation.state.params;
		this.setState({ visible: true });
		// if (this.state.responseDetail.length === 0) {
		// 	apiWs.fetch.getDetailPickup(pickupNumber)
		// 		.then(res => {
		// 			this.setState({ responseDetail: res });
		// 		}).catch(err => console.log(err.response));
		// }
	}

	render(){
		const { pickupLocation, fasterLocation, routeForMap, visible, responseDetail, success } = this.state;
		const { params } = this.props.navigation.state;
		return(
			<React.Fragment>
				{ success ? <React.Fragment>
					<View style={{flex: 1}}>
					{ fasterLocation.latitude !== null ?  
					<MapView 
						initialRegion={{
							latitude: pickupLocation.latitude,
				          	longitude: pickupLocation.longitude,
							latitudeDelta: 0.0922,
						  	longitudeDelta: 0.0421
						}} 
						style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
						showsUserLocation={true}
						minZoomLevel={12}
						zoomControlEnabled
					>
						{ routeForMap.length > 0 &&  <Polyline coordinates={routeForMap} strokeWidth={3} strokeColor="#f26522" geodesic={true}/> }
						<Marker 
						  	coordinate={{latitude: fasterLocation.latitude, longitude: fasterLocation.longitude}} 
						  	title="Faster Location"
						  	image={require('../../../assets/driver.png')}
						  	resizeMode="contain"
						/>
						<Marker coordinate={{latitude: pickupLocation.latitude, longitude: pickupLocation.longitude}} title="My Location"
						  	image={require('../../../assets/box.png')}
						  	resizeMode="contain"
						/>
					</MapView> : <LoadingView /> }
				</View>
					{ !visible && <RenderButtonView onPress={this.getDetail} /> } 
					<Backdrop
				        visible={visible}
				        handleOpen={() => this.setState({ visible: true })}
				        handleClose={() => this.setState({ visible: false })}
				        onClose={() => {}}
				        swipeConfig={{
				          velocityThreshold: 0.3,
				          directionalOffsetThreshold: 80,
				        }}
				        closedHeight={55}
				        animationConfig={{
				          speed: 14,
				          bounciness: 4,
				        }}
				        overlayColor="rgba(0,0,0,0.32)"
				        backdropStyle={{
				          backgroundColor: '#fff'
				        }}>
				          	<RenderDetail list={params.detail} />
				    </Backdrop>
			    </React.Fragment> : <EmptyMessage /> }
			</React.Fragment>
		);
	}
}

export default MapScreen;