import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements'
import * as firebase from "firebase"

import { validateEmail } from "../../utils/validations"
import { reuthenticate } from "../../utils/api"

export default function ChangeEmailForm(props) {
    const { password, setshowModal, toastRef ,setReloadUserInfo } = props
    const [formData, setformData] = useState(defaultValue())
    const [showPassword, setshowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setisLoading] = useState(false)

    const onChange = (e, type) => {
        setformData({...formData, [type]: e.nativeEvent.text})
    }
    const onSubmit = () => {
        setErrors({})
        if(!formData.email || email === formData.email){
            setErrors({ 
                email:"Email no ah cambiado",
            })
        }else if(!validateEmail(formData.email)){
            setErrors({ 
                email:"Email incorrecto",
            })
        
        }else if(!formData.password){
            setErrors({ 
                password:"Contraseña no debe ser vacía",
            })
        }else{
            setisLoading(true);
            reuthenticate(formData.password)
            .then(() => {
                firebase.auth()
                .currentUser.updateEmail(formData.email)
                .then(() => {
                    setisLoading(false);
                    setReloadUserInfo(true);
                    setshowModal(false);
                    toastRef.current.show("Email actualizado correctamente");
                }).catch(() => {
                    setErrors("Error al actualizar email :'(")
                    setisLoading(false)
                })
            }).catch(error => {
                setisLoading(true);
                setErrors({ 
                    password:"Contraseña invalida",
                })
            })
        }
    }
    return (
        <View style={styles.view}>
           <Input placeholder="Correo Electronico"
           containerStyle={styles.input}
           defaultValue= {email || "vacio"}
           rightIcon={{
               type:"material-community",
               name: "at",
               color: "#c2c2c2"
           }}
           onChange={(e) => onChange(e, "email")}
           errorMessage={errors.email}
           /><Input
                placeholder="Confirmar con sus contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setshowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
           />
           <Button
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
           />
        </View>
    )
}

function defaultValue(){
    return {
        email: "",
        password: "",
    }
}
const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
    input:{
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})