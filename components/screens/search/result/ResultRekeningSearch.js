import React from "react";
import { View, Text } from "react-native";
import styles from "../styles";
import { connect } from "react-redux";

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.judul}>Rekening Koran</Text>
		<Text>{ navigation ? navigation : 'Loading...'}</Text>
	</View>
)

const ListItem = ({ listitem }) => {
	return(
		<View>
			{ listitem.map((x, i) => <Text key={i}>{x}</Text>)}
		</View>
	);
} 

class ResultRekeningSearch extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	    headerTitle: <Judul navigation={navigation.state.params.noRek} />
	    /* No more header config here! */
	});

	render(){
		const { list } = this.props;
		return(
			<View style={{padding: 15}}>
				{list.length > 0 && <ListItem listitem={list} />}
			</View>
		);
	}
}

function mapStateToProps(state, nextProps) {
	const rek = nextProps.navigation.state.params.noRek;
	return{
		list: state.search.rekening[rek]
	}
}

export default connect(mapStateToProps)(ResultRekeningSearch);