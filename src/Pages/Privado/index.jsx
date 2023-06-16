import React ,{ useContext }from 'react';
import { UserContext } from '../../../context/UserProvider';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import NavigationBar from '../navBar';
import Contatos from '../../Contatos/index';

export default function ChatPrivado() {
    const {Deslogar} = useContext(UserContext);

  return (
    <View style={styles.container}>

      <Contatos tipo="privado" style={{width:"100%"}}/>

      <TouchableOpacity style={styles.btnSair} onPress={Deslogar}>
          <Text style={{color:"#FFF"}}>Sair</Text>
      </TouchableOpacity>

      <NavigationBar currentPage='Chat Privado'/>

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

