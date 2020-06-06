import React from "react";
import { View, Text } from "react-native";
import { Entypo } from '@expo/vector-icons';

const Message = props => {
	return(
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<Text style={{textAlign: 'center', fontSize: 15, fontWeight: '700', color: "#B5B5B4"}}>{props.message}</Text>
			<View style={{marginTop: 10}}>
				<Entypo 
					name="emoji-sad" 
					size={24} color="black" 
					color="#B5B5B4"
				/>
			</View>
		</View>
	);
}

export default Message;