import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Button } from 'react-native-elements';
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props) {
    const { 
        userInfo: { photoURL, displayName, email, uid }, 
        toastRef,
        setloading,
        setloaginText,
    } = props;
    
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;
        if(resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado la seleccion de imagenes");
            }else{
                uploadAvatar(result.uri)
                .then(() => {
                    updateAvatar();   
                    toastRef.current.show("Avatar actualizado");                 
                }).catch(() => {
                    toastRef.current.show("Error al trata de actualizar imagen"); 
                })
            }
        }
    }

    const uploadAvatar = async (uri) => {
        setloaginText('Actualizando');
        setloading(true);
        const response = await fetch(uri);
        // console.log(JSON.stringify(response))
        // Investigar blob
        const blob = await response.blob();
        // Subir a firebase
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updateAvatar = () => {
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async (response) => {
            const update = {
                photoURL: response
            };           
            await firebase.auth().currentUser.updateProfile(update);
            setloading(false);
   
        }).catch(() => {
            toastRef.current.show("Error al trata de actualizar imagen"); 
        })
    }
    return (
        <View style={styles.viewUserInfor}>
        <Avatar
            rounded
            size="xlarge"            
            onEditPress = {changeAvatar}
            source = { photoURL ? { uri: photoURL } : require('../../../assets/img/avatar-default.jpg') }
            containerStyle = {styles.userInfoAvatar}
            editButton= {{ 
                type: 'material-community', 
                name: 'pencil', 
                color: '#fff', 
                underlayColor: '#000' 
            }}
            showEditButton
        />
            <View>
            <Button
                title="Cambiar Imagen"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnPrimary}
                onPress={changeAvatar}
            />   
                <Text style={styles.displayName}>
                        {displayName ? displayName: "Anónimo"}
                </Text>
                <Text>
                        {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfor: {
        alignItems:"center",
        justifyContent: "center",
        flexDirection:"row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar:{
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    btnContainer:{
        marginTop: 20,
        width: "95%"
    },
    btnPrimary:{
        backgroundColor: "#00a680"
    },
})
