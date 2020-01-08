import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SearchLayout from 'react-navigation-addon-search-layout';
import { connect } from "react-redux";
import { Icon, ListItem } from '@ui-kitten/components';
import { getCurdateWithStrip } from "../utils/helper";
import { getOrder } from "../../actions/order";
import Loader from "../Loader";
import Modal from "../Modal";

const HistoryIcon = (style) => (
  <Icon {...style} name='checkmark-circle-outline'/>
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

	render(){
		const { dates, loading, errors } = this.state;

		return(
			<React.Fragment>
				<Loader loading={loading} />
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> }
				<SearchLayout
					placeholder='YYYY-MM-DD'
			        onChangeQuery={this.handleQueryChange}
			        onSubmit={this.executeSearch}
			        borederBotOpacity={6}
			    >
			    <View style={styles.container}>
				    { dates.length > 0 ? <React.Fragment>
				    		{ dates.map((x, i) => <View key={i} style={styles.viewList}>
				    				<ListItem
									    title={x.tanggal}
									    icon={HistoryIcon}
									    onPress={() => this.handlePress(x.tanggal)}
									/>   
				    			</View>)}
				    	</React.Fragment> : <Text>No history search found</Text> }
			    </View>
			    </SearchLayout>
			</React.Fragment>
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
	}
})