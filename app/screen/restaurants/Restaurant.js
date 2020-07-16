import React, { useState, useCallback } from 'react'
import { StyleSheet, ScrollView, Dimensions, View, Text } from 'react-native'
import { Rating } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'

import Loading from '../../Components/Loading'
import Carousel from '../../Components/Carousel'
import Maps from '../../Components/Maps'
import ListReviews from '../../Components/Restaurants/ListReviews'

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get("window").width

export default function Restaurant(props) {
    const {navigation, route } = props
    const { id, name } = route.params

    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)

    navigation.setOptions({title: name})

    useFocusEffect(
        useCallback(() => {
          db.collection("restaurants")
            .doc(id)
            .get()
            .then((response) => {
              const data = response.data();
              data.id = response.id;
              setRestaurant(data);
              setRating(data.rating);
            });
        }, [])
      );

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;
    return (
        <ScrollView vertical style={styles.viewBody}>
            <Carousel
                arrayImages= {restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.descriptions}
                rating={rating}
            />
            <RestaurantInfo 
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}

            />
        </ScrollView>
    )
}

function TitleRestaurant(props){
    const { name, description, rating } = props
    return (
        <View style={styles.viewRestauTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaura}>{name}</Text>
                <Rating 
                    style={styles.ratingS}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.desceRest}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props){
    const { location, name } = props
    return (
        <View style={styles.resInfoView}>
            <Text style={styles.resInfoTitle}>
                Infromación sobre el restaurante
            </Text>
            <Maps location={location} name={name} height={100}/>
        </View>
    )
}
const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestauTitle: {
        padding: 15,
    },
    nameRestaura: {
        fontSize: 20,
        fontWeight: "bold"
    },
    desceRest: {
        marginTop: 5,
        color: "grey",
    },
    ratingS: {
        position: "absolute",
        right: 0
    },
    resInfoView: {
        margin: 15,
        marginTop: 25
    },
    resInfoTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
})
