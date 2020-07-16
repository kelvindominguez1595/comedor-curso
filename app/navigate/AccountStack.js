import React from 'react'
import { createStackNavigator} from "@react-navigation/stack";

import Accounts from "../screen/account/Account";
import Login from "../screen/account/Login";
import Register from "../screen/account/Register";
// import Logged from "../screen/account/UserLogged";

const Stack = createStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="account"
                component={Accounts}
                options={{ title: "Data Users"}}
            />
            <Stack.Screen
                name = "login"
                component = {Login}
                options={{ title: "Iniciar Sesión"}}
            />
            <Stack.Screen
                name ="register"
                component = {Register}
                options={{ title: "Registrarse"}}
            />
        </Stack.Navigator> 
    )
}