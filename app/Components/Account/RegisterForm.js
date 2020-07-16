import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import { validateEmail } from "../../utils/validations";
import { size, isEmpty, constant } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

import Loadig from "../../Components/Loading";

export default function RegisterForm(props) {
    const { toatRef } = props
    const [showPassword, setShowPassword ] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setformData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onSubmit = () => {
        if(
            isEmpty(formData.email)|| 
            isEmpty(formData.password) || 
            isEmpty(formData.repeatpassword)) {
                // console.log("Todos los campos son obligatorios");
                toatRef.current.show("Todos los campos son obligatorios");
            }else if(!validateEmail(formData.email)){  
                toatRef.current.show("Debe ser un correo valido");           
            }else if(formData.password !== formData.repeatpassword){
                toatRef.current.show("Las contraseñas deben ser iguales");
            }else if(size(formData.password) < 6){
                toatRef.current.show("Contraseña mínimo 6 caracteres");
            }else{
                setLoading(true);
                  firebase
                  .auth()
                  .createUserWithEmailAndPassword(formData.email, formData.password)
                  .then((response) => {
                      setLoading(false);
                      navigation.navigate("account");
                    })
                    .catch((err) => {
                        setLoading(false);
                        toastRef.current.show("!El email ya esta en uso¡");
                  })
            }
        // console.log(formData);
        // validateEmail(formData.email);
    }
    const onChange = (e, type) => {
        // para obtener todos los datos por medio de objeto
        setformData({ ...formData, [type] : e.nativeEvent.text });
    }
    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon 
                        type="material-community" 
                        name="at"
                        iconStyle={styles.iconRight}
                        />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type="material-community" 
                        name={showPassword ? "eye-off-outline": "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Repita la contraseña"
                containerStyle={styles.inputForm}
                password={true}
                onChange={(e) => onChange(e, "repeatpassword")}
                secureTextEntry={showRepeatPassword ? false : true}
                rightIcon={
                    <Icon 
                        type="material-community" 
                        name={showRepeatPassword ? "eye-off-outline": "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnUnirse}
                buttonStyle={styles.btnregister}
                onPress={onSubmit}
            />
            <Loadig isVisible={loading} text="Creando cuenta" />
        </View>
    )
}

function defaultFormValue(){
    return{
        email: "",
        password: "",
        repeatpassword: "",
    }
}
const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnUnirse:{
        marginTop: 20,
        width: "95%",
    },
    btnregister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    }
})
