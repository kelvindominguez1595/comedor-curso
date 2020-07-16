import React from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity 
} from 'react-native'
import { Image } from 'react-native-elements'
import { size } from 'lodash'
import {useNavigation} from '@react-navigation/native'

export default function ListRestaurants(props) {
    const {restaurants, handleLoadMore, isLoading} = props
    const navigation = useNavigation()

    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant restaurant={restaurant} navigation={navigation} />
                    )}
                    keyExtractor={ (item, index) => index.toString() }
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ): (
                <View style={styles.loaderRestaurant}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant(props){
    const {restaurant, navigation} = props
    const { id, images, name, address, descriptions } = restaurant.item
    const ImageResturant = images ? images[0] : null;

    const goRestaurant = () => {
        navigation.navigate("restaurant-details", {
            id: id,
            name: name
        })
    }

    return (
        <TouchableOpacity onPress={goRestaurant} >
           <View style={styles.viewRest}>
                <View style={styles.viewImagRes}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        source={
                            ImageResturant 
                            ? {uri: ImageResturant}
                            : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageRestPost}
                    />
                </View>
                <View>
                    <Text style={styles.nameRest}> {name} </Text>
                    <Text style={styles.addressRest}> {address} </Text>
                    <Text style={styles.descroptRest}> 
                        {descriptions.substr(0,60)}... 
                    </Text>
                </View>
           </View>
        </TouchableOpacity>
    )
}

function FooterList(props){
    const { isLoading } = props
    if(isLoading){
        return (
            <View style={styles.loaderRestaurant}>
                <ActivityIndicator size="large" />
            </View>
        )
    }else{
        return (
            <View style={styles.noFound}>
                <Text>No quedan restaurants</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loaderRestaurant:{
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewRest: {
        flexDirection: "row",
        margin: 10
    },
    viewImagRes: {
        marginRight: 15
    },
    imageRestPost:{
        width: 80,
        height: 80,
    },
    nameRest: {
        fontWeight: "bold"
    },
    addressRest: {
        paddingTop: 2,
        color: 'grey'
    },
    descroptRest: {
        paddingTop: 2,
        color: "grey",
        width: 300,
    },
    noFound: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center"
    }
})
