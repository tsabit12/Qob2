import React from "react";
import { View, Text, Button, StatusBar, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { fetchHistoryPickup } from "../../../actions/pickup";
import apiWs from "../../apiWs";
import { Spinner, Icon } from '@ui-kitten/components';
import MapView from 'react-native-maps';
import axios from "axios";
import { Polyline, Marker } from "react-native-maps";
import { Backdrop } from "react-native-backdrop";

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
	const listIsiKirman = [];
	const listPenerima = [];
	const listKodepos = [];
	const listAlamat = [];
	const lastKey = list.length - 1;
	for(var key = 0; key < list.length; key++){
		const item = list[key];
		listAlamat.push(
			<Text key={key} style={{color: '#9fa19f'}}>{key+1}. {item.receiverAddr}, {item.receiverVill}, {item.receiverSubDist}, {item.receiverCity}</Text>
		);
		if (lastKey === key) { //last item
			listIsiKirman.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.contentDesc}</Text>
			);
			listPenerima.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.receiverName}</Text>
			);
			listKodepos.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.receiverPosCode}</Text>
			);
		}else{
			listIsiKirman.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.contentDesc}, </Text>
			);
			listPenerima.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.receiverName}, </Text>
			);
			listKodepos.push(
				<Text key={key} style={{color: '#9fa19f'}}>{item.receiverPosCode}, </Text>
			);
		}
	}

	return(
		<React.Fragment>
			<View style={{borderBottomWidth: 0.4, paddingBottom: 7}}>
				<Text style={{textAlign: 'center'}}>Total ({list.length} item) </Text>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Isi Kiriman</Text>
				<View style={{flexDirection: 'row'}}>
					{listIsiKirman}
				</View>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Penerima</Text>
				<View style={{flexDirection: 'row'}}>
					{listPenerima}
				</View>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Kodepos Penerima</Text>
				<View style={{flexDirection: 'row'}}>
					{listKodepos}
				</View>
			</View>
			<View>
				<Text style={{fontSize: 16, fontFamily: 'open-sans-reg'}}>Alamat Penerima</Text>
				{listAlamat}
			</View>
		</React.Fragment>
	)
}

const LoadingView = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Spinner size='medium' />
		<Text>Memuat...</Text>
	</View>
);

const RenderMaps = ({ startLocation, finishLocation, region, isLoading, routeMap }) => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
		{ isLoading ? 
			<Text>Memuat route....</Text> : 
			<MapView 
				initialRegion={region} 
				style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
				showsUserLocation={true}
				minZoomLevel={12}
				zoomControlEnabled
			>
				 <Polyline coordinates={routeMap} strokeWidth={3} strokeColor="#f26522" geodesic={true}/>
				 <Marker 
				  	coordinate={{latitude: startLocation.latitude, longitude: startLocation.longitude}} 
				  	title="Starting location"
				  	image={require('../../../assets/driver.png')}
				  	resizeMode="contain"
				  />
				  <Marker coordinate={{latitude: finishLocation.latitude, longitude: finishLocation.longitude}} title="My Coordinate"
				  	image={require('../../../assets/box.png')}
				  	resizeMode="contain"
				  />
			</MapView> }
	</View>
);

class Maps extends React.Component{
	state = {
		startLocation: {
			latitude: null,
			longitude: null
		},
		finishLocation: {
			latitude: null,
			longitude: null
		},
		region: {},
		direction: {},
		isLoading: true,
		visible: false,
		responseDetail: []
	}

