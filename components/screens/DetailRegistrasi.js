import React from "react";
import { View, Text } from "react-native";

class DetailRegistrasi extends React.Component{
	render(){
		return(
			<View style={styles.contentContainer}>
				<Text>Detail</Text>
			</View>
		);
	}
}

let styles = {
  contentContainer: {
    paddingTop: 8,
  }
};


export default DetailRegistrasi;