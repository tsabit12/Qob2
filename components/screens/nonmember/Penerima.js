import React from "react";
import { View, Text, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import PenerimaForm from "./forms/PenerimaForm";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

class Penerima extends React.Component{
	state = {}

	componentDidMount(){
		console.log(this.props.navigation.state.params);
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (deskripsiPenerima) => {
		// this.props.navigation.navigate({
		// 	// routeName: 'PilihTarif',
		// 	params: {
		// 		...this.props.navigation.state.params,
		// 		deskripsiPenerima
		// 	}
		// })
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola Tujuan Order'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<KeyboardAvoidingView
					style={{flex:1}} 
					behavior="padding" 
					enabled
				>
					<ScrollView keyboardShouldPersistTaps='always'>	
						<PenerimaForm onSubmit={this.onSubmit} />
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

export default Penerima;