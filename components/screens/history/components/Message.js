import React from "react";
import { View, Text } from "react-native";

const Message = props => {
	return(
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<Text style={{textAlign: 'center', fontSize: 15, fontWeight: '700', color: "#B5B5B4"}}>{props.message}</Text>
		</View>
	);
}

export default Message;