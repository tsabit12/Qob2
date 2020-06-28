import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SliderBox } from "react-native-image-slider-box";

const heightDevice = Dimensions.get('window').height;

const styles = StyleSheet.create({
	root: {
		marginBottom: 5
	}
})

const ImageSlider = props => {
	return(
		<View style={styles.root}>
			<SliderBox 
				images={[
					require('../../../../assets/slider/qob.jpg'),
					require('../../../../assets/slider/qob2.jpg'),
					require('../../../../assets/slider/qob3.png'),
					require('../../../../assets/slider/qob4.jpg'),
					require('../../../../assets/slider/qob5.jpg'),
					require('../../../../assets/slider/qob6.jpg'),
				]} 
				sliderBoxHeight={heightDevice / 2.5}
				resizeMode={'stretch'}
				circleLoop
				autoplay={true}
				paginationBoxStyle={{
					alignItems: "center",
					alignSelf: "center",
					justifyContent: "center",
				}}
			/>
		</View>
	);
}

export default ImageSlider;