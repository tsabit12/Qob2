import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    AsyncStorage
} from "react-native";
import {
    Layout,
    Card,
    Button,
    Input
  } from '@ui-kitten/components';
import api from '../../api';
import Loader from "../../Loader";

class Pembayaran extends Component {
    state = {
        nominal : '',
        loading: false,
        errors: {},
        localUser: {
			norek: '-',
			userid: '-'
        }
    }

    nominalRef = React.createRef();

    validate = (nominal) => {
		const errors = {};
		if (!nominal) errors.nominal = "Masukan nomor rekening";
		return errors;
    }
    
    async componentDidMount() {
        const value     = await AsyncStorage.getItem('sessionLogin');
        const value2     = await AsyncStorage.getItem('qobUserPrivasi');
        const toObje    = JSON.parse(value);
        const toObje2    = JSON.parse(value2);
        this.setState({
            localUser: {
                userid: toObje2.userid,
                norek: toObje.norek
            }
        });
    }

    onSubmit = () => {
            this.setState({ loading: true });
            const { nominal , localUser } = this.state;
            const payload = { 
                param1: `${localUser.userid}|${localUser.norek}|${nominal}`
            }
            console.log(payload);

            api.Pembayaran.generate(payload)
                .then(res => {
                    this.setState ({ loading : false})
                    const response = {
                        desc : res.desk_mess,
                        pin : res.response_data1
                    }
                    this.props.navigation.navigate({
                        routeName : 'KonfrimPembayaran',
                        params: {
                            resGenerate: response,
                            nominal : nominal
                        }
                    })
                })
                .catch(err => {
                    this.setState({loading : false });
                    alert(err.desk_mess)
                });
    }

    CardFooter = () => (
        <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          size='small'
          status='basic'>
          ULANG
        </Button>
        <Button
          style={styles.footerControl}
          size='small'
          onPress={this.onSubmit}	
          >
          CEK
        </Button>
      </View>
    );

    render() {
        const { nominal, errors, loading } = this.state;
        return (
            <Layout style={styles.container}>
                <Loader loading={loading}/>
                <Card footer={this.CardFooter}>
                    <Input
                        label='Nominal'
                        placeholder='Masukan Jumlah Nominal'
                        ref={this.nominalRef}
                        value={nominal}
                        name='nominal'
                        size='small'
                        onChangeText={(e) => this.setState({ nominal: e })}
                        onSubmitEditing={this.onSubmit}
                        keyboardType='numeric'
                        autoFocus
                    />
                </Card>
            </Layout>
        );
    }
}
export default Pembayaran;

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
        width: 120
    }
});