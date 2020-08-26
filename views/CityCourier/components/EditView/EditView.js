import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { Text, Item, Input, Button, List, ListItem, Thumbnail, Left, Body, Right, Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { ApiOrder } from '../../../../api';

const device = Dimensions.get('window').width;

const ListPlaces =props => {
	return(
		<ListItem 
			icon 
			button
			onPress={() => props.onPressItem(props.location)}
			style={{marginBottom: 5, marginTop: 5}}
		>
		  	<Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
              	<Icon active name="ios-map" />
              </Button>
            </Left>
            <Body>
              <Text note numberOfLines={2}>{props.label}</Text>
            </Body>
		</ListItem>
	);
}

const EditView = props => {
	const [state, setState] = React.useState({
		positionView: new Animated.Value(500),
		param: '',
		loading: false,
		places: []
	})

	const { values } = props;

	//on mount should get addres 
	React.useEffect(() => {
		Animated.spring(positionView, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();

	}, []);

	React.useEffect(() => {
		if (state.param) {
			const timeout = setTimeout(function() {
				getAddres(state.param);
			}, 700);

			return () => clearTimeout(timeout);
		}
	}, [state.param])

	const { positionView, field } = state;

	const getAddres = (value) => {
		setState(state => ({
			...state,
			loading: true,
			places: [] //reset
		}))

		ApiOrder.google.findLatlongbyAddres(value)
			.then(places => {
				setState(state => ({
					...state,
					places,
					loading: false
				}))
			})
	}

	return(
		<React.Fragment>
			<Animated.View 
				style={[{transform: [{translateY: positionView }] }, styles.root]}
			>
				<View style={styles.card}>
					<Text style={styles.title}>CARI LOKASI {props.markerType === 'sender' ? 'PENGIRIM' : 'PENERIMA'}</Text>
				</View>
				<View style={styles.content}>
					<Item rounded>
						<Input 
							placeholder='Jln/kecamatan/kota'
							value={state.param}
							onChangeText={(text) => setState(state => ({
								...state,
								param: text
							}))}
						/>
						<FontAwesome name="search" size={24} color="#384850" style={{marginRight: 12}} />
					</Item>
					{ state.loading && <Text style={styles.textLoading}>Loading....</Text> }
				</View>
				{ state.places.length > 0 && 
					<List style={styles.list}>
						<ScrollView>
							{state.places.map((list, key) => (
								<ListPlaces 
									label={list.label} 
									key={key} 
									location={list.location}
									onPressItem={props.handleChooseStreet}
								/>
							))}
						</ScrollView>
				</List>}	

				<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
					<TouchableOpacity 
						style={styles.btn}
						onPress={props.close}
					>
			            <Text style={{fontFamily: 'Roboto_medium', color: 'white'}}>X</Text>
			        </TouchableOpacity>
		        </View>
			</Animated.View>
		</React.Fragment>
	)
}

const styles = StyleSheet.create({
	root:{
		position: 'absolute',
		top: 0,
		bottom: 0,
		backgroundColor: 'white',
		flex: 1,
		width: '100%'
	},
	statusBar: {
		height: Constants.statusBarHeight,
		backgroundColor: '#ff9500'
	},
	close: {
		position: 'absolute',
		top: 0,
		right: 0,
		margin: 15
	},
	card: {
		elevation: 5,
		backgroundColor: '#ff9500',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		padding: 10,
		paddingTop: Constants.statusBarHeight + 10
	},
	title: {
		fontFamily: 'Roboto_medium',
		color: '#FFFF',
		fontSize: 18
	},
	border: {
		borderBottomWidth: 0.3
	},
	content: {
		margin: 10
	},
	textBtn: {
		textAlign: 'center'
	},
	btn: {
		margin: 10,
		elevation: 3,
		position: 'absolute',
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ff9500',
		width: 50,
		height: 50,
		borderRadius: 50/2,
	},
	list: {
		height: device * 3.2 / 2,
	},
	textLoading: {
		margin: 5
	}
})

EditView.propTypes = {
	values: PropTypes.object.isRequired,
	close: PropTypes.func.isRequired,
	handleChooseStreet: PropTypes.func.isRequired
}

export default EditView;