import React from "react";
//import { Button, SafeAreaView } from "react-native";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
//import { changeTest } from "../../actions/test";
import { Text } from '@ui-kitten/components';
import api from "../api";

class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};
    
	componentDidMount(){
		// api.laporan.rekKoran('0000000018')
		// 	.then(res => console.log(res))
		// 	.catch(err => console.log(err))
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 

		return (
		  <SafeAreaView style={{flex: 1, top: 30}}>
	        <Text 
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
	        		routeName: 'RekKoran'
	        	})}
	        >
	        	Rek Koran
	        </Text>
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