	componentDidMount(){
		StatusBar.setHidden(true);
		const { pickupNumber } = this.props.navigation.state.params;
		apiWs.fetch.getMaps(pickupNumber)
		.then(res => {
			const { faster_latlong, shipper_latlong } = res;
			console.log(res);
			if (faster_latlong) {
				const startValues = faster_latlong.split("|");
				const finishValues = shipper_latlong.split("|");
				this.getRoute(startValues, finishValues);
				this.setState({
					startLocation: {
						latitude: parseFloat(startValues[0]),
						longitude: parseFloat(startValues[1])
					},
					finishLocation: {
						latitude: parseFloat(finishValues[0]),
						longitude: parseFloat(finishValues[1])
					},
					region: {
						latitude: parseFloat(finishValues[0]),
			          	longitude: parseFloat(finishValues[1]),
					  	latitudeDelta: 0.0922,
					  	longitudeDelta: 0.0421,
					}
				});
			}else{
				console.log("null");
			}
		})
		.catch(err => console.log(err));
	}

	//i dont care for now this will be loop
	//to get new real time data
	componentDidUpdate(props, state){
		this.getDirection();
	}

	componentWillUnmount(){
		StatusBar.setHidden(false);	
	}

	getRoute = (startValues, finishValues) => {
		let from_lat = parseFloat(startValues[0]);
	    let from_long = parseFloat(startValues[1]);
	    let to_lat = parseFloat(finishValues[0]);
	    let to_long = parseFloat(finishValues[1]);
	    // we will save all Polyline coordinates in this array
	    let routeCoordinates = [];
	    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
	        .then(res => {
	          res.data.response.route[0].leg[0].shape.map(m => {
	            let latlong = m.split(',');
	            let latitude = parseFloat(latlong[0]);
	            let longitude = parseFloat(latlong[1]);
	            routeCoordinates.push({latitude: latitude, longitude: longitude});
	          });

	          const summaryText = res.data.response.route[0].summary.text;

	          this.setState({
	                routeForMap: routeCoordinates,
	                summary: res.data.response.route[0].summary.text,
	                isLoading: false,
	            })
	        })
	    	.catch(err => {
	    		this.setState({ isLoading: false });
	    		alert("Terdapat kesalahan");
	    	});
	}



	getDirection = () => {
		const { pickupNumber } = this.props.navigation.state.params;
		apiWs.fetch.getMaps(pickupNumber)
			.then(res => {
				const { faster_latlong, shipper_latlong } = res;
				if (faster_latlong) {
					const startValues = faster_latlong.split("|");
					const finishValues = shipper_latlong.split("|");
					this.setState({
						startLocation: {
							latitude: parseFloat(startValues[0]),
							longitude: parseFloat(startValues[1])
						},
						finishLocation: {
							latitude: parseFloat(finishValues[0]),
							longitude: parseFloat(finishValues[1])
						}
					});
				}else{
					console.log("null");
				}
			})
			.catch(err => console.log(err));
	}

	getDetail = () => {
		const { pickupNumber } = this.props.navigation.state.params;
		this.setState({ visible: true });
		if (this.state.responseDetail.length === 0) {
			apiWs.fetch.getDetailPickup(pickupNumber)
				.then(res => {
					this.setState({ responseDetail: res });
				}).catch(err => console.log(err.response));
		}
	}

	render(){
		const { startLocation, finishLocation, visible, responseDetail } = this.state;

		return(
			<View style={{flex: 1}}>
				{ startLocation.latitude === null ? 
					<LoadingView /> : 
					<RenderMaps 
						startLocation={this.state.startLocation}
						finishLocation={this.state.finishLocation}
						isLoading={this.state.isLoading}
						routeMap={this.state.routeForMap}
						region={this.state.region}
					/> }
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
			          	<View>
			          		{ responseDetail.length === 0 ? 
			          			<Text style={{textAlign: 'center'}}>Memuat....</Text> : 
			          			<RenderDetail list={this.state.responseDetail} /> }
			          	</View>
			    </Backdrop>
			</View>
		);
	}
}

function mapStateToProps(state, nextProps) {
	return{
		userid: state.auth.dataLogin.userid
	}
}

//need new api by pickupnumber
export default connect(mapStateToProps, { fetchHistoryPickup })(Maps);