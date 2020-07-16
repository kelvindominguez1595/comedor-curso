import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Navigation from "./app/navigate/Navigations";
import { firebaseApp } from "./app/utils/firebase";
import { YellowBox, StyleSheet } from 'react-native'
import { decode, encode } from 'base-64'
// Por si sale el eeror al subir imagenes
if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;

export default function App() {
  YellowBox.ignoreWarnings(['Setting a timer for a long period of time'], ['Animated: `useNativeDriver` was not specified.']);
  return (
    <Navigation />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
