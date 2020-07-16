import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { isEmpty } from "lodash";
import { useNavigation } from '@react-navigation/native';
import * as firebase from "firebase";
import { validateEmail } from "../../utils/validations";

import Loadig from "../../Components/Loading";
export default function LoginForms(props) {
    const { toastRef } = props;
    const [Paswoord, setPaswoord] = useState(false)
    const [formData, setformData] = useState(defaultForm());
    const [ loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const onSubmit = () => {
       if(isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Campos obligatorios");
       }else if(!validateEmail(formData.email)){
            toastRef.current.show("Correo no valido");
       }else{
            setLoading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then((response)=> {
                setLoading(false);
                navigation.navigate("account");
            }).catch((err) => {
                setLoading(false);
                toastRef.current.show("Email o Contraseña incorrecta ");
            });
       }     
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
                rightIcon= {
                    <Icon 
                        type="material-community" 
                        name="at" 
                        iconStyle={styles.iconsStyle} 
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={Paswoord ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon= {
                    <Icon
                        type="material-community"
                        name={Paswoord ? "eye-off-outline": "eye-outline"}
                        iconStyle={styles.iconsStyle}
                        onPress={() => setPaswoord(!Paswoord) }
                    />
                }
            />
            <Button
                title="Iniciar sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnPrimary}
                onPress={onSubmit}
            />
                     <Loadig isVisible={loading} text="Espere..." />
        </View>
    )
}

function defaultForm(){
    return{
        email: "",
        password: "",
    }
}
const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 20,
    },
    btnContainer:{
        marginTop: 20,
        width: "95%"
    },
    btnPrimary:{
        backgroundColor: "#00a680"
    },
    iconsStyle:{
        color: "#c1c1c1",
    },
})
