import React, { Component } from 'react'
import { Animated, Dimensions, Text, View, StyleSheet, Image, StatusBar } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { Spinner, Icon, Button } from '@ui-kitten/components';
import axios from "axios";
import mapStyle from "../mapstyles";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Polyline, Marker } from "react-native-maps";

const topPosOffset = 30;
const endTopPos = 370;

const Loading = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
    	<Spinner size='medium' />
    </View>
);

export class Maps extends Component {
	state = {
		startingLocation: {
			latitude: this.props.navigation.state.params.latitudeFaster,
           	longitude: this.props.navigation.state.params.longitudeFaster
        },
        finishLocation: {
          	latitude: this.props.navigation.state.params.latitude,
            longitude: this.props.navigation.state.params.longitude,
        },
        routeForMap: [],
        region: {
		  latitude: this.props.navigation.state.params.latitude,
          longitude: this.props.navigation.state.params.longitude,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		},
		isLoading: true,
		summary: null
	}

	componentDidMount(){
		this.getRoute();
		StatusBar.setHidden(true);
		// const { latitude, longitude } = this.props.navigation.state.params;
		console.log(this.props.navigation.state.params);
	}

	componentWillUnmount(){
		StatusBar.setHidden(false);
	}

	startTopPos = Dimensions.get('window').height - topPosOffset;
	topPos = new Animated.Value(Dimensions.get('window').height - topPosOffset)

	onHandlerStateChange(event){
  		// console.log(event);
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

	handleBack = () => {
		this.props.navigation.goBack();
	}


	render() { 
	    // Limit the range of the gesture
	    this.topPosFinal = this.topPos.interpolate({
	      inputRange: [endTopPos, this.startTopPos],
	      outputRange: [endTopPos, this.startTopPos],
	      extrapolate: 'clamp'
	    })

	    const { routeForMap, isLoading, summary } = this.state;

	    return (
	    	<React.Fragment>
	    		{ isLoading ? <Loading /> : 
					<MapView 
						provider={PROVIDER_GOOGLE}
						region={this.state.region} 
						style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
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
				</MapView> }
			    <PanGestureHandler 
			        maxPointers={1}
			        onGestureEvent={Animated.event([{nativeEvent: {absoluteY: this.topPos}}])}
			        onHandlerStateChange={this.onHandlerStateChange}
			    >
			        <Animated.View style={{position: "absolute", transform: [{translateY: this.topPosFinal}], width: '100%'}}>
			          <View style={styles.detailView}>
			          	<View style={{alignItems: 'center', margin: 10}}>
			          		<View style={styles.minusIcon} />
			          	</View>
			          	<View style={styles.detailTitle}>
			        		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, textAlign: 'center'}}>Pickuper</Text>
			        	</View>
			        	<View style={{flexDirection: 'row', margin: 10}}>
			        		<Image 
			          			style={styles.img}
			          			source={require('../../assets/q9/driver.png')}
			          		/>
			          		<View style={{flexDirection: 'column', marginLeft: 10}}>
			          			<Text style={[styles.detailDescription, {fontWeight: '700'}]}>{this.props.navigation.state.params.driverName}</Text>
			          			<Text style={styles.detailDescription}>D 1236 MM Honda Beat</Text>
			          			<Text style={styles.detailDescription}>Jarak Tempuh (3.0 km)</Text>
			          			<Text style={styles.detailDescription}>Estimasi (9 menit)</Text>
			          		</View>
			        	</View>
			        	<View style={{margin: 8, marginTop: -5, flexDirection: 'row'}}>
			        		<Button status='danger' style={{flex: 1, margin: 2}}>Cancel</Button>
			        		<Button status='info' style={{flex: 1, margin: 2}} onPress={this.handleBack}>Back</Button>
			        	</View>
			          </View>
			        </Animated.View>
			    </PanGestureHandler>
	      	</React.Fragment>
	    )
	}
}

export default Maps;

const styles = StyleSheet.create({
	detailView:{
		backgroundColor: '#FFF', 
		flex: 1, 
		height: 300,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15
	},
	minusIcon: {
		width: 50, 
		borderBottomWidth: 5, 
		borderRadius: 7,
		borderBottomColor: '#929493'
	},
	detailTitle: {
		paddingBottom: 10, 
		marginTop: 3, 
		borderBottomWidth: 0.3
	},
	detailDescription: {
		fontFamily: 'open-sans-reg', 
		fontSize: 14, 
		paddingBottom: 5
	},
	img: {
		width: 90, 
		height: 93, 
		borderRadius: 20, 
		borderWidth: 1, 
		borderColor: 'black',
		alignItems: 'flex-start'	
	}
})