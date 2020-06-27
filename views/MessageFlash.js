import React from "react";
import { Text, Animated, StatusBar } from "react-native";
import PropTypes from "prop-types";

const MessageFlash = props => {
	const fadeAnim = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		if (props.visible) {
			StatusBar.setHidden(true);
			Animated.timing(fadeAnim, {
		      toValue: 60,
		      duration: 300
		    }).start();

		    setTimeout(() => {
		    	Animated.timing(fadeAnim, {
			      toValue: 0,
			      duration: 300
			    }).start();

		    	setTimeout(() => {
		    		StatusBar.setHidden(false);
		    		props.setClose();
		    	}, 280);

		    }, 3000);
		}
	},[props.visible]);
	
	if (!props.visible) {
		return null;
	}


	return(
		 <Animated.View 
		 	style={{ 
		 		left: 0,
		 		right: 0, 
		 		height: fadeAnim,
		 		position: 'absolute',
		 		backgroundColor: '#eb3313',
		 		justifyContent: 'center',
		 		elevation: 3
		 	}}
		 >
		 	<Text style={{textAlign: 'center', color: "white"}}>{props.text}</Text>
		 </Animated.View>
	);
}

MessageFlash.propTypes = {
	visible: PropTypes.bool.isRequired,
	text: PropTypes.string,
	setClose: PropTypes.func
}

export default MessageFlash;