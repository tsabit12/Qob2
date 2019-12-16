import React from "react";
import { Button } from "react-native";
import { SafeAreaView, Themed } from 'react-navigation';

class Home extends React.Component {
	static navigationOptions = {
		title: 'Welcome',
	};
	render() {
		const { navigation } = this.props;
    	const { push } = navigation;
		
		return (
		  <SafeAreaView style={{ paddingTop: 30 }}>
	        <Button
	          onPress={() => push('Register')}
	          title="Go Register"
	        />
	        <Themed.StatusBar />
	      </SafeAreaView>
		);
	}
}

export default Home;