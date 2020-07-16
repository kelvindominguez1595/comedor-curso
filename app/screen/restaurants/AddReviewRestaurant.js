import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import Loading from '../../Components/Loading'

import firebaseApp from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export default function AddReviewRestaurant(props) {
    const {navigation, route } = props
    const {idRestaurant} = route.params

    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [review, setReview] = useState("")
    const [isLoading, setisLoading] = useState(false)
    const toastRef = useRef();

    const addReview = () => { 
        if(!rating){
            toastRef.current.show("Es obligatorio el rating")
        }else if(!title){
            toastRef.current.show("el titulo es obligatorio")
        }else if(!review){
            toastRef.current.show("el comentario es obligatorio")
        }else{
            setisLoading(true);
            const user = firebase.auth().currentUser;
            const paylod = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            }

            db.collection("review")
            .add(paylod)
            .then(() => {
                updateResta()
            }).catch(() => {
                toastRef.current.show("Error comentario")
                setisLoading(false)
            })
        }
    }

    const updateResta = () => {
        const resturantRef = db.collection("restaurants").doc(idRestaurant)

        resturantRef.get().then((response) => {
            const restaurantData = response.data()
            const ratingRTotal = restaurantData.ratingTotal + rating
            const quantityVotation = restaurantData.quantityVoting + 1
            const ratingResult = ratingRTotal / quantityVotation

            resturantRef
            .update({
                rating: ratingResult,
                ratingTotal: ratingRTotal,
                quantityVoting: quantityVotation,
            }).then(()=> {
                setisLoading(false)
                navigation.goBack();
            })
        })
    }
    return (
        <View style={styles.voew}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => {
                        setRating(value);
                      }}
                />
            </View>
            <View style={styles.formReviwe}>
                <Input 
                    placeholder="Titulo"
                    containerStyle={styles.inut}
                    onChange={(e) => setTitle(e.nativeEvent.text) }
                />
                <Input 
                    placeholder="Comentario..."
                    multiline={true}
                    containerStyle={styles.textAre}
                    onChange={(e) => setReview(e.nativeEvent.text) }
                />
                <Button title={"Enviar comentario"}
                containerStyle={styles.btnCon}                
                buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toastRef} position="center" opcity={0.9}/>
            <Loading isVisible={isLoading} text="Enviando comentario" />
        </View>
    )
}

const styles = StyleSheet.create({
    voew:{
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReviwe: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    inut:{
        marginBottom: 10
    },
    textAre: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnCon:{
        flex: 1,
        justifyContent: "flex-end",
        marginTop:20,
        marginBottom:10,
        width: "95%"
    },
    btn:{
        backgroundColor: "#00a680"
    }
})
