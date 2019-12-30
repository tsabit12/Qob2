import React from "react";
import { SafeAreaView, Text } from "react-native";
import { Drawer, Layout, Icon, ListItem } from '@ui-kitten/components';

const HomeIcon = (style) => (
	<Icon {...style} name='home-outline' />
); 

const PersonIcon = (style) => (
	<Icon {...style} name='person' />
);

const InfoIcon = (style) => (
	<Icon {...style} name='info' />
);

const DrawerComponent = ({ navigation }) => {
  const onSelect = (index) => {
    const { [index]: selectedTabRoute } = navigation.state.routes;
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <SafeAreaView>
      <Drawer 
      	style={{fontFamily: 'open-sans-bold'}}
      	data={[
      		{ title: 'Home', icon: HomeIcon }, 
      		{ title: 'Akun', icon: PersonIcon },
      		{ title: 'About', icon: InfoIcon },
      	]} 
      	onSelect={onSelect} />
    </SafeAreaView>
  );
};

export default DrawerComponent;