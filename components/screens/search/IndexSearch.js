import React from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";
import { SliderBox } from "react-native-image-slider-box";


class IndexSearch extends React.Component{
	static navigationOptions = {
    	drawerLabel: 'Home'
	}
	
	render(){
		return(
			<React.Fragment>
				<ScrollView>
					<SliderBox images={[
						require('../../../assets/qob.jpg'),
						require('../../../assets/qob2.jpg'),
						require('../../../assets/qob3.jpg')
					]} 
					sliderBoxHeight={230}
					resizeMode={'stretch'}
					circleLoop
					autoplay={true}
					paginationBoxStyle={{
						alignItems: "center",
						alignSelf: "center",
						justifyContent: "center",
					  }}
					/>
					<View style={styles.container}>
						<Menu navigation={this.props.navigation} />
					</View>
				</ScrollView>
			</React.Fragment>
		);
	}
}

export default IndexSearch;