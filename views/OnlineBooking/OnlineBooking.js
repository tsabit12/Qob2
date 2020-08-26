import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import Constants from 'expo-constants';
import { Card, CardItem, Text, Body } from 'native-base';
import { Feather } from '@expo/vector-icons'; 

const OnlineBooking = props => {
	const [state] = React.useState({
		slideUp: new Animated.Value(100),
		shakeValue: new Animated.Value(0)
	})

	const { slideUp, shakeValue } = state;

	React.useEffect(() => {
		Animated.spring(slideUp, {
	      toValue: -1,
	      useNativeDriver: true
	    }).start();

	    setTimeout(function() {
	    	Animated.sequence([
		      Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeValue, { toValue: -10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeValue, { toValue: -10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeValue, { toValue: 0, duration: 100, useNativeDriver: true })
		    ]).start();
	    }, 1000);
	}, []);

	const BackAction = () => (
		<TopNavigationAction 
			icon={(style) =>  <Icon {...style} name='arrow-back' fill='#FFF'/> }
			onPress={() => props.navigation.goBack()}
		/>
	);

	return(
		<View style={styles.root}>
			<View style={{backgroundColor: 'rgb(240, 132, 0)'}}>
				<TopNavigation
				    leftControl={BackAction()}
				    // subtitle='Kelola deskripsi kiriman'
				    title='Quick Online Booking'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={styles.navigation}
				    subtitleStyle={{color: '#FFF'}}
				/>
			</View>
			<Animated.View style={[{transform: [{translateY: slideUp }] }, styles.container]}> 
				<Card>
		            <CardItem 
		            	header 
		            	button 
		            	bordered 
		            	onPress={() => props.navigation.navigate({
		            		routeName: 'OrderNonMember'
		            	})}
		            >
		            	<View style={styles.row}>
		              		<Text>INTER CITY</Text>
		              		<Feather name="arrow-right" size={24} color="black" />
		              	</View>
		            </CardItem>
		            <CardItem bordered>
		              <Body>
		                <Text>
		                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod... <Text style={{color: '#346dad'}}>baca lebih lanjut</Text>
		                </Text>
		              </Body>
		            </CardItem>
		        </Card>

		        <Animated.View style={{ transform: [{translateX: shakeValue}]}}>
			        <Card>
			            <CardItem 
			            	header 
			            	bordered
			            	button
			            	onPress={() => props.navigation.navigate({
			            		routeName: 'CityCourier'
			            	})}
			            >
			            	<View style={styles.row}>
			              		<Text>INTRA CITY</Text>
			              		<Feather name="arrow-right" size={24} color="black" />
			              	</View>
			            </CardItem>
			            <CardItem bordered>
			              <Body>
			                <Text>
			                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
			                  developers to build... <Text style={{color: '#346dad'}}>baca lebih lanjut</Text>
			                </Text>
			              </Body>
			            </CardItem>
			        </Card>
		        </Animated.View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)',
		marginTop: Constants.statusBarHeight,
		elevation: 5
	},
	container: {
		padding: 5
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1
	}
})

export default OnlineBooking;