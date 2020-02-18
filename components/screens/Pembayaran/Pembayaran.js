import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    AsyncStorage,
    StatusBar,
    Text
} from "react-native";
import {
    Layout,
    Button,
    Input,
    Icon,
    TopNavigation,
    TopNavigationAction
  } from '@ui-kitten/components';
import api from '../../api';
import Loader from "../../Loader";
import Constants from 'expo-constants';
import Dialog from "react-native-dialog";

const MyStatusBar = () => (
    <View style={styles.StatusBar}>
        <StatusBar translucent barStyle="light-content" />
    </View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ErrorsMessage = ({ message, onPress }) => (
    <Dialog.Container visible={true}>
        <Dialog.Title>Notifikasi</Dialog.Title>
        <View style={{margin: 17, alignItems: 'center'}}>
            <Text style={{textAlign: 'center'}}>{message}</Text>
        </View>
        <Dialog.Button label="Tutup" onPress={() => onPress()} />
    </Dialog.Container>
);

class Pembayaran extends Component {
    state = {
        nominal : '0',
        loading: false,
        errors: {},
        localUser: {
			norek: '-',
			userid: '-'
        },
        success: false,
        response: {}
    }

    nominalRef = React.createRef();

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
            const errors = this.validate(this.state.nominal);
            this.setState({ errors });
            if (Object.keys(errors).length === 0) {
                this.setState({ loading: true });
                const { nominal , localUser } = this.state;
                const payload = { 
                    param1: `${localUser.userid}|${localUser.norek}|${nominal}`
                }
                api.Pembayaran.generate(payload)
                    .then(res => {
                        const response = {
                            desc : res.desk_mess,
                            pin : res.response_data1
                        };
                        this.setState ({ loading : false, response, success: true });
                    })
                    .catch(err => {
                        // alert(err.desk_mess)
                        if (err.desk_mess) {
                            this.setState({loading : false, success: false, response: {}, errors: { global: err.desk_mess } });
                        }else{
                            this.setState({
                                loading : false, 
                                success: false, 
                                response: {}, 
                                errors: { global: 'Whoopps, kami mengalami masalah saat menghubungkan ke server. Silahkan cobalagi nanti' } 
                            });
                        }
                    });
            }
    }

    validate = (nominal) => {
        const errors = {};
        if (nominal <= 0) errors.nominal = "Masukan nominal bayar";
        return errors;
    }

    BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
    )

    onChangeText = (e) => {
        var val = e.replace(/\D/g, '');
        var x   = Number(val);
        const value = numberWithCommas(x);
        this.setState({ nominal: value });
        // (e) => this.setState({ nominal: e })
    }

    render() {
        const { nominal, errors, loading, response } = this.state;
        return (
            <View style={{flex: 1}}>
                <MyStatusBar />
                <TopNavigation
                    leftControl={this.BackAction()}
                    title='Generate Pembayaran'
                    alignment='center'
                    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
                    style={{backgroundColor: 'rgb(240, 132, 0)'}}
                />

                <Loader loading={loading}/>
                { errors.global && <ErrorsMessage message={errors.global} onPress={() => this.setState({ errors: {} })} />}

                <View style={styles.container}>
                    { Object.keys(response).length > 0 ?   
                         <View style={styles.result}>
                            <Text style={{fontSize: 13, textAlign: 'center'}}>
                                SIMPAN PESAN INI SEBAGAI BUKTI PEMBAYARAN INFOKAN PESAN INI KEPADA PETUGAS LOKET KANTOR POS TERDEKAT
                            </Text>
                            <View style={{borderWidth: 0.3, marginTop: 6}}/>
                            <View style={{padding: 5}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>TOKEN</Text>
                                    <Text style={{marginLeft: 40}}>: {response.pin}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>NOMINAL</Text>
                                    <Text style={{marginLeft: 22}}>: {this.state.nominalVal}</Text>
                                </View>
                            </View>
                            <Button status='warning' style={{marginTop: 6}} onPress={() => this.setState({ nominal: 0, nominalVal: 0, response: {}, success: false })}>RESET</Button>
                        </View> :
                         <View style={styles.form}>
                            <Input
                                label='Nominal'
                                placeholder='Masukan Jumlah Nominal'
                                ref={this.nominalRef}
                                value={this.state.nominal}
                                name='nominal'
                                onChangeText={this.onChangeText}
                                onSubmitEditing={this.onSubmit}
                                keyboardType='numeric'
                                autoFocus
                                returnKeyType='done'
                                status={errors.nominal && 'danger'}
                                labelStyle={{fontSize: 16, color: 'black', fontFamily: 'open-sans-reg'}}
                                caption={errors.nominal && `${errors.nominal}`}
                            />
                            <Button status='warning' onPress={this.onSubmit}>BAYAR</Button>
                        </View> }
                </View>
            </View>
        );
    }
}
export default Pembayaran;

const styles = StyleSheet.create({
    container: {
        margin: 10, 
        padding: 3    
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerControl: {
        marginHorizontal: 4,
        width: 120
    },
    form:{
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#dbdad9'
    },
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)'
    },
    result: {
        borderWidth: 0.6,
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d9d8d7'
    }
});