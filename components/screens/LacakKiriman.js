import React from "react";
import { View, Text } from "react-native";

class LacakKiriman extends React.Component{
	static navigationOptions = {
	    title: 'Home',
	    /* No more header config here! */
	};

	render(){
		return(
			<View>
				<Text>Lacak</Text>
			</View>
		);
	}
}

export default LacakKiriman;