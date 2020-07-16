import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function UserGuest() {
    const navigation = useNavigation();
    return (
        <ScrollView centerContent={true} style={style.viewBody}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain" 
                style={style.imagen}
            />
            <Text style={style.title}>Consulta su perfil de 5 tenedores</Text>
            <Text style={style.description}>
                Este son mis primeros pasos con react native espero,
                que me valla bien, hola mundo desde react native    
            </Text>
            <View style={style.viewbtn}>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={style.btnStyle}
                    containerStyle={style.btnContainer}
                    onPress={() => navigation.navigate("login")}
                 />                
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    }, 
    imagen:{
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom:10,
        textAlign:"center",
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    viewbtn:{
        flex: 1,
        alignItems: "center",
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer:{
        width: "70%"
    }
});