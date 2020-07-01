import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "@ui-kitten/components";
import PDFReader from 'rn-pdf-reader-js'

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

const Invoice = props => {
	const [state, setState] = React.useState({
		result: null
	})

	return(
		<View style={{flex: 1}}>
			<Button>Download</Button>
			<PDFReader
		        source={{ 
		          uri: 'http://www.africau.edu/images/default/sample.pdf',
		        }}
		    />
	    </View>
	);
}

export default Invoice;