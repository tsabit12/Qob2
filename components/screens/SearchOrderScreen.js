import React from "react";
import { View, Text, StyleSheet, StatusBar, TextInput } from "react-native";
// import SearchLayout from 'react-navigation-addon-search-layout';
import { connect } from "react-redux";
import { Icon, ListItem, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { getCurdateWithStrip } from "../utils/helper";
import { getOrder } from "../../actions/order";
import Loader from "../Loader";
import Modal from "../Modal";
import Constants from 'expo-constants';

const HistoryIcon = (style) => (
  <Icon {...style} name='checkmark-circle-outline'/>
);

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

class SearchOrderScreen extends React.Component{
	state = {
		dates: [],
		searchParams: '',
		loading: false,
		errors: {}
	}

	componentDidMount(){
		const { listTanggal } = this.props;
		if (Object.keys(listTanggal).length > 0) {
			const dates = [];
			Object.keys(listTanggal).forEach(x => {
				dates.push({
					tanggal: x
				});
			});
			this.setState({ dates });
		}
		// console.log(this.props.listTanggal);
	}

	handleQueryChange = searchText => this.setState({ searchParams: searchText })

	executeSearch = () => {
		this.setState({ loading: true });
		const { dataLogin } 	= this.props;
        const { userid, norek } = dataLogin;
        const { searchParams } 	= this.state;
        const payload = {
            sp_nama  : `Ipos_getPostingPebisol`,
            par_data : `${userid}|${searchParams}|${searchParams}`
        };
        this.props.getOrder(payload, searchParams)
        	.then(() => {
        		this.setState({ loading: false });
        		this.props.navigation.navigate({
		            routeName: 'ListOrder',
		            params: {
		                tanggalSearch: searchParams
		            }
		        })
        	})
        	.catch(err => 
        		this.setState({ 
        			loading: false, 
        			errors: { global: 'Terdapat kesalahan, atau data tidak ditemukan'}
        		})
        	);
	}

	handlePress = (tanggal) => {
		const { dataLogin } = this.props;
        const { userid, norek } = dataLogin;
        const payload = {
            sp_nama  : `Ipos_getPostingPebisol`,
            par_data : `${userid}|${tanggal}|${tanggal}`
        };

        this.props.getOrder(payload, tanggal);
        this.props.navigation.navigate({
            routeName: 'ListOrder',
            params: {
                tanggalSearch: tanggal
            }
        })
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	renderRightControls = () => (
		<View style={styles.inputView}>
			<TextInput 
				placeholder='Cari... (YYYY-MM-DD)' 
				autoFocus 
				style={styles.input} 
				value={this.state.searchParams}
				placeholderTextColor='#f7f7f7'
				onChangeText={(e) => this.setState({ searchParams: e })}
				onSubmitEditing={this.executeSearch}
			/>
		</View>
	);

	render(){
		const { dates, loading, errors } = this.state;

		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    alignment='center'
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    rightControls={this.renderRightControls()}
				    evaluation={5}
				/>
				<View>
					<Loader loading={loading} />
					{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> }
				    <View style={styles.container}>
					    { dates.length > 0 ? <React.Fragment>
					    		{ dates.map((x, i) => <View key={i} style={styles.viewList}>
					    				<ListItem
										    title={x.tanggal}
										    icon={HistoryIcon}
										    onPress={() => this.handlePress(x.tanggal)}
										/>   
					    			</View>)}
					    	</React.Fragment> : <Text style={{marginTop: 20, textAlign: 'center'}}>Riwayat pencarian tidak ditemukan</Text> }
				    </View>
			    </View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		listTanggal: state.order.dataOrder,
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { getOrder })(SearchOrderScreen);

const styles = StyleSheet.create({
	container: {
		marginTop: 2
	},
	viewList: {
		borderBottomWidth: 1,
		borderBottomColor: '#cbccc4',
	},
	StatusBar: {
	    height: Constants.statusBarHeight,
	    backgroundColor: 'rgb(240, 132, 0)'
	},
	inputView: {
		backgroundColor: 'rgba(0,0,0,0)',
        width: '94%'
	},
	input: {
        fontSize: 18,
        height: 40,
        color: '#f7f7f7',
        backgroundColor: 'rgb(240, 132, 0)',
    }
})