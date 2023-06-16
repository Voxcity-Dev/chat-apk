import React,{useState} from 'react'
import { StyleSheet, View, Text} from 'react-native';
import NavigationBar from '../navBar';
import Contatos from '../../Contatos/index';

export default function ChatGrupo() {

  const [view, setView] = useState("lista")

  const views = {
    lista:   <Contatos tipo="grupo"/>,
    // chat: <Chat/>
}


  return (
    <View style={styles.container}>
      {views[view]}
      <NavigationBar currentPage='Chat Grupo'/>
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

