import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Icon, TopNavigation, TopNavigationAction, Spinner, ListItem } from '@ui-kitten/components';
import styles from "./styles";
import apiWs from "../../apiWs";

const BackIcon = (style) => (
	<View style={{marginTop: 7}}>
  		<Icon {...style} name='arrow-back' fill='#FFF'/>
  	</View>
);


const LoadingView = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Spinner size='medium' />
		<Text>Memuat...</Text>
	</View>
);

const EmptyOrError = ({ message }) => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Text>{message}</Text>
	</View>
);

const DetailView = ({ dataDetail }) => (
	<View style={{flex: 1}}>
		{ dataDetail.length > 0 && <React.Fragment>
			{ dataDetail.map((x, i) => 
				<ListItem
			      title={x.externalId}
			      description={x.contentDesc}
			      style={{borderBottomWidth: 0.3, borderColor: '#adadaa'}}
			      // accessory={renderAccessory}
			    /> )}
		</React.Fragment>}
	</View>
);

class DetailPickup extends React.Component{
	state = {
		isLoading: true,
		data: {},
		errors: {}
	}

	componentDidMount(){
		const { pickupNumber } = this.props.navigation.state.params;
		apiWs.fetch.getDetailPickup(pickupNumber)
			.then(res => {
				this.setState({
					data: res,
					isLoading: false
				})
			})
			.catch(err => {
				console.log(err);
				if (err.response.data.errors) {
					this.setState({ isLoading: false, errors: err.response.data.errors });
				}else{
					this.setState({ isLoading: false, errors: {global: 'Whooppps, terdapat keslahan'} });
				}
			})
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		const { isLoading, errors } = this.state;

		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Detail Pickup'
				    subtitle={this.props.navigation.state.params.pickupNumber}
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF', marginTop: 5}}
				    style={styles.navigationStyle}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ isLoading ? <LoadingView /> : 
					<React.Fragment> 
						{ errors.global ? 
							<EmptyOrError message={errors.global} /> : 
							<ScrollView>
								<DetailView dataDetail={this.state.data} />
							</ScrollView> }
					</React.Fragment>}
			</View>
		);
	}
}

export default DetailPickup;