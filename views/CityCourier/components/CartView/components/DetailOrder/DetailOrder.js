import React from 'react';
import {
	View, 
	Modal,
	Animated,
	StyleSheet,
	Dimensions,
	ScrollView
} from 'react-native';
import { Text, Spinner } from 'native-base';
import { ApiQposin } from '../../../../../../api';

const { height, width } = Dimensions.get('window');

const LoadingApp = () => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
		<Spinner color='blue' />
	</View>
);

const DetailOrder = props => {
	const [state, setState] = React.useState({
		loading: true,
		data: []
	})

	React.useEffect(() => {
		const payload = {
			userid: props.userid,
			nomorOrder: props.data.nomorOrder
		}

		ApiQposin.getNotification(payload)
			.then(notifications => {
				setState(state => ({
					...state,
					loading: false,
					data: notifications
				}))
			})
			.catch(err => {
				setState(state => ({
					...state,
					loading: false
				}))
			})
	}, []);

	const { destination } = props.data; 

	return(
		<Modal
			transparent={true}
        	visible={true}
        	onRequestClose={() => props.handleClose()}
        	animationType="fade"
		>
			<View style={styles.root}>
				{ state.loading ? <LoadingApp /> : <ScrollView style={styles.content}>
					<View style={{justifyContent: 'flex-end', margin: 8, marginTop: 15}}>
						<Text>Penerima</Text>
						<Text note>
							{destination.name}
						</Text>
						<Text note>
							{ destination.address_name }, {destination.address}
						</Text>
					</View>
					<View style={styles.progress}>
						{ state.data.length > 0 && state.data.map((row, index) => (
							<View style={{flexDirection: 'row'}}>
								<View style={styles.point} />
								<View style={{justifyContent: 'flex-end', margin: 8, marginTop: 15}}>
									<Text>{row.create_time.substring(16, 11)}</Text>
									<Text note>
										{row.create_time.substring(0, 10)}
									</Text>
									<Text note>
										{row.body}
									</Text>
								</View>
							</View>
						)) }
					</View>
				</ScrollView>}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	root: {
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	content: {
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 3,
		padding: 10
	},
	point: {
		backgroundColor: 'red', 
		height: height / 30,
		width: width / 15,
		marginBottom: 20,
		marginTop: 20,
		marginLeft: -15,
		borderRadius: 15,
		borderWidth: 9
	},
	progress: {
		borderLeftWidth: 2,
		justifyContent: 'center',
		margin: 10
	}
})

export default DetailOrder;