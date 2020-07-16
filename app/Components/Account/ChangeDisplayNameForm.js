import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements'
import * as firebase from "firebase"


export default function ChangeDisplayNameForm(props) {
    const {displayName, setshowModal, toastRef, setReloadUserInfo} = props
    const [newDiplayName, setnewDiplayName] = useState(null)

    const [error, setError] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const onSubmit = () => {
        // console.log(newDiplayName)
        setError(null)
        if(!newDiplayName){
            setError("El nombre no puede estar vacio")
        }else if(displayName === newDiplayName){
            setError("El nombre no puede ser igual al actual")
        }else {
            setisLoading(true)
            const update = {
                displayName : newDiplayName
            }
            firebase
            .auth()
            .currentUser.updateProfile(update)
            .then(() => {
                setisLoading(false)
                setReloadUserInfo(true)
                setshowModal(false)
            }).catch(() => {
                setError("Error al actualizar nombre")
                setisLoading(false)
            })
        }
    }
    return (
        <View style={styles.view}>
            <Input
                placeholder="Nonbre y apellidos"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
                defaultValue={displayName || ""}
                onChange={(e) => setnewDiplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.container}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    container: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
