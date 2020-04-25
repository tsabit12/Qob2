import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        paddingVertical: 1,
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 2 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 3
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    navigation: {
        backgroundColor: 'transparent'
    },
    navigationView: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)',
        elevation: 5
    },
    labelGiro: {
        padding: 10, 
        elevation: 5, 
        backgroundColor: 'rgb(245, 90, 12)', 
        marginLeft: 5, 
        marginRight: 5, 
        marginBottom: 8,
        marginTop: 5,
        borderRadius: 2
    },
    textLabel: {
        textAlign: 'center', 
        color: '#FFF', 
        paddingLeft: 10, 
        fontWeight: '700', 
        fontSize: 12
    }
});
