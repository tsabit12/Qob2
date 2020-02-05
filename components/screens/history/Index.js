import React from "react";
import { View, Text, StatusBar } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


class Index extends React.Component{
	state = {}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Riwayat Pickup'
				    alignment='center'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				/>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{fontFamily: 'open-sans-bold', fontSize: 16}}>
						Next Features, still development!!!
					</Text>
				</View>
			</View>
		);
	}
}

export default Index;