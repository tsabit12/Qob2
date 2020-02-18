import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import Constants from 'expo-constants';
import PenerimaForm from "./forms/PenerimaForm";
import { connect } from "react-redux";

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const LoadingView = () => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Spinner size='medium' />
		<Text style={{fontFamily: 'open-sans-reg', marginTop: 5}}>Loading...</Text>
	</View>
);


class Penerima extends React.Component{
	state = {
		show: false
	}

	componentDidMount(){
		setTimeout(() => this.setState({ show: true }), 300);
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (deskripsiPenerima) => {
		this.props.navigation.navigate({
			routeName: 'PilihTarif',
			params: {
				...this.props.navigation.state.params,
				deskripsiPenerima
			}
		})
	}

	render(){
		const { show } = this.state;
		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola Penerima'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)', elevation: 10, paddingTop: Constants.statusBarHeight + 8}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ show ? <KeyboardAvoidingView
							style={{flex:1}} 
							behavior="padding" 
							enabled
						>
					<ScrollView keyboardShouldPersistTaps='always'>	
						<PenerimaForm onSubmit={this.onSubmit} />
					</ScrollView>
				</KeyboardAvoidingView> : <LoadingView /> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(Penerima);