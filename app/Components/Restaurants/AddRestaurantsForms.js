import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import { map, size, filter, result } from "lodash"
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import uuid from "random-uuid-v4"
import Modal from '../Modal'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/firestore'
const db = firebase.firestore(firebaseApp) // iniciamos conexion a bd GOOGLE

const widtScreen = Dimensions.get("window").width

export default function AddRestaurantsForms(props) {
    const {toastRef, setisLoading, navigation} = props
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [descriptions, setDescriptions] = useState("")
    const [imagesSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)
    
    const addResturant = () => {
        if(!name || !address || !descriptions){
            toastRef.current.show("Todos los campos son obligatorios");
        }else if(size(imagesSelected) === 0){
            toastRef.current.show("El restaurante debe tener almenos una foto")
        }else if(!locationRestaurant){
            toastRef.current.show("Localizar el restaurante")
        }else{
            setisLoading(true)
            uploadImageStorage().then(response => {
                db.collection("restaurants")
                .add({
                    name: name,
                    address: address,
                    descriptions: descriptions,
                    location: locationRestaurant,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebase.auth().currentUser.uid,
                })
                .then(() => {
                    setisLoading(false)
                   navigation.navigate("restaurants")
                })
                .catch((error) => {
                    console.log("error "+error)
                    setisLoading(false)
                    toastRef.current.show("Error al agregar el resutaruante")
                })
            })
        }
    }

    const uploadImageStorage = async () => {
        const imagenBlob = [];
        await Promise.all(
            map(imagesSelected, async (imageUri, index)=> {
                const response = await fetch(imageUri)
                const blob = await response.blob();
                const ref = firebase.storage().ref('restaurants-images').child(uuid())
                await ref.put(blob).then(async(result) => {
                    await firebase
                    .storage()
                    .ref(`restaurants-images/${result.metadata.name}`)
                    .getDownloadURL()
                    .then(photoUrl => {
                        imagenBlob.push(photoUrl)
                    })
                })
            })
        )
        return imagenBlob
    }
    return (
        <ScrollView style={styles.scrollview}>
            <ImgRestaurant imagenRestaurante={imagesSelected[0]}/>
            <FormAdd 
                setName={setName}
                setAddress={setAddress}
                setDescriptions={setDescriptions}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                toastRef={toastRef} 
                imagesSelected={imagesSelected}
                setImageSelected={setImageSelected}
                />
            <Button
                title="Save Restaurante"
                onPress={addResturant}
                buttonStyle={styles.btnAddRestaurants}
            />
            <Map 
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function ImgRestaurant(props){
    const { imagenRestaurante } = props
    return (
        <View style={styles.viewFoto}>
            <Image
            source= { imagenRestaurante 
                        ? {uri: imagenRestaurante} 
                        : require("../../../assets/img/no-image.png") 
                    }
                style={{ width: widtScreen, height: 200}}
            />
        </View>
    )
}
function FormAdd(props){
    const { setName, setAddress, setDescriptions, setIsVisibleMap, locationRestaurant } = props
    return(
        <View style={styles.viewform}>
            <Input
                placeholder="Name of restaurant"
                containerStyle={styles.input}
                onChange={(e) => setName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Address"
                containerStyle={styles.input}
                onChange={(e) => setAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Descriptions"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setDescriptions(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props){
    const { isVisibleMap, setIsVisibleMap,setLocationRestaurant, toastRef } = props
    const [location, setLocation] = useState(null)
    useEffect(() => {
        (async ()=>{
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            )
            const statusPermissions = resultPermissions.permissions.location.status
            if(statusPermissions !== "granted"){
                toastRef.current.show("No ha aceptado permisos de ubicación", 3000)
            }else{
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                })
            }
        })()
    }, [])
    const confirmLocation = () => {
        setLocationRestaurant(location)
        toastRef.current.show("localizacion guardado")
        setIsVisibleMap(false)
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapsStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                        <Button
                            title="Guardar Ubicación"
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                            onPress={confirmLocation}
                        />
                        <Button
                            title="Cancelar Ubicación"
                            containerStyle={styles.viewMapBtnContainerCancel}
                            buttonStyle={styles.viewMapBtnCancel}
                            onPress={ () => setIsVisibleMap(false)}
                        />
                </View>
            </View>
        </Modal>
    )
}


function UploadImage(props){
    const {toastRef, imagesSelected, setImageSelected} = props
    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        )
        if(resultPermissions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galería", 3000)
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado la galeria", 2000)
            }else{
                setImageSelected([...imagesSelected, result.uri])
            }
        }
    }
    const removeImagen = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿Esta seguro de borrar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )                       
                    }
                }
            ],
            {cancelable: false}
        )
    }
    return (
        <View style={styles.viewImage}>
            {size(imagesSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.contianerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imagesSelected, (imageRestaurant, index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImagen(imageRestaurant)}
                />
            ))}
        </View>
    )
}


const styles = StyleSheet.create({
    scrollview: {
        height: "100%",
    },
    viewform: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea:{
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddRestaurants: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    contianerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewFoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapsStyle:{
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel:{
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})
