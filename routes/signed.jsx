import React,{useContext} from "react";
import { View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from "@rneui/themed";
import ChatPrivado from "../src/Pages/Privado/index";
import ChatGrupo from "../src/Pages/Grupo/index";
import Atendimento from "../src/Pages/Atendimento/index";
import Profissional from "../src/Pages/Profissional";
import ChatComponent from "../src/Chat";
import Contatos from "../src/Contatos";
import PrivadoList from "../src/Contatos/Privado";
import Transferir from "../src/Chat/MessageScreen/transferirAtt";
import { UserContext } from "../context/UserProvider";

const AuthStack = createNativeStackNavigator();

export default function Signed() {
    const {deslogar} = useContext(UserContext);

    const renderLogout = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => deslogar()}>
                    <Icon name="log-out-outline" type="ionicon" size={25} color={"#FFF"} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Chat Privado" component={ChatPrivado} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerRight: () => renderLogout()
            }} />
            <AuthStack.Screen name="Chat Grupo" component={ChatGrupo} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerRight: () => renderLogout()
            }} />
            <AuthStack.Screen name="Atendimento" component={Atendimento} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerRight: () => renderLogout()
            }} />
            <AuthStack.Screen name="Profissional" component={Profissional} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerRight: () => renderLogout()
            }} />
            <AuthStack.Screen name="Chat" component={ChatComponent} options={{
                headerBackVisible: true,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }} />
            <AuthStack.Screen name="Contatos" component={Contatos} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }} />
            <AuthStack.Screen name="PrivadoList" component={PrivadoList} options={{
                headerBackVisible: false,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }} />
            <AuthStack.Screen name="Transferir Atendimento" component={Transferir} options={{
                headerBackVisible: true,
                headerStyle: {
                    backgroundColor: '#142a4c',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerRight: () => renderLogout()
            }} />
            
        </AuthStack.Navigator>

    );
}

