import React, { useState, useRef } from 'react'
import { Text, View } from 'react-native'
import Toast from "react-native-easy-toast"
import Loading from '../../Components/Loading'

import AddRestaurantsForms from '../../Components/Restaurants/AddRestaurantsForms'

export default function AddRestaurants(props) {
    const { navigation } = props
    const [isLoading, setisLoading] = useState(false)
    const toastRef = useRef()
    return (
        <View>
            <AddRestaurantsForms
                toastRef={toastRef}
                setisLoading={setisLoading}
                navigation={navigation}
            />
            <Toast
                ref={toastRef} position="center" opacity={0.9}
            />
            <Loading
                isVisible={isLoading} text="Creando restaurante"
            />
        </View>
    )
}

