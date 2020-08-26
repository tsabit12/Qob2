import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


const MarkerLabel = props => {
	return(
         <View style={styles.container}>
	        <View style={props.name === 'Pengirim' ? styles.bubble : styles.bubble2 }>
	          <Text style={styles.amount}>{props.name}</Text>
	        </View>
	        <View style={styles.arrowBorder} />
        	<View style={props.name === 'Pengirim' ? styles.arrow : styles.arrow2 } />
	    </View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignSelf: 'flex-start'
	},
	bubble: {
	    flex: 0,
	    flexDirection: 'row',
	    alignSelf: 'flex-start',
	    backgroundColor: 'orange',
	    padding: 2,
	    borderRadius: 3,
	    borderColor: 'orange',
	    borderWidth: 0.5,
	},
	bubble2: {
	    flex: 0,
	    flexDirection: 'row',
	    alignSelf: 'flex-start',
	    backgroundColor: 'red',
	    padding: 2,
	    borderRadius: 3,
	    borderColor: 'orange',
	    borderWidth: 0.5,
	},
	dollar: {
	    color: '#FFFFFF',
	    fontSize: 10,
	},
	amount: {
	    color: '#FFFFFF',
	    fontSize: 13,
	    padding: 2,
	    fontWeight: 'bold'
	},
	arrow: {
		backgroundColor: 'transparent',
		borderWidth: 6,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -9,
	},
	arrow2: {
		backgroundColor: 'transparent',
		borderWidth: 6,
		borderColor: 'transparent',
		borderTopColor: 'red',
		alignSelf: 'center',
		marginTop: -9,
	},
	arrowBorder: {
		backgroundColor: 'transparent',
		borderWidth: 4,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -0.5,
	},
})

export default MarkerLabel;