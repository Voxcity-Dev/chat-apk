import React ,{ useContext, useState,useEffect, useRef  }from 'react'
import { StyleSheet, View ,Platform} from 'react-native';
import NavigationBar from '../navBar';
import { ContactContext } from '../../../context/ContacProvider';
import Contatos from '../../Contatos/index';
import ChatComponent from '../../Chat/index';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import apiUser from '../../../apiUser';
import { Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ChatPrivado() {
    const { selectedContact } = useContext(ContactContext);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const ShowAlert = (title, message) => {
      Alert.alert(
          title,
          message,
          [
              { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
      );
    };


    useEffect(() => {
      const registerAndInsertToken = async () => {
        try {
          const token = await registerForPushNotificationsAsync();
          console.log(token,"token de notificação");
          insertExpoToken(token);
          setExpoPushToken(token);
        } catch (error) {
          console.log(error);
        }
      };
    
      registerAndInsertToken();
    
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
        setNotification(notification);
      });
    
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
    
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
    
    function insertExpoToken(token) {
      apiUser
        .post('/notifications/registerExpoToken', { token })
        .then(response => {
          if (response.data.error) {
            Alert.alert('Erro', response.data.error);
          } else {
            console.log(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    const views = {
      lista:   <Contatos tipo="private"/>,
      chat: <ChatComponent tipo="private" style={styles.container}/>,
    }

  return (
    <View style={styles.container}>
      {selectedContact ? views.chat : views.lista}
      {!selectedContact ? <NavigationBar currentPage='Chat Privado'/> : null}

    </View>

  )
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      icon: 'ic_launcher',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações push!');
      return;
    }
    if(finalStatus === 'granted'){
      token = (await Notifications.getDevicePushTokenAsync()).data;
    }
  } else {
    alert('Deve usar um dispositivo físico para testar notificações push!');
  }

  return token;
}

const styles = StyleSheet.create({
    container: {
        height:"100%",
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        color: '#FFF',
        gap:20,
    },  
    btnSair:{
        width:"95%",
        height:40,
        color:"#FFF",
        backgroundColor:"#142a4c",
        padding:10,
        alignItems:"center",
        marginTop:10,
    },
  });

