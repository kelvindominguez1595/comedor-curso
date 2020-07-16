import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { ListItem } from "react-native-elements";
import { map } from "lodash";

import Modal from "../Modal"
import ChangeDisplayNameForm from "../Account/ChangeDisplayNameForm"
import ChangeEmailForm from "../Account/ChangeEmailForm"
import ChangePasswordForm from "../Account/ChangePasswordForm"

export default function AccountOption(props) {
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setshowModal] = useState(false)
    const [renderComponent, setrenderComponent] = useState(null)
    const selectComponent = (key) => {
       switch(key){
           case "displayName":
            setrenderComponent(<ChangeDisplayNameForm 
                    displayName={userInfo.displayName}
                    setshowModal={setshowModal}
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo} />)  
            setshowModal(true);  
           break;
           case "email":
            setrenderComponent(<ChangeEmailForm 
                email={userInfo.email}
                setshowModal={setshowModal}
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo} />)  
            setshowModal(true);  
           break;
           case "password":
            setrenderComponent(<ChangePasswordForm
                password={userInfo.password}
                setshowModal={setshowModal}
                toastRef={toastRef}
            />)  
            setshowModal(true);  
           break;
           case "":
               break;
           default:
               setrenderComponent
               break;
       }
    }
    const menuOption = generateOptions(selectComponent);
    return (
        <View>
            {map(menuOption, (menu, i) => (   
          
                <ListItem
                    key={i}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,  
                    }}
                    onPress={menu.onPress}
                    bottomDivider
                />
         ))}
         {renderComponent && (
            <Modal isVisible={showModal} setIsVisible={setshowModal}>
                    {renderComponent}
            </Modal>
         )}
        </View>
    )
}

function generateOptions(selectComponent) {
    return [
        {
            title: "Cambiar nombre",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("displayName")
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("email")
        },
        {
            title: "cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("password")
        }
    ]
}

const styles = StyleSheet.create({
})
