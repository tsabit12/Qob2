import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Layout, List, ListItem, Icon } from '@ui-kitten/components';
import { connect } from "react-redux";
import { lacakKiriman, removeHistoryLacak } from "../../../../actions/search";

const renderItemAccessory = (e, onRemove, id) => (
	<TouchableOpacity onPress={() => onRemove(id)}>
		<Icon name='close-outline' style={e} width={25} height={25} />
	</TouchableOpacity>
)

const HistorySearch = ({ listdata, onPressLink, onRemove }) => {
	return(
		<React.Fragment>
			{ Object.keys(listdata).map((x, i) => 
				<ListItem
					key={i}
					title={x}
					titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg', fontSize: 16, marginTop: 5}}
					style={{borderBottomWidth: 1, borderBottomColor: '#cbccc4'}}
					//descriptionStyle={styles.listItemDescription}
					accessory={(e) => renderItemAccessory(e, onRemove, x)}
					onPress={() => onPressLink(x)}
				/>
			)}
	    </React.Fragment>
	);
}

class LacakScreen extends React.Component{
	state = {}
	
	handleClick = (e) => {
		this.props.navigation.navigate('LacakBarcode',{
			KodeBarcode: e 
		})
	}

	getLacak = (extId) => {
		//i think we dont get errors here
		//cause this is history
		//so remove catch statement here
		this.props.lacakKiriman(extId);
		this.props.navigation.navigate({
    		routeName: 'LacakBarcode',
            params: {
            	externalId: extId
            }
    	})
	}

	hanldeRemove = (extId) => {
		this.props.removeHistoryLacak(extId);
	}

	render(){
		const { listLacak } = this.props;
		// console.log(this.props.listLacak);
		return(
			<View style={{marginTop: 5}}>
			    { Object.keys(listLacak).length > 0 ? 
			    	<HistorySearch 
			    		listdata={listLacak} 
			    		onPressLink={this.getLacak}
			    		onRemove={this.hanldeRemove}
			    	/> : 
			    <Text style={{textAlign: 'center', marginTop: 10}}>No history found</Text> }
		    </View>
		);
	}
}

function mapStateToProps(state) {
	return{
		listLacak: state.search.trace
	}
}

export default connect(mapStateToProps, { lacakKiriman, removeHistoryLacak })(LacakScreen);