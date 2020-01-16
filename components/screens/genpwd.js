import React, { Component } from "react";
import { 
    View,
    StyleSheet
} from "react-native";
import {
    Layout,
    Text,
    Card,
    Button,
    Input,
    CardHeader
  } from '@ui-kitten/components';

class genpwd extends Component {

    componentDidMount() {
        console.log(this.props.navigation.state.params);
    }

    CardFooter = () => (
        <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          size='small'
          onPress={this.backHome}	
          >
          Kembali ke Halaman Utama
        </Button>
      </View>
    )

    backHome = () => {
		this.props.navigation.navigate({
			routeName: 'IndexSearch',
			params: {}
		})
	}

    render() {
        const { desc, pwd } = this.props.navigation.state.params.respwd;
        return (
            <Layout style={styles.container}>
                <Card status='success' style={{marginVertical: 8}} footer={this.CardFooter}>
                    <View style={{padding: 10}}>
                        <Text style={{fontSize: 20, textAlign: 'center', margin: 5, fontWeight: '700'}}>{desc} </Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}>PASSWORD ANDA</Text>
                        <Text style={{fontSize: 20, textAlign: 'center', margin: 5, fontWeight: '700'}}>{pwd} </Text>
                        <Text style={{fontSize: 14, textAlign: 'center', margin: 5}}> Password ini hanya berlaku selama 24 jam</Text>
                    </View>
                </Card>
            </Layout>
        );
    }
}
export default genpwd;

const styles = StyleSheet.create({
    container: {
        padding: 10,     
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerControl: {
        marginHorizontal: 4,
        width: 250
    }
});