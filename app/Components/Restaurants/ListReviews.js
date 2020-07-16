import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from 'react-native-elements'

import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)

export default function ListReviews(props) {
    const { navigation, idRestaurant } = props
    const [userLogged, setUserLogged] = useState(false)

        firebase.auth().onAuthStateChanged((user) => {
            user ? setUserLogged(true) : setUserLogged(false)
        })
    return (
        <View>
            {userLogged ? (
                <Button 
                    title = "Escribe una opinión"
                    buttonStyle={styles.btnAdd}
                    titleStyle={styles.btnTitleStyle}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680",
                    }}
                    onPress={() => 
                        navigation.navigate("reviewrestaurant", {
                            idRestaurant: idRestaurant 
                        })
                    }
                />
            ): (
                <View>
                    <Text
                        style={{ textAlign: "center", color: "#00a680", padding: 20}}
                        onPress={() => navigation.navigate("login")}
                    >
                        Debes ser usuario para dar tu opinión
                        <Text style={{ fontWeight: "bold"}}>
                            Pulsa aquí para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnAdd: {
        backgroundColor: "transparent",
    },
    btnTitleStyle:{
        color: "#00a680",
    }
})
