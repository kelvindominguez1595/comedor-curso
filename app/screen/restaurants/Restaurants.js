import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import "firebase/firestore"
import ListRestaurants from '../../Components/Restaurants/ListRestaurants'

const db = firebase.firestore(firebaseApp)

export default function Restaurants(props) {
    const { navigation } = props
    const [user, setUser] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [startRestaurant, setstartRestaurant] = useState(null)
    const [totalRest, settotalRest] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const limitRestaurante = 10;

    useEffect(() => {
       firebase.auth().onAuthStateChanged((userInfo) => {
           setUser(userInfo)
       })
    }, [])

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
            .get()
            .then((snap) => {
                settotalRest(snap.size)
            })

            const resultRestaurant = []

            db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurante)
            .get()
            .then((response) => {
                setstartRestaurant(response.docs[response.docs.length - 1])

                response.forEach((doc) => {
                    // console.log(doc.data)
                    const restaurant = doc.data()
                    restaurant.id = doc.id
                    resultRestaurant.push(restaurant)
                })
                setRestaurants(resultRestaurant)
            })
        }, [])
    )

    const handleLoadMore = () => {
        const resultRest = [];
        restaurants.length < totalRest && setIsLoading(true)

        db.collection("restaurants")
        .orderBy("createAt", "desc")
        .startAfter(startRestaurant.data().createAt)
        .limit(limitRestaurante)
        .get()
        .then((response) => {
            if(response.docs.length > 0){
                setstartRestaurant(response.docs[response.docs.length - 1])
            }else{
                setIsLoading(false)
            }
            response.forEach((doc) => {
                const restaurant = doc.data();
                restaurant.id = doc.id
                resultRest.push(restaurant)
            })
            setRestaurants([...restaurants, ...resultRest])
        })
    }
    return (
        <View style={styles.viewBody}>
           <ListRestaurants 
            restaurants={restaurants}
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
           />
           {user && (
               <Icon
                   reverse
                   type="material-community"
                   name="plus"
                   color= "#00a680"
                   containerStyle={styles.btnCon}
                   onPress={() => navigation.navigate("add-restaurants")}
               />
           )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnCon: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {width: 2, height: 2 },
        shadowOpacity: 0.5,
    }
})
