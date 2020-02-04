import React from "react";
import { View, Text, StatusBar, TouchableOpacity, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Polyline, Marker } from "react-native-maps";
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import axios from "axios";
import mapStyle from "../mapstyles";
import { Backdrop } from "react-native-backdrop";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const heightBar = Constants.statusBarHeight;

const Loading = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
    	<Spinner size='medium' />
    </View>
);


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

class RiwayatPickup extends React.Component{
	// state = {
	// 	latitude: null,
	// 	longitude: null
	// }
	state = {
		startingLocation: {
			latitude: -6.9213255,
           	longitude: 107.6074113,
        },
        finishLocation: {
          	latitude: -6.9104085,
            longitude: 107.616908,
        },
        routeForMap: [],
        region: {
		  latitude: -6.9104085,
          longitude: 107.616908,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		},
		isLoading: true,
		visible: true,
		summary: null
	}

	async componentDidMount(){
		this.getRoute();
	}

	getRoute = () => {
		let from_lat = parseFloat(this.state.startingLocation.latitude)
	    let from_long = parseFloat(this.state.startingLocation.longitude)
	    let to_lat = parseFloat(this.state.finishLocation.latitude)
	    let to_long = parseFloat(this.state.finishLocation.longitude)
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
	          // console.log(summaryText.search("and <span"))

	          this.setState({
	                routeForMap: routeCoordinates,
	                // here we can access route summary which will show us how long does it take to pass the route, distance etc.
	                summary: res.data.response.route[0].summary.text,
	                // NOTE just add this 'isLoading' field now, I'll explain it later
	                isLoading: false,
	            })
	        })
	    	.catch(err => {
	    		console.log(err.response);
	    		this.setState({ isLoading: false });
	    		alert("Terdapat kesalahan");
	    	});
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)


	render(){
		const { routeForMap, isLoading, visible, summary } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				{ isLoading ? <Loading /> : 
					<React.Fragment>
						<MapView 
							provider={PROVIDER_GOOGLE}
							region={this.state.region} 
							style={{position: 'absolute', top: heightBar, left: 0, right: 0, bottom: 0}}
							customMapStyle={mapStyle}	
							showsUserLocation={true}
							minZoomLevel={12}
						>
						  <Polyline coordinates={this.state.routeForMap} strokeWidth={4} strokeColor="#4fdbd0" geodesic={true}/>
						  <Marker 
						  	coordinate={{latitude: this.state.startingLocation.latitude, longitude: this.state.startingLocation.longitude}} 
						  	title="Starting location"
						  	image={require('../../assets/motorcycle.png')}
						  />
						  <Marker coordinate={{latitude: this.state.finishLocation.latitude, longitude: this.state.finishLocation.longitude}} title="Finishlocation"/>
						</MapView>
						{ !visible && 
							<GestureRecognizer
						        onSwipeUp={() => this.setState({ visible: true })}
						        style={{
						          	position: 'absolute', 
									bottom: 0, 
									left: 0,
									right: 0,
									height: 100, 
									backgroundColor: 'transparent',
									width: '100%',
						        }}
						    >
						    <View style={{flex: 1, marginBottom: -30, justifyContent: 'center', alignItems: 'center',}}>
								<Icon name='arrowhead-up-outline' width={30} height={30} fill='#FFF' />
								<Text style={{color: '#FFF', fontSize: 15}}>Swipe Up</Text>
							</View>
						</GestureRecognizer> }
						<Backdrop
					        visible={this.state.visible}
					        handleOpen={() => this.setState({ visible: true })}
					        handleClose={() => this.setState({ visible: false })}
					        onClose={() => this.setState({ visible: false })}
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
					          marginBottom: 7
					        }}>
					        	<View style={{paddingBottom: 10, borderBottomWidth: 0.3}}>
					        		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, textAlign: 'center'}}>Pickuper</Text>
					        	</View>
					        	<View style={{flexDirection: 'row', marginTop: 10}}>
					          		<Image 
					          			style={{ 
					          				width: 90, 
					          				height: 93, 
					          				borderRadius: 20, 
					          				borderWidth: 1, 
					          				borderColor: 'black',
					          				alignItems: 'flex-start'
					          			}}
					          			source={require('../../assets/q9/driver.png')}
					          		/>
					          		<View style={{flexDirection: 'column', marginLeft: 10}}>
						          			<Text style={{fontFamily: 'open-sans-reg', fontSize: 14, paddingBottom: 5, fontWeight: '700'}}>Jhon Doe</Text>
						          			<Text style={{fontFamily: 'open-sans-reg', fontSize: 14, paddingBottom: 5}}>D 1236 MM Honda Beat</Text>
						          			<Text style={{fontFamily: 'open-sans-reg', fontSize: 14, paddingBottom: 5}}>Jarak Tempuh (3.0 km)</Text>
						          			<Text style={{fontFamily: 'open-sans-reg', fontSize: 14, paddingBottom: 5}}>Estimasi (9 menit)</Text>
					          		</View>
				          		</View>
					    </Backdrop>
					</React.Fragment> }
			</View> 
		);
	}
}

export default RiwayatPickup;