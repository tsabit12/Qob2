import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Button, Input } from '@ui-kitten/components';


class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<Input 
						placeholder='Masukan username'
						size='medium'
						style={styles.input}
					/>
					<Input 
						placeholder='PIN'
						size='medium'
						style={styles.input}
					/>
					<Button status='info' size='medium'>MASUK</Button>
					<View style={styles.link}>
						<Text>Atau daftar </Text>
						<Text 
							style={{color: 'blue'}}
							onPress={() => this.props.navigation.navigate({
				        		routeName: 'IndexRegister'
				        	})}	
						>disini</Text>
					</View>
					
			        <Text 
			        	style={{color: 'blue'}}
			        	onPress={() => this.props.navigation.navigate({
			        		routeName: 'IndexSearch'
			        	})}
			        >
			        	Search
			        </Text>
			        { /* <Text 
			        	style={{color: 'blue'}}
			        	onPress={() => this.props.navigation.navigate({
			        		routeName: 'IndexRegister'
			        	})}
			        >
			        	Registrasi
			        </Text>

			        <Text 
			        	style={{color: 'blue'}}
			        	onPress={() => this.props.navigation.navigate({
			        		routeName: 'Helper'
			        	})}
			        >
			        	Bantuan
			        </Text> */ }
		        </View>
		   	</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  marginTop: Expo.Constants.statusBarHeight
	},
	content: {
	    margin: 20,
	},
	input: {
		paddingBottom: 5,
		paddingTop: 5
	},
	link: {
		flexDirection: 'row',
		paddingTop: 7
	}
  });
  