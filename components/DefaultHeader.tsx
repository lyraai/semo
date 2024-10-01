// components/DefaultHeader.tsx
import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const DefaultHeader = () => {
  const navigation = useNavigation();

  return (
    <Icon
      name="chevron-left"
      type="feather"
      color='#E14D5A'
      size={30}
      onPress={() => navigation.goBack()}
      containerStyle={styles.iconContainer}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 15,
  },
});

export default DefaultHeader;