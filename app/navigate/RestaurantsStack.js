import React from 'react'
import { createStackNavigator} from "@react-navigation/stack";

import Restaurants from "../screen/restaurants/Restaurants";
import AddRestaurants from '../screen/restaurants/AddRestaurants'
import Restaurant from '../screen/restaurants/Restaurant'
import AddReviewRestaurant from '../screen/restaurants/AddReviewRestaurant'
const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurants"}}
            />
            <Stack.Screen  
                name="add-restaurants"
                component={AddRestaurants}
                options={{ title: "Add new restaurants"}}
            />
            <Stack.Screen  
                name="restaurant-details"
                component={Restaurant}
                options={{ title: "Details restaurants"}}
            />
            <Stack.Screen  
                name="reviewrestaurant"
                component={AddReviewRestaurant}
                options={{ title: "Nuevo comentario"}}
            />
        </Stack.Navigator> 
    )
}