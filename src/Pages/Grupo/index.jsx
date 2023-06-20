import React,{useState,useContext} from 'react'
import { StyleSheet, View, Text} from 'react-native';
import NavigationBar from '../navBar';
import Contatos from '../../Contatos/index';
import ChatComponent from '../../Chat/index';
import { GroupContext } from '../../../context/GroupProvider';

export default function ChatGrupo() {
  const { selectedGroup } = useContext(GroupContext);
  const [view, setView] = useState("lista")

  const views = {
    lista:   <Contatos tipo="grupo"/>,
    chat: <ChatComponent tipo="grupo" style={styles.container}/>,
  }


  return (
    <View style={styles.container}>
      {selectedGroup ? views.chat : views.lista}
      
      {
        !selectedGroup ? <NavigationBar currentPage='Chat Grupo'/> : null
      }
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

