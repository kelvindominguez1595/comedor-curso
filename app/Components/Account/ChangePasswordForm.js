import React, { useState } from 'react'
import { StyleSheet, View,Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { size } from 'lodash'

import { reuthenticate } from "../../utils/api"

export default function ChangePasswordForm(props) {
    const { email, setshowModal,toastRef } = props
    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState(defaultFom())
    const [errors, setErrors] = useState({})
    const [isLoading, setisLoading] = useState(false)

    const onChange = (e, type) => {
        setformData({...formData, [type]: e.nativeEvent.text});
    }
    const onSubmit = async () => {
        let isSetErrors = true;
        let errorTemp = {};
        setErrors({});
        if(
            !formData.password || 
            !formData.newPassword || 
            !formData.repeatPassword
            ){
                errorTemp = {
                    password: !formData.password ? "Campo obligatorio" : "",
                    newPassword: !formData.newPassword ? "Campo obligatorio" : "",
                    repeatPassword: !formData.repeatPassword ? "Campo obligatorio" : ""
                }
        }else if(formData.newPassword !== formData.repeatPassword){
            errorTemp = {
                newPassword: "Las contraseñas no coinciden",
                repeatPassword: "Las contraseñas no coinciden",
            }
        }else if(size(formData.newPassword) < 6){
            errorTemp = {
                newPassword: "La contraseña debe ser mayor a 5 caracteres",
                repeatPassword: "La contraseña debe ser mayor a 5 caracteres"
            }
        }else{
            setisLoading(true);
           await reuthenticate(formData.password)
            .then(async () => {
               await firebase
               .auth()
               .currentUser.updatePassword(formData.newPassword)
               .then(async () => {
                    isSetErrors = false;
                    setisLoading(false);
                    setshowModal(false);
                    firebase.auth().signOut();
                }).catch(()=>{
                    setisLoading(false);
                    errorTemp = {
                        other: "La contraseña no es correcta"
                    }
                })
            })
            .catch(() => {
                setisLoading(false);
                errorTemp = {
                    password: "La contraseña no es correcta"
                }
            })
        }
        isSetErrors && setErrors(errorTemp)
    }
    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña Actual"
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
            <Input
                placeholder="Contraseña nueva"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setshowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setshowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "repeatPassword")}
                errorMessage={errors.repeatPassword}
            />
            <Button
                title="Cambiar Contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}
function defaultFom(){
    return {
        password: "",
        newPassword: "",
        repeatPassword: "",
    }
}
const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    }, 
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
