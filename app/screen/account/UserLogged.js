import React, { useState, useEffect, useRef } from 'react'
import {StyleSheet, View } from 'react-native'
import { Button, Divider } from 'react-native-elements';
import Toast from 'react-native-easy-toast'
import * as firebase from "firebase";

import Loading from "../../Components/Loading";
import InforUser from "../../Components/Account/InfoUser";
import AccountOption from "../../Components/Account/AccountOption";

export default function UserLogged() {
    const [loading, setloading] = useState(false);
    const [loaginText, setloaginText] = useState(""); 
    const [reloadUserInfo, setReloadUserInfo] = useState(false) 
    const [userInfo, setuserInfo] = useState(null);  
    const toastRef = useRef();

    useEffect(() => {
       (async () => {
           const user = await firebase.auth().currentUser;
           setuserInfo(user);
       })() // autoejecutable dos parentesis 
       setReloadUserInfo(false)
    }, [reloadUserInfo])
    return (
        <View style={StyleSheet.viewUserInfo}>
            {userInfo && <InforUser 
            userInfo={userInfo}
            toastRef={toastRef}
            setloading={setloading}
            setloaginText={setloaginText}
            />}
            
            <AccountOption 
            userInfo={userInfo}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
            />
            <Divider style={styles.divider} />
            <Button 
                title="Cerrar Sesión" 
                buttonStyle={styles.btnCloseSession}
                onPress={() => firebase.auth().signOut()}
                titleStyle={styles.btnStyletitle}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text={loaginText} isVisible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
    },
    btnStyletitle:{
        color: "#00a680"
    }
})