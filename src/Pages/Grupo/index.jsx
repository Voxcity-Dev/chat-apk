import React from 'react'
import { StyleSheet, View, Text} from 'react-native';
import NavigationBar from '../navBar';
import Contatos from '../../Contatos/index';

export default function ChatGrupo() {


  return (
    <View style={styles.container}>

      <Contatos tipo="grupo" style={{width:"100%"}}/>

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

