import React from "react";
import { View, Text, StatusBar } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { connect } from "react-redux";

import registerForPushNotificationsAsync from '../../registerForPushNotificationsAsync';

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

	componentDidMount(){
		const { userid } = this.props;
		registerForPushNotificationsAsync(userid)
			.then(res => console.log(res, "sukses"))
			.catch(err => console.log(err, "oke"));
	}

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
				<View style={styles.container}>
					<Text>Hello world</Text>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		userid: state.auth.dataLogin.userid
	}
}

export default connect(mapStateToProps, null)(Index);