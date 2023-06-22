import React ,{ useContext, useState }from 'react'
import { UserContext } from '../../../context/UserProvider';
import { StyleSheet, View } from 'react-native';
import NavigationBar from '../navBar';
import { ContactContext } from '../../../context/ContacProvider';
import Contatos from '../../Contatos/index';
import ChatComponent from '../../Chat/index';

export default function ChatPrivado() {
    const { selectedContact } = useContext(ContactContext);
    const {Deslogar} = useContext(UserContext);
    const [view, setView] = useState("lista")
    
    const views = {
      lista:   <Contatos tipo="privado"/>,
      chat: <ChatComponent tipo="privado" style={styles.container}/>,
    }

  return (
    <View style={styles.container}>
      {selectedContact ? views.chat : views.lista}
      
      {!selectedContact ? <NavigationBar currentPage='Chat Privado'/> : null}
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
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

