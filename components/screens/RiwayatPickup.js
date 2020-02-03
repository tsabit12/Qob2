import React from "react";
import { View, Text, StatusBar } from "react-native";
import MapView from 'react-native-maps';
import { Polyline, Marker } from "react-native-maps";
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import axios from "axios";

const locations = require('../../location.json');

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
            latitude: -6.917840,
            longitude: 107.660492,
        },
        finishLocation: {
           latitude: -6.946010,
           longitude: 107.602210,
        },
        routeForMap: [],
        region: {
		  latitude: -6.917840,
		  longitude: 107.660492,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		}
	}

	async componentDidMount(){
		const { status } = await Permissions.getAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			const response = await Permissions.askAsync(Permissions.LOCATION);
		}

		this.getRoute();
        // here we are getting all route coordinates from API response

		// navigator.geolocation.getCurrentPosition(
		// 	({ coords: { latitude, longitude }}) => this.setState({ latitude: latitude, longitude: longitude }),
		// 	(error) => console.log("err: ", error)
		// );

		// const { locations: [ sampleLocation ] } = this.state;
		// this.setState({
	 //      desLatitude: sampleLocation.coords.latitude,
	 //      desLongitude: sampleLocation.coords.longitude
	 //    }, this.mergeCoords);
	}

	getRoute = () => {
		let from_lat = parseFloat(this.state.startingLocation.latitude)
	    let from_long = parseFloat(this.state.startingLocation.longitude)
	    let to_lat = parseFloat(this.state.finishLocation.latitude)
	    let to_long = parseFloat(this.state.finishLocation.longitude)
	    // we will save all Polyline coordinates in this array
	    let routeCoordinates = [];
	    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;car;traffic:disabled`)
	    	.then(res => {
	    		// console.log(res.data.response.route[0].leg[0].maneuver)
	    		res.data.response.route[0].leg[0].maneuver.map(m => {
	    			// let latlong = m.split(',');
	    			// console.log(latlong);
	    			const { latitude, longitude } = m.position;
	    			routeCoordinates.push({latitude: latitude, longitude: longitude});
	    		});
	    		this.setState({
		            routeForMap: routeCoordinates,
		            // here we can access route summary which will show us how long does it take to pass the route, distance etc.
		            // summary: res.data.response.route[0].summary,
		            // NOTE just add this 'isLoading' field now, I'll explain it later
		            isLoading: false,
		        })
	    	})
	    	.catch(err => console.log(err.response));
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)


	render(){
		const { routeForMap } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Thank You'
				    alignment='center'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}						    
				/>
				<MapView region={this.state.region} style={{flex: 1}}>
				  <Polyline coordinates={this.state.routeForMap} strokeWidth={7} strokeColor="red" geodesic={true}/>
				  <Marker 
				  	coordinate={{latitude: this.state.startingLocation.latitude, longitude: this.state.startingLocation.longitude}} 
				  	title="Starting location"
				  	image={require('../../assets/motorcycle.png')}
				  />
				  <Marker coordinate={{latitude: this.state.finishLocation.latitude, longitude: this.state.finishLocation.longitude}} title="Finishlocation"/>
				</MapView>
			</View> 
		);
	}
}

export default RiwayatPickup;