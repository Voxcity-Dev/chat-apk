import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatPrivado from "../src/Pages/Privado/index";
import ChatGrupo from "../src/Pages/Grupo/index";
import Atendimento from "../src/Pages/Atendimento/index";
import Profissional from "../src/Pages/Profissional";
import ChatComponent from "../src/Chat";
import Contatos from "../src/Contatos";
import PrivadoList from "../src/Contatos/Privado";

const AuthStack = createNativeStackNavigator();

export default function Signed() {
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
                }
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
                }
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
                }
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
                }
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
            
        </AuthStack.Navigator>

    );
}